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
              href="https://chat.whatsapp.com/DkzKwpjuktaCYAofOtMlAQ"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-6 py-3.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-2xs flex items-center gap-2"
            >
              <MessageCircle size={15} />
              <span>Join WhatsApp Hub</span>
            </a>

            <a
              href="https://discord.gg/k75ZpEnzp"
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
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[#0066FF] mb-1">10 Systems</div>
              <div className="text-xs text-slate-500 font-medium">30D Production Arena</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-purple-600 mb-1">Central India</div>
              <div className="text-xs text-slate-500 font-medium">Indore AI Hub</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-rose-600 mb-1">₹1 Lakh</div>
              <div className="text-xs text-slate-500 font-medium">GTH Extreme Prize Pool</div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 1.5. THE BUILDER ARENA & VIRTUAL INTERNSHIP SHOWCASE ── */}
      <section className="py-16 bg-gradient-to-b from-[#0F172A] to-[#020617] text-white border-b border-slate-800 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#0066FF]/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-rose-500/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-[#00B8F0] font-mono text-xs uppercase tracking-wider mb-3 border border-blue-500/30 font-bold">
                <Flame size={14} className="text-amber-400" /> CENTRAL INDIA&apos;S PREMIER 30-DAY VIRTUAL ARENA
              </div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
                The 30-Day Builder Arena &amp; <br />
                <span className="bg-gradient-to-r from-[#0066FF] via-[#00B8F0] to-[#38BDF8] bg-clip-text text-transparent">
                  Virtual Internship Track
                </span>
              </h2>
              <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                Zero toy apps. Zero vibe-coding. Build 2 production systems from our curated 10-project matrix (Django, FastAPI, PostgreSQL, LangGraph, Qdrant, WebGPU, eBPF &amp; AWS). Top finishers earn direct paid internships and cash prizes.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full lg:w-auto">
              <Link
                href="/arena"
                className="px-6 py-3.5 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Launch Arena &amp; Scan Resume</span>
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/arena/daily-log"
                className="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-bold uppercase tracking-wider transition-all border border-slate-700 text-center flex items-center justify-center gap-2"
              >
                <Terminal size={15} className="text-emerald-400" />
                <span>Daily PoW Logger</span>
              </Link>
            </div>
          </div>

          {/* Quick Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="text-xs font-mono text-[#00B8F0] font-bold uppercase mb-2">01. Resume Scanner &amp; Matcher</div>
              <h3 className="font-bold text-white text-base mb-2">Automated Skill Diagnosis</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Paste your technical bio or PDF text. Our deterministic engine maps your skills to matching production projects and curates missing YouTube learning tracks.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="text-xs font-mono text-emerald-400 font-bold uppercase mb-2">02. Cross-Functional Squads</div>
              <h3 className="font-bold text-white text-base mb-2">Devs, AI, Pentest, QA &amp; PM</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Security pen-testers hunt OWASP bugs in peer live staging URLs. QA engineers write Playwright &amp; k6 load test suites. PMs drive sprint backlogs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="text-xs font-mono text-rose-400 font-bold uppercase mb-2">03. Go To Hell (GTH) 💀</div>
              <h3 className="font-bold text-white text-base mb-2">₹1,00,000 Prize Pool (5 Slots)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Autonomous self-healing microservices with Rust &amp; eBPF kernel probes. 48-hour continuous chaos gauntlet defense for ₹20,000 / finalist.
              </p>
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

      {/* ── 5. AI ENGINEERING MAGAZINE & DIGESTS ── */}
      <section className="py-20 bg-[#FAFCFF] border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
            <div>
              <div className="font-mono text-xs text-[#0066FF] uppercase tracking-wider font-bold mb-1.5 flex items-center gap-1.5">
                <FileText size={13} /> EDITORIAL &amp; RESEARCH DISPATCH
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">AI Engineering Magazine</h2>
            </div>
            <Link
              href="/magazine"
              className="text-xs font-bold text-[#0066FF] hover:underline flex items-center gap-1.5 font-mono"
            >
              <span>Explore All Issues &amp; Deep-Dives</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Article 1 */}
            <Link
              href="/magazine"
              className="group bg-white border border-slate-200 hover:border-[#0066FF] rounded-3xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0066FF] border border-blue-200 font-mono text-[10px] font-bold">
                    #AgentSystems
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">8 min read</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 leading-snug group-hover:text-[#0066FF] transition-colors">
                  Deterministic State Machines in LangGraph: Handling Tool Failures Without Corrupted Memory
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                  A deep architectural teardown of checkpoint persistence in SQLite/PostgreSQL, human-in-the-loop pause nodes, and rollback graphs for enterprise multi-agent workflows.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
                <span className="font-bold text-slate-800">By Soham Sharma</span>
                <span className="text-[#0066FF] font-bold group-hover:translate-x-1 transition-transform">Read Article →</span>
              </div>
            </Link>

            {/* Article 2 */}
            <Link
              href="/magazine"
              className="group bg-white border border-slate-200 hover:border-emerald-500 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[10px] font-bold">
                    #HybridRAG
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">12 min read</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 leading-snug group-hover:text-emerald-600 transition-colors">
                  BM25 + Dense Embeddings with Reciprocal Rank Fusion: Production Benchmarks at 1M Chunks
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                  Why single-vector dense similarity fails on exact part numbers and domain jargon, and how multi-stage cross-encoder reranking solves recall degradation.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
                <span className="font-bold text-slate-800">By Dr. Promit Ray</span>
                <span className="text-emerald-600 font-bold group-hover:translate-x-1 transition-transform">Read Article →</span>
              </div>
            </Link>

            {/* Article 3 */}
            <Link
              href="/magazine"
              className="group bg-white border border-slate-200 hover:border-purple-500 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-mono text-[10px] font-bold">
                    #LocalAI
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">6 min read</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 leading-snug group-hover:text-purple-600 transition-colors">
                  Running Quantized Gemma 2 &amp; Llama 3.2 In-Browser via WebGPU: Zero Cloud Cost Inference
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                  Step-by-step implementation guide using ONNX Runtime Web and transformers.js to power on-device summarization with zero cloud latency.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
                <span className="font-bold text-slate-800">By Aarav Nair</span>
                <span className="text-purple-600 font-bold group-hover:translate-x-1 transition-transform">Read Article →</span>
              </div>
            </Link>

          </div>

        </div>
      </section>

      {/* ── 6. CERTIFICATE LOOKUP CTA ── */}
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
