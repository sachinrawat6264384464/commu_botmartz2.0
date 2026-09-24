"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Search,
  CheckCircle2,
  Users,
  Clock,
  Mail,
  Send,
  Ticket,
  ExternalLink,
  MessageSquare,
  BookOpen,
  Award,
  Zap,
  Flame,
  Radio,
  Coins,
  ShieldCheck,
  Check,
  GraduationCap,
  Building2,
  QrCode,
  Maximize2,
  X
} from "lucide-react";
import EventRegistrationWizard from "./[slug]/EventRegistrationWizard";

export default function PublicEventsPage() {
  const [activeFilter, setActiveFilter] = useState<"all" | "workshops">("all");
  const [sortOption, setSortOption] = useState("upcoming");
  const [selectedEventForWizard, setSelectedEventForWizard] = useState<any | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const campusSessions = [
    {
      date: "September 15, 2026",
      college: "Prestige College",
      fullName: "Prestige Institute of Engineering Management & Research (PIEMR)",
      location: "Indore, MP",
      topic: "Building Production AI Infrastructure & LLM Systems",
      speaker: "Soham Sharma & Botmartz Core Team",
      status: "Scheduled Keynote",
      badge: "Campus Keynote"
    },
    {
      date: "September 18, 2026",
      college: "IET DAVV College",
      fullName: "Institute of Engineering & Technology (IET DAVV)",
      location: "Indore, MP",
      topic: "Autonomous AI Agents, LangGraph & MCP Teardowns",
      speaker: "Soham Sharma & Botmartz Core Team",
      status: "Scheduled Keynote",
      badge: "Keynote & Workshop"
    },
    {
      date: "September 18, 2026",
      college: "SAGE College",
      fullName: "SAGE University / SAGE College of Engineering",
      location: "Indore, MP",
      topic: "Enterprise RAG, Vector Search & Modern AI Careers",
      speaker: "Soham Sharma & Botmartz Core Team",
      status: "Scheduled Keynote",
      badge: "Campus Session"
    },
    {
      date: "September 21, 2026",
      college: "Acropolis College",
      fullName: "Acropolis Institute of Technology & Research (AITR)",
      location: "Indore, MP",
      topic: "Production AI Engineering & Zero-to-One Startup Systems",
      speaker: "Soham Sharma & Botmartz Core Team",
      status: "Scheduled Keynote",
      badge: "Keynote & Teardown"
    },
    {
      date: "October 7, 2026",
      college: "IIST College",
      fullName: "Indore Institute of Science and Technology (IIST)",
      location: "Indore, MP",
      topic: "Next-Gen AI Agents, Tool Integration & Benchmark Evals",
      speaker: "Soham Sharma & Botmartz Core Team",
      status: "Scheduled Keynote",
      badge: "Campus Keynote"
    },
    {
      date: "October 8, 2026",
      college: "Vaishnav College",
      fullName: "Shri Vaishnav Vidyapeeth Vishwavidyalaya (SVVV)",
      location: "Indore, MP",
      topic: "Full-Stack AI Architecture & High-Scale Systems",
      speaker: "Soham Sharma & Botmartz Core Team",
      status: "Scheduled Keynote",
      badge: "Campus Session"
    }
  ];

  const handleScrollToEvents = () => {
    const el = document.getElementById("events-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubmitted(true);
      setTimeout(() => setNewsletterSubmitted(false), 4000);
      setNewsletterEmail("");
    }
  };

  return (
    <main className="min-h-screen bg-[#040914] text-white pt-4 pb-20 font-sans selection:bg-[#0066FF] selection:text-white">
      
      {/* ── SECTION 1: 100% FULL-WIDTH HERO BANNER ── */}
      <section className="relative pt-12 pb-20 px-4 sm:px-8 lg:px-12 border-b border-slate-800/80 overflow-hidden">
        
        {/* Ambient Glow & Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b18_1px,transparent_1px),linear-gradient(to_bottom,#1e293b18_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        <div className="absolute top-0 left-1/4 w-[900px] h-[400px] bg-gradient-to-tr from-[#0066FF]/25 via-[#00B8F0]/15 to-purple-600/10 blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-[500px] h-[300px] bg-blue-600/10 blur-[120px] pointer-events-none" />

        <div className="w-full relative z-10">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>&rsaquo;</span>
            <Link href="/community" className="hover:text-white transition-colors">Community</Link>
            <span>&rsaquo;</span>
            <span className="text-[#00B8F0] font-bold">Events &amp; Summits</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Title & Mission */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#0066FF]/20 to-[#00B8F0]/10 border border-[#0066FF]/40 text-[#00B8F0] font-mono text-xs font-bold tracking-wider uppercase backdrop-blur-md shadow-lg shadow-blue-500/10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
                </span>
                <Radio size={14} className="text-[#00B8F0] animate-pulse" />
                <span>BOTMARTZ COMMUNITY EVENTS &bull; INDORE &amp; HYBRID</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] font-sans">
                Where the AI <br />
                Engineering <span className="bg-gradient-to-r from-[#00B8F0] via-cyan-300 to-blue-400 bg-clip-text text-transparent">Community</span> Meets
              </h1>

              <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed font-sans max-w-2xl">
                Annual conferences, monthly deep-dive workshops, open-source build nights and hackathons &mdash; engineered for builders who ship production AI, not spectators watching from the sidelines.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 font-mono text-xs">
                <button
                  onClick={handleScrollToEvents}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#0066FF] via-blue-600 to-[#0052CC] hover:from-blue-500 hover:to-[#0066FF] text-white font-bold uppercase tracking-wider transition-all shadow-xl shadow-blue-600/30 flex items-center gap-2.5 cursor-pointer group"
                >
                  <Sparkles size={16} className="text-cyan-300 group-hover:rotate-12 transition-transform" />
                  <span>See What's Coming Up</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-slate-300 backdrop-blur-md">
                  <Coins size={16} className="text-amber-400" />
                  <span>Earn up to <strong>+3,000 Karma Coins</strong> on check-in</span>
                </div>
              </div>
            </div>

            {/* Right Column: 4 Stat Glass Cards */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              
              <div className="p-6 rounded-3xl bg-gradient-to-b from-[#0B152C] to-[#060D1E] border border-white/10 hover:border-[#0066FF]/60 transition-all space-y-2 group shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform" />
                <div className="w-10 h-10 rounded-2xl bg-[#0066FF]/20 border border-[#0066FF]/40 text-[#00B8F0] flex items-center justify-center font-bold">
                  <Calendar size={20} />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white font-sans tracking-tight">6+</div>
                <div className="text-xs font-mono text-slate-400 font-semibold">Events &amp; Bootcamps / Year</div>
              </div>

              <div className="p-6 rounded-3xl bg-gradient-to-b from-[#0B152C] to-[#060D1E] border border-white/10 hover:border-[#0066FF]/60 transition-all space-y-2 group shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform" />
                <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center font-bold">
                  <Award size={20} />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white font-sans tracking-tight">1</div>
                <div className="text-xs font-mono text-slate-400 font-semibold">Flagship AI Summit</div>
              </div>

              <div className="p-6 rounded-3xl bg-gradient-to-b from-[#0B152C] to-[#060D1E] border border-white/10 hover:border-[#0066FF]/60 transition-all space-y-2 group shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform" />
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold">
                  <Users size={20} />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white font-sans tracking-tight">100+</div>
                <div className="text-xs font-mono text-slate-400 font-semibold">Community Engineers</div>
              </div>

              <div className="p-6 rounded-3xl bg-gradient-to-b from-[#0B152C] to-[#060D1E] border border-white/10 hover:border-[#0066FF]/60 transition-all space-y-2 group shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform" />
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold">
                  <Zap size={20} />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-[#00B8F0] font-sans tracking-tight">2026</div>
                <div className="text-xs font-mono text-slate-400 font-semibold">Community Launch</div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ── SECTION 2: 100% FULL-WIDTH FEATURED FLAGSHIP SUMMIT BANNER ── */}
      <section id="events-section" className="py-16 px-4 sm:px-8 lg:px-12 bg-white text-slate-900">
        <div className="w-full space-y-8">
          
          {/* Filter Bar & Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs bg-slate-50 border-2 border-slate-300 rounded-2xl p-3 shadow-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-5 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                  activeFilter === "all"
                    ? "bg-[#0066FF] text-white shadow-md shadow-blue-500/20"
                    : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
                }`}
              >
                All Events
              </button>

              <button
                onClick={() => setActiveFilter("workshops")}
                className={`px-5 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                  activeFilter === "workshops"
                    ? "bg-[#0066FF] text-white shadow-md shadow-blue-500/20"
                    : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
                }`}
              >
                Workshops &amp; Series
              </button>
            </div>

            <div className="flex items-center gap-3 font-semibold text-slate-600">
              <span>Sort Schedule:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-white border-2 border-slate-300 text-slate-900 font-bold px-4 py-2 rounded-xl focus:outline-none focus:border-[#0066FF] cursor-pointer"
              >
                <option value="upcoming">Upcoming First</option>
                <option value="recent">Recent Past</option>
              </select>
            </div>
          </div>

          {/* Featured Card (AI Frontier 2026 Summit) */}
          <div className="p-8 sm:p-12 lg:p-14 rounded-3xl bg-gradient-to-br from-[#060D1E] via-[#0A1633] to-[#040914] text-white border-2 border-blue-500/40 shadow-2xl relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center group">
            
            {/* Ambient Lighting Accent */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="lg:col-span-9 space-y-6 relative z-10">
              
              <div className="flex flex-wrap items-center gap-3 font-mono text-xs font-bold">
                <span className="px-3.5 py-1.5 rounded-full bg-[#00B8F0]/20 text-[#00B8F0] border border-[#00B8F0]/40 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame size={14} className="text-cyan-400" />
                  <span>FLAGSHIP CONFERENCE</span>
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 size={14} />
                  <span>COMPLETED EDITION</span>
                </span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-white font-sans tracking-tight leading-tight">
                AI Frontier 2026 &mdash; <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">The Future of AI Engineering</span>
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl font-sans">
                Agents &bull; Enterprise RAG &bull; AI-Assisted Software Development &bull; Responsible AI. A full day of technical teardowns, live coding workshops, fireside keynotes, and career roadmap panels.
              </p>

              {/* Date & Location Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs pt-2 max-w-2xl">
                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <div className="w-12 h-12 rounded-xl bg-[#0066FF] text-white font-bold font-sans text-lg flex items-center justify-center shadow-md shrink-0">
                    23
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm font-sans">Sunday, Aug 23, 2026</div>
                    <div className="text-slate-400 text-[11px]">10:00 AM &ndash; 5:00 PM IST</div>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-[#00B8F0] flex items-center justify-center border border-cyan-500/30 shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm font-sans">Indore, India / Hybrid</div>
                    <div className="text-[#00B8F0] text-[11px] font-bold">Walkover Campus Venue</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4 font-mono text-xs">
                <button
                  disabled
                  className="px-8 py-4 rounded-2xl bg-slate-800 text-slate-400 font-bold uppercase tracking-wider border border-slate-700/60 flex items-center gap-2 cursor-not-allowed opacity-75 pointer-events-none"
                >
                  <Ticket size={16} />
                  <span>Registration Closed</span>
                </button>

                <Link
                  href="/community/events/ai-frontier-2026"
                  className="px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all border border-white/20 flex items-center gap-2"
                >
                  <span>View Full Event Page</span>
                  <ArrowRight size={15} />
                </Link>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ── SECTION: CAMPUS AI KEYNOTE TOUR 2026 ── */}
      <section className="py-16 px-4 sm:px-8 lg:px-12 bg-white text-slate-900 border-t-2 border-b-2 border-slate-200 relative overflow-hidden">
        
        {/* Subtle Ambient Background Lighting */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full relative z-10 space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#0066FF] font-mono text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
                <GraduationCap size={15} className="text-[#0066FF]" />
                <span>COLLEGE CAMPUS TOUR 2026</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-950 font-sans tracking-tight leading-tight">
                Campus Keynote &amp; AI Teardown Sessions
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm font-sans mt-2 max-w-3xl leading-relaxed">
                Live engineering masterclasses, production AI system teardowns, and career roadmap sessions led by <strong>Soham Sharma</strong> &amp; Team Botmartz across Central India&apos;s premier technical institutions.
              </p>
            </div>

            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 border border-slate-300 font-mono text-xs text-slate-700 shadow-xs shrink-0">
              <MapPin size={15} className="text-[#0066FF]" />
              <span className="font-bold">6 College Sessions Scheduled</span>
            </div>
          </div>

          {/* 6 College Session Cards Grid with Hover & Micro-animations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
            {campusSessions.map((session, idx) => (
              <div
                key={idx}
                className="p-7 rounded-3xl bg-white border-2 border-slate-200 hover:border-[#0066FF] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-out flex flex-col justify-between space-y-6 group relative overflow-hidden"
              >
                {/* Subtle Hover Ambient Accent */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/15 group-hover:scale-150 transition-all duration-500 pointer-events-none" />

                <div className="space-y-4 relative z-10">
                  {/* Top Bar: Date & Status */}
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="px-3.5 py-1.5 rounded-full bg-blue-50 text-[#0066FF] border border-blue-200 font-bold flex items-center gap-1.5 shadow-xs group-hover:bg-[#0066FF] group-hover:text-white transition-colors duration-300">
                      <Calendar size={13} />
                      <span>{session.date}</span>
                    </span>

                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{session.status}</span>
                    </span>
                  </div>

                  {/* College Name & Full Title */}
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-[#0066FF] font-bold mb-1">
                      <Building2 size={14} className="text-[#0066FF] group-hover:scale-110 transition-transform duration-300" />
                      <span>{session.college}</span>
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-900 font-sans group-hover:text-[#0066FF] transition-colors duration-300 leading-snug">
                      {session.fullName}
                    </h3>
                  </div>

                  {/* Session Topic */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 group-hover:bg-blue-50/50 group-hover:border-blue-200 transition-colors duration-300 space-y-1">
                    <div className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wide">Keynote Focus:</div>
                    <p className="text-xs text-slate-800 font-sans font-medium leading-relaxed">
                      {session.topic}
                    </p>
                  </div>
                </div>

                {/* Footer Details: Speaker & Location */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between font-mono text-xs relative z-10">
                  <div className="flex items-center gap-1.5 text-slate-600 text-[11px] font-semibold">
                    <Users size={13} className="text-amber-500 group-hover:rotate-12 transition-transform duration-300" />
                    <span>Keynote by <strong>{session.speaker}</strong></span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500 text-[11px] font-medium">
                    <MapPin size={12} className="text-rose-500" />
                    <span>{session.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── SECTION 3: 100% FULL-WIDTH CORE ENGINEERING PILLARS ── */}
      <section className="py-16 px-4 sm:px-8 lg:px-12 bg-slate-50 text-slate-900 border-t-2 border-b-2 border-slate-200">
        <div className="w-full space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono text-[#0066FF] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Zap size={14} className="text-[#0066FF]" />
                <span>COMMUNITY CURRICULUM &amp; FOCUS AREAS</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-950 font-sans tracking-tight">
                Production AI Engineering Highlights
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-sans mt-1 max-w-3xl">
                Master the 5 essential pillars of modern AI engineering through hands-on teardowns, open-source architectures, and live coding exercises.
              </p>
            </div>

            <Link
              href="/workshops"
              className="text-xs font-mono font-bold text-[#0066FF] hover:underline flex items-center gap-1 shrink-0"
            >
              <span>Explore All Bootcamps &amp; Tracks &rarr;</span>
            </Link>
          </div>

          {/* Core Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 font-sans text-xs">
            
            {/* Pillar 1 */}
            <div className="p-6 rounded-3xl bg-white border-2 border-slate-300 hover:border-rose-500 shadow-md hover:shadow-xl flex flex-col justify-between space-y-4 transition-all group">
              <div className="space-y-2">
                <span className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 font-mono text-[10px] font-bold uppercase">
                  PILLAR 01 &bull; AGENTS
                </span>
                <h3 className="font-bold text-slate-950 text-sm group-hover:text-rose-600 transition-colors">Autonomous AI State Machines</h3>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  LangGraph state graphs, checkpointing, multi-agent delegation &amp; human-in-the-loop loops.
                </p>
              </div>
              <div className="font-mono text-[11px] text-rose-700 font-bold border-t border-slate-100 pt-3">
                LangGraph &bull; Pydantic
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-3xl bg-white border-2 border-slate-300 hover:border-[#0066FF] shadow-md hover:shadow-xl flex flex-col justify-between space-y-4 transition-all group">
              <div className="space-y-2">
                <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 font-mono text-[10px] font-bold uppercase">
                  PILLAR 02 &bull; SEARCH
                </span>
                <h3 className="font-bold text-slate-950 text-sm group-hover:text-[#0066FF] transition-colors">Enterprise RAG &amp; Hybrid Vectors</h3>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Hybrid dense/sparse indexing in Qdrant &amp; OpenSearch with BGE cross-encoder rerankers.
                </p>
              </div>
              <div className="font-mono text-[11px] text-[#0066FF] font-bold border-t border-slate-100 pt-3">
                Qdrant &bull; BGE Reranker
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-3xl bg-white border-2 border-slate-300 hover:border-purple-500 shadow-md hover:shadow-xl flex flex-col justify-between space-y-4 transition-all group">
              <div className="space-y-2">
                <span className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800 font-mono text-[10px] font-bold uppercase">
                  PILLAR 03 &bull; PROTOCOLS
                </span>
                <h3 className="font-bold text-slate-950 text-sm group-hover:text-purple-600 transition-colors">MCP &amp; Tool Integration</h3>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Model Context Protocol tools, OpenAPI schemas, PostgreSQL tool calling &amp; secure sandboxes.
                </p>
              </div>
              <div className="font-mono text-[11px] text-purple-700 font-bold border-t border-slate-100 pt-3">
                MCP &bull; FastAPI &bull; Docker
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 rounded-3xl bg-white border-2 border-slate-300 hover:border-amber-500 shadow-md hover:shadow-xl flex flex-col justify-between space-y-4 transition-all group">
              <div className="space-y-2">
                <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 font-mono text-[10px] font-bold uppercase">
                  PILLAR 04 &bull; EVALS
                </span>
                <h3 className="font-bold text-slate-950 text-sm group-hover:text-amber-600 transition-colors">RAGAS &amp; SLA Benchmarks</h3>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Automated metric evaluation, LLM-as-a-Judge validation harnesses &amp; regression testing.
                </p>
              </div>
              <div className="font-mono text-[11px] text-amber-700 font-bold border-t border-slate-100 pt-3">
                RAGAS &bull; Pytest AI
              </div>
            </div>

            {/* Pillar 5 */}
            <div className="p-6 rounded-3xl bg-white border-2 border-slate-300 hover:border-emerald-500 shadow-md hover:shadow-xl flex flex-col justify-between space-y-4 transition-all group">
              <div className="space-y-2">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold uppercase">
                  PILLAR 05 &bull; INFRA
                </span>
                <h3 className="font-bold text-slate-950 text-sm group-hover:text-emerald-600 transition-colors">Production Deployment</h3>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Streaming responses, token caching, latency optimization &amp; zero-downtime serverless infra.
                </p>
              </div>
              <div className="font-mono text-[11px] text-emerald-700 font-bold border-t border-slate-100 pt-3">
                Vercel &bull; Docker &bull; Redis
              </div>
            </div>

          </div>

          {/* Highlights Info Banner */}
          <div className="p-5 rounded-2xl bg-white border-2 border-slate-300 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs shrink-0">
                Live Hands-On Coding
              </span>
              <span className="text-slate-700 font-medium">Build end-to-end production AI applications from scratch with step-by-step guidance.</span>
            </div>

            <div className="px-4 py-2 rounded-full bg-blue-50 text-[#0066FF] border border-blue-200 font-bold text-xs shrink-0">
              Cryptographic QR Verified Certificates Included
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION 4: 100% FULL-WIDTH MEETUPS, BUILD NIGHTS & WORKSHOPS GRID ── */}
      <section className="py-16 px-4 sm:px-8 lg:px-12 bg-white text-slate-900">
        <div className="w-full space-y-8">
          
          <div>
            <div className="text-xs font-mono text-[#0066FF] font-bold uppercase tracking-wider mb-1">
              MORE FROM THE BOTMARTZ COMMUNITY
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 font-sans tracking-tight">
              Meetups, Build Nights &amp; What&apos;s Next
            </h2>
          </div>

          {/* 3 Workshop Series Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Workshop Card 1 */}
            <div className="p-8 rounded-3xl bg-white border-2 border-slate-300 hover:border-[#0066FF] shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-6 group">
              <div className="space-y-4">
                <div className="flex items-center justify-between font-mono text-xs font-bold">
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-[#0066FF] border border-blue-200">WORKSHOP</span>
                  <span className="text-emerald-600 font-bold uppercase flex items-center gap-1">
                    <CheckCircle2 size={13} /> Completed
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 font-sans group-hover:text-[#0066FF] transition-colors leading-snug">
                  AI Accelerator Workshop Series 1: Build Your First AI Full-Stack App
                </h3>

                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  A hands-on workshop to build an end-to-end full stack AI application with Next.js and LLMs.
                </p>

                <div className="font-mono text-xs text-slate-500 pt-2 space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar size={13} className="text-[#0066FF]" />
                    <span>August 9, 2026</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-[#0066FF]" />
                    <span>Indore, India</span>
                  </div>
                </div>
              </div>

              <button
                disabled
                className="w-full py-3.5 rounded-xl bg-slate-200 text-slate-500 font-mono text-xs font-bold uppercase tracking-wider text-center border border-slate-300 opacity-75 pointer-events-none flex items-center justify-center gap-2 cursor-not-allowed"
              >
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>Completed / Closed</span>
              </button>
            </div>

            {/* Workshop Card 2 */}
            <div className="p-8 rounded-3xl bg-white border-2 border-slate-300 hover:border-[#0066FF] shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-6 group">
              <div className="space-y-4">
                <div className="flex items-center justify-between font-mono text-xs font-bold">
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-[#0066FF] border border-blue-200">WORKSHOP</span>
                  <span className="text-emerald-600 font-bold uppercase flex items-center gap-1">
                    <CheckCircle2 size={13} /> Completed
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 font-sans group-hover:text-[#0066FF] transition-colors leading-snug">
                  AI Accelerator Workshop Series 2: Build Smarter AI Agents
                </h3>

                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  Learn how modern AI Agents think, plan and act. Dive deep into LangGraph, Tool Calling, and MCP.
                </p>

                <div className="font-mono text-xs text-slate-500 pt-2 space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar size={13} className="text-[#0066FF]" />
                    <span>August 16, 2026</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-[#0066FF]" />
                    <span>Indore, India</span>
                  </div>
                </div>
              </div>

              <button
                disabled
                className="w-full py-3.5 rounded-xl bg-slate-200 text-slate-500 font-mono text-xs font-bold uppercase tracking-wider text-center border border-slate-300 opacity-75 pointer-events-none flex items-center justify-center gap-2 cursor-not-allowed"
              >
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>Completed / Closed</span>
              </button>
            </div>

            {/* Workshop Card 3 */}
            <div className="p-8 rounded-3xl bg-white border-2 border-slate-300 hover:border-[#0066FF] shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-6 group">
              <div className="space-y-4">
                <div className="flex items-center justify-between font-mono text-xs font-bold">
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-[#0066FF] border border-blue-200">WORKSHOP</span>
                  <span className="text-emerald-600 font-bold uppercase flex items-center gap-1">
                    <CheckCircle2 size={13} /> Completed
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 font-sans group-hover:text-[#0066FF] transition-colors leading-snug">
                  AI Accelerator Workshop Series 3: Build Production Ready AI Applications
                </h3>

                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  Scale and deploy robust systems to the real world. Learn Inference, Optimization, and AI Infrastructure.
                </p>

                <div className="font-mono text-xs text-slate-500 pt-2 space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar size={13} className="text-[#0066FF]" />
                    <span>August 22, 2026</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-[#0066FF]" />
                    <span>Indore, India</span>
                  </div>
                </div>
              </div>

              <button
                disabled
                className="w-full py-3.5 rounded-xl bg-slate-200 text-slate-500 font-mono text-xs font-bold uppercase tracking-wider text-center border border-slate-300 opacity-75 pointer-events-none flex items-center justify-center gap-2 cursor-not-allowed"
              >
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>Completed / Closed</span>
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ── SECTION 5: 100% FULL-WIDTH COMMUNITY ECOSYSTEM BANNER & NEWSLETTER ── */}
      <section className="py-16 px-4 sm:px-8 lg:px-12 bg-[#040914] text-white">
        <div className="w-full">
          
          <div className="p-8 sm:p-12 lg:p-14 rounded-3xl bg-gradient-to-r from-[#091124] via-[#0D1B3A] to-[#060D1E] border border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-2xl relative overflow-hidden">
            
            {/* Left Ecosystem Details */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0066FF]/20 text-[#00B8F0] font-mono text-xs font-bold uppercase border border-[#0066FF]/40">
                <span>THIS IS JUST THE BEGINNING</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-white font-sans leading-tight">
                AI Frontier Is Day One of the <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Botmartz AI Community</span>
              </h2>

              <p className="text-slate-300 text-xs sm:text-sm font-sans leading-relaxed">
                Every event feeds a bigger ecosystem &mdash; monthly meetups, an active Discord, an open-source GitHub org, a reading club, and hackathons, all year round.
              </p>

              {/* Ecosystem Badges & Social Links */}
              <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
                <span className="px-4 py-2 rounded-full bg-slate-800/80 border border-white/10 text-slate-200">Monthly Meetups</span>
                <a 
                  href="https://discord.gg/k75ZpEnzp" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full bg-[#0066FF] text-white hover:bg-blue-600 transition-all flex items-center gap-1.5 font-bold shadow-md shadow-blue-500/20"
                >
                  <MessageSquare size={14} />
                  <span>Join Event Discord Stage &rarr;</span>
                </a>
                <a href="https://www.linkedin.com/company/botmartz-ai-solutions" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-full bg-slate-800/80 hover:bg-blue-600 hover:text-white border border-white/10 text-slate-200 transition-colors">LinkedIn Company</a>
                <a href="https://www.linkedin.com/in/soham-sharma/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-full bg-slate-800/80 hover:bg-blue-600 hover:text-white border border-white/10 text-slate-200 transition-colors">Founder LinkedIn</a>
                <a href="https://x.com/botmartz" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-white/10 text-slate-200 transition-colors">Official X</a>
              </div>

            </div>

            {/* Right Newsletter Subscription Card */}
            <div className="lg:col-span-5 p-7 rounded-2xl bg-slate-900/90 border border-white/10 space-y-4 backdrop-blur-md">
              
              <h3 className="text-lg font-bold text-white font-sans">Never miss an event or hackathon</h3>

              {newsletterSubmitted ? (
                <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center gap-2">
                  <CheckCircle2 size={18} />
                  <span>Subscribed! We will notify you about upcoming events &amp; summits.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white font-mono text-xs placeholder-slate-500 focus:outline-none focus:border-[#0066FF]"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-mono text-xs font-bold uppercase transition-all shrink-0 cursor-pointer shadow-md shadow-blue-500/20"
                  >
                    Notify Me
                  </button>
                </form>
              )}

              <p className="text-[11px] font-mono text-slate-400">
                Get notified first about new meetups, hackathons, speaker callouts and annual conferences.
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* ── REGISTRATION WIZARD MODAL ── */}
      {selectedEventForWizard && (
        <EventRegistrationWizard
          eventTitle={selectedEventForWizard.title}
          eventSlug={selectedEventForWizard.slug}
          eventDate={selectedEventForWizard.date}
          eventLocation={selectedEventForWizard.location}
          onClose={() => setSelectedEventForWizard(null)}
        />
      )}



    </main>
  );
}

