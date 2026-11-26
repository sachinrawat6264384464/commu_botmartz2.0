import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Terminal,
  ShieldCheck,
  Award,
  Coins,
  Compass,
  Globe,
  Briefcase,
  Users,
  MapPin,
  Calendar,
  Sparkles,
  ExternalLink,
  Lock,
  Layers,
  Cpu,
  Code2,
  Activity,
  Star,
  Check,
  Flame,
  QrCode,
  Quote
} from "lucide-react";
import { ARENA_PROJECTS, TOTAL_SYSTEMS_COUNT } from "@/lib/arena-projects";
import PricingTierCards from "./_components/PricingTierCards";

export const revalidate = 60; // ISR 1 min

export default async function CommunityHomePage() {
  const featuredProjects = ARENA_PROJECTS.filter((p) => p.featured).slice(0, 6);

  return (
    <div className="bg-[#FAFCFF] text-slate-900 font-sans">

      {/* ── 1. HERO SECTION: DEEP INDIGO GRID WITH LIME CTA & 3-COLUMN SHOWCASE ── */}
      <section
        className="relative pt-24 sm:pt-28 pb-0 overflow-hidden bg-[#1D3189] text-white min-h-screen flex flex-col justify-end"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      >
        <div className="w-full px-4 sm:px-8 lg:px-14 relative z-10 max-w-[1600px] mx-auto flex flex-col items-center flex-1 justify-between">
          <div className="flex flex-col items-center pt-2 sm:pt-4">
            {/* Centered Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[62px] xl:text-[72px] font-extrabold tracking-tight leading-[1.08] text-white text-center max-w-5xl font-sans">
              Build Production Systems. <br />
              Ship Daily. Get Hired.
            </h1>

            {/* Primary Lime CTA + Secondary Links */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mt-6 sm:mt-8 w-full sm:w-auto">
              <Link
                href="/login"
                prefetch={false}
                className="inline-flex items-center gap-2 group cursor-pointer"
              >
                <span className="px-6 py-3 sm:px-8 sm:py-4 rounded-full bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-bold text-sm sm:text-base tracking-tight shadow-lg shadow-lime-400/20 transition-all duration-200 group-hover:scale-[1.02]">
                  Join 45-Day Cohort (Free)
                </span>
                <span className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 flex items-center justify-center shadow-lg shadow-lime-400/20 transition-all duration-200 group-hover:rotate-12 group-hover:scale-105">
                  <ArrowUpRight size={20} strokeWidth={2.5} />
                </span>
              </Link>

              <Link
                href="/arena"
                prefetch={false}
                className="px-6 py-3 sm:px-7 sm:py-4 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/25 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2.5 backdrop-blur-sm"
              >
                <Terminal size={16} className="text-[#D9F83B]" />
                <span>Explore {TOTAL_SYSTEMS_COUNT}+ Systems</span>
              </Link>
            </div>
          </div>

          {/* 3-Column Bottom Showcase Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end w-full mt-8 lg:mt-6 relative">
            {/* Left Column: Quote + Stat */}
            <div className="lg:col-span-4 flex flex-col items-center text-center lg:items-start lg:text-left space-y-4 sm:space-y-5 pb-2 lg:pb-12 lg:pl-8 z-10 order-2 lg:order-1">
              <div className="space-y-2.5 max-w-sm">
                <Quote size={24} className="text-white/90 fill-white/90 rotate-180 mx-auto lg:mx-0" />
                <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed font-normal">
                  From AI-enhanced architectures to real-world systems, our playground empowers you to ship daily.
                </p>
              </div>

              <div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-sans">
                  {TOTAL_SYSTEMS_COUNT}+
                </div>
                <div className="text-xs sm:text-sm text-blue-200/90 font-medium mt-1">
                  Production Systems &bull; 15+ Partner Companies
                </div>
              </div>
            </div>

            {/* Center Column: Semi-Circular Navy Dome + Visual */}
            <div className="lg:col-span-4 relative flex items-end justify-center min-h-[240px] sm:min-h-[300px] lg:min-h-[340px] order-1 lg:order-2">
              {/* Dark Navy Arch / Dome */}
              <div className="w-[290px] sm:w-[420px] lg:w-[500px] xl:w-[570px] h-[145px] sm:h-[210px] lg:h-[250px] xl:h-[285px] rounded-t-full bg-[#070E54] absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none shadow-2xl" />

              {/* Center Visual */}
              <div className="relative z-10 flex items-end justify-center overflow-hidden">
                <Image
                  src="/hero-student.png"
                  alt="Botmartz Builder"
                  width={440}
                  height={480}
                  className="object-contain object-bottom drop-shadow-2xl max-h-[260px] sm:max-h-[330px] lg:max-h-[370px] w-auto"
                  priority
                />
              </div>
            </div>

            {/* Right Column: Stars + Testimonial */}
            <div className="lg:col-span-4 flex flex-col items-center text-center lg:items-end lg:text-right space-y-3 sm:space-y-4 pb-8 lg:pb-12 z-10 order-3">
              <div className="flex items-center gap-1 text-[#FACC15]">
                <Star size={18} className="fill-[#FACC15]" />
                <Star size={18} className="fill-[#FACC15]" />
                <Star size={18} className="fill-[#FACC15]" />
                <Star size={18} className="fill-[#FACC15]" />
                <Star size={18} className="fill-[#FACC15]" />
              </div>

              <p className="text-base text-blue-100/90 leading-relaxed max-w-sm">
                &ldquo;Modern, sleek, and focused on real production skills. Loved the hands-on PRDs and automated benchmark system.&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-1">
                <div className="w-9 h-9 rounded-full bg-[#D9F83B] text-slate-950 font-black text-xs flex items-center justify-center shadow-sm">
                  SR
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white">Verified Builder</div>
                  <div className="text-[11px] text-blue-200/80">AI Systems Cohort</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. THE 3-STEP OPERATING MACHINE ("HOW IT WORKS") ── */}
      <section
        className="py-20 sm:py-24 bg-white border-b border-slate-200/80 relative"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(29, 49, 137, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(29, 49, 137, 0.04) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      >
        <div className="w-full px-4 sm:px-8 lg:px-14 max-w-[1440px] mx-auto">

          <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1D3189]/8 border border-[#1D3189]/15 text-[#1D3189] font-sans text-xs font-bold uppercase tracking-wider mb-3">
              The 3-Step Clear Path
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-950 tracking-tight font-sans leading-tight">
              How You Build, Conquer &amp; Get Hired
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-sans mt-3 leading-relaxed">
              No endless video watching. You build real production systems tested against automated benchmarks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">

            {/* Step 1 */}
            <Link
              href="/arena"
              className="group relative bg-white rounded-2xl border border-slate-200/90 p-7 sm:p-8 shadow-sm hover:shadow-xl hover:border-[#1D3189]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 group-hover:bg-[#1D3189] transition-colors duration-300" />
              <span className="absolute top-4 right-6 text-6xl font-black text-slate-100 group-hover:text-[#1D3189]/10 transition-colors select-none font-sans">
                01
              </span>

              <div className="relative z-10">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-800 group-hover:bg-[#1D3189] group-hover:text-white font-sans text-[11px] font-bold uppercase tracking-wider mb-5 transition-colors">
                  Step 01
                </div>
                <h3 className="text-xl font-bold text-slate-950 mb-2.5 font-sans">
                  Pick a Track &amp; Warmup PRD
                </h3>
                <p className="text-slate-600 text-sm font-sans leading-relaxed">
                  Select from {TOTAL_SYSTEMS_COUNT} projects (AI Agents, Defence, RAG, Embedded Edge, High-Frequency Telemetry) or follow our 6 Role Roadmaps.
                </p>
              </div>

              <div className="relative z-10 pt-5 mt-7 border-t border-slate-100 flex items-center justify-between text-[#1D3189] font-sans text-sm font-bold">
                <span>Browse {TOTAL_SYSTEMS_COUNT} Projects Matrix</span>
                <span className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-[#D9F83B] text-slate-900 flex items-center justify-center transition-colors">
                  <ArrowRight size={15} />
                </span>
              </div>
            </Link>

            {/* Step 2 */}
            <Link
              href="/arena/daily-log"
              className="group relative bg-white rounded-2xl border border-slate-200/90 p-7 sm:p-8 shadow-sm hover:shadow-xl hover:border-[#1D3189]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 group-hover:bg-[#1D3189] transition-colors duration-300" />
              <span className="absolute top-4 right-6 text-6xl font-black text-slate-100 group-hover:text-[#1D3189]/10 transition-colors select-none font-sans">
                02
              </span>

              <div className="relative z-10">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-800 group-hover:bg-[#1D3189] group-hover:text-white font-sans text-[11px] font-bold uppercase tracking-wider mb-5 transition-colors">
                  Step 02
                </div>
                <h3 className="text-xl font-bold text-slate-950 mb-2.5 font-sans">
                  Conquer the &quot;Insane&quot; Project
                </h3>
                <p className="text-slate-600 text-sm font-sans leading-relaxed">
                  Build one of the high-difficulty systems (Satellite AI, 3D MRI, Rust Order Book, LangGraph Swarm) and pass automated SLA benchmarks with daily GitHub commit logs.
                </p>
              </div>

              <div className="relative z-10 pt-5 mt-7 border-t border-slate-100 flex items-center justify-between text-[#1D3189] font-sans text-sm font-bold">
                <span>Daily Proof-of-Work Log</span>
                <span className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-[#D9F83B] text-slate-900 flex items-center justify-center transition-colors">
                  <ArrowRight size={15} />
                </span>
              </div>
            </Link>

            {/* Step 3 */}
            <Link
              href="/virtual-ai-internship#pricing"
              className="group relative bg-gradient-to-br from-[#1D3189] to-[#070E54] rounded-2xl border border-[#1D3189] p-7 sm:p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden text-white"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#D9F83B]" />
              <span className="absolute top-4 right-6 text-6xl font-black text-white/25 group-hover:text-[#D9F83B]/40 transition-colors select-none font-sans">
                03
              </span>

              <div className="relative z-10">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#D9F83B] text-slate-950 font-sans text-[11px] font-bold uppercase tracking-wider mb-5">
                  Step 03
                </div>
                <h3 className="text-xl font-bold text-white mb-2.5 font-sans">
                  Founder Recommendation &amp; Referral
                </h3>
                <p className="text-blue-100/85 text-sm font-sans leading-relaxed">
                  Pass strict code review on your Insane Project to unlock a personalized recommendation from Founder Soham Sharma and direct job referral assistance to 15 partner companies.
                </p>
              </div>

              <div className="relative z-10 pt-5 mt-7 border-t border-white/15 flex items-center justify-between text-[#D9F83B] font-sans text-sm font-bold">
                <span>View Plans (Free / ₹299 / ₹1,999)</span>
                <span className="w-8 h-8 rounded-full bg-[#D9F83B] text-slate-950 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <ArrowRight size={15} />
                </span>
              </div>
            </Link>

          </div>

        </div>
      </section>

      {/* ── 3. FEATURED INTERNSHIP PLAYGROUND PROJECTS PREVIEW ── */}
      <section className="py-10 sm:py-12 px-4 sm:px-8 lg:px-12 bg-white border-b border-slate-200/80">
        <div
          className="w-full max-w-[1440px] mx-auto rounded-3xl bg-[#162774] text-white p-6 sm:p-8 lg:p-10 border border-[#1D3189]/20 shadow-2xl overflow-hidden relative"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        >

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#070E54]/80 text-[#D9F83B] font-sans text-xs font-bold uppercase tracking-wider mb-2.5 border border-white/15">
                <Activity size={13} /> Frontier Engineering Projects
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
                Featured Internship Playground Systems
              </h2>
              <p className="text-blue-200/85 text-xs sm:text-sm font-sans mt-1.5">
                Zero toy apps. Every project has strict test commands and SLA acceptance gates.
              </p>
            </div>

            <Link
              href="/arena"
              className="px-6 py-2.5 rounded-full bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-sans text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 shadow-lg shadow-lime-400/15"
            >
              <span>View All {TOTAL_SYSTEMS_COUNT} Projects</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 font-sans text-xs">
            {featuredProjects.slice(0, 3).map((p) => (
              <div
                key={p.id}
                className="p-5 sm:p-6 rounded-2xl bg-white text-slate-900 border border-white/20 flex flex-col justify-between hover:border-[#D9F83B] hover:-translate-y-1 transition-all duration-300 group shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-3 py-0.5 rounded-full bg-[#1D3189]/10 text-[#1D3189] font-bold text-[11px]">
                      {p.difficulty}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{p.durationDays} Days Cohort</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-950 font-sans mb-1.5 group-hover:text-[#1D3189] transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm font-sans line-clamp-2 mb-4 leading-relaxed">
                    {p.overview}
                  </p>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 mb-4">
                    <span className="text-[#1D3189] font-bold">Strict SLA:</span> {p.productionSla}
                  </div>
                </div>

                <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {p.techStack.slice(0, 2).map((t, ti) => (
                      <span key={ti} className="text-[11px] text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md font-medium">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/arena/${p.id}`}
                    className="px-4 py-2 rounded-full bg-[#1D3189] group-hover:bg-[#D9F83B] text-white group-hover:text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <span>View Spec</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 4. WEEKLY LIVE RITUALS & CAREER ENGINE (ASYMMETRIC BENTO LAYOUT) ── */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
        <div className="w-full px-4 sm:px-8 lg:px-12 max-w-[1440px] mx-auto">

          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1D3189]/8 border border-[#1D3189]/15 text-[#1D3189] font-sans text-xs font-bold uppercase tracking-wider mb-3">
                <Calendar size={13} /> Weekly Live Rituals &amp; Mentorship
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight font-sans">
                Beyond Code: Live Reviews &amp; Demo Days
              </h2>
              <p className="text-slate-600 text-sm sm:text-base font-sans mt-2 max-w-2xl">
                Every week brings structured founder reviews, resume teardowns, and live engineering demos to turn your builds into offers.
              </p>
            </div>

            <Link
              href="/arena/calendar"
              className="px-6 py-3 rounded-full bg-[#1D3189] hover:bg-[#070E54] text-white font-sans text-xs sm:text-sm font-bold transition-all shrink-0 inline-flex items-center gap-2 shadow-md"
            >
              <Calendar size={15} className="text-[#D9F83B]" />
              <span>View Community Calendar</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Asymmetric Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 font-sans">

            {/* Left Tall Feature Card */}
            <div
              className="lg:col-span-5 rounded-3xl bg-gradient-to-br from-[#1D3189] to-[#070E54] text-white p-7 sm:p-9 flex flex-col justify-between relative overflow-hidden shadow-xl"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            >
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D9F83B] text-slate-950 text-[11px] font-bold uppercase tracking-wider mb-5">
                  Saturday &bull; 5:00 PM – 7:00 PM IST
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug mb-3">
                  Indore AI Hub &amp; Live Architecture Teardowns
                </h3>
                <p className="text-blue-100/85 text-sm leading-relaxed mb-6">
                  In-person meetups at the Indore AI Hub unlock whenever 50+ builders RSVP (or join live online) for 1-on-1 architecture audits and bug fixes with Founder Soham Sharma.
                </p>
              </div>

              <div className="pt-5 border-t border-white/15 grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm">
                  <div className="text-lg sm:text-xl font-black text-[#D9F83B]">50+</div>
                  <div className="text-[11px] text-blue-100/80">RSVP Trigger</div>
                </div>
                <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm">
                  <div className="text-lg sm:text-xl font-black text-white">1-on-1</div>
                  <div className="text-[11px] text-blue-100/80">Code Audits</div>
                </div>
                <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm">
                  <div className="text-lg sm:text-xl font-black text-[#D9F83B]">15+</div>
                  <div className="text-[11px] text-blue-100/80">Hiring Partners</div>
                </div>
              </div>
            </div>

            {/* Right Bento Stack */}
            <div className="lg:col-span-7 flex flex-col gap-5">

              {/* Top Wide Card */}
              <Link
                href="/arena/career-checklist"
                className="group p-6 sm:p-7 rounded-3xl bg-slate-50 hover:bg-white border border-slate-200/90 hover:border-[#1D3189]/40 hover:shadow-lg transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2 max-w-xl">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#1D3189]/10 text-[#1D3189] text-[11px] font-bold uppercase tracking-wider">
                    Wednesday &bull; 6:00 PM IST &bull; Career
                  </div>
                  <h3 className="text-xl font-bold text-slate-950 group-hover:text-[#1D3189] transition-colors">
                    Resume Teardown &amp; LinkedIn Profile Audit
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    ATS optimization, GitHub proof-of-work pinned carousels, and direct HR cold-pitch templates reviewed live.
                  </p>
                </div>
                <span className="w-10 h-10 rounded-full bg-white border border-slate-200 group-hover:bg-[#D9F83B] group-hover:border-[#D9F83B] text-slate-900 flex items-center justify-center shrink-0 transition-colors">
                  <ArrowRight size={16} />
                </span>
              </Link>

              {/* Bottom 2 Side-by-Side Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 flex-1">
                <Link
                  href="/showcase"
                  className="group p-6 rounded-3xl bg-slate-50 hover:bg-white border border-slate-200/90 hover:border-[#1D3189]/40 hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#1D3189]/10 text-[#1D3189] text-[11px] font-bold uppercase tracking-wider mb-3">
                      Thursday &bull; 7:00 PM IST
                    </div>
                    <h3 className="text-lg font-bold text-slate-950 group-hover:text-[#1D3189] transition-colors mb-1.5">
                      Showcase Thursdays
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Demo live working systems to peers and invited engineering leads.
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-200/70 flex items-center justify-between text-xs font-bold text-[#1D3189]">
                    <span>Explore Showcases</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                <Link
                  href="/arena/daily-log"
                  className="group p-6 rounded-3xl bg-slate-50 hover:bg-white border border-slate-200/90 hover:border-[#1D3189]/40 hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#D9F83B] text-slate-950 text-[11px] font-bold uppercase tracking-wider mb-3">
                      Daily &bull; Proof of Work
                    </div>
                    <h3 className="text-lg font-bold text-slate-950 group-hover:text-[#1D3189] transition-colors mb-1.5">
                      Daily Commits &amp; Karma
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Log daily progress, clear technical bounties, and climb the builder leaderboard.
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-200/70 flex items-center justify-between text-xs font-bold text-[#1D3189]">
                    <span>Submit Daily Log</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ── 5. TRANSPARENT 3-TIER PRICING & FELLOWSHIP TRACKS (₹0 / ₹299 / ₹1,999) ── */}
      <section id="pricing" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="w-full px-4 sm:px-8 lg:px-12 max-w-[1700px] mx-auto">

          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200">
              <ShieldCheck size={14} /> Honest Student Pricing
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
              Choose Your Engineering Track
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm font-mono mt-2">
              Free for self-learners, ₹299 for verified credentials &amp; office hours, and ₹1,999 for full founder placement assistance.
            </p>
          </div>

          <PricingTierCards />

        </div>
      </section>

      {/* ── 6. ZERO-TRUST STUDENT TRUST & READY TO JOIN CTA ── */}
      <section className="py-20 bg-slate-100 border-b border-slate-200">
        <div className="w-full px-4 sm:px-8 lg:px-12 max-w-[1700px] mx-auto text-center">

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 font-mono text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-200">
            <ShieldCheck size={14} /> 100% Free &amp; Zero-Spam Verification
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 font-sans">
            Ready to Build in the Internship Playground?
          </h2>

          <p className="text-slate-600 text-xs sm:text-base font-mono max-w-2xl mx-auto mb-8">
            Create your verified student profile with Google or Phone OTP. Claim your <strong>100 Welcome Karma Coins</strong> and start building today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 font-mono text-xs">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Get Started with Google / Phone OTP</span>
              <ArrowRight size={14} />
            </Link>

            <Link
              href="/arena/roadmaps"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <Compass size={14} className="text-purple-600" />
              <span>Explore Stage Roadmaps</span>
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
