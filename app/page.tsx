"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  Loader2,
  Copy,
  Check,
  CreditCard,
  QrCode,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function SingleLandingPage() {
  const { user, studentProfile } = useAuth();

  // Workshop Registration State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Intermediate (Python / APIs)");

  // Payment UI State
  const [paymentMethod, setPaymentMethod] = useState<"RAZORPAY" | "MANUAL_UPI">("RAZORPAY");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successData, setSuccessData] = useState<any>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [utrNumber, setUtrNumber] = useState("");

  const tierPrice = 9;
  const tierName = "Botmartz Platform & AI Engineering Access Pass";

  // Auto-fill if user is logged in
  useEffect(() => {
    if (studentProfile || user) {
      if (!name) setName(studentProfile?.displayName || user?.displayName || "");
      if (!email) setEmail(studentProfile?.email || user?.email || "");
      if (!phone) setPhone(studentProfile?.phoneNumber || "");
      if (!college) setCollege(studentProfile?.collegeName || "");
    }
  }, [studentProfile, user]);

  // Dynamically load Razorpay SDK
  useEffect(() => {
    if (typeof window !== "undefined" && !(window as any).Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleRazorpaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (!name.trim()) {
      setErrorMsg("Please enter your full name.");
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
          amount: tierPrice,
          itemName: tierName,
          itemCategory: "PLATFORM_ACCESS",
          customerName: name,
          customerEmail: email,
          customerPhone: phone || "9999999999",
          metadata: {
            college,
            experienceLevel,
            tier: "STANDARD",
          }
        })
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || "Failed to initialize Razorpay checkout order.");
      }

      if (typeof window === "undefined" || !(window as any).Razorpay) {
        throw new Error("Razorpay SDK is initializing. Please try again in 2 seconds.");
      }

      // 2. Launch Razorpay UI
      const options = {
        key: orderData.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Botmartz",
        description: tierName,
        image: "/logo.png",
        order_id: orderData.orderId,
        prefill: {
          name,
          email,
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
            // 3. Verify Payment and store all details
            const verifyRes = await fetch("/api/checkout/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: tierPrice,
                itemName: tierName,
                itemCategory: "PLATFORM_ACCESS",
                customerName: name,
                customerEmail: email,
                customerPhone: phone,
                metadata: {
                  college,
                  experienceLevel,
                  tier: "STANDARD",
                }
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
          } catch (verErr: any) {
            setErrorMsg(verErr.message || "Failed to complete payment verification.");
          } finally {
            setLoading(false);
          }
        }
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.on("payment.failed", function (resp: any) {
        setErrorMsg(`Payment Failed: ${resp.error?.description || "Transaction declined by bank."}`);
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
      const res = await fetch("/api/workshops/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          collegeOrCompany: college,
          experienceLevel,
          track: tierName,
          amount: tierPrice,
          paymentId: `UTR_${utrNumber.trim()}`,
          orderId: `MANUAL_${Date.now()}`
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit UTR reference.");
      }

      setSuccessData({
        paymentId: `UTR_${utrNumber.trim()}`,
        orderId: `MANUAL_${Date.now()}`,
        invoiceNumber: data.invoiceNumber,
        checkInCode: data.checkInCode
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
    <div className="min-h-screen bg-[#0A0F1C] text-slate-200 font-sans flex flex-col md:flex-row">
      
      {/* ── LEFT SIDE: THE PITCH & THE FEAR ── */}
      <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 max-w-lg mx-auto md:mx-0 text-center md:text-left">
          
          {/* Logo & Instructor Image */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10">
            <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-xl bg-slate-800 shrink-0 relative">
              <Image 
                src="/my_image.png" 
                alt="Soham Sharma - Lead AI Engineer" 
                fill
                className="object-cover"
              />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-white mb-1">Soham Sharma</h3>
              <p className="text-blue-400 font-mono text-sm uppercase font-semibold mb-3">Lead AI Engineer</p>
              <img src="/logo.png" alt="Botmartz Logo" className="h-8 mx-auto md:mx-0 object-contain" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-xs font-bold uppercase tracking-wider mb-6">
            <Zap size={14} className="text-red-400" />
            <span>Wake Up Call</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-6 font-sans leading-tight">
            AI is replacing average engineers. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
              Don't be left behind.
            </span>
          </h1>

          <p className="text-slate-400 text-base leading-relaxed font-mono mb-8">
            The tech industry is evolving faster than ever. If you aren't building production AI systems, you are becoming obsolete. 
            <br/><br/>
            We are launching the ultimate AI community and virtual internship platform to train the top 1% of AI engineers. Learn why AI is taking over, how our 45-day virtual internship works, and how to survive the incoming wave.
          </p>

          <div className="space-y-4 mb-8 font-mono text-sm">
            <div className="flex items-start gap-3">
              <CheckCircle2 size={18} className="text-blue-500 shrink-0 mt-0.5" />
              <span className="text-slate-300">Understand the exact blueprint of the AI Engineering landscape.</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 size={18} className="text-blue-500 shrink-0 mt-0.5" />
              <span className="text-slate-300">Get access to 50 production AI project blueprints and our private community.</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 size={18} className="text-blue-500 shrink-0 mt-0.5" />
              <span className="text-slate-300">Without this pass, you will not be granted access to the Botmartz Community platform.</span>
            </div>
          </div>

        </div>
      </div>

      {/* ── RIGHT SIDE: THE FORM & CHECKOUT ── */}
      <div className="w-full md:w-1/2 p-6 md:p-12 lg:p-20 bg-white flex flex-col justify-center relative shadow-2xl z-20">
        
        <div className="max-w-md mx-auto w-full">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 font-sans tracking-tight mb-2">
              Secure Your Access
            </h2>
            <p className="text-slate-500 text-sm font-mono">
              Fill in your details below. You must complete the <strong>₹{tierPrice}</strong> registration to unlock community access and platform onboarding instructions.
            </p>
          </div>

          {/* SUCCESS CONFIRMATION STATE */}
          {successData ? (
            <div className="text-center py-6 space-y-6">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={44} />
              </div>

              <div>
                <div className="text-xs font-mono text-emerald-600 font-bold uppercase tracking-wider mb-1">
                  ✔ ACCESS GRANTED
                </div>
                <h3 className="text-3xl font-extrabold text-slate-900 font-sans">
                  Welcome aboard, {name}!
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-2 leading-relaxed">
                  You are officially verified. Please check your email inbox for your official onboarding pass and instructions to access the Botmartz community.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 text-white font-mono text-xs border border-slate-800 text-left space-y-3 mt-4">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Payment Status:</span>
                  <span className="font-bold text-emerald-400">PAID (₹{tierPrice})</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Check-in Code:</span>
                  <span className="font-bold text-blue-400">{successData.checkInCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Invoice:</span>
                  <span className="font-bold">{successData.invoiceNumber}</span>
                </div>
              </div>
            </div>
          ) : (
            /* ACTIVE REGISTRATION FORM */
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 gap-4 font-mono text-sm">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Yash Patel"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yash@college.edu"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">WhatsApp / Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>

              {/* PAYMENT METHOD TABS */}
              <div className="pt-4 border-t border-slate-100">
                <label className="block text-xs font-mono text-slate-500 uppercase font-bold mb-3">
                  Secure Payment (₹{tierPrice})
                </label>

                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl font-mono text-xs mb-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("RAZORPAY")}
                    className={`py-2.5 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                      paymentMethod === "RAZORPAY"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    <CreditCard size={14} className="text-[#0066FF]" />
                    <span>Razorpay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("MANUAL_UPI")}
                    className={`py-2.5 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                      paymentMethod === "MANUAL_UPI"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    <QrCode size={14} className="text-emerald-600" />
                    <span>Direct UPI</span>
                  </button>
                </div>

                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-mono text-xs flex items-center gap-2 mb-4">
                    <AlertCircle size={15} className="shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* RAZORPAY SUBMIT FORM */}
                {paymentMethod === "RAZORPAY" && (
                  <form onSubmit={handleRazorpaySubmit}>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-sans text-sm font-bold uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <span>Pay ₹{tierPrice} &amp; Unlock Access</span>
                          <ArrowRight size={15} />
                        </>
                      )}
                    </button>
                    <div className="text-center mt-3 text-[10px] text-slate-400 flex items-center justify-center gap-1">
                      <ShieldCheck size={12} />
                      <span>256-bit Encrypted Checkout</span>
                    </div>
                  </form>
                )}

                {/* MANUAL UPI / QR SCAN */}
                {paymentMethod === "MANUAL_UPI" && (
                  <form onSubmit={handleManualUpiSubmit} className="space-y-4 font-mono text-sm">
                    <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-3">
                      <div className="text-[11px] text-slate-500 font-bold uppercase">
                        Scan &amp; Pay ₹{tierPrice} via any UPI App
                      </div>
                      
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-300 shadow-sm">
                        <span className="font-bold text-slate-900">botmartz-5@oksbi</span>
                        <button
                          type="button"
                          onClick={copyUpiId}
                          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500"
                        >
                          {copiedUpi ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">
                        12-Digit UPI UTR Reference *
                      </label>
                      <input
                        type="text"
                        required
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value)}
                        placeholder="e.g. 423910482910"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-sm font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <>
                          <span>Verify Payment &amp; Enter</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
