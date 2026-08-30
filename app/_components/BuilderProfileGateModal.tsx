"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  X, 
  Sparkles, 
  Coins, 
  AlertCircle,
  Github,
  Building,
  GraduationCap
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  requiredActionName?: string;
}

export default function BuilderProfileGateModal({
  isOpen,
  onClose,
  title = "Builder Profile Required",
  description = "To maintain verified Proof-of-Work standards, track daily commits, and enable company referral placements, a completed profile is mandatory.",
  requiredActionName = "this action"
}: Props) {
  const { user, studentProfile } = useAuth();

  if (!isOpen) return null;

  const isProfileComplete = Boolean(
    studentProfile?.collegeName &&
    studentProfile?.studentIdRollNo &&
    studentProfile?.githubUsername
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 relative text-slate-900 overflow-hidden">
        
        {/* Glowing Background Accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#0066FF]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header Icon */}
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center mb-4">
          <Lock size={22} className="text-amber-600" />
        </div>

        {/* Title & Description */}
        <div className="text-[11px] font-mono text-[#0066FF] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <ShieldCheck size={13} className="text-emerald-500" />
          <span>GATED BUILDER ACCESS</span>
        </div>
        <h3 className="text-xl font-extrabold text-slate-900 font-sans tracking-tight">
          {title}
        </h3>
        <p className="text-xs text-slate-600 font-sans mt-2 leading-relaxed">
          {description}
        </p>

        {/* Mandatory Checklist */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5 font-mono text-xs">
          <div className="text-[11px] font-bold text-slate-700 uppercase mb-1">
            Required for {requiredActionName}:
          </div>

          <div className="flex items-center gap-2.5 text-slate-700">
            {user ? (
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
            ) : (
              <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />
            )}
            <span>1. Authenticated Google / Phone Account</span>
          </div>

          <div className="flex items-center gap-2.5 text-slate-700">
            {studentProfile?.collegeName ? (
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
            ) : (
              <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />
            )}
            <span>2. Verified College &amp; Roll Number</span>
          </div>

          <div className="flex items-center gap-2.5 text-slate-700">
            {studentProfile?.githubUsername ? (
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
            ) : (
              <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />
            )}
            <span>3. GitHub Handle (For Proof-of-Work Verification)</span>
          </div>
        </div>

        {/* Reward Highlight */}
        <div className="mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200/70 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-emerald-900">
            <Sparkles size={16} className="text-emerald-600" />
            <span className="font-bold">Reward for 100% Completion:</span>
          </div>
          <div className="flex items-center gap-1 font-extrabold text-emerald-800">
            <Coins size={14} className="text-amber-500" />
            <span>+100 Karma Coins</span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          {!user ? (
            <Link
              href="/login?redirect=/profile"
              className="w-full py-3 rounded-2xl bg-[#0066FF] hover:bg-blue-600 text-white font-mono font-bold text-xs text-center transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              <span>Sign Up &amp; Unlock Profile</span>
              <ArrowRight size={14} />
            </Link>
          ) : (
            <Link
              href="/profile"
              className="w-full py-3 rounded-2xl bg-[#0066FF] hover:bg-blue-600 text-white font-mono font-bold text-xs text-center transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              <span>Complete Profile in 60s (+100 Coins)</span>
              <ArrowRight size={14} />
            </Link>
          )}

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono font-bold text-xs transition-colors"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
