import React from "react";
import Link from "next/link";
import {
  Flame,
  MessageSquare,
  Sparkles,
  Github,
  Calendar,
  Layers,
  ArrowRight,
  Filter,
  CheckCircle2
} from "lucide-react";
import { adminDb } from "@/lib/firebase-admin";

export const revalidate = 60; // 1 minute ISR

export default async function ProgressDiariesPage() {
  let dailyLogs: any[] = [];

  if (adminDb) {
    try {
      const snap = await adminDb
        .collection("arena_daily_logs")
        .orderBy("submittedAt", "desc")
        .limit(30)
        .get();

      if (!snap.empty) {
        dailyLogs = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      }
    } catch (e) {
      console.error("Firestore progress diaries query error:", e);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-20">
      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200">
                <Flame size={14} className="text-emerald-600" /> Community Proof of Work
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900">
                Live Progress Diaries
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm font-mono mt-1">
                Real-time standup stream from students building across the 45-day cohort (14th Sept - Diwali).
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/arena/daily-log"
                className="px-5 py-3 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
              >
                + Post Today's Standup
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Feed Column (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Filter Tabs */}
            <div className="bg-white border border-slate-200 rounded-2xl p-3 flex items-center gap-2 overflow-x-auto text-xs font-mono font-bold">
              <button className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white shadow-xs">
                All Logs
              </button>
              <button className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200">
                Progress Diaries
              </button>
              <button className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200">
                Architecture &amp; Schemas
              </button>
              <button className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200">
                Blockers &amp; Questions
              </button>
            </div>

            {/* Standup Feed Items */}
            {dailyLogs.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center font-mono text-xs text-slate-500">
                <Flame size={32} className="mx-auto text-slate-300 mb-3" />
                <p className="font-bold text-slate-700 text-sm mb-1">Cohort 1 Opens 14th Sept 2026</p>
                <p>Be the first student builder to publish Day 1 proof-of-work on Ganesh Chaturthi!</p>
                <Link
                  href="/arena/daily-log"
                  className="inline-block mt-4 px-4 py-2 rounded-xl bg-[#0066FF] text-white font-bold"
                >
                  Open Daily Standup Portal
                </Link>
              </div>
            ) : (
              dailyLogs.map((log, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs transition-all hover:border-slate-300"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-[#0066FF] font-bold text-sm flex items-center justify-center font-mono">
                        {(log.studentName || log.studentEmail || "B").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/member/${encodeURIComponent(log.studentEmail || "builder")}`}
                            className="font-bold text-slate-900 text-sm hover:text-[#0066FF] transition-colors"
                          >
                            {log.studentName || log.studentEmail?.split("@")[0] || "Student Builder"}
                          </Link>
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-[#0066FF] font-mono text-[10px] font-bold border border-blue-100">
                            Day {log.dayNumber || idx + 1}
                          </span>
                        </div>
                        <p className="text-slate-500 text-[11px] font-mono">
                          {log.projectTitle || "Arena Production System"}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-200">
                        <Flame size={12} /> {log.streakDays || 1}d Streak
                      </span>
                    </div>
                  </div>

                  {/* Task Description */}
                  <div className="space-y-2 mb-4 text-xs font-sans text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div>
                      <span className="font-bold font-mono text-slate-500 text-[11px] uppercase block mb-0.5">
                        What was shipped today:
                      </span>
                      <p>{log.todayTask}</p>
                    </div>

                    {log.tomorrowPlan && (
                      <div className="pt-2 border-t border-slate-200/60">
                        <span className="font-bold font-mono text-slate-500 text-[11px] uppercase block mb-0.5">
                          Tomorrow's Plan:
                        </span>
                        <p className="text-slate-600">{log.tomorrowPlan}</p>
                      </div>
                    )}
                  </div>

                  {/* Commit Proof Footer */}
                  <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-mono pt-3 border-t border-slate-100">
                    {log.githubCommitUrl ? (
                      <a
                        href={log.githubCommitUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0066FF] hover:underline font-bold inline-flex items-center gap-1.5"
                      >
                        <Github size={13} /> View Verified Commit
                      </a>
                    ) : (
                      <span className="text-slate-400">Commit attached</span>
                    )}

                    <div className="flex items-center gap-4 text-slate-500 text-[11px]">
                      <span className="text-slate-400">
                        {log.submittedAt?.toDate?.() ? log.submittedAt.toDate().toLocaleDateString() : "Today"}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}

          </div>

          {/* Right Sidebar: Guidelines & Office Hours Info (1 col) */}
          <div className="space-y-6">
            
            {/* Saturday Indore & Virtual Office Hours */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0066FF] uppercase mb-2">
                <Calendar size={14} /> Weekly Office Hours
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Every Saturday 5:00 PM – 7:00 PM
              </h3>
              <p className="text-xs text-slate-600 font-mono leading-relaxed mb-4">
                In-person architecture teardowns at Indore Hub + Virtual Discord Stage for all builders.
              </p>
              <Link
                href="/arena/calendar"
                className="block text-center w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold transition-all"
              >
                View Community Calendar →
              </Link>
            </div>

            {/* Daily Proof of Work Rules */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs text-xs font-mono">
              <h3 className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-[11px] text-slate-500">
                PoW Standup Checklist
              </h3>
              <ul className="space-y-2.5 text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>Attach active GitHub PR or commit SHA.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>Share blocker or architectural lesson.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>Maintain daily streak for Level 10 Shipper rank.</span>
                </li>
              </ul>
            </div>

            {/* Project Leaderboard Link */}
            <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl p-6 shadow-md border border-blue-800">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold mb-2">
                <Sparkles size={14} /> Dual Leaderboards
              </div>
              <p className="text-xs text-blue-200 leading-relaxed font-mono mb-4">
                Track top student builders by verified commits and see the most shipped projects in Cohort 1.
              </p>
              <Link
                href="/arena/leaderboard"
                className="block text-center w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold font-mono text-xs transition-all"
              >
                Open Dual Leaderboards
              </Link>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
