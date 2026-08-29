import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Sparkles, 
  Calendar, 
  Users, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  Terminal, 
  Cpu, 
  Flame, 
  MapPin, 
  Clock,
  Ticket,
  ChevronRight,
  ShieldCheck,
  MessageSquare,
  Code2,
  Trophy,
  Crown,
  ThumbsUp,
  ExternalLink,
  MessageCircle,
  FileText,
  HelpCircle,
  Video
} from "lucide-react";

export const revalidate = 60; // ISR 1 min

export default async function CommunityHomePage() {
  return (
    <div className="bg-[#FAFCFF] text-slate-900">
      
      {/* ── 1. HERO SECTION ── */}
      <section className="relative pt-24 pb-20 overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-blue-50/40 via-slate-50/20 to-[#FAFCFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#0066FF] font-mono text-xs uppercase tracking-wider mb-6 font-semibold shadow-2xs">
            <Sparkles size={13} className="text-[#0066FF]" /> The Developer &amp; AI Builder Ecosystem
          </div>

          <h1 className="text-[clamp(36px,5vw,68px)] font-bold tracking-tight leading-[1.08] max-w-4xl mb-6 text-slate-900">
            Build, Discuss &amp; Ship <br />
            <span className="bg-gradient-to-r from-[#0066FF] via-[#0092D7] to-[#0678BE] bg-clip-text text-transparent">
              On The Frontier Of Applied AI.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed mb-8">
            Join 2,400+ engineers, researchers, and founders building deterministic LangGraph agents, enterprise RAG pipelines, and open-source MCP tools.
          </p>

          <div className="flex flex-wrap gap-4 items-center mb-10">
            <Link
              href="/events/ai-frontier-2026"
              className="bg-[#0066FF] hover:bg-[#0052CC] text-white px-7 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
            >
              <span>AI Frontier 2026 Summit</span>
              <ArrowRight size={14} />
            </Link>
            
            <a
              href="https://chat.whatsapp.com/invite"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-6 py-3.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-2xs flex items-center gap-2"
            >
              <MessageCircle size={15} />
              <span>Join WhatsApp Hub</span>
            </a>

            <a
              href="https://discord.gg"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-6 py-3.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-2xs flex items-center gap-2"
            >
              <span>Join Discord</span>
            </a>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-slate-200">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 mb-1">2,400+</div>
              <div className="text-xs text-slate-500 font-medium">Community Builders</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[#0066FF] mb-1">Weekly</div>
              <div className="text-xs text-slate-500 font-medium">Showcase Thursdays</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-purple-600 mb-1">Wednesdays</div>
              <div className="text-xs text-slate-500 font-medium">AI Resume Teardowns</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-600 mb-1">3rd Saturday</div>
              <div className="text-xs text-slate-500 font-medium">AI Architect AMAs</div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 2. COMMUNITY RITUALS & CADENCE ── */}
      <section className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="font-mono text-xs text-[#0066FF] uppercase tracking-wider font-bold mb-1.5">
              THE COMMUNITY HEARTBEAT
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Weekly &amp; Monthly Rituals</h2>
            <p className="text-sm text-slate-600">
              Structured community cadence designed to help you build, get hired, and learn directly from top AI architects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* 1. Thursdays */}
            <div className="bg-[#FAFCFF] border-2 border-purple-200 hover:border-purple-400 rounded-3xl p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 font-mono text-[11px] font-bold mb-4 border border-purple-200">
                  <Flame size={13} /> EVERY THURSDAY
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Showcase Thursdays</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  Live demo arena where builders present new autonomous agents, MCP plugins, and RAG pipelines. Win Community Pick badges and peer code reviews.
                </p>

                <div className="space-y-2 text-xs text-slate-700 mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-purple-600" />
                    <span>Live 5-minute builder lightning demos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-purple-600" />
                    <span>Instant peer feedback and upvoting</span>
                  </div>
                </div>
              </div>

              <Link
                href="/showcase"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-mono text-xs font-bold uppercase text-center transition-all shadow-2xs flex items-center justify-center gap-2"
              >
                <span>Submit Demo / View Builds →</span>
              </Link>
            </div>

            {/* 2. Wednesdays */}
            <div className="bg-[#FAFCFF] border-2 border-blue-200 hover:border-[#0066FF] rounded-3xl p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0066FF] font-mono text-[11px] font-bold mb-4 border border-blue-200">
                  <FileText size={13} /> EVERY WEDNESDAY
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Resume &amp; Portfolio Reviews</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  Get 1-on-1 resume teardowns for AI Engineer, RAG Architect, and ML System roles. Learn how to showcase latency benchmarks and evaluation suites.
                </p>

                <div className="space-y-2 text-xs text-slate-700 mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#0066FF]" />
                    <span>Direct line-by-line feedback from hiring leads</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#0066FF]" />
                    <span>Portfolio positioning for top AI jobs</span>
                  </div>
                </div>
              </div>

              <Link
                href="/discussions?channel=resume-review"
                className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white py-3 rounded-xl font-mono text-xs font-bold uppercase text-center transition-all shadow-2xs flex items-center justify-center gap-2"
              >
                <span>Join Wednesday Reviews →</span>
              </Link>
            </div>

            {/* 3. 3rd Saturdays */}
            <div className="bg-[#FAFCFF] border-2 border-amber-200 hover:border-amber-400 rounded-3xl p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 font-mono text-[11px] font-bold mb-4 border border-amber-200">
                  <HelpCircle size={13} /> EVERY 3RD SATURDAY
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Monthly AI Architect AMA</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  Deep-dive technical Ask Me Anything live streams with founders, chief AI officers, and research leads. Covers foundation models, inference economics, and production scale.
                </p>

                <div className="space-y-2 text-xs text-slate-700 mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-amber-600" />
                    <span>Uncensored Q&amp;A on LLM production war stories</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-amber-600" />
                    <span>Live code walkthroughs &amp; architecture teardowns</span>
                  </div>
                </div>
              </div>

              <Link
                href="/discussions?channel=ama-questions"
                className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-mono text-xs font-bold uppercase text-center transition-all shadow-2xs flex items-center justify-center gap-2"
              >
                <span>Submit AMA Questions →</span>
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* ── 3. COMMUNITY DISCUSSIONS & CHANNELS ── */}
      <section className="py-20 bg-[#FAFCFF] border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <div className="font-mono text-xs text-[#0066FF] uppercase tracking-wider font-bold mb-1.5">
                ACTIVE CHANNELS &amp; FORUM
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Trending Discussions</h2>
            </div>
            <Link
              href="/discussions"
              className="text-xs font-bold text-[#0066FF] hover:underline flex items-center gap-1.5"
            >
              <span>Explore All Discussions</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-white border border-slate-200 hover:border-[#0066FF]/60 rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0066FF] border border-blue-200 font-mono text-[10px] font-bold">
                    #ai-agents
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">2h ago</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 leading-snug">
                  How are you handling deterministic state recovery in multi-agent LangGraph workflows?
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Moving tool calls to idempotent PostgreSQL checkpointers to prevent partial state corruption on network drops...
                </p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs font-mono text-slate-500">
                <span className="text-[#0066FF] font-bold">52 Upvotes • 3 Replies</span>
                <Link href="/discussions" className="text-slate-700 hover:text-[#0066FF] font-semibold flex items-center gap-1">
                  View Thread →
                </Link>
              </div>
            </div>

            <div className="bg-white border border-slate-200 hover:border-[#0066FF]/60 rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0066FF] border border-blue-200 font-mono text-[10px] font-bold">
                    #resume-review
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">4h ago</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 leading-snug">
                  📄 AI Engineer (2 YoE) seeking RAG Architect roles — Tear down my resume!
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Benchmarking latency optimization metrics and Qdrant production indices vs fine-tuning experience...
                </p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs font-mono text-slate-500">
                <span className="text-[#0066FF] font-bold">41 Upvotes • 2 Replies</span>
                <Link href="/discussions?channel=resume-review" className="text-slate-700 hover:text-[#0066FF] font-semibold flex items-center gap-1">
                  View Thread →
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── 4. HALL OF FAME LEADERBOARD PREVIEW ── */}
      <section className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <div className="font-mono text-xs text-amber-600 uppercase tracking-wider font-bold mb-1.5">
                KARMA &amp; RECOGNITION
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Community Hall of Fame</h2>
            </div>
            <Link
              href="/leaderboard"
              className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1.5"
            >
              <span>View Full Rankings</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#FAFCFF] border border-slate-200 rounded-3xl p-6 flex items-center gap-4 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 font-bold text-xl flex items-center justify-center font-mono border border-amber-300">
                #1
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">Dr. Promit Ray</div>
                <div className="text-xs text-[#0066FF] font-mono">Chief AI Fellow • 4,850 XP</div>
              </div>
            </div>

            <div className="bg-[#FAFCFF] border border-slate-200 rounded-3xl p-6 flex items-center gap-4 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xl flex items-center justify-center font-mono border border-slate-300">
                #2
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">Aarav Nair</div>
                <div className="text-xs text-[#0066FF] font-mono">Lead RAG Architect • 3,920 XP</div>
              </div>
            </div>

            <div className="bg-[#FAFCFF] border border-slate-200 rounded-3xl p-6 flex items-center gap-4 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 font-bold text-xl flex items-center justify-center font-mono border border-amber-200">
                #3
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">Pooja Reddy</div>
                <div className="text-xs text-[#0066FF] font-mono">MCP Maintainer • 3,410 XP</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 5. CERTIFICATE LOOKUP CTA ── */}
      <section className="py-20 bg-[#FAFCFF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 text-[#0066FF] flex items-center justify-center mx-auto mb-6 shadow-2xs">
            <Award size={28} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Official Verifiable Credentials</h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto mb-8 leading-relaxed">
            Validate certificate authenticity for attendees of AI Frontier summits, bootcamp graduates, and hackathon winners.
          </p>
          <Link
            href="/certificates"
            className="inline-flex items-center gap-2 bg-white border border-slate-300 hover:border-[#0066FF] text-slate-800 hover:text-[#0066FF] px-8 py-4 rounded-xl text-xs font-mono uppercase font-bold tracking-wider transition-all shadow-sm"
          >
            <span>Launch Certificate Lookup Registry</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

    </div>
  );
}
