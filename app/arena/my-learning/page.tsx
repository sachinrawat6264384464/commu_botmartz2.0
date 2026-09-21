"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Coins,
  Flame,
  KanbanSquare,
  Layers,
  Lock,
  Sparkles,
  Terminal,
  Trophy,
  User,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  ExternalLink,
  Github,
  Calendar,
  Zap,
  Check,
  Activity,
  Award,
  Compass,
  Code2,
  ChevronRight
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { ARENA_PROJECTS } from "@/lib/arena-projects";

export default function MyLearningPage() {
  const { user, studentProfile, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"projects" | "matrix" | "certificates" | "logs">("projects");

  // Instant 0ms State initialization from localStorage cache
  const [enrollments, setEnrollments] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("botmartz_user_enrollments");
        return cached ? JSON.parse(cached) : [];
      } catch (e) {}
    }
    return [];
  });

  const [dailyLogs, setDailyLogs] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("botmartz_user_logs");
        return cached ? JSON.parse(cached) : [];
      } catch (e) {}
    }
    return [];
  });

  const [loading, setLoading] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("botmartz_user_enrollments");
      if (cached) return false;
    }
    return true;
  });

  const fetchUserData = async (userEmail: string) => {
    try {
      const [enrollRes, logsRes] = await Promise.all([
        fetch(`/api/arena/enroll?email=${encodeURIComponent(userEmail)}`),
        fetch(`/api/arena/daily-log?email=${encodeURIComponent(userEmail)}`)
      ]);
      const enrollData = await enrollRes.json();
      const logsData = await logsRes.json();

      if (enrollData.success && Array.isArray(enrollData.enrollments)) {
        setEnrollments(enrollData.enrollments);
        try {
          localStorage.setItem("botmartz_user_enrollments", JSON.stringify(enrollData.enrollments));
        } catch (e) {}
      }
      if (logsData.success && Array.isArray(logsData.logs)) {
        setDailyLogs(logsData.logs);
        try {
          localStorage.setItem("botmartz_user_logs", JSON.stringify(logsData.logs));
        } catch (e) {}
      }
    } catch (e) {
      console.warn("Failed to load user learning data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchUserData(user.email);
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user?.email, authLoading]);

  const activeEnrollments = enrollments.filter(
    (e) => e.status !== "Completed" && e.status !== "Finished" && e.status !== "Cancelled" && e.status !== "Unenrolled"
  );
  const completedEnrollments = enrollments.filter(
    (e) => e.status === "Completed" || e.status === "Finished"
  );

  // Compute stats HUD numbers
  const totalKarma = (studentProfile as any)?.karmaCoins || 100;
  const currentProject = activeEnrollments[0];
  const projectLogs = currentProject ? dailyLogs.filter((l) => l.projectId === currentProject.projectId) : [];
  const uniqueDaysLogged = new Set(projectLogs.map((l) => l.dayNumber)).size;
  const lastDay = currentProject?.lastDayLogged || uniqueDaysLogged || currentProject?.streak || 0;
  const currentCompletedDays = Math.min(45, Math.max(lastDay, uniqueDaysLogged));
  const currentProgressPct = Math.min(100, Math.round((currentCompletedDays / 45) * 100));

  return (
    <div className="bg-[#FAFCFF] min-h-screen text-slate-900 pt-16 sm:pt-20 pb-20 font-sans selection:bg-[#0066FF] selection:text-white">
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 space-y-6">
        
        {/* =========================================================================
            DARK GRADIENT HERO BANNER & HUD METRICS STRIP (Tight Top Gap)
        ========================================================================= */}
        <div className="relative rounded-3xl bg-gradient-to-r from-slate-950 via-[#0B1528] to-slate-950 border border-slate-800/80 p-6 sm:p-8 text-white shadow-2xl overflow-hidden">
          {/* Ambient Lighting Orbs */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            
            {/* Top Bar: Title & Primary CTA */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider border border-cyan-500/30 backdrop-blur-xs">
                  <Terminal size={14} className="text-cyan-400" />
                  <span>Candidate Production Command Center</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-cyan-400 tracking-tight font-sans flex items-center gap-3">
                  <span>My Learning &amp; Proof-of-Work</span>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Live Session
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 font-mono max-w-3xl leading-relaxed">
                  Track enrolled production engineering PRDs, submit daily GitHub commits, view your 45-day streak heatmap, and claim cryptographically verified credentials.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Link
                  href="/arena/daily-log"
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#0066FF] via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-mono text-xs font-black transition-all shadow-lg shadow-blue-500/25 border border-blue-400/30 flex items-center gap-2"
                >
                  <Terminal size={16} />
                  <span>Log Today&apos;s Commit &rarr;</span>
                </Link>
                <Link
                  href="/arena"
                  className="px-5 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-mono text-xs font-bold transition-all flex items-center gap-2"
                >
                  <Compass size={16} className="text-cyan-400" />
                  <span>Catalog</span>
                </Link>
              </div>
            </div>

            {/* HUD Metrics Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
              
              {/* Metric 1: Active Track */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
                  <Layers size={13} className="text-[#0066FF]" />
                  <span>Active Enrolled</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-white font-sans">
                  {activeEnrollments.length} <span className="text-xs text-slate-400 font-mono font-normal">Systems</span>
                </div>
              </div>

              {/* Metric 2: 45-Day Progress */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
                  <Flame size={13} className="text-amber-400" />
                  <span>45-Day Sprint</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-amber-300 font-sans flex items-center gap-2">
                  <span>Day {currentCompletedDays}/45</span>
                  <span className="text-xs text-cyan-400 font-mono">({currentProgressPct}%)</span>
                </div>
              </div>

              {/* Metric 3: Karma Wallet */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
                  <Coins size={13} className="text-amber-400" />
                  <span>Karma Balance</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-amber-400 font-sans">
                  {totalKarma} <span className="text-xs text-amber-300/70 font-mono font-normal">Coins</span>
                </div>
              </div>

              {/* Metric 4: Completed Passes */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
                  <Trophy size={13} className="text-emerald-400" />
                  <span>Certificates</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-emerald-400 font-sans">
                  {completedEnrollments.length} <span className="text-xs text-slate-400 font-mono font-normal">Passed</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* =========================================================================
            CLEAN LIGHT INTERACTIVE TAB NAVIGATION STRIP
        ========================================================================= */}
        <div className="flex items-center gap-2 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto font-mono text-xs shadow-xs">
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === "projects"
                ? "bg-[#0066FF] text-white shadow-md shadow-blue-500/20 font-extrabold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
            }`}
          >
            <Layers size={14} />
            <span>Active Enrolled Systems ({activeEnrollments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("matrix")}
            className={`px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === "matrix"
                ? "bg-[#0066FF] text-white shadow-md shadow-blue-500/20 font-extrabold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
            }`}
          >
            <Calendar size={14} />
            <span>45-Day Proof-of-Work Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab("certificates")}
            className={`px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === "certificates"
                ? "bg-[#0066FF] text-white shadow-md shadow-blue-500/20 font-extrabold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
            }`}
          >
            <Trophy size={14} />
            <span>Certificates &amp; Passes ({completedEnrollments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("logs")}
            className={`px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === "logs"
                ? "bg-[#0066FF] text-white shadow-md shadow-blue-500/20 font-extrabold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
            }`}
          >
            <Terminal size={14} />
            <span>GitHub Commit Feed ({dailyLogs.length})</span>
          </button>
        </div>

        {/* =========================================================================
            MAIN TAB CONTENT CONTAINER (Clean Light Cards)
        ========================================================================= */}
        {!authLoading && !user ? (
          <div className="p-10 rounded-3xl bg-white border border-slate-200 text-center space-y-4 shadow-xs">
            <Lock size={36} className="text-slate-400 mx-auto" />
            <h2 className="text-xl font-bold font-sans text-slate-900">Please Sign In to Access My Learning</h2>
            <p className="text-xs font-mono text-slate-500 max-w-md mx-auto">
              You need an active candidate account to view your enrolled projects, 45-day commit progress, and daily logs.
            </p>
            <Link
              href="/login?mode=signin"
              className="inline-block px-6 py-3 rounded-2xl bg-[#0066FF] text-white font-bold text-xs font-mono shadow-md shadow-blue-500/20"
            >
              Sign In to Botmartz &rarr;
            </Link>
          </div>
        ) : (
          <div>
            
            {/* TAB 1: ACTIVE ENROLLED SYSTEMS */}
            {activeTab === "projects" && (
              <div className="space-y-6">
                {loading && activeEnrollments.length === 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
                    {[1, 2].map((i) => (
                      <div key={i} className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 animate-pulse">
                        <div className="h-4 w-32 bg-slate-200 rounded-full" />
                        <div className="h-6 w-3/4 bg-slate-200 rounded-xl" />
                        <div className="h-20 w-full bg-slate-100 rounded-2xl" />
                        <div className="h-12 w-full bg-slate-200 rounded-xl" />
                      </div>
                    ))}
                  </div>
                ) : activeEnrollments.length === 0 ? (
                  <div className="p-10 rounded-3xl bg-white border border-dashed border-slate-200 text-center space-y-3 shadow-xs">
                    <Layers size={36} className="text-slate-400 mx-auto" />
                    <h3 className="font-bold text-slate-800 font-sans text-lg">No Active PRD Enrollments</h3>
                    <p className="text-xs font-mono text-slate-500 max-w-md mx-auto">
                      Explore the catalog of 59 production engineering PRDs and enroll in a system track to start your 45-day virtual AI internship.
                    </p>
                    <Link
                      href="/arena"
                      className="inline-block px-6 py-3 rounded-2xl bg-[#0066FF] text-white font-mono text-xs font-bold shadow-md shadow-blue-500/20"
                    >
                      Browse Systems Catalog &rarr;
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
                    {activeEnrollments.map((enrollment) => {
                      const projectLogs = dailyLogs.filter((l) => l.projectId === enrollment.projectId);
                      const uniqueDays = new Set(projectLogs.map((l) => l.dayNumber)).size;
                      const lastDay = enrollment.lastDayLogged || uniqueDays || enrollment.streak || 0;
                      const completedDays = Math.min(45, Math.max(lastDay, uniqueDays));
                      const isFullyCompleted = completedDays >= 45;
                      const progressPct = Math.min(100, Math.round((completedDays / 45) * 100));

                      const prdDetails = ARENA_PROJECTS.find((p) => p.id === enrollment.projectId);

                      return (
                        <div
                          key={enrollment.id || enrollment.projectId}
                          className="rounded-3xl bg-white border border-slate-200 hover:border-blue-300 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all space-y-6 flex flex-col justify-between"
                        >
                          <div className="space-y-4">
                            
                            {/* Track Badges */}
                            <div className="flex items-center justify-between text-[11px] font-bold">
                              <span className="px-3 py-1 rounded-full bg-blue-50 text-[#0066FF] border border-blue-100 uppercase">
                                {enrollment.difficulty || prdDetails?.difficulty || "Production"} Track
                              </span>
                              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-extrabold flex items-center gap-1.5 border border-emerald-200">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                Active Internship
                              </span>
                            </div>

                            {/* Project Header */}
                            <div>
                              <h3 className="text-xl font-bold text-slate-900 font-sans tracking-tight">
                                {enrollment.projectTitle || prdDetails?.title || "Production System"}
                              </h3>
                              <div className="text-slate-500 text-xs mt-1">
                                Role: <strong className="text-slate-700">{enrollment.role || "AI Engineer"}</strong> &bull; Team: <strong className="text-slate-700">{enrollment.teamType || "Solo Shipper"}</strong>
                              </div>
                            </div>

                            {/* Tech Stack Pills */}
                            {prdDetails?.techStack && (
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {prdDetails.techStack.slice(0, 5).map((t) => (
                                  <span key={t} className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-mono border border-slate-200">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* 45-Day Progress Box */}
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-slate-700 font-sans flex items-center gap-1.5">
                                  <Clock size={14} className="text-[#0066FF]" />
                                  <span>45-Day Sprint Progress: Day {completedDays} / 45</span>
                                </span>
                                <span className="font-mono font-bold text-[#0066FF]">{progressPct}%</span>
                              </div>

                              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden p-0.5 border border-slate-200">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    isFullyCompleted
                                      ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                                      : "bg-gradient-to-r from-[#0066FF] via-blue-500 to-cyan-400"
                                  }`}
                                  style={{ width: `${progressPct}%` }}
                                />
                              </div>

                              <div className="text-[11px] text-slate-500 flex items-center justify-between pt-0.5">
                                <span>
                                  {isFullyCompleted
                                    ? "🎉 45 Days Completed! You can mark this project complete."
                                    : `${45 - completedDays} days remaining to unlock completion (+500 Coins)`}
                                </span>
                              </div>
                            </div>

                          </div>

                          {/* Quick Actions Grid */}
                          <div className="space-y-2.5 pt-4 border-t border-slate-100">
                            <div className="grid grid-cols-2 gap-2.5">
                              <Link
                                href={`/arena/${enrollment.projectId}`}
                                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-center transition-colors flex items-center justify-center gap-1.5"
                              >
                                <BookOpen size={14} className="text-[#0066FF]" />
                                <span>View PRD</span>
                              </Link>

                              <Link
                                href={`/arena/${enrollment.projectId}/workspace`}
                                className="py-2.5 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-center transition-colors flex items-center justify-center gap-1.5"
                              >
                                <KanbanSquare size={14} className="text-indigo-600" />
                                <span>Agile Workspace</span>
                              </Link>
                            </div>

                            <Link
                              href={`/arena/daily-log?projectId=${enrollment.projectId}`}
                              className="w-full py-3 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-center flex items-center justify-center gap-2 shadow-xs transition-colors"
                            >
                              <Terminal size={15} />
                              <span>Log Today&apos;s Commit (Day {completedDays + 1}) &rarr;</span>
                            </Link>

                            {/* Mark Completed Lock Button */}
                            {!isFullyCompleted ? (
                              <div className="relative group">
                                <button
                                  disabled
                                  className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-400 font-bold border border-slate-200 cursor-not-allowed flex items-center justify-center gap-2 text-[11px]"
                                >
                                  <Lock size={13} className="text-slate-400" />
                                  <span>Mark Project Completed (Locked: {completedDays}/45 Days)</span>
                                </button>
                                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-full p-3 bg-slate-900 text-white text-[11px] font-sans rounded-xl border border-slate-700 shadow-2xl z-30 leading-relaxed text-center">
                                  🔒 Complete 45 days of daily proof-of-work commit logs on /arena/daily-log to unlock project completion &amp; claim +500 Karma Coins.
                                </div>
                              </div>
                            ) : (
                              <Link
                                href={`/arena/${enrollment.projectId}`}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-center flex items-center justify-center gap-2 shadow-md transition-all"
                              >
                                <Trophy size={15} className="text-amber-300" />
                                <span>Mark Project Completed (+500 Coins) &rarr;</span>
                              </Link>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: 45-DAY PROOF-OF-WORK MATRIX HEATMAP */}
            {activeTab === "matrix" && (
              <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
                <div>
                  <h3 className="text-xl font-bold font-sans text-slate-900 flex items-center gap-2">
                    <Calendar size={20} className="text-[#0066FF]" />
                    <span>45-Day Proof-of-Work Sprint Matrix</span>
                  </h3>
                  <p className="text-xs font-mono text-slate-500 mt-1">
                    Visual milestone map for your 45-day virtual AI internship. Submit daily commits to light up every box!
                  </p>
                </div>

                {/* 45 Boxes Grid */}
                <div className="grid grid-cols-5 sm:grid-cols-9 md:grid-cols-15 gap-2.5 font-mono text-xs">
                  {Array.from({ length: 45 }).map((_, idx) => {
                    const dayNum = idx + 1;
                    const isLogged = currentCompletedDays >= dayNum;
                    const isCurrent = currentCompletedDays + 1 === dayNum;

                    return (
                      <div
                        key={dayNum}
                        className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                          isLogged
                            ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-bold shadow-xs"
                            : isCurrent
                            ? "bg-blue-50 border-[#0066FF] text-[#0066FF] font-bold animate-pulse shadow-sm"
                            : "bg-slate-50 border-slate-200 text-slate-400"
                        }`}
                      >
                        <span className="text-[10px] uppercase font-bold">D{dayNum}</span>
                        {isLogged ? (
                          <CheckCircle2 size={13} className="text-emerald-600" />
                        ) : isCurrent ? (
                          <Flame size={13} className="text-amber-500 animate-bounce" />
                        ) : (
                          <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs font-mono text-slate-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-emerald-100 border border-emerald-300" /> Completed</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-blue-100 border border-[#0066FF]" /> Today&apos;s Target</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-slate-100 border border-slate-200" /> Upcoming</span>
                  </div>
                  <Link
                    href="/arena/daily-log"
                    className="px-4 py-2 rounded-xl bg-[#0066FF] text-white font-bold text-xs hover:bg-blue-600 transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Terminal size={13} />
                    <span>Submit Day {currentCompletedDays + 1} Log &rarr;</span>
                  </Link>
                </div>
              </div>
            )}

            {/* TAB 3: CERTIFICATES & PASSES */}
            {activeTab === "certificates" && (
              <div className="space-y-6">
                {completedEnrollments.length === 0 ? (
                  <div className="p-10 rounded-3xl bg-white border border-dashed border-slate-200 text-center space-y-4 shadow-xs">
                    <Trophy size={36} className="text-slate-400 mx-auto" />
                    <h3 className="font-bold text-slate-800 font-sans text-lg">No Completed Certificates Yet</h3>
                    <p className="text-xs font-mono text-slate-500 max-w-md mx-auto">
                      Complete all 45 days of proof-of-work on your active enrolled project to claim your cryptographically verified credentials.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
                    {completedEnrollments.map((c) => (
                      <div
                        key={c.id || c.projectId}
                        className="rounded-3xl bg-emerald-50/60 border border-emerald-200 p-6 space-y-4 shadow-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase text-[10px]">
                            ✓ 45-Day Milestone Passed
                          </span>
                          <span className="text-emerald-700 font-bold text-xs">
                            +500 Coins Earned
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 font-sans text-lg">{c.projectTitle}</h4>
                          <p className="text-slate-500 text-xs mt-1">Passed on {new Date(c.completedAt || Date.now()).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-2 pt-3 border-t border-emerald-200/80">
                          <Link
                            href="/certificates"
                            className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-center transition-colors shadow-xs"
                          >
                            View Credential
                          </Link>
                          <Link
                            href={`/showcase?autoOpen=true&title=${encodeURIComponent(c.projectTitle)}`}
                            className="flex-1 py-2.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 font-bold text-center hover:bg-emerald-50 transition-colors"
                          >
                            Showcase Build
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: GITHUB COMMIT LOGS FEED */}
            {activeTab === "logs" && (
              <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold font-sans text-slate-900 flex items-center gap-2">
                      <Terminal size={20} className="text-[#0066FF]" />
                      <span>Submitted GitHub Proof-of-Work Feed</span>
                    </h3>
                    <p className="text-xs font-mono text-slate-500 mt-1">
                      Recent daily commit URL log submissions and awarded karma points.
                    </p>
                  </div>
                  <Link
                    href="/arena/daily-log"
                    className="px-4 py-2 rounded-xl bg-[#0066FF] text-white font-mono text-xs font-bold hover:bg-blue-600 transition-colors shadow-xs"
                  >
                    Submit Log &rarr;
                  </Link>
                </div>

                {dailyLogs.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 font-mono text-xs">
                    No daily commit logs submitted yet. Click &quot;Submit Log&quot; to start your streak!
                  </div>
                ) : (
                  <div className="space-y-3 font-mono text-xs">
                    {dailyLogs.slice(0, 15).map((log) => (
                      <div
                        key={log.id}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 rounded-xl bg-blue-100 text-[#0066FF] font-bold shrink-0">
                            Day {log.dayNumber}
                          </span>
                          <div>
                            <div className="font-bold text-slate-900 font-sans">{log.projectTitle}</div>
                            <a
                              href={log.commitUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-500 hover:text-[#0066FF] text-xs font-mono flex items-center gap-1.5 mt-0.5"
                            >
                              <Github size={13} />
                              <span className="truncate max-w-sm">{log.commitUrl}</span>
                              <ExternalLink size={11} />
                            </a>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                          <span className="text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                            +{log.coinsAwarded || 20} Coins
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(log.submittedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
