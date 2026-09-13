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
  CheckCircle2,
  Activity,
  ShieldCheck,
  Award
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
      console.warn("Firestore progress diaries query info:", e instanceof Error ? e.message : e);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 font-sans selection:bg-[#0066FF] selection:text-white">
      
      {/* ── HERO HEADER BANNER ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-850 to-blue-950 text-white pt-24 pb-16 border-b-2 border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-black border border-emerald-400/30 backdrop-blur-md">
                <Flame size={14} className="text-emerald-400 animate-pulse" />
                <span>COMMUNITY PROOF-OF-WORK FEED</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-sans leading-tight">
                Live Public <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent">Progress Diaries</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
                Real-time standup stream &amp; GitHub commit audit log from student builders across the 45-day virtual cohort.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/arena/daily-log"
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#0066FF] to-blue-600 hover:from-blue-700 hover:to-blue-600 text-white font-mono text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2 border border-blue-400/30"
              >
                <span>+ Post Today's Standup</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ── MAIN FEED COLUMN (8 COLS) ── */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Filter Tabs Header */}
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-2 flex items-center gap-2 overflow-x-auto text-xs font-mono font-bold shadow-sm">
              <button className="px-4 py-2 rounded-xl bg-[#0066FF] text-white shadow-sm font-black">
                All Logs ({dailyLogs.length})
              </button>
              <button className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                PoW Standups
              </button>
              <button className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                Architecture &amp; Schemas
              </button>
              <button className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                Blockers &amp; Help
              </button>
            </div>

            {/* Standup Feed Items */}
            {dailyLogs.length === 0 ? (
              <div className="bg-white border-2 border-slate-200 rounded-3xl p-12 text-center font-sans space-y-4 shadow-lg">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-200">
                  <Flame size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Cohort 1 Standup Stream Open</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 font-mono">
                    Be the first student builder to publish Day 1 proof-of-work log!
                  </p>
                </div>
                <Link
                  href="/arena/daily-log"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0066FF] text-white font-mono text-xs font-black uppercase shadow-md"
                >
                  <span>Open Standup Portal &rarr;</span>
                </Link>
              </div>
            ) : (
              dailyLogs.map((log, idx) => (
                <div
                  key={idx}
                  className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-7 shadow-lg transition-all duration-300 hover:border-[#0066FF] space-y-4 font-sans"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0066FF] to-blue-500 text-white font-black text-base flex items-center justify-center font-mono shadow-md border border-blue-400/40">
                        {(log.studentName || log.studentEmail || "B").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/member/${encodeURIComponent(log.studentEmail || "builder")}`}
                            className="font-black text-slate-900 text-base hover:text-[#0066FF] transition-colors flex items-center gap-1.5"
                          >
                            <span>{log.studentName || log.studentEmail?.split("@")[0] || "Student Builder"}</span>
                            <ShieldCheck size={16} className="text-[#0066FF]" />
                          </Link>
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0066FF] font-mono text-[10px] font-extrabold border border-blue-200">
                            Day {log.dayNumber || idx + 1}
                          </span>
                        </div>
                        <p className="text-slate-500 text-xs font-mono font-medium mt-0.5">
                          {log.projectTitle || "Arena Production System"}
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1.5 text-xs font-mono font-black text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200 shadow-2xs">
                      <Flame size={13} /> {log.streakDays || 1}d Streak
                    </span>
                  </div>

                  {/* Task Description Card */}
                  <div className="space-y-3 text-xs font-sans text-slate-800 leading-relaxed bg-slate-50 p-4.5 rounded-2xl border border-slate-200">
                    <div>
                      <span className="font-black font-mono text-slate-500 text-[10px] uppercase tracking-wider block mb-1">
                        What was shipped today:
                      </span>
                      <p className="font-medium text-slate-900 leading-relaxed text-sm">{log.todayTask}</p>
                    </div>

                    {log.tomorrowPlan && (
                      <div className="pt-2.5 border-t border-slate-200">
                        <span className="font-black font-mono text-slate-500 text-[10px] uppercase tracking-wider block mb-1">
                          Tomorrow's Plan:
                        </span>
                        <p className="text-slate-600 font-medium">{log.tomorrowPlan}</p>
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
                        <Github size={15} /> View Verified GitHub Commit &rarr;
                      </a>
                    ) : (
                      <span className="text-slate-400 flex items-center gap-1">
                        <CheckCircle2 size={13} className="text-emerald-500" /> PoW Verified
                      </span>
                    )}

                    <span className="text-slate-400 font-medium">
                      {log.submittedAt?.toDate?.() ? log.submittedAt.toDate().toLocaleDateString() : "Live Today"}
                    </span>
                  </div>
                </div>
              ))
            )}

          </div>

          {/* ── RIGHT SIDEBAR (4 COLS) ── */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Saturday Indore & Virtual Office Hours */}
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-xl space-y-3 font-sans">
              <div className="flex items-center gap-2 text-xs font-mono font-black text-[#0066FF] uppercase tracking-wider">
                <Calendar size={15} /> Weekly Office Hours
              </div>
              <h3 className="text-base font-black text-slate-900">
                Every Saturday 5:00 PM – 7:00 PM
              </h3>
              <p className="text-xs text-slate-600 font-mono leading-relaxed">
                In-person architecture teardowns at Indore Hub + Virtual Discord Stage for all builders.
              </p>
              <Link
                href="/arena/calendar"
                className="block text-center w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold transition-all shadow-md"
              >
                View Community Calendar &rarr;
              </Link>
            </div>

            {/* Daily Proof of Work Rules */}
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-xl space-y-3 font-sans">
              <h3 className="font-black text-slate-900 uppercase tracking-wider text-xs font-mono text-slate-500 border-b border-slate-100 pb-2">
                PoW Standup Checklist
              </h3>
              <ul className="space-y-3 text-xs text-slate-700 font-medium">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>Attach active GitHub PR or commit SHA.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>Share blocker or architectural lesson learned.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>Maintain daily streak for Level 10 Shipper rank.</span>
                </li>
              </ul>
            </div>

            {/* Dual Leaderboard Link */}
            <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-2xl border-2 border-blue-500/30 space-y-3 font-sans">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-black uppercase tracking-wider">
                <Award size={16} /> Dual Leaderboards
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Track top student builders by verified commits and see the most shipped projects in Cohort 1.
              </p>
              <Link
                href="/arena/leaderboard"
                className="block text-center w-full py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-mono text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-amber-400/20"
              >
                Open Dual Leaderboards &rarr;
              </Link>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
