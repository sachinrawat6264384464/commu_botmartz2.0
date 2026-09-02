"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Award,
  Clock,
  Calendar,
  Sparkles,
  ArrowRight,
  Check,
  Code2,
  Cpu,
  Layers,
  Users,
  ChevronDown,
  ChevronUp,
  CreditCard,
  QrCode,
  Lock,
  ExternalLink,
  MapPin,
  Star,
  Activity,
  Coins,
  AlertCircle,
  Loader2,
  Copy,
  Zap
} from "lucide-react";
import RazorpayModal from "./_components/RazorpayModal";
import { useAuth } from "@/lib/auth-context";

export default function WorkshopFlagshipPage() {
  const { user, studentProfile } = useAuth();

  // Workshop Registration State
  const [selectedTier, setSelectedTier] = useState<"STANDARD" | "VIP">("STANDARD");
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

  // Countdown Timer targeting 9th September 2026, 9:00 PM IST
  const [timeLeft, setTimeLeft] = useState({
    days: 6,
    hours: 21,
    minutes: 45,
    seconds: 30
  });

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Auto-fill if user is logged in
  useEffect(() => {
    if (studentProfile || user) {
      if (!name) setName(studentProfile?.displayName || user?.displayName || "");
      if (!email) setEmail(studentProfile?.email || user?.email || "");
      if (!phone) setPhone(studentProfile?.phoneNumber || "");
      if (!college) setCollege(studentProfile?.collegeName || "");
    }
  }, [studentProfile, user]);

  // Real-time Countdown effect targeting 9th September 9:00 PM IST
  useEffect(() => {
    const targetDate = new Date("2026-09-09T21:00:00+05:30").getTime();
    const updateCountdown = () => {
      const now = Date.now();
      const diff = targetDate - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Dynamically load Razorpay SDK
  useEffect(() => {
    if (typeof window !== "undefined" && !(window as any).Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const tierPrices = {
    STANDARD: 9, // Flash Launch Price: ₹9
    VIP: 499
  };

  const tierNames = {
    STANDARD: "Flash AI Workshop Pass (9th Sept @ 9 PM Live)",
    VIP: "VIP Founder Placement Track (Workshop + Code Audit)"
  };

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

    const amount = tierPrices[selectedTier];
    const itemName = tierNames[selectedTier];

    try {
      // 1. Create Razorpay Order on server
      const orderRes = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          itemName,
          itemCategory: "WORKSHOP_PASS",
          customerName: name,
          customerEmail: email,
          customerPhone: phone || "9999999999",
          metadata: {
            college,
            experienceLevel,
            tier: selectedTier,
            liveDate: "9th September 2026, 9:00 PM IST"
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
        description: itemName,
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
                amount,
                itemName,
                itemCategory: "WORKSHOP_PASS",
                customerName: name,
                customerEmail: email,
                customerPhone: phone,
                metadata: {
                  college,
                  experienceLevel,
                  tier: selectedTier,
                  liveDate: "9th September 2026, 9:00 PM IST"
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
        setErrorMsg(`Payment Failed: ${resp.error?.description || "Transaction declined by issuing bank."}`);
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

    const amount = tierPrices[selectedTier];
    const itemName = tierNames[selectedTier];

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
          track: itemName,
          amount,
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

  const FAQS = [
    {
      q: "When does the live workshop start?",
      a: "The workshop kicks off live on 9th September at 9:00 PM IST. Registered attendees receive live meeting links, calendar invites, and starter code repositories via email."
    },
    {
      q: "What is included in the ₹9 Flash Launch Pass?",
      a: "The ₹9 pass gives you complete access to the live AI engineering masterclass, hands-on LangGraph multi-agent architecture demo, enterprise RAG walkthrough, official verifiable certificate, and +300 Karma Coins."
    },
    {
      q: "Will full session recordings & GitHub repositories be provided?",
      a: "Yes! All registered participants receive access to the session recordings, production boilerplate repositories, Python notebooks, and LangGraph multi-agent templates."
    },
    {
      q: "What are the technical prerequisites for this workshop?",
      a: "Basic Python programming skills and familiarity with standard web APIs. We provide step-by-step setup guides for PostgreSQL, Docker, and API keys prior to the live session."
    },
    {
      q: "How does the Cryptographic PDF Certificate verification work?",
      a: "Upon completing the hands-on lab, an official digital certificate with a verifiable QR code is issued directly from our Cloud Firestore ledger and can be authenticated anywhere on /certificates."
    },
    {
      q: "What payment methods are supported?",
      a: "We support all Indian payment methods through Razorpay: UPI (Google Pay, PhonePe, Paytm, BHIM), all major Credit/Debit Cards (Visa, Mastercard, RuPay), and Netbanking."
    }
  ];

  return (
    <div className="bg-[#FAFCFF] text-slate-900 font-sans">
      
      {/* ── TOP LIVE ANNOUNCEMENT TICKER ── */}
      <div className="bg-gradient-to-r from-blue-700 via-[#0066FF] to-blue-600 text-white font-mono text-xs py-2.5 px-4 text-center border-b border-blue-400/20 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-3 font-semibold">
          <span className="flex items-center gap-1.5 bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full text-[11px] font-black animate-pulse">
            ⚡ GOING LIVE 9TH SEPT @ 9:00 PM IST
          </span>
          <span>Special Flash Launch Pass: <strong>Only ₹9</strong> (Limited Seats Available)</span>
          <a
            href="#registration"
            className="underline underline-offset-2 hover:text-blue-100 font-bold ml-1 flex items-center gap-1"
          >
            <span>Claim Your ₹9 Pass &rarr;</span>
          </a>
        </div>
      </div>

      {/* ── 1. HERO SECTION: WORKSHOP SHOWCASE & VALUE PROPOSITION ── */}
      <section className="relative pt-16 pb-20 overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-blue-50/60 via-slate-50/20 to-[#FAFCFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            
            {/* Live Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#0066FF] font-mono text-xs font-bold uppercase tracking-wider mb-6 shadow-2xs">
              <Zap size={14} className="text-amber-500 fill-amber-500" />
              <span>Live on 9th Sept @ 9:00 PM IST &bull; Flash Pass ₹9</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-[clamp(36px,5.5vw,68px)] font-black tracking-tight leading-[1.08] text-slate-950 mb-6 font-sans">
              Master Production AI Agents &amp; <br />
              <span className="bg-gradient-to-r from-[#0066FF] via-[#0092D7] to-[#0284C7] bg-clip-text text-transparent">
                Enterprise RAG Systems
              </span>
            </h1>

            {/* Subhead */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed mb-8 font-mono text-xs sm:text-sm">
              Live engineering masterclass on <strong>9th September at 9:00 PM IST</strong>. Architect <strong>deterministic LangGraph multi-agent state machines</strong>, hybrid vector retrieval with <strong>OpenSearch &amp; Qdrant</strong>, and deploy production endpoints via <strong>FastAPI &amp; Docker</strong>.
            </p>

            {/* Live Countdown Clock */}
            <div className="w-full max-w-xl p-4 sm:p-5 rounded-3xl bg-white border-2 border-blue-500/30 shadow-xl mb-8 font-mono relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1 bg-amber-400 text-slate-950 text-[10px] font-bold uppercase rounded-bl-xl">
                9th Sept 9 PM Launch
              </div>

              <div className="text-[11px] text-slate-500 uppercase tracking-wider font-bold mb-3 flex items-center justify-center gap-1.5">
                <Clock size={13} className="text-amber-500" />
                <span>Live Kickoff Countdown</span>
              </div>
              <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5 sm:p-3">
                  <div className="text-2xl sm:text-3xl font-black text-slate-900">{timeLeft.days}</div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Days</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5 sm:p-3">
                  <div className="text-2xl sm:text-3xl font-black text-[#0066FF]">{timeLeft.hours}</div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Hours</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5 sm:p-3">
                  <div className="text-2xl sm:text-3xl font-black text-emerald-600">{timeLeft.minutes}</div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Mins</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5 sm:p-3">
                  <div className="text-2xl sm:text-3xl font-black text-amber-600">{timeLeft.seconds}</div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Secs</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto mb-10 font-mono text-xs">
              <a
                href="#registration"
                className="w-full sm:w-auto bg-[#0066FF] hover:bg-[#0052CC] text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-wider transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <span>Claim Flash Pass for ₹9</span>
                <ArrowRight size={16} />
              </a>
              
              <a
                href="#curriculum"
                className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 px-7 py-4 rounded-2xl font-bold uppercase tracking-wider transition-all shadow-2xs flex items-center justify-center gap-2"
              >
                <Code2 size={15} className="text-blue-600" />
                <span>Explore Curriculum</span>
              </a>
            </div>

            {/* Key Value Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl pt-6 border-t border-slate-200/80 font-mono text-xs text-left">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <div className="text-xl font-black text-slate-900">9th Sept 9 PM</div>
                <div className="text-[11px] text-slate-500">Live Online Session</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <div className="text-xl font-black text-[#0066FF]">₹9 Only</div>
                <div className="text-[11px] text-slate-500">Flash Launch Price</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <div className="text-xl font-black text-purple-700">QR Certificate</div>
                <div className="text-[11px] text-slate-500">Cryptographically Verified</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <div className="text-xl font-black text-emerald-700">4 Repositories</div>
                <div className="text-[11px] text-slate-500">Production Boilerplates</div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── 2. DETAILED CURRICULUM BREAKDOWN ── */}
      <section id="curriculum" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-bold uppercase tracking-wider mb-2">
              <Code2 size={13} /> Hands-on Architecture
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
              Live Workshop Curriculum
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm font-mono mt-2">
              Dedicated to live coding, agent state machines, and testing enterprise retrieval benchmarks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Part 1 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all">
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-[#0066FF] font-mono text-xs font-bold uppercase">
                  Part 1: Autonomous Agents
                </span>
                <span className="text-xs font-mono text-slate-500 font-bold">9th Sept @ 9:00 PM IST</span>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-3 font-sans">
                Agent State Machines &amp; Tool Calling
              </h3>
              <p className="text-xs font-mono text-slate-600 mb-6 leading-relaxed">
                Build resilient, loop-preventing agent state graphs that execute deterministic actions against databases and third-party APIs.
              </p>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">Module 1.1: State Graphs vs Loops in LangGraph</div>
                  <p className="text-[11px] text-slate-500">Designing state schemas, checkpointer persistence, and human-in-the-loop approvals.</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">Module 1.2: Pydantic Schema Validation &amp; Function Calling</div>
                  <p className="text-[11px] text-slate-500">Enforcing strict JSON outputs, preventing hallucinations, and self-healing schema retry loops.</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">Module 1.3: Safe PostgreSQL Tool Sandboxes</div>
                  <p className="text-[11px] text-slate-500">Injecting read-only database connections, transaction bounds, and WAF protection.</p>
                </div>
              </div>
            </div>

            {/* Part 2 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all">
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-mono text-xs font-bold uppercase">
                  Part 2: Enterprise RAG
                </span>
                <span className="text-xs font-mono text-slate-500 font-bold">9th Sept @ 10:00 PM IST</span>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-3 font-sans">
                Enterprise Hybrid RAG &amp; Cloud Deployment
              </h3>
              <p className="text-xs font-mono text-slate-600 mb-6 leading-relaxed">
                Build hybrid dense/sparse vector search with cross-encoders, layout-aware PDF parsers, and deploy to Docker with FastAPI.
              </p>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">Module 2.1: Layout-Aware Chunking over Complex Tables</div>
                  <p className="text-[11px] text-slate-500">Parsing multi-column financial PDFs, tabular citations, and contextual metadata tagging.</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">Module 2.2: Hybrid Retrieval (BM25 + Qdrant / OpenSearch)</div>
                  <p className="text-[11px] text-slate-500">Reciprocal Rank Fusion (RRF) and BGE Cross-Encoder re-ranking for 95%+ precision.</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">Module 2.3: Production FastAPI Packaging &amp; Docker</div>
                  <p className="text-[11px] text-slate-500">Asynchronous streaming responses, Redis semantic caching, and SLA healthchecks.</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── 3. EMBEDDED REGISTRATION & RAZORPAY PAYMENT MODULE (₹9 FLASH LAUNCH) ── */}
      <section id="registration" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200">
              <ShieldCheck size={14} /> Instant Seat Confirmation
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
              Register for the Workshop
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm font-mono mt-1">
              Select your pass, fill in your attendee details, and pay securely via Razorpay or direct UPI.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 font-sans relative overflow-hidden">
            
            {/* SUCCESS CONFIRMATION STATE */}
            {successData ? (
              <div className="text-center py-6 space-y-6">
                <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 size={44} />
                </div>

                <div>
                  <div className="text-xs font-mono text-emerald-600 font-bold uppercase tracking-wider mb-1">
                    ✔ 100% REGISTRATION &amp; PAYMENT VERIFIED
                  </div>
                  <h3 className="text-3xl font-extrabold text-slate-900 font-sans">
                    Welcome to the Workshop, {name}!
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mt-1">
                    Invoice: <strong>{successData.invoiceNumber}</strong> &bull; Payment ID: {successData.paymentId}
                  </p>
                </div>

                {/* Ticket Pass Display */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 text-white max-w-lg mx-auto text-left font-mono text-xs border border-slate-800 shadow-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="font-bold text-white text-sm font-sans">BOTMARTZ WORKSHOP PASS</div>
                    <span className="px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold">
                      9TH SEPT @ 9 PM
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <div>
                      <div className="text-slate-400">Attendee</div>
                      <div className="font-bold text-white">{name}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Track</div>
                      <div className="font-bold text-blue-400">{tierNames[selectedTier]}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Check-in Code</div>
                      <div className="font-bold text-emerald-400 text-sm">{successData.checkInCode}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Amount Paid</div>
                      <div className="font-bold text-emerald-400">₹{tierPrices[selectedTier]} (PAID)</div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-400 leading-relaxed">
                    📧 A formal invoice receipt and calendar invitation have been sent to <strong>{email}</strong>.
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 font-mono text-xs">
                  <Link
                    href="/profile"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold transition-all shadow-md"
                  >
                    Open Student Profile Workspace &rarr;
                  </Link>
                  <button
                    onClick={() => setSuccessData(null)}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition-all"
                  >
                    Register Another Candidate
                  </button>
                </div>
              </div>
            ) : (
              /* ACTIVE REGISTRATION FORM */
              <div className="space-y-8">
                
                {/* 1. PASS SELECTION */}
                <div>
                  <label className="block text-xs font-mono text-slate-500 uppercase font-bold mb-3">
                    Step 1: Select Your Workshop Pass
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                    
                    {/* STANDARD PASS: ₹9 FLASH */}
                    <div
                      onClick={() => setSelectedTier("STANDARD")}
                      className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        selectedTier === "STANDARD"
                          ? "border-[#0066FF] bg-blue-50/60 shadow-md"
                          : "border-slate-200 bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-slate-900 font-sans text-sm">Flash Workshop Pass</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">9th Sept 9 PM</span>
                        </div>
                        <div className="text-3xl font-black text-slate-950 font-sans mb-3 flex items-baseline gap-2">
                          <span>₹9</span>
                          <span className="text-xs font-normal text-slate-500 line-through">₹499</span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed mb-4">
                          Full live session access, starter code repositories, recordings, and verifiable certificate.
                        </p>
                      </div>
                      <div className="text-[11px] font-bold text-[#0066FF] flex items-center gap-1">
                        <Check size={14} />
                        <span>Includes +300 Karma Coins</span>
                      </div>
                    </div>

                    {/* VIP FOUNDER PASS */}
                    <div
                      onClick={() => setSelectedTier("VIP")}
                      className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        selectedTier === "VIP"
                          ? "border-amber-500 bg-amber-50/50 shadow-md"
                          : "border-slate-200 bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-slate-900 font-sans text-sm">VIP Founder Track</span>
                          <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 text-[10px] font-bold">1-on-1 Review</span>
                        </div>
                        <div className="text-3xl font-black text-slate-950 font-sans mb-3">₹499</div>
                        <p className="text-slate-600 text-[11px] leading-relaxed mb-4">
                          Everything in Standard Pass + 1-on-1 Code Architecture Review with Soham Sharma + 15-Company Referral Dispatch.
                        </p>
                      </div>
                      <div className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
                        <Star size={14} />
                        <span>Direct Founder Mentorship</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* 2. ATTENDEE DETAILS */}
                <div>
                  <label className="block text-xs font-mono text-slate-500 uppercase font-bold mb-3">
                    Step 2: Attendee Details
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Yash Patel"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
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
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
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
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">College / Organization</label>
                      <input
                        type="text"
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        placeholder="e.g. IIT Indore / Freelancer"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                      />
                    </div>
                  </div>

                  <div className="mt-4 font-mono text-xs">
                    <label className="block text-slate-700 font-bold mb-1">Current Experience Level</label>
                    <select
                      value={experienceLevel}
                      onChange={(e) => setExperienceLevel(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                    >
                      <option value="Beginner (Learning Python & Basics)">Beginner (Learning Python &amp; Basics)</option>
                      <option value="Intermediate (Python / REST APIs / Web Dev)">Intermediate (Python / REST APIs / Web Dev)</option>
                      <option value="Advanced (Production Engineering / ML / Backend)">Advanced (Production Engineering / ML / Backend)</option>
                    </select>
                  </div>
                </div>

                {/* 3. PAYMENT METHOD TABS */}
                <div>
                  <label className="block text-xs font-mono text-slate-500 uppercase font-bold mb-3">
                    Step 3: Secure Payment Method
                  </label>

                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl font-mono text-xs mb-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("RAZORPAY")}
                      className={`py-2.5 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        paymentMethod === "RAZORPAY"
                          ? "bg-white text-slate-900 shadow-xs"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      <CreditCard size={14} className="text-[#0066FF]" />
                      <span>Razorpay (Instant UPI &amp; Cards)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("MANUAL_UPI")}
                      className={`py-2.5 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        paymentMethod === "MANUAL_UPI"
                          ? "bg-white text-slate-900 shadow-xs"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      <QrCode size={14} className="text-emerald-600" />
                      <span>Direct UPI QR &amp; UTR</span>
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
                    <form onSubmit={handleRazorpaySubmit} className="space-y-4">
                      <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between font-mono text-xs">
                        <div>
                          <div className="text-slate-500 text-[10px] uppercase font-bold">Total Payable</div>
                          <div className="text-3xl font-black text-slate-900">
                            ₹{tierPrices[selectedTier]} <span className="text-xs font-normal text-slate-500">(All Taxes Included)</span>
                          </div>
                        </div>
                        <div className="text-right text-[11px] text-[#0066FF] font-bold">
                          🔒 256-bit Encrypted Razorpay Checkout
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
                      >
                        {loading ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            <span>Connecting to Razorpay...</span>
                          </>
                        ) : (
                          <>
                            <span>Pay ₹{tierPrices[selectedTier]} via Razorpay</span>
                            <ArrowRight size={15} />
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  {/* MANUAL UPI / QR SCAN */}
                  {paymentMethod === "MANUAL_UPI" && (
                    <form onSubmit={handleManualUpiSubmit} className="space-y-4 font-mono text-xs">
                      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
                        <div className="text-[11px] text-slate-500 font-bold uppercase">
                          Scan &amp; Pay ₹{tierPrices[selectedTier]} via GPay, PhonePe, Paytm, or BHIM
                        </div>
                        
                        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-300 shadow-2xs">
                          <span className="font-bold text-slate-900 text-sm">botmartz-5@oksbi</span>
                          <button
                            type="button"
                            onClick={copyUpiId}
                            className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
                          >
                            {copiedUpi ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">
                          12-Digit UPI Transaction UTR / Ref Number *
                        </label>
                        <input
                          type="text"
                          required
                          value={utrNumber}
                          onChange={(e) => setUtrNumber(e.target.value)}
                          placeholder="e.g. 423910482910"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
                      >
                        {loading ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            <span>Verifying UTR...</span>
                          </>
                        ) : (
                          <>
                            <span>Verify UTR &amp; Confirm ₹{tierPrices[selectedTier]} Pass &rarr;</span>
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
      </section>

      {/* ── 4. INSTRUCTOR & MENTORSHIP SHOWCASE ── */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-[#0066FF] to-cyan-400 p-1 shrink-0 shadow-lg">
                <div className="w-full h-full rounded-[22px] bg-slate-900 flex items-center justify-center font-mono font-black text-3xl text-white">
                  SS
                </div>
              </div>

              <div className="space-y-3 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-mono text-xs font-bold border border-blue-500/30">
                  Lead Instructor &amp; Mentor
                </div>
                <h3 className="text-2xl font-bold font-sans text-white">Soham Sharma</h3>
                <p className="text-slate-400 text-xs font-mono leading-relaxed">
                  Founder &amp; Lead AI Systems Engineer at <strong>Botmartz AI Solution Pvt Ltd</strong>. Architect of enterprise multi-agent frameworks, hybrid retrieval RAG clusters, and production machine learning pipelines.
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 font-mono text-xs">
                  <a
                    href="https://linkedin.com/company/botmartz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <span>LinkedIn Profile</span>
                    <ExternalLink size={12} />
                  </a>
                  <span className="text-slate-600">&bull;</span>
                  <a
                    href="https://github.com/soham2710"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:underline flex items-center gap-1"
                  >
                    <span>GitHub Profile</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ── 5. INTERACTIVE FAQ ACCORDION ── */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm font-mono mt-1">
              Everything you need to know about the workshop schedule, materials, and certificates.
            </p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all shadow-2xs"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left font-bold text-slate-900 font-sans text-sm flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={16} className="text-[#0066FF]" /> : <ChevronDown size={16} className="text-slate-400" />}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-slate-600 text-xs font-mono leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── 6. FINAL ENROLLMENT CTA ── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 font-sans">
            Going Live on 9th September at 9:00 PM IST
          </h2>
          <p className="text-slate-600 text-xs sm:text-base font-mono max-w-2xl mx-auto mb-8">
            Limited seats at the ₹9 flash launch price. Secure your seat today.
          </p>

          <a
            href="#registration"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-blue-500/20 cursor-pointer text-sm"
          >
            <span>Claim Your ₹9 Workshop Seat &rarr;</span>
          </a>
        </div>
      </section>

    </div>
  );
}
