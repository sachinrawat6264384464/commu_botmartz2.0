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
      <div className="min-h-screen bg-[#FAFCFF] flex items-center justify-center pt-20">
        <div className="text-center font-mono text-xs text-slate-500 space-y-3">
          <Loader2 size={24} className="animate-spin text-[#0066FF] mx-auto" />
          <p>Verifying Builder Identity...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAFCFF] text-slate-900 py-12 pt-24 font-sans selection:bg-[#0066FF] selection:text-white">
        {/* Dynamic 100% Full-Width Container */}
        <div className="w-full px-4 sm:px-8 lg:px-12 relative z-10">
          
          {/* ── 2-COLUMN SPLIT HERO AUTH GATE LAYOUT ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* ── LEFT COLUMN (7 COLS): HIGH-TECH DARK HERO BRANDING BANNER ── */}
            <div className="lg:col-span-7 relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 p-8 sm:p-12 border border-slate-800 shadow-2xl flex flex-col justify-between min-h-[520px]">
              {/* Background Ambient Glows */}
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-6">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-cyan-400 font-mono text-xs font-bold border border-cyan-500/20 backdrop-blur-md shadow-xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                  </span>
                  <Sparkles size={14} className="text-cyan-400" />
                  <span>45-DAY VIRTUAL AI INTERNSHIP &amp; BUILDER NETWORK</span>
                </div>

                {/* Heading */}
                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-sans leading-tight">
                  Build Real Systems with <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">Verifiable Proof-of-Work</span>
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed max-w-2xl">
                  Sign in to access your student Karma Wallet, daily Git commit standup log, Agile sprint workspaces, and founder architecture teardowns.
                </p>

                {/* 4 Feature Badges Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 font-mono text-xs">
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <Terminal size={18} className="text-cyan-400 shrink-0" />
                    <div>
                      <div className="text-white font-bold text-xs">Daily Git Commit Logger</div>
                      <div className="text-slate-400 text-[10px]">+20 to +70 Coins Every Day</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <Layers size={18} className="text-blue-400 shrink-0" />
                    <div>
                      <div className="text-white font-bold text-xs">50 Production System PRDs</div>
                      <div className="text-slate-400 text-[10px]">LangGraph, eBPF, PostGIS</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <KanbanSquare size={18} className="text-purple-400 shrink-0" />
                    <div>
                      <div className="text-white font-bold text-xs">Agile Workspaces &amp; Chat</div>
                      <div className="text-slate-400 text-[10px]">Jira/Linear Boards &amp; Live Squad</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <Award size={18} className="text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-white font-bold text-xs">Cryptographic Credentials</div>
                      <div className="text-slate-400 text-[10px]">QR Verifiable PDF Certificates</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Founder Stat Ticker */}
              <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>Zero-Trust Authenticated Sessions</span>
                </span>
                <span className="text-cyan-300 font-bold">100 Free Welcome Coins</span>
              </div>
            </div>

            {/* ── RIGHT COLUMN (5 COLS): AUTH GATE CARD ── */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="bg-white border-2 border-slate-300 shadow-2xl rounded-3xl p-8 sm:p-10 text-center space-y-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0066FF] via-cyan-500 to-indigo-600" />
                
                {/* Lock Icon */}
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 text-[#0066FF] flex items-center justify-center mx-auto shadow-xs">
                  <Lock size={26} />
                </div>

                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-bold uppercase tracking-wider">
                    <ShieldCheck size={13} className="text-[#0066FF]" />
                    <span>Zero-Trust Builder Gate</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
                    Sign In to Access {featureTitle}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 font-mono leading-relaxed max-w-md mx-auto">
                    {featureDescription}
                  </p>
                </div>

                {/* Benefit Highlights */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left font-mono text-xs space-y-2.5 text-slate-700">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-amber-500 shrink-0" />
                    <span>Log daily Git commits &amp; earn +20 to +70 Karma Coins</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-blue-500 shrink-0" />
                    <span>Access Agile Kanban workspaces &amp; real-time squad chat</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-emerald-500 shrink-0" />
                    <span>Track your rolling 45-day virtual internship progress</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-2 font-mono text-xs">
                  <button
                    type="button"
                    onClick={() => signInWithGoogle()}
                    className="w-full py-4 px-6 rounded-2xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Continue with Google Sign-In</span>
                    <ArrowRight size={15} />
                  </button>

                  <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 pt-1">
                    <Link href="/login" className="hover:text-[#0066FF] font-bold transition-colors">
                      Sign in with Email
                    </Link>
                    <span>•</span>
                    <Link href="/product-tour" className="hover:text-[#0066FF] transition-colors">
                      Take Platform Tour
                    </Link>
                    <span>•</span>
                    <Link href="/arena" className="hover:text-[#0066FF] transition-colors">
                      Browse Catalog
                    </Link>
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
