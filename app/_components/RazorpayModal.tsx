"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  X,
  Loader2,
  CreditCard,
  QrCode,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  Coins,
  Lock
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number; // e.g. 299 or 1999
  itemName: string; // e.g. "Verified Student Pass (1-Month AI Internship)"
  itemCategory?: "FELLOWSHIP_PASS" | "EVENT_TICKET" | "WALLET_TOPUP";
  description?: string;
  metadata?: Record<string, any>;
  onSuccessCallback?: (paymentData: any) => void;
}

export default function RazorpayModal({
  isOpen,
  onClose,
  amount,
  itemName,
  itemCategory = "FELLOWSHIP_PASS",
  description,
  metadata = {},
  onSuccessCallback
}: RazorpayModalProps) {
  const { user, studentProfile } = useAuth();

  const [tab, setTab] = useState<"RAZORPAY" | "MANUAL_UPI">("RAZORPAY");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successData, setSuccessData] = useState<any>(null);

  // Form details
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [utrNumber, setUtrNumber] = useState("");
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Pre-fill user data
  useEffect(() => {
    if (studentProfile || user) {
      setName(studentProfile?.displayName || user?.displayName || "");
      setEmail(studentProfile?.email || user?.email || "");
      setPhone(studentProfile?.phoneNumber || "");
    }
  }, [studentProfile, user]);

  // Dynamically load Razorpay SDK
  useEffect(() => {
    if (isOpen && typeof window !== "undefined" && !(window as any).Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRazorpayCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      // 1. Create Razorpay Order on server
      const orderRes = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          itemName,
          itemCategory,
          customerName: name || "Builder",
          customerEmail: email,
          customerPhone: phone || "9999999999",
          metadata
        })
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || "Failed to initialize Razorpay order.");
      }

      // Check if Razorpay script is ready
      if (typeof window === "undefined" || !(window as any).Razorpay) {
        throw new Error("Razorpay SDK is loading. Please try again in 3 seconds.");
      }

      // 2. Open Razorpay Checkout modal
      const options = {
        key: orderData.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Botmartz",
        description: itemName,
        image: "/logo.png",
        order_id: orderData.orderId,
        prefill: {
          name: name || user?.displayName || "Builder",
          email: email || user?.email || "",
          contact: phone || "",
        },
        theme: {
          color: "#0066FF",
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          }
        },
        handler: async function (response: any) {
          try {
            // 3. Verify Payment on server
            const verifyRes = await fetch("/api/checkout/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount,
                itemName,
                itemCategory,
                customerName: name,
                customerEmail: email,
                customerPhone: phone,
                metadata
              })
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || "Payment signature verification failed.");
            }

            setSuccessData({
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              invoiceNumber: verifyData.invoiceNumber,
              checkInCode: verifyData.checkInCode
            });

            if (onSuccessCallback) {
              onSuccessCallback(verifyData);
            }
          } catch (verErr: any) {
            setErrorMsg(verErr.message || "Failed to complete payment verification.");
          } finally {
            setLoading(false);
          }
        }
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.on("payment.failed", function (response: any) {
        setErrorMsg(`Payment Failed: ${response.error?.description || "Transaction declined by bank."}`);
        setLoading(false);
      });

      razorpayInstance.open();
    } catch (err: any) {
      setErrorMsg(err.message || "Unable to launch Razorpay checkout.");
      setLoading(false);
    }
  };

  const handleManualUpiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber || utrNumber.length < 8) {
      setErrorMsg("Please enter a valid 12-digit UPI / Bank Transaction UTR reference.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/events/verify-utr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          utrNumber: utrNumber.trim(),
          amount,
          itemName,
          attendeeName: name,
          attendeeEmail: email,
          attendeePhone: phone
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit UTR reference.");
      }

      setSuccessData({
        paymentId: `UTR_${utrNumber}`,
        orderId: `MANUAL_${Date.now()}`,
        invoiceNumber: `INV-UPI-${Date.now().toString().slice(-4)}`
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit manual UPI verification.");
    } finally {
      setLoading(false);
    }
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText("botmartz@axl");
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 my-8 relative text-slate-900 font-sans">
        
        {/* Close Button */}
        <button
          onClick={() => {
            setErrorMsg("");
            setSuccessData(null);
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* ── SUCCESS STATE ── */}
        {successData ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 size={36} />
            </div>

            <div>
              <div className="text-[11px] font-mono text-emerald-600 font-bold uppercase tracking-wider mb-1">
                ✔ 100% VERIFIED &amp; ACTIVATED
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 font-sans">
                Payment Successful (₹{amount})
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-1">
                Invoice: <strong>{successData.invoiceNumber}</strong> &bull; Payment ID: {successData.paymentId}
              </p>
            </div>

            {/* Perks Activated Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left font-mono text-xs space-y-2">
              <div className="text-slate-700 font-bold flex items-center gap-1.5 font-sans text-xs">
                <Sparkles size={14} className="text-[#0066FF]" />
                <span>Activated Pass Features:</span>
              </div>
              <div className="space-y-1.5 text-slate-600 text-[11px]">
                <div className="flex items-center gap-1.5 text-emerald-700">
                  <Check size={13} />
                  <span><strong>{itemName}</strong> enrolled &amp; registered</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700">
                  <Check size={13} />
                  <span><strong>+300 Bonus Karma Coins</strong> credited to your wallet</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700">
                  <Check size={13} />
                  <span>Official receipt &amp; checklist dispatched to <strong>{email}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2 font-mono text-xs">
              <Link
                href="/profile"
                className="flex-1 py-3 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-center transition-all shadow-xs"
              >
                Go to Profile Workspace &rarr;
              </Link>
            </div>
          </div>
        ) : (
          /* ── CHECKOUT FORM ── */
          <div>
            {/* Header */}
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0066FF] uppercase mb-1">
              <ShieldCheck size={15} className="text-emerald-600" />
              <span>SECURE CHECKOUT &bull; RAZORPAY</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 font-sans leading-tight">
              {itemName}
            </h3>
            {description && (
              <p className="text-xs text-slate-500 font-sans mt-1">
                {description}
              </p>
            )}

            {/* Price Badge */}
            <div className="mt-4 p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Total Payable</span>
                <div className="text-2xl font-black font-mono text-slate-900">
                  ₹{amount} <span className="text-xs font-normal text-slate-500">(All Taxes Included)</span>
                </div>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-white border border-blue-200 text-[#0066FF] font-mono text-xs font-bold flex items-center gap-1">
                <Coins size={13} className="text-amber-500" />
                <span>+300 Karma Reward</span>
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-2 gap-2 mt-4 p-1 bg-slate-100 rounded-xl font-mono text-xs">
              <button
                type="button"
                onClick={() => setTab("RAZORPAY")}
                className={`py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  tab === "RAZORPAY"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <CreditCard size={13} />
                <span>Razorpay (Instant)</span>
              </button>

              <button
                type="button"
                onClick={() => setTab("MANUAL_UPI")}
                className={`py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  tab === "MANUAL_UPI"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <QrCode size={13} />
                <span>Direct UPI / QR</span>
              </button>
            </div>

            {errorMsg && (
              <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-mono text-xs flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* TAB 1: RAZORPAY FORM */}
            {tab === "RAZORPAY" && (
              <form onSubmit={handleRazorpayCheckout} className="mt-4 space-y-3 font-mono text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@college.edu"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">WhatsApp / Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 font-sans">
                  🔒 Supports UPI (GPay, PhonePe, Paytm), All Debit/Credit Cards, Netbanking, and Wallets via 256-bit encrypted Razorpay gateway.
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold uppercase tracking-wider transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>Connecting to Razorpay...</span>
                    </>
                  ) : (
                    <span>Pay ₹{amount} with Razorpay &rarr;</span>
                  )}
                </button>
              </form>
            )}

            {/* TAB 2: MANUAL UPI / QR CODE */}
            {tab === "MANUAL_UPI" && (
              <form onSubmit={handleManualUpiSubmit} className="mt-4 space-y-3 font-mono text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                  <div className="text-[11px] text-slate-500 font-bold uppercase">Scan &amp; Pay ₹{amount} via any UPI App</div>
                  <div className="inline-flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200">
                    <span className="font-bold text-slate-900">botmartz@axl</span>
                    <button
                      type="button"
                      onClick={copyUpiId}
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
                    >
                      {copiedUpi ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans">
                    Pay using GPay, PhonePe, Paytm, or BHIM. Enter your 12-digit UTR below for instant auto-verification.
                  </p>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">12-Digit UPI UTR / Ref Number *</label>
                  <input
                    type="text"
                    required
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    placeholder="e.g. 423910482910"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Your Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@college.edu"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>Verifying UTR...</span>
                    </>
                  ) : (
                    <span>Verify UTR &amp; Activate Pass &rarr;</span>
                  )}
                </button>
              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
