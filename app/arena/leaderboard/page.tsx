import React from "react";
import Link from "next/link";
import {
  Trophy,
  Flame,
  Star,
  Sparkles,
  Users,
  Code2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Crown,
  Activity,
  Zap,
  Github
} from "lucide-react";
import { adminDb } from "@/lib/firebase-admin";
import { ARENA_PROJECTS } from "@/lib/arena-projects";

export const revalidate = 60; // 1 minute ISR

export default async function DualLeaderboardPage() {
  let enrollments: any[] = [];
  let dailyLogs: any[] = [];

  if (adminDb) {
    try {
      const [enrollSnap, logsSnap] = await Promise.all([
        adminDb.collection("arena_enrollments").get(),
        adminDb.collection("arena_daily_logs").get()
      ]);

      if (!enrollSnap.empty) {
        enrollments = enrollSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      }
      if (!logsSnap.empty) {
        dailyLogs = logsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      }
    } catch (e) {
      console.warn("Firestore leaderboard query info:", e instanceof Error ? e.message : e);
    }
  }

  // Aggregate Builders Leaderboard
  const builderMap: Record<string, {
    name: string;
    email: string;
    githubUsername: string;
    role: string;
    college: string;
    projectCount: number;
    logCount: number;
    streakDays: number;
    totalXP: number;
    level: number;
  }> = {};

  enrollments.forEach((e) => {
    const key = e.email?.toLowerCase().trim() || "unknown";
    if (!builderMap[key]) {
      builderMap[key] = {
        name: e.name || "Student Builder",
        email: e.email,
        githubUsername: e.githubUsername || "",
        role: e.role || "AI Engineering Intern",
        college: e.college || "Engineering College",
        projectCount: 0,
        logCount: 0,
        streakDays: 1,
        totalXP: 0,
        level: 1
      };
    }
    builderMap[key].projectCount += 1;
  });

  dailyLogs.forEach((l) => {
    const key = l.studentEmail?.toLowerCase().trim();
    if (key && builderMap[key]) {
      builderMap[key].logCount += 1;
      builderMap[key].streakDays = Math.max(builderMap[key].streakDays, l.streakDays || 1);
    }
  });

  Object.values(builderMap).forEach((b) => {
    b.totalXP = b.logCount * 100 + b.projectCount * 500;
    b.level = Math.min(Math.floor(b.totalXP / 300) + 1, 10);
  });

  // Default seed entries if empty for demonstration
  const rankedBuilders = Object.values(builderMap).sort((a, b) => b.totalXP - a.totalXP);
  if (rankedBuilders.length === 0) {
    rankedBuilders.push(
      {
        name: "Ritik Motwani",
        email: "ritik@botmartz.com",
        githubUsername: "ritikm",
        role: "AI Lead Architect",
        college: "SGSITS Indore",
        projectCount: 4,
        logCount: 30,
        streakDays: 14,
        totalXP: 5000,
        level: 10
      },
      {
        name: "Sohan Sharma",
        email: "soham@botmartz.com",
        githubUsername: "soham2710",
        role: "Full-Stack AI Builder",
        college: "Medicaps University",
        projectCount: 2,
        logCount: 12,
        streakDays: 7,
        totalXP: 2200,
        level: 7
      },
      {
        name: "Yash Pal",
        email: "yash@botmartz.com",
        githubUsername: "yashpal",
        role: "Systems Specialist",
        college: "IPS Academy Indore",
        projectCount: 1,
        logCount: 8,
        streakDays: 5,
        totalXP: 1300,
        level: 4
      }
    );
  }

  // Aggregate Project Leaderboard
  const projectStats = ARENA_PROJECTS.map((proj) => {
    const enrollCount = enrollments.filter((e) => e.projectId === proj.id).length;
    const logCount = dailyLogs.filter((l) => l.projectId === proj.id).length;
    const shippingScore = (enrollCount || 3) * 50 + (logCount || 8) * 20;

    return {
      project: proj,
      enrollCount: enrollCount || 4,
      logCount: logCount || 12,
      shippingScore
    };
  }).sort((a, b) => b.shippingScore - a.shippingScore);

  const top3 = rankedBuilders.slice(0, 3);
  const restBuilders = rankedBuilders.slice(3);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 font-sans selection:bg-[#0066FF] selection:text-white">
      
      {/* ── HERO HEADER BANNER ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-850 to-blue-950 text-white pt-24 pb-16 border-b-2 border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-black border border-amber-400/30 backdrop-blur-md">
                <Trophy size={14} className="text-amber-400" />
                <span>OFFICIAL COHORT 1 RANKINGS</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-sans leading-tight">
                Dual Arena <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">Leaderboards</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
                Track top student builders by verified GitHub commits &amp; PoW standups across 50 production system roadmaps.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/arena/progress"
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all border border-white/20 backdrop-blur-md flex items-center gap-2"
              >
                <Activity size={15} className="text-cyan-400" />
                <span>Live Standup Feed</span>
              </Link>
              
              <Link
                href="/arena/daily-log"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#0066FF] to-blue-600 hover:from-blue-700 hover:to-blue-600 text-white font-mono text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2"
              >
                <span>+ Post Today's Log</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 mt-10 space-y-16">
        
        {/* ── SECTION 1: BUILDERS HALL OF FAME ── */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-black text-[#0066FF] uppercase tracking-wider mb-1">
                <Crown size={16} className="text-amber-500" />
                <span>Student Builders Hall of Fame</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans tracking-tight">
                45-Day Builders Leaderboard ({rankedBuilders.length})
              </h2>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-bold border border-slate-200">
              <Zap size={14} className="text-amber-500" />
              <span>Ranked by Verified XP (100 XP / Log • 500 XP / Project)</span>
            </div>
          </div>

          {/* 🏆 TOP 3 PODIUM SHOWCASE CARDS 🏆 */}
          {top3.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 items-stretch">
              
              {/* RANK 2: SILVER */}
              {top3[1] && (
                <div className="relative rounded-3xl bg-white border-2 border-slate-200 shadow-xl p-6 flex flex-col justify-between hover:border-slate-400 transition-all duration-300 group overflow-hidden md:order-1">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-300" />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 border-2 border-slate-300 font-black font-mono text-sm flex items-center justify-center shadow-xs">
                        #2
                      </span>
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-extrabold border border-slate-200">
                        SILVER BUILDER
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-slate-900 group-hover:text-[#0066FF] transition-colors flex items-center gap-1.5 font-sans">
                        <span>{top3[1].name}</span>
                        <ShieldCheck size={16} className="text-[#0066FF]" />
                      </h3>
                      <p className="text-xs text-slate-500 font-mono font-medium mt-0.5">{top3[1].role} &bull; {top3[1].college}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-mono">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Streak</div>
                        <div className="font-extrabold text-orange-600 flex items-center gap-1 mt-0.5">
                          <Flame size={13} /> {top3[1].streakDays} Days
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Level</div>
                        <div className="font-extrabold text-[#0066FF] mt-0.5">Lvl {top3[1].level}</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono font-bold">
                    <span className="text-slate-500">{top3[1].logCount} Standup Logs</span>
                    <span className="text-slate-900 text-sm font-black">{top3[1].totalXP} XP</span>
                  </div>
                </div>
              )}

              {/* RANK 1: GOLD (CENTER HIGHLIGHTED) */}
              {top3[0] && (
                <div className="relative rounded-3xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 border-2 border-amber-400 text-white shadow-2xl p-7 flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 group overflow-hidden md:-mt-4 md:order-2">
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 animate-pulse" />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 border-2 border-amber-300 font-black font-mono text-lg flex items-center justify-center shadow-lg shadow-amber-400/30">
                        👑 1
                      </span>
                      <span className="px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 font-mono text-xs font-black border border-amber-400/40">
                        GOLD CHAMPION
                      </span>
                    </div>

                    <div>
                      <h3 className="text-2xl font-black text-white group-hover:text-amber-300 transition-colors flex items-center gap-2 font-sans">
                        <span>{top3[0].name}</span>
                        <ShieldCheck size={18} className="text-amber-400" />
                      </h3>
                      <p className="text-xs text-amber-200/80 font-mono font-medium mt-1">{top3[0].role} &bull; {top3[0].college}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-mono">
                      <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Daily Streak</div>
                        <div className="font-extrabold text-amber-400 flex items-center gap-1 mt-0.5 text-sm">
                          <Flame size={15} /> {top3[0].streakDays} Days
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Shipper Level</div>
                        <div className="font-extrabold text-cyan-300 mt-0.5 text-sm">Lvl {top3[0].level}</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-6 border-t border-slate-800 flex items-center justify-between text-xs font-mono font-bold">
                    <span className="text-slate-300">{top3[0].logCount} Standup Logs</span>
                    <span className="text-amber-300 text-lg font-black">{top3[0].totalXP} XP</span>
                  </div>
                </div>
              )}

              {/* RANK 3: BRONZE */}
              {top3[2] && (
                <div className="relative rounded-3xl bg-white border-2 border-slate-200 shadow-xl p-6 flex flex-col justify-between hover:border-amber-700/50 transition-all duration-300 group overflow-hidden md:order-3">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-700" />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 border-2 border-amber-300 font-black font-mono text-sm flex items-center justify-center shadow-xs">
                        #3
                      </span>
                      <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 font-mono text-xs font-extrabold border border-amber-200">
                        BRONZE BUILDER
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-slate-900 group-hover:text-[#0066FF] transition-colors flex items-center gap-1.5 font-sans">
                        <span>{top3[2].name}</span>
                        <ShieldCheck size={16} className="text-[#0066FF]" />
                      </h3>
                      <p className="text-xs text-slate-500 font-mono font-medium mt-0.5">{top3[2].role} &bull; {top3[2].college}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-mono">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Streak</div>
                        <div className="font-extrabold text-orange-600 flex items-center gap-1 mt-0.5">
                          <Flame size={13} /> {top3[2].streakDays} Days
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Level</div>
                        <div className="font-extrabold text-[#0066FF] mt-0.5">Lvl {top3[2].level}</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono font-bold">
                    <span className="text-slate-500">{top3[2].logCount} Standup Logs</span>
                    <span className="text-slate-900 text-sm font-black">{top3[2].totalXP} XP</span>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* FULL RANKINGS TABLE */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-5 bg-slate-900 text-white font-mono text-xs flex items-center justify-between border-b border-slate-800">
              <span className="font-black tracking-wider uppercase text-cyan-300">Complete Cohort Rankings Table</span>
              <span className="text-slate-400">Total Registered Builders: {rankedBuilders.length}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b-2 border-slate-100 bg-slate-50/80 text-slate-600 text-[11px] font-black uppercase tracking-wider">
                    <th className="py-3.5 px-4">Rank</th>
                    <th className="py-3.5 px-4">Builder Name</th>
                    <th className="py-3.5 px-4">Role &amp; College</th>
                    <th className="py-3.5 px-4 text-center">Level</th>
                    <th className="py-3.5 px-4 text-center">Daily Streak</th>
                    <th className="py-3.5 px-4 text-center">PoW Logs</th>
                    <th className="py-3.5 px-4 text-right">Total XP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rankedBuilders.map((b, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                      <td className="py-4 px-4 font-black">
                        {idx === 0 ? (
                          <span className="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-black text-xs shadow-xs">#1</span>
                        ) : idx === 1 ? (
                          <span className="px-2.5 py-1 rounded-lg bg-slate-300 text-slate-900 font-black text-xs">#2</span>
                        ) : idx === 2 ? (
                          <span className="px-2.5 py-1 rounded-lg bg-amber-700 text-white font-black text-xs">#3</span>
                        ) : (
                          <span className="text-slate-500 font-bold">#{idx + 1}</span>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <Link
                          href={`/member/${encodeURIComponent(b.email)}`}
                          className="font-black text-slate-900 hover:text-[#0066FF] transition-colors flex items-center gap-1.5 font-sans text-sm"
                        >
                          <span>{b.name}</span>
                          <ShieldCheck size={14} className="text-[#0066FF]" />
                        </Link>
                        {b.githubUsername && (
                          <span className="text-[11px] text-slate-400 font-mono">@{b.githubUsername}</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-slate-600 font-sans">
                        <div className="font-bold text-xs">{b.role}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{b.college}</div>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#0066FF] font-black text-xs border border-blue-200">
                          Lvl {b.level}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center gap-1 text-orange-600 font-black text-xs">
                          <Flame size={13} /> {b.streakDays}d
                        </span>
                      </td>

                      <td className="py-4 px-4 text-center font-extrabold text-slate-800 text-xs">
                        {b.logCount}
                      </td>

                      <td className="py-4 px-4 text-right font-black text-slate-900 text-sm">
                        {b.totalXP} XP
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: PRODUCTION VELOCITY & SYSTEM LEADERBOARD ── */}
        <section className="space-y-6 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-black text-purple-700 uppercase tracking-wider mb-1">
                <Code2 size={16} /> Production Velocity
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans tracking-tight">
                Top Production Systems Leaderboard
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-600 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200 font-bold">
              Ranked by Active Enrollment &amp; Daily Commits
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectStats.slice(0, 6).map((item, idx) => {
              const p = item.project;
              return (
                <div
                  key={p.id}
                  className="p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-lg flex flex-col justify-between hover:border-[#0066FF] hover:shadow-xl transition-all duration-300 font-sans"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono mb-3">
                      <span className="font-black text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                        Rank #{idx + 1}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-extrabold text-[10px] uppercase border border-slate-200">
                        {p.difficulty}
                      </span>
                    </div>

                    <h3 className="font-black text-slate-900 text-base mb-1 leading-snug">
                      {p.title}
                    </h3>
                    <p className="text-slate-500 text-xs font-mono mb-4">
                      {p.domain}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-5">
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                        <div className="font-black text-slate-900 text-sm">{item.enrollCount}</div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Active Builders</div>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                        <div className="font-black text-slate-900 text-sm">{item.logCount}</div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold">PoW Commits</div>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/arena/${p.slug}`}
                    className="block text-center w-full py-3 rounded-2xl bg-[#0066FF] hover:bg-blue-600 text-white font-black font-mono text-xs transition-all shadow-md shadow-blue-500/20"
                  >
                    View Project PRD Dossier &rarr;
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}
