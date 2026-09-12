"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  Lock,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Loader2,
  Terminal,
  Layers,
  KanbanSquare,
  Award,
  Coins
} from "lucide-react";

interface AuthGateProps {
  children: React.ReactNode;
  featureTitle?: string;
  featureDescription?: string;
}

export default function AuthGate({
  children,
  featureTitle = "Authenticated Builder Feature",
  featureDescription = "This internal workspace and proof-of-work tool is strictly reserved for verified builders in the Botmartz Community."
}: AuthGateProps) {
  const { user, loading, signInWithGoogle } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center pt-20">
        <div className="text-center font-mono text-xs text-slate-400 space-y-3">
          <Loader2 size={24} className="animate-spin text-[#0066FF] mx-auto" />
          <p>Verifying Builder Identity...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-slate-950 text-white pt-24 pb-8 font-sans selection:bg-[#0066FF] selection:text-white flex flex-col justify-center relative overflow-hidden">
        {/* Futuristic Background Mesh Glows */}
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Dynamic 100% Full-Width Container */}
        <div className="w-full px-4 sm:px-8 lg:px-12 relative z-10 flex-1 flex flex-col justify-center">
          
          {/* ── 2-COLUMN SPLIT HERO AUTH GATE LAYOUT ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full flex-1">
            
            {/* ── LEFT COLUMN (7 COLS): HIGH-TECH DARK HERO BRANDING BANNER ── */}
            <div className="lg:col-span-7 relative overflow-hidden rounded-3xl bg-slate-900/90 p-8 sm:p-12 border-2 border-slate-800 shadow-2xl flex flex-col justify-between min-h-[calc(100vh-180px)] lg:min-h-[650px] backdrop-blur-xl hover:border-blue-500/40 transition-all duration-500 group">
              {/* Background Ambient Glows */}
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />

              <div className="relative z-10 space-y-6">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/15 text-cyan-300 font-mono text-xs font-black border border-cyan-500/30 backdrop-blur-md shadow-xs">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
                  </span>
                  <Sparkles size={14} className="text-cyan-400" />
                  <span>45-DAY VIRTUAL AI INTERNSHIP &amp; BUILDER NETWORK</span>
                </div>

                {/* Heading */}
                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-sans leading-tight">
                  Build Real Systems with <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">Verifiable Proof-of-Work</span>
                </h1>

                <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed font-normal">
                  Sign in to access your student Karma Wallet, daily Git commit standup log, Agile sprint workspaces, and founder architecture teardowns.
                </p>

                {/* 4 Feature Badges Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 font-sans">
                  <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-800/80 border-2 border-slate-700/80 hover:border-cyan-500/50 hover:bg-slate-800 transition-all duration-300 shadow-md">
                    <Terminal size={22} className="text-cyan-400 shrink-0" />
                    <div>
                      <div className="text-white font-bold text-xs sm:text-sm">Daily Git Commit Logger</div>
                      <div className="text-cyan-300 text-xs font-mono font-medium">+20 to +70 Coins Every Day</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-800/80 border-2 border-slate-700/80 hover:border-blue-500/50 hover:bg-slate-800 transition-all duration-300 shadow-md">
                    <Layers size={22} className="text-blue-400 shrink-0" />
                    <div>
                      <div className="text-white font-bold text-xs sm:text-sm">50 Production System PRDs</div>
                      <div className="text-slate-300 text-xs font-mono">LangGraph, eBPF, PostGIS</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-800/80 border-2 border-slate-700/80 hover:border-purple-500/50 hover:bg-slate-800 transition-all duration-300 shadow-md">
                    <KanbanSquare size={22} className="text-purple-400 shrink-0" />
                    <div>
                      <div className="text-white font-bold text-xs sm:text-sm">Agile Workspaces &amp; Chat</div>
                      <div className="text-slate-300 text-xs font-mono">Jira/Linear Boards &amp; Live Squad</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-800/80 border-2 border-slate-700/80 hover:border-emerald-500/50 hover:bg-slate-800 transition-all duration-300 shadow-md">
                    <Award size={22} className="text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-white font-bold text-xs sm:text-sm">Cryptographic Credentials</div>
                      <div className="text-emerald-300 text-xs font-mono font-medium">QR Verifiable PDF Certificates</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Founder Stat Ticker */}
              <div className="relative z-10 pt-6 mt-6 border-t-2 border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-300">
                <span className="flex items-center gap-2 font-bold text-slate-200">
                  <ShieldCheck size={16} className="text-emerald-400" />
                  <span>Zero-Trust Authenticated Sessions</span>
                </span>
                <span className="text-cyan-300 font-extrabold px-3.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30">100 Free Welcome Coins</span>
              </div>
            </div>

            {/* ── RIGHT COLUMN (5 COLS): AUTH GATE CARD ── */}
            <div className="lg:col-span-5 flex flex-col h-full min-h-[calc(100vh-180px)] lg:min-h-[650px]">
              <div className="h-full bg-slate-900/90 rounded-3xl border-2 border-slate-800 shadow-2xl p-8 sm:p-10 space-y-6 relative overflow-hidden flex flex-col justify-between backdrop-blur-xl hover:border-blue-500/40 transition-all duration-500">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0066FF] via-cyan-400 to-indigo-500" />
                
                <div className="space-y-6">
                  {/* Lock Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/15 text-cyan-400 flex items-center justify-center mx-auto border-2 border-cyan-500/30 shadow-md">
                    <Lock size={26} />
                  </div>

                  <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-500/15 text-cyan-300 font-mono text-[11px] font-black uppercase tracking-wider border border-cyan-500/30">
                      <ShieldCheck size={13} /> Zero-Trust Builder Gate
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">
                      Sign In to Access {featureTitle}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed font-medium max-w-md mx-auto">
                      {featureDescription}
                    </p>
                  </div>

                  {/* Benefit Highlights */}
                  <div className="p-4.5 rounded-2xl bg-slate-800/80 border-2 border-slate-700/80 text-left font-sans text-xs space-y-3 text-slate-200">
                    <div className="flex items-center gap-2.5">
                      <Sparkles size={15} className="text-amber-400 shrink-0" />
                      <span>Log daily Git commits &amp; earn <strong>+20 to +70 Karma Coins</strong></span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Sparkles size={15} className="text-cyan-400 shrink-0" />
                      <span>Access Agile Kanban workspaces &amp; real-time squad chat</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Sparkles size={15} className="text-emerald-400 shrink-0" />
                      <span>Track your rolling 45-day virtual internship progress</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons & Links */}
                <div className="space-y-4 font-sans text-xs">
                  <button
                    type="button"
                    onClick={() => signInWithGoogle()}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-[#0066FF] to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-sans text-sm font-black transition-all duration-300 flex items-center justify-center gap-3 shadow-xl hover:shadow-blue-500/30 cursor-pointer border border-blue-400/30 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>Continue with Google Sign-In</span>
                    <ArrowRight size={16} />
                  </button>

                  <div className="flex items-center justify-center gap-4 text-xs font-mono text-slate-400 pt-1">
                    <Link href="/login" className="hover:text-cyan-300 font-bold transition-colors">
                      Sign in with Phone / Email
                    </Link>
                    <span>•</span>
                    <Link href="/product-tour" className="hover:text-cyan-300 font-bold transition-colors">
                      Platform Tour
                    </Link>
                    <span>•</span>
                    <Link href="/arena" className="hover:text-cyan-300 font-bold transition-colors">
                      Browse PRDs
                    </Link>
                  </div>

                  <div className="pt-3 border-t-2 border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono font-bold">
                    <span className="flex items-center gap-1.5">
                      <Lock size={14} className="text-emerald-400" />
                      <span>256-bit Encrypted</span>
                    </span>
                    <span className="text-slate-400">DPDP 2023 Compliant</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    );
  }

  return <>{children}</>;
}
