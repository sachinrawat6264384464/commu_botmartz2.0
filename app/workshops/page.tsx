"use client";

import React, { useEffect, useMemo, useState } from "react";
import Script from "next/script";
import { ArrowRight, CheckCircle2, Loader2, X } from "lucide-react";
import { ManagedWorkshop, WorkshopRegistration } from "@/lib/workshops";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function WorkshopsPage() {
  const [workshops, setWorkshops] = useState<ManagedWorkshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [detailWorkshop, setDetailWorkshop] = useState<ManagedWorkshop | null>(null);
  const [registerWorkshop, setRegisterWorkshop] = useState<ManagedWorkshop | null>(null);

  // Registration form state (No login required)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Intermediate");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [confirmedReg, setConfirmedReg] = useState<WorkshopRegistration | null>(null);

  const loadWorkshops = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/workshops");
      const data = await res.json();
      if (data.success) {
        setWorkshops(data.workshops || []);
      }
    } catch (err) {
      console.error("Failed to fetch workshops:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkshops();
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(workshops.map((w) => w.category || "AI Engineering")));
    return ["All", ...cats];
  }, [workshops]);

  const filtered = useMemo(() => {
    if (selectedCategory === "All") return workshops;
    return workshops.filter((w) => w.category === selectedCategory);
  }, [workshops, selectedCategory]);

  const openRegisterModal = (ws: ManagedWorkshop) => {
    setDetailWorkshop(null);
    setRegisterWorkshop(ws);
    setConfirmedReg(null);
    setFormError("");
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerWorkshop) return;
    if (!name.trim() || !email.trim() || !email.includes("@")) {
      setFormError("Please enter your full name and a valid email address.");
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      const orderRes = await fetch("/api/workshops/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workshopId: registerWorkshop.id,
          email: email.trim(),
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        setFormError(orderData.error || "Unable to start registration.");
        setSubmitting(false);
        return;
      }

      if (orderData.isFree) {
        const verifyRes = await fetch("/api/workshops/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            workshopId: registerWorkshop.id,
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            organization: organization.trim(),
            experienceLevel,
          }),
        });
        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          setConfirmedReg(verifyData.registration);
          await loadWorkshops();
        } else {
          setFormError(verifyData.error || "Registration failed.");
        }
        setSubmitting(false);
        return;
      }

      if (!window.Razorpay) {
        setFormError("Razorpay checkout is still loading. Please try again in a second.");
        setSubmitting(false);
        return;
      }

      const rzp = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Botmartz Community",
        description: registerWorkshop.title,
        order_id: orderData.orderId,
        prefill: {
          name: name.trim(),
          email: email.trim(),
          contact: phone.trim(),
        },
        theme: { color: "#162774" },
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch("/api/workshops/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                workshopId: registerWorkshop.id,
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim(),
                organization: organization.trim(),
                experienceLevel,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              setConfirmedReg(verifyData.registration);
              await loadWorkshops();
            } else {
              setFormError(verifyData.error || "Payment verification failed.");
            }
          } catch {
            setFormError("Error verifying payment. Contact support@botmartz.com.");
          } finally {
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => setSubmitting(false),
        },
      });

      rzp.open();
    } catch {
      setFormError("Connection error. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div
      className="bg-white min-h-screen text-slate-900 pt-24 pb-16 font-sans selection:bg-[#D9F83B] selection:text-slate-950"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(29, 49, 137, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(29, 49, 137, 0.08) 1px, transparent 1px)",
        backgroundSize: "72px 72px",
      }}
    >
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="w-full px-4 sm:px-8 lg:px-12 space-y-10 relative z-10">
        {/* ── 1. HERO BANNER ── */}
        <section
          className="rounded-3xl bg-[#162774] text-white p-7 sm:p-11 border border-white/15 shadow-2xl space-y-6"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#D9F83B] text-slate-950 text-[11px] font-extrabold uppercase tracking-wider">
                Live Hands-On Workshops &bull; No Account Needed
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                Production Engineering <span className="text-[#D9F83B]">Workshops</span>
              </h1>
              <p className="text-xs sm:text-sm text-blue-100/85 leading-relaxed">
                Pick any specialized live workshop across Python, RAG, Agentic RAG, Machine Learning, Prompt Engineering, or Career Roadmaps. Register in 30 seconds — no login required — and receive your confirmation &amp; live joining link directly via email.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 shrink-0 min-w-[260px]">
              <div className="p-4 rounded-2xl bg-white/[0.08] border border-white/15 border-l-4 border-l-[#D9F83B]">
                <div className="text-2xl font-extrabold text-[#D9F83B]">₹699</div>
                <div className="text-[11px] text-blue-100/80 font-medium">Per Live Workshop</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.08] border border-white/15 border-l-4 border-l-[#D9F83B]">
                <div className="text-2xl font-extrabold text-white">100%</div>
                <div className="text-[11px] text-blue-100/80 font-medium">Code + Recording</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. CATEGORY FILTER STRIP ── */}
        <section className="bg-[#F4F6FB] border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#162774] text-[#D9F83B]"
                    : "bg-white border border-slate-200 text-slate-700 hover:border-[#162774]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="text-xs font-bold text-slate-500">
            Showing {filtered.length} Workshop{filtered.length === 1 ? "" : "s"}
          </div>
        </section>

        {/* ── 3. WORKSHOPS GRID ── */}
        {loading ? (
          <div className="p-14 rounded-3xl bg-[#F4F6FB] border border-slate-200 flex items-center justify-center gap-2 text-sm font-bold text-slate-700">
            <Loader2 size={18} className="animate-spin text-[#162774]" />
            <span>Loading Live Workshops...</span>
          </div>
        ) : (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-7">
            {filtered.map((ws, idx) => (
              <div
                key={ws.id}
                className="relative overflow-hidden rounded-3xl bg-[#F4F6FB] hover:bg-white border border-slate-200 border-l-4 border-l-[#D9F83B] hover:border-[#162774] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between group"
              >
                <div>
                  {/* Cover Image */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#162774]">
                    <img
                      src={ws.imageUrl}
                      alt={ws.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#162774]/70 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-[#D9F83B] text-slate-950 font-extrabold text-xs flex items-center justify-center shadow-md">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="px-3.5 py-1 rounded-full bg-[#162774]/95 text-white text-[11px] font-extrabold uppercase tracking-wider border border-white/20">
                        {ws.category}
                      </span>
                    </div>
                    <span className="absolute top-4 right-4 px-4 py-1.5 rounded-full bg-[#D9F83B] text-slate-950 text-sm font-extrabold shadow-md">
                      {ws.isPaid && Number(ws.price) > 0 ? `₹${ws.price}` : "Free"}
                    </span>
                    <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-xs font-bold text-white">
                      <span>{ws.scheduleDate}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-xs">
                        {ws.duration}
                      </span>
                    </div>
                  </div>

                  {/* Body (Larger, High-Contrast Typography) */}
                  <div className="p-6 sm:p-7 pb-5 space-y-4">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 group-hover:text-[#162774] transition-colors leading-snug">
                      {ws.title}
                    </h2>

                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                      {ws.tagline}
                    </p>

                    <div className="p-4 rounded-2xl bg-white border border-slate-200/90 space-y-2">
                      <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#162774]">
                        What You Will Build
                      </div>
                      <ul className="space-y-1.5 text-xs sm:text-sm text-slate-800 font-medium">
                        {(ws.whatYouWillBuild || []).slice(0, 3).map((item) => (
                          <li key={item} className="flex items-start gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-[#162774] mt-1.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between text-xs sm:text-sm text-slate-700 font-bold pt-1">
                      <span>Instructor: {ws.instructor}</span>
                      <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-[#162774] text-xs">
                        {ws.registrationCount || 0} Registered
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Grid Slide Hover Footer */}
                <div className="relative overflow-hidden px-6 sm:px-7 py-4 border-t border-slate-200/80 group-hover:border-[#162774] flex items-center gap-3 transition-colors duration-500">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[#162774] -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
                      backgroundSize: "28px 28px",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setDetailWorkshop(ws)}
                    className="relative z-10 flex-1 py-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-950 font-extrabold text-xs sm:text-sm transition-all cursor-pointer"
                  >
                    View Details
                  </button>
                  <button
                    type="button"
                    onClick={() => openRegisterModal(ws)}
                    className="relative z-10 flex-1 py-3 rounded-xl bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-extrabold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{ws.isPaid && Number(ws.price) > 0 ? `Register (₹${ws.price})` : "Register Free"}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </section>
        )}
      </div>

      {/* ── WORKSHOP DETAILS MODAL ── */}
      {detailWorkshop && (
        <div
          onClick={() => setDetailWorkshop(null)}
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 text-slate-900 max-h-[90vh] overflow-y-auto"
          >
            <div className="relative aspect-video bg-[#162774]">
              <img
                src={detailWorkshop.imageUrl || "/workshops/ws-python.png"}
                alt={detailWorkshop.title}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setDetailWorkshop(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white flex items-center justify-center cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full bg-[#162774] text-[#D9F83B] text-[10px] font-extrabold uppercase tracking-wider">
                  {detailWorkshop.category} &bull; {detailWorkshop.scheduleDate}
                </span>
                <span className="px-3.5 py-1 rounded-full bg-[#D9F83B] text-slate-950 text-xs font-extrabold">
                  {detailWorkshop.isPaid && Number(detailWorkshop.price) > 0
                    ? `₹${detailWorkshop.price} INR`
                    : "Free Entry"}
                </span>
              </div>

              <h2 className="text-2xl font-extrabold text-slate-950">{detailWorkshop.title}</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{detailWorkshop.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#F4F6FB] border border-slate-200 space-y-2">
                  <div className="text-xs font-extrabold text-[#162774] uppercase tracking-wider">
                    What You Will Build
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {(detailWorkshop.whatYouWillBuild || []).map((w) => (
                      <li key={w} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#162774] mt-1.5 shrink-0" />
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-[#F4F6FB] border border-slate-200 space-y-2">
                  <div className="text-xs font-extrabold text-[#162774] uppercase tracking-wider">
                    Session Curriculum
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {(detailWorkshop.curriculum || []).map((c) => (
                      <li key={c} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D9F83B] ring-1 ring-[#162774] mt-1.5 shrink-0" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-4 border-t border-slate-100">
                <div className="text-xs text-slate-500">
                  Instructor: <strong className="text-slate-900">{detailWorkshop.instructor}</strong> &bull; {detailWorkshop.duration}
                </div>
                <button
                  type="button"
                  onClick={() => openRegisterModal(detailWorkshop)}
                  className="px-6 py-3 rounded-full bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-extrabold text-xs transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>
                    {detailWorkshop.isPaid && Number(detailWorkshop.price) > 0
                      ? `Register & Pay ₹${detailWorkshop.price}`
                      : "Register Free"}
                  </span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── REGISTRATION & RAZORPAY MODAL (NO LOGIN REQUIRED) ── */}
      {registerWorkshop && (
        <div
          onClick={() => setRegisterWorkshop(null)}
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 text-slate-900"
          >
            <div className="bg-[#162774] text-white p-6 flex items-start justify-between gap-4">
              <div>
                <span className="inline-block px-3 py-0.5 rounded-full bg-[#D9F83B] text-slate-950 text-[10px] font-extrabold uppercase tracking-wider mb-2">
                  No Login Required &bull; Instant Email Pass
                </span>
                <h3 className="text-lg font-extrabold leading-snug">{registerWorkshop.title}</h3>
                <p className="text-xs text-blue-100/80 mt-1">
                  {registerWorkshop.scheduleDate} &bull;{" "}
                  {registerWorkshop.isPaid && Number(registerWorkshop.price) > 0
                    ? `Fee: ₹${registerWorkshop.price} INR`
                    : "Free Registration"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRegisterWorkshop(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {confirmedReg ? (
              <div className="p-6 sm:p-8 space-y-4 text-center">
                <CheckCircle2 size={42} className="text-emerald-600 mx-auto" />
                <h4 className="text-xl font-extrabold text-slate-950">Seat Confirmed!</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your registration is saved and confirmation details have been sent to{" "}
                  <strong className="text-slate-950">{confirmedReg.email}</strong>. You will receive the live joining link on your email before the workshop starts — simply click that link to join!
                </p>
                <div className="p-4 rounded-2xl bg-[#F4F6FB] border border-slate-200 text-xs space-y-1.5 text-left">
                  <div>
                    <span className="text-slate-500">Ticket Code:</span>{" "}
                    <strong className="text-[#162774]">{confirmedReg.ticketCode}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Payment ID:</span>{" "}
                    <strong className="text-slate-900">{confirmedReg.razorpayPaymentId}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Amount Paid:</span>{" "}
                    <strong className="text-slate-900">
                      {confirmedReg.amountPaid > 0 ? `₹${confirmedReg.amountPaid} INR` : "Free"}
                    </strong>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setRegisterWorkshop(null)}
                  className="w-full py-3 rounded-full bg-[#162774] text-[#D9F83B] font-extrabold text-xs cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="p-6 space-y-3.5 text-xs">
                {formError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-semibold">
                    {formError}
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-[#162774]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Email Address (Joining link will be sent here) *
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-[#162774]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Phone / WhatsApp *</label>
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98XXXXXXXX"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-[#162774]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Experience Level</label>
                    <select
                      value={experienceLevel}
                      onChange={(e) => setExperienceLevel(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-[#162774]"
                    >
                      <option value="Beginner">Beginner / Student</option>
                      <option value="Intermediate">Intermediate Builder</option>
                      <option value="Advanced">Working Engineer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">College / Company</label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. IIT / NIT / Startup / Independent"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-[#162774]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-full bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-extrabold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md disabled:opacity-60 mt-2"
                >
                  {submitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      <span>
                        {registerWorkshop.isPaid && Number(registerWorkshop.price) > 0
                          ? `Proceed to Pay ₹${registerWorkshop.price}`
                          : "Confirm Free Seat"}
                      </span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
