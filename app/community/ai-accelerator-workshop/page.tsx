"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  CheckCircle2,
  Calendar,
  Award,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Star,
  Users,
  Terminal,
  BookOpen,
  FolderArchive,
  Map,
  ChevronDown,
  Loader2,
  Linkedin,
  Twitter,
  Radio,
  Zap,
  Flame,
  FileCheck
} from "lucide-react";
import EventRegistrationWizard from "../events/[slug]/EventRegistrationWizard";

interface FeedbackItem {
  id: string;
  participantName?: string;
  participantEmail?: string;
  takeaways?: string;
  comments?: string;
  overallRating?: number;
  attendeeType?: string;
  isFeatured?: boolean;
}

export default function WorkshopLandingPage() {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(true);
  const [selectedWorkshopForWizard, setSelectedWorkshopForWizard] = useState<any | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const res = await fetch("/api/admin/feedback?eventId=ai-accelerator-workshop");
        const data = await res.json();
        if (data.success && Array.isArray(data.feedbacks) && data.feedbacks.length > 0) {
          const featuredOnly = data.feedbacks.filter((f: any) => f.isFeatured !== false);
          setFeedbacks(featuredOnly.length > 0 ? featuredOnly : data.feedbacks.slice(0, 4));
        } else {
          // Default testimonials from screenshot
          setFeedbacks([
            {
              id: "fb-1",
              participantEmail: "palashchamate433@gmail.com",
              takeaways: "I learned AI basics and built a small AI project. Gained practical hands-on experience.",
              overallRating: 5,
              attendeeType: "student",
            },
            {
              id: "fb-2",
              participantEmail: "saloniwasnik31@gmail.com",
              takeaways: "I learned AI basics and built a small AI project. Gained practical hands-on experience.",
              overallRating: 5,
              attendeeType: "student",
            },
            {
              id: "fb-3",
              participantEmail: "ritikmotwani18@gmail.com",
              takeaways: "Now i am able to develop the full stack application with ai agents now, incredibly worthful session",
              overallRating: 5,
              attendeeType: "student",
            },
            {
              id: "fb-4",
              participantEmail: "yasheegupta786@gmail.com",
              takeaways: "I learned how AI agents can be used to automate tasks and improve workflows. The session helped me understand practical use cases and how AI concepts can be applied to real-world projects.",
              overallRating: 5,
              attendeeType: "student",
            },
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch workshop feedback:", err);
      } finally {
        setLoadingFeedbacks(false);
      }
    }
    loadTestimonials();
  }, []);

  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-[#040914] text-white font-sans selection:bg-[#0066FF] selection:text-white pb-20">
      
      {/* ── SECTION 1: 100% FULL-WIDTH ULTRA-PREMIUM TECH HERO BANNER ── */}
      <section className="relative pt-24 pb-16 px-4 sm:px-8 lg:px-12 overflow-hidden">
        
        {/* Ambient Radial Glows */}
        <div className="absolute top-0 left-1/4 w-[900px] h-[450px] bg-gradient-to-tr from-[#0066FF]/25 via-[#00B8F0]/15 to-purple-600/10 blur-[170px] pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-[500px] h-[300px] bg-blue-600/10 blur-[130px] pointer-events-none" />

        <div className="w-full relative z-10">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>&rsaquo;</span>
            <Link href="/community" className="hover:text-white transition-colors">Community</Link>
            <span>&rsaquo;</span>
            <span className="text-[#00B8F0] font-bold">AI Accelerator Workshop</span>
          </nav>

          {/* 12-Column Split Hero Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-[#0A142B] to-[#040816] p-8 sm:p-12 lg:p-14 border-2 border-slate-800 shadow-2xl">
            
            {/* Background Mesh Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b20_1px,transparent_1px),linear-gradient(to_bottom,#1e293b20_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#0066FF]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              
              {/* Left Column: Title, Subtitle, CTAs & Stats */}
              <div className="lg:col-span-7 space-y-6">
                
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#0066FF]/25 to-[#00B8F0]/15 border border-[#0066FF]/50 text-[#00B8F0] font-mono text-xs font-bold tracking-wider uppercase backdrop-blur-md shadow-lg shadow-blue-500/15">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
                  </span>
                  <Radio size={14} className="text-[#00B8F0] animate-pulse" />
                  <span>BOTMARTZ AI SOLUTIONS PRESENTS &bull; LIVE BOOTCAMP COHORT</span>
                </div>

                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] font-sans">
                  AI ACCELERATOR <br />
                  <span className="bg-gradient-to-r from-[#00B8F0] via-cyan-300 to-blue-400 bg-clip-text text-transparent">WORKSHOP SERIES</span>
                </h1>

                <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed font-sans max-w-2xl">
                  The official runway to <span className="text-[#00B8F0] font-bold">AI Frontier 2026</span>. Build production-ready AI applications through three live, hands-on engineering bootcamps leading up to our free, in-person main summit.
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-4 pt-2 font-mono text-xs">
                  <button
                    onClick={() =>
                      setSelectedWorkshopForWizard({
                        title: "AI Accelerator Workshop Series Live Pass",
                        slug: "ai-accelerator-workshop",
                        date: "August 2026 Series",
                        location: "Online & Indore AI Lab",
                      })
                    }
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#0066FF] via-blue-600 to-[#0052CC] hover:from-blue-500 hover:to-[#0066FF] text-white font-bold uppercase tracking-wider transition-all shadow-xl shadow-blue-600/35 flex items-center gap-2.5 cursor-pointer group"
                  >
                    <Sparkles size={16} className="text-cyan-300 group-hover:rotate-12 transition-transform" />
                    <span>Register Live Pass &rarr;</span>
                  </button>

                  <button
                    onClick={() => handleScrollToSection("curriculum")}
                    className="px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold transition-all border border-white/20 backdrop-blur-md cursor-pointer shadow-md"
                  >
                    View Curriculum &amp; Core Topics
                  </button>
                </div>

                {/* Quick Stats Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 font-mono text-xs">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <div className="text-white font-bold text-sm font-sans flex items-center gap-1.5">
                      <Calendar size={14} className="text-blue-400" />
                      <span>3 Series</span>
                    </div>
                    <div className="text-slate-400 text-[10px]">Live Bootcamps</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <div className="text-white font-bold text-sm font-sans flex items-center gap-1.5">
                      <Star size={14} className="text-amber-400 fill-amber-400" />
                      <span>4.8 / 5.0</span>
                    </div>
                    <div className="text-slate-400 text-[10px]">48 Student Reviews</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <div className="text-white font-bold text-sm font-sans flex items-center gap-1.5">
                      <Award size={14} className="text-purple-400" />
                      <span>PDF Certs</span>
                    </div>
                    <div className="text-slate-400 text-[10px]">Verifiable Badge</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <div className="text-white font-bold text-sm font-sans flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-emerald-400" />
                      <span>100% Free</span>
                    </div>
                    <div className="text-slate-400 text-[10px]">Community Summit</div>
                  </div>
                </div>

              </div>

              {/* Right Column: Live Bootcamp Status Panel */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-6 sm:p-8 rounded-3xl bg-[#060E21]/90 border-2 border-blue-500/40 shadow-2xl backdrop-blur-xl space-y-4 relative overflow-hidden">
                  
                  <div className="flex items-center justify-between font-mono text-xs border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2">
                      <Terminal size={16} className="text-[#00B8F0]" />
                      <span className="font-bold text-white font-sans">AI BOOTCAMP COHORT MATRIX</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/40">
                      LIVE TRACK
                    </span>
                  </div>

                  {/* Bootcamp 01 Status Card */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all flex items-center justify-between gap-3 font-mono text-xs">
                    <div>
                      <div className="text-slate-400 text-[10px]">SERIES 01 &bull; AUG 9, 2026</div>
                      <div className="text-white font-bold font-sans">Full-Stack AI Application</div>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-[11px] border border-emerald-500/40 shrink-0">
                      Completed ✓
                    </span>
                  </div>

                  {/* Bootcamp 02 Status Card */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all flex items-center justify-between gap-3 font-mono text-xs">
                    <div>
                      <div className="text-slate-400 text-[10px]">SERIES 02 &bull; AUG 16, 2026</div>
                      <div className="text-white font-bold font-sans">Smarter AI Agents &amp; MCP</div>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-[11px] border border-emerald-500/40 shrink-0">
                      Completed ✓
                    </span>
                  </div>

                  {/* Bootcamp 03 Status Card */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all flex items-center justify-between gap-3 font-mono text-xs">
                    <div>
                      <div className="text-slate-400 text-[10px]">SERIES 03 &bull; AUG 22, 2026</div>
                      <div className="text-white font-bold font-sans">Production AI &amp; Guardrails</div>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-[11px] border border-emerald-500/40 shrink-0">
                      Completed ✓
                    </span>
                  </div>

                  {/* Flagship Summit Card */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/50 via-cyan-900/40 to-slate-900 border border-cyan-500/50 flex items-center justify-between gap-3 font-mono text-xs">
                    <div>
                      <div className="text-cyan-300 text-[10px] font-bold">FLAGSHIP SUMMIT &bull; AUG 23, 2026</div>
                      <div className="text-white font-bold font-sans">AI Frontier 2026 (Indore)</div>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-[#0066FF] text-white font-bold text-[11px] shadow-md shrink-0">
                      Main Summit ★
                    </span>
                  </div>

                </div>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ── SECTION 2: 100% FULL-WIDTH THE LEARNING JOURNEY ── */}
      <section className="py-20 px-4 sm:px-8 lg:px-12 bg-white text-slate-900 border-b-2 border-slate-200">
        <div className="w-full space-y-12">
          
          <div className="text-center space-y-3">
            <div className="text-xs font-mono text-[#0066FF] font-bold uppercase tracking-wider">
              ROADMAP TO PRODUCTION AI
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-950 font-sans tracking-tight">
              The Learning Journey
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-sans max-w-2xl mx-auto">
              Three live engineering bootcamps leading directly to our flagship AI Frontier summit.
            </p>
          </div>

          {/* 4-Column Horizontal Roadmap Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
            
            {/* Step 1 */}
            <div className="p-7 rounded-3xl bg-white border-2 border-slate-300 hover:border-[#0066FF] shadow-md hover:shadow-xl transition-all space-y-4 relative overflow-hidden flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-xs font-bold">
                  <span className="text-[#0066FF] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">SERIES 01</span>
                  <span className="text-slate-500 font-semibold">Aug 9, 2026</span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#0066FF] transition-colors leading-snug">
                  Build Your First AI Full-Stack App
                </h3>
                
                <p className="text-xs text-slate-600 leading-relaxed">
                  Build an end-to-end AI-powered application from scratch using Cursor IDE, Next.js, and LLM APIs.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between font-mono text-xs">
                <span className="w-8 h-8 rounded-full bg-blue-50 text-[#0066FF] border border-blue-200 font-bold flex items-center justify-center">
                  01
                </span>
                <span className="text-emerald-600 font-bold uppercase text-[11px] flex items-center gap-1">
                  <CheckCircle2 size={13} /> Completed
                </span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-7 rounded-3xl bg-white border-2 border-slate-300 hover:border-[#0066FF] shadow-md hover:shadow-xl transition-all space-y-4 relative overflow-hidden flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-xs font-bold">
                  <span className="text-[#0066FF] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">SERIES 02</span>
                  <span className="text-slate-500 font-semibold">Aug 16, 2026</span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#0066FF] transition-colors leading-snug">
                  Build Smarter AI Agents
                </h3>
                
                <p className="text-xs text-slate-600 leading-relaxed">
                  Learn how modern AI Agents think, plan and act with LangGraph, Tool Calling, and Model Context Protocol (MCP).
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between font-mono text-xs">
                <span className="w-8 h-8 rounded-full bg-blue-50 text-[#0066FF] border border-blue-200 font-bold flex items-center justify-center">
                  02
                </span>
                <span className="text-emerald-600 font-bold uppercase text-[11px] flex items-center gap-1">
                  <CheckCircle2 size={13} /> Completed
                </span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-7 rounded-3xl bg-white border-2 border-slate-300 hover:border-[#0066FF] shadow-md hover:shadow-xl transition-all space-y-4 relative overflow-hidden flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-xs font-bold">
                  <span className="text-[#0066FF] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">SERIES 03</span>
                  <span className="text-slate-500 font-semibold">Aug 22, 2026</span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#0066FF] transition-colors leading-snug">
                  Build Production Ready AI Apps
                </h3>
                
                <p className="text-xs text-slate-600 leading-relaxed">
                  Scale and deploy robust systems to the real world. Master Inference, Memory Optimization, and Security Guardrails.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between font-mono text-xs">
                <span className="w-8 h-8 rounded-full bg-blue-50 text-[#0066FF] border border-blue-200 font-bold flex items-center justify-center">
                  03
                </span>
                <span className="text-emerald-600 font-bold uppercase text-[11px] flex items-center gap-1">
                  <CheckCircle2 size={13} /> Completed
                </span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-7 rounded-3xl bg-gradient-to-br from-[#060D1E] to-[#0A1633] text-white border-2 border-blue-500/50 shadow-xl space-y-4 relative overflow-hidden flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-xs font-bold">
                  <span className="text-[#00B8F0] bg-[#00B8F0]/20 px-3 py-1 rounded-full border border-[#00B8F0]/40">FLAGSHIP SUMMIT</span>
                  <span className="text-cyan-300 font-semibold">Aug 23, 2026</span>
                </div>
                
                <h3 className="text-xl font-bold text-white group-hover:text-[#00B8F0] transition-colors leading-snug font-sans">
                  AI Frontier 2026 Summit
                </h3>
                
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Join the top AI Engineers in Indore for our premier flagship event, keynote deep-dives &amp; community launch.
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between font-mono text-xs">
                <span className="w-8 h-8 rounded-full bg-[#0066FF] text-white font-bold flex items-center justify-center shadow-md">
                  04
                </span>
                <span className="text-cyan-400 font-bold uppercase text-[11px] flex items-center gap-1">
                  <Sparkles size={13} /> Main Event
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ── SECTION 3: 100% FULL-WIDTH THE CURRICULUM (3 BOOTCAMP CARDS) ── */}
      <section id="curriculum" className="py-20 px-4 sm:px-8 lg:px-12 bg-slate-50 text-slate-900 border-b-2 border-slate-200">
        <div className="w-full space-y-12">
          
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-950 font-sans tracking-tight">
              The Curriculum
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-sans max-w-2xl mx-auto">
              A comprehensive, step-by-step engineering curriculum designed for real-world production application.
            </p>

            {/* Rating Bar Badge */}
            <div className="inline-flex flex-wrap items-center justify-center gap-4 p-3.5 px-7 rounded-full bg-white border-2 border-slate-300 text-xs font-mono shadow-md">
              <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" />
                ))}
                <span className="ml-1 text-slate-900 font-bold text-sm">4.8 / 5.0</span>
                <span className="text-slate-500 font-normal">(48 Student Reviews)</span>
              </div>
              <span className="text-slate-300">|</span>
              <div className="text-[#0066FF] font-bold">
                100% Recommend Rate
              </div>
              <span className="text-slate-300">|</span>
              <Link
                href="/community/ai-accelerator-workshop/feedback"
                className="px-4 py-1.5 rounded-full bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1 shadow-sm"
              >
                <MessageSquare size={13} />
                <span>Give Workshop Feedback &rarr;</span>
              </Link>
            </div>
          </div>

          {/* 3 Bootcamp Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Bootcamp 01 */}
            <div className="p-8 rounded-3xl bg-white border-2 border-slate-300 hover:border-[#0066FF] shadow-md hover:shadow-xl transition-all relative overflow-hidden flex flex-col justify-between space-y-6 group">
              
              {/* Tilted Session Completed Stamp Overlay */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 border-4 border-emerald-500 text-emerald-600 bg-emerald-50/95 rounded-2xl px-6 py-3 font-mono font-black text-center text-xs tracking-wider shadow-xl pointer-events-none z-20">
                <div className="flex items-center gap-1.5 text-sm">
                  <CheckCircle2 size={18} />
                  <span>SESSION COMPLETED</span>
                </div>
                <div className="text-[10px] uppercase text-emerald-700 font-bold">WORKSHOP ENDED</div>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between font-mono text-xs font-bold">
                  <span className="text-slate-400 uppercase">BOOTCAMP 01</span>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
                    <CheckCircle2 size={13} /> COMPLETED
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 font-sans group-hover:text-[#0066FF] transition-colors leading-snug">
                  Build Your First AI Full-Stack Application
                </h3>

                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  Build an AI-powered application from scratch using the latest AI tools and LLM frameworks.
                </p>

                <div className="space-y-2.5 pt-3 border-t border-slate-100">
                  <div className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">CORE TOPICS COVERED</div>
                  <ul className="space-y-2 font-mono text-xs text-slate-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>AI Development Environment Setup</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>ChatGPT, Claude, Gemini API Specs</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>Cursor IDE &amp; V0 Prototyping</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>LangChain &amp; LangGraph Core</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>AI Agent Architecture &amp; RAG Pipelines</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>Deploy Live AI Web Application</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-4 relative z-10">
                <div className="text-xs font-sans">
                  <span className="font-mono text-[10px] text-slate-400 uppercase font-bold block mb-1">KEY OUTCOME</span>
                  <strong className="text-slate-900">Students left with a fully deployed, working AI web application.</strong>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-center font-mono text-xs font-bold flex items-center justify-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>Session Completed</span>
                </div>
              </div>

            </div>

            {/* Bootcamp 02 */}
            <div className="p-8 rounded-3xl bg-white border-2 border-slate-300 hover:border-[#0066FF] shadow-md hover:shadow-xl transition-all relative overflow-hidden flex flex-col justify-between space-y-6 group">
              
              {/* Tilted Session Completed Stamp Overlay */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 border-4 border-emerald-500 text-emerald-600 bg-emerald-50/95 rounded-2xl px-6 py-3 font-mono font-black text-center text-xs tracking-wider shadow-xl pointer-events-none z-20">
                <div className="flex items-center gap-1.5 text-sm">
                  <CheckCircle2 size={18} />
                  <span>SESSION COMPLETED</span>
                </div>
                <div className="text-[10px] uppercase text-emerald-700 font-bold">WORKSHOP ENDED</div>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between font-mono text-xs font-bold">
                  <span className="text-slate-400 uppercase">BOOTCAMP 02</span>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
                    <CheckCircle2 size={13} /> COMPLETED
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 font-sans group-hover:text-[#0066FF] transition-colors leading-snug">
                  Build Smarter AI Agents
                </h3>

                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  Learn how modern AI Agents think, plan and execute multi-step workflows.
                </p>

                <div className="space-y-2.5 pt-3 border-t border-slate-100">
                  <div className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">CORE TOPICS COVERED</div>
                  <ul className="space-y-2 font-mono text-xs text-slate-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>Single Agent &amp; Multi-Agent Swarms</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>Memory &amp; Context Vector Management</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>Tool Calling &amp; Schema Execution</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>MCP (Model Context Protocol)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>Google Search &amp; Custom API Integration</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>LangGraph State Graph Persistence</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-4 relative z-10">
                <div className="text-xs font-sans">
                  <span className="font-mono text-[10px] text-slate-400 uppercase font-bold block mb-1">KEY OUTCOME</span>
                  <strong className="text-slate-900">Students built autonomous, tool-calling AI Agents.</strong>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-center font-mono text-xs font-bold flex items-center justify-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>Session Completed</span>
                </div>
              </div>

            </div>

            {/* Bootcamp 03 */}
            <div className="p-8 rounded-3xl bg-white border-2 border-slate-300 hover:border-[#0066FF] shadow-md hover:shadow-xl transition-all relative overflow-hidden flex flex-col justify-between space-y-6 group">
              
              {/* Tilted Session Completed Stamp Overlay */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 border-4 border-emerald-500 text-emerald-600 bg-emerald-50/95 rounded-2xl px-6 py-3 font-mono font-black text-center text-xs tracking-wider shadow-xl pointer-events-none z-20">
                <div className="flex items-center gap-1.5 text-sm">
                  <CheckCircle2 size={18} />
                  <span>SESSION COMPLETED</span>
                </div>
                <div className="text-[10px] uppercase text-emerald-700 font-bold">WORKSHOP ENDED</div>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between font-mono text-xs font-bold">
                  <span className="text-slate-400 uppercase">BOOTCAMP 03</span>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
                    <CheckCircle2 size={13} /> COMPLETED
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 font-sans group-hover:text-[#0066FF] transition-colors leading-snug">
                  Build Production Ready AI Applications
                </h3>

                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  Scale and deploy robust, production-grade AI systems to real-world infrastructure.
                </p>

                <div className="space-y-2.5 pt-3 border-t border-slate-100">
                  <div className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">CORE TOPICS COVERED</div>
                  <ul className="space-y-2 font-mono text-xs text-slate-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>Transformer &amp; Mamba Architecture</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>Modern Foundation LLMs Overview</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>Inference, Quantization &amp; Latency Optimization</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>Tunneling &amp; Local Server Deployment</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>Security, Guardrails &amp; Evaluation</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-4 relative z-10">
                <div className="text-xs font-sans">
                  <span className="font-mono text-[10px] text-slate-400 uppercase font-bold block mb-1">KEY OUTCOME</span>
                  <strong className="text-slate-900">Engineered production-grade AI systems with local/nginx tunneling &amp; guardrails.</strong>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-center font-mono text-xs font-bold flex items-center justify-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>Session Completed</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ── SECTION 4: 100% FULL-WIDTH VERIFIED PARTICIPANT FEEDBACK ── */}
      <section className="py-20 px-4 sm:px-8 lg:px-12 bg-white text-slate-900 border-b-2 border-slate-200">
        <div className="w-full space-y-12">
          
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#0066FF] font-mono text-xs font-bold uppercase">
              VERIFIED PARTICIPANT FEEDBACK
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-950 font-sans tracking-tight">
              What Engineers Say About Our Bootcamps
            </h2>
          </div>

          {/* Feedback Cards Grid (3 Reviews Per Row) */}
          {loadingFeedbacks ? (
            <div className="py-12 text-center text-slate-400 font-mono text-xs flex items-center justify-center gap-2">
              <Loader2 size={16} className="animate-spin text-[#0066FF]" />
              <span>Loading verified reviews...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 font-sans">
              {feedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="p-7 rounded-3xl bg-white border-2 border-slate-300 hover:border-[#0066FF] shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(fb.overallRating || 5)].map((_, i) => (
                        <Star key={i} size={16} fill="currentColor" />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 italic font-sans leading-relaxed">
                      &ldquo;{fb.takeaways || fb.comments || "Great workshop!"}&rdquo;
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 font-mono text-xs flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 font-sans truncate max-w-[160px] text-sm">
                        {fb.participantName || fb.participantEmail?.split("@")[0] || "Verified Builder"}
                      </div>
                      <div className="text-slate-500 text-[10px] uppercase font-semibold">
                        {fb.attendeeType || "student"}
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-blue-50 text-[#0066FF] text-[10px] font-bold border border-blue-200">
                      AI Accelerator
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bottom Dark CTA Banner */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#060D1E] via-[#0A1633] to-[#040914] text-white border-2 border-blue-500/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-1.5 text-center sm:text-left">
              <h3 className="text-2xl font-bold font-sans text-white">Attended a Live Workshop Session?</h3>
              <p className="text-xs sm:text-sm font-mono text-slate-300">
                Submit your 2-3 line feedback and help us elevate the next AI summit edition.
              </p>
            </div>

            <Link
              href="/community/ai-accelerator-workshop/feedback"
              className="px-8 py-4 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-blue-500/30 shrink-0"
            >
              Submit Your Feedback &rarr;
            </Link>
          </div>

        </div>
      </section>


      {/* ── SECTION 5: 100% FULL-WIDTH EVERY REGISTRATION INCLUDES ── */}
      <section className="py-20 px-4 sm:px-8 lg:px-12 bg-[#040914] text-white">
        <div className="w-full space-y-12">
          
          <div className="text-center space-y-3">
            <div className="text-xs font-mono text-[#00B8F0] font-bold uppercase tracking-wider">
              EXCLUSIVE DEVELOPER PERKS
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-sans tracking-tight">
              Every Registration Includes
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-sans max-w-2xl mx-auto">
              We provide everything you need to start building and shipping production AI immediately.
            </p>
          </div>

          {/* 5 Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            
            {/* Feature 1 */}
            <div className="p-7 rounded-3xl bg-[#091124] border border-white/10 space-y-4 hover:border-[#0066FF]/60 transition-all shadow-xl group">
              <div className="w-12 h-12 rounded-2xl bg-blue-950/80 border border-blue-500/30 text-[#00B8F0] flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen size={22} />
              </div>
              <h3 className="text-lg font-bold text-white font-sans">AI Starter Kit</h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                PDF guide covering setup, LangChain, LangGraph, RAG fundamentals, and deployment checklists.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-7 rounded-3xl bg-[#091124] border border-white/10 space-y-4 hover:border-[#0066FF]/60 transition-all shadow-xl group">
              <div className="w-12 h-12 rounded-2xl bg-blue-950/80 border border-blue-500/30 text-[#00B8F0] flex items-center justify-center group-hover:scale-110 transition-transform">
                <FolderArchive size={22} />
              </div>
              <h3 className="text-lg font-bold text-white font-sans">Resource Pack</h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Downloadable ZIP containing starter code templates, FastAPI/Next.js starters, and Docker configs.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-7 rounded-3xl bg-[#091124] border border-white/10 space-y-4 hover:border-[#0066FF]/60 transition-all shadow-xl group">
              <div className="w-12 h-12 rounded-2xl bg-blue-950/80 border border-blue-500/30 text-[#00B8F0] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Map size={22} />
              </div>
              <h3 className="text-lg font-bold text-white font-sans">2026 AI Roadmap</h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                High-resolution architectural poster detailing the progression from beginner to lead AI Architect.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-7 rounded-3xl bg-[#091124] border border-white/10 space-y-4 hover:border-[#0066FF]/60 transition-all shadow-xl group">
              <div className="w-12 h-12 rounded-2xl bg-blue-950/80 border border-blue-500/30 text-[#00B8F0] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Award size={22} />
              </div>
              <h3 className="text-lg font-bold text-white font-sans">Verifiable Certificate</h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Cryptographically verifiable PDF certificate to showcase your engineering achievements on LinkedIn.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-7 rounded-3xl bg-[#091124] border border-white/10 space-y-4 hover:border-[#0066FF]/60 transition-all shadow-xl group">
              <div className="w-12 h-12 rounded-2xl bg-blue-950/80 border border-blue-500/30 text-[#00B8F0] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users size={22} />
              </div>
              <h3 className="text-lg font-bold text-white font-sans">Community Access</h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Direct access to the exclusive Botmartz AI Discord server, code reviews, and live Zoom office hours.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ── SECTION 6: 100% FULL-WIDTH LEAD INSTRUCTOR EXECUTIVE CARD ── */}
      <section className="py-20 px-4 sm:px-8 lg:px-12 bg-[#040914] text-white border-t border-b border-slate-800/80 relative overflow-hidden">
        
        {/* Ambient Backlight Glow */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="w-full relative z-10">
          
          {/* Executive Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-[#0A142B] to-[#040816] p-8 sm:p-12 lg:p-14 border-2 border-slate-800 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b18_1px,transparent_1px),linear-gradient(to_bottom,#1e293b18_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

            {/* Left Column: Glowing Avatar */}
            <div className="lg:col-span-4 flex justify-center relative z-10">
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-3xl bg-slate-900 p-2 shadow-2xl border-4 border-[#0066FF] shadow-blue-500/25 group overflow-hidden">
                <div className="w-full h-full rounded-2xl overflow-hidden relative">
                  <img
                    src="/Sohamsharma.jpeg"
                    alt="Soham Sharma"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-center font-mono text-[10px] text-cyan-300 font-bold bg-slate-950/80 backdrop-blur-md px-2 py-1 rounded-lg border border-cyan-500/30 uppercase tracking-wider">
                    SOHAM SHARMA &bull; LEAD ARCHITECT
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Instructor Profile & Credentials */}
            <div className="lg:col-span-8 space-y-6 text-center lg:text-left relative z-10 font-sans">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0066FF]/20 text-[#00B8F0] font-mono text-xs font-bold uppercase border border-[#0066FF]/40 shadow-sm">
                <ShieldCheck size={16} className="text-[#00B8F0]" />
                <span>LEAD INSTRUCTOR &amp; FOUNDER</span>
              </div>

              <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
                <span className="bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">Soham Sharma</span>
              </h2>

              <div className="text-base sm:text-lg font-bold text-cyan-400 font-sans">
                Founder &amp; AI Architect, Botmartz AI Solutions
              </div>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans max-w-2xl">
                Soham is an AI Architect specializing in Enterprise RAG, agentic workflows, and deploying LLMs into production. He has trained hundreds of developers and works daily on the frontier of applied AI. He brings real-world production engineering experience directly to the classroom.
              </p>

              {/* Verified Expertise Pills Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs pt-2">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-200">
                  <div className="text-white font-bold text-xs font-sans">100+ Engineers</div>
                  <div className="text-slate-400 text-[10px]">Trained in Bootcamps</div>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-200">
                  <div className="text-white font-bold text-xs font-sans">Enterprise RAG</div>
                  <div className="text-slate-400 text-[10px]">Production Teardowns</div>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-200">
                  <div className="text-white font-bold text-xs font-sans">LangGraph Agents</div>
                  <div className="text-slate-400 text-[10px]">State Graphs &amp; MCP</div>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-200">
                  <div className="text-white font-bold text-xs font-sans">Production LLMs</div>
                  <div className="text-slate-400 text-[10px]">Deployment &amp; Evals</div>
                </div>
              </div>

              {/* Social Link Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-3 font-mono text-xs">
                <a
                  href="https://www.linkedin.com/in/soham-sharma/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold flex items-center gap-2 transition-all shadow-md shadow-blue-500/20"
                  title="Soham Sharma LinkedIn"
                >
                  <Linkedin size={15} />
                  <span>Founder LinkedIn &rarr;</span>
                </a>
                <a
                  href="https://twitter.com/sohamsharma"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center gap-2 transition-all border border-white/10"
                  title="Soham Sharma Twitter"
                >
                  <Twitter size={15} />
                  <span>Founder Twitter</span>
                </a>
                <a
                  href="https://www.linkedin.com/company/botmartz-ai-solutions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center gap-2 transition-all border border-white/10"
                  title="Botmartz Company LinkedIn"
                >
                  <Linkedin size={15} />
                  <span>Company Page</span>
                </a>
                <a
                  href="https://x.com/botmartz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center gap-2 transition-all border border-white/10"
                  title="Botmartz Official X"
                >
                  <Twitter size={15} />
                  <span>Official X</span>
                </a>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ── SECTION 7: 100% FULL-WIDTH 2-COLUMN FREQUENTLY ASKED QUESTIONS (FAQ) ── */}
      <section className="py-20 px-4 sm:px-8 lg:px-12 bg-slate-50 text-slate-900 border-b-2 border-slate-200">
        <div className="w-full space-y-12">
          
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#0066FF] font-mono text-xs font-bold uppercase tracking-wider">
              HELP &amp; SUPPORT &bull; FAQ
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-950 font-sans tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-sans max-w-2xl mx-auto">
              Everything you need to know about the bootcamps, schedule, prerequisites, and the AI Engineering Pass.
            </p>
          </div>

          {/* 2-Column Full-Width Accordion Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-sans">
            {[
              {
                id: 1,
                q: "What are the prerequisites for these bootcamps?",
                a: "Basic programming knowledge (Python or JavaScript) is recommended. Familiarity with Web development or APIs is helpful but not strictly required. We start from AI fundamentals and scale quickly to production architecture.",
              },
              {
                id: 2,
                q: "Are the sessions recorded and available on-demand?",
                a: "Yes! All live sessions are recorded in high-definition and uploaded to your student portal along with code repositories, starter kits, slide decks, and project templates.",
              },
              {
                id: 3,
                q: "What is the refund policy?",
                a: "We offer a 100% no-questions-asked refund policy prior to the start of the first live cohort session for any paid tier passes.",
              },
              {
                id: 4,
                q: "Do I get a verifiable certificate?",
                a: "Yes. Upon completing workshop projects and submitting feedback, you receive a cryptographically verifiable PDF certificate of completion which can be shared directly on LinkedIn.",
              },
              {
                id: 5,
                q: "How does the AI Engineering Pass work?",
                a: "The pass grants you full access to all three workshop series, live Q&A, developer resource packs, Zoom office hours, and community Discord channels.",
              },
              {
                id: 6,
                q: "Where is the builder community hosted?",
                a: "Our active engineering community is hosted on Discord, GitHub, and weekly Zoom office hours with direct access to mentors.",
              },
            ].map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={faq.id}
                  className={`rounded-3xl bg-white border-2 transition-all duration-200 shadow-md hover:shadow-xl overflow-hidden flex flex-col justify-between ${
                    isOpen ? "border-[#0066FF] shadow-blue-500/10" : "border-slate-300 hover:border-[#0066FF]"
                  }`}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-6 text-left font-sans font-bold text-slate-900 text-sm sm:text-base flex items-start justify-between gap-4 cursor-pointer group"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#0066FF] font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-blue-200 mt-0.5 group-hover:bg-[#0066FF] group-hover:text-white transition-colors">
                        0{faq.id}
                      </span>
                      <span className="group-hover:text-[#0066FF] transition-colors leading-snug pt-0.5">
                        {faq.q}
                      </span>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`text-slate-400 shrink-0 transition-transform duration-200 mt-1 ${
                        isOpen ? "rotate-180 text-[#0066FF]" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 text-xs sm:text-sm text-slate-600 font-sans leading-relaxed border-t border-slate-100 pt-4 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>


      {/* ── SECTION 8: 100% FULL-WIDTH FINAL CTA BANNER ── */}
      <section className="py-24 px-4 sm:px-8 lg:px-12 bg-gradient-to-r from-[#040914] via-[#091228] to-[#040914] text-white text-center border-t border-blue-900/60">
        <div className="w-full space-y-6">
          
          <h2 className="text-3xl sm:text-6xl font-black text-white font-sans tracking-tight">
            Ready to Engineer the Future?
          </h2>

          <p className="text-slate-300 text-xs sm:text-base font-sans max-w-2xl mx-auto leading-relaxed">
            Join the Botmartz AI Engineering community and start building production-grade AI systems today.
          </p>

          <div>
            <button
              onClick={() =>
                setSelectedWorkshopForWizard({
                  title: "AI Accelerator Workshop Series Live Pass",
                  slug: "ai-accelerator-workshop",
                  date: "August 2026 Cohort",
                  location: "Online & Indore AI Lab",
                })
              }
              className="px-9 py-4 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-xl shadow-blue-500/30 inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Register Now &rarr;</span>
            </button>
          </div>

        </div>
      </section>

      {/* ── REGISTRATION WIZARD MODAL ── */}
      {selectedWorkshopForWizard && (
        <EventRegistrationWizard
          eventTitle={selectedWorkshopForWizard.title}
          eventSlug={selectedWorkshopForWizard.slug}
          eventDate={selectedWorkshopForWizard.date}
          eventLocation={selectedWorkshopForWizard.location}
          onClose={() => setSelectedWorkshopForWizard(null)}
        />
      )}

    </main>
  );
}

