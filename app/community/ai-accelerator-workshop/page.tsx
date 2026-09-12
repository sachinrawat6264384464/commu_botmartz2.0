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
  Twitter
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
      
      {/* ── SECTION 1: HERO SECTION ── */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 overflow-hidden text-center">
        
        {/* Background Grid Pattern & Radial Glow */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-tr from-[#0066FF]/20 via-[#00B8F0]/10 to-transparent blur-[140px] pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0066FF]/10 border border-[#0066FF]/30 text-[#00B8F0] font-mono text-xs font-bold tracking-wider uppercase">
            <span>BOTMARTZ AI SOLUTIONS PRESENTS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
            AI ACCELERATOR <br />
            <span className="text-[#00B8F0]">WORKSHOP SERIES</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans max-w-2xl mx-auto">
            The official runway to <span className="text-[#00B8F0] font-bold">AI Frontier 2026</span>. Build production-ready AI applications through three live, hands-on engineering bootcamps leading up to our free, in-person main event.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 font-mono text-xs">
            <button
              onClick={() =>
                setSelectedWorkshopForWizard({
                  title: "AI Accelerator Workshop Series Live Pass",
                  slug: "ai-accelerator-workshop",
                  date: "August 2026 Series",
                  location: "Online & Indore AI Lab",
                })
              }
              className="px-7 py-4 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold uppercase tracking-wider transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2 cursor-pointer"
            >
              <span>Register Now &rarr;</span>
            </button>

            <button
              onClick={() => handleScrollToSection("curriculum")}
              className="px-7 py-4 rounded-2xl bg-[#0A1224] hover:bg-slate-800 text-white font-bold transition-all border border-white/20 cursor-pointer"
            >
              View Bootcamps
            </button>
          </div>

          <div className="pt-8 flex flex-col items-center gap-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            <span>SCROLL TO EXPLORE</span>
            <ChevronDown size={14} className="animate-bounce text-[#00B8F0]" />
          </div>

        </div>
      </section>


      {/* ── SECTION 2: THE LEARNING JOURNEY ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white text-slate-900 border-b border-slate-200">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-sans">
              The Learning Journey
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-sans">
              Three live engineering bootcamps leading directly to our flagship summit.
            </p>
          </div>

          {/* Timeline Steps (Zigzag Node Cards) */}
          <div className="space-y-8 relative">
            
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center justify-end gap-6 relative">
              <div className="w-full md:w-1/2 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center gap-2 font-mono text-[11px] font-bold">
                  <span className="text-[#0066FF]">SERIES 1</span>
                  <span className="text-slate-400">&bull;</span>
                  <span className="text-slate-500">Aug 9, 2026</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-sans">
                  Build Your First AI Full-Stack Application
                </h3>
                <p className="text-xs text-slate-600 font-sans">
                  Build an AI-powered application from scratch using the latest AI tools.
                </p>
              </div>

              {/* Node Circle */}
              <div className="w-10 h-10 rounded-full bg-white border-2 border-[#0066FF] text-[#0066FF] font-mono text-xs font-bold flex items-center justify-center shrink-0 shadow-sm z-10">
                01
              </div>
              <div className="hidden md:block w-1/2" />
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-center justify-start gap-6 relative">
              <div className="hidden md:block w-1/2" />
              
              {/* Node Circle */}
              <div className="w-10 h-10 rounded-full bg-white border-2 border-[#0066FF] text-[#0066FF] font-mono text-xs font-bold flex items-center justify-center shrink-0 shadow-sm z-10">
                02
              </div>

              <div className="w-full md:w-1/2 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center gap-2 font-mono text-[11px] font-bold">
                  <span className="text-[#0066FF]">SERIES 2</span>
                  <span className="text-slate-400">&bull;</span>
                  <span className="text-slate-500">Aug 16, 2026</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-sans">
                  Build Smarter AI Agents
                </h3>
                <p className="text-xs text-slate-600 font-sans">
                  Learn how modern AI Agents think, plan and act.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center justify-end gap-6 relative">
              <div className="w-full md:w-1/2 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center gap-2 font-mono text-[11px] font-bold">
                  <span className="text-[#0066FF]">SERIES 3</span>
                  <span className="text-slate-400">&bull;</span>
                  <span className="text-slate-500">Aug 22, 2026</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-sans">
                  Build Production Ready AI Applications
                </h3>
                <p className="text-xs text-slate-600 font-sans">
                  Understand how modern production AI systems are engineered.
                </p>
              </div>

              {/* Node Circle */}
              <div className="w-10 h-10 rounded-full bg-white border-2 border-[#0066FF] text-[#0066FF] font-mono text-xs font-bold flex items-center justify-center shrink-0 shadow-sm z-10">
                03
              </div>
              <div className="hidden md:block w-1/2" />
            </div>

            {/* Step 4 */}
            <div className="flex flex-col md:flex-row items-center justify-start gap-6 relative">
              <div className="hidden md:block w-1/2" />
              
              {/* Node Circle */}
              <div className="w-10 h-10 rounded-full bg-white border-2 border-[#0066FF] text-[#0066FF] font-mono text-xs font-bold flex items-center justify-center shrink-0 shadow-sm z-10">
                04
              </div>

              <div className="w-full md:w-1/2 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center gap-2 font-mono text-[11px] font-bold">
                  <span className="text-[#0066FF]">AI FRONTIER 2026</span>
                  <span className="text-slate-400">&bull;</span>
                  <span className="text-slate-500">Aug 23, 2026</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-sans">
                  The Ultimate Gathering
                </h3>
                <p className="text-xs text-slate-600 font-sans">
                  Join the top AI Engineers in Indore for our flagship event.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ── SECTION 3: THE CURRICULUM (3 BOOTCAMP CARDS) ── */}
      <section id="curriculum" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 text-slate-900 border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-sans">
              The Curriculum
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-sans max-w-xl mx-auto">
              A comprehensive, step-by-step engineering curriculum designed for real-world application.
            </p>

            {/* Rating Bar Badge */}
            <div className="inline-flex flex-wrap items-center justify-center gap-4 p-3 px-6 rounded-full bg-white border border-slate-200 text-xs font-mono shadow-xs">
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
                <span className="ml-1 text-slate-900">4.8 / 5.0</span>
                <span className="text-slate-400 font-normal">(48 Student Reviews)</span>
              </div>
              <span className="text-slate-300">|</span>
              <div className="text-blue-600 font-bold">
                &amp; 100% Recommend Rate
              </div>
              <span className="text-slate-300">|</span>
              <Link
                href="/community/ai-accelerator-workshop/feedback"
                className="px-4 py-1.5 rounded-full bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1"
              >
                <MessageSquare size={13} />
                <span>Give Workshop Feedback &rarr;</span>
              </Link>
            </div>
          </div>

          {/* 3 Bootcamp Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Bootcamp 01 */}
            <div className="p-8 rounded-3xl bg-white border-2 border-blue-500 shadow-md relative overflow-hidden flex flex-col justify-between space-y-6">
              
              {/* Tilted Session Completed Stamp Overlay */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 border-4 border-emerald-500 text-emerald-600 bg-emerald-50/90 rounded-2xl px-6 py-3 font-mono font-black text-center text-xs tracking-wider shadow-lg pointer-events-none z-20">
                <div className="flex items-center gap-1.5 text-sm">
                  <CheckCircle2 size={18} />
                  <span>SESSION COMPLETED</span>
                </div>
                <div className="text-[10px] uppercase text-emerald-700 font-bold">WORKSHOP ENDED</div>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between font-mono text-[10px] font-bold">
                  <span className="text-slate-400 uppercase">BOOTCAMP 01</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    &check; COMPLETED
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 font-sans leading-snug">
                  Build Your First AI Full-Stack Application
                </h3>

                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  Build an AI-powered application from scratch using the latest AI tools.
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">CORE TOPICS</div>
                  <ul className="space-y-2 font-mono text-xs text-slate-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>AI Development Environment</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>ChatGPT, Claude, Gemini</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>Cursor IDE</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>LangChain &amp; LangGraph</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>AI Agent Architecture</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>RAG (Retrieval-Augmented Generation)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>Deploy AI Application</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-4 relative z-10">
                <div className="text-xs font-sans">
                  <span className="font-mono text-[10px] text-slate-400 uppercase font-bold block">OUTCOME</span>
                  <strong className="text-slate-800">Students leave with a working AI application.</strong>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-center font-mono text-xs font-bold flex items-center justify-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>Session Completed</span>
                </div>
              </div>

            </div>

            {/* Bootcamp 02 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-300 shadow-md relative overflow-hidden flex flex-col justify-between space-y-6">
              
              {/* Tilted Session Completed Stamp Overlay */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 border-4 border-emerald-500 text-emerald-600 bg-emerald-50/90 rounded-2xl px-6 py-3 font-mono font-black text-center text-xs tracking-wider shadow-lg pointer-events-none z-20">
                <div className="flex items-center gap-1.5 text-sm">
                  <CheckCircle2 size={18} />
                  <span>SESSION COMPLETED</span>
                </div>
                <div className="text-[10px] uppercase text-emerald-700 font-bold">WORKSHOP ENDED</div>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between font-mono text-[10px] font-bold">
                  <span className="text-slate-400 uppercase">BOOTCAMP 02</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    &check; COMPLETED
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 font-sans leading-snug">
                  Build Smarter AI Agents
                </h3>

                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  Learn how modern AI Agents think, plan and act.
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">CORE TOPICS</div>
                  <ul className="space-y-2 font-mono text-xs text-slate-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>Single Agent &amp; Multi-Agent</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>Memory &amp; Context Management</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>Tool Calling &amp; Execution</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>MCP (Model Context Protocol)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>Google Search API Integration</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>LangChain &amp; LangGraph</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>Agent Architecture &amp; Workflow</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-4 relative z-10">
                <div className="text-xs font-sans">
                  <span className="font-mono text-[10px] text-slate-400 uppercase font-bold block">OUTCOME</span>
                  <strong className="text-slate-800">Students build intelligent AI Agents.</strong>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-center font-mono text-xs font-bold flex items-center justify-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>Session Completed</span>
                </div>
              </div>

            </div>

            {/* Bootcamp 03 */}
            <div className="p-8 rounded-3xl bg-white border border-emerald-500 shadow-md relative overflow-hidden flex flex-col justify-between space-y-6">
              
              {/* Tilted Session Completed Stamp Overlay */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 border-4 border-emerald-500 text-emerald-600 bg-emerald-50/90 rounded-2xl px-6 py-3 font-mono font-black text-center text-xs tracking-wider shadow-lg pointer-events-none z-20">
                <div className="flex items-center gap-1.5 text-sm">
                  <CheckCircle2 size={18} />
                  <span>SESSION COMPLETED</span>
                </div>
                <div className="text-[10px] uppercase text-emerald-700 font-bold">WORKSHOP ENDED</div>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between font-mono text-[10px] font-bold">
                  <span className="text-slate-400 uppercase">BOOTCAMP 03</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    &check; COMPLETED
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 font-sans leading-snug">
                  Build Production Ready AI Applications
                </h3>

                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  Scale and deploy robust systems to the real world.
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">CORE TOPICS</div>
                  <ul className="space-y-2 font-mono text-xs text-slate-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>Transformer &amp; Mamba Architecture</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>Modern LLMs overview</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>Inference &amp; Optimization</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>Deployment &amp; Scaling</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>Security &amp; Guardrails</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>AI Engineering Best Practices</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-4 relative z-10">
                <div className="text-xs font-sans">
                  <span className="font-mono text-[10px] text-slate-400 uppercase font-bold block">OUTCOME</span>
                  <strong className="text-slate-800">Students understand how modern production AI systems are engineered. Note: Expect local/nginx-based deployments via tunneling, rather than full AWS/cloud deployments.</strong>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-center font-mono text-xs font-bold flex items-center justify-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>Session Completed</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ── SECTION 4: VERIFIED PARTICIPANT FEEDBACK (TESTIMONIALS) ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white text-slate-900 border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0066FF] font-mono text-[11px] font-bold uppercase">
              VERIFIED PARTICIPANT FEEDBACK
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-sans">
              What Engineers Say About Our Bootcamps
            </h2>
          </div>

          {/* Feedback Cards Carousel / Grid */}
          {loadingFeedbacks ? (
            <div className="py-12 text-center text-slate-400 font-mono text-xs flex items-center justify-center gap-2">
              <Loader2 size={16} className="animate-spin text-[#0066FF]" />
              <span>Loading verified reviews...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {feedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#0066FF] transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(fb.overallRating || 5)].map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-700 italic font-sans leading-relaxed">
                      &ldquo;{fb.takeaways || fb.comments || "Great workshop!"}&rdquo;
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 font-mono text-[11px] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 truncate max-w-[130px]">
                        {fb.participantName || fb.participantEmail?.split("@")[0] || "Verified Builder"}
                      </div>
                      <div className="text-slate-400 text-[10px]">
                        {fb.attendeeType || "student"}
                      </div>
                    </div>
                    <div className="px-2 py-0.5 rounded bg-blue-50 text-[#0066FF] text-[9px] font-bold">
                      AI Accelerator Workshop
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bottom Dark CTA Banner */}
          <div className="p-8 rounded-3xl bg-[#060D1E] text-white border border-blue-900/60 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-xl font-bold font-sans">Attended a Live Session?</h3>
              <p className="text-xs font-mono text-slate-400">
                Submit your 2-3 line feedback and help us elevate the next AI summit.
              </p>
            </div>

            <Link
              href="/community/ai-accelerator-workshop/feedback"
              className="px-6 py-3.5 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md shrink-0"
            >
              Submit Your Feedback &rarr;
            </Link>
          </div>

        </div>
      </section>


      {/* ── SECTION 5: EVERY REGISTRATION INCLUDES ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#040914] text-white">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-sans">
              Every Registration Includes
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-sans">
              We provide everything you need to start building immediately.
            </p>
          </div>

          {/* 5 Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl bg-[#091124] border border-white/10 space-y-4 hover:border-[#0066FF]/60 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-500/30 text-[#00B8F0] flex items-center justify-center">
                <BookOpen size={22} />
              </div>
              <h3 className="text-lg font-bold text-white font-sans">AI Engineering Starter Kit</h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                A professionally designed PDF covering setup, AI workflow, development environment, LangChain, LangGraph, RAG fundamentals, deployment checklist, roadmap and recommended tools.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl bg-[#091124] border border-white/10 space-y-4 hover:border-[#0066FF]/60 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-500/30 text-[#00B8F0] flex items-center justify-center">
                <FolderArchive size={22} />
              </div>
              <h3 className="text-lg font-bold text-white font-sans">AI Developer Resource Pack</h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Downloadable ZIP containing starter templates, folder structures, prompt templates, README templates, FastAPI starter, Next.js starter, Docker template and reusable developer assets.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl bg-[#091124] border border-white/10 space-y-4 hover:border-[#0066FF]/60 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-500/30 text-[#00B8F0] flex items-center justify-center">
                <Map size={22} />
              </div>
              <h3 className="text-lg font-bold text-white font-sans">AI Engineer Roadmap 2026</h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Beautiful roadmap poster showing the complete path from beginner to production AI Engineer.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-3xl bg-[#091124] border border-white/10 space-y-4 hover:border-[#0066FF]/60 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-500/30 text-[#00B8F0] flex items-center justify-center">
                <Award size={22} />
              </div>
              <h3 className="text-lg font-bold text-white font-sans">Certificate of Completion</h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Beautifully designed downloadable PDF certificate to showcase your engineering credential.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 rounded-3xl bg-[#091124] border border-white/10 space-y-4 hover:border-[#0066FF]/60 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-500/30 text-[#00B8F0] flex items-center justify-center">
                <Users size={22} />
              </div>
              <h3 className="text-lg font-bold text-white font-sans">Community Access</h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Access to the exclusive Botmartz AI Engineering Community after registration. We will be hosting sessions on Zoom for interactive continuous learning.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ── SECTION 6: LEAD INSTRUCTOR SECTION ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white text-slate-900 border-t border-slate-200">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
          
          {/* Avatar Image */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-[#040914] p-1.5 shadow-2xl shrink-0">
            <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 border-2 border-blue-500/40 relative">
              <img
                src="/Sohamsharma.jpeg"
                alt="Soham Sharma"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Instructor Content */}
          <div className="space-y-4 text-center md:text-left font-sans">
            <div className="text-xs font-mono font-bold text-[#0066FF] uppercase tracking-wider">
              LEAD INSTRUCTOR
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Soham Sharma
            </h2>

            <div className="text-sm font-semibold text-slate-600">
              Founder &amp; AI Engineer, Botmartz AI Solutions
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
              Soham is an AI Engineer and Architect specializing in Enterprise RAG, agentic workflows, and deploying LLMs into production. He has trained hundreds of developers and works daily on the frontier of applied AI. He brings real-world production engineering experience directly to the classroom.
            </p>

            {/* Social Icons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2 font-mono text-xs">
              <a
                href="https://www.linkedin.com/in/soham-sharma/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#0066FF] flex items-center gap-1.5 transition-colors border border-slate-200 font-sans font-semibold text-xs"
                title="Soham Sharma LinkedIn"
              >
                <Linkedin size={14} />
                <span>Founder LinkedIn</span>
              </a>
              <a
                href="https://twitter.com/sohamsharma"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#0066FF] flex items-center gap-1.5 transition-colors border border-slate-200 font-sans font-semibold text-xs"
                title="Soham Sharma Twitter"
              >
                <Twitter size={14} />
                <span>Founder Twitter</span>
              </a>
              <a
                href="https://www.linkedin.com/company/botmartz-ai-solutions"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#0066FF] flex items-center gap-1.5 transition-colors border border-slate-200 font-sans font-semibold text-xs"
                title="Botmartz Company LinkedIn"
              >
                <Linkedin size={14} />
                <span>Company LinkedIn</span>
              </a>
              <a
                href="https://x.com/botmartz"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#0066FF] flex items-center gap-1.5 transition-colors border border-slate-200 font-sans font-semibold text-xs"
                title="Botmartz Official X"
              >
                <Twitter size={14} />
                <span>Botmartz X</span>
              </a>
            </div>

          </div>

        </div>
      </section>


      {/* ── SECTION 7: FREQUENTLY ASKED QUESTIONS (FAQ) ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 text-slate-900 border-t border-slate-200">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-sans">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-sans">
              Everything you need to know about the bootcamps and the AI Engineering Pass.
            </p>
          </div>

          {/* Accordions */}
          <div className="space-y-4">
            {[
              {
                q: "What are the prerequisites for these bootcamps?",
                a: "Basic programming knowledge (Python or JavaScript) is recommended. Familiarity with Web development or APIs is helpful but not strictly required. We start from AI fundamentals and quickly scale to production architecture.",
              },
              {
                q: "Are the sessions recorded?",
                a: "Yes! All live sessions are recorded in high-definition and uploaded to your student portal along with code repositories, starter kits, and slide decks.",
              },
              {
                q: "What is the refund policy?",
                a: "We offer a 100% no-questions-asked refund policy prior to the start of the first live cohort session.",
              },
              {
                q: "Do I get a certificate?",
                a: "Yes. Upon completing workshop projects and submitting feedback, you receive a cryptographically verifiable PDF certificate of completion which can be shared on LinkedIn.",
              },
              {
                q: "How does the AI Engineering Pass work?",
                a: "The pass grants you full access to all three workshop series, live Q&A, developer resource packs, Zoom sessions, and community Discord channels.",
              },
              {
                q: "Where is the community hosted?",
                a: "Our active engineering community is hosted on Discord, GitHub, and weekly Zoom office hours.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full p-5 text-left font-sans font-bold text-slate-900 text-sm sm:text-base flex items-center justify-between gap-4 cursor-pointer hover:text-[#0066FF]"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-slate-400 shrink-0 transition-transform duration-200 ${
                      openFaqIndex === index ? "rotate-180 text-[#0066FF]" : ""
                    }`}
                  />
                </button>

                {openFaqIndex === index && (
                  <div className="px-5 pb-5 text-xs text-slate-600 font-sans leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* ── SECTION 8: READY TO ENGINEER THE FUTURE (FINAL CTA BANNER) ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#060D1E] text-white text-center border-t border-blue-900/60">
        <div className="max-w-3xl mx-auto space-y-6">
          
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-sans tracking-tight">
            Ready to Engineer the Future?
          </h2>

          <p className="text-slate-300 text-xs sm:text-base font-sans max-w-xl mx-auto leading-relaxed">
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
              className="px-8 py-4 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2 cursor-pointer block mx-auto"
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
