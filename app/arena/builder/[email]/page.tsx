import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Trophy,
  Rocket,
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
  Clock
} from "lucide-react";
import { adminDb } from "@/lib/firebase-admin";
import { ARENA_PROJECTS } from "@/lib/arena-projects";

interface Props {
  params: Promise<{ email: string }>;
}

export default async function BuilderProfilePage({ params }: Props) {
  const { email } = await params;
  const decodedEmail = decodeURIComponent(email).toLowerCase().trim();

  let enrollments: any[] = [];
  let dailyLogs: any[] = [];

  if (adminDb) {
    try {
      const enrollSnap = await adminDb
        .collection("arena_enrollments")
        .where("email", "==", decodedEmail)
        .get();

      if (!enrollSnap.empty) {
        enrollments = enrollSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      }

      const logsSnap = await adminDb
        .collection("arena_daily_logs")
        .where("studentEmail", "==", decodedEmail)
        .orderBy("submittedAt", "desc")
        .get();

      if (!logsSnap.empty) {
        dailyLogs = logsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      }
    } catch (e) {
      console.error("Firestore builder profile error:", e);
    }
  }

  const studentName = enrollments[0]?.name || "Arena Builder";
  const distinctProjectIds = Array.from(new Set(enrollments.map((e) => e.projectId)));
  const totalProjects = distinctProjectIds.length;
  const maxStreak = Math.max(...enrollments.map((e) => e.streak || 0), dailyLogs.length, 0);

  let tier = "Explorer";
  if (totalProjects >= 3) {
    tier = "Elite Shipper";
  } else if (totalProjects >= 1) {
    tier = "Production Builder";
  }

  const isGTH = enrollments.some((e) => e.difficulty === "Expert Tier" || e.difficulty === "Go To Hell 💀" || e.projectId === "p10" || e.projectId === "p40" || e.projectId === "p50");
  if (isGTH) {
    tier = "Expert Shipper";
  }

  return (
    <div className="bg-[#FAFCFF] min-h-screen text-slate-900 selection:bg-[#0066FF] selection:text-white pt-24 pb-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link
          href="/arena"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-500 hover:text-[#0066FF] transition-colors mb-6"
        >
          <ArrowLeft size={14} /> Back to Arena
        </Link>

        {/* Profile Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm mb-8">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{studentName}</h1>
                <span className="px-3 py-1 rounded-full bg-blue-50 text-[#0066FF] border border-blue-200 font-mono text-xs font-bold">
                  {tier}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-500">{decodedEmail}</p>

              {/* Social Links */}
              <div className="flex items-center gap-3 mt-3">
                {enrollments[0]?.github && (
                  <a
                    href={enrollments[0].github.startsWith("http") ? enrollments[0].github : `https://${enrollments[0].github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:text-[#0066FF] transition-colors text-xs font-mono flex items-center gap-1"
                  >
                    <Github size={14} /> <span>GitHub</span>
                  </a>
                )}
                {enrollments[0]?.linkedin && (
                  <a
                    href={enrollments[0].linkedin.startsWith("http") ? enrollments[0].linkedin : `https://${enrollments[0].linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-blue-50 text-[#0A66C2] hover:bg-blue-100 transition-colors text-xs font-mono flex items-center gap-1"
                  >
                    <Linkedin size={14} /> <span>LinkedIn</span>
                  </a>
                )}
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-xl font-bold text-slate-900 font-mono">{totalProjects}</div>
                <div className="text-[11px] font-mono text-slate-500">Shipped Projects</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-xl font-bold text-emerald-600 font-mono">🔥 {maxStreak}d</div>
                <div className="text-[11px] font-mono text-slate-500">Active Streak</div>
              </div>
            </div>
          </div>

          {/* Referral Unlock Banner */}
          <div className="mt-6 p-5 rounded-2xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono font-bold text-[#0066FF] uppercase mb-1">
                {totalProjects >= 3 ? "Milestone Unlocked!" : "3-Project Milestone Progress"}
              </div>
              <div className="text-sm font-bold text-slate-900">
                {totalProjects >= 3
                  ? "Eligible for Founder Code Audit & LinkedIn Recommendation."
                  : `${totalProjects} / 3 Projects Completed. Complete ${3 - totalProjects} more to unlock milestone recognition!`}
              </div>
            </div>
            {totalProjects >= 3 ? (
              <Link
                href="/profile"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold uppercase tracking-wider transition-all whitespace-nowrap shadow-xs"
              >
                View Profile ↗
              </Link>
            ) : (
              <Link
                href="/arena"
                className="px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all whitespace-nowrap shadow-xs"
              >
                Enroll Next Project
              </Link>
            )}
          </div>

        </div>

        {/* Shipped Projects List */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm mb-8">
          <h2 className="text-base font-bold text-slate-900 mb-4 font-mono uppercase tracking-wider flex items-center gap-2">
            <Layers size={16} className="text-[#0066FF]" />
            <span>Enrolled &amp; Shipped Projects ({distinctProjectIds.length}):</span>
          </h2>

          <div className="space-y-4">
            {distinctProjectIds.length === 0 ? (
              <div className="py-8 text-center text-slate-400 font-mono text-xs">
                No active projects found for this builder profile.
              </div>
            ) : (
              distinctProjectIds.map((pId) => {
                const project = ARENA_PROJECTS.find((p) => p.id === pId) || {
                  id: pId,
                  slug: pId,
                  title: "Arena Production System",
                  difficulty: "Hard",
                  domain: "AI & Fullstack",
                  tagline: "High-scale engineering project.",
                  techStack: ["FastAPI", "PostgreSQL"],
                };
                const enroll = enrollments.find((e) => e.projectId === pId);
                const logs = dailyLogs.filter((l) => l.projectId === pId);

                return (
                  <div key={pId} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-[#0066FF] font-bold text-[10px]">
                          {project.difficulty}
                        </span>
                        <h3 className="font-bold text-slate-900 text-sm">{project.title}</h3>
                      </div>
                      <p className="text-slate-600 text-[11px] mb-2">{project.tagline}</p>
                      <div className="text-slate-500 text-[11px]">
                        Role: <strong>{enroll?.role || "Developer"}</strong> • Mode: <strong>{enroll?.teamType || "Solo"}</strong> • <strong>{logs.length}</strong> Daily PoW Logs
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/arena/${project.slug || pId}`}
                        className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold hover:bg-slate-100"
                      >
                        View Spec
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Daily Standups Stream */}
        {dailyLogs.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-4 font-mono uppercase tracking-wider flex items-center gap-2">
              <Terminal size={16} className="text-emerald-600" />
              <span>Verifiable Daily Commits &amp; Standups ({dailyLogs.length}):</span>
            </h2>

            <div className="space-y-3">
              {dailyLogs.slice(0, 10).map((log) => (
                <div key={log.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs">
                  <div>
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px]">Day {log.dayNumber}</span>
                      <span>{log.projectTitle}</span>
                    </div>
                    <p className="text-slate-600 mt-1 text-[11px] line-clamp-1">{log.researchNotes}</p>
                  </div>
                  <a
                    href={log.commitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0066FF] hover:underline font-bold inline-flex items-center gap-1 text-[11px] shrink-0"
                  >
                    <span>Commit Proof</span> <ExternalLink size={12} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
