"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Lock,
  Sparkles,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  Terminal,
  Layers,
  ChevronRight,
  KeyRound,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { TOTAL_SYSTEMS_COUNT } from "@/lib/arena-projects";

interface PageLockGateProps {
  pathname: string;
  unlockTime?: string;
  announcementTitle?: string;
  announcementMessage?: string;
}

export default function PageLockGate({
  pathname,
  unlockTime = "2026-09-09T21:00:00+05:30",
  announcementTitle = "Going Live on 9th September at 9:00 PM IST",
  announcementMessage = "This section unlocks live on 9th September at 9:00 PM IST during our Flagship AI Engineering Workshop. Claim your Launch Pass now for instant seat confirmation."
}: PageLockGateProps) {
  // Realtime Countdown State
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPassed: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPassed: false
  });

  const [showAdminBypass, setShowAdminBypass] = useState(false);
  const [bypassCode, setBypassCode] = useState("");
  const [bypassError, setBypassError] = useState("");

  useEffect(() => {
    const targetDate = new Date(unlockTime).getTime();

    const calculateTime = () => {
      const now = Date.now();
      const diff = targetDate - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPassed: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [unlockTime]);

  const handleAdminBypassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bypassCode === "admin@312" || bypassCode === "botmartz2026") {
      sessionStorage.setItem("botmartz_lock_bypass", "true");
      window.location.reload();
    } else {
      setBypassError("Invalid bypass passcode.");
    }
  };

  const getSectionName = (path: string) => {
    if (path.startsWith("/arena")) return `Internship Playground & ${TOTAL_SYSTEMS_COUNT} Projects Matrix`;
    if (path.startsWith("/virtual-ai-internship")) return "45-Day Virtual AI Fellowship";
    if (path.startsWith("/discussions")) return "Community Discussions & Architecture Feeds";
    if (path.startsWith("/magazine")) return "Research Magazine & Engineering Whitepapers";
    if (path.startsWith("/challenges")) return "Algorithmic Challenges & Sandboxes";
    if (path.startsWith("/leaderboard")) return "Student Karma Leaderboards";
    if (path.startsWith("/showcase")) return "Project Showcase Gallery";
    return "Community Module";
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white font-sans">
      <div className="max-w-2xl w-full bg-slate-900/90 border border-slate-800 backdrop-blur-xl rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        {/* Lock Status Header */}
        <div className="relative z-10 text-center space-y-4">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Lock size={13} className="text-blue-400" />
            <span>Goes Live: 9th Sept @ 9:00 PM IST</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
            {getSectionName(pathname)}
          </h1>

          <p className="text-slate-400 text-xs sm:text-sm font-mono max-w-lg mx-auto leading-relaxed">
            {announcementMessage}
          </p>

          {/* ── LIVE COUNTDOWN TIMER ── */}
          <div className="pt-3 pb-2">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-center gap-1.5">
              <Clock size={13} className="text-amber-400" />
              <span>Live Launch Countdown (9th Sept, 9:00 PM IST)</span>
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md mx-auto font-mono">
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 sm:p-4 text-center">
                <div className="text-2xl sm:text-4xl font-black text-white">{timeLeft.days}</div>
                <div className="text-[10px] text-slate-500 uppercase font-bold mt-1">Days</div>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 sm:p-4 text-center">
                <div className="text-2xl sm:text-4xl font-black text-blue-400">{timeLeft.hours}</div>
                <div className="text-[10px] text-slate-500 uppercase font-bold mt-1">Hours</div>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 sm:p-4 text-center">
                <div className="text-2xl sm:text-4xl font-black text-emerald-400">{timeLeft.minutes}</div>
                <div className="text-[10px] text-slate-500 uppercase font-bold mt-1">Mins</div>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 sm:p-4 text-center">
                <div className="text-2xl sm:text-4xl font-black text-amber-400">{timeLeft.seconds}</div>
                <div className="text-[10px] text-slate-500 uppercase font-bold mt-1">Secs</div>
              </div>
            </div>
          </div>

          {/* Feature Highlights on Release */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-left font-mono text-xs space-y-2.5 my-4">
            <div className="text-slate-300 font-bold flex items-center gap-2">
              <Sparkles size={14} className="text-[#0066FF]" />
              <span>What Unlocks on 9th Sept @ 9 PM:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                <span>{TOTAL_SYSTEMS_COUNT} Production System PRDs</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                <span>Live Daily Standup Commit Feed</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                <span>1-on-1 Founder Code Audits</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                <span>15-Company Referral Dispatch</span>
              </div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 font-mono text-xs">
            <Link
              href="/#registration"
              className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold uppercase tracking-wider transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Get Launch Pass &amp; Early Access &rarr;</span>
              <ArrowRight size={14} />
            </Link>

            <Link
              href="/"
              className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <span>Workshop Details</span>
            </Link>
          </div>

          {/* Admin Bypass Link */}
          <div className="pt-4 text-center">
            <button
              onClick={() => setShowAdminBypass(!showAdminBypass)}
              className="text-[11px] font-mono text-slate-500 hover:text-slate-300 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <KeyRound size={12} />
              <span>Admin / Reviewer Bypass</span>
            </button>

            {showAdminBypass && (
              <form onSubmit={handleAdminBypassSubmit} className="mt-3 flex items-center gap-2 max-w-xs mx-auto">
                <input
                  type="password"
                  value={bypassCode}
                  onChange={(e) => {
                    setBypassCode(e.target.value);
                    setBypassError("");
                  }}
                  placeholder="Enter Passcode..."
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 flex-1 font-mono"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold"
                >
                  Unlock
                </button>
              </form>
            )}

            {bypassError && (
              <div className="text-[11px] font-mono text-rose-400 mt-1 flex items-center justify-center gap-1">
                <AlertCircle size={12} />
                <span>{bypassError}</span>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
