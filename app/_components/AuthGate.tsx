"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Lock, ShieldCheck, Sparkles, ArrowRight, Loader2 } from "lucide-react";

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
      <div className="min-h-screen bg-[#FAFCFF] text-slate-900 pt-28 pb-20 font-sans selection:bg-[#0066FF] selection:text-white">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xl text-center space-y-6">
            
            {/* Lock Icon */}
            <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-200 text-[#0066FF] flex items-center justify-center mx-auto shadow-xs">
              <Lock size={28} />
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
                className="w-full py-3.5 px-6 rounded-2xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue with Google Sign-In</span>
                <ArrowRight size={14} />
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
    );
  }

  return <>{children}</>;
}
