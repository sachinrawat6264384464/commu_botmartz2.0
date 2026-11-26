"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Layers,
  Terminal,
  Sparkles,
  Coins,
  MessageSquare,
  Compass,
  Calendar,
  Briefcase,
  User,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileText,
  HelpCircle,
  Zap,
  Globe,
  Award,
  Edit3,
  ExternalLink,
  Code2,
  Lock,
  Search,
  Users,
  KanbanSquare,
  PlayCircle
} from "lucide-react";
import { TOTAL_SYSTEMS_COUNT } from "@/lib/arena-projects";

export default function ProductTourPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const PLATFORM_MODULES = [
    {
      id: "virtual-fellowship",
      title: "Rolling 45-Day Virtual AI Internship",
      href: "/virtual-ai-internship",
      category: "PROGRAMS",
      icon: Sparkles,
      badge: "Rolling 45-Day Window",
      color: "from-blue-600 to-indigo-600",
      what: "A self-paced, milestone-driven virtual engineering fellowship. The moment you enroll, your personal 45-day sprint clock begins, taking you from architecture design to production cloud deployment.",
      why: "Traditional courses teach theoretical syntax without accountability. Botmartz gives you daily git proof-of-work tracking, SLA benchmarks, and direct architecture reviews with founder Soham Sharma.",
      how: "Explore the catalog, select an industrial system, initialize your personal 45-day sprint, and log your daily commits to build an undeniable public dossier.",
      cta: "Explore Virtual Internship"
    },
    {
      id: "arena",
      title: `The Engineering Arena (${TOTAL_SYSTEMS_COUNT}+ Production PRDs)`,
      href: "/arena",
      category: "CORE_ENGINEERING",
      icon: Layers,
      badge: "Baby Step to Go To Hell 💀",
      color: "from-indigo-600 to-purple-600",
      what: "A comprehensive repository of production-grade blueprints across 20+ frontier domains (Geospatial AI, Agent Swarms, eBPF Kernel Probes, WebGPU LLMs, High-Frequency Trading, and Cloud SRE).",
      why: "Eliminates trivial to-do apps. Every Arena blueprint provides multi-table database schemas, REST/WebSocket contracts, acceptance criteria, and sub-150ms SLA test commands.",
      how: "Filter by difficulty tier (Baby Step, Easy, Intermediate, Hard, Insane, Go To Hell), review the open PRD specs, and claim an engineering track.",
      cta: "Open System Catalog"
    },
    {
      id: "daily-log",
      title: "Daily Proof-of-Work Standup Logger",
      href: "/arena/daily-log",
      category: "CORE_ENGINEERING",
      icon: Terminal,
      badge: "+20 to +70 Coins/Day",
      color: "from-emerald-600 to-teal-600",
      what: "An automated engineering standup logger where builders verify their daily code commits and build streaks across Day 1 to Day 45 of their personal internship window.",
      why: "Consistency is the only metric top tech companies care about. Verifiable daily Git commits prove you build real software with high discipline.",
      how: "Select your active enrolled project, summarize what you shipped today, paste your GitHub commit link (+20 Coins), attach your LinkedIn progress post (+50 Coins bonus), and submit.",
      cta: "Submit Daily Standup"
    },
    {
      id: "workspace-qa",
      title: "Agile Workspace, Kanban & Squad Common Chat",
      href: "/arena/p1/workspace",
      category: "CORE_ENGINEERING",
      icon: KanbanSquare,
      badge: "Linear/Jira Board & Squad Chat",
      color: "from-purple-600 to-indigo-700",
      what: "A full-scale Agile sprint workspace with drag-and-drop Kanban, test case assertions (k6 / Playwright), and a real-time common squad chat room for every project.",
      why: "Learn real software development lifecycle (SDLC) practices used by top engineering teams worldwide. Coordinate tasks across Backend, Frontend, ML, and QA roles.",
      how: "Open any project PRD, click 'Agile Workspace', create sprint tickets, run automated test suites, and discuss implementation edge cases in the live squad room.",
      cta: "Open Agile Workspace"
    },
    {
      id: "wallet",
      title: "Student Karma Wallet, Bounties & Hints",
      href: "/arena/wallet",
      category: "REWARDS",
      icon: Coins,
      badge: "Cryptographic Rewards",
      color: "from-amber-500 to-orange-600",
      what: "A cryptographic points ledger that tracks your earned Karma Coins from daily standups, solving blocker bounties, and peer code reviews.",
      why: "Spend coins to unlock architectural hints on complex PRDs, book 1-on-1 founder architecture audits, receive cloud compute credits, or top up via UPI.",
      how: "Earn coins by writing code, spend 300–1,000 coins to unlock architectural secrets on the PRDs, or redeem for verified credentials.",
      cta: "Open Karma Wallet"
    },
    {
      id: "discussions",
      title: "Technical Discussions & Community Forum",
      href: "/discussions",
      category: "COMMUNITY",
      icon: MessageSquare,
      badge: "6 Engineering Channels",
      color: "from-cyan-600 to-blue-600",
      what: "A high-signal discussion forum organized across #general, #showcase, #blockers, #code-reviews, #ai-research, and #announcements.",
      why: "Get instant peer help on database deadlocks, LLM token optimizations, and Docker networking issues. Earn Karma Coins for helpful technical answers.",
      how: "Create threads with formatted Markdown & syntax-highlighted code blocks, upvote valuable responses, and collaborate with fellow builders.",
      cta: "Join Discussions"
    },
    {
      id: "office-hours",
      title: "Weekly Founder Office Hours & Calendar",
      href: "/arena/calendar",
      category: "MENTORSHIP",
      icon: Calendar,
      badge: "Every Wed & Sat (IST)",
      color: "from-rose-600 to-pink-600",
      what: "The central community calendar detailing recurring technical rituals: Wednesday 8:00 PM IST Virtual Stage & Saturday 5:00 PM IST Indore Physical Tech Lab (50+ RSVP trigger).",
      why: "Get direct feedback on your architecture from Founder Soham Sharma, participate in live code teardowns, and network with active builders.",
      how: "RSVP for upcoming physical or virtual sessions, sync events to your Google/Apple calendar, and map your personal 45-day milestones.",
      cta: "View Event Schedule"
    },
    {
      id: "career-checklist",
      title: "Career OS & Profile Audit Checklist",
      href: "/arena/career-checklist",
      category: "CAREER",
      icon: Briefcase,
      badge: "Recruiter Optimization",
      color: "from-blue-700 to-indigo-800",
      what: "An interactive, step-by-step career checklist covering LinkedIn headline optimization, GitHub pinned projects, Proof-of-Work post templates, and cold outreach strategy.",
      why: "Transforms your raw code into inbound recruiter messages and hiring manager interview requests at high-growth startups and tech giants.",
      how: "Check off each milestone, use our 1-click template copy buttons, share on LinkedIn, and submit your link to claim +50 Karma Coins.",
      cta: "Open Career Checklist"
    },
    {
      id: "collaborate-matchmaking",
      title: "Squad Formation & Peer Matchmaking",
      href: "/arena/collaborate",
      category: "COMMUNITY",
      icon: Users,
      badge: "Founder Pairing",
      color: "from-purple-600 to-pink-600",
      what: "A matchmaking portal where builders post project pitches, find complementary skill sets (ML Lead, Backend Dev, QA Tester, Frontend), or request admin pairing.",
      why: "High-scale systems are built by cross-functional squads. Teaming up allows you to ship full-stack distributed systems with enterprise polish.",
      how: "Submit your squad pitch, browse open builder requests, or click 'Request Admin Matchmaking' to be matched with verified peers.",
      cta: "Find Squad Teammates"
    },
    {
      id: "events-conferences",
      title: "AI Summits, Hackathons & QR Check-in",
      href: "/events",
      category: "COMMUNITY",
      icon: Calendar,
      badge: "+300 to +3,000 Coins",
      color: "from-rose-600 to-orange-600",
      what: "Flagship events, in-person summits (like AI Frontier 2026 in Indore), and hackathons with instant digital QR pass check-ins.",
      why: "Meet top founders, senior AI architects, and investors in person. Gain hands-on exposure to frontier tooling and earn large coin rewards.",
      how: "Register for upcoming summits on Lu.ma / Razorpay, receive your secure QR ticket, and scan at the venue for instant check-in grants.",
      cta: "Explore AI Summits"
    },
    {
      id: "custom-project",
      title: "Propose Custom Project & Industry Analysis",
      href: "/arena/custom-project",
      category: "CORE_ENGINEERING",
      icon: Edit3,
      badge: "Custom Track",
      color: "from-emerald-700 to-teal-800",
      what: "A research-backed proposal tool allowing builders to design their own production system by analyzing real-world problems from top industry companies.",
      why: "Gives self-driven engineers the freedom to pursue specialized domains with founder guidance and formal technical PRD review.",
      how: "Use the built-in company research framework, draft problem statement and data contracts, and submit for founder approval.",
      cta: "Propose Custom Blueprint"
    },
    {
      id: "profile-resume",
      title: "Builder Profile & STAR Resume Generator",
      href: "/profile",
      category: "CAREER",
      icon: User,
      badge: "Enrolled-Only Bullets",
      color: "from-indigo-600 to-purple-700",
      what: "Your authenticated builder portal featuring personal 45-day countdown timers, notification preferences, and strict enrolled-only STAR resume bullet generators.",
      why: "Prevents fake resume inflation. Recruiter-ready bullet points and LaTeX blocks are strictly generated only for projects you have enrolled in and actively logged.",
      how: "Log into your profile, track your 45-day progress, select your active enrolled project, and copy bullet points in plain-text or LaTeX format.",
      cta: "Go to My Profile"
    },
    {
      id: "roadmaps",
      title: "Specialized Role Stage Roadmaps",
      href: "/arena/roadmaps",
      category: "CAREER",
      icon: Compass,
      badge: "Stage 1 / 2 / 3",
      color: "from-teal-600 to-cyan-700",
      what: "Curated learning paths across AI Engineering, Backend Distributed Systems, Cloud DevOps, and Full-Stack Systems with Stage 1/2/3 progression.",
      why: "Provides a structured map of libraries, design patterns, and debugging tools needed to execute Arena projects with high technical rigor.",
      how: "Pick your target role, select your current stage (Beginner, Intermediate, Advanced), and follow the concrete engineering milestones.",
      cta: "Explore Roadmaps"
    },
    {
      id: "certificates",
      title: "Cryptographic Credential Verification Engine",
      href: "/certificates",
      category: "CAREER",
      icon: ShieldCheck,
      badge: "Zero-Trust Verification",
      color: "from-slate-800 to-slate-900",
      what: "Public verification engine for certificates issued upon passing the 45-day proof-of-work audit, load test benchmark gates, and founder review.",
      why: "Recruiters and hiring managers can independently verify authenticity, review the exact GitHub commit history, and inspect load test logs.",
      how: "Enter any certificate ID (e.g. `BM-2026-X7K9P`) to inspect student details, verified project, issue date, and cryptographic signature.",
      cta: "Verify a Certificate"
    }
  ];

  const CATEGORIES = [
    { key: "ALL", label: "All Platform Features (14)" },
    { key: "PROGRAMS", label: "Fellowship & Internship (1)" },
    { key: "CORE_ENGINEERING", label: "Core Engineering & Workspaces (5)" },
    { key: "CAREER", label: "Career OS & Resumes (4)" },
    { key: "COMMUNITY", label: "Community & Events (3)" },
    { key: "REWARDS", label: "Karma Wallet & Bounties (1)" }
  ];

  const filteredModules = PLATFORM_MODULES.filter((mod) => {
    if (selectedCategory !== "ALL" && mod.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = mod.title.toLowerCase().includes(q);
      const matchWhat = mod.what.toLowerCase().includes(q);
      const matchWhy = mod.why.toLowerCase().includes(q);
      if (!matchTitle && !matchWhat && !matchWhy) return false;
    }
    return true;
  });

  return (
    <div
      className="bg-white min-h-screen text-slate-900 selection:bg-[#D9F83B] selection:text-slate-950 pt-24 pb-28 font-sans"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(29, 49, 137, 0.11) 1px, transparent 1px), linear-gradient(to bottom, rgba(29, 49, 137, 0.11) 1px, transparent 1px)",
        backgroundSize: "72px 72px",
      }}
    >
      {/* 100% Full-Width Container */}
      <div className="w-full px-4 sm:px-8 lg:px-12 relative z-10">
        
        {/* ── 1. REDESIGNED TECH HERO BANNER CARD ── */}
        <div
          className="relative overflow-hidden rounded-3xl bg-[#162774] p-8 sm:p-12 border border-white/15 shadow-2xl mb-12"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        >
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            {/* Left Column: Title & Description */}
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#D9F83B] text-slate-950 font-sans text-[11px] font-extrabold uppercase tracking-wider shadow-xs">
                Comprehensive Platform &amp; Product Tour
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-sans leading-tight">
                How Botmartz Community <span className="text-[#D9F83B]">Works</span>
              </h1>

              <p className="text-sm sm:text-base text-blue-100/85 font-sans leading-relaxed font-normal">
                Every feature on Botmartz is engineered with one goal: helping authentic builders ship verifiable production architectures, build undeniable proof-of-work, and unlock top-tier engineering roles.
              </p>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-sans text-xs">
                {[
                  { num: "01", val: "14 Modules", label: "Platform Suite", accent: false },
                  { num: "02", val: "4-Week", label: "Sprint Window", accent: false },
                  { num: "03", val: "100% PoW", label: "Verified Commits", accent: true },
                  { num: "04", val: "Karma Ledger", label: "Daily Bounties", accent: true },
                ].map((stat) => (
                  <div
                    key={stat.num}
                    className="relative p-3.5 rounded-2xl bg-white/[0.06] border border-white/15 border-l-4 border-l-[#D9F83B]"
                  >
                    <span className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-[#D9F83B] text-slate-950 font-extrabold text-[10px] flex items-center justify-center shadow-xs">
                      {stat.num}
                    </span>
                    <div className="text-white font-extrabold text-sm pr-7">{stat.val}</div>
                    <div className={`text-[11px] ${stat.accent ? "text-[#D9F83B] font-semibold" : "text-blue-200/80"}`}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: CTA */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 font-sans text-xs shrink-0 self-start lg:self-center">
              <Link
                href="/arena"
                className="px-7 py-3.5 rounded-2xl bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-bold transition-all duration-300 shadow-lg shadow-lime-400/20 flex items-center justify-center gap-2.5 group text-sm cursor-pointer"
              >
                <span>Get Started in Arena</span>
                <span className="w-6 h-6 rounded-full bg-slate-950 text-[#D9F83B] flex items-center justify-center transition-transform duration-300 group-hover:rotate-45">
                  <ArrowRight size={13} />
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* ── 2. 4-STEP STUDENT LIFECYCLE JOURNEY BANNER ── */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 mb-12 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-100 pb-6">
            <div>
              <div className="text-xs font-extrabold text-[#162774] uppercase tracking-wider mb-1">THE 4-STEP JOURNEY</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-sans tracking-tight">How A Student Progresses in 45 Days</h2>
            </div>
            <Link
              href="/arena"
              className="px-6 py-3 rounded-full bg-[#162774] hover:bg-[#1D3189] text-[#D9F83B] font-sans text-xs font-extrabold transition-all duration-300 shadow-md flex items-center gap-2.5 shrink-0 self-start sm:self-auto group"
            >
              <span>Explore {TOTAL_SYSTEMS_COUNT} PRDs</span>
              <span className="w-6 h-6 rounded-full bg-[#D9F83B] text-slate-950 flex items-center justify-center transition-transform duration-300 group-hover:rotate-45">
                <ArrowRight size={12} />
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-sans text-xs">
            {[
              {
                num: "01",
                title: "Select Production PRD",
                desc: `Browse ${TOTAL_SYSTEMS_COUNT} open blueprints from Baby Step to Go To Hell. Complete profile verification and enroll in your chosen track.`,
                tag: "Track Selection",
              },
              {
                num: "02",
                title: "Daily Proof-of-Work",
                desc: "Write code daily, log your GitHub commit URLs, and post LinkedIn updates to earn +20 to +70 Karma Coins every single day.",
                tag: "Commit Streaks",
              },
              {
                num: "03",
                title: "Agile & QA Benchmark",
                desc: "Manage sprint tasks in your Agile Workspace, collaborate with squad peers in the live room, and pass strict k6 load assertions.",
                tag: "SLA Verification",
              },
              {
                num: "04",
                title: "Audit & Referrals",
                desc: "Pass the 5-point proof-of-work audit by Soham Sharma, receive cryptographic credentials, and claim direct startup referrals.",
                tag: "Founder Endorsed",
              },
            ].map((step) => (
              <div
                key={step.num}
                className="relative overflow-hidden rounded-3xl bg-[#F4F6FB] hover:bg-white border border-slate-200 border-l-4 border-l-[#D9F83B] hover:border-[#162774] transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between group"
              >
                <div className="p-6 pb-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-full bg-[#D9F83B] group-hover:bg-[#162774] text-slate-950 group-hover:text-[#D9F83B] flex items-center justify-center font-extrabold text-xs transition-colors duration-500 shadow-xs">
                      {step.num}
                    </span>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#162774]">
                      Step {step.num}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-slate-950 font-sans text-base group-hover:text-[#162774] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans font-medium">
                    {step.desc}
                  </p>
                </div>

                <div className="relative overflow-hidden px-6 py-3 border-t border-slate-200/80 group-hover:border-[#162774] flex items-center justify-between transition-colors duration-500">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[#162774] -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
                      backgroundSize: "28px 28px",
                    }}
                  />
                  <span className="relative z-10 text-[11px] font-bold uppercase tracking-wider text-[#1D3189] group-hover:text-[#D9F83B] transition-colors duration-500">
                    {step.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 3. SEARCH & CATEGORY FILTER BAR (NO ICONS) ── */}
        <div className="bg-[#F4F6FB] border border-slate-200 rounded-3xl p-5 mb-10 shadow-sm space-y-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search features (e.g. daily log, karma wallet, squad chat, resume generator, roadmaps, SLA)..."
            className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm font-sans text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-[#162774] transition-all font-medium"
          />

          <div className="flex items-center gap-2 flex-wrap font-sans text-xs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-4 py-2 rounded-full font-bold transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat.key
                    ? "bg-[#162774] text-[#D9F83B] shadow-sm"
                    : "bg-white text-slate-700 border border-slate-200 hover:border-[#162774]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── 4. MODULES BREAKDOWN 2-COLUMN GRID (NO ICONS, BOTTOM SLIDE HOVER) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {filteredModules.map((module, idx) => (
            <div
              key={module.id}
              id={module.id}
              className="relative overflow-hidden bg-[#F4F6FB] hover:bg-white border border-slate-200 border-l-4 border-l-[#D9F83B] hover:border-[#162774] rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between group"
            >
              <div className="p-7 sm:p-8 pb-5 space-y-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 border-b border-slate-200/80 pb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="w-7 h-7 rounded-full bg-[#D9F83B] group-hover:bg-[#162774] text-slate-950 group-hover:text-[#D9F83B] font-extrabold text-[11px] flex items-center justify-center transition-colors duration-500 shrink-0">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="px-3 py-0.5 rounded-full bg-white text-[#162774] border border-slate-200 text-[10px] font-extrabold uppercase tracking-wider">
                        {module.badge}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-950 font-sans group-hover:text-[#162774] transition-colors duration-200">
                      {module.title}
                    </h3>
                  </div>

                  <Link
                    href={module.href}
                    className="w-9 h-9 rounded-full bg-white group-hover:bg-[#D9F83B] border border-slate-200 text-slate-900 flex items-center justify-center transition-all duration-500 group-hover:rotate-45 shrink-0 shadow-2xs"
                    title={module.cta}
                  >
                    <ArrowRight size={15} />
                  </Link>
                </div>

                {/* 3 Pillars: What / Why / How (Clean Typography, Project Colors, No Icons) */}
                <div className="space-y-3 font-sans text-xs">
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 border-l-2 border-l-[#162774] space-y-1">
                    <div className="text-[#162774] font-extrabold text-[11px] uppercase tracking-wider">
                      What It Is
                    </div>
                    <p className="text-slate-600 leading-relaxed text-xs font-medium">
                      {module.what}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 border-l-2 border-l-[#D9F83B] space-y-1">
                    <div className="text-[#1D3189] font-extrabold text-[11px] uppercase tracking-wider">
                      Why It Exists
                    </div>
                    <p className="text-slate-600 leading-relaxed text-xs font-medium">
                      {module.why}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 border-l-2 border-l-[#162774] space-y-1">
                    <div className="text-[#162774] font-extrabold text-[11px] uppercase tracking-wider">
                      How To Use It
                    </div>
                    <p className="text-slate-600 leading-relaxed text-xs font-medium">
                      {module.how}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Slide Hover Strip */}
              <div className="relative overflow-hidden px-7 sm:px-8 py-4 border-t border-slate-200/80 group-hover:border-[#162774] flex items-center justify-between font-sans text-xs transition-colors duration-500">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[#162774] -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                  }}
                />
                <span className="relative z-10 text-xs text-slate-500 group-hover:text-blue-200 font-semibold transition-colors duration-500">
                  {module.href}
                </span>
                <Link
                  href={module.href}
                  className="relative z-10 text-[#162774] group-hover:text-[#D9F83B] font-extrabold flex items-center gap-2 transition-colors duration-500"
                >
                  <span>{module.cta}</span>
                  <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* ── 5. CALL TO ACTION FOOTER BANNER ── */}
        <div
          className="p-8 sm:p-12 rounded-3xl bg-[#162774] text-white text-center space-y-6 shadow-2xl relative overflow-hidden border border-white/15"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        >
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#D9F83B] text-slate-950 font-sans text-xs font-extrabold uppercase tracking-wider">
            Start Your 45-Day Sprint Today
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-sans max-w-2xl mx-auto tracking-tight">
            Ready to Build Authentic Production Proof-of-Work?
          </h2>
          <p className="text-blue-100/85 font-sans text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-normal">
            Select an industrial system blueprint, enroll with your verified student profile, and start building with daily founder accountability.
          </p>

          <div className="flex items-center justify-center gap-4 pt-2 flex-wrap font-sans text-xs sm:text-sm">
            <Link
              href="/arena"
              className="px-7 py-3.5 rounded-full bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-extrabold transition-all duration-300 shadow-lg flex items-center gap-2.5 group cursor-pointer"
            >
              <span>Browse {TOTAL_SYSTEMS_COUNT} PRDs</span>
              <span className="w-6 h-6 rounded-full bg-slate-950 text-[#D9F83B] flex items-center justify-center transition-transform duration-300 group-hover:rotate-45">
                <ArrowRight size={12} />
              </span>
            </Link>
            <Link
              href="/login"
              className="px-7 py-3.5 rounded-full bg-white/10 hover:bg-white hover:text-slate-950 text-white font-extrabold transition-all duration-300 border border-white/25 cursor-pointer"
            >
              Create Builder Profile
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
