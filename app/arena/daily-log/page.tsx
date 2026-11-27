"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ARENA_PROJECTS, ArenaProject, TOTAL_SYSTEMS_COUNT } from "@/lib/arena-projects";
import { useAuth } from "@/lib/auth-context";
import AuthGate from "@/app/_components/AuthGate";
import LinkedInShareModal from "@/app/_components/LinkedInShareModal";

interface EnrolledProjectItem {
  id: string;
  projectId: string;
  projectTitle: string;
  difficulty?: string;
  teamType?: string;
  streak?: number;
  xp?: number;
  tier?: string;
  createdAt?: string;
  fullProject?: ArenaProject;
}

// 45-Day Guided Engineering Themes
const DAY_GUIDANCE_MAP: Record<string, { theme: string; focus: string; tips: string[] }> = {
  "1": {
    theme: "Project Kickoff, PRD Deep Dive & Architecture Setup",
    focus: "Understand the system requirements, clone the starter template, create your GitHub repository, and write the initial architecture README.",
    tips: [
      "Read the production SLA benchmark requirements in the PRD.",
      "Initialize your repository with a clean directory structure and .gitignore.",
      "Document the high-level system architecture and component interactions."
    ]
  },
  "2": {
    theme: "Environment Configuration & Dependency Management",
    focus: "Configure Docker containers, virtual environments, environment secrets, and verify database connectivity.",
    tips: [
      "Set up docker-compose.yml for databases (PostgreSQL/Qdrant/Redis).",
      "Lock dependency versions (requirements.txt or package.json).",
      "Verify local health-check endpoints."
    ]
  },
  "3": {
    theme: "Database Schema Design & Migration Scripts",
    focus: "Design relational / vector schemas, create migration scripts, and seed initial test datasets.",
    tips: [
      "Implement the schema specified in the PRD blueprint.",
      "Add indexes on high-frequency query columns.",
      "Write automated seed scripts to populate mock data."
    ]
  },
  "4": {
    theme: "Data Ingestion & Preprocessing Pipeline",
    focus: "Build ingestion workers, chunking logic, data sanitizers, and validation pipelines.",
    tips: [
      "Handle edge cases (corrupt files, missing headers, rate limits).",
      "Ensure chunking strategies preserve semantic context.",
      "Log throughput and parsing latency."
    ]
  },
  "5": {
    theme: "Baseline MVP Implementation",
    focus: "Connect end-to-end data flow from API endpoint to core computational engine.",
    tips: [
      "Build a working end-to-end prototype without advanced optimizations.",
      "Verify sample queries return valid structured responses.",
      "Commit your working baseline to GitHub."
    ]
  }
};

function getDayGuidance(day: number) {
  if (DAY_GUIDANCE_MAP[String(day)]) {
    return DAY_GUIDANCE_MAP[String(day)];
  }
  if (day >= 6 && day <= 15) {
    return {
      theme: "Core Algorithm, State Machine & Business Logic",
      focus: `Sprint on primary agent workflows, vector search retrieval, and deterministic state transitions for Day ${day}.`,
      tips: [
        "Implement fallback mechanisms for unexpected API responses.",
        "Add caching layer to reduce redundant computations.",
        "Profile token usage and latency bottlenecks."
      ]
    };
  }
  if (day >= 16 && day <= 25) {
    return {
      theme: "SLA Gates, Benchmarking & Performance Tuning",
      focus: `Profile throughput and optimize code execution to pass strict production SLA gates (<150ms latency) for Day ${day}.`,
      tips: [
        "Run memory profilers to detect leaks under continuous load.",
        "Implement batching and async concurrency.",
        "Write integration tests to verify SLA benchmarks."
      ]
    };
  }
  if (day >= 26 && day <= 35) {
    return {
      theme: "Production UI, API Integration & Streaming",
      focus: `Build interactive frontend interfaces, streaming SSE/WebSocket handlers, and comprehensive telemetry for Day ${day}.`,
      tips: [
        "Implement real-time token/data streaming.",
        "Add telemetry tracing (OpenTelemetry / Prometheus).",
        "Test responsiveness across devices."
      ]
    };
  }
  if (day >= 36 && day <= 40) {
    return {
      theme: "Cloud Deployment, Containerization & Security Audit",
      focus: `Deploy production containers to Cloud Run / AWS / Vercel and verify pen-test attack surfaces for Day ${day}.`,
      tips: [
        "Configure automated GitHub Actions CI/CD pipeline.",
        "Conduct security vulnerability scans on dependencies.",
        "Verify public HTTPS API availability."
      ]
    };
  }
  return {
    theme: "Architecture Defense, Founder Review & Placement Dispatch",
    focus: `Finalize documentation, record a 3-minute video walkthrough, and prepare for Founder Soham Sharma's code audit for Day ${day}.`,
    tips: [
      "Write a comprehensive project case study on GitHub and LinkedIn.",
      "Include benchmark graphs and architecture teardowns.",
      "Request Founder Recommendation & 15-Company Referral Dispatch."
    ]
  };
}

function DailyPoWLogPageInner() {
  const { user, studentProfile } = useAuth();
  const searchParams = useSearchParams();
  const queryProjectId = searchParams.get("projectId");

  const [enrolledProjects, setEnrolledProjects] = useState<EnrolledProjectItem[]>([]);
  const [fetchingEnrollments, setFetchingEnrollments] = useState(true);
  const [userLogs, setUserLogs] = useState<any[]>([]);

  const [form, setForm] = useState({
    studentEmail: "",
    studentName: "",
    projectId: "",
    dayNumber: "1",
    commitUrl: "",
    researchNotes: "",
    linkedinPostUrl: "",
    discordMessageUrl: "",
    driveFolderUrl: "",
    blockers: "",
    isLearningPause: false,
    learningTopic: ""
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // LinkedIn Daily Log Share Modal State
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareModalData, setShareModalData] = useState({
    projectTitle: "",
    dayNumber: 1,
    commitUrl: "",
    researchNotes: ""
  });

  const openShareModal = (title: string, day: number, commit: string, notes: string) => {
    setShareModalData({
      projectTitle: title || currentEnrolledProject?.projectTitle || "Arena System",
      dayNumber: day,
      commitUrl: commit,
      researchNotes: notes
    });
    setShareModalOpen(true);
  };

  // 1. Fetch user's enrolled projects & past logs on mount
  useEffect(() => {
    if (user?.email) {
      const email = user.email.toLowerCase().trim();
      setForm((prev) => ({
        ...prev,
        studentEmail: email,
        studentName: studentProfile?.displayName || user.displayName || prev.studentName
      }));

      fetchEnrolledProjects(email);
      fetchRecentLogs(email);
    } else {
      setFetchingEnrollments(false);
    }
  }, [user, studentProfile]);

  const fetchEnrolledProjects = async (email: string) => {
    setFetchingEnrollments(true);
    try {
      const res = await fetch(`/api/arena/enroll?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      const enrollmentsList = (data.success && Array.isArray(data.enrollments)) ? data.enrollments : [];

      const enriched: EnrolledProjectItem[] = enrollmentsList.map((en: any) => {
        const match = ARENA_PROJECTS.find((p) => p.id === en.projectId || p.slug === en.projectId);
        return {
          id: en.id,
          projectId: en.projectId,
          projectTitle: en.projectTitle || match?.title || "Enrolled Project",
          difficulty: en.difficulty || match?.difficulty,
          teamType: en.teamType,
          streak: en.streak || 0,
          xp: en.xp || 100,
          tier: en.tier || "Free Explorer",
          createdAt: en.createdAt,
          fullProject: match
        };
      });

      setEnrolledProjects(enriched);

      // Select active project
      if (enriched.length > 0) {
        const matchedFromQuery = enriched.find((e) => e.projectId === queryProjectId);
        const initialProject = matchedFromQuery ? matchedFromQuery.projectId : enriched[0].projectId;
        setForm((prev) => ({ ...prev, projectId: initialProject }));
      }
    } catch (e) {
      console.warn("Failed to load enrolled projects:", e);
    } finally {
      setFetchingEnrollments(false);
    }
  };

  const fetchRecentLogs = async (email: string) => {
    try {
      const res = await fetch(`/api/arena/daily-log?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.logs)) {
        setUserLogs(data.logs);
      }
    } catch (e) {
      console.warn("Failed to load past logs:", e);
    }
  };

  // Selected Enrolled Project Metadata
  const currentEnrolledProject = useMemo(() => {
    return enrolledProjects.find((p) => p.projectId === form.projectId) || enrolledProjects[0];
  }, [enrolledProjects, form.projectId]);

  // Filter logs for selected project
  const projectLogs = useMemo(() => {
    if (!form.projectId) return [];
    return userLogs.filter((log) => log.projectId === form.projectId);
  }, [userLogs, form.projectId]);

  // Auto-calculate next logging day
  useEffect(() => {
    if (form.projectId) {
      const nextDay = Math.min(projectLogs.length + 1, 45);
      setForm((prev) => ({ ...prev, dayNumber: String(nextDay) }));
    }
  }, [form.projectId, projectLogs.length]);

  const activeDayNumber = parseInt(form.dayNumber, 10) || 1;
  const currentGuidance = getDayGuidance(activeDayNumber);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setErrorMsg("Please sign in to submit your daily Proof-of-Work.");
      return;
    }

    if (!form.projectId) {
      setErrorMsg("Please select an enrolled project to log progress.");
      return;
    }

    if (!form.commitUrl || !form.commitUrl.includes("github.com")) {
      setErrorMsg("Please provide a valid GitHub commit or repository URL.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const submittedDay = parseInt(form.dayNumber, 10) || 1;
    const submittedCommit = form.commitUrl;
    const submittedNotes = form.researchNotes;
    const projectTitle = currentEnrolledProject?.projectTitle || "Arena Project";

    try {
      const res = await fetch("/api/arena/daily-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          projectTitle
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit daily proof of work.");
      }

      setSuccessMsg(`🎉 Day ${form.dayNumber} logged successfully! Earned +${data.coinsAwarded} Karma Coins.`);
      
      // Auto-open LinkedIn share modal for this daily log
      openShareModal(projectTitle, submittedDay, submittedCommit, submittedNotes);

      // Reset fields
      setForm((prev) => ({
        ...prev,
        commitUrl: "",
        researchNotes: "",
        linkedinPostUrl: "",
        discordMessageUrl: "",
        blockers: ""
      }));

      // Refresh data
      if (user.email) {
        fetchRecentLogs(user.email);
        fetchEnrolledProjects(user.email);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 pt-24 pb-16 px-4 sm:px-8 lg:px-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ── HEADER ── */}
        <div className="bg-[#162774] text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/15 text-white border border-white/25 font-sans text-[11px] font-extrabold uppercase tracking-wider mb-3">
              Proof-of-Work Logger
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
              Daily Commit &amp; Progress Log
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 font-sans mt-1.5">
              Submit daily GitHub commits to build your streak, earn +20 to +70 Karma Coins, and qualify for founder recommendations.
            </p>
          </div>

          <Link
            href="/arena"
            className="px-5 py-3 rounded-2xl bg-white hover:bg-blue-50 text-[#162774] font-sans text-xs font-extrabold transition-all shadow-sm shrink-0 self-start md:self-auto whitespace-nowrap"
          >
            Explore All PRDs
          </Link>
        </div>

        {/* ── EMPTY STATE: NOT ENROLLED IN ANY PROJECTS ── */}
        {!fetchingEnrollments && enrolledProjects.length === 0 && (
          <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-4 shadow-xs">
            <h3 className="text-xl font-extrabold font-sans text-slate-950">
              No Enrolled Projects Found
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-sans max-w-md mx-auto leading-relaxed">
              Daily logs are tied to your specific enrolled project. Explore the {TOTAL_SYSTEMS_COUNT} production systems in the Arena and enroll with 1-click to start your daily sprint.
            </p>
            <div className="pt-2">
              <Link
                href="/arena"
                className="inline-flex items-center px-6 py-3 rounded-2xl bg-[#162774] hover:bg-[#1e3494] text-white font-sans text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                Browse Internship Playground &amp; Enroll Now
              </Link>
            </div>
          </div>
        )}

        {/* ── ENROLLED PROJECT LOGGER FORM ── */}
        {(fetchingEnrollments || enrolledProjects.length > 0) && (
          <div className="space-y-6">
            
            {/* 1. PROJECT SELECTOR & STREAK STATUS BAR */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-[#162774] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 font-sans text-xs">
              <div className="flex-1">
                <label className="block text-[11px] text-[#162774] font-bold uppercase mb-1.5 tracking-wider">
                  Select Enrolled Project ({enrolledProjects.length} Enrolled)
                </label>
                <select
                  value={form.projectId}
                  onChange={(e) => setForm((prev) => ({ ...prev, projectId: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:bg-white focus:outline-none focus:border-[#162774]"
                >
                  {enrolledProjects.map((ep) => (
                    <option key={ep.projectId} value={ep.projectId}>
                      {ep.projectTitle} ({ep.difficulty || "Hard"} &bull; Streak: {ep.streak || 0} Days)
                    </option>
                  ))}
                </select>
              </div>

              {currentEnrolledProject && (
                <div className="flex items-center gap-6 pt-2 md:pt-0 border-t md:border-t-0 md:border-l md:pl-6 border-slate-100 shrink-0">
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Current Streak</span>
                    <div className="text-base font-extrabold text-[#162774]">
                      {currentEnrolledProject.streak || 0} Days
                    </div>
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Experience</span>
                    <div className="text-base font-extrabold text-[#162774]">
                      {currentEnrolledProject.xp || 100} XP
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. DYNAMIC GUIDED FOCUS FOR TODAY'S LOGGING DAY */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#162774] text-white shadow-sm">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3 py-1 rounded-full bg-white text-[#162774] text-xs font-extrabold uppercase tracking-wider">
                    Day {activeDayNumber} Focus
                  </span>
                  <span className="text-sm text-white font-bold">
                    {currentGuidance.theme}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-blue-100 leading-relaxed max-w-4xl">
                  {currentGuidance.focus}
                </p>

                <div className="space-y-1.5 pt-2 text-xs text-blue-100">
                  {currentGuidance.tips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs">
                      <span className="font-bold text-white shrink-0">0{idx + 1}.</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. LOGGING FORM */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 space-y-6">
              
              {/* Feedback Alerts */}
              {errorMsg && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                  {successMsg}
                </div>
              )}

              {/* Day & Basic Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Day Number (1 - 45) *</label>
                  <input
                    type="number"
                    min={1}
                    max={45}
                    required
                    value={form.dayNumber}
                    onChange={(e) => setForm((prev) => ({ ...prev, dayNumber: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-[#162774]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1.5">Student / Builder Name *</label>
                  <input
                    type="text"
                    required
                    value={form.studentName}
                    onChange={(e) => setForm((prev) => ({ ...prev, studentName: e.target.value }))}
                    placeholder="Your Name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#162774]"
                  />
                </div>
              </div>

              {/* GitHub Commit URL (Required) */}
              <div className="text-xs">
                <label className="block text-slate-700 font-bold mb-1.5">
                  GitHub Commit / PR / Repository URL * (+20 Karma Coins)
                </label>
                <input
                  type="url"
                  required
                  value={form.commitUrl}
                  onChange={(e) => setForm((prev) => ({ ...prev, commitUrl: e.target.value }))}
                  placeholder="https://github.com/username/project-repo/commit/abc1234"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#162774]"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Paste the direct link to today&apos;s GitHub commit or pull request demonstrating your Proof-of-Work.
                </p>
              </div>

              {/* LinkedIn Post URL (+50 Coins Reward) */}
              <div className="text-xs p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#162774] transition-colors">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <label className="text-slate-900 font-bold">
                    LinkedIn Proof-of-Work Post URL (Optional &bull; +50 Karma Coins Bonus)
                  </label>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#162774] text-white text-[10px] font-bold">
                    Admin Audited
                  </span>
                </div>
                <input
                  type="url"
                  value={form.linkedinPostUrl}
                  onChange={(e) => setForm((prev) => ({ ...prev, linkedinPostUrl: e.target.value }))}
                  placeholder="https://www.linkedin.com/posts/username_botmartzai-activity-..."
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#162774]"
                />
                <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
                  Earn an extra <strong>+50 Karma Coins</strong> by sharing your daily learnings on LinkedIn with the tag <strong>#BotmartzAI</strong>. Admins audit links for quality to ensure real Proof-of-Work.
                </p>
              </div>

              {/* Research Notes & Architecture Breakdown */}
              <div className="text-xs">
                <label className="block text-slate-700 font-bold mb-1.5">
                  Today&apos;s Engineering Notes, Key Learnings &amp; Blockers
                </label>
                <textarea
                  rows={4}
                  value={form.researchNotes}
                  onChange={(e) => setForm((prev) => ({ ...prev, researchNotes: e.target.value }))}
                  placeholder="e.g. Day 1: Cloned starter repo, read the PRD specifications, configured Docker Compose with PostgreSQL + pgvector, and defined the initial FastAPI router structure..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#162774]"
                />
              </div>

              {/* Submit CTA Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-[#162774] hover:bg-[#1e3494] text-white text-xs font-extrabold uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Verifying &amp; Recording Day {form.dayNumber} Log...</span>
                    </>
                  ) : (
                    <span>Log Day {form.dayNumber} Proof-of-Work (+{form.linkedinPostUrl ? "70" : "20"} Karma Coins)</span>
                  )}
                </button>
              </div>

            </form>

            {/* 4. PAST SUBMITTED LOGS FOR THIS PROJECT */}
            {projectLogs.length > 0 && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">
                    Your Submitted Logs ({projectLogs.length} Days)
                  </h3>
                  <span className="text-xs font-bold text-[#162774]">
                    Total Logged Coins: +{projectLogs.reduce((acc, l) => acc + (l.coinsAwarded || 20), 0)}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  {projectLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#162774] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md bg-[#162774] text-white font-bold text-[10px]">
                            Day {log.dayNumber}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {new Date(log.submittedAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                          </span>
                          {log.linkedinStatus === "PENDING_AUDIT" && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                              LinkedIn Under Audit
                            </span>
                          )}
                          {log.linkedinStatus === "VERIFIED" && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              LinkedIn Verified
                            </span>
                          )}
                        </div>

                        {log.researchNotes && (
                          <p className="text-xs text-slate-600 line-clamp-2">
                            {log.researchNotes}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {log.commitUrl && (
                          <a
                            href={log.commitUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-[#162774] hover:border-[#162774] transition-colors text-[11px] font-bold"
                          >
                            Commit
                          </a>
                        )}

                        {log.linkedinPostUrl ? (
                          <a
                            href={log.linkedinPostUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-2 rounded-xl bg-[#162774] text-white hover:bg-[#1e3494] transition-colors text-[11px] font-bold"
                          >
                            Post
                          </a>
                        ) : (
                          <button
                            type="button"
                            onClick={() => openShareModal(currentEnrolledProject?.projectTitle || "Arena System", log.dayNumber, log.commitUrl || "", log.researchNotes || "")}
                            className="px-3 py-2 rounded-xl bg-[#162774] hover:bg-[#1e3494] text-white transition-colors text-[11px] font-bold cursor-pointer"
                          >
                            Share
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* LinkedIn Share Modal for Daily Proof-of-Work Log */}
      <LinkedInShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        mode="daily_log"
        candidateName={user?.displayName || "Builder Candidate"}
        projectTitle={shareModalData.projectTitle || currentEnrolledProject?.projectTitle || "Arena System"}
        dayNumber={shareModalData.dayNumber}
        commitUrl={shareModalData.commitUrl}
        researchNotes={shareModalData.researchNotes}
      />
    </div>
  );
}

export default function DailyPoWLogPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center text-xs text-slate-500">
          <Loader2 size={20} className="animate-spin text-[#162774] mr-2" />
          <span>Loading 45-Day Proof-of-Work Logger...</span>
        </div>
      }
    >
      <AuthGate
        featureTitle="Daily Standup Logger"
        featureDescription="Sign in with your builder account to log daily GitHub commits, earn Karma Coins, and maintain your 45-day proof-of-work streak."
      >
        <DailyPoWLogPageInner />
      </AuthGate>
    </React.Suspense>
  );
}
