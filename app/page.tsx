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
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successData, setSuccessData] = useState<any>(null);

  const tierPrice = 1;
  const tierName = "Botmartz Platform & AI Engineering Access Pass";

  // Countdown Timer State
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Target: September 9, 2026, 19:00:00 IST
    const targetDate = new Date("2026-09-09T19:00:00+05:30").getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      
      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

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

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-slate-200 font-sans flex flex-col md:flex-row">
      
      {/* ── LEFT SIDE: THE PAMPHLET CONTENT ── */}
      <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 max-w-xl mx-auto md:mx-0 text-center md:text-left">
          
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white italic tracking-wide">THINK AGAIN.</h2>
              <h1 className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 tracking-tight mb-2 uppercase">
                BUILD <br/> BETTER.
              </h1>
              <p className="text-lg text-slate-300 font-medium">Real Skills. Real Projects. <span className="text-purple-400">Real Impact.</span></p>
            </div>
            
            <div className="flex flex-col items-center justify-center p-3 bg-slate-900/60 border border-slate-700/50 rounded-2xl shrink-0 ml-4 hidden md:flex">
              <p className="text-slate-300 font-bold mb-2 text-[10px] tracking-widest text-center uppercase">Join WhatsApp</p>
              <img src="/qr_code_community.jpeg" alt="Community QR Code" className="w-24 h-24 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.2)] border border-slate-600 object-cover" />
            </div>
          </div>
          {/* Mobile QR */}
          <div className="flex md:hidden flex-col items-center justify-center p-4 bg-slate-900/60 border border-slate-700/50 rounded-2xl w-full mb-6">
            <p className="text-slate-300 font-bold mb-3 text-xs tracking-widest text-center uppercase">Join WhatsApp Community</p>
            <img src="/qr_code_community.jpeg" alt="Community QR Code" className="w-32 h-32 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.2)] border border-slate-600 object-cover" />
          </div>
          
          {/* Instructor Image & Info */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-slate-800">
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-[4px] border-blue-500/80 shadow-[0_0_25px_rgba(59,130,246,0.4)] bg-gradient-to-b from-slate-700 to-slate-900 shrink-0 relative flex items-center justify-center">
              <Image 
                src="/soham_transparent.png" 
                alt="Soham Sharma" 
                fill
                className="object-cover object-top"
                quality={100}
                priority
                unoptimized
              />
            </div>
            <div className="text-center md:text-left pt-2 md:pt-4">
              <p className="text-slate-400 text-sm font-semibold tracking-widest uppercase mb-1">Hands-On Session By</p>
              <h3 className="text-3xl font-black text-orange-400 mb-2">SOHAM SHARMA</h3>
              <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                Founder @ Botmartz AI Solutions Pvt Ltd |<br/>
                Owner @ Botmartz Community |<br/>
                Lead Trainer @ Botmartz Academy<br/>
                Trained 5000+ Students & Professionals in AI
              </p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-center">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-white">5000+</span>
                  <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Students<br/>Trained</span>
                </div>
                <div className="w-px h-8 bg-slate-700"></div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-white">10+</span>
                  <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Years<br/>Experience</span>
                </div>
                <div className="w-px h-8 bg-slate-700"></div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-white">500+</span>
                  <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider">Projects<br/>Delivered</span>
                </div>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-center">
            <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">For Only</span>
              <div className="text-3xl font-black text-white">RS. <span className="text-orange-400">1</span>/-</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Date</span>
              <div className="text-2xl font-black text-blue-400">9/9/26</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Time</span>
              <div className="text-lg font-bold text-purple-400 whitespace-nowrap">7:00 PM -<br/>8:30 PM</div>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-4 flex items-center justify-center gap-3 mb-8">
            <Zap className="text-blue-400" size={24} />
            <div className="text-blue-100 font-bold">
              ON <span className="text-blue-400">ZOOM MEETINGS</span> (LIVE & INTERACTIVE)
            </div>
          </div>

          {/* Perks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-semibold text-slate-300">
            <div className="flex items-center gap-3">
              <div className="text-green-400"><CheckCircle2 size={20} /></div>
              <span>DURATION: 90 MINS</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-green-400"><CheckCircle2 size={20} /></div>
              <span>EXPERT GUIDANCE: LEARN. BUILD. GROW.</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-green-400"><CheckCircle2 size={20} /></div>
              <span>LIVE Q&A SESSION</span>
            </div>
          </div>

          <div className="mt-8 text-center text-sm font-black tracking-[0.2em] text-slate-500">
            LEARN. BUILD. IMPACT.
          </div>

        </div>
      </div>

      {/* ── RIGHT SIDE: THE FORM & CHECKOUT ── */}
      <div className="w-full md:w-1/2 p-6 md:p-12 lg:p-20 bg-white flex flex-col justify-center relative shadow-2xl z-20 overflow-y-auto">
        
        <div className="max-w-md mx-auto w-full">
          {/* Logo and Name on the white side */}
          <div className="flex flex-row items-center justify-center mb-10 gap-4 md:gap-6">
            <img src="/logo.png" alt="Botmartz Logo" className="h-20 md:h-28 object-contain shrink-0" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-tight text-left">
              Botmartz<br/><span className="text-[#0066FF]">Community</span>
            </h1>
          </div>

          {/* Countdown Timer */}
          <div className="mb-8">
            <div className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
              Registration Closes In
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="flex flex-col items-center bg-slate-900 text-white rounded-lg p-2 min-w-[60px] shadow-md">
                <span className="text-xl font-black">{timeLeft.days}</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400">Days</span>
              </div>
              <span className="text-slate-300 font-bold">:</span>
              <div className="flex flex-col items-center bg-slate-900 text-white rounded-lg p-2 min-w-[60px] shadow-md">
                <span className="text-xl font-black">{timeLeft.hours}</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400">Hours</span>
              </div>
              <span className="text-slate-300 font-bold">:</span>
              <div className="flex flex-col items-center bg-slate-900 text-white rounded-lg p-2 min-w-[60px] shadow-md">
                <span className="text-xl font-black">{timeLeft.minutes}</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400">Mins</span>
              </div>
              <span className="text-slate-300 font-bold">:</span>
              <div className="flex flex-col items-center bg-slate-900 text-white rounded-lg p-2 min-w-[60px] shadow-md">
                <span className="text-xl font-black">{timeLeft.seconds}</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400">Secs</span>
              </div>
            </div>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 font-sans tracking-tight mb-2">
              Secure Your Spot
            </h2>
            <p className="text-slate-500 text-sm font-mono">
              Fill in your details below. Complete the <strong>₹1</strong> registration to get the workshop link and unlock community access.
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

              <div className="mt-8 text-center bg-emerald-50/5 border-2 border-emerald-500/30 rounded-xl p-6 shadow-sm">
                <h4 className="text-lg font-extrabold text-slate-200 mb-2">Step 2: Join the WhatsApp Community</h4>
                <p className="text-sm text-slate-400 mb-6 font-sans">
                  All workshop announcements, resources, and the meeting link will be shared here. Scan or click the image below to join!
                </p>
                <div className="flex justify-center">
                  <a href="https://chat.whatsapp.com/DkzKwpjuktaCYAofOtMlAQ" target="_blank" rel="noopener noreferrer">
                    <img src="/Untitled.jpeg" alt="Join WhatsApp Community" className="w-56 md:w-64 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] border-2 border-emerald-500/50 hover:scale-105 transition-transform duration-300 cursor-pointer" />
                  </a>
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

              {/* RAZORPAY CHECKOUT */}
              <div className="pt-4 border-t border-slate-100">
                <label className="block text-xs font-mono text-slate-500 uppercase font-bold mb-3">
                  Secure Payment (₹{tierPrice})
                </label>

                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-mono text-xs flex items-center gap-2 mb-4">
                    <AlertCircle size={15} className="shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

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
                    <span>256-bit Encrypted Checkout via Razorpay</span>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
