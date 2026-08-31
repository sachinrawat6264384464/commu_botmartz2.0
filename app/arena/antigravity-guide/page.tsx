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
  Search
} from "lucide-react";

export default function PlatformGuidePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const PLATFORM_MODULES = [
    {
      id: "arena",
      title: "Internship Playground (50 PRD Blueprints)",
      href: "/arena",
      category: "CORE_ENGINEERING",
      icon: Layers,
      badge: "50 Production PRDs",
      color: "from-blue-600 to-indigo-600",
      what: "A catalog of 50 industrial-grade software blueprints across 20 tech domains (Geospatial AI, Agent Swarms, WebGPU, eBPF, High-Frequency Trading, Healthcare AI, and Rust systems).",
      why: "Traditional tutorials build shallow toy apps (to-do lists, simple chatbots). The Arena gives you multi-table relational/vector schemas, REST/gRPC endpoints, Docker setups, and sub-150ms SLA test gates.",
      how: "Filter by your desired tech stack or domain, read the full PRD specs, click 'Enroll Now', and initialize your GitHub repository following the architecture blueprint.",
      cta: "Explore 50 PRDs"
    },
    {
      id: "daily-log",
      title: "Daily Proof-of-Work Standup Logger",
      href: "/arena/daily-log",
      category: "CORE_ENGINEERING",
      icon: Terminal,
      badge: "+20 to +70 Coins/Day",
      color: "from-emerald-600 to-teal-600",
      what: "The daily engineering sprint tracker automatically mapped to your enrolled projects and sprint day progression (Day 1 through Day 45).",
      why: "Real software engineering requires consistency. Daily commits provide verifiable proof of work and allow founders and admins to audit your code quality.",
      how: "Select your enrolled project, write what you shipped today, paste your GitHub commit link (+20 Coins), attach your LinkedIn progress post (+50 Coins bonus), and submit.",
      cta: "Submit Today's Log"
    },
    {
      id: "virtual-fellowship",
      title: "45-Day Virtual AI Engineering Fellowship",
      href: "/virtual-ai-internship",
      category: "PROGRAMS",
      icon: Sparkles,
      badge: "Curriculum & Fellowship",
      color: "from-purple-600 to-indigo-600",
      what: "The structured milestone fellowship program running from kickoff to completion with clear milestone checkpoints and founder technical reviews.",
      why: "Provides structure for students who want weekly deadlines, cryptographic credential verification, and 1-on-1 architecture teardowns with Founder Soham Sharma.",
      how: "Start in the Open Builder free tier, or upgrade to the Verified Pass (₹299) or Elite Founder Track (₹1,999) via the live Razorpay gateway.",
      cta: "View Fellowship Tracks"
    },
    {
      id: "wallet",
      title: "Student Karma Wallet & Rewards",
      href: "/arena/wallet",
      category: "REWARDS",
      icon: Coins,
      badge: "Cryptographic Rewards",
      color: "from-amber-500 to-orange-600",
      what: "The decentralized builder rewards ledger that tracks your earned Karma Coins from daily standup logs, peer code reviews, and bug bounties.",
      why: "Rewards open-source builders with practical privileges: 1-on-1 Founder Technical Clinics, Mock System Design Interviews, physical roadmap swag books, and cloud compute grants.",
      how: "Earn coins by submitting daily commits (+50 to +70 coins), redeem coins for grants and clinic slots, or top up securely via UPI/Razorpay.",
      cta: "Open Karma Wallet"
    },
    {
      id: "discussions",
      title: "Technical Discussions & Channel Forum",
      href: "/discussions",
      category: "COMMUNITY",
      icon: MessageSquare,
      badge: "6 Tech Channels",
      color: "from-cyan-600 to-blue-600",
      what: "A Reddit/Discourse-style engineering forum categorized by technical channels (#general, #showcase, #blockers, #code-reviews, #ai-research, #announcements).",
      why: "A dedicated space to ask technical architecture questions, get unblocked on database deadlocks, request peer code reviews, and showcase weekly demo videos.",
      how: "Join channels, create posts with formatted code snippets, reply to peers, and earn Karma Coins for solving blockers.",
      cta: "Join Discussions"
    },
    {
      id: "office-hours",
      title: "Weekly Founder Office Hours & Calendar",
      href: "/arena/calendar",
      category: "MENTORSHIP",
      icon: Calendar,
      badge: "Every Saturday 3-7 PM",
      color: "from-rose-600 to-pink-600",
      what: "The central cohort calendar listing weekly live architecture clinics and offline/hybrid AI summits.",
      why: "Join Founder Soham Sharma live on Discord / Google Meet for real-time system design reviews, latency optimization (<150ms), and PR debugging.",
      how: "Check the upcoming Saturday session, sync the event to your Google/Apple calendar with 1 click, and join via the Discord stage.",
      cta: "View Schedule & Calendar"
    },
    {
      id: "career-checklist",
      title: "Career & LinkedIn UGC Checklist",
      href: "/arena/career-checklist",
      category: "CAREER",
      icon: Briefcase,
      badge: "Recruiter Optimization",
      color: "from-blue-700 to-indigo-800",
      what: "An 8-step interactive checklist covering LinkedIn headline surgery, GitHub README setup, proof-of-work post templates, and cold outreach frameworks.",
      why: "Most students build projects that nobody sees. This system turns your daily proof-of-work into recruiter visibility and inbound interview calls.",
      how: "Follow each checklist card, use the 1-click copy post composer, publish your progress on LinkedIn, and submit your link to claim +50 coins.",
      cta: "Open Career Checklist"
    },
    {
      id: "custom-project",
      title: "Propose Custom Project & Research Framework",
      href: "/arena/custom-project",
      category: "CORE_ENGINEERING",
      icon: Edit3,
      badge: "Custom Track",
      color: "from-emerald-700 to-teal-800",
      what: "A structured portal for proposing your own unique production project by analyzing 20-30 top industry companies and open data sources.",
      why: "Allows ambitious builders to tackle novel industry domain problems not covered in the 50 PRDs while maintaining high architectural standards.",
      how: "Use the top-company research framework, define your core problem statement and public data source, write your schema PRD, and submit for founder review.",
      cta: "Propose Custom PRD"
    },
    {
      id: "profile-resume",
      title: "Builder Profile & STAR Resume Generator",
      href: "/profile",
      category: "CAREER",
      icon: User,
      badge: "Public Portfolio & ATS",
      color: "from-indigo-600 to-purple-700",
      what: "Your public builder portfolio, verified badge status, and automated STAR-format resume bullet-point generator.",
      why: "Instantly translate your complex technical PRD implementations into high-impact, recruiter-friendly bullet points for your resume and LinkedIn.",
      how: "Log into your profile, complete the 5 verification points, select any enrolled project, and copy formatted plain-text or LaTeX resume bullet blocks.",
      cta: "Go to My Profile"
    },
    {
      id: "roadmaps",
      title: "50 Progressive Career Roadmaps",
      href: "/arena/roadmaps",
      category: "CAREER",
      icon: Compass,
      badge: "Self-Paced Paths",
      color: "from-teal-600 to-cyan-700",
      what: "Step-by-step career path guides for AI Engineers, MLOps Specialists, Fullstack Developers, and Systems Engineers.",
      why: "Know exactly which foundational concepts, tools, and algorithms to master at each stage of your engineering journey.",
      how: "Browse the visual roadmap cards, track your milestone progress, and build the corresponding Arena projects.",
      cta: "View Roadmaps"
    }
  ];

  const filteredModules = PLATFORM_MODULES.filter((m) => {
    const matchesCat = selectedCategory === "ALL" || m.category === selectedCategory;
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.what.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.why.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAFCFF] text-slate-900 pb-24 font-sans selection:bg-[#0066FF] selection:text-white">
      
      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-[#0066FF] font-mono text-xs font-bold uppercase tracking-wider mb-3 border border-blue-200">
            <BookOpen size={14} /> Comprehensive Platform &amp; Ecosystem Guide
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-sans mb-3">
            How Botmartz Works &amp; What Every Page Does
          </h1>
          <p className="text-slate-600 text-xs sm:text-base font-mono max-w-3xl leading-relaxed">
            Your complete interactive sitemap and tour guide. Understand <strong>what each feature is</strong>, <strong>why it exists</strong>, and <strong>how to use it</strong> to maximize your proof-of-work.
          </p>

          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-100 font-mono text-xs">
            <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
              {[
                { id: "ALL", label: "All Pages (10)" },
                { id: "CORE_ENGINEERING", label: "Engineering & PRDs" },
                { id: "CAREER", label: "Career & Resume" },
                { id: "REWARDS", label: "Wallet & Grants" },
                { id: "COMMUNITY", label: "Community & Events" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                    selectedCategory === tab.id
                      ? "bg-[#0066FF] text-white shadow-xs"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search features (e.g. daily log, wallet)..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#0066FF]"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Grid of Platform Modules */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredModules.map((mod) => {
            const IconComponent = mod.icon;
            return (
              <div
                key={mod.id}
                className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  
                  {/* Top Bar */}
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${mod.color} text-white flex items-center justify-center shadow-xs`}>
                        <IconComponent size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 font-sans">
                          {mod.title}
                        </h3>
                        <span className="text-[11px] font-mono text-slate-400">
                          {mod.href}
                        </span>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-blue-50 text-[#0066FF] border border-blue-200 font-mono text-[10px] font-bold shrink-0">
                      {mod.badge}
                    </span>
                  </div>

                  {/* 3 Explanation Pillars */}
                  <div className="space-y-3 font-mono text-xs mt-4 pt-4 border-t border-slate-100">
                    
                    {/* What it is */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">
                        1. What It Is:
                      </div>
                      <p className="text-slate-700 leading-relaxed font-sans text-xs">
                        {mod.what}
                      </p>
                    </div>

                    {/* Why it exists */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-1">
                        2. Why It Exists:
                      </div>
                      <p className="text-slate-700 leading-relaxed font-sans text-xs">
                        {mod.why}
                      </p>
                    </div>

                    {/* How to use it */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <div className="text-[10px] font-bold text-purple-700 uppercase tracking-wider mb-1">
                        3. How To Use It:
                      </div>
                      <p className="text-slate-700 leading-relaxed font-sans text-xs">
                        {mod.how}
                      </p>
                    </div>

                  </div>

                </div>

                {/* Bottom CTA */}
                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between font-mono text-xs">
                  <span className="text-slate-400">Ready to test?</span>
                  <Link
                    href={mod.href}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center gap-2 transition-all shadow-xs"
                  >
                    <span>{mod.cta}</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Student Onboarding Callout */}
        <div className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-slate-950 to-blue-950 text-white border border-blue-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-xs">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wider">
              <Zap size={14} /> Recommended First Step
            </div>
            <h3 className="text-xl font-bold font-sans text-white">
              Complete Your Student Profile &amp; Earn +100 Karma Coins
            </h3>
            <p className="text-slate-300 font-mono text-xs max-w-xl leading-relaxed">
              Verify your college/company name, GitHub handle, and LinkedIn URL on your profile to unlock full platform access.
            </p>
          </div>

          <Link
            href="/profile"
            className="px-6 py-3.5 rounded-2xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold uppercase tracking-wider transition-all whitespace-nowrap shadow-md"
          >
            Complete Profile Now &rarr;
          </Link>
        </div>

      </div>

    </div>
  );
}
