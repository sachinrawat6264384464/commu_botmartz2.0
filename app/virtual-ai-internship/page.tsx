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

export const metadata: Metadata = {
  title: "45-Day Virtual AI Engineering Fellowship — Project-Based Simulator | Botmartz",
  description:
    "Build production-grade AI systems, conquer high-difficulty SLA benchmarks, log daily GitHub proof-of-work, and earn Founder Soham Sharma's code audit and portfolio recommendation. Plans from Free to ₹299 & ₹1,999.",
  keywords: [
    "virtual AI internship India",
    "project based AI fellowship",
    "AI engineering portfolio projects",
    "LangGraph multi agent projects",
    "system design portfolio projects",
    "Botmartz arena fellowship",
  ],
  alternates: {
    canonical: "/virtual-ai-internship",
  },
  openGraph: {
    title: "45-Day Virtual AI Engineering Fellowship | Botmartz",
    description:
      "Build real production AI systems. Conquer the Insane Project milestone to unlock Founder Code Audits, Verified Proof-of-Work, and Portfolio Recommendations.",
    url: "https://community.botmartz.com/virtual-ai-internship",
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
      <section className="pt-8 pb-16 border-b border-slate-200/80 relative overflow-hidden">
        <div className="w-full px-4 sm:px-8 lg:px-12 relative z-10">
          
          {/* Transparency & Integrity Callout */}
          <div className="mb-8 p-4 rounded-2xl bg-[#070E54] border border-white/15 text-blue-100 font-sans text-xs text-center leading-relaxed shadow-md">
            <strong className="text-[#D9F83B]">Honest Engineering Notice:</strong> Botmartz is an intensive, practical software simulator. We do not sell or guarantee job placements or salaries. We provide real production architectures, daily GitHub commit tracking, and founder code teardowns to help you build an undeniable portfolio.
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* LEFT COLUMN: HEADLINE, SUBHEAD & ACTIONS */}
            <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D9F83B] text-slate-950 font-sans text-xs font-extrabold uppercase tracking-wider shadow-xs">
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

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans max-w-2xl font-medium">
                Tackle {TOTAL_SYSTEMS_COUNT} industrial PRDs with real multi-table relational/vector schemas, REST/gRPC APIs, Docker containers, and strict latency SLA test gates (&lt;150ms). Submit daily commits, build your streak, and earn Founder Soham Sharma&apos;s technical code audits.
              </p>

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
                  Explore {TOTAL_SYSTEMS_COUNT} PRD Blueprints
                </Link>
              </div>

              {/* Quick Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full pt-6 border-t border-slate-200/80 font-sans text-xs">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 border-l-4 border-l-[#D9F83B] shadow-xs">
                  <div className="text-xl font-black text-slate-950">{TOTAL_SYSTEMS_COUNT} Systems</div>
                  <div className="text-slate-500 text-[11px] mt-0.5 font-semibold">Production PRDs</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 border-l-4 border-l-[#D9F83B] shadow-xs">
                  <div className="text-xl font-black text-emerald-600">&lt;150ms</div>
                  <div className="text-slate-500 text-[11px] mt-0.5 font-semibold">Strict SLA Gates</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 border-l-4 border-l-[#D9F83B] shadow-xs">
                  <div className="text-xl font-black text-[#1D3189]">4-Week</div>
                  <div className="text-slate-500 text-[11px] mt-0.5 font-semibold">Daily GitHub Log</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 border-l-4 border-l-[#D9F83B] shadow-xs">
                  <div className="text-xl font-black text-slate-950">Weekly</div>
                  <div className="text-slate-500 text-[11px] mt-0.5 font-semibold">Founder Reviews</div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: HIGH-TECH LIVE FELLOWSHIP SIMULATOR TERMINAL CARD */}
            <div className="lg:col-span-5 w-full">
              <div className="bg-[#070E54] text-white rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl relative overflow-hidden font-sans">
                {/* Header bar */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-xs text-slate-400 font-bold ml-2">botmartz-pow-simulator.v2</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    LIVE RUNNER
                  </span>
                </div>

                {/* Simulated Benchmarks */}
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/15 space-y-2 hover:border-[#D9F83B]/50 transition-all duration-300">
                    <div className="flex items-center justify-between text-blue-100">
                      <span className="font-bold text-white">LangGraph Multi-Agent Checkpointer</span>
                      <span className="text-[#D9F83B] font-bold text-[11px]">SLA PASS</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-blue-200/80 pt-1 border-t border-white/10">
                      <span>p95 Latency: <strong className="text-white">42ms</strong> (&lt;150ms)</span>
                      <span>Memory Leak: <strong className="text-[#D9F83B]">0 KB</strong></span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/15 space-y-2 hover:border-[#D9F83B]/50 transition-all duration-300">
                    <div className="flex items-center justify-between text-blue-100">
                      <span className="font-bold text-white">Enterprise Qdrant Hybrid BM25 RAG</span>
                      <span className="text-[#D9F83B] font-bold text-[11px]">SLA PASS</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-blue-200/80 pt-1 border-t border-white/10">
                      <span>Precision @ k=5: <strong className="text-white">96.4%</strong></span>
                      <span>RAGAS Score: <strong className="text-[#D9F83B]">0.94</strong></span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/15 space-y-3">
                    <div className="flex items-center justify-between text-xs text-blue-100 font-bold">
                      <span>4-Week Proof-of-Work Streak</span>
                      <span className="text-[#D9F83B]">100% VERIFIED</span>
                    </div>
                    
                    {/* Simulated Heatmap Grid */}
                    <div className="grid grid-cols-9 gap-1.5 pt-1">
                      {Array.from({ length: 27 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-4 rounded-sm transition-all ${
                            i % 4 === 0
                              ? "bg-[#D9F83B]"
                              : i % 3 === 0
                              ? "bg-[#D9F83B]/75"
                              : i % 2 === 0
                              ? "bg-emerald-400"
                              : "bg-white/20"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Founder Recommendation Tag */}
                  <div className="p-4 rounded-2xl bg-white/[0.08] border border-white/15 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-white text-xs font-sans">Founder Technical Audit</div>
                      <div className="text-[10px] text-blue-200/80 mt-0.5">Governed &amp; Reviewed by Soham Sharma</div>
                    </div>
                    <Link
                      href="/login"
                      className="px-4 py-2 rounded-xl bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 text-[11px] font-bold transition-all shrink-0 cursor-pointer shadow-md"
                    >
                      Start Sprint &rarr;
                    </Link>
                  </div>

                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── 2 & 3. MILESTONE JOURNEY + SATURDAY OFFICE HOURS (SCROLL ANIMATED) ── */}
      <InternshipJourneyClient />

      {/* ── 4. FEATURED INSANE PROJECTS ── */}
      <section className="py-20 bg-[#070E54] text-white border-b border-white/10">
        <div className="w-full px-4 sm:px-8 lg:px-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#D9F83B] text-slate-950 font-sans text-[11px] font-extrabold uppercase tracking-wider mb-3">
                The Crucial Milestone
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
                The &quot;Insane&quot; Projects Matrix
              </h2>
              <p className="text-blue-100/80 text-xs sm:text-sm font-sans mt-1.5">
                Completing any of these 6 production systems unlocks Founder Code Audit &amp; Recommendation eligibility.
              </p>
            </div>

            <Link
              href="/arena"
              className="px-6 py-3 rounded-2xl bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-sans text-xs font-bold transition-all duration-300 shrink-0 hover:-translate-y-0.5"
            >
              Explore All {TOTAL_SYSTEMS_COUNT} PRDs &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans text-xs">
            {insaneProjects.map((p) => (
              <div
                key={p.id}
                className="relative overflow-hidden p-6 rounded-3xl bg-white/[0.06] border border-white/15 flex flex-col justify-between hover:border-[#D9F83B]/60 hover:-translate-y-1.5 transition-all duration-500 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#D9F83B] text-slate-950 font-bold text-[10px] uppercase">
                      {p.difficulty}
                    </span>
                    <span className="text-[11px] text-blue-200/80 font-semibold">{p.durationDays} Days Sprint</span>
                  </div>

                  <h3 className="text-base font-extrabold text-white font-sans mb-1.5 group-hover:text-[#D9F83B] transition-colors duration-300">
                    {p.title}
                  </h3>
                  <p className="text-blue-100/80 text-xs font-sans line-clamp-3 mb-4 leading-relaxed">
                    {p.overview}
                  </p>

                  <div className="p-3 rounded-xl bg-black/25 border border-white/10 text-[11px] text-blue-100 mb-4">
                    <span className="text-[#D9F83B] font-bold">Strict SLA:</span> {p.productionSla}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {p.techStack.slice(0, 2).map((t, ti) => (
                      <span key={ti} className="text-[10px] text-blue-100 bg-white/10 px-2.5 py-1 rounded-lg font-semibold">
                        {t}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/arena/${p.slug || p.id}`}
                    className="px-4 py-2 rounded-xl bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-bold text-xs transition-all duration-300"
                  >
                    View PRD &rarr;
                  </Link>
                </div>

                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1.5 bg-[#D9F83B] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-in-out" />
              </div>
            ))}
          </div>

        </div>
      </section>

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

      {/* ── 6. STRICT CRITERIA POLICY ── */}
      <section className="py-16 border-b border-slate-200/80">
        <div className="w-full px-4 sm:px-8 lg:px-12">
          
          <div className="p-8 sm:p-10 rounded-3xl bg-[#070E54] text-white border border-white/15 shadow-2xl">
            <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#D9F83B] text-slate-950 font-sans text-[11px] font-extrabold uppercase tracking-wider mb-4">
              Strict Meritocracy Policy
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-sans mb-3">
              How Founder Code Audit &amp; Recommendation Works
            </h3>
            
            <p className="text-blue-100/85 font-sans text-xs sm:text-sm leading-relaxed mb-6">
              We enforce authentic engineering rigor. Founder Soham Sharma reviews your code and writes your portfolio recommendation <strong className="text-white">only when you meet these strict gates:</strong>
            </p>

            <div className="space-y-3 font-sans text-xs text-blue-100/90">
              <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/15 flex items-start gap-3 hover:border-[#D9F83B]/50 transition-all duration-300">
                <span className="w-6 h-6 rounded-full bg-[#D9F83B] text-slate-950 font-extrabold flex items-center justify-center shrink-0">1</span>
                <div>
                  <strong className="text-white">Conquer 1 Insane-Tier Project:</strong> Must complete either Satellite AI, 3D MRI UNETR, Rust Order Book, LangGraph Multi-Agent Swarm, or Linux Kernel eBPF.
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/15 flex items-start gap-3 hover:border-[#D9F83B]/50 transition-all duration-300">
                <span className="w-6 h-6 rounded-full bg-[#D9F83B] text-slate-950 font-extrabold flex items-center justify-center shrink-0">2</span>
                <div>
                  <strong className="text-white">Zero-Tolerance SLA Benchmarking:</strong> System must pass automated tests (p95 latency &lt; 150ms, &gt;85% test coverage, zero memory leaks).
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/15 flex items-start gap-3 hover:border-[#D9F83B]/50 transition-all duration-300">
                <span className="w-6 h-6 rounded-full bg-[#D9F83B] text-slate-950 font-extrabold flex items-center justify-center shrink-0">3</span>
                <div>
                  <strong className="text-white">Daily Heatmap Proof-of-Work:</strong> Must maintain an active commit streak on GitHub with clear PR descriptions and architectural reasoning.
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
              <span className="text-blue-200/85 font-sans text-xs font-medium">
                Meet the criteria &rarr; Founder Recommendation unlocked.
              </span>
              <Link
                href="/arena"
                className="px-5 py-2.5 rounded-xl bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-sans text-xs font-bold transition-all"
              >
                Pick an Insane Project &rarr;
              </Link>
            </div>
          </div>

        </div>
      </section>

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
