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
    <div className="bg-[#FAFCFF] text-slate-900">
      
      {/* ── 1. HERO SECTION ── */}
      <section className="relative pt-24 pb-20 overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-blue-50/40 via-slate-50/20 to-[#FAFCFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#0066FF] font-mono text-xs uppercase tracking-wider mb-6 font-semibold shadow-2xs">
            <Sparkles size={13} className="text-[#0066FF]" /> The Developer &amp; AI Builder Ecosystem
          </div>

          <h1 className="text-[clamp(36px,5vw,68px)] font-bold tracking-tight leading-[1.08] max-w-4xl mb-6 text-slate-900">
            Build, Discuss &amp; Compete <br />
            <span className="bg-gradient-to-r from-[#0066FF] via-[#0092D7] to-[#0678BE] bg-clip-text text-transparent">
              On The Frontier Of Applied AI.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed mb-10">
            Join 2,400+ engineers, researchers, and founders building deterministic LangGraph agents, enterprise RAG pipelines, and open-source MCP tools.
          </p>

          <div className="flex flex-wrap gap-4 items-center">
            <Link
              href="/events/ai-frontier-2026"
              className="bg-[#0066FF] hover:bg-[#0052CC] text-white px-7 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
            >
              <span>AI Frontier 2026 Summit</span>
              <ArrowRight size={14} />
            </Link>
            
            <Link
              href="/discussions"
              className="bg-white border border-slate-200 hover:border-[#0066FF] text-slate-700 hover:text-[#0066FF] px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-2xs flex items-center gap-2"
            >
              <MessageSquare size={14} className="text-[#0066FF]" />
              <span>Join Discussions</span>
            </Link>

            <Link
              href="/challenges"
              className="bg-white border border-slate-200 hover:border-amber-500 text-slate-700 hover:text-amber-600 px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-2xs flex items-center gap-2"
            >
              <Trophy size={14} className="text-amber-500" />
              <span>Enter Hackathons</span>
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-10 border-t border-slate-200">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 mb-1">2,400+</div>
              <div className="text-xs text-slate-500 font-medium">Community Builders</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[#0066FF] mb-1">1,850+</div>
              <div className="text-xs text-slate-500 font-medium">Technical Discussions</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-purple-600 mb-1">140+</div>
              <div className="text-xs text-slate-500 font-medium">Shipped AI Projects</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-600 mb-1">₹1.5L+</div>
              <div className="text-xs text-slate-500 font-medium">Hackathon Prize Pool</div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 2. COMMUNITY DISCUSSIONS TEASER ── */}
      <section className="py-20 bg-white border-b border-slate-200/80">
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
            
            <div className="bg-[#FAFCFF] border border-slate-200 hover:border-[#0066FF]/60 rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
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
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs font-mono text-slate-500">
                <span className="text-[#0066FF] font-bold">48 Upvotes • 19 Replies</span>
                <Link href="/discussions" className="text-slate-700 hover:text-[#0066FF] font-semibold flex items-center gap-1">
                  View Thread →
                </Link>
              </div>
            </div>

            <div className="bg-[#FAFCFF] border border-slate-200 hover:border-[#0066FF]/60 rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-mono text-[10px] font-bold">
                    #enterprise-rag
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">5h ago</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 leading-snug">
                  BGE-Large vs Cohere Rerank v3: Real-world Latency vs Retrieval Precision
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Benchmarked top 50 dense retrieval candidates over 100k insurance policies with ONNX GPU acceleration...
                </p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs font-mono text-slate-500">
                <span className="text-purple-700 font-bold">62 Upvotes • 27 Replies</span>
                <Link href="/discussions" className="text-slate-700 hover:text-[#0066FF] font-semibold flex items-center gap-1">
                  View Thread →
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── 3. BUILDER SHOWCASE & HACKATHONS ARENA ── */}
      <section className="py-20 bg-[#FAFCFF] border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left: Showcase spotlight */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 font-mono text-xs font-semibold mb-4">
                <Code2 size={13} /> BUILDER SHOWCASE
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Show Off Your Creations to Industry Leaders
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Submit your AI agent frameworks, RAG evaluators, and custom MCP plugins. Top projects are featured at our summits and reviewed by venture partners and tech leads.
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 size={15} className="text-purple-600 shrink-0 mt-0.5" />
                  <span>Get direct peer code reviews from experienced AI architects</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 size={15} className="text-purple-600 shrink-0 mt-0.5" />
                  <span>Win "Community Pick" awards and official digital credentials</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 size={15} className="text-purple-600 shrink-0 mt-0.5" />
                  <span>Gain visibility with companies hiring production AI engineers</span>
                </div>
              </div>

              <Link
                href="/showcase"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
              >
                <span>Browse Community Builds</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Right: Active Hackathon Card */}
            <div className="bg-white border border-amber-300 rounded-3xl p-8 shadow-md relative">
              <div className="absolute top-0 right-0 px-4 py-1.5 bg-amber-500 text-white font-mono text-[10px] font-bold uppercase rounded-bl-xl">
                ACTIVE ARENA
              </div>

              <div className="text-xs font-mono text-amber-600 uppercase font-bold mb-2">
                48-Hour Sprint
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Multi-Agent Frontier Hackathon
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Build deterministic multi-agent state machines with Human-in-the-Loop checkpoints and automated RAGAS eval test suites.
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between mb-6 font-mono">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Prize Pool</div>
                  <div className="text-lg font-bold text-amber-600">₹1,00,000 + Credits</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Registered</div>
                  <div className="text-lg font-bold text-slate-900">142 Builders</div>
                </div>
              </div>

              <Link
                href="/challenges"
                className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white py-3.5 rounded-xl font-mono text-xs font-bold uppercase text-center block transition-all shadow-sm"
              >
                Join Hackathon Sprints →
              </Link>
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
