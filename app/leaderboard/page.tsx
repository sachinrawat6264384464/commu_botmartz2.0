"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Trophy, 
  Award, 
  Flame, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Star, 
  Zap, 
  ArrowUpRight,
  Crown
} from "lucide-react";

interface Contributor {
  rank: number;
  name: string;
  handle: string;
  xp: number;
  role: string;
  avatarBg: string;
  badges: string[];
  solvedChallenges: number;
}

const TOP_CONTRIBUTORS: Contributor[] = [
  {
    rank: 1,
    name: "Dr. Promit Ray",
    handle: "@promit_ray",
    xp: 4850,
    role: "Chief AI Fellow",
    avatarBg: "from-amber-400 to-amber-600",
    badges: ["Keynote Speaker", "Hackathon Judge", "Agent Pioneer"],
    solvedChallenges: 18
  },
  {
    rank: 2,
    name: "Aarav Nair",
    handle: "@aaravn",
    xp: 3920,
    role: "Lead RAG Architect",
    avatarBg: "from-purple-500 to-indigo-600",
    badges: ["RAG Specialist", "Top Helper", "Hackathon Champion"],
    solvedChallenges: 14
  },
  {
    rank: 3,
    name: "Pooja Reddy",
    handle: "@poojadev",
    xp: 3410,
    role: "Open Source Maintainer",
    avatarBg: "from-emerald-500 to-teal-600",
    badges: ["MCP Pioneer", "Code Reviewer"],
    solvedChallenges: 11
  },
  {
    rank: 4,
    name: "Vikram Mehta",
    handle: "@vmehta",
    xp: 2890,
    role: "Agent Engineer",
    avatarBg: "from-blue-500 to-cyan-600",
    badges: ["Agent Master", "Cohort Alum"],
    solvedChallenges: 9
  },
  {
    rank: 5,
    name: "Sneha Patel",
    handle: "@sneha_p",
    xp: 2640,
    role: "AI Developer",
    avatarBg: "from-rose-500 to-pink-600",
    badges: ["Showcase Winner", "Active Contributor"],
    solvedChallenges: 8
  },
  {
    rank: 6,
    name: "Karan Patel",
    handle: "@karan_p",
    xp: 2310,
    role: "Community Organizer",
    avatarBg: "from-orange-500 to-amber-600",
    badges: ["Event Lead", "Founding Member"],
    solvedChallenges: 6
  }
];

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<"all" | "monthly" | "hackathons">("all");

  return (
    <div className="bg-[#050B14] min-h-screen text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-semibold mb-4">
            <Crown size={14} /> COMMUNITY HALL OF FAME
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            Builder Leaderboard &amp; Ranks
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Earn XP by answering technical discussions, shipping open-source tools, and winning AI engineering challenges.
          </p>
        </div>

        {/* Top 3 Podium Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12 items-end">
          
          {/* Rank 2 */}
          <div className="bg-[#0B1524] border border-white/10 rounded-3xl p-6 text-center order-2 md:order-1 shadow-xl">
            <div className="w-10 h-10 rounded-full bg-slate-700 text-white font-mono font-bold flex items-center justify-center mx-auto mb-4 border border-white/20">
              #2
            </div>
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${TOP_CONTRIBUTORS[1].avatarBg} mx-auto mb-4 flex items-center justify-center font-bold text-lg text-white`}>
              AN
            </div>
            <h3 className="font-bold text-white text-base">{TOP_CONTRIBUTORS[1].name}</h3>
            <div className="text-xs font-mono text-[#00B8F0] mb-3">{TOP_CONTRIBUTORS[1].role}</div>
            <div className="text-xl font-bold font-mono text-amber-400 mb-4">{TOP_CONTRIBUTORS[1].xp} XP</div>
            <div className="flex flex-wrap justify-center gap-1">
              {TOP_CONTRIBUTORS[1].badges.map((b, i) => (
                <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#050B14] border border-white/10 text-slate-300">
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Rank 1 (Tallest / Center) */}
          <div className="bg-[#0B1524] border-2 border-amber-400/60 shadow-[0_0_40px_rgba(245,158,11,0.2)] rounded-3xl p-8 text-center order-1 md:order-2 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-amber-400 text-[#050B14] font-mono text-[10px] font-bold uppercase flex items-center gap-1">
              <Crown size={12} /> TOP ARCHITECT
            </div>
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-tr ${TOP_CONTRIBUTORS[0].avatarBg} mx-auto mb-4 flex items-center justify-center font-bold text-2xl text-white shadow-lg`}>
              PR
            </div>
            <h3 className="font-bold text-white text-lg">{TOP_CONTRIBUTORS[0].name}</h3>
            <div className="text-xs font-mono text-[#00B8F0] mb-3">{TOP_CONTRIBUTORS[0].role}</div>
            <div className="text-2xl font-bold font-mono text-amber-400 mb-4">{TOP_CONTRIBUTORS[0].xp} XP</div>
            <div className="flex flex-wrap justify-center gap-1.5">
              {TOP_CONTRIBUTORS[0].badges.map((b, i) => (
                <span key={i} className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 font-bold">
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Rank 3 */}
          <div className="bg-[#0B1524] border border-white/10 rounded-3xl p-6 text-center order-3 shadow-xl">
            <div className="w-10 h-10 rounded-full bg-amber-900/60 text-amber-300 font-mono font-bold flex items-center justify-center mx-auto mb-4 border border-amber-700/50">
              #3
            </div>
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${TOP_CONTRIBUTORS[2].avatarBg} mx-auto mb-4 flex items-center justify-center font-bold text-lg text-white`}>
              PR
            </div>
            <h3 className="font-bold text-white text-base">{TOP_CONTRIBUTORS[2].name}</h3>
            <div className="text-xs font-mono text-[#00B8F0] mb-3">{TOP_CONTRIBUTORS[2].role}</div>
            <div className="text-xl font-bold font-mono text-amber-400 mb-4">{TOP_CONTRIBUTORS[2].xp} XP</div>
            <div className="flex flex-wrap justify-center gap-1">
              {TOP_CONTRIBUTORS[2].badges.map((b, i) => (
                <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#050B14] border border-white/10 text-slate-300">
                  {b}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Full Leaderboard Table */}
        <div className="bg-[#0B1524] border border-white/10 rounded-3xl overflow-hidden shadow-2xl max-w-5xl mx-auto">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-mono text-xs text-[#00B8F0] uppercase font-bold">
              GLOBAL RANKINGS &amp; BADGES
            </h3>
            <div className="text-xs font-mono text-slate-400">
              Updated hourly based on community activity
            </div>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-[#070E1B] text-slate-400 font-mono uppercase text-[11px] border-b border-white/10">
              <tr>
                <th className="p-4">Rank</th>
                <th className="p-4">Builder</th>
                <th className="p-4">Earned Badges</th>
                <th className="p-4">Challenges Solved</th>
                <th className="p-4 text-right">Total Karma (XP)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {TOP_CONTRIBUTORS.map((c) => (
                <tr key={c.rank} className="hover:bg-white/[0.02]">
                  <td className="p-4 font-mono font-bold text-slate-300">#{c.rank}</td>
                  <td className="p-4">
                    <div className="font-bold text-white text-sm">{c.name}</div>
                    <div className="text-slate-400 font-mono text-[11px]">{c.handle} • {c.role}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {c.badges.map((b, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-[#050B14] border border-white/10 text-slate-300 font-mono text-[10px]">
                          {b}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 font-mono text-emerald-400 font-bold">
                    {c.solvedChallenges} Battles
                  </td>
                  <td className="p-4 text-right font-mono font-bold text-amber-400 text-sm">
                    {c.xp} XP
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
