"use client";

import React, { useState, useEffect } from "react";
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
  Award
} from "lucide-react";
import EventRegistrationWizard from "./[slug]/EventRegistrationWizard";

export default function PublicEventsPage() {
  const [activeFilter, setActiveFilter] = useState<"all" | "workshops">("all");
  const [sortOption, setSortOption] = useState("upcoming");
  const [selectedEventForWizard, setSelectedEventForWizard] = useState<any | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

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
    <main className="min-h-screen bg-[#040914] text-white pt-20 pb-20 font-sans selection:bg-[#0066FF] selection:text-white">
      
      {/* ── SECTION 1: HERO SECTION ── */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 overflow-hidden">
        
        {/* Background Grid Lines & Glow */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-tr from-[#0066FF]/20 via-[#00B8F0]/10 to-transparent blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>&rsaquo;</span>
            <Link href="/community" className="hover:text-white transition-colors">Community</Link>
            <span>&rsaquo;</span>
            <span className="text-[#00B8F0] font-bold">Events</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0066FF]/10 border border-[#0066FF]/30 text-[#00B8F0] font-mono text-xs font-bold tracking-wider uppercase">
                <span>BOTMARTZ COMMUNITY EVENTS</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
                Where the AI <br />
                Engineering <span className="text-[#00B8F0]">Community</span> Meets
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans max-w-xl">
                Conferences, monthly meetups, open-source nights and hackathons &mdash; built for engineers who want to build, ship and grow together, not just watch from the sidelines.
              </p>

              <div>
                <button
                  onClick={handleScrollToEvents}
                  className="px-7 py-4 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2 cursor-pointer group"
                >
                  <span>See What's Coming Up</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right 2x2 Stat Cards Grid */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              
              <div className="p-6 rounded-2xl bg-[#0A1224] border border-white/10 hover:border-[#0066FF]/50 transition-all space-y-1">
                <div className="text-3xl font-extrabold text-[#00B8F0] font-sans">6+</div>
                <div className="text-xs font-mono text-slate-400">Events per Year</div>
              </div>

              <div className="p-6 rounded-2xl bg-[#0A1224] border border-white/10 hover:border-[#0066FF]/50 transition-all space-y-1">
                <div className="text-3xl font-extrabold text-white font-sans">1</div>
                <div className="text-xs font-mono text-slate-400">Flagship Conference</div>
              </div>

              <div className="p-6 rounded-2xl bg-[#0A1224] border border-white/10 hover:border-[#0066FF]/50 transition-all space-y-1">
                <div className="text-3xl font-extrabold text-[#00B8F0] font-sans">100+</div>
                <div className="text-xs font-mono text-slate-400">Community Members</div>
              </div>

              <div className="p-6 rounded-2xl bg-[#0A1224] border border-white/10 hover:border-[#0066FF]/50 transition-all space-y-1">
                <div className="text-3xl font-extrabold text-[#00B8F0] font-sans">2026</div>
                <div className="text-xs font-mono text-slate-400">Community Launch</div>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ── SECTION 2: FILTER & FEATURED FLAGSHIP EVENT ── */}
      <section id="events-section" className="py-16 px-4 sm:px-6 lg:px-8 bg-white text-slate-900">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Filter Tabs & Sort Dropdown */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-5 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                  activeFilter === "all"
                    ? "bg-[#0066FF] text-white shadow-md shadow-blue-500/20"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                All Events
              </button>

              <button
                onClick={() => setActiveFilter("workshops")}
                className={`px-5 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                  activeFilter === "workshops"
                    ? "bg-[#0066FF] text-white shadow-md shadow-blue-500/20"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                Workshops
              </button>
            </div>

            <div className="flex items-center gap-2 text-slate-500">
              <span>Sort by:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-white border border-slate-200 text-slate-800 font-bold px-3 py-1.5 rounded-lg focus:outline-none cursor-pointer"
              >
                <option value="upcoming">Upcoming</option>
                <option value="recent">Recent</option>
              </select>
            </div>
          </div>

          {/* Featured Card (AI Frontier 2026 Summit) */}
          <div className="p-8 sm:p-12 rounded-3xl bg-[#060D1E] text-white border border-blue-900/60 shadow-2xl relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Ambient Graphic Accent */}
            <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none hidden lg:block">
              <svg width="240" height="240" viewBox="0 0 240 240" fill="none">
                <circle cx="120" cy="120" r="100" stroke="#00B8F0" strokeWidth="2" strokeDasharray="6 6" />
                <circle cx="120" cy="40" r="10" fill="#00B8F0" />
                <circle cx="40" cy="120" r="8" fill="#0066FF" />
                <circle cx="200" cy="120" r="8" fill="#0066FF" />
                <circle cx="80" cy="190" r="6" fill="#00B8F0" />
                <circle cx="160" cy="190" r="6" fill="#00B8F0" />
                <line x1="120" y1="40" x2="40" y2="120" stroke="#00B8F0" strokeWidth="1.5" />
                <line x1="120" y1="40" x2="200" y2="120" stroke="#00B8F0" strokeWidth="1.5" />
                <line x1="120" y1="40" x2="80" y2="190" stroke="#00B8F0" strokeWidth="1.5" />
                <line x1="120" y1="40" x2="160" y2="190" stroke="#00B8F0" strokeWidth="1.5" />
              </svg>
            </div>

            <div className="lg:col-span-9 space-y-6 relative z-10">
              
              <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] font-bold">
                <span className="px-3 py-1 rounded-md bg-[#00B8F0]/20 text-[#00B8F0] border border-[#00B8F0]/40 uppercase">
                  FLAGSHIP CONFERENCE
                </span>
                <span className="px-3 py-1 rounded-md bg-[#0066FF]/20 text-blue-300 border border-[#0066FF]/40 uppercase">
                  COMPLETED
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-sans tracking-tight">
                AI Frontier 2026 &mdash; The Future of AI Engineering
              </h2>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl font-sans">
                Agents &bull; Enterprise AI &bull; AI-Assisted Development &bull; Responsible AI. A full day of sessions, a fireside Q&amp;A and a closing panel on building an AI engineering career &mdash; plus the launch of the Botmartz AI Engineering Community.
              </p>

              {/* Date & Location Badges */}
              <div className="flex flex-wrap items-center gap-6 font-mono text-xs pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#0066FF]/30 border border-[#0066FF] text-[#00B8F0] font-bold font-sans text-base flex items-center justify-center">
                    23
                  </div>
                  <div>
                    <div className="font-bold text-white">Sunday, Aug 23, 2026</div>
                    <div className="text-slate-400 text-[11px]">10:00 AM &ndash; 5:00 PM</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-l border-white/10 pl-6">
                  <div className="w-11 h-11 rounded-xl bg-slate-800 text-[#00B8F0] flex items-center justify-center border border-white/10">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-white">Venue Partner &bull; Indore, India</div>
                    <div className="text-[#00B8F0] text-[11px] font-bold">Walkover Campus</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4 font-mono text-xs">
                <button
                  onClick={() =>
                    setSelectedEventForWizard({
                      title: "AI Frontier 2026 — The Future of AI Engineering",
                      slug: "ai-frontier-2026",
                      date: "Sunday, Aug 23, 2026",
                      location: "Indore, India",
                    })
                  }
                  className="px-6 py-3.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <span>Register Your Interest &rarr;</span>
                </button>

                <Link
                  href="/community/events/ai-frontier-2026"
                  className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all border border-white/20"
                >
                  View Event Page
                </Link>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ── SECTION 3: THE GOLDEN THREAD RUN OF SHOW (AGENDA) ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 text-slate-900 border-t border-slate-200">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-[11px] font-mono text-[#0066FF] font-bold uppercase tracking-wider mb-1">
                AI FRONTIER 2026 FLOW
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-sans">
                The Golden Thread Run of Show
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-sans mt-1 max-w-2xl">
                Every session answers one step along the production AI journey. Four pillars (&lsquo;Agents&rsquo;, &lsquo;Enterprise AI&rsquo;, &lsquo;AI-Assisted Dev&rsquo;, &lsquo;Responsible AI&rsquo;), one unified lifecycle.
              </p>
            </div>

            <Link
              href="/community/events/ai-frontier-2026"
              className="text-xs font-mono font-bold text-[#0066FF] hover:underline flex items-center gap-1 shrink-0"
            >
              <span>Explore Full Agenda &amp; Speakers &rarr;</span>
            </Link>
          </div>

          {/* Agenda Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 font-sans text-xs">
            
            {/* Item 1 */}
            <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-mono text-[10px] font-bold">
                  09:45 AM &bull; 15 mins
                </span>
                <h3 className="font-bold text-slate-900 text-sm">Anchoring &amp; Kickoff</h3>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Setting the stage, energy, and crowd coordination for the entire event.
                </p>
              </div>
              <div className="font-mono text-[11px] text-rose-700 font-bold border-t border-rose-200 pt-2">
                Vaidehi &amp; Yash
              </div>
            </div>

            {/* Item 2 */}
            <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10px] font-bold">
                  10:15 AM &bull; 15 mins
                </span>
                <h3 className="font-bold text-slate-900 text-sm">Welcome: Set the Frame</h3>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Why does AI engineering matter? Framing the journey from raw LLM calls to production systems.
                </p>
              </div>
              <div className="font-mono text-[11px] text-[#0066FF] font-bold border-t border-blue-200 pt-2">
                Soham Sharma
              </div>
            </div>

            {/* Item 3 */}
            <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-200 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-mono text-[10px] font-bold">
                  10:30 AM &bull; 75 mins
                </span>
                <h3 className="font-bold text-slate-900 text-sm">Keynote &amp; Flagship Deep Dive</h3>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Where is AI heading? Rigorous look at foundation models, reasoning architectures, coding agents &amp; evals.
                </p>
              </div>
              <div className="font-mono text-[11px] text-purple-700 font-bold border-t border-purple-200 pt-2">
                Dr. Promit Ray
              </div>
            </div>

            {/* Item 4 */}
            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono text-[10px] font-bold">
                  12:00 PM &bull; 60 mins
                </span>
                <h3 className="font-bold text-slate-900 text-sm">Workshop Part 1</h3>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Build Your First AI Agent: EdTech RAG Case Study. Hand-on orchestrating pipelines.
                </p>
              </div>
              <div className="font-mono text-[11px] text-amber-700 font-bold border-t border-amber-200 pt-2">
                Harsh Sahu
              </div>
            </div>

            {/* Item 5 */}
            <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-mono text-[10px] font-bold">
                  02:00 PM &bull; 60 mins
                </span>
                <h3 className="font-bold text-slate-900 text-sm">Workshop Part 2</h3>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Evaluation, memory &amp; deployment. Rig up testing harnesses for our tutor agent.
                </p>
              </div>
              <div className="font-mono text-[11px] text-slate-700 font-bold border-t border-slate-200 pt-2">
                Harsh Sahu
              </div>
            </div>

          </div>

          {/* Footer Schedule Bar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                03:00 PM &bull; AI Engineering Journey
              </span>
              <span className="text-slate-600">Roadmap to production mindset &amp; community launch (Soham Sharma)</span>
            </div>

            <div className="px-3.5 py-1.5 rounded-full bg-blue-50 text-[#0066FF] border border-blue-200 font-bold text-[11px]">
              Open AMA &amp; Networking: 03:25 &ndash; 04:00 PM
            </div>
          </div>

        </div>
      </section>


      {/* ── SECTION 4: MEETUPS, BUILD NIGHTS & WHAT'S NEXT ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white text-slate-900">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div>
            <div className="text-[11px] font-mono text-[#0066FF] font-bold uppercase tracking-wider mb-1">
              MORE FROM THE COMMUNITY
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-sans">
              Meetups, Build Nights &amp; What&apos;s Next
            </h2>
          </div>

          {/* 3 Workshop Series Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Workshop Card 1 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-[#0066FF] transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between font-mono text-[10px] font-bold">
                  <span className="px-2.5 py-0.5 rounded bg-blue-100 text-[#0066FF]">CONFERENCE</span>
                  <span className="text-emerald-600 font-bold uppercase">completed</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 font-sans leading-snug">
                  AI Accelerator Workshop Series 1: Build Your First AI Full-Stack App
                </h3>

                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  A hands-on workshop to build an end-to-end full stack AI application with Next.js and LLMs.
                </p>

                <div className="font-mono text-xs text-slate-500 pt-2 space-y-1">
                  <div>August 9, 2026</div>
                  <div>Indore, India</div>
                </div>
              </div>

              <button
                onClick={() =>
                  setSelectedEventForWizard({
                    title: "AI Accelerator Workshop Series 1: Build Your First AI Full-Stack App",
                    slug: "ai-accelerator-workshop-series-1",
                    date: "August 9, 2026",
                    location: "Indore, India",
                  })
                }
                className="w-full py-3 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-mono text-xs font-bold uppercase tracking-wider text-center transition-all shadow-xs cursor-pointer"
              >
                Register / View Details
              </button>
            </div>

            {/* Workshop Card 2 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-[#0066FF] transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between font-mono text-[10px] font-bold">
                  <span className="px-2.5 py-0.5 rounded bg-blue-100 text-[#0066FF]">CONFERENCE</span>
                  <span className="text-emerald-600 font-bold uppercase">Upcoming</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 font-sans leading-snug">
                  AI Accelerator Workshop Series 2: Build Smarter AI Agents
                </h3>

                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  Learn how modern AI Agents think, plan and act. Dive deep into LangGraph, Tool Calling, and MCP.
                </p>

                <div className="font-mono text-xs text-slate-500 pt-2 space-y-1">
                  <div>August 16, 2026</div>
                  <div>Indore, India</div>
                </div>
              </div>

              <button
                onClick={() =>
                  setSelectedEventForWizard({
                    title: "AI Accelerator Workshop Series 2: Build Smarter AI Agents",
                    slug: "ai-accelerator-workshop-series-2",
                    date: "August 16, 2026",
                    location: "Indore, India",
                  })
                }
                className="w-full py-3 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-mono text-xs font-bold uppercase tracking-wider text-center transition-all shadow-xs cursor-pointer"
              >
                Register / View Details
              </button>
            </div>

            {/* Workshop Card 3 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-[#0066FF] transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between font-mono text-[10px] font-bold">
                  <span className="px-2.5 py-0.5 rounded bg-blue-100 text-[#0066FF]">CONFERENCE</span>
                  <span className="text-emerald-600 font-bold uppercase">upcoming</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 font-sans leading-snug">
                  AI Accelerator Workshop Series 3: Build Production Ready AI Applications
                </h3>

                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  Scale and deploy robust systems to the real world. Learn Inference, Optimization, and AI Infrastructure.
                </p>

                <div className="font-mono text-xs text-slate-500 pt-2 space-y-1">
                  <div>August 22, 2026</div>
                  <div>Indore, India</div>
                </div>
              </div>

              <button
                onClick={() =>
                  setSelectedEventForWizard({
                    title: "AI Accelerator Workshop Series 3: Build Production Ready AI Applications",
                    slug: "ai-accelerator-workshop-series-3",
                    date: "August 22, 2026",
                    location: "Indore, India",
                  })
                }
                className="w-full py-3 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-mono text-xs font-bold uppercase tracking-wider text-center transition-all shadow-xs cursor-pointer"
              >
                Register / View Details
              </button>
            </div>

          </div>

        </div>
      </section>


      {/* ── SECTION 5: COMMUNITY LAUNCH BANNER & NEWSLETTER ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#040914] text-white">
        <div className="max-w-7xl mx-auto">
          
          <div className="p-8 sm:p-12 rounded-3xl bg-[#091124] border border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-2xl">
            
            {/* Left Ecosystem Details */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0066FF]/20 text-[#00B8F0] font-mono text-[11px] font-bold uppercase">
                THIS IS JUST THE BEGINNING
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-sans leading-tight">
                AI Frontier Is Day One of the Botmartz AI Engineering Community
              </h2>

              <p className="text-slate-300 text-xs sm:text-sm font-sans leading-relaxed">
                Every event feeds a bigger ecosystem &mdash; monthly meetups, a Discord, an open-source GitHub org, a reading club, and hackathons, all year round.
              </p>

              {/* Ecosystem Badges & Discord Invite */}
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                <span className="px-4 py-2 rounded-full bg-slate-800/80 border border-white/10 text-slate-200">Meetups</span>
                <a 
                  href="https://discord.gg/k75ZpEnzp" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full bg-[#0066FF]/20 border border-[#0066FF]/40 text-[#00B8F0] hover:bg-[#0066FF] hover:text-white transition-all flex items-center gap-1.5 font-bold"
                >
                  <MessageSquare size={13} />
                  <span>Event Discord Stage &rarr;</span>
                </a>
                <a href="https://www.linkedin.com/company/botmartz-ai-solutions" target="_blank" rel="noopener noreferrer" className="px-3.5 py-1.5 rounded-full bg-slate-800/80 hover:bg-blue-600 hover:text-white border border-white/10 text-slate-200 transition-colors">LinkedIn Page</a>
                <a href="https://www.linkedin.com/in/soham-sharma/" target="_blank" rel="noopener noreferrer" className="px-3.5 py-1.5 rounded-full bg-slate-800/80 hover:bg-blue-600 hover:text-white border border-white/10 text-slate-200 transition-colors">Founder LinkedIn</a>
                <a href="https://x.com/botmartz" target="_blank" rel="noopener noreferrer" className="px-3.5 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-white/10 text-slate-200 transition-colors">Official X</a>
              </div>

            </div>

            {/* Right Newsletter Subscription Card */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-white/10 space-y-4">
              
              <h3 className="text-base font-bold text-white font-sans">Never miss an event</h3>

              {newsletterSubmitted ? (
                <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>Subscribed! We will notify you about upcoming events.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white font-mono text-xs placeholder-slate-500 focus:outline-none focus:border-[#0066FF]"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-mono text-xs font-bold uppercase transition-all shrink-0 cursor-pointer"
                  >
                    Notify Me
                  </button>
                </form>
              )}

              <p className="text-[11px] font-mono text-slate-400">
                Get notified about new meetups, hackathons and conferences.
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
