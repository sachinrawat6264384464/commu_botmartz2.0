import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  Terminal,
  ShieldCheck,
  Award,
  Coins,
  Cpu,
  Layers,
  Code2,
  Users,
  Briefcase,
  Zap,
  Globe,
  Sparkles,
  Flame,
  Star,
  Check,
  ExternalLink,
  HelpCircle,
  Calendar,
  BookOpen
} from "lucide-react";
import { ARENA_PROJECTS, TOTAL_SYSTEMS_COUNT } from "@/lib/arena-projects";
import VirtualInternshipPricingClient from "./VirtualInternshipClient";
import InternshipJourneyClient from "./InternshipJourneyClient";
import { InsaneMatrixClient, FounderAuditPolicyClient } from "./InternshipLowerSectionsClient";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://community.botmartz.com";

export const metadata: Metadata = {
  title: "45-Day Virtual AI Engineering Fellowship — Project-Based Simulator | Botmartz",
  description:
    "Join India's project-based Virtual AI Internship & Engineering Fellowship. Build production LLM & LangGraph RAG projects, log daily GitHub proof-of-work, and earn QR-verifiable certificates.",
  keywords: [
    "virtual AI internship",
    "virtual AI internship India",
    "virtual AI internship for students",
    "virtual AI internship for freshers",
    "virtual software engineering internship India for freshers",
    "free virtual job simulations",
    "software engineer internship remote no experience",
    "project based AI internship India",
    "project based AI fellowship",
    "online internship with certificate",
    "AI internship work from home",
    "AI summer internship 2026 India",
    "AI engineering portfolio projects",
    "multi AI agent project GitHub",
    "LangGraph multi agent projects",
    "LangGraph RAG pipelines",
    "evidence-backed proof of work",
    "BCA MCA BTech AI internship",
    "Botmartz arena fellowship",
  ],
  alternates: {
    canonical: "/virtual-ai-internship",
  },
  openGraph: {
    title: "45-Day Virtual AI Engineering Fellowship | Botmartz",
    description:
      "Build real production AI systems. Conquer the Insane Project milestone to unlock Founder Code Audits, Verified Proof-of-Work, and Portfolio Recommendations.",
    url: `${SITE_URL}/virtual-ai-internship`,
    images: [{ url: "/logo.png", width: 1200, height: 630 }],
  },
};

const jsonLdProgram = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOccupationalProgram",
      name: "45-Day Project-Based Virtual AI Engineering Fellowship",
      description:
        "A structured, project-based engineering program where students build production AI systems, conquer top Insane projects, pass automated SLA gates, and unlock verified proof-of-work credentials.",
      provider: {
        "@type": "Organization",
        name: "Botmartz AI Solution Pvt Ltd",
        url: "https://community.botmartz.com",
      },
      educationalProgramMode: "online",
      timeToComplete: "P45D",
      offers: [
        {
          "@type": "Offer",
          name: "Open Builder (Free)",
          price: "0",
          priceCurrency: "INR",
          category: "Free",
        },
        {
          "@type": "Offer",
          name: "Verified Student Pass",
          price: "299",
          priceCurrency: "INR",
          category: "Micro-Ticket",
        },
        {
          "@type": "Offer",
          name: "Elite Founder Track",
          price: "1999",
          priceCurrency: "INR",
          category: "Mentorship",
        },
      ],
      occupationalCategory: "Artificial Intelligence Engineer",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is the requirement to get Founder Soham's Code Audit & Recommendation?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "You must complete and ship at least 1 top 'Insane Tier' production project (e.g. Satellite Geospatial AI, 3D MRI Segmentation, LangGraph Multi-Agent Checkpointer, or Rust L3 Order Book), pass all automated SLA benchmarks (<150ms latency, zero memory leaks), and submit verified daily GitHub commit logs.",
          },
        },
        {
          "@type": "Question",
          name: "Why is the Verified Pass priced at only ₹299?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We believe in radical student accessibility. ₹299 is a micro-commitment fee that covers cryptographic certificate generation and verification servers, while filtering out spammers so serious builders can thrive.",
          },
        },
        {
          "@type": "Question",
          name: "Do you guarantee jobs or salaries?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. We strictly do not sell or guarantee job placements. We provide an intensive practical simulator with real multi-table database schemas, daily GitHub commit tracking, and rigorous founder code teardowns so you can build an undeniable proof-of-work portfolio.",
          },
        },
        {
          "@type": "Question",
          name: "Is a virtual AI internship real and worth it for students and freshers?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, when it is project-based and evidence-backed. Unlike passive video courses, Botmartz requires daily GitHub commits, production system PRDs (LangGraph, RAG, eBPF, PostGIS), and automated SLA verification so recruiters can inspect your actual code.",
          },
        },
        {
          "@type": "Question",
          name: "Does this online AI internship provide a verifiable certificate?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Verified builders who complete their project milestones and daily proof-of-work logs receive a QR-verifiable cryptographic PDF certificate backed by their public GitHub commit history.",
          },
        },
        {
          "@type": "Question",
          name: "How do I build an AI engineering portfolio with LangGraph and RAG?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Inside the Botmartz Engineering Playground, you can pick production system PRDs covering LangGraph multi-agent workflows, enterprise RAG pipelines, and vector databases, then ship daily commits in an Agile sprint workspace.",
          },
        },
      ],
    },
  ],
};

export default function VirtualAIInternshipPage() {
  const insaneProjects = ARENA_PROJECTS.filter(
    (p) => p.difficulty === "Insane" || p.difficulty === "Expert Tier"
  ).slice(0, 6);

  return (
    <div
      className="bg-white text-slate-900 min-h-screen font-sans selection:bg-[#D9F83B] selection:text-slate-950"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(29, 49, 137, 0.11) 1px, transparent 1px), linear-gradient(to bottom, rgba(29, 49, 137, 0.11) 1px, transparent 1px)",
        backgroundSize: "72px 72px",
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdProgram) }}
      />

      {/* ── 1. HERO SECTION: FULL-WIDTH 2-COLUMN SPLIT LAYOUT ── */}
      <section className="pt-28 pb-16 border-b border-slate-200/80 relative overflow-hidden">
        <div className="w-full px-4 sm:px-8 lg:px-12 relative z-10">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* LEFT COLUMN: HEADLINE & ACTIONS */}
            <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">

              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#162774] text-white font-sans text-xs font-extrabold uppercase tracking-wider shadow-xs">
                <span>Virtual AI Engineering Fellowship</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black text-slate-950 tracking-tight leading-[1.08] font-sans">
                Stop Building Toy Apps. <br />
                Build{" "}
                <span className="text-[#1D3189]">
                  Production-Grade Systems
                </span>{" "}
                With Verifiable Proof of Work.
              </h1>

              <div className="flex flex-wrap items-center gap-4 font-sans text-xs pt-2">
                <a
                  href="#pricing"
                  className="px-7 py-3.5 rounded-2xl bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-bold transition-all shadow-lg shadow-lime-400/20 flex items-center gap-2.5 cursor-pointer group"
                >
                  <span>View Enrollment Plans (Free / ₹299)</span>
                  <span className="w-6 h-6 rounded-full bg-slate-950 text-[#D9F83B] flex items-center justify-center transition-transform duration-300 group-hover:rotate-45">
                    <ArrowRight size={13} />
                  </span>
                </a>

                <Link
                  href="/arena"
                  className="px-7 py-3.5 rounded-2xl bg-[#070E54] hover:bg-[#1D3189] text-white font-bold transition-all shadow-md"
                >
                  Explore Internship Playground
                </Link>
              </div>

            </div>

            {/* RIGHT COLUMN: EDITORIAL PROOF-OF-WORK TELEMETRY CARD */}
            <div className="lg:col-span-5 w-full">
              <div
                className="bg-[#070E54] text-white rounded-3xl p-6 sm:p-7 border border-white/15 shadow-2xl relative overflow-hidden font-sans"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
                  backgroundSize: "44px 44px",
                }}
              >
                {/* Header bar (No colored dots) */}
                <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-5">
                  <div>
                    <div className="text-[10px] font-extrabold uppercase tracking-widest text-blue-200">
                      Architecture &amp; SLA Telemetry
                    </div>
                    <div className="text-sm font-extrabold text-white mt-0.5">
                      Production Proof-of-Work Engine
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white text-[#162774] text-[10px] font-extrabold uppercase tracking-wider shrink-0">
                    Live Runner
                  </span>
                </div>

                {/* 2-Column Benchmark Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-white/[0.07] border border-white/15 border-l-4 border-l-white space-y-1.5 hover:bg-white/[0.12] transition-all duration-300">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase text-blue-200/80">01 • Agents</span>
                      <span className="text-white font-extrabold text-[10px]">SLA PASS</span>
                    </div>
                    <div className="font-bold text-white text-xs leading-snug">LangGraph Checkpointer</div>
                    <div className="text-[11px] text-blue-200/80 pt-1 border-t border-white/10">
                      p95: <strong className="text-white">42ms</strong> &bull; Leak: <strong className="text-white">0 KB</strong>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/[0.07] border border-white/15 border-l-4 border-l-white space-y-1.5 hover:bg-white/[0.12] transition-all duration-300">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase text-blue-200/80">02 • Retrieval</span>
                      <span className="text-white font-extrabold text-[10px]">SLA PASS</span>
                    </div>
                    <div className="font-bold text-white text-xs leading-snug">Qdrant Hybrid BM25 RAG</div>
                    <div className="text-[11px] text-blue-200/80 pt-1 border-t border-white/10">
                      P@5: <strong className="text-white">96.4%</strong> &bull; RAGAS: <strong className="text-white">0.94</strong>
                    </div>
                  </div>
                </div>

                {/* Streak Heatmap */}
                <div className="p-4 rounded-2xl bg-white/[0.07] border border-white/15 space-y-3 mb-4 text-xs">
                  <div className="flex items-center justify-between text-xs text-blue-100 font-bold">
                    <span>4-Week Proof-of-Work Streak</span>
                    <span className="text-white font-extrabold">100% VERIFIED</span>
                  </div>

                  <div className="grid grid-cols-9 gap-1.5">
                    {Array.from({ length: 27 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-3.5 rounded-md transition-all ${i % 4 === 0
                          ? "bg-white"
                          : i % 3 === 0
                            ? "bg-blue-300"
                            : i % 2 === 0
                              ? "bg-emerald-400"
                              : "bg-white/20"
                          }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Founder Technical Audit Footer */}
                <div className="p-4 rounded-2xl bg-white/[0.09] border border-white/15 flex items-center justify-between gap-3">
                  <div>
                    <div className="font-extrabold text-white text-xs font-sans">Founder Technical Audit</div>
                    <div className="text-[11px] text-blue-200/80 mt-0.5">Governed &amp; Reviewed by Soham Sharma</div>
                  </div>
                  <Link
                    href="/login"
                    className="px-4 py-2.5 rounded-xl bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 text-xs font-bold transition-all shrink-0 cursor-pointer shadow-md flex items-center gap-2 group"
                  >
                    <span>Start Sprint</span>
                    <span className="w-5 h-5 rounded-full bg-slate-950 text-[#D9F83B] flex items-center justify-center transition-transform duration-300 group-hover:rotate-45">
                      <ArrowRight size={11} />
                    </span>
                  </Link>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── 2 & 3. MILESTONE JOURNEY + SATURDAY OFFICE HOURS (SCROLL ANIMATED) ── */}
      <InternshipJourneyClient />

      {/* ── 4. FEATURED INSANE PROJECTS (SPLIT & BLUR SCROLL ANIMATION) ── */}
      <InsaneMatrixClient insaneProjects={insaneProjects} />

      {/* ── 5. TRANSPARENT 3-TIER PRICING TABLE (₹0 / ₹299 / ₹1,999) ── */}
      <section id="pricing" className="py-20 border-b border-slate-200/80">
        <div className="w-full px-4 sm:px-8 lg:px-12">

          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#D9F83B] text-slate-950 font-sans text-[11px] font-extrabold uppercase tracking-wider mb-3">
              Accessible &amp; Honest Pricing
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight font-sans">
              Choose Your Engineering Track
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm font-sans mt-2 font-medium">
              Free for self-learners, ₹299 for verified credentials, and ₹1,999 for 1-on-1 founder code audits &amp; recommendations.
            </p>
          </div>

          <VirtualInternshipPricingClient />

        </div>
      </section>

      {/* ── 6. STRICT CRITERIA POLICY (SPLIT & BLUR + CIRCLE ARROWS) ── */}
      <FounderAuditPolicyClient />

      {/* ── 7. FAQ ── */}
      <section className="py-20">
        <div className="w-full px-4 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight font-sans">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm font-sans mt-2 font-medium">
              Everything about the fellowship, pricing tiers, and founder code reviews.
            </p>
          </div>

          <div className="space-y-4 font-sans text-xs max-w-4xl mx-auto">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 border-l-4 border-l-[#D9F83B] hover:border-[#1D3189] hover:-translate-y-0.5 transition-all duration-300 shadow-xs">
              <h4 className="font-extrabold text-slate-950 text-sm font-sans mb-2">
                What is the requirement to get Founder Soham&apos;s Recommendation?
              </h4>
              <p className="text-slate-600 leading-relaxed font-medium">
                You must complete and ship at least 1 top &quot;Insane Tier&quot; production project, pass all automated SLA benchmarks (&lt;150ms latency, zero memory leaks), and maintain active daily GitHub commits.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 border-l-4 border-l-[#D9F83B] hover:border-[#1D3189] hover:-translate-y-0.5 transition-all duration-300 shadow-xs">
              <h4 className="font-extrabold text-slate-950 text-sm font-sans mb-2">
                Why is the Verified Pass priced at ₹299?
              </h4>
              <p className="text-slate-600 leading-relaxed font-medium">
                We believe in radical student accessibility. ₹299 covers cryptographic credential generation and cloud test verification infrastructure while filtering out non-serious builders.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 border-l-4 border-l-[#D9F83B] hover:border-[#1D3189] hover:-translate-y-0.5 transition-all duration-300 shadow-xs">
              <h4 className="font-extrabold text-slate-950 text-sm font-sans mb-2">
                Do you offer job guarantees?
              </h4>
              <p className="text-slate-600 leading-relaxed font-medium">
                No. We strictly do not offer or guarantee job placements. We provide an intensive practical simulator with real multi-table database schemas, daily GitHub commit tracking, and rigorous founder code teardowns to help you build an undeniable portfolio.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
