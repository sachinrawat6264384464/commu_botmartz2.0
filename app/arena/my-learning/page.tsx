"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
  ChevronRight,
  Linkedin
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { ARENA_PROJECTS } from "@/lib/arena-projects";
import { computeUserBadgeStatuses } from "@/lib/badges";
import LinkedInShareModal from "@/app/_components/LinkedInShareModal";

export default function MyLearningPage() {
  const { user, studentProfile, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"projects" | "matrix" | "certificates" | "logs">("projects");
  const [claimedBadges, setClaimedBadges] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("botmartz_user_claimed_badges");
        return cached ? JSON.parse(cached) : [];
      } catch (e) {}
    }
    return [];
  });
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [shareModalData, setShareModalData] = useState<{
    isOpen: boolean;
    projectTitle: string;
    certId: string;
  }>({
    isOpen: false,
    projectTitle: "",
    certId: ""
  });

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

  // Compute Gamified Badges Statuses
  const badgeStatuses = computeUserBadgeStatuses(
    currentCompletedDays,
    completedEnrollments.length,
    claimedBadges
  );

  const handleClaimBadge = async (badgeId: string) => {
    if (!user?.email) {
      alert("Please log in to claim your earned badge.");
      return;
    }

    setClaimingId(badgeId);
    try {
      const res = await fetch("/api/badges/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, badgeId })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        const updated = [...claimedBadges, badgeId];
        setClaimedBadges(updated);
        try {
          localStorage.setItem("botmartz_user_claimed_badges", JSON.stringify(updated));
        } catch (e) {}
        alert(`🎉 Badge Claimed Successfully! ${data.message || ""}`);
      } else {
        alert(data.error || "Failed to claim badge.");
      }
    } catch (e) {
      alert("Network error claiming badge.");
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <div
      className="bg-white min-h-screen text-slate-900 pt-24 pb-20 font-sans selection:bg-[#D9F83B] selection:text-slate-950"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(29, 49, 137, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(29, 49, 137, 0.08) 1px, transparent 1px)",
        backgroundSize: "72px 72px",
      }}
    >
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 space-y-6">
        
        {/* =========================================================================
            HERO COMMAND CENTER (#162774 ROYAL BLUE GRID + #D9F83B)
        ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: -20, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative rounded-3xl bg-[#162774] border border-white/15 p-6 sm:p-8 text-white shadow-2xl overflow-hidden"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        >
          <div className="relative z-10 space-y-6">
            
            {/* Top Bar: Title & Primary CTA */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/15">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D9F83B] text-slate-950 font-sans text-[11px] font-extrabold uppercase tracking-wider">
                  <Terminal size={13} />
                  <span>Candidate Production Command Center</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-sans flex flex-wrap items-center gap-3">
                  <span>My Learning &amp; <span className="text-[#D9F83B]">Proof-of-Work</span></span>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/15 text-[#D9F83B] border border-white/20">
                    Live Session
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-blue-100/85 font-sans max-w-3xl leading-relaxed">
                  Follow your 4-step engineering journey below: complete your builder profile, pick a system PRD, log daily GitHub commits, and unlock verified certificates &amp; Karma rewards.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Link
                  href="/arena/daily-log"
                  className="group relative overflow-hidden px-5 py-3 rounded-full bg-[#D9F83B] text-slate-950 font-sans text-xs font-extrabold transition-all shadow-lg flex items-center gap-2.5 cursor-pointer"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-white -translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out"
                  />
                  <span className="relative z-10">Log Today&apos;s Commit</span>
                  <span className="relative z-10 w-6 h-6 rounded-full bg-slate-950 text-[#D9F83B] flex items-center justify-center transition-transform duration-300 group-hover:rotate-[60deg]">
                    <ArrowRight size={12} />
                  </span>
                </Link>
                <Link
                  href="/arena"
                  className="group relative overflow-hidden px-5 py-3 rounded-full bg-white text-[#162774] font-sans text-xs font-extrabold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[#D9F83B] -translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out"
                  />
                  <Compass size={14} className="relative z-10" />
                  <span className="relative z-10">Explore Catalog</span>
                </Link>
              </div>
            </div>

            {/* HUD Metrics Cards Grid (Crisp White Contrast) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 font-sans">
              <div className="p-4 rounded-2xl bg-white text-slate-950 border-l-4 border-l-[#D9F83B] shadow-md space-y-1">
                <div className="text-[10px] text-[#162774] uppercase tracking-wider font-extrabold flex items-center gap-1.5">
                  <Layers size={13} />
                  <span>Active Enrolled</span>
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-slate-950">
                  {activeEnrollments.length} <span className="text-xs text-slate-500 font-semibold">Systems</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white text-slate-950 border-l-4 border-l-[#D9F83B] shadow-md space-y-1">
                <div className="text-[10px] text-[#162774] uppercase tracking-wider font-extrabold flex items-center gap-1.5">
                  <Flame size={13} />
                  <span>45-Day Sprint</span>
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-slate-950 flex items-center gap-2">
                  <span>Day {currentCompletedDays}/45</span>
                  <span className="text-xs text-[#162774] font-bold">({currentProgressPct}%)</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white text-slate-950 border-l-4 border-l-[#D9F83B] shadow-md space-y-1">
                <div className="text-[10px] text-[#162774] uppercase tracking-wider font-extrabold flex items-center gap-1.5">
                  <Coins size={13} />
                  <span>Karma Balance</span>
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-[#162774]">
                  {totalKarma} <span className="text-xs text-slate-500 font-semibold">Coins</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white text-slate-950 border-l-4 border-l-[#D9F83B] shadow-md space-y-1">
                <div className="text-[10px] text-[#162774] uppercase tracking-wider font-extrabold flex items-center gap-1.5">
                  <Trophy size={13} />
                  <span>Certificates</span>
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-slate-950">
                  {completedEnrollments.length} <span className="text-xs text-slate-500 font-semibold">Passed</span>
                </div>
              </div>
            </div>

          </div>
        </motion.div>

        {/* =========================================================================
            CLEAR 4-STEP POST-LOGIN BUILDER FLOW (ZERO CONFUSION)
        ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 overflow-hidden">
          {[
            {
              num: "01",
              title: "Complete Profile",
              desc: "Add GitHub, LinkedIn & College to unlock +100 Karma Coins.",
              href: "/profile",
              done: Boolean(studentProfile?.githubUsername && studentProfile?.linkedinUrl),
              cta: "Open Profile",
            },
            {
              num: "02",
              title: "Pick a System PRD",
              desc: "Enroll in 1 of 59+ production AI & backend architectures.",
              href: "/arena",
              done: activeEnrollments.length > 0 || completedEnrollments.length > 0,
              cta: "Browse Systems",
            },
            {
              num: "03",
              title: "Log Daily Build",
              desc: "Submit daily GitHub commit URLs & earn +20 to +50 Karma.",
              href: "/arena/daily-log",
              done: dailyLogs.length > 0,
              cta: "Log Commit",
            },
            {
              num: "04",
              title: "Claim Certs & Perks",
              desc: "Redeem Karma Coins for clinics, referrals & QR certificates.",
              href: "/arena/wallet",
              done: completedEnrollments.length > 0,
              cta: "Open Wallet",
            },
          ].map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -24 : 24, y: 12, filter: "blur(5px)" }}
              whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.55, delay: idx * 0.07, ease: "easeOut" }}
            >
              <Link
                href={step.href}
                className={`group block h-full p-4 rounded-2xl border transition-all duration-300 shadow-xs hover:shadow-md ${
                  step.done
                    ? "bg-white border-emerald-300 border-l-4 border-l-emerald-600"
                    : "bg-[#F4F6FB] hover:bg-white border-slate-200 border-l-4 border-l-[#162774]"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-[#162774] text-[#D9F83B] text-[10px] font-extrabold flex items-center justify-center">
                    {step.num}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                    step.done
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-[#D9F83B] text-slate-950"
                  }`}>
                    {step.done ? "Completed" : "Next Step"}
                  </span>
                </div>
                <div className="text-sm font-extrabold text-slate-950 group-hover:text-[#162774] transition-colors">
                  {step.title}
                </div>
                <p className="text-[11px] text-slate-600 mt-1 font-medium leading-relaxed">
                  {step.desc}
                </p>
                <div className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-extrabold text-[#162774]">
                  <span>{step.cta}</span>
                  <ArrowRight size={11} className="transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* =========================================================================
            CLEAN LIGHT INTERACTIVE TAB NAVIGATION STRIP
        ========================================================================= */}
        <div className="flex items-center gap-2 bg-[#F4F6FB] p-1.5 rounded-2xl border border-slate-200 overflow-x-auto font-sans text-xs shadow-xs">
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-5 py-2.5 rounded-xl font-extrabold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === "projects"
                ? "bg-[#162774] text-[#D9F83B] shadow-md"
                : "text-slate-600 hover:text-slate-950 hover:bg-white"
            }`}
          >
            <Layers size={14} />
            <span>Active Enrolled Systems ({activeEnrollments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("matrix")}
            className={`px-5 py-2.5 rounded-xl font-extrabold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === "matrix"
                ? "bg-[#162774] text-[#D9F83B] shadow-md"
                : "text-slate-600 hover:text-slate-950 hover:bg-white"
            }`}
          >
            <Calendar size={14} />
            <span>45-Day Proof-of-Work Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab("certificates")}
            className={`px-5 py-2.5 rounded-xl font-extrabold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === "certificates"
                ? "bg-[#162774] text-[#D9F83B] shadow-md"
                : "text-slate-600 hover:text-slate-950 hover:bg-white"
            }`}
          >
            <Trophy size={14} />
            <span>Certificates &amp; Passes ({completedEnrollments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("logs")}
            className={`px-5 py-2.5 rounded-xl font-extrabold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === "logs"
                ? "bg-[#162774] text-[#D9F83B] shadow-md"
                : "text-slate-600 hover:text-slate-950 hover:bg-white"
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

            {/* TAB 3: CERTIFICATES & GAMIFIED BADGES */}
            {activeTab === "certificates" && (
              <div className="space-y-8 font-sans">
                
                {/* SECTION 3A: GAMIFIED BADGES CLAIM GRID */}
                <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-xl font-bold font-sans text-slate-900 flex items-center gap-2">
                        <Award size={22} className="text-[#0066FF]" />
                        <span>Gamified Candidate Badges &amp; Streaks</span>
                      </h3>
                      <p className="text-xs font-mono text-slate-500 mt-1">
                        Unlock and claim streak badges (10, 20, 45 days) &amp; project milestones (1, 2, 4 projects).
                      </p>
                    </div>

                    <span className="px-3.5 py-1.5 rounded-full bg-blue-50 text-[#0066FF] font-mono text-xs font-bold border border-blue-200 self-start sm:self-auto">
                      {claimedBadges.length} Badges Claimed
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
                    {badgeStatuses.map((b) => (
                      <div
                        key={b.id}
                        className={`p-5 rounded-2xl border-2 flex flex-col justify-between space-y-4 transition-all ${
                          b.isClaimed
                            ? "bg-emerald-50/70 border-emerald-300 text-emerald-950"
                            : b.isEligible
                            ? "bg-blue-50/70 border-[#0066FF] text-blue-950 shadow-md"
                            : "bg-slate-50 border-slate-200 text-slate-400 opacity-70"
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              b.isClaimed ? "bg-emerald-100 text-emerald-800" : b.isEligible ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
                            }`}>
                              {b.isClaimed ? "✓ Claimed" : b.isEligible ? "🎉 Unlocked" : "🔒 Locked"}
                            </span>
                            <span className="text-[10px] text-slate-500 font-bold uppercase">{b.category}</span>
                          </div>

                          <h4 className="font-extrabold text-slate-900 font-sans text-base leading-snug">{b.title}</h4>
                          <p className="text-xs text-slate-600 font-sans">{b.description}</p>
                        </div>

                        <div>
                          {b.isClaimed ? (
                            <div className="w-full py-2 rounded-xl bg-emerald-100 text-emerald-800 text-center font-bold text-xs flex items-center justify-center gap-1.5">
                              <CheckCircle2 size={14} className="text-emerald-600" />
                              <span>Badge Active on Profile</span>
                            </div>
                          ) : b.canClaim ? (
                            <button
                              onClick={() => handleClaimBadge(b.id)}
                              disabled={claimingId === b.id}
                              className="w-full py-2.5 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-center transition-colors shadow-md shadow-blue-500/20 cursor-pointer flex items-center justify-center gap-2"
                            >
                              {claimingId === b.id ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                              <span>Claim Badge Now &rarr;</span>
                            </button>
                          ) : (
                            <div className="w-full py-2 rounded-xl bg-slate-200/80 text-slate-500 text-center font-bold text-xs flex items-center justify-center gap-1">
                              <Lock size={13} />
                              <span>Need {b.requiredCount} {b.category === "streak" ? "Days" : "Projects"}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SECTION 3B: OFFICIAL COMPLETION CERTIFICATES */}
                <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
                  <div>
                    <h3 className="text-xl font-bold font-sans text-slate-900 flex items-center gap-2">
                      <Trophy size={22} className="text-amber-500" />
                      <span>Verified Completion Certificates</span>
                    </h3>
                    <p className="text-xs font-mono text-slate-500 mt-1">
                      Issued by Botmartz AI Solutions upon completing all 45 days of proof-of-work.
                    </p>
                  </div>

                  {completedEnrollments.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-3">
                      <Lock size={32} className="text-slate-400 mx-auto" />
                      <h4 className="font-bold text-slate-800 text-base font-sans">Certificate Locked (Day {currentCompletedDays}/45 Logged)</h4>
                      <p className="text-xs font-mono text-slate-500 max-w-md mx-auto">
                        Your official certificate will generate automatically once you log 45 days of daily standup logs or mark your project complete.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
                      {completedEnrollments.map((c) => {
                        const certId = c.certificateId || `CERT-BM-${(c.projectId || "888").toUpperCase()}-98231`;
                        return (
                          <div
                            key={c.id || c.projectId}
                            className="rounded-3xl bg-gradient-to-br from-emerald-50/80 via-white to-blue-50/50 border-2 border-emerald-300 p-6 space-y-4 shadow-md"
                          >
                            <div className="flex items-center justify-between">
                              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase text-[10px] flex items-center gap-1">
                                <CheckCircle2 size={13} className="text-emerald-600" /> Verified Credential
                              </span>
                              <span className="text-slate-500 font-bold text-[11px]">
                                ID: {certId}
                              </span>
                            </div>

                            <div>
                              <h4 className="font-extrabold text-slate-900 font-sans text-lg">{c.projectTitle}</h4>
                              <p className="text-slate-500 text-xs mt-1">Issued by Soham Sharma &bull; Botmartz AI Solutions</p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 pt-2">
                              <Link
                                href={`/certificates?query=${certId}`}
                                className="flex-1 py-2.5 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-center transition-colors shadow-xs"
                              >
                                View PDF
                              </Link>
                              
                              <button
                                onClick={() => setShareModalData({
                                  isOpen: true,
                                  projectTitle: c.projectTitle,
                                  certId
                                })}
                                className="flex-1 py-2.5 rounded-xl bg-[#0077B5] hover:bg-[#006097] text-white font-bold text-center transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Linkedin size={14} />
                                <span>Share on LinkedIn</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

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

      {/* LinkedIn UGC Share Modal */}
      <LinkedInShareModal
        isOpen={shareModalData.isOpen}
        onClose={() => setShareModalData(prev => ({ ...prev, isOpen: false }))}
        candidateName={(studentProfile as any)?.name || user?.displayName || "Candidate Builder"}
        projectTitle={shareModalData.projectTitle || "45-Day Virtual AI Internship"}
        certificateId={shareModalData.certId || "CERT-BM-982314"}
        verificationUrl={typeof window !== "undefined" ? `${window.location.origin}/certificates?query=${shareModalData.certId}` : `https://community.botmartz.com/certificates?query=${shareModalData.certId}`}
        earnedBadges={claimedBadges.length > 0 ? claimedBadges : ["10-Day Streak", "Foundations & AI"]}
      />
    </div>
  );
}
