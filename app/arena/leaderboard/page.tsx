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
  CheckCircle2
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
      console.error("Firestore leaderboard error:", e);
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
        role: e.role || "Developer",
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

  const rankedBuilders = Object.values(builderMap).sort((a, b) => b.totalXP - a.totalXP);

  // Aggregate Project Leaderboard
  const projectStats = ARENA_PROJECTS.map((proj) => {
    const enrollCount = enrollments.filter((e) => e.projectId === proj.id).length;
    const logCount = dailyLogs.filter((l) => l.projectId === proj.id).length;
    const shippingScore = enrollCount * 50 + logCount * 20;

    return {
      project: proj,
      enrollCount,
      logCount,
      shippingScore
    };
  }).sort((a, b) => b.shippingScore - a.shippingScore);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-20">
      {/* Top Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-800 font-mono text-xs font-bold uppercase tracking-wider mb-2 border border-amber-200">
                <Trophy size={14} className="text-amber-600" /> Official Cohort 1 Rankings
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900">
                Dual Arena Leaderboards
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm font-mono mt-1">
                45-Day Performance: Top Student Builders &amp; Most Active Production Systems (14th Sept - Diwali).
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/arena/progress"
                className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-xs font-bold uppercase tracking-wider transition-all border border-slate-200"
              >
                View Live Standup Feed
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 space-y-12">
        
        {/* ── SECTION 1: TOP BUILDERS LEADERBOARD ── */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0066FF] uppercase mb-1">
                <Flame size={14} /> Student Builders Hall of Fame
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                45-Day Builders Leaderboard ({rankedBuilders.length})
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              Ranked by Verified XP (100 XP / Log • 500 XP / Project)
            </span>
          </div>

          {rankedBuilders.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center font-mono text-xs text-slate-500">
              Leaderboard officially kicks off with Day 1 submissions on 14th Sept (Ganesh Chaturthi).
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 text-[11px] uppercase">
                    <th className="pb-3 px-3">Rank</th>
                    <th className="pb-3 px-3">Builder</th>
                    <th className="pb-3 px-3">Role &amp; College</th>
                    <th className="pb-3 px-3 text-center">Level</th>
                    <th className="pb-3 px-3 text-center">Daily Streak</th>
                    <th className="pb-3 px-3 text-center">Standups</th>
                    <th className="pb-3 px-3 text-right">Total XP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rankedBuilders.map((b, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-3 font-bold">
                        {idx === 0 ? (
                          <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs shadow-xs">1</span>
                        ) : idx === 1 ? (
                          <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-900 flex items-center justify-center font-bold text-xs">2</span>
                        ) : idx === 2 ? (
                          <span className="w-6 h-6 rounded-full bg-amber-700 text-white flex items-center justify-center font-bold text-xs">3</span>
                        ) : (
                          <span className="text-slate-500 pl-2">#{idx + 1}</span>
                        )}
                      </td>
                      <td className="py-4 px-3">
                        <Link
                          href={`/member/${encodeURIComponent(b.email)}`}
                          className="font-bold text-slate-900 hover:text-[#0066FF] flex items-center gap-1.5"
                        >
                          <span>{b.name}</span>
                          <ShieldCheck size={13} className="text-[#0066FF]" />
                        </Link>
                        {b.githubUsername && (
                          <span className="text-[11px] text-slate-400">@{b.githubUsername}</span>
                        )}
                      </td>
                      <td className="py-4 px-3 text-slate-600">
                        <div>{b.role}</div>
                        <div className="text-[10px] text-slate-400">{b.college}</div>
                      </td>
                      <td className="py-4 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#0066FF] font-bold text-[11px] border border-blue-100">
                          Lvl {b.level}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-center">
                        <span className="inline-flex items-center gap-1 text-orange-600 font-bold">
                          <Flame size={12} /> {b.streakDays}d
                        </span>
                      </td>
                      <td className="py-4 px-3 text-center text-slate-700 font-bold">
                        {b.logCount}
                      </td>
                      <td className="py-4 px-3 text-right font-bold text-slate-900 text-sm">
                        {b.totalXP}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ── SECTION 2: PROJECTS SHIPPING LEADERBOARD ── */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-700 uppercase mb-1">
                <Code2 size={14} /> Production Velocity
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Top Production Systems Leaderboard
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              Ranked by Active Enrollment &amp; Daily Commits
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectStats.slice(0, 6).map((item, idx) => {
              const p = item.project;
              return (
                <div
                  key={p.id}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono mb-2">
                      <span className="font-bold text-purple-700">Rank #{idx + 1}</span>
                      <span className="px-2 py-0.5 rounded bg-white text-slate-700 font-bold border border-slate-200 text-[10px]">
                        {p.difficulty}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm mb-1 leading-snug">
                      {p.title}
                    </h3>
                    <p className="text-slate-500 text-[11px] font-mono mb-3">
                      {p.domain}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-4">
                      <div className="p-2 rounded-xl bg-white border border-slate-200">
                        <div className="font-bold text-slate-900">{item.enrollCount}</div>
                        <div className="text-[10px] text-slate-400">Builders</div>
                      </div>
                      <div className="p-2 rounded-xl bg-white border border-slate-200">
                        <div className="font-bold text-slate-900">{item.logCount}</div>
                        <div className="text-[10px] text-slate-400">PoW Commits</div>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/arena/${p.slug}`}
                    className="block text-center w-full py-2 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold font-mono text-xs hover:bg-slate-100 transition-all"
                  >
                    View Project Dossier →
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
