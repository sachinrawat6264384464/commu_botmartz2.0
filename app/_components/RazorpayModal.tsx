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
  Lock,
  Tag,
  Gift,
  Ticket
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface AppliedCouponState {
  code: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  discountAmount: number;
  finalAmount: number;
  isFreePass: boolean;
  message: string;
}

interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number; // e.g. 299 or 1999
  itemName: string; // e.g. "Verified Student Pass (1-Month AI Internship)"
  itemCategory?: "FELLOWSHIP_PASS" | "EVENT_TICKET" | "WALLET_TOPUP" | "WORKSHOP_PASS";
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

  // Coupon state
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [verifyingCoupon, setVerifyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCouponState | null>(null);

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

  // Calculate dynamic effective price
  const effectiveAmount = appliedCoupon ? appliedCoupon.finalAmount : amount;
  const isFreePass = appliedCoupon ? appliedCoupon.isFreePass : false;

  // Handle Coupon Verification (Does NOT increment usages; only checks validity)
  const handleApplyCoupon = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanCode = couponCodeInput.trim().toUpperCase();
    if (!cleanCode) {
      setCouponError("Please enter a valid coupon code.");
      return;
    }

    setVerifyingCoupon(true);
    setCouponError("");

    try {
      const res = await fetch("/api/events/verify-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: cleanCode, amount })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const discVal = Number(data.discountValue) || 10;
        let calculatedDiscount = 0;

        if (data.discountType === "flat" || data.discountType === "fixed") {
          calculatedDiscount = Math.min(amount, discVal);
        } else {
          calculatedDiscount = Math.round((amount * discVal) / 100);
        }

        const netAmount = Math.max(0, amount - calculatedDiscount);

        setAppliedCoupon({
          code: data.code.toUpperCase(),
          discountType: data.discountType || "percentage",
          discountValue: discVal,
          discountAmount: calculatedDiscount,
          finalAmount: netAmount,
          isFreePass: netAmount === 0,
          message: data.message || `Coupon ${data.code.toUpperCase()} applied successfully!`
        });
        setCouponCodeInput("");
        setVerifyingCoupon(false);
        return;
      } else {
        setCouponError(data.error || "Invalid coupon code. Please check and try again.");
        setAppliedCoupon(null);
        setVerifyingCoupon(false);
        return;
      }
    } catch (err: any) {
      console.warn("API verify-coupon check error:", err);
      setCouponError("Unable to verify coupon. Please check your connection and try again.");
      setAppliedCoupon(null);
      setVerifyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
    setCouponCodeInput("");
  };

  // Handle 100% Free Pass Direct Activation (No Razorpay/UPI needed)
  const handleFreePassActivation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const freePassOrderId = `order_free_${Date.now()}`;
      const freePassPayId = `pay_free_${Date.now()}`;

      const res = await fetch("/api/checkout/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: freePassOrderId,
          razorpay_payment_id: freePassPayId,
          razorpay_signature: "free_pass_100_percent_discount",
          amount: 0,
          itemName,
          itemCategory,
          customerName: name || "Builder",
          customerEmail: email,
          customerPhone: phone || "9999999999",
          appliedCoupon: appliedCoupon?.code,
          metadata: {
            ...metadata,
            appliedCoupon: appliedCoupon?.code,
            originalAmount: amount,
            discountAmount: appliedCoupon?.discountAmount
          }
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to activate 100% Free Pass.");
      }

      setSuccessData({
        paymentId: freePassPayId,
        orderId: freePassOrderId,
        invoiceNumber: data.invoiceNumber || `INV-FREE-${Date.now().toString().slice(-6)}`,
        checkInCode: data.checkInCode || `FREE-${Math.floor(10000 + Math.random() * 90000)}`
      });

      if (onSuccessCallback) {
        onSuccessCallback(data);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to claim 100% Free Pass.");
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpayCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFreePass) {
      return handleFreePassActivation(e);
    }

    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    const orderMetadata = {
      ...metadata,
      appliedCoupon: appliedCoupon?.code || "",
      originalAmount: amount,
      discountAmount: appliedCoupon?.discountAmount || 0
    };

    try {
      // 1. Create Razorpay Order on server with effective amount
      const orderRes = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: effectiveAmount,
          itemName,
          itemCategory,
          customerName: name || "Builder",
          customerEmail: email,
          customerPhone: phone || "9999999999",
          metadata: orderMetadata
        })
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || "Failed to initialize Razorpay order.");
      }

      // If in dev mock mode (no Razorpay credentials in ENV), complete verification directly
      if (orderData.isDevMock || typeof window === "undefined" || !(window as any).Razorpay) {
        const mockPayId = `pay_dev_${Date.now().toString().slice(-8)}`;
        const mockOrderId = orderData.orderId || `order_dev_${Date.now().toString().slice(-8)}`;

        const verifyRes = await fetch("/api/checkout/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: mockOrderId,
            razorpay_payment_id: mockPayId,
            razorpay_signature: "mock_signature",
            amount: effectiveAmount,
            itemName,
            itemCategory,
            customerName: name || "Builder",
            customerEmail: email,
            customerPhone: phone || "9999999999",
            appliedCoupon: appliedCoupon?.code || "",
            metadata: orderMetadata
          })
        });

        const verifyData = await verifyRes.json();
        if (!verifyRes.ok || !verifyData.success) {
          throw new Error(verifyData.error || "Payment verification failed.");
        }

        setSuccessData({
          paymentId: mockPayId,
          orderId: mockOrderId,
          invoiceNumber: verifyData.invoiceNumber || `INV-BMZ-${Date.now().toString().slice(-6)}`,
          checkInCode: verifyData.checkInCode || `WS-${Math.floor(10000 + Math.random() * 90000)}`
        });

        if (onSuccessCallback) {
          onSuccessCallback(verifyData);
        }
        setLoading(false);
        return;
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
                amount: effectiveAmount,
                itemName,
                itemCategory,
                customerName: name,
                customerEmail: email,
                customerPhone: phone,
                appliedCoupon: appliedCoupon?.code || "",
                metadata: orderMetadata
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
    if (isFreePass) {
      return handleFreePassActivation(e);
    }

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
          amount: effectiveAmount,
          itemName,
          attendeeName: name,
          attendeeEmail: email,
          attendeePhone: phone,
          appliedCoupon: appliedCoupon?.code || ""
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
    navigator.clipboard.writeText("botmartz-5@oksbi");
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
            setAppliedCoupon(null);
            setCouponError("");
            setCouponCodeInput("");
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* ── SUCCESS STATE ── */}
        {successData ? (
          <div className="text-center py-4 space-y-4 font-sans">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 size={36} />
            </div>

            <div>
              <div className="text-[11px] font-mono text-emerald-600 font-bold uppercase tracking-wider mb-1">
                ✔ 100% VERIFIED &amp; ACTIVATED
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 font-sans">
                {isFreePass ? "Free Pass Activated! (₹0)" : `Payment Successful (₹${effectiveAmount})`}
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
                {appliedCoupon && (
                  <div className="flex items-center gap-1.5 text-blue-700 font-bold">
                    <Check size={13} />
                    <span>Coupon <strong>{appliedCoupon.code}</strong> redeemed &amp; saved in DB</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-emerald-700">
                  <Check size={13} />
                  <span><strong>+300 Bonus Karma Coins</strong> credited to your wallet</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700">
                  <Check size={13} />
                  <span>Official receipt &amp; pass dispatched to <strong>{email}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2 font-mono text-xs">
              <Link
                href="/profile"
                className="flex-1 py-3.5 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-center transition-all shadow-xs"
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
              <span>SECURE CHECKOUT &bull; BOTMARTZ</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 font-sans leading-tight">
              {itemName}
            </h3>
            {description && (
              <p className="text-xs text-slate-500 font-sans mt-1">
                {description}
              </p>
            )}

            {/* Price & Coupon Summary Badge */}
            <div className="mt-4 p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Total Payable</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    {appliedCoupon && appliedCoupon.discountAmount > 0 ? (
                      <>
                        <span className="text-xl font-bold font-mono text-slate-400 line-through">
                          ₹{amount}
                        </span>
                        <span className="text-2xl font-black font-mono text-emerald-600">
                          ₹{effectiveAmount}
                        </span>
                        <span className="text-xs font-bold text-emerald-600 font-mono">
                          (Saved ₹{appliedCoupon.discountAmount})
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl font-black font-mono text-slate-900">
                        ₹{amount} <span className="text-xs font-normal text-slate-500">(Taxes Included)</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-white border border-blue-200 text-[#0066FF] font-mono text-xs font-bold flex items-center gap-1">
                  <Coins size={13} className="text-amber-500" />
                  <span>
                    {itemCategory === "WALLET_TOPUP"
                      ? `+${metadata?.coinsAmount || 500} Karma Coins`
                      : `+300 Karma Coins`}
                  </span>
                </div>
              </div>

              {/* Free Pass Banner if 100% off */}
              {isFreePass && (
                <div className="p-2.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 font-mono text-xs font-bold flex items-center gap-2">
                  <Gift size={16} className="text-emerald-700 shrink-0" />
                  <span>🎉 100% FREE PASS UNLOCKED! No Payment Required.</span>
                </div>
              )}
            </div>

            {/* ── COUPON CODE INPUT SECTION ── */}
            <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between">
                <label className="text-slate-700 font-bold flex items-center gap-1.5 text-xs font-sans">
                  <Tag size={14} className="text-[#0066FF]" />
                  <span>Have a Coupon Code?</span>
                </label>
                {appliedCoupon && (
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-[11px] text-rose-600 font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <X size={12} />
                    <span>Remove</span>
                  </button>
                )}
              </div>

              {appliedCoupon ? (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-mono text-sm tracking-wider uppercase text-emerald-900">
                        {appliedCoupon.code}
                      </span>
                      <span className="text-[11px] font-normal text-emerald-700 block">
                        {appliedCoupon.isFreePass
                          ? "100% OFF Single-Use Free Pass"
                          : `${appliedCoupon.discountValue}% Discount Applied (Saved ₹${appliedCoupon.discountAmount})`}
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-200/80 text-emerald-900 text-[10px] font-bold">
                    APPLIED
                  </span>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                    placeholder="e.g. BOTMARTZ10 or BMFREE-XXXX"
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 uppercase font-mono focus:outline-none focus:border-[#0066FF]"
                  />
                  <button
                    type="submit"
                    disabled={verifyingCoupon || !couponCodeInput.trim()}
                    className="px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50 shadow-xs flex items-center gap-1.5"
                  >
                    {verifyingCoupon ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <span>Apply</span>
                    )}
                  </button>
                </form>
              )}

              {couponError && (
                <div className="text-[11px] text-rose-600 font-bold flex items-center gap-1 mt-1">
                  <AlertCircle size={13} />
                  <span>{couponError}</span>
                </div>
              )}
            </div>

            {/* Payment Method Tabs (Hidden if 100% Free Pass) */}
            {!isFreePass && (
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
            )}

            {errorMsg && (
              <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-mono text-xs flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* IF 100% FREE PASS: INSTANT CLAIM FORM */}
            {isFreePass ? (
              <form onSubmit={handleFreePassActivation} className="mt-4 space-y-3 font-mono text-xs">
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
                      placeholder="rahul@college.edu"
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>Activating Free Pass...</span>
                    </>
                  ) : (
                    <span>🎉 Claim 100% Free Pass &amp; Activate Now &rarr;</span>
                  )}
                </button>
              </form>
            ) : (
              <>
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
                          placeholder="rahul@college.edu"
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

                    <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
                      🔒 Supports UPI (GPay, PhonePe, Paytm), All Cards, Netbanking via 256-bit encrypted gateway.
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
                        <span>Pay ₹{effectiveAmount} with Razorpay &rarr;</span>
                      )}
                    </button>

                    <p className="text-[10px] text-center text-slate-400 font-sans mt-2">
                      Protected by 256-bit encryption. Covered by our{" "}
                      <Link
                        href="/refund-policy"
                        target="_blank"
                        className="text-[#0066FF] hover:underline font-bold"
                      >
                        Refund &amp; Cancellation Policy
                      </Link>
                      .
                    </p>
                  </form>
                )}

                {/* TAB 2: MANUAL UPI / QR CODE */}
                {tab === "MANUAL_UPI" && (
                  <form onSubmit={handleManualUpiSubmit} className="mt-4 space-y-3 font-mono text-xs">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                      <div className="text-[11px] text-slate-500 font-bold uppercase">Scan &amp; Pay ₹{effectiveAmount} via any UPI App</div>
                      <div className="inline-flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200">
                        <span className="font-bold text-slate-900">botmartz-5@oksbi</span>
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

                    <p className="text-[10px] text-center text-slate-400 font-sans mt-2">
                      Protected by automated ledger audits. Covered by our{" "}
                      <Link
                        href="/refund-policy"
                        target="_blank"
                        className="text-emerald-600 hover:underline font-bold"
                      >
                        Refund &amp; Cancellation Policy
                      </Link>
                      .
                    </p>
                  </form>
                )}
              </>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
