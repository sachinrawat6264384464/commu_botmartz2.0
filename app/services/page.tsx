"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import RazorpayModal from "@/app/_components/RazorpayModal";

interface ServiceItem {
  id: string;
  num: string;
  category: string;
  title: string;
  subtitle: string;
  price: number;
  priceLabel: string;
  image: string;
  highlights: string[];
  ctaLabel: string;
}

const SERVICES_CATALOG: ServiceItem[] = [
  {
    id: "jobs-placement",
    num: "01",
    category: "Jobs & Placement",
    title: "Direct Tech Jobs & Placement Track",
    subtitle: "Get shortlisted for AI, backend, and full-stack engineering roles with direct founder referrals and mock screening rounds.",
    price: 499,
    priceLabel: "₹499",
    image: "/gallery/online-internship.jpg",
    highlights: [
      "Direct screening with 15+ hiring partner teams",
      "ATS & GitHub proof-of-work portfolio audit",
      "Dedicated placement coordinator follow-up",
    ],
    ctaLabel: "Apply & Pay ₹499",
  },
  {
    id: "doubt-session",
    num: "02",
    category: "Doubt Session",
    title: "1-on-1 Live Doubt Resolution Session",
    subtitle: "Unblock bugs, system design confusion, deployment errors, or interview prep in a focused live 1-on-1 engineering session.",
    price: 199,
    priceLabel: "₹199",
    image: "/gallery/online-live-session.jpg",
    highlights: [
      "45-minute live screen-share debugging",
      "Architecture, API, or database bottleneck fix",
      "Actionable next-step checklist after call",
    ],
    ctaLabel: "Book Doubt Session ₹199",
  },
  {
    id: "content-training",
    num: "03",
    category: "Content Training",
    title: "Content & Hands-On AI Training",
    subtitle: "Structured production curriculum covering LangGraph, Hybrid RAG, FastAPI, Docker, and real-world system engineering.",
    price: 999,
    priceLabel: "₹999",
    image: "/gallery/event-3.png",
    highlights: [
      "Structured modules & production code templates",
      "Weekly live Q&A and assignment feedback",
      "Verified completion certificate included",
    ],
    ctaLabel: "Enroll Training ₹999",
  },
  {
    id: "corporate-training",
    num: "04",
    category: "Corporate Training",
    title: "Corporate & Engineering Team Training",
    subtitle: "Custom hands-on AI & agentic systems upskilling workshops tailored for startup teams, enterprises, and faculty cohorts.",
    price: 4999,
    priceLabel: "₹4,999",
    image: "/gallery/event-6.png",
    highlights: [
      "Custom enterprise AI & RAG curriculum",
      "Hands-on team labs & architecture review",
      "Dedicated trainer & post-session support",
    ],
    ctaLabel: "Book Corporate Batch ₹4,999",
  },
  {
    id: "expert-project-review",
    num: "05",
    category: "Expert Review",
    title: "Project Review with Industry Experts",
    subtitle: "Get your GitHub repo, system design, latency benchmarks, and production readiness audited live by senior industry engineers.",
    price: 799,
    priceLabel: "₹799",
    image: "/gallery/online-demo-day.jpg",
    highlights: [
      "Line-by-line code & architecture teardown",
      "SLA latency, security & scalability audit",
      "Verified expert feedback report for recruiters",
    ],
    ctaLabel: "Book Expert Review ₹799",
  },
];

export default function ServicesPage() {
  const router = useRouter();
  const { user, studentProfile } = useAuth();

  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [razorpayOpen, setRazorpayOpen] = useState(false);
  const [savingBooking, setSavingBooking] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any | null>(null);
  const [formError, setFormError] = useState("");

  const [form, setForm] = useState({
    userName: "",
    userEmail: "",
    phone: "",
    organizationOrCollege: "",
    preferredSlot: "",
    notes: "",
  });

  useEffect(() => {
    if (user || studentProfile) {
      setForm((prev) => ({
        ...prev,
        userName: prev.userName || studentProfile?.displayName || user?.displayName || "",
        userEmail: prev.userEmail || studentProfile?.email || user?.email || "",
        phone: prev.phone || studentProfile?.phoneNumber || "",
      }));
    }
  }, [user, studentProfile]);

  const handleBookClick = (service: ServiceItem) => {
    setSelectedService(service);
    setFormError("");
    if (!user) {
      setAuthPromptOpen(true);
      return;
    }
    setFormModalOpen(true);
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.userName.trim() || !form.userEmail.includes("@") || !form.phone.trim()) {
      setFormError("Please fill your full name, valid email, and phone number.");
      return;
    }
    setFormError("");
    setFormModalOpen(false);
    setRazorpayOpen(true);
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    if (!selectedService) return;
    setSavingBooking(true);
    try {
      const res = await fetch("/api/services/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService.id,
          serviceTitle: selectedService.title,
          category: selectedService.category,
          amount: selectedService.price,
          userName: form.userName,
          userEmail: form.userEmail,
          phone: form.phone,
          organizationOrCollege: form.organizationOrCollege,
          preferredSlot: form.preferredSlot,
          notes: form.notes,
          paymentId: paymentData?.paymentId || paymentData?.razorpay_payment_id || `pay_${Date.now()}`,
          paymentStatus: "Paid",
          status: "Pending",
        }),
      });
      const data = await res.json();
      if (data.success && data.booking) {
        setRazorpayOpen(false);
        setConfirmedBooking(data.booking);
      }
    } catch (err) {
      console.error("Failed to record service booking:", err);
    } finally {
      setSavingBooking(false);
    }
  };

  return (
    <div
      className="bg-white min-h-screen text-slate-900 pt-24 pb-20 font-sans selection:bg-[#D9F83B] selection:text-[#162774]"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(29, 49, 137, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(29, 49, 137, 0.08) 1px, transparent 1px)",
        backgroundSize: "72px 72px",
      }}
    >
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 space-y-12">
        {/* HERO BANNER */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative rounded-[32px] bg-[#162774] border border-white/15 p-7 sm:p-10 lg:p-12 text-white shadow-2xl overflow-hidden"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        >
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#D9F83B] text-[#162774] text-xs font-extrabold uppercase tracking-wider">
                Jobs &bull; Doubt Sessions &bull; Training &bull; Expert Reviews
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                Career Programs, Training &amp;{" "}
                <span className="text-[#D9F83B]">Expert Reviews</span>
              </h1>
              <p className="text-sm sm:text-base text-white/90 font-medium leading-relaxed">
                Choose from direct job placement tracks, 1-on-1 doubt sessions, hands-on content &amp; corporate training, or live project reviews with industry experts.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/profile"
                className="px-5 py-3 rounded-full bg-white/15 hover:bg-white text-white hover:text-[#162774] border border-white/25 font-bold text-xs sm:text-sm transition-all"
              >
                View My Bookings
              </Link>
            </div>
          </div>
        </motion.div>

        {/* SERVICES GRID WITH IMAGES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES_CATALOG.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
              className="group bg-white rounded-[28px] border border-slate-200 hover:border-[#162774] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image */}
                <div className="relative h-52 w-full overflow-hidden bg-[#162774]">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#162774]/85 via-[#162774]/20 to-transparent" />

                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#D9F83B] text-[#162774] text-xs font-extrabold uppercase tracking-wider">
                      {service.category}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white text-[#162774] text-xs font-extrabold">
                      {service.priceLabel}
                    </span>
                  </div>

                  <div className="absolute bottom-3.5 left-4">
                    <span className="w-7 h-7 rounded-full bg-[#162774]/90 border border-white/25 text-[#D9F83B] text-xs font-extrabold inline-flex items-center justify-center">
                      {service.num}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-[#162774] tracking-tight">
                      {service.title}
                    </h2>
                    <p className="text-sm font-medium text-slate-600 mt-1.5 leading-relaxed">
                      {service.subtitle}
                    </p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-slate-100 text-xs sm:text-sm font-semibold text-slate-700">
                    {service.highlights.map((h, hi) => (
                      <div key={hi} className="flex items-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#162774] shrink-0 mt-1.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="px-6 pb-6 pt-2">
                <button
                  type="button"
                  onClick={() => handleBookClick(service)}
                  className="group/btn w-full py-2.5 pl-5 pr-2 rounded-full bg-[#162774] hover:bg-[#0d1952] text-white font-extrabold text-sm flex items-center justify-between gap-3 transition-all cursor-pointer shadow-md"
                >
                  <span>{service.ctaLabel}</span>
                  <span className="w-8 h-8 rounded-full bg-[#D9F83B] text-[#162774] flex items-center justify-center shrink-0">
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:rotate-[60deg]" />
                  </span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AUTH REQUIRED PROMPT MODAL (WHEN USER IS NOT LOGGED IN) */}
      <AnimatePresence>
        {authPromptOpen && selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[28px] border border-slate-200 shadow-2xl max-w-md w-full p-7 space-y-5 text-center"
            >
              <span className="inline-block px-3.5 py-1 rounded-full bg-[#FEF08A] text-[#162774] text-xs font-extrabold uppercase tracking-wider">
                Account Required
              </span>
              <h3 className="text-2xl font-extrabold text-[#162774] tracking-tight">
                Sign In or Sign Up First
              </h3>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                To book <strong className="text-[#162774]">{selectedService.title}</strong>, complete payment, and receive your official receipt &amp; profile tracking, please sign in or create your account.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => router.push("/login?mode=signin")}
                  className="w-full py-3 px-5 rounded-full bg-[#162774] text-[#D9F83B] font-extrabold text-sm cursor-pointer hover:bg-[#0d1952] transition-colors"
                >
                  Okay, Sign In
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/login?mode=signup")}
                  className="w-full py-3 px-5 rounded-full bg-[#D9F83B] text-[#162774] font-extrabold text-sm cursor-pointer hover:bg-[#cff227] transition-colors"
                >
                  Sign Up
                </button>
              </div>

              <button
                type="button"
                onClick={() => setAuthPromptOpen(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REGISTRATION FORM MODAL (WHEN USER IS LOGGED IN) */}
      <AnimatePresence>
        {formModalOpen && selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-white rounded-[28px] border border-slate-200 shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5"
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-[#F4F6FB] border border-slate-200 text-[#162774] text-xs font-extrabold uppercase tracking-wider mb-2">
                    {selectedService.category} &bull; {selectedService.priceLabel}
                  </span>
                  <h3 className="text-xl font-extrabold text-[#162774]">
                    {selectedService.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setFormModalOpen(false)}
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleProceedToPayment} className="space-y-4">
                {formError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-[#162774] uppercase mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.userName}
                      onChange={(e) => setForm({ ...form, userName: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-[#F4F6FB] border border-slate-200 text-sm font-semibold focus:bg-white focus:outline-none focus:border-[#162774]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-[#162774] uppercase mb-1">
                      Email (Receipt Sent Here) *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.userEmail}
                      onChange={(e) => setForm({ ...form, userEmail: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-[#F4F6FB] border border-slate-200 text-sm font-semibold focus:bg-white focus:outline-none focus:border-[#162774]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-[#162774] uppercase mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 98XXXXXXXX"
                      className="w-full px-4 py-3 rounded-2xl bg-[#F4F6FB] border border-slate-200 text-sm font-semibold focus:bg-white focus:outline-none focus:border-[#162774]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-[#162774] uppercase mb-1">
                      College / Company
                    </label>
                    <input
                      type="text"
                      value={form.organizationOrCollege}
                      onChange={(e) =>
                        setForm({ ...form, organizationOrCollege: e.target.value })
                      }
                      placeholder="e.g. SGSITS / Acme Tech"
                      className="w-full px-4 py-3 rounded-2xl bg-[#F4F6FB] border border-slate-200 text-sm font-semibold focus:bg-white focus:outline-none focus:border-[#162774]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#162774] uppercase mb-1">
                    Preferred Date / Time Slot
                  </label>
                  <input
                    type="text"
                    value={form.preferredSlot}
                    onChange={(e) => setForm({ ...form, preferredSlot: e.target.value })}
                    placeholder="e.g. Tomorrow 6:00 PM IST / Weekend"
                    className="w-full px-4 py-3 rounded-2xl bg-[#F4F6FB] border border-slate-200 text-sm font-semibold focus:bg-white focus:outline-none focus:border-[#162774]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#162774] uppercase mb-1">
                    Topic / Project Repo / Training Goals
                  </label>
                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Share your GitHub link, doubt details, or corporate training requirements..."
                    className="w-full px-4 py-3 rounded-2xl bg-[#F4F6FB] border border-slate-200 text-sm font-semibold focus:bg-white focus:outline-none focus:border-[#162774]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-full bg-[#162774] hover:bg-[#0d1952] text-[#D9F83B] font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>Proceed to Payment ({selectedService.priceLabel})</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RAZORPAY PAYMENT MODAL */}
      {selectedService && (
        <RazorpayModal
          isOpen={razorpayOpen}
          onClose={() => setRazorpayOpen(false)}
          amount={selectedService.price}
          itemName={selectedService.title}
          itemCategory="WORKSHOP_PASS"
          description={`Booking for ${selectedService.title} (${form.userEmail})`}
          metadata={{
            serviceId: selectedService.id,
            userName: form.userName,
            userEmail: form.userEmail,
            phone: form.phone,
          }}
          onSuccessCallback={handlePaymentSuccess}
        />
      )}

      {/* BOOKING CONFIRMED MODAL */}
      <AnimatePresence>
        {confirmedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#162774] text-white rounded-[28px] border border-white/20 shadow-2xl max-w-lg w-full p-7 sm:p-8 space-y-5"
            >
              <span className="inline-block px-3.5 py-1 rounded-full bg-[#D9F83B] text-[#162774] text-xs font-extrabold uppercase tracking-wider">
                Receipt ID: {confirmedBooking.receiptId}
              </span>
              <h3 className="text-2xl font-extrabold tracking-tight">
                Booking Confirmed &amp; Receipt Sent!
              </h3>
              <p className="text-sm text-white/90 font-medium leading-relaxed">
                We have emailed your payment receipt to <strong>{confirmedBooking.userEmail}</strong>. Our team will connect with you within <strong>24 hours</strong> (note: we actively reach out only <strong>2 times</strong>).
              </p>

              <div className="p-4 rounded-2xl bg-white/10 border border-white/15 text-sm space-y-1.5">
                <div><strong>Service:</strong> {confirmedBooking.serviceTitle}</div>
                <div><strong>Amount Paid:</strong> ₹{confirmedBooking.amount} ({confirmedBooking.paymentStatus})</div>
                <div><strong>Status:</strong> {confirmedBooking.status}</div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/profile"
                  className="px-6 py-3 rounded-full bg-[#D9F83B] text-[#162774] font-extrabold text-sm"
                >
                  View in My Profile
                </Link>
                <button
                  type="button"
                  onClick={() => setConfirmedBooking(null)}
                  className="px-5 py-3 rounded-full bg-white/15 text-white font-bold text-sm cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
