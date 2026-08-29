import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Trophy,
  Flame,
  CheckCircle2,
  Github,
  Linkedin,
  Terminal,
  Layers,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  Code2,
  Calendar,
  MessageCircle,
  UserPlus,
  Share2,
  Sparkles,
  Award
} from "lucide-react";
import { adminDb } from "@/lib/firebase-admin";
import { ARENA_PROJECTS } from "@/lib/arena-projects";

interface Props {
  params: Promise<{ username: string }>;
}

export default async function MemberProfilePage({ params }: Props) {
  const { username } = await params;
  const decodedParam = decodeURIComponent(username).toLowerCase().trim();

  let enrollments: any[] = [];
  let dailyLogs: any[] = [];

  if (adminDb) {
    try {
      // Look up by email or username
      const isEmail = decodedParam.includes("@");
      let enrollSnap;
      if (isEmail) {
        enrollSnap = await adminDb
          .collection("arena_enrollments")
          .where("email", "==", decodedParam)
          .get();
      } else {
        enrollSnap = await adminDb
          .collection("arena_enrollments")
          .where("githubUsername", "==", decodedParam)
          .get();
      }

      if (!enrollSnap.empty) {
        enrollments = enrollSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const studentEmail = enrollments[0]?.email;

        if (studentEmail) {
          const logsSnap = await adminDb
            .collection("arena_daily_logs")
            .where("studentEmail", "==", studentEmail)
            .orderBy("submittedAt", "desc")
            .get();

          if (!logsSnap.empty) {
            dailyLogs = logsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          }
        }
      }
    } catch (e) {
      console.error("Firestore member profile query error:", e);
    }
  }

  const primaryEnrollment = enrollments[0];
  const displayName = primaryEnrollment?.name || decodedParam.split("@")[0].toUpperCase();
  const displayHandle = primaryEnrollment?.githubUsername || decodedParam.split("@")[0];
  const role = primaryEnrollment?.role || "Software Engineering Student";
  const college = primaryEnrollment?.college || "Engineering College";
  const bio = primaryEnrollment?.bio || `Student Builder specializing in production software engineering. Shipping across the 45-day Botmartz Cohort (14th Sept - Diwali).`;

  // XP and Level Calculation
  const totalLogsCount = dailyLogs.length;
  const distinctProjects = Array.from(new Set(enrollments.map((e) => e.projectId)));
  const totalProjectsCount = distinctProjects.length;

  const totalXP = totalLogsCount * 100 + totalProjectsCount * 500;
  const level = Math.min(Math.floor(totalXP / 300) + 1, 10);
  const xpCurrentLevel = totalXP % 300;
  const xpNeeded = 300 - xpCurrentLevel;

  // Generate 7x10 Contribution Grid (70 days window)
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeks = Array.from({ length: 10 }, (_, wIdx) => {
    return Array.from({ length: 7 }, (_, dIdx) => {
      const dayIndex = wIdx * 7 + dIdx;
      // Correlate with log counts
      const hasLog = dayIndex < totalLogsCount;
      const count = hasLog ? (dayIndex % 3 === 0 ? 3 : 1) : 0;
      return { dayIndex, count };
    });
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-20">
      {/* Top Header Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/arena"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-600 hover:text-[#0066FF] transition-colors"
          >
            <ArrowLeft size={14} /> Back to Arena
          </Link>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span>Cohort 1 (14 Sept - Diwali)</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
              Verified Student
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ── LEFT COLUMN: Profile Header & Contribution Wall (2 cols) ── */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Main Skool-Style Profile Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                
                <div className="flex items-center gap-5">
                  {/* Avatar with Level Ring */}
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-md border-4 border-white">
                      {displayName.charAt(0)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-[#0066FF] text-white font-mono text-[11px] font-bold shadow-xs border-2 border-white">
                      Lvl {level}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-bold text-slate-900">{displayName}</h1>
                      <ShieldCheck size={18} className="text-[#0066FF]" />
                    </div>
                    <p className="text-xs font-mono text-slate-500 mb-1">@{displayHandle}</p>
                    <p className="text-xs font-bold text-slate-700">{role} • {college}</p>
                  </div>
                </div>

                {/* Profile Action Buttons */}
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold font-mono text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer">
                    <UserPlus size={14} /> Follow
                  </button>
                  <Link
                    href={`/discussions?author=${displayHandle}`}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold font-mono text-xs transition-all flex items-center justify-center gap-1.5 border border-slate-200"
                  >
                    <MessageCircle size={14} /> Chat
                  </Link>
                </div>
              </div>

              {/* Bio & Social Links */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <p className="text-xs text-slate-600 leading-relaxed font-sans mb-4">
                  {bio}
                </p>
                <div className="flex items-center gap-3 text-xs font-mono">
                  {primaryEnrollment?.githubUsername && (
                    <a
                      href={`https://github.com/${primaryEnrollment.githubUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-slate-700 hover:text-slate-950 font-bold"
                    >
                      <Github size={14} /> GitHub
                    </a>
                  )}
                  {primaryEnrollment?.linkedinUrl && (
                    <a
                      href={primaryEnrollment.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[#0066FF] hover:underline font-bold"
                    >
                      <Linkedin size={14} /> LinkedIn
                    </a>
                  )}
                </div>
              </div>

              {/* XP Level Progress Bar */}
              <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-700 mb-2">
                  <div className="flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-500" />
                    <span>Level {level} Builder</span>
                  </div>
                  <span className="text-slate-500">{xpNeeded} XP to Level {level + 1}</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${(xpCurrentLevel / 300) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Skool-Style Activity Heatmap */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">45-Day Proof-of-Work Activity</h2>
                  <p className="text-xs text-slate-500 font-mono">Daily code commits, research standups &amp; architectural logs</p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  {totalLogsCount} Contributions
                </span>
              </div>

              {/* Heatmap Matrix */}
              <div className="overflow-x-auto pb-2">
                <div className="inline-block">
                  <div className="grid grid-flow-col grid-rows-7 gap-1.5 p-2 bg-slate-50 rounded-2xl border border-slate-200">
                    {weeks.flatMap((w) =>
                      w.map((d, idx) => (
                        <div
                          key={`${d.dayIndex}-${idx}`}
                          title={`Day ${d.dayIndex + 1}: ${d.count} contributions`}
                          className={`w-4 h-4 rounded-sm transition-all ${
                            d.count === 0
                              ? "bg-slate-200/80"
                              : d.count === 1
                              ? "bg-emerald-300"
                              : d.count === 2
                              ? "bg-emerald-500"
                              : "bg-emerald-700 shadow-xs"
                          }`}
                        />
                      ))
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-2 px-1">
                    <span>Sep (Cohort Start)</span>
                    <span>Oct (Navratri)</span>
                    <span>Nov (Diwali Finale)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contributions Stream Feed */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-bold text-slate-900">
                  Daily Contributions Feed ({dailyLogs.length})
                </h2>
                <Link
                  href="/arena/daily-log"
                  className="text-xs font-mono font-bold text-[#0066FF] hover:underline"
                >
                  + Log Today's Standup
                </Link>
              </div>

              {dailyLogs.length === 0 ? (
                <div className="text-center py-10 text-slate-400 font-mono text-xs border border-dashed border-slate-200 rounded-2xl">
                  No standups logged yet. First daily proof-of-work opens 14th Sept.
                </div>
              ) : (
                <div className="space-y-4">
                  {dailyLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-blue-100 text-[#0066FF] font-bold">
                            Day {log.dayNumber || idx + 1}
                          </span>
                          <span className="font-bold text-slate-800">{log.projectTitle || "Arena Project"}</span>
                        </div>
                        <span className="text-slate-400 text-[10px]">
                          {log.submittedAt?.toDate?.() ? log.submittedAt.toDate().toLocaleDateString() : "Recent"}
                        </span>
                      </div>

                      <p className="text-slate-700 font-sans text-xs mb-3 leading-relaxed">
                        {log.todayTask}
                      </p>

                      <div className="flex items-center justify-between flex-wrap gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                        {log.githubCommitUrl && (
                          <a
                            href={log.githubCommitUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#0066FF] hover:underline font-bold inline-flex items-center gap-1"
                          >
                            <Github size={12} /> View Commit Proof
                          </a>
                        )}
                        <span>Streak: <strong>{log.streakDays || 1} 🔥</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* ── RIGHT COLUMN: Associated Projects & Stats (1 col) ── */}
          <div className="space-y-6">
            
            {/* Stat Counters */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
              <h3 className="text-xs font-mono font-bold uppercase text-slate-500 mb-4 tracking-wider">
                Builder Performance Metrics
              </h3>
              <div className="grid grid-cols-2 gap-4 font-mono">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-2xl font-bold text-slate-900">{totalLogsCount}</div>
                  <div className="text-[11px] text-slate-500">PoW Standups</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-2xl font-bold text-emerald-700">{totalProjectsCount}</div>
                  <div className="text-[11px] text-slate-500">Active Projects</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-2xl font-bold text-amber-600">{totalXP}</div>
                  <div className="text-[11px] text-slate-500">Total XP</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-2xl font-bold text-purple-600">Lvl {level}</div>
                  <div className="text-[11px] text-slate-500">Builder Tier</div>
                </div>
              </div>
            </div>

            {/* Associated Projects & Squads */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
              <h3 className="text-xs font-mono font-bold uppercase text-slate-500 mb-4 tracking-wider">
                Associated Projects ({distinctProjects.length})
              </h3>

              {distinctProjects.length === 0 ? (
                <div className="text-slate-400 font-mono text-xs py-4 text-center">
                  No active project enrollments.
                </div>
              ) : (
                <div className="space-y-3">
                  {distinctProjects.map((pId) => {
                    const project = ARENA_PROJECTS.find((p) => p.id === pId) || {
                      title: "Production System",
                      slug: pId,
                      difficulty: "Hard",
                      domain: "Frontier Engineering"
                    };
                    const enrollment = enrollments.find((e) => e.projectId === pId);

                    return (
                      <div
                        key={pId}
                        className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="px-2 py-0.5 rounded bg-blue-100 text-[#0066FF] font-bold text-[10px]">
                            {project.difficulty}
                          </span>
                          <span className="text-slate-400 text-[10px]">{enrollment?.teamType || "Solo"}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-xs mb-1">{project.title}</h4>
                        <div className="text-[11px] text-slate-500 flex items-center justify-between mt-2">
                          <span>Role: <strong>{enrollment?.role || "Developer"}</strong></span>
                          <Link
                            href={`/arena/${project.slug}`}
                            className="text-[#0066FF] font-bold hover:underline"
                          >
                            View Specs →
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Shippers Circle 15-Company Referral Status */}
            <div className="bg-gradient-to-br from-purple-900 to-slate-900 text-white rounded-3xl p-6 shadow-md border border-purple-800">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold mb-2">
                <Trophy size={15} /> 15-Company Referral Pipeline
              </div>
              <p className="text-xs text-purple-200 leading-relaxed font-mono mb-4">
                Complete 3 production projects to unlock 15 direct company introductions &amp; a personal LinkedIn recommendation from Founder Soham Sharma.
              </p>
              <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-700/60 font-mono text-xs mb-4 flex items-center justify-between">
                <span>Progress:</span>
                <span className="font-bold text-amber-300">{distinctProjects.length} / 3 Projects</span>
              </div>
              <Link
                href="/arena/shippers"
                className="block text-center w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold font-mono text-xs transition-all"
              >
                Shippers Circle Details
              </Link>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
