"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const COLLAB_TRACKS = [
  {
    num: "01",
    track: "Campus Tie-Up",
    tag: "Colleges & Universities",
    title: "Campus AI Cohort & Virtual Internships",
    desc: "Launch a 45-day production engineering & virtual AI internship cohort for your students with daily GitHub proof-of-work tracking and QR-verified certificates.",
    highlights: ["Dedicated campus cohort dashboard", "45-day GitHub commit verification", "QR-verified completion certificates"],
  },
  {
    num: "02",
    track: "Hiring Builders",
    tag: "Startups & Enterprises",
    title: "Direct Talent Screening & Hiring",
    desc: "Skip generic resumes. Hire engineers who have shipped 59+ production PRDs, passed automated SLA benchmarks, and logged verified daily builds.",
    highlights: ["Pre-vetted AI & backend builders", "Direct screening from 24-hour hackathons", "Verified GitHub & SLA portfolios"],
  },
  {
    num: "03",
    track: "Sponsor Hackathon",
    tag: "Brands & Tech Sponsors",
    title: "24-Hour Online Hackathon Sponsor",
    desc: "Co-brand a 24-hour production hackathon with your custom problem statement, APIs, or cash bounties and shortlist top solo or squad winners.",
    highlights: ["Custom production problem statements", "Cash bounties & API adoption", "Live demo day judging seat"],
  },
  {
    num: "04",
    track: "Co-Host Workshop",
    tag: "Mentors & Tech Leads",
    title: "Live Workshops & Architecture Clinics",
    desc: "Lead weekend hands-on workshops, live system teardowns, or Saturday office hours for hundreds of active AI & systems builders.",
    highlights: ["Live interactive code labs", "Featured speaker spotlight", "Community Q&A & mentorship"],
  },
  {
    num: "05",
    track: "Enterprise AI R&D",
    tag: "Product & R&D Teams",
    title: "Custom AI Systems & Pilot Co-Build",
    desc: "Collaborate with Botmartz senior builders on custom LangGraph multi-agent workflows, Hybrid RAG search, or edge telemetry prototypes.",
    highlights: ["Production-grade PRD execution", "Sub-150ms latency benchmarks", "Dedicated engineering squad"],
  },
];

const ORG_TYPES = [
  "College / University",
  "Startup / Tech Company",
  "Hiring Partner",
  "Sponsor / Community",
  "Mentor / Speaker",
];

export default function PartnerWithUsPage() {
  const [form, setForm] = useState({
    organizationName: "",
    contactName: "",
    email: "",
    phone: "",
    organizationType: "Startup / Tech Company",
    partnershipTrack: "Campus Tie-Up",
    cohortOrBudget: "",
    websiteOrLinkedin: "",
    proposal: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submittedRecord, setSubmittedRecord] = useState<any | null>(null);

  const handleSelectTrack = (track: string) => {
    setForm((prev) => ({ ...prev, partnershipTrack: track }));
    const el = document.getElementById("partner-proposal-form");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit partnership proposal.");
      }

      setSubmittedRecord(data.partner);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
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
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#FEF08A] text-[#162774] text-xs font-extrabold uppercase tracking-wider">
                Tie-Ups &bull; Hiring &bull; Sponsorships &bull; Campus Cohorts
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                Partner &amp; Collaborate with{" "}
                <span className="text-[#D9F83B]">Botmartz Builders</span>
              </h1>
              <p className="text-sm sm:text-base text-white/90 font-medium max-w-2xl leading-relaxed">
                Whether you are a university launching a 45-day AI cohort, a startup hiring SLA-verified engineers, or a brand sponsoring 24-hour hackathons — submit your proposal directly below.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3">
              <a
                href="#partner-proposal-form"
                className="group inline-flex items-center gap-3 pl-6 pr-2 py-2.5 rounded-full bg-[#D9F83B] hover:bg-white text-[#162774] font-extrabold text-sm transition-all shadow-lg"
              >
                <span>Submit Partnership Proposal</span>
                <span className="w-8 h-8 rounded-full bg-[#162774] text-[#D9F83B] flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-[60deg]" />
                </span>
              </a>
              <Link
                href="/arena"
                className="px-5 py-2.5 rounded-full bg-white/15 hover:bg-white text-white hover:text-[#162774] border border-white/25 font-bold text-xs sm:text-sm transition-all"
              >
                Explore 59+ Production PRDs
              </Link>
            </div>
          </div>
        </motion.div>

        {/* WHAT YOU CAN OFFER / COLLABORATION TRACKS */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="inline-block px-3.5 py-1 rounded-full bg-[#F4F6FB] border border-slate-200 text-[#162774] text-xs font-extrabold uppercase tracking-wider mb-2.5">
                Partnership Models
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#162774] tracking-tight">
                Ways to Tie Up &amp; Collaborate
              </h2>
            </div>
            <p className="text-sm font-medium text-slate-600 max-w-md">
              Click any track below to pre-select it in your partnership proposal form.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {COLLAB_TRACKS.map((item) => {
              const selected = form.partnershipTrack === item.track;
              return (
                <button
                  key={item.num}
                  type="button"
                  onClick={() => handleSelectTrack(item.track)}
                  className={`text-left p-6 rounded-[24px] border transition-all duration-300 flex flex-col justify-between gap-5 cursor-pointer ${
                    selected
                      ? "bg-[#162774] text-white border-[#162774] shadow-xl"
                      : "bg-white text-slate-900 border-slate-200 hover:border-[#162774] shadow-sm hover:shadow-md"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                          selected
                            ? "bg-[#D9F83B] text-[#162774]"
                            : "bg-[#F4F6FB] text-[#162774] border border-slate-200"
                        }`}
                      >
                        {item.tag}
                      </span>
                      <span
                        className={`w-7 h-7 rounded-full text-xs font-extrabold flex items-center justify-center ${
                          selected
                            ? "bg-[#D9F83B] text-[#162774]"
                            : "bg-[#162774] text-[#D9F83B]"
                        }`}
                      >
                        {item.num}
                      </span>
                    </div>

                    <h3
                      className={`text-xl font-extrabold tracking-tight ${
                        selected ? "text-white" : "text-[#162774]"
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p
                      className={`text-sm font-medium leading-relaxed ${
                        selected ? "text-white/90" : "text-slate-600"
                      }`}
                    >
                      {item.desc}
                    </p>
                  </div>

                  <div
                    className={`pt-4 border-t space-y-1.5 text-xs font-semibold ${
                      selected ? "border-white/15 text-white/95" : "border-slate-100 text-slate-700"
                    }`}
                  >
                    {item.highlights.map((h, hi) => (
                      <div key={hi} className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            selected ? "bg-[#D9F83B]" : "bg-[#162774]"
                          }`}
                        />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* INTERACTIVE PROPOSAL SUBMISSION FORM */}
        <section
          id="partner-proposal-form"
          className="bg-white border border-slate-200 rounded-[28px] p-6 sm:p-10 shadow-sm"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Info */}
            <div className="lg:col-span-4 space-y-4">
              <span className="inline-block px-3.5 py-1 rounded-full bg-[#FEF08A] text-[#162774] text-xs font-extrabold uppercase tracking-wider">
                Direct Tie-Up Desk
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#162774] tracking-tight">
                Submit Your Collaboration Proposal
              </h2>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                Share what you want to offer or co-build with Botmartz. Every proposal is stored directly in our partnership pipeline and reviewed by the founding team within 24 hours.
              </p>

              <div className="p-5 rounded-2xl bg-[#F4F6FB] border border-slate-200 space-y-2.5 text-sm font-semibold text-[#162774]">
                <div>01 &bull; Campus MoUs &amp; Student Cohorts</div>
                <div>02 &bull; Direct Tech Hiring &amp; Referrals</div>
                <div>03 &bull; Hackathon Problem Sponsorship</div>
                <div>04 &bull; Live Workshops &amp; Speaker Sessions</div>
              </div>
            </div>

            {/* Right Form or Submitted State */}
            <div className="lg:col-span-8">
              {submittedRecord ? (
                <div className="p-8 rounded-3xl bg-[#162774] text-white space-y-5 shadow-xl">
                  <span className="inline-block px-3.5 py-1 rounded-full bg-[#D9F83B] text-[#162774] text-xs font-extrabold uppercase tracking-wider">
                    Proposal Received &bull; ID: {submittedRecord.id}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    Thank you, {submittedRecord.contactName}!
                  </h3>
                  <p className="text-sm sm:text-base text-white/90 font-medium leading-relaxed">
                    Your partnership proposal for <strong className="text-[#D9F83B]">{submittedRecord.organizationName}</strong> ({submittedRecord.partnershipTrack}) has been saved to our database. Our team will reach out to <strong>{submittedRecord.email}</strong> shortly.
                  </p>

                  <div className="p-4 rounded-2xl bg-white/10 border border-white/15 text-sm space-y-1.5">
                    <div><strong>Track:</strong> {submittedRecord.partnershipTrack}</div>
                    <div><strong>Organization Type:</strong> {submittedRecord.organizationType}</div>
                    <div><strong>Status:</strong> {submittedRecord.status}</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedRecord(null);
                      setForm({
                        organizationName: "",
                        contactName: "",
                        email: "",
                        phone: "",
                        organizationType: "Startup / Tech Company",
                        partnershipTrack: "Campus Tie-Up",
                        cohortOrBudget: "",
                        websiteOrLinkedin: "",
                        proposal: "",
                      });
                    }}
                    className="px-6 py-3 rounded-full bg-[#D9F83B] hover:bg-white text-[#162774] font-extrabold text-sm transition-all cursor-pointer"
                  >
                    Submit Another Proposal
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {errorMsg && (
                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-[#162774] uppercase tracking-wider mb-1.5">
                        Organization / College / Company *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.organizationName}
                        onChange={(e) => setForm({ ...form, organizationName: e.target.value })}
                        placeholder="e.g. Acme AI Labs / IIT Indore"
                        className="w-full px-4 py-3 rounded-2xl bg-[#F4F6FB] border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#162774]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-[#162774] uppercase tracking-wider mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.contactName}
                        onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                        placeholder="e.g. Ananya Verma"
                        className="w-full px-4 py-3 rounded-2xl bg-[#F4F6FB] border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#162774]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-[#162774] uppercase tracking-wider mb-1.5">
                        Work / Official Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="name@company.com"
                        className="w-full px-4 py-3 rounded-2xl bg-[#F4F6FB] border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#162774]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-[#162774] uppercase tracking-wider mb-1.5">
                        Phone / WhatsApp Number
                      </label>
                      <input
                        type="text"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+91 98XXXXXXXX"
                        className="w-full px-4 py-3 rounded-2xl bg-[#F4F6FB] border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#162774]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-[#162774] uppercase tracking-wider mb-1.5">
                        Organization Type *
                      </label>
                      <select
                        value={form.organizationType}
                        onChange={(e) => setForm({ ...form, organizationType: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl bg-[#F4F6FB] border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#162774]"
                      >
                        {ORG_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-[#162774] uppercase tracking-wider mb-1.5">
                        Partnership Track *
                      </label>
                      <select
                        value={form.partnershipTrack}
                        onChange={(e) => setForm({ ...form, partnershipTrack: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl bg-[#F4F6FB] border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#162774]"
                      >
                        {COLLAB_TRACKS.map((c) => (
                          <option key={c.track} value={c.track}>
                            {c.track}
                          </option>
                        ))}
                        <option value="Other">Other Collaboration</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-[#162774] uppercase tracking-wider mb-1.5">
                        Cohort Size / Roles / Bounty Budget (Optional)
                      </label>
                      <input
                        type="text"
                        value={form.cohortOrBudget}
                        onChange={(e) => setForm({ ...form, cohortOrBudget: e.target.value })}
                        placeholder="e.g. 120 students / 5 AI interns / ₹50,000 bounty"
                        className="w-full px-4 py-3 rounded-2xl bg-[#F4F6FB] border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#162774]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-[#162774] uppercase tracking-wider mb-1.5">
                        Website or LinkedIn URL
                      </label>
                      <input
                        type="url"
                        value={form.websiteOrLinkedin}
                        onChange={(e) => setForm({ ...form, websiteOrLinkedin: e.target.value })}
                        placeholder="https://company.com"
                        className="w-full px-4 py-3 rounded-2xl bg-[#F4F6FB] border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#162774]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-[#162774] uppercase tracking-wider mb-1.5">
                      What would you like to offer or collaborate on? *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={form.proposal}
                      onChange={(e) => setForm({ ...form, proposal: e.target.value })}
                      placeholder="Describe your tie-up idea, timelines, roles, campus details, or workshop/hackathon goals..."
                      className="w-full px-4 py-3 rounded-2xl bg-[#F4F6FB] border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#162774]"
                    />
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                    <span className="text-xs font-semibold text-slate-500">
                      Public partnership portal &bull; No login required
                    </span>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="group inline-flex items-center gap-3 pl-6 pr-2 py-2.5 rounded-full bg-[#162774] hover:bg-[#0d1952] text-white font-extrabold text-sm transition-all shadow-lg cursor-pointer disabled:opacity-60"
                    >
                      <span>{submitting ? "Submitting Proposal..." : "Submit Collaboration Proposal"}</span>
                      <span className="w-8 h-8 rounded-full bg-[#D9F83B] text-[#162774] flex items-center justify-center">
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-[60deg]" />
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
