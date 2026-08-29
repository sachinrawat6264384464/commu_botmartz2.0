import React from "react";
import Link from "next/link";
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
  ExternalLink
} from "lucide-react";

export const revalidate = 60; // ISR 1 min

export default async function CommunityHomePage() {
  return (
    <div className="bg-[#050B14] text-white">
      
      {/* ── 1. HERO SECTION ── */}
      <section className="relative pt-20 pb-28 overflow-hidden border-b border-white/10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#00B8F0]/15 blur-[160px] rounded-full pointer-events-none" />
        <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-[#0052FF]/20 blur-[180px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00B8F0]/10 border border-[#00B8F0]/30 text-[#00B8F0] font-mono text-xs uppercase tracking-widest mb-6 font-semibold">
            <Sparkles size={13} className="text-[#00F0FF]" /> The Ultimate AI Engineering Community
          </div>

          <h1 className="text-[clamp(38px,5.5vw,72px)] font-bold tracking-tight leading-[1.08] max-w-4xl mb-6">
            Build, Discuss &amp; Compete <br />
            <span className="bg-gradient-to-r from-[#00B8F0] via-[#0066FF] to-[#A855F7] bg-clip-text text-transparent">
              On The Frontier Of Applied AI.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-[#8A9EB0] max-w-2xl leading-relaxed mb-10">
            Join 2,400+ engineers, researchers, and founders building deterministic LangGraph agents, enterprise RAG pipelines, and open-source MCP tools.
          </p>

          <div className="flex flex-wrap gap-4 items-center">
            <Link
              href="/events/ai-frontier-2026"
              className="bg-[#0066FF] hover:bg-[#0052CC] text-white px-7 py-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-[0_0_30px_rgba(0,102,255,0.4)] flex items-center gap-2"
            >
              <Flame size={15} className="text-amber-300" />
              <span>AI Frontier 2026 Summit</span>
              <ArrowRight size={14} />
            </Link>
            
            <Link
              href="/discussions"
              className="bg-[#0B1524] border border-white/15 hover:border-[#00B8F0] text-white px-6 py-4 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <MessageSquare size={14} className="text-[#00B8F0]" />
              <span>Join Live Forum</span>
            </Link>

            <Link
              href="/challenges"
              className="bg-[#0B1524] border border-white/15 hover:border-amber-400 text-white px-6 py-4 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <Trophy size={14} className="text-amber-400" />
              <span>Enter Hackathons</span>
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-10 border-t border-white/10">
            <div className="p-4 rounded-2xl bg-[#0B1524]/60 border border-white/5">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-white mb-1">2,400+</div>
              <div className="text-xs font-mono text-slate-400">Community Builders</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#0B1524]/60 border border-white/5">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[#00B8F0] mb-1">1,850+</div>
              <div className="text-xs font-mono text-slate-400">Technical Discussions</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#0B1524]/60 border border-white/5">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-purple-400 mb-1">140+</div>
              <div className="text-xs font-mono text-slate-400">Shipped Projects</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#0B1524]/60 border border-white/5">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 mb-1">₹1.5L+</div>
              <div className="text-xs font-mono text-slate-400">Hackathon Prizes</div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 2. COMMUNITY DISCUSSIONS TEASER ── */}
      <section className="py-20 bg-[#070E1B] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
            <div>
              <div className="font-mono text-xs text-[#00B8F0] uppercase tracking-wider font-semibold mb-2">
                ACTIVE CHANNELS &amp; FORUM
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Trending Discussions</h2>
            </div>
            <Link
              href="/discussions"
              className="text-xs font-mono text-[#00B8F0] hover:underline flex items-center gap-1.5"
            >
              <span>Explore All Channels</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-[#0B1524] border border-white/10 hover:border-[#00B8F0]/40 rounded-3xl p-6 shadow-xl transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#0066FF]/20 text-[#60A5FA] font-mono text-[10px] font-bold">
                    #ai-agents
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">2h ago</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2 leading-snug">
                  How are you handling deterministic state recovery in multi-agent LangGraph workflows?
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Moving tool calls to idempotent PostgreSQL checkpointers to prevent partial state corruption on network drops...
                </p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs font-mono text-slate-400">
                <span className="text-[#00B8F0] font-bold">48 Upvotes • 19 Replies</span>
                <Link href="/discussions" className="text-slate-300 hover:text-white flex items-center gap-1">
                  View Thread →
                </Link>
              </div>
            </div>

            <div className="bg-[#0B1524] border border-white/10 hover:border-[#00B8F0]/40 rounded-3xl p-6 shadow-xl transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-mono text-[10px] font-bold">
                    #enterprise-rag
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">5h ago</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2 leading-snug">
                  BGE-Large vs Cohere Rerank v3: Real-world Latency vs Retrieval Precision
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Benchmarked top 50 dense retrieval candidates over 100k insurance policies with ONNX GPU acceleration...
                </p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs font-mono text-slate-400">
                <span className="text-purple-400 font-bold">62 Upvotes • 27 Replies</span>
                <Link href="/discussions" className="text-slate-300 hover:text-white flex items-center gap-1">
                  View Thread →
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── 3. BUILDER SHOWCASE & HACKATHONS ARENA ── */}
      <section className="py-20 bg-[#050B14] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left: Showcase spotlight */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 font-mono text-xs font-semibold mb-4">
                <Code2 size={13} /> BUILDER SHOWCASE
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Show Off Your Creations to Industry Leaders
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Submit your AI agent frameworks, RAG evaluators, and custom MCP plugins. Top projects are featured at our summits and reviewed by venture partners and tech leads.
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 size={15} className="text-purple-400 shrink-0 mt-0.5" />
                  <span>Get direct peer code reviews from experienced AI architects</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 size={15} className="text-purple-400 shrink-0 mt-0.5" />
                  <span>Win "Community Pick" awards and official digital badges</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 size={15} className="text-purple-400 shrink-0 mt-0.5" />
                  <span>Gain visibility with companies hiring production AI engineers</span>
                </div>
              </div>

              <Link
                href="/showcase"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg"
              >
                <span>Browse Community Builds</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Right: Active Hackathon Card */}
            <div className="bg-[#0B1524] border-2 border-amber-400/40 rounded-3xl p-8 shadow-[0_0_40px_rgba(245,158,11,0.15)] relative">
              <div className="absolute top-0 right-0 px-4 py-1.5 bg-amber-400 text-[#050B14] font-mono text-[10px] font-bold uppercase rounded-bl-xl">
                ACTIVE ARENA
              </div>

              <div className="text-xs font-mono text-amber-400 uppercase font-bold mb-2">
                48-Hour Sprint
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Multi-Agent Frontier Hackathon
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Build deterministic multi-agent state machines with Human-in-the-Loop checkpoints and automated RAGAS eval test suites.
              </p>

              <div className="p-4 rounded-2xl bg-[#050B14] border border-white/5 flex items-center justify-between mb-6 font-mono">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Prize Pool</div>
                  <div className="text-lg font-bold text-amber-400">₹1,00,000 + Credits</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Registered</div>
                  <div className="text-lg font-bold text-white">142 Builders</div>
                </div>
              </div>

              <Link
                href="/challenges"
                className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white py-3.5 rounded-xl font-mono text-xs font-bold uppercase text-center block transition-all"
              >
                Join Hackathon Sprints →
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* ── 4. HALL OF FAME LEADERBOARD PREVIEW ── */}
      <section className="py-20 bg-[#070E1B] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
            <div>
              <div className="font-mono text-xs text-amber-400 uppercase tracking-wider font-semibold mb-2">
                KARMA &amp; RECOGNITION
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Community Hall of Fame</h2>
            </div>
            <Link
              href="/leaderboard"
              className="text-xs font-mono text-amber-400 hover:underline flex items-center gap-1.5"
            >
              <span>View Full Rankings</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0B1524] border border-white/10 rounded-3xl p-6 flex items-center gap-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-[#050B14] font-bold text-xl flex items-center justify-center font-mono">
                #1
              </div>
              <div>
                <div className="font-bold text-white text-sm">Dr. Promit Ray</div>
                <div className="text-xs text-[#00B8F0] font-mono">Chief AI Fellow • 4,850 XP</div>
              </div>
            </div>

            <div className="bg-[#0B1524] border border-white/10 rounded-3xl p-6 flex items-center gap-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-slate-700 text-white font-bold text-xl flex items-center justify-center font-mono">
                #2
              </div>
              <div>
                <div className="font-bold text-white text-sm">Aarav Nair</div>
                <div className="text-xs text-[#00B8F0] font-mono">Lead RAG Architect • 3,920 XP</div>
              </div>
            </div>

            <div className="bg-[#0B1524] border border-white/10 rounded-3xl p-6 flex items-center gap-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-amber-900 text-amber-300 font-bold text-xl flex items-center justify-center font-mono">
                #3
              </div>
              <div>
                <div className="font-bold text-white text-sm">Pooja Reddy</div>
                <div className="text-xs text-[#00B8F0] font-mono">MCP Maintainer • 3,410 XP</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 5. CERTIFICATE LOOKUP CTA ── */}
      <section className="py-20 bg-[#050B14]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#00B8F0]/10 border border-[#00B8F0]/30 text-[#00B8F0] flex items-center justify-center mx-auto mb-6">
            <Award size={28} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Official Verifiable Credentials</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto mb-8 leading-relaxed">
            Validate certificate authenticity for attendees of AI Frontier summits, bootcamp graduates, and hackathon winners.
          </p>
          <Link
            href="/certificates"
            className="inline-flex items-center gap-2 bg-[#0B1524] border border-white/15 hover:border-[#00B8F0] text-white px-8 py-4 rounded-xl text-xs font-mono uppercase font-bold tracking-wider transition-all shadow-lg"
          >
            <span>Launch Certificate Lookup Registry</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

    </div>
  );
}
