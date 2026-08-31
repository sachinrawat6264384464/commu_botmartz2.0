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
import { ARENA_PROJECTS } from "@/lib/arena-projects";
import VirtualInternshipPricingClient from "./VirtualInternshipClient";

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
    <div className="bg-[#FAFCFF] text-slate-900 min-h-screen font-sans selection:bg-[#0066FF] selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdProgram) }}
      />

      {/* ── 1. HERO SECTION ── */}
      <section className="pt-24 pb-16 bg-white border-b border-slate-200 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Transparency & Integrity Callout */}
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 font-mono text-xs text-center leading-relaxed">
            <strong>Honest Engineering Notice:</strong> Botmartz is an intensive, practical software simulator. We do not sell or guarantee job placements or salaries. We provide real production architectures, daily GitHub commit tracking, and founder code teardowns to help you build an undeniable portfolio.
          </div>

          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-[#0066FF] font-mono text-xs font-bold uppercase tracking-wider mb-4 border border-blue-200">
              <Sparkles size={14} /> 45-Day Virtual AI Engineering Fellowship
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6 font-sans">
              Stop Building Toy Apps. Build{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] to-blue-700">
                Production-Grade Systems
              </span>{" "}
              With Verifiable Proof of Work.
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8 max-w-3xl font-mono text-xs sm:text-sm">
              Tackle 50 industrial PRDs with real multi-table relational/vector schemas, REST/gRPC APIs, Docker containers, and strict latency SLA test gates (&lt;150ms). Submit daily commits, build your streak, and earn Founder Soham Sharma&apos;s technical code audits.
            </p>

            <div className="flex flex-wrap items-center gap-4 font-mono text-xs">
              <a
                href="#pricing"
                className="px-8 py-4 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold uppercase tracking-wider transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
              >
                <span>View Enrollment Plans (Free / ₹299)</span>
                <ArrowRight size={16} />
              </a>
              <Link
                href="/arena"
                className="px-8 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold uppercase tracking-wider transition-all border border-slate-300"
              >
                Explore 50 PRD Blueprints
              </Link>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-slate-100 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-2xl font-black text-slate-900 font-sans">50 Systems</div>
              <div className="text-slate-500 text-[11px] mt-0.5">Production PRDs &amp; Schemas</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-2xl font-black text-emerald-600 font-sans">&lt;150ms</div>
              <div className="text-slate-500 text-[11px] mt-0.5">Strict SLA Latency Gates</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-2xl font-black text-blue-600 font-sans">45 Days</div>
              <div className="text-slate-500 text-[11px] mt-0.5">Daily Commit Proof-of-Work</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-2xl font-black text-purple-600 font-sans">Weekly</div>
              <div className="text-slate-500 text-[11px] mt-0.5">Saturday Founder Office Hours</div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 2. HOW THE FELLOWSHIP WORKS ── */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-[#0066FF] font-mono text-xs font-bold uppercase tracking-wider mb-3 border border-blue-200">
              <Layers size={14} /> The 3-Step Milestone Journey
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-sans">
              How You Build Your Engineering Portfolio
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm font-mono mt-2">
              Follow our clear 3-step pipeline to transform from a student to a production engineer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 font-mono text-xs">
            
            {/* Step 1 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-blue-300 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#0066FF] text-white font-black text-lg flex items-center justify-center mb-6 shadow-md shadow-blue-500/20">
                  01
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 font-sans">
                  Enroll &amp; Start Daily Sprints
                </h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Select an enrolled project from the 50 PRD blueprints. Read the schema requirements, initialize your repository, and log daily commits on <Link href="/arena/daily-log" className="text-[#0066FF] underline font-bold">/arena/daily-log</Link>.
                </p>
              </div>
              <div className="text-[#0066FF] font-bold flex items-center gap-1">
                <CheckCircle2 size={14} />
                <span>Daily Commit Streaks</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-amber-300 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-black text-lg flex items-center justify-center mb-6 shadow-md shadow-amber-500/20">
                  02
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 font-sans">
                  Conquer the &quot;Insane&quot; Benchmark
                </h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Build one of the high-difficulty systems (Satellite Imagery, 3D MRI, Rust Order Book, LangGraph Swarm) and pass automated SLA benchmarks (&lt;150ms latency, zero memory leaks).
                </p>
              </div>
              <div className="text-amber-700 font-bold flex items-center gap-1">
                <Flame size={14} />
                <span>Strict Test SLA Gates</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-emerald-300 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center mb-6 shadow-md shadow-emerald-500/20">
                  03
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 font-sans">
                  Founder Code Audit &amp; Recommendation
                </h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Once your system passes code review, Founder Soham Sharma provides a detailed architecture audit, technical feedback, and a personalized recommendation letter for your portfolio.
                </p>
              </div>
              <div className="text-emerald-700 font-bold flex items-center gap-1">
                <Award size={14} />
                <span>Verifiable Proof of Work</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── 3. WEEKLY FOUNDER OFFICE HOURS & CLINICS ── */}
      <section className="py-20 bg-blue-50/50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-950 to-blue-950 text-white rounded-3xl p-8 sm:p-12 border border-blue-500/30 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider border border-blue-400/30">
                <Calendar size={14} /> Weekly Mentorship &amp; Live Reviews
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-sans">
                Saturday Founder Technical Office Hours
              </h2>
              <p className="text-slate-300 font-mono text-xs sm:text-sm leading-relaxed">
                Join Founder Soham Sharma every Saturday from <strong>3:00 PM – 7:00 PM IST</strong> on Discord / Google Meet for live architecture teardowns, latency profiling, schema reviews, and code debugging.
              </p>
              <div className="flex flex-wrap gap-4 text-xs font-mono pt-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 size={15} /> 1-on-1 Code Teardowns
                </div>
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <CheckCircle2 size={15} /> System Design Q&amp;A
                </div>
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <CheckCircle2 size={15} /> Architecture Defense
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full lg:w-auto font-mono text-xs">
              <Link
                href="/arena/calendar"
                className="px-6 py-3.5 rounded-2xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-center uppercase tracking-wider transition-all shadow-md"
              >
                View Event Calendar ↗
              </Link>
              <Link
                href="/discussions"
                className="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-center uppercase tracking-wider transition-all border border-slate-700"
              >
                Join Discussions Forum
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. FEATURED INSANE PROJECTS ── */}
      <section className="py-20 bg-slate-950 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 text-red-400 font-mono text-xs font-bold uppercase tracking-wider mb-2 border border-red-500/20">
                <Flame size={13} /> The Crucial Milestone
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
                The &quot;Insane&quot; Projects Matrix
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm font-mono mt-1">
                Completing any of these 6 production systems unlocks Founder Code Audit &amp; Recommendation eligibility.
              </p>
            </div>

            <Link
              href="/arena"
              className="px-6 py-3 rounded-2xl bg-white text-slate-900 font-mono text-xs font-bold uppercase tracking-wider hover:bg-slate-100 transition-all shrink-0 flex items-center gap-2"
            >
              <span>Explore All 50 PRDs</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
            {insaneProjects.map((p) => (
              <div
                key={p.id}
                className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-blue-500/50 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 font-bold text-[10px] border border-red-500/30">
                      {p.difficulty}
                    </span>
                    <span className="text-[10px] text-slate-400">{p.durationDays} Days Sprint</span>
                  </div>

                  <h3 className="text-base font-bold text-white font-sans mb-1.5 group-hover:text-blue-400 transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-slate-400 text-xs font-sans line-clamp-3 mb-4 leading-relaxed">
                    {p.overview}
                  </p>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 mb-4">
                    <span className="text-emerald-400 font-bold">Strict SLA:</span> {p.productionSla}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {p.techStack.slice(0, 2).map((t, ti) => (
                      <span key={ti} className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/arena/${p.slug || p.id}`}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 transition-all"
                  >
                    <span>View PRD</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 5. TRANSPARENT 3-TIER PRICING TABLE (₹0 / ₹299 / ₹1,999) ── */}
      <section id="pricing" className="py-20 bg-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200">
              <ShieldCheck size={14} /> Accessible &amp; Honest Pricing
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-sans">
              Choose Your Engineering Track
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm font-mono mt-2">
              Free for self-learners, ₹299 for verified credentials, and ₹1,999 for 1-on-1 founder code audits &amp; recommendations.
            </p>
          </div>

          <VirtualInternshipPricingClient />

        </div>
      </section>

      {/* ── 6. STRICT CRITERIA POLICY ── */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="p-8 rounded-3xl bg-slate-950 text-white border border-slate-800">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldCheck size={16} /> Strict Meritocracy Policy
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-sans mb-4">
              How Founder Code Audit &amp; Recommendation Works
            </h3>
            
            <p className="text-slate-300 font-mono text-xs leading-relaxed mb-6">
              We enforce authentic engineering rigor. Founder Soham Sharma reviews your code and writes your portfolio recommendation <strong>only when you meet these strict gates:</strong>
            </p>

            <div className="space-y-3 font-mono text-xs text-slate-300">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0">1</span>
                <div>
                  <strong className="text-white">Conquer 1 Insane-Tier Project:</strong> Must complete either Satellite AI, 3D MRI UNETR, Rust Order Book, LangGraph Multi-Agent Swarm, or Linux Kernel eBPF.
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0">2</span>
                <div>
                  <strong className="text-white">Zero-Tolerance SLA Benchmarking:</strong> System must pass automated tests (p95 latency &lt; 150ms, &gt;85% test coverage, zero memory leaks).
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0">3</span>
                <div>
                  <strong className="text-white">Daily Heatmap Proof-of-Work:</strong> Must maintain an active commit streak on GitHub with clear PR descriptions and architectural reasoning.
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 font-mono text-xs">
                Meet the criteria ➔ Founder Recommendation unlocked.
              </span>
              <Link
                href="/arena"
                className="text-amber-400 font-mono text-xs font-bold hover:underline flex items-center gap-1"
              >
                <span>Pick an Insane Project</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ── 7. FAQ ── */}
      <section className="py-20 bg-[#FAFCFF] border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm font-mono mt-2">
              Everything about the fellowship, pricing tiers, and founder code reviews.
            </p>
          </div>

          <div className="space-y-4 font-mono text-xs">
            <div className="p-6 rounded-2xl bg-white border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm font-sans mb-2 flex items-center gap-2">
                <HelpCircle size={15} className="text-[#0066FF]" />
                <span>What is the requirement to get Founder Soham&apos;s Recommendation?</span>
              </h4>
              <p className="text-slate-600 leading-relaxed">
                You must complete and ship at least 1 top &quot;Insane Tier&quot; production project, pass all automated SLA benchmarks (&lt;150ms latency, zero memory leaks), and maintain active daily GitHub commits.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm font-sans mb-2 flex items-center gap-2">
                <HelpCircle size={15} className="text-[#0066FF]" />
                <span>Why is the Verified Pass priced at ₹299?</span>
              </h4>
              <p className="text-slate-600 leading-relaxed">
                We believe in radical student accessibility. ₹299 covers cryptographic credential generation and cloud test verification infrastructure while filtering out non-serious builders.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm font-sans mb-2 flex items-center gap-2">
                <HelpCircle size={15} className="text-[#0066FF]" />
                <span>Do you offer job guarantees?</span>
              </h4>
              <p className="text-slate-600 leading-relaxed">
                No. We strictly do not offer or guarantee job placements. We provide an intensive practical simulator with real multi-table database schemas, daily GitHub commit tracking, and rigorous founder code teardowns to help you build an undeniable portfolio.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
