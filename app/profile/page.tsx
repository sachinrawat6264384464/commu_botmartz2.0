"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  Search,
  ArrowRight,
  Flame,
  Trophy,
  Coins,
  ShieldCheck,
  GraduationCap,
  Calendar,
  ExternalLink,
  Github,
  Linkedin,
  LogOut,
  Edit3,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  Loader2
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function ProfilePortalPage() {
  const { user, studentProfile, logout, loading: authLoading } = useAuth();
  const [searchHandle, setSearchHandle] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "logs">("overview");

  // Simulated 70-day heatmap data
  const heatmapDays = Array.from({ length: 70 }, (_, i) => {
    const active = (i % 3 === 0 || i % 7 === 0 || i > 50);
    return { day: i + 1, active, level: active ? ((i % 4) + 1) : 0 };
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchHandle.trim()) return;
    const clean = searchHandle.trim().replace(/^@/, "");
    window.location.href = `/member/${encodeURIComponent(clean)}`;
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-20">
      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-[#0066FF] font-mono text-xs font-bold uppercase tracking-wider mb-2 border border-blue-200">
                <User size={14} /> Student Proof-of-Work Portal
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900">
                {user ? `Builder Profile: ${studentProfile?.displayName || user.displayName || "Student"}` : "Member Profiles & Activity Heatmaps"}
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm font-mono mt-1">
                Zero-scraping private builder directory. Track daily commits, verified college credentials, and karma progression.
              </p>
            </div>

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/arena/wallet"
                  className="px-4 py-2.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 font-mono text-xs font-bold flex items-center gap-2 hover:bg-amber-100 transition-all"
                >
                  <Coins size={14} className="text-amber-600" />
                  <span>{studentProfile?.karmaCoins || 100} Coins</span>
                </Link>
                <button
                  onClick={() => logout()}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <LogOut size={13} />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
              >
                Sign In with Google ⚡
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 space-y-8">
        
        {/* If Logged In: Show Personal Verified Profile Dashboard */}
        {user && studentProfile && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-8 animate-fadeIn">
            
            {/* Profile Header Grid */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                {user.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt={studentProfile.displayName}
                    width={64}
                    height={64}
                    className="rounded-2xl border border-slate-200 shadow-xs"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-[#0066FF] text-white flex items-center justify-center font-bold text-2xl">
                    {studentProfile.displayName?.charAt(0) || "S"}
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-extrabold text-slate-900 font-sans">
                      {studentProfile.displayName}
                    </h2>
                    <span className="text-xs font-mono text-slate-500 font-bold">
                      @{studentProfile.username}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px] flex items-center gap-1">
                      <ShieldCheck size={11} /> 🎓 Verified Student
                    </span>
                  </div>

                  <p className="text-xs font-mono text-slate-600 mt-1 flex items-center gap-2 flex-wrap">
                    <span>{studentProfile.collegeName || "College Verification Pending"}</span>
                    <span>•</span>
                    <span>{studentProfile.degreeBranch || "B.Tech"}</span>
                    <span>•</span>
                    <span>Class of {studentProfile.graduationYear}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-mono text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Edit3 size={13} />
                  <span>Update Details</span>
                </Link>
                {studentProfile.githubUsername && (
                  <a
                    href={`https://github.com/${studentProfile.githubUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all"
                  >
                    <Github size={15} />
                  </a>
                )}
                {studentProfile.linkedinUrl && (
                  <a
                    href={studentProfile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-[#0077B5] text-white hover:opacity-90 transition-all"
                  >
                    <Linkedin size={15} />
                  </a>
                )}
              </div>
            </div>

            {/* Quick Stats Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
                <span className="text-[10px] text-amber-800 font-bold uppercase block mb-1">Karma Balance</span>
                <div className="text-2xl font-black text-amber-900">{studentProfile.karmaCoins || 100} 🪙</div>
                <span className="text-[10px] text-slate-500">Botmartz Coins</span>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200">
                <span className="text-[10px] text-purple-800 font-bold uppercase block mb-1">Reputation</span>
                <div className="text-2xl font-black text-purple-900">Level {studentProfile.reputationLevel || 1}</div>
                <span className="text-[10px] text-slate-500">Builder Tier</span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                <span className="text-[10px] text-emerald-800 font-bold uppercase block mb-1">Daily Streak</span>
                <div className="text-2xl font-black text-emerald-900">🔥 7 Days</div>
                <span className="text-[10px] text-slate-500">Active PoW</span>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200">
                <span className="text-[10px] text-blue-800 font-bold uppercase block mb-1">Student ID</span>
                <div className="text-sm font-black text-blue-900 truncate">{studentProfile.studentIdRollNo || "Verified"}</div>
                <span className="text-[10px] text-slate-500">Enrollment No</span>
              </div>
            </div>

            {/* 70-Day Contribution Heatmap */}
            <div>
              <div className="flex items-center justify-between mb-3 font-mono text-xs">
                <span className="font-bold text-slate-900 uppercase">
                  45-Day Cohort Proof-of-Work Heatmap
                </span>
                <span className="text-slate-400 text-[11px]">70-Day Grid</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto">
                <div className="flex gap-1.5 min-w-max">
                  {heatmapDays.map((d) => (
                    <div
                      key={d.day}
                      title={`Day ${d.day}: ${d.active ? "Verified Commit Logged" : "No Activity"}`}
                      className={`w-3.5 h-3.5 rounded-xs transition-all ${
                        d.level === 0
                          ? "bg-slate-900"
                          : d.level === 1
                          ? "bg-emerald-900"
                          : d.level === 2
                          ? "bg-emerald-700"
                          : d.level === 3
                          ? "bg-emerald-500"
                          : "bg-emerald-400"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3 text-[10px] font-mono text-slate-500">
                  <span>14th Sept (Ganesh Chaturthi)</span>
                  <div className="flex items-center gap-1.5">
                    <span>Less</span>
                    <div className="w-2.5 h-2.5 rounded-xs bg-slate-900"></div>
                    <div className="w-2.5 h-2.5 rounded-xs bg-emerald-700"></div>
                    <div className="w-2.5 h-2.5 rounded-xs bg-emerald-400"></div>
                    <span>More</span>
                  </div>
                  <span>Diwali 2026</span>
                </div>
              </div>
            </div>

            {/* Direct Action Hub */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <Link
                href="/arena/daily-log"
                className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center justify-between transition-all"
              >
                <span>Submit Daily PoW Log</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/arena/roadmaps"
                className="p-4 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold flex items-center justify-between transition-all"
              >
                <span>My Role Roadmap</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/arena/shippers"
                className="p-4 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-bold flex items-center justify-between transition-all"
              >
                <span>Claim 15 Referrals</span>
                <ArrowRight size={14} />
              </Link>
            </div>

          </div>
        )}

        {/* Member Lookup Bar */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 font-sans">
            Search Any Community Member Profile
          </h2>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full font-mono">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={searchHandle}
                onChange={(e) => setSearchHandle(e.target.value)}
                placeholder="Enter GitHub handle or student username (e.g. rahulsharma)..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#0066FF]"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <span>View Heatmap</span>
              <ArrowRight size={13} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
