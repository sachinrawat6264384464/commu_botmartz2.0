"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Search,
  ArrowRight,
  Flame,
  Trophy,
  ShieldCheck,
  Sparkles,
  Calendar,
  Layers
} from "lucide-react";

export default function ProfileLookupPage() {
  const router = useRouter();
  const [emailOrHandle, setEmailOrHandle] = useState("");

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrHandle.trim()) return;
    const clean = encodeURIComponent(emailOrHandle.trim().toLowerCase());
    router.push(`/member/${clean}`);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-[#0066FF] font-mono text-xs font-bold uppercase tracking-wider mb-3">
            <User size={14} /> Student Builder Profiles
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">
            Access Your Builder Showcase &amp; Heatmap
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto font-mono">
            Zero public member data scraping. Look up your private proof-of-work contributions, Level &amp; XP status, and active project squads.
          </p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 sm:px-6 mt-10">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleLookup} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-700 font-bold mb-1.5">
                Enter Your Enrolled Email or GitHub Username:
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  value={emailOrHandle}
                  onChange={(e) => setEmailOrHandle(e.target.value)}
                  placeholder="e.g. rahul.sharma@college.edu or rahulsharma"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3.5 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#0066FF] transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <span>Open My Builder Profile</span>
              <ArrowRight size={15} />
            </button>
          </form>

          {/* Feature Highlights */}
          <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs font-mono text-slate-600">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
              <Flame size={14} className="text-orange-500" />
              <span>45-Day Activity Heatmap</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
              <Sparkles size={14} className="text-amber-500" />
              <span>Level 1-10 Karma Badges</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
              <Layers size={14} className="text-blue-500" />
              <span>Associated Squad Cards</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
              <Trophy size={14} className="text-purple-500" />
              <span>15-Co Referral Status</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
