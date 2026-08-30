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
} from "lucide-react";
import { ARENA_PROJECTS } from "@/lib/arena-projects";
import VirtualInternshipPricingClient from "./VirtualInternshipClient";

export const metadata: Metadata = {
  title: "45-Day Virtual AI Engineering Fellowship — Built for Indian Tech Students",
  description:
    "Build production-grade AI systems, conquer the Insane Project benchmark, earn Founder Soham Sharma's recommendation, and get direct job referral assistance. Plans from Free to ₹299 & ₹1,999.",
  keywords: [
    "virtual AI internship India",
    "project based AI fellowship",
    "AI engineering portfolio projects",
    "LangGraph multi agent projects",
    "AI job placement referral",
    "Botmartz arena fellowship",
  ],
  alternates: {
    canonical: "/virtual-ai-internship",
  },
  openGraph: {
    title: "45-Day Virtual AI Engineering Fellowship | Botmartz",
    description:
      "Build real production AI systems. Conquer the Insane Project milestone to unlock Founder Recommendation and direct job referral assistance.",
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
        "A structured, project-based engineering program where students build production AI systems, conquer top Insane projects, pass automated SLA gates, and unlock direct founder job referrals.",
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
          name: "Elite Founder Placement Track",
          price: "1999",
          priceCurrency: "INR",
          category: "Placement Assistance",
        },
      ],
      occupationalCategory: "Artificial Intelligence Engineer",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is the requirement to get Founder Soham's Recommendation & Job Assistance?",
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
          name: "How does the ₹1,999 Elite Placement Track work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The ₹1,999 track includes 1-on-1 architecture audits with Founder Soham Sharma, priority mock technical interviews, personalized LinkedIn recommendations upon conquering the Insane Project, and direct dispatch to our 15 partner tech companies.",
          },
        },
      ],
    },
  ],
};

export default function VirtualAiInternshipPage() {
  const insaneProjects = ARENA_PROJECTS.filter(
    (p) => p.difficulty === "Insane" || p.difficulty === "Expert Tier" || p.featured
  ).slice(0, 6);

  return (
    <div className="bg-[#FAFCFF] text-slate-900 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdProgram) }}
      />

      {/* ── 1. HERO SECTION ── */}
      <section className="relative pt-16 pb-20 overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-blue-50/60 via-slate-50/30 to-[#FAFCFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#0066FF] font-mono text-xs font-bold uppercase tracking-wider mb-6 shadow-2xs">
              <Zap size={14} className="text-[#0066FF]" />
              <span>45-Day AI Engineering Fellowship • Built for Authentic Students</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-[clamp(34px,5vw,64px)] font-black tracking-tight leading-[1.12] text-slate-950 mb-6 font-sans">
              Build Real AI Systems. <br />
              <span className="bg-gradient-to-r from-[#0066FF] via-[#0092D7] to-[#0284C7] bg-clip-text text-transparent">
                Conquer the Insane Project. Get Hired.
              </span>
            </h1>

            {/* Subhead */}
            <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed mb-8 font-mono text-xs sm:text-sm">
              Stop watching 40-hour tutorial videos. Build production-grade systems in AI Agents, Defence, RAG, and Embedded Edge. Conquer the <strong>top Insane Project</strong> to unlock <strong>Founder Soham Sharma&apos;s Recommendation &amp; Direct Job Placement Assistance</strong> under strict performance criteria.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto mb-10">
              <a
                href="#pricing"
                className="w-full sm:w-auto bg-[#0066FF] hover:bg-[#0052CC] text-white px-8 py-4 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View Plans (Free / ₹299 / ₹1,999)</span>
                <ArrowRight size={15} />
              </a>

              <Link
                href="/arena"
                className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 px-7 py-4 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-2xs flex items-center justify-center gap-2"
              >
                <Terminal size={15} className="text-blue-600" />
                <span>Explore Insane Projects Catalog</span>
              </Link>
            </div>

            {/* Proof Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl pt-6 border-t border-slate-200/80 font-mono text-xs text-left">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <div className="text-lg font-black text-slate-900">45 Days</div>
                <div className="text-[11px] text-slate-500">Structured Sprint</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <div className="text-lg font-black text-[#0066FF]">₹299 Pass</div>
                <div className="text-[11px] text-slate-500">Accessible to All</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <div className="text-lg font-black text-purple-700">Insane Tier</div>
                <div className="text-[11px] text-slate-500">Production Benchmark</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <div className="text-lg font-black text-emerald-700">Job Referrals</div>
                <div className="text-[11px] text-slate-500">Strict SLA Gates</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 2. THE 3-STEP INTUITIVE SITE FLOW ── */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-bold uppercase tracking-wider mb-2">
              The 3-Step Clear Path
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
              How You Build &amp; Get Hired
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm font-mono mt-2">
              A transparent, meritocratic funnel where code quality dictates your career outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 font-mono text-xs">
            
            {/* Step 1 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-blue-300 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-lg flex items-center justify-center mb-6 shadow-md shadow-blue-500/20">
                  01
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 font-sans">
                  Pick Your Track &amp; Start Solo
                </h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Select a warmup project (Intermediate) to build muscle memory with FastAPI, Qdrant, and Docker before advancing.
                </p>
              </div>
              <div className="text-blue-600 font-bold flex items-center gap-1">
                <span>50 Open PRDs Available</span>
                <ArrowRight size={13} />
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-amber-300 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-black text-lg flex items-center justify-center mb-6 shadow-md shadow-amber-500/20">
                  02
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 font-sans">
                  Conquer the &quot;Insane&quot; Project
                </h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Build one of the high-difficulty systems (Satellite Imagery, 3D MRI, Rust Order Book, LangGraph Swarm) and pass automated SLA benchmarks.
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
                  Request Founder Job Referral
                </h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Once your Insane Project passes code review, Founder Soham Sharma provides a personalized recommendation and direct dispatch to 15 hiring partner companies.
                </p>
              </div>
              <div className="text-emerald-700 font-bold flex items-center gap-1">
                <Award size={14} />
                <span>Direct Job Placement Support</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── 3. FEATURED INSANE PROJECTS ── */}
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
                Completing any of these 6 production systems unlocks Founder Recommendation &amp; Referral eligibility.
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

      {/* ── 4. TRANSPARENT 3-TIER PRICING TABLE (₹0 / ₹299 / ₹1,999) ── */}
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
              Free for self-learners, ₹299 for verified students, and ₹1,999 for full placement &amp; founder mentorship.
            </p>
          </div>

          <VirtualInternshipPricingClient />

        </div>
      </section>

      {/* ── 5. STRICT CRITERIA & JOB ASSISTANCE RULES ── */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="p-8 rounded-3xl bg-slate-950 text-white border border-slate-800">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldCheck size={16} /> Strict Meritocracy Policy
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-sans mb-4">
              How Job Referral &amp; Founder Recommendation Actually Works
            </h3>
            
            <p className="text-slate-300 font-mono text-xs leading-relaxed mb-6">
              We do not sell fake job guarantees. We help you get hired by enforcing real engineering rigor. Founder Soham Sharma will recommend you to partner companies <strong>only when you meet these strict gates:</strong>
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

      {/* ── 6. FAQ ── */}
      <section className="py-20 bg-[#FAFCFF] border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm font-mono mt-2">
              Everything about the fellowship, pricing tiers, and job referrals.
            </p>
          </div>

          <div className="space-y-4 font-mono text-xs">
            <div className="p-6 rounded-2xl bg-white border border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm font-sans mb-2">
                Can I really participate for 100% free?
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Yes! All 50 production PRDs, stage roadmaps, and community Discord channels are completely free for self-paced learning. You only upgrade to ₹299 for verified credentials and office hours, or ₹1,999 for direct placement mentorship.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm font-sans mb-2">
                What if I start on the Free or ₹299 tier and want to upgrade later?
              </h3>
              <p className="text-slate-600 leading-relaxed">
                You can upgrade at any time during your 45-day sprint as you make progress on your Insane Project.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm font-sans mb-2">
                How does Founder Soham Sharma help with job placement?
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Once your Insane Project passes strict code review, Soham conducts a 1-on-1 mock technical interview, writes a personalized LinkedIn recommendation highlighting your production system, and directly forwards your profile to engineering leads across 15 hiring partner companies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. FINAL CTA ── */}
      <section className="py-20 bg-slate-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 font-mono text-xs font-bold uppercase tracking-wider mb-4 border border-blue-500/30">
            <Sparkles size={14} /> Cohort 1: 14th Sept – Diwali 2026
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 font-sans">
            Ready to Build Your Engineering Proof-of-Work?
          </h2>

          <p className="text-slate-400 text-xs sm:text-base font-mono max-w-2xl mx-auto mb-8">
            Create your builder profile with Google or Phone OTP. Pick your track, start building, and challenge yourself with an Insane Project.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 font-mono text-xs">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold uppercase tracking-wider transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Get Started Now</span>
              <ArrowRight size={14} />
            </Link>

            <Link
              href="/arena"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <Terminal size={14} className="text-blue-400" />
              <span>Explore 50 Projects</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
