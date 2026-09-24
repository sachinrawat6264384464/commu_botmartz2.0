import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
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
  QrCode
} from "lucide-react";
import { ARENA_PROJECTS, TOTAL_SYSTEMS_COUNT } from "@/lib/arena-projects";
import HeroAuthForm from "./_components/HeroAuthForm";
import PricingTierCards from "./_components/PricingTierCards";

export const revalidate = 60; // ISR 1 min

export default async function CommunityHomePage() {
  const featuredProjects = ARENA_PROJECTS.filter((p) => p.featured).slice(0, 6);

  return (
    <div className="bg-[#FAFCFF] text-slate-900 font-sans">
      
      {/* ── 1. HERO SECTION: FULL-WIDTH 2-COLUMN LAYOUT WITH AUTH FORM ── */}
      <section className="relative pt-6 sm:pt-8 pb-16 overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-blue-50/60 via-slate-50/30 to-[#FAFCFF]">
        {/* GPU-accelerated ambient glow background */}
        <div className="absolute top-10 left-1/4 w-[600px] h-[500px] bg-gradient-to-tr from-blue-400/15 via-cyan-400/10 to-indigo-500/10 blur-[130px] pointer-events-none transform-gpu" />
        
        <div className="w-full px-4 sm:px-8 lg:px-12 relative z-10 max-w-[1700px] mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* LEFT COLUMN: HERO HEADLINE, SUBHEAD & METRICS */}
            <div className="lg:col-span-7 flex flex-col items-start text-left space-y-4 sm:space-y-6">
              
              {/* Cohort 1 Live Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/90 border-2 border-blue-200 text-[#0066FF] font-mono text-xs font-bold uppercase tracking-wider shadow-xs backdrop-blur-md">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0066FF] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0066FF]"></span>
                </span>
                <Activity size={14} className="text-[#0066FF]" />
                <span>Cohort 1 Live: 14th Sept – Diwali 2026</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[1.06] text-slate-950 font-sans">
                Build Production Systems. <br />
                <span className="bg-gradient-to-r from-[#0066FF] via-[#0092D7] to-cyan-500 bg-clip-text text-transparent">
                  Ship Daily. Get Hired.
                </span>
              </h1>

              {/* Subhead */}
              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed font-mono text-xs sm:text-sm">
                The 45-Day Virtual Internship Playground for authentic college students. Pick from <strong>{TOTAL_SYSTEMS_COUNT}+ production systems</strong> in AI, Defence, FinTech, and Systems. Complete 3 projects to unlock <strong>direct dispatch to 15+ partner companies and founder recommendation</strong>.
              </p>

              {/* Quick Proof Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full pt-2 font-mono text-xs text-left">
                <div className="p-3.5 rounded-2xl bg-white/90 border-2 border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                  <div className="text-lg sm:text-xl font-black text-slate-900 font-sans">{TOTAL_SYSTEMS_COUNT}+ Systems</div>
                  <div className="text-[11px] text-slate-500 font-medium">Multi-Domain Catalog</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/90 border-2 border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                  <div className="text-lg sm:text-xl font-black text-[#0066FF] font-sans">15+ Companies</div>
                  <div className="text-[11px] text-slate-500 font-medium">Referral Guarantee</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/90 border-2 border-slate-200/90 shadow-xs hover:border-purple-300 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                  <div className="text-lg sm:text-xl font-black text-purple-700 font-sans">Indore Hub</div>
                  <div className="text-[11px] text-slate-500 font-medium">Saturday Teardowns</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/90 border-2 border-slate-200/90 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                  <div className="text-lg sm:text-xl font-black text-emerald-700 font-sans">100% Free</div>
                  <div className="text-[11px] text-slate-500 font-medium">For Verified Students</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3.5 w-full pt-3">
                <Link
                  href="/login"
                  prefetch={false}
                  className="w-full sm:w-auto bg-gradient-to-r from-[#0066FF] via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-7 py-3.5 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer border border-blue-400/30 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Sparkles size={15} className="text-cyan-300" />
                  <span>Join 45-Day Cohort (Free)</span>
                  <ArrowRight size={15} />
                </Link>
                
                <Link
                  href="/arena"
                  prefetch={false}
                  className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-200 hover:border-blue-400 px-6 py-3.5 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 shadow-xs flex items-center justify-center gap-2"
                >
                  <Terminal size={15} className="text-[#0066FF]" />
                  <span>Explore {TOTAL_SYSTEMS_COUNT}+ Projects Matrix</span>
                </Link>

                <Link
                  href="/arena/calendar"
                  prefetch={false}
                  className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200/80 text-slate-800 border border-slate-300 px-5 py-3.5 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <MapPin size={15} className="text-slate-600" />
                  <span>Indore Office Hours</span>
                </Link>
              </div>

            </div>

            {/* RIGHT COLUMN: SIGN IN / SIGN UP AUTH FORM CARD */}
            <div className="lg:col-span-5 w-full">
              <HeroAuthForm />
            </div>

        </div>
        </div>
      </section>

      {/* ── 2. THE 3-STEP OPERATING MACHINE ("HOW IT WORKS") ── */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="w-full px-4 sm:px-8 lg:px-12 max-w-[1700px] mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-bold uppercase tracking-wider mb-2">
              The 3-Step Clear Path
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
              How You Build, Conquer &amp; Get Hired
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm font-mono mt-2">
              No endless video watching. You build real production systems tested against automated benchmarks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-blue-300 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#0066FF] text-white font-mono font-black text-lg flex items-center justify-center mb-6 shadow-md shadow-blue-500/20">
                  01
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 font-sans">
                  Pick a Track &amp; Warmup PRD
                </h3>
                <p className="text-slate-600 text-xs font-mono leading-relaxed mb-6">
                  Select from {TOTAL_SYSTEMS_COUNT} projects (AI Agents, Defence, RAG, Embedded Edge, High-Frequency Telemetry) or follow our 6 Role Roadmaps.
                </p>
              </div>
              <Link
                href="/arena"
                className="text-[#0066FF] font-mono text-xs font-bold flex items-center gap-1.5 hover:underline"
              >
                <span>Browse {TOTAL_SYSTEMS_COUNT} Projects Matrix</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-amber-300 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-mono font-black text-lg flex items-center justify-center mb-6 shadow-md shadow-amber-500/20">
                  02
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 font-sans">
                  Conquer the &quot;Insane&quot; Project
                </h3>
                <p className="text-slate-600 text-xs font-mono leading-relaxed mb-6">
                  Build one of the high-difficulty systems (Satellite AI, 3D MRI, Rust Order Book, LangGraph Swarm) and pass automated SLA benchmarks with daily GitHub commit logs.
                </p>
              </div>
              <Link
                href="/arena/daily-log"
                className="text-amber-700 font-mono text-xs font-bold flex items-center gap-1.5 hover:underline"
              >
                <span>Daily Proof-of-Work Log</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-emerald-300 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-mono font-black text-lg flex items-center justify-center mb-6 shadow-md shadow-emerald-500/20">
                  03
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 font-sans">
                  Founder Recommendation &amp; Referral
                </h3>
                <p className="text-slate-600 text-xs font-mono leading-relaxed mb-6">
                  Pass strict code review on your Insane Project to unlock a personalized recommendation from Founder Soham Sharma and direct job referral assistance to 15 partner companies.
                </p>
              </div>
              <Link
                href="/virtual-ai-internship#pricing"
                className="text-emerald-700 font-mono text-xs font-bold flex items-center gap-1.5 hover:underline"
              >
                <span>View Plans (Free / ₹299 / ₹1,999)</span>
                <ArrowRight size={13} />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* ── 3. FEATURED INTERNSHIP PLAYGROUND PROJECTS PREVIEW ── */}
      <section className="py-20 bg-slate-950 text-white border-b border-slate-800">
        <div className="w-full px-4 sm:px-8 lg:px-12 max-w-[1700px] mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-400 font-mono text-xs font-bold uppercase tracking-wider mb-2 border border-blue-500/20">
                <Activity size={13} /> Frontier Engineering Projects
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
                Featured Internship Playground Systems
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm font-mono mt-1">
                Zero toy apps. Every project has strict test commands and SLA acceptance gates.
              </p>
            </div>

            <Link
              href="/arena"
              className="px-6 py-3 rounded-2xl bg-white text-slate-900 font-mono text-xs font-bold uppercase tracking-wider hover:bg-slate-100 transition-all shrink-0 flex items-center gap-2"
            >
              <span>View All {TOTAL_SYSTEMS_COUNT} Projects</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
            {featuredProjects.map((p) => (
              <div
                key={p.id}
                className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-blue-500/50 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-[10px] border border-blue-500/30">
                      {p.difficulty}
                    </span>
                    <span className="text-[10px] text-slate-400">{p.durationDays} Days Cohort</span>
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
                    href={`/arena/${p.id}`}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 transition-all"
                  >
                    <span>View Spec</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 4. INDORE OFFLINE HUB + VIRTUAL DISCORD RITUALS ── */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="w-full px-4 sm:px-8 lg:px-12 max-w-[1700px] mx-auto">
          
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 text-slate-300 font-mono text-xs font-bold uppercase tracking-wider mb-4 border border-slate-700">
                  <MapPin size={14} /> Indore Flagship Meetup &amp; Global Discord
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4 font-sans">
                  Saturday Indore Office Hours &amp; Architecture Teardowns
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm font-mono leading-relaxed mb-6">
                  Every Saturday from <strong>5:00 PM to 7:00 PM IST</strong>. In-person meetups at the Indore AI Hub unlock whenever 50+ builders RSVP (otherwise hosted live online via Discord Voice Stage) with 1-on-1 architecture reviews with Founder Soham Sharma.
                </p>

                <div className="flex flex-wrap gap-3 font-mono text-xs">
                  <Link
                    href="/arena/calendar"
                    className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase tracking-wider transition-all flex items-center gap-2"
                  >
                    <Calendar size={14} />
                    <span>Sync Lu.ma Calendar</span>
                  </Link>

                  <a
                    href="https://discord.gg/k75ZpEnzp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wider transition-all flex items-center gap-2"
                  >
                    <span>Join Discord Stage</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              {/* Weekly Rituals Schedule */}
              <div className="space-y-3 font-mono text-xs">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between text-amber-400 font-bold mb-1">
                    <span>SATURDAY 5:00 PM – 7:00 PM IST</span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px]">Flagship</span>
                  </div>
                  <div className="font-bold text-white text-sm font-sans">Indore In-Person (50+ RSVPs) &amp; Virtual Stage</div>
                  <p className="text-slate-400 text-[11px] mt-0.5">Code architecture audits, live bug fixes, and 1-on-1 project reviews.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between text-blue-400 font-bold mb-1">
                    <span>WEDNESDAY 6:00 PM IST</span>
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px]">Career</span>
                  </div>
                  <div className="font-bold text-white text-sm font-sans">Resume Teardown &amp; LinkedIn Profile Audit</div>
                  <p className="text-slate-400 text-[11px] mt-0.5">ATS optimization, GitHub proof-of-work pinned carousels, and HR cold pitches.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between text-emerald-400 font-bold mb-1">
                    <span>THURSDAY 7:00 PM IST</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">Demo Day</span>
                  </div>
                  <div className="font-bold text-white text-sm font-sans">Showcase Thursdays</div>
                  <p className="text-slate-400 text-[11px] mt-0.5">Students demo live working systems to peers and invited engineering leads.</p>
                </div>
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
