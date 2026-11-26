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
import FeaturedSystemsGrid from "./_components/FeaturedSystemsGrid";
import ThreeStepPathGrid from "./_components/ThreeStepPathGrid";
import WeeklyRitualsBento from "./_components/WeeklyRitualsBento";

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

          <ThreeStepPathGrid totalSystemsCount={TOTAL_SYSTEMS_COUNT} />

        </div>
      </section>

      {/* ── 3. FEATURED INTERNSHIP PLAYGROUND PROJECTS PREVIEW ── */}
      <section className="py-10 sm:py-12 px-4 sm:px-8 lg:px-12 bg-white border-b border-slate-200/80">
        <FeaturedSystemsGrid
          projects={featuredProjects.slice(0, 3)}
          totalSystemsCount={TOTAL_SYSTEMS_COUNT}
        />
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

          <WeeklyRitualsBento />

        </div>
      </section>

      {/* ── 5. TRANSPARENT 3-TIER PRICING & FELLOWSHIP TRACKS (₹0 / ₹299 / ₹1,999) ── */}
      <section
        id="pricing"
        className="py-16 sm:py-20 bg-white border-b border-slate-200/80 relative"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(29, 49, 137, 0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(29, 49, 137, 0.035) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      >
        <div className="w-full px-4 sm:px-8 lg:px-12 max-w-[1440px] mx-auto">

          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1D3189]/8 text-[#1D3189] font-sans text-xs font-bold uppercase tracking-wider mb-3 border border-[#1D3189]/15">
              <ShieldCheck size={14} /> Honest Student Pricing
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-950 tracking-tight font-sans">
              Choose Your Engineering Track
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-sans mt-3 leading-relaxed">
              Free for self-learners, ₹299 for verified credentials &amp; office hours, and ₹1,999 for full founder placement assistance.
            </p>
          </div>

          <PricingTierCards />

        </div>
      </section>

      {/* ── 6. ZERO-TRUST STUDENT TRUST & READY TO JOIN CTA ── */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 lg:px-12 bg-white">
        <div className="w-full max-w-[1440px] mx-auto rounded-3xl bg-gradient-to-br from-[#1D3189] to-[#070E54] text-white p-8 sm:p-12 lg:p-14 relative overflow-hidden shadow-2xl border border-[#1D3189]/20">
          {/* Grid Overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center font-sans">
            {/* Left Copy */}
            <div className="lg:col-span-7 text-left space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D9F83B] text-slate-950 text-xs font-bold uppercase tracking-wider shadow-sm">
                <ShieldCheck size={14} /> 100% Free &amp; Zero-Spam Verification
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.1]">
                Ready to Build in the Internship Playground?
              </h2>

              <p className="text-blue-100/85 text-sm sm:text-base max-w-2xl leading-relaxed">
                Create your verified student profile with Google or Phone OTP. Claim your{" "}
                <strong className="text-[#D9F83B]">100 Welcome Karma Coins</strong> and start shipping production systems today.
              </p>
            </div>

            {/* Right CTA Stack */}
            <div className="lg:col-span-5 flex flex-col gap-3.5 lg:items-end">
              <Link
                href="/login"
                className="group w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-bold text-sm transition-all shadow-lg shadow-lime-400/20 flex items-center justify-between sm:justify-center gap-3 cursor-pointer"
              >
                <span>Get Started with Google / Phone OTP</span>
                <span className="w-7 h-7 rounded-full bg-slate-950 text-[#D9F83B] inline-flex items-center justify-center shrink-0">
                  <ArrowRight size={14} className="transition-transform duration-300 group-hover:-rotate-45" />
                </span>
              </Link>

              <Link
                href="/arena/roadmaps"
                className="group w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm transition-all flex items-center justify-between sm:justify-center gap-3 backdrop-blur-sm"
              >
                <span className="inline-flex items-center gap-2">
                  <Compass size={16} className="text-[#D9F83B]" />
                  <span>Explore Stage Roadmaps</span>
                </span>
                <span className="w-7 h-7 rounded-full bg-[#D9F83B] text-slate-950 inline-flex items-center justify-center shrink-0">
                  <ArrowRight size={14} className="transition-transform duration-300 group-hover:-rotate-45" />
                </span>
              </Link>

              <div className="flex flex-wrap items-center gap-4 text-xs text-blue-100 pt-2">
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#D9F83B] text-slate-950 inline-flex items-center justify-center">
                    <Check size={11} strokeWidth={3} />
                  </span>
                  <span>100 Welcome Coins</span>
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#D9F83B] text-slate-950 inline-flex items-center justify-center">
                    <Check size={11} strokeWidth={3} />
                  </span>
                  <span>Instant Repo Access</span>
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#D9F83B] text-slate-950 inline-flex items-center justify-center">
                    <Check size={11} strokeWidth={3} />
                  </span>
                  <span>QR Verified Pass</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
