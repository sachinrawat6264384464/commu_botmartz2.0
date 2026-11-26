"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { ArrowRight, Loader2 } from "lucide-react";
import { TOTAL_SYSTEMS_COUNT } from "@/lib/arena-projects";

interface AuthGateProps {
  children: React.ReactNode;
  featureTitle?: string;
  featureDescription?: string;
}

export default function AuthGate({
  children,
  featureTitle = "Authenticated Builder Feature",
  featureDescription = "This internal workspace and proof-of-work tool is strictly reserved for verified builders in the Botmartz Community.",
}: AuthGateProps) {
  const { user, loading, signInWithGoogle } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-20">
        <div className="text-center font-sans text-xs text-slate-600 space-y-3">
          <Loader2 size={24} className="animate-spin text-[#162774] mx-auto" />
          <p className="font-semibold text-slate-700">Verifying Builder Identity...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className="min-h-screen lg:h-screen bg-white text-slate-900 pt-22 pb-6 font-sans selection:bg-[#D9F83B] selection:text-slate-950 flex flex-col justify-center overflow-x-hidden"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(29, 49, 137, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(29, 49, 137, 0.08) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      >
        <div className="w-full px-4 sm:px-8 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full">
            {/* ── LEFT COLUMN (7 COLS): COMPACT #162774 HERO BANNER ── */}
            <div
              className="lg:col-span-7 relative overflow-hidden rounded-3xl bg-[#162774] p-6 sm:p-8 border border-white/15 shadow-2xl flex flex-col justify-between gap-6 text-white"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
                backgroundSize: "56px 56px",
              }}
            >
              <div className="space-y-4">
                <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#D9F83B] text-slate-950 text-[11px] font-extrabold uppercase tracking-wider">
                  45-Day Virtual AI Internship &amp; Builder Network
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Build Real Systems with{" "}
                  <span className="text-[#D9F83B]">Verifiable Proof-of-Work</span>
                </h1>

                <p className="text-xs sm:text-sm text-blue-100/85 leading-relaxed max-w-2xl">
                  Sign in to access your student Karma Wallet, daily Git commit standup log, Agile sprint workspaces, and founder architecture teardowns.
                </p>

                {/* 4 Compact Feature Cards (No Icons, 01-04 #D9F83B Circles) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {[
                    {
                      num: "01",
                      title: "Daily Git Commit Logger",
                      sub: "+20 to +70 Coins Every Day",
                    },
                    {
                      num: "02",
                      title: `${TOTAL_SYSTEMS_COUNT} Production System PRDs`,
                      sub: "LangGraph, eBPF, PostGIS",
                    },
                    {
                      num: "03",
                      title: "Agile Workspaces & Chat",
                      sub: "Kanban Boards & Live Squad",
                    },
                    {
                      num: "04",
                      title: "Cryptographic Credentials",
                      sub: "QR Verifiable PDF Certificates",
                    },
                  ].map((item) => (
                    <div
                      key={item.num}
                      className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.07] border border-white/15 border-l-4 border-l-[#D9F83B]"
                    >
                      <span className="w-6 h-6 rounded-full bg-[#D9F83B] text-slate-950 font-extrabold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {item.num}
                      </span>
                      <div className="min-w-0">
                        <div className="text-white font-bold text-xs sm:text-sm truncate">
                          {item.title}
                        </div>
                        <div className="text-blue-200/85 text-[11px] font-medium">
                          {item.sub}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-bold text-blue-100">
                  Zero-Trust Authenticated Sessions
                </span>
                <span className="text-slate-950 font-extrabold px-3.5 py-1 rounded-full bg-[#D9F83B]">
                  100 Free Welcome Coins
                </span>
              </div>
            </div>

            {/* ── RIGHT COLUMN (5 COLS): COMPACT SIGN-IN GATE CARD ── */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="h-full bg-white rounded-3xl border border-slate-200 border-l-4 border-l-[#D9F83B] shadow-xl p-6 sm:p-8 flex flex-col justify-between gap-5">
                <div className="space-y-4">
                  <div className="text-center space-y-2">
                    <span className="inline-block px-3.5 py-1 rounded-full bg-[#162774] text-[#D9F83B] text-[10px] font-extrabold uppercase tracking-wider">
                      Zero-Trust Builder Gate
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                      Sign In to Access {featureTitle}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                      {featureDescription}
                    </p>
                  </div>

                  {/* Compact Benefit Highlights */}
                  <div className="p-4 rounded-2xl bg-[#F4F6FB] border border-slate-200 text-xs space-y-2.5 text-slate-700">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-[#162774] shrink-0" />
                      <span>
                        Log daily Git commits &amp; earn{" "}
                        <strong className="text-slate-950">+20 to +70 Karma Coins</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-[#162774] shrink-0" />
                      <span>Access Agile Kanban workspaces &amp; real-time squad chat</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-[#162774] shrink-0" />
                      <span>Track your rolling 45-day virtual internship progress</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons & Links */}
                <div className="space-y-3 text-xs">
                  <button
                    type="button"
                    onClick={() => signInWithGoogle()}
                    className="w-full py-3.5 px-6 rounded-full bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 text-sm font-extrabold transition-all duration-300 flex items-center justify-center gap-3 shadow-md cursor-pointer group"
                  >
                    <span>Continue with Google Sign-In</span>
                    <span className="w-7 h-7 rounded-full bg-[#162774] text-[#D9F83B] flex items-center justify-center transition-transform duration-300 group-hover:rotate-45">
                      <ArrowRight size={14} />
                    </span>
                  </button>

                  <div className="flex items-center justify-center gap-3 text-xs text-slate-500 pt-1 flex-wrap">
                    <Link href="/login" className="hover:text-[#162774] font-bold transition-colors">
                      Sign in with Phone / Email
                    </Link>
                    <span>&bull;</span>
                    <Link href="/product-tour" className="hover:text-[#162774] font-bold transition-colors">
                      Platform Tour
                    </Link>
                    <span>&bull;</span>
                    <Link href="/arena" className="hover:text-[#162774] font-bold transition-colors">
                      Browse PRDs
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
