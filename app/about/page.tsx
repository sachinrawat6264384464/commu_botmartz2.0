"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { TOTAL_SYSTEMS_COUNT } from "@/lib/arena-projects";

const CORE_PROGRAMS = [
  {
    num: "01",
    tag: "Competitions",
    title: "Virtual & Offline Hackathons",
    summary:
      "We organize high-intensity 24-hour online hackathons and in-person offline hackathons where solo builders and teams ship working production software under real deadlines.",
    points: [
      "24-hour virtual sprints with instant Unique ID verification and live judging",
      "In-person offline hackathons & architecture teardowns at our Indore Tech Hub",
      "Direct qualification for job screening rounds and founder recommendation letters",
    ],
    href: "/hackathons",
    cta: "Explore Hackathons",
  },
  {
    num: "02",
    tag: "Skill Building",
    title: "Industrial Training & Bootcamps",
    summary:
      "Structured, production-focused technical training covering modern AI engineering, backend architecture, distributed systems, and deployment workflows.",
    points: [
      "Domain-wise progressive roadmaps across AI Agents, Hybrid RAG, Cloud & Systems",
      "Zero toy examples — every module focuses on real-world production patterns",
      "Step-by-step prerequisites, system design checklists, and stage milestones",
    ],
    href: "/arena/roadmaps",
    cta: "View Career Roadmaps",
  },
  {
    num: "03",
    tag: "Live Practice",
    title: "Hands-On Workshops & Technical Clinics",
    summary:
      "Interactive live workshops where engineers build, benchmark, and debug production pipelines together instead of watching passive slide decks.",
    points: [
      "Deep-dive sessions on LangGraph, Vector Search, Docker, eBPF, and WebGPU",
      "Live latency profiling, API contract validation, and k6 load testing clinics",
      "Full session recordings, starter repositories, and architecture notes included",
    ],
    href: "/workshops",
    cta: "Browse Workshops",
  },
  {
    num: "04",
    tag: "Guidance",
    title: "1-on-1 Mentorship & Founder Sessions",
    summary:
      "Direct mentorship and weekly live office hours led by Founder Soham Sharma and senior architects to review your code, unblock bottlenecks, and guide your career.",
    points: [
      "Weekly Saturday Technical Office Hours for live architecture & schema reviews",
      "1-on-1 code audits, latency debugging, and personalized engineering feedback",
      "Wednesday Resume & LinkedIn teardowns tailored for AI & systems roles",
    ],
    href: "/virtual-ai-internship",
    cta: "Explore Mentorship",
  },
  {
    num: "05",
    tag: "Resume-Ready Work",
    title: "Real-World Internship & Company-Grade Projects",
    summary: `Access ${TOTAL_SYSTEMS_COUNT}+ industrial-grade project blueprints modeled after real company engineering tickets — built specifically so you can showcase authentic production systems on your resume.`,
    points: [
      "Real company problem statements with database schemas, SLAs & test gates",
      "Daily Git commit proof-of-work tracking across a structured 45-day sprint",
      "Resume-ready deployed projects & public GitHub repositories recruiters trust",
    ],
    href: "/arena",
    cta: `Browse ${TOTAL_SYSTEMS_COUNT}+ Systems`,
  },
  {
    num: "06",
    tag: "Hiring & Evaluation",
    title: "Job Providers & Candidate Evaluation",
    summary:
      "We bridge the gap between builders and hiring companies by replacing unverified resumes with cryptographically verifiable proof-of-work dossiers.",
    points: [
      "Instant verification of candidate certificates via SHA-256 ledger & QR codes",
      "Clear evaluation metrics: commit streaks, SLA benchmarks, and live demos",
      "Direct referrals & job screening access for top-performing builders",
    ],
    href: "/certificates",
    cta: "Verify Credentials",
  },
];

export default function AboutPage() {
  return (
    <div
      className="bg-white min-h-screen text-slate-900 pt-24 pb-16 font-sans selection:bg-[#D9F83B] selection:text-slate-950"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(29, 49, 137, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(29, 49, 137, 0.08) 1px, transparent 1px)",
        backgroundSize: "72px 72px",
      }}
    >
      <div className="w-full px-4 sm:px-8 lg:px-12 space-y-12 relative z-10">
        {/* ── 1. HERO BANNER ── */}
        <section
          className="rounded-3xl bg-[#162774] text-white p-7 sm:p-11 border border-white/15 shadow-2xl space-y-8"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#D9F83B] text-slate-950 text-[11px] font-extrabold uppercase tracking-wider">
                About Botmartz Community &bull; Production Engineering Ecosystem
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                Where Builders Ship <span className="text-[#D9F83B]">Real Systems</span> &amp; Companies Discover Proven Talent
              </h1>

              <p className="text-xs sm:text-sm text-blue-100/85 leading-relaxed">
                Botmartz Community is an applied engineering and talent-evaluation platform. Through virtual and offline hackathons, industrial training, hands-on workshops, 1-on-1 mentorship, and company-grade internship projects, we help engineers build undeniable, resume-ready proof-of-work — and make it effortless for job providers to evaluate real skill.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <Link
                href="/arena"
                className="group relative overflow-hidden px-6 py-3.5 rounded-full bg-[#D9F83B] text-slate-950 font-extrabold text-xs sm:text-sm transition-all flex items-center justify-between gap-3 shadow-lg cursor-pointer"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-white -translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out"
                />
                <span className="relative z-10">Explore {TOTAL_SYSTEMS_COUNT}+ Systems</span>
                <span className="relative z-10 w-7 h-7 rounded-full bg-slate-950 text-[#D9F83B] flex items-center justify-center transition-transform duration-300 group-hover:rotate-45">
                  <ArrowRight size={13} />
                </span>
              </Link>

              <Link
                href="/hackathons"
                className="group relative overflow-hidden px-6 py-3 rounded-full bg-white/10 text-white border border-white/25 hover:border-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-white -translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out"
                />
                <span className="relative z-10 group-hover:text-slate-950 transition-colors duration-500">
                  Join Next Hackathon
                </span>
              </Link>
            </div>
          </div>

          {/* 4 Key Ecosystem Highlights */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {[
              { num: "01", title: "Virtual & Offline", sub: "24h & In-Person Hackathons" },
              { num: "02", title: "Training & Workshops", sub: "Hands-On Production Tracks" },
              { num: "03", title: "Founder Mentorship", sub: "Live Audits & Office Hours" },
              { num: "04", title: "Resume-Grade Projects", sub: "Built for Job Evaluation" },
            ].map((stat) => (
              <div
                key={stat.num}
                className="relative p-4 rounded-2xl bg-white/[0.06] border border-white/15 border-l-4 border-l-[#D9F83B]"
              >
                <span className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-[#D9F83B] text-slate-950 font-extrabold text-[10px] flex items-center justify-center">
                  {stat.num}
                </span>
                <div className="text-white font-extrabold text-sm pr-7">{stat.title}</div>
                <div className="text-blue-200/80 text-[11px] mt-0.5">{stat.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 2. WHAT WE DO — 6 DEDICATED PILLARS (SEPARATE, STRUCTURED, NO MASHUP) ── */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <span className="inline-block px-3.5 py-1 rounded-full bg-[#162774] text-[#D9F83B] text-[11px] font-extrabold uppercase tracking-wider mb-2">
                What We Do at Botmartz
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                Six Distinct Programs. One Clear Mission.
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md font-medium">
              Every initiative is designed separately with clear outcomes — from learning and mentorship to real company-grade projects and hiring evaluation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CORE_PROGRAMS.map((item, idx) => (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.55, delay: (idx % 3) * 0.08, ease: "easeOut" }}
                className="relative overflow-hidden rounded-3xl bg-[#F4F6FB] hover:bg-white border border-slate-200 border-l-4 border-l-[#D9F83B] hover:border-[#162774] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between group"
              >
                <div className="p-6 sm:p-7 pb-5 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="w-8 h-8 rounded-full bg-[#D9F83B] group-hover:bg-[#162774] text-slate-950 group-hover:text-[#D9F83B] font-extrabold text-xs flex items-center justify-center transition-colors duration-500">
                      {item.num}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-[#162774] text-[10px] font-extrabold uppercase tracking-wider">
                      {item.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-950 group-hover:text-[#162774] transition-colors mb-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[13px] text-slate-700 leading-relaxed font-medium">
                      {item.summary}
                    </p>
                  </div>

                  <ul className="space-y-2 pt-2 border-t border-slate-200/80 text-[13px] text-slate-800 font-medium">
                    {item.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#162774] mt-1.5 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Grid Slide Hover Strip */}
                <Link
                  href={item.href}
                  className="relative overflow-hidden px-6 sm:px-7 py-4 border-t border-slate-200/80 group-hover:border-[#162774] flex items-center justify-between text-xs font-extrabold transition-colors duration-500"
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[#162774] -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
                      backgroundSize: "28px 28px",
                    }}
                  />
                  <span className="relative z-10 text-[#162774] group-hover:text-[#D9F83B] transition-colors duration-500 uppercase tracking-wider">
                    {item.cta}
                  </span>
                  <span className="relative z-10 w-7 h-7 rounded-full bg-white group-hover:bg-[#D9F83B] text-slate-900 flex items-center justify-center transition-all duration-500 group-hover:rotate-45 shadow-2xs">
                    <ArrowRight size={13} />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── 3. TWO-SIDED VALUE: FOR BUILDERS VS FOR JOB PROVIDERS ── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Left: For Students & Engineers */}
          <div className="rounded-3xl bg-[#F4F6FB] border border-slate-200 border-l-4 border-l-[#D9F83B] p-7 sm:p-9 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="inline-block px-3.5 py-1 rounded-full bg-[#162774] text-[#D9F83B] text-[10px] font-extrabold uppercase tracking-wider">
                For Builders &amp; Students
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 leading-snug">
                Turn Company-Grade Projects Into Resume &amp; Interview Leverage
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Instead of listing generic tutorials on your resume, you build real production architectures modeled after actual company engineering workflows — complete with Git history, load benchmarks, and deployed demos.
              </p>

              <div className="space-y-2.5 pt-2 text-xs text-slate-700">
                {[
                  "Add verified, high-impact system engineering projects directly to your resume & LinkedIn",
                  "Practice real SDLC: PRDs, Kanban sprints, API testing, and production deployment",
                  "Earn SHA-256 verified completion certificates & founder recommendation letters",
                  "Get direct visibility with hiring managers through hackathons and Proof-of-Work showcases",
                ].map((line, i) => (
                  <div
                    key={line}
                    className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80"
                  >
                    <span className="w-6 h-6 rounded-full bg-[#D9F83B] text-slate-950 font-extrabold text-[10px] flex items-center justify-center shrink-0">
                      0{i + 1}
                    </span>
                    <span className="font-medium leading-relaxed">{line}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/virtual-ai-internship"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#162774] hover:bg-[#1D3189] text-[#D9F83B] text-xs font-extrabold transition-all group"
              >
                <span>Start Your 45-Day Internship</span>
                <span className="w-6 h-6 rounded-full bg-[#D9F83B] text-slate-950 flex items-center justify-center transition-transform duration-300 group-hover:rotate-45">
                  <ArrowRight size={12} />
                </span>
              </Link>
            </div>
          </div>

          {/* Right: For Job Providers & Hiring Companies */}
          <div
            className="rounded-3xl bg-[#162774] text-white border border-white/15 border-l-4 border-l-[#D9F83B] p-7 sm:p-9 space-y-5 flex flex-col justify-between shadow-xl"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          >
            <div className="space-y-4">
              <span className="inline-block px-3.5 py-1 rounded-full bg-[#D9F83B] text-slate-950 text-[10px] font-extrabold uppercase tracking-wider">
                For Job Providers &amp; Hiring Partners
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
                Evaluate Engineers by Real Code, SLAs &amp; Verified Proof-of-Work
              </h2>
              <p className="text-xs sm:text-sm text-blue-100/85 leading-relaxed">
                Hiring teams and job providers do not have to guess from inflated resumes. Every Botmartz candidate comes with auditable engineering proof you can verify in seconds.
              </p>

              <div className="space-y-2.5 pt-2 text-xs">
                {[
                  "Verifiable Git Commit History: Inspect daily shipping discipline and actual pull requests",
                  "Automated SLA Benchmarks: Confirm systems pass real latency, coverage & load gates",
                  "Founder-Audited Recommendations: Code quality vetted through technical defense reviews",
                  "Instant Credential Lookup: Verify every candidate ID and QR certificate on our public ledger",
                ].map((line, i) => (
                  <div
                    key={line}
                    className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.08] border border-white/15"
                  >
                    <span className="w-6 h-6 rounded-full bg-[#D9F83B] text-slate-950 font-extrabold text-[10px] flex items-center justify-center shrink-0">
                      0{i + 1}
                    </span>
                    <span className="text-blue-50 font-medium leading-relaxed">{line}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/certificates"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 text-xs font-extrabold transition-all group"
              >
                <span>Verify Candidate Credentials</span>
                <span className="w-6 h-6 rounded-full bg-slate-950 text-[#D9F83B] flex items-center justify-center transition-transform duration-300 group-hover:rotate-45">
                  <ArrowRight size={12} />
                </span>
              </Link>
              <Link
                href="/showcase"
                className="inline-flex items-center px-5 py-3 rounded-full bg-white/10 hover:bg-white hover:text-slate-950 text-white border border-white/25 text-xs font-bold transition-all"
              >
                View Live Showcases
              </Link>
            </div>
          </div>
        </section>

        {/* ── 4. BOTTOM CALL TO ACTION ── */}
        <section
          className="rounded-3xl bg-[#162774] text-white p-8 sm:p-12 border border-white/15 shadow-2xl text-center space-y-5"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        >
          <span className="inline-block px-4 py-1 rounded-full bg-[#D9F83B] text-slate-950 text-[11px] font-extrabold uppercase tracking-wider">
            Indore Tech Hub &amp; Global Remote Community
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold max-w-3xl mx-auto tracking-tight">
            Ready to Build With Us or Hire Verified Engineers?
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/85 max-w-2xl mx-auto leading-relaxed">
            Whether you are an engineer looking to ship real company-level projects or a hiring team seeking battle-tested talent, Botmartz gives you the infrastructure and proof you need.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/login"
              className="px-7 py-3.5 rounded-full bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2.5 group"
            >
              <span>Join Botmartz Community</span>
              <span className="w-6 h-6 rounded-full bg-slate-950 text-[#D9F83B] flex items-center justify-center transition-transform duration-300 group-hover:rotate-45">
                <ArrowRight size={12} />
              </span>
            </Link>
            <a
              href="mailto:team@botmartz.com?subject=Hiring%20%26%20Partnership%20Inquiry"
              className="px-7 py-3.5 rounded-full bg-white/10 hover:bg-white hover:text-slate-950 text-white border border-white/25 font-bold text-xs sm:text-sm transition-all"
            >
              Partner With Us (team@botmartz.com)
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
