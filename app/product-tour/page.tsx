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
      title: "The Engineering Arena (50+ Production PRDs)",
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
    <div className="bg-[#FAFCFF] min-h-screen text-slate-900 selection:bg-[#0066FF] selection:text-white pt-24 pb-28 font-sans">
      {/* 100% Full-Width Container */}
      <div className="w-full px-4 sm:px-8 lg:px-12 relative z-10">
        
        {/* ── 1. REDESIGNED TECH HERO BANNER CARD ── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 p-6 sm:p-12 border border-slate-800 shadow-2xl mb-12">
          {/* Background Ambient Glows */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            {/* Left Column: Title & Description */}
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-cyan-400 font-mono text-xs font-bold border border-cyan-500/20 backdrop-blur-md shadow-xs">
                <BookOpen size={14} className="text-cyan-400" />
                <span>COMPREHENSIVE PLATFORM &amp; PRODUCT TOUR</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-sans leading-tight">
                How Botmartz Community <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">Works</span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                Every feature on Botmartz is engineered with one goal: helping authentic builders ship verifiable production architectures, build undeniable proof-of-work, and unlock top-tier engineering roles.
              </p>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono text-xs">
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <Layers size={16} className="text-blue-400 shrink-0" />
                  <div>
                    <div className="text-white font-bold text-sm">14 Modules</div>
                    <div className="text-slate-400 text-[10px]">Platform Suite</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <Zap size={16} className="text-cyan-400 shrink-0" />
                  <div>
                    <div className="text-white font-bold text-sm">45-Day</div>
                    <div className="text-slate-400 text-[10px]">Sprint Window</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-white font-bold text-sm">100% PoW</div>
                    <div className="text-slate-400 text-[10px]">Verified Commits</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <Coins size={16} className="text-amber-400 shrink-0" />
                  <div>
                    <div className="text-white font-bold text-sm">Karma Ledger</div>
                    <div className="text-slate-400 text-[10px]">Daily Bounties</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: CTA */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 font-mono text-xs shrink-0 self-start lg:self-center">
              <Link
                href="/arena"
                className="px-7 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2 group"
              >
                <span>Get Started in Arena</span>
                <ArrowRight size={15} className="text-cyan-300 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* ── 2. 4-STEP STUDENT LIFECYCLE JOURNEY BANNER ── */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 mb-12 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-100 pb-5">
            <div>
              <div className="text-xs font-mono font-bold text-[#0066FF] uppercase tracking-wider mb-1">THE 4-STEP JOURNEY</div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans tracking-tight">How A Student Progresses in 45 Days</h2>
            </div>
            <Link
              href="/arena"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold transition-all shadow-xs flex items-center gap-2 shrink-0 self-start sm:self-auto"
            >
              <span>Explore 50 PRDs</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-mono text-xs">
            <div className="p-6 rounded-3xl bg-blue-50/60 border border-blue-100 space-y-3 relative overflow-hidden group hover:border-blue-300 transition-all">
              <div className="w-9 h-9 rounded-xl bg-[#0066FF] text-white flex items-center justify-center font-bold text-sm shadow-xs">1</div>
              <h3 className="font-bold text-slate-900 font-sans text-base">Select Production PRD</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Browse 50 open blueprints from Baby Step to Go To Hell 💀. Complete profile verification and enroll in your chosen track.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-indigo-50/60 border border-indigo-100 space-y-3 relative overflow-hidden group hover:border-indigo-300 transition-all">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">2</div>
              <h3 className="font-bold text-slate-900 font-sans text-base">Daily Proof-of-Work</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Write code daily, log your GitHub commit URLs, and post LinkedIn updates to earn +20 to +70 Karma Coins every single day.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-purple-50/60 border border-purple-100 space-y-3 relative overflow-hidden group hover:border-purple-300 transition-all">
              <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">3</div>
              <h3 className="font-bold text-slate-900 font-sans text-base">Agile &amp; QA Benchmark</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Manage sprint tasks in your Agile Workspace, collaborate with squad peers in the live room, and pass strict k6 load assertions.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-emerald-50/60 border border-emerald-100 space-y-3 relative overflow-hidden group hover:border-emerald-300 transition-all">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">4</div>
              <h3 className="font-bold text-slate-900 font-sans text-base">Audit &amp; Referrals</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Pass the 5-point proof-of-work audit by Soham Sharma, receive cryptographic credentials, and claim direct startup referrals.
              </p>
            </div>
          </div>
        </div>

        {/* ── 3. SEARCH & CATEGORY FILTER BAR ── */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 mb-8 shadow-xs space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search features (e.g. daily log, karma wallet, squad chat, resume generator, roadmaps, SLA)..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#0066FF] transition-all"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.key
                    ? "bg-[#0066FF] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── 4. MODULES BREAKDOWN 2-COLUMN GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          {filteredModules.map((module, idx) => {
            const Icon = module.icon;
            return (
              <div
                key={module.id}
                id={module.id}
                className="bg-white border border-slate-200 hover:border-blue-400/80 rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6 group"
              >
                <div>
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5 mb-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${module.color} text-white flex items-center justify-center shrink-0 shadow-xs`}>
                        <Icon size={22} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 font-sans group-hover:text-[#0066FF] transition-colors">
                            {idx + 1}. {module.title}
                          </h3>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0066FF] font-mono text-[10px] font-bold border border-blue-100">
                          {module.badge}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={module.href}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-mono text-xs font-bold transition-all shrink-0 flex items-center justify-center"
                      title={module.cta}
                    >
                      <ArrowRight size={15} />
                    </Link>
                  </div>

                  {/* 3 Pillars: What / Why / How */}
                  <div className="space-y-3 font-mono text-xs">
                    
                    {/* What */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                      <div className="flex items-center gap-1.5 text-blue-700 font-bold font-sans text-[11px] uppercase">
                        <HelpCircle size={13} />
                        <span>What It Is</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed font-sans text-xs">
                        {module.what}
                      </p>
                    </div>

                    {/* Why */}
                    <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-1">
                      <div className="flex items-center gap-1.5 text-amber-800 font-bold font-sans text-[11px] uppercase">
                        <Zap size={13} />
                        <span>Why It Exists</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed font-sans text-xs">
                        {module.why}
                      </p>
                    </div>

                    {/* How */}
                    <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-800 font-bold font-sans text-[11px] uppercase">
                        <CheckCircle2 size={13} />
                        <span>How To Use It</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed font-sans text-xs">
                        {module.how}
                      </p>
                    </div>

                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between font-mono text-xs">
                  <span className="text-[11px] text-slate-400">Route: {module.href}</span>
                  <Link
                    href={module.href}
                    className="text-[#0066FF] font-bold hover:underline flex items-center gap-1"
                  >
                    <span>{module.cta}</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>

              </div>
            );
          })}
        </div>

        {/* ── 5. CALL TO ACTION FOOTER BANNER ── */}
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-950 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 font-mono text-xs font-bold uppercase border border-blue-500/30">
            <Sparkles size={14} /> START YOUR 45-DAY SPRINT TODAY
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-sans max-w-2xl mx-auto">
            Ready to Build Authentic Production Proof-of-Work?
          </h2>
          <p className="text-slate-400 font-mono text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Select an industrial system blueprint, enroll with your verified student profile, and start building with daily founder accountability.
          </p>

          <div className="flex items-center justify-center gap-4 pt-2 flex-wrap font-mono text-xs">
            <Link
              href="/arena"
              className="px-7 py-3.5 rounded-2xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold transition-all shadow-md flex items-center gap-2"
            >
              <Layers size={15} />
              <span>Browse 50 PRDs</span>
            </Link>
            <Link
              href="/login"
              className="px-7 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all border border-slate-700 flex items-center gap-2"
            >
              <User size={15} />
              <span>Create Builder Profile</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
