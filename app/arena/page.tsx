"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles,
  Flame,
  Search,
  ExternalLink,
  Layers,
  ArrowRight,
  CheckCircle2,
  Trophy,
  Terminal,
  ShieldCheck,
  BookOpen,
  Filter,
  Check,
  Loader2,
  X,
  Lock,
  Coins,
  Briefcase,
  Star,
  Zap,
  GraduationCap
} from "lucide-react";
import { ARENA_PROJECTS, ArenaProject } from "@/lib/arena-projects";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";
import BuilderProfileGateModal from "@/app/_components/BuilderProfileGateModal";
import RazorpayModal from "@/app/_components/RazorpayModal";

export default function ArenaPage() {
  const { user, studentProfile } = useAuth();
  const { showToast } = useToast();

  // State for Catalog
  const [allProjectsList, setAllProjectsList] = useState<ArenaProject[]>(ARENA_PROJECTS);
  const [activeTier, setActiveTier] = useState<"All" | "Baby Step" | "Easy" | "Intermediate" | "Hard" | "Insane" | "Go To Hell">("All");
  const [selectedDomain, setSelectedDomain] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 9;

  // Enrollment & Gating States
  const [userEnrollments, setUserEnrollments] = useState<any[]>([]);
  const [selectedProjectForEnroll, setSelectedProjectForEnroll] = useState<ArenaProject | null>(null);
  const [showGateModal, setShowGateModal] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState(false);
  const [enrollError, setEnrollError] = useState("");

  const [enrollRole, setEnrollRole] = useState("AI Engineer");
  const [enrollTeamType, setEnrollTeamType] = useState<"Solo" | "Squad">("Solo");

  // Fetch custom admin projects on mount
  useEffect(() => {
    fetch("/api/admin/arena/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.customProjects && data.customProjects.length > 0) {
          setAllProjectsList([...data.customProjects, ...ARENA_PROJECTS]);
        }
      })
      .catch((e) => console.warn("Could not fetch custom projects:", e));
  }, []);

  // Fetch user enrollments when user is logged in
  useEffect(() => {
    if (user?.email) {
      fetch(`/api/arena/enroll?email=${encodeURIComponent(user.email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.enrollments)) {
            setUserEnrollments(data.enrollments);
          }
        })
        .catch((e) => console.warn("Failed to load user enrollments:", e));
    } else {
      setUserEnrollments([]);
    }
  }, [user?.email]);

  const activeEnrollments = useMemo(() => {
    return userEnrollments.filter(
      (e) => e.status !== "Completed" && e.status !== "Finished" && e.status !== "Cancelled" && e.status !== "Unenrolled"
    );
  }, [userEnrollments]);

  const activeEnrollment = activeEnrollments[0] || null;

  // Extract unique domains
  const allDomains = useMemo(() => {
    return Array.from(new Set(allProjectsList.map((p) => p.domain))).sort();
  }, [allProjectsList]);

  // Filtered list
  const filteredProjects = useMemo(() => {
    return allProjectsList.filter((project) => {
      // Tier Filter
      if (activeTier !== "All" && project.difficulty !== activeTier) return false;

      // Domain Filter
      if (selectedDomain !== "All" && project.domain !== selectedDomain) return false;

      // Search Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = project.title.toLowerCase().includes(q);
        const matchesDomain = project.domain.toLowerCase().includes(q);
        const matchesStack = project.techStack.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDomain && !matchesStack) return false;
      }

      return true;
    });
  }, [allProjectsList, activeTier, selectedDomain, searchQuery]);

  // Reset to page 1 on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTier, selectedDomain, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage) || 1;
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const isProfileComplete = Boolean(
    user && (
      Boolean(studentProfile?.collegeName) ||
      Boolean((studentProfile as any)?.companyName) ||
      Boolean((studentProfile as any)?.organization) ||
      Boolean(studentProfile?.githubUsername) ||
      Boolean(studentProfile?.displayName) ||
      Boolean(user?.displayName) ||
      Boolean(user?.email)
    )
  );

  const handleEnrollClick = (project: ArenaProject) => {
    const isEnrolledInThis = activeEnrollments.some((e) => e.projectId === project.id);
    if (isEnrolledInThis) return;

    const isTargetBabyStep = project.difficulty === "Baby Step";
    const hasBabyStepActive = activeEnrollments.some((e) => e.difficulty === "Baby Step");
    const hasNonBabyStepActive = activeEnrollments.some((e) => e.difficulty !== "Baby Step");

    if (isTargetBabyStep) {
      if (hasNonBabyStepActive) {
        const activeDoc = activeEnrollments.find((e) => e.difficulty !== "Baby Step");
        showToast(`Tier Constraint: You are currently enrolled in "${activeDoc?.projectTitle || "Active Project"}". Complete it to unlock Baby Step tracks.`, "warning");
        return;
      }
      const babyStepCount = activeEnrollments.filter((e) => e.difficulty === "Baby Step").length;
      if (babyStepCount >= 2) {
        showToast("Baby Step Limit Reached: Maximum 2 active Baby Step projects allowed. Complete or leave one to continue.", "warning");
        return;
      }
    } else {
      if (hasBabyStepActive) {
        showToast("Tier Constraint: You currently have active Baby Step enrollments. Complete them first before enrolling in main tracks.", "warning");
        return;
      }
      if (activeEnrollments.length >= 1) {
        showToast(`Single Project Limit: You are currently enrolled in "${activeEnrollments[0].projectTitle}". Complete it before taking a new track.`, "warning");
        return;
      }
    }

    setSelectedProjectForEnroll(project);
    if (!isProfileComplete) {
      setShowGateModal(true);
    } else {
      setShowEnrollModal(true);
    }
  };

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedProjectForEnroll) return;

    setEnrolling(true);
    setEnrollError("");

    try {
      const res = await fetch("/api/arena/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: studentProfile?.displayName || user.displayName || "Botmartz Builder",
          email: user.email,
          whatsapp: studentProfile?.phoneNumber || "Not provided",
          github: studentProfile?.githubUsername || "",
          linkedin: studentProfile?.linkedinUrl || "",
          role: enrollRole,
          projectId: selectedProjectForEnroll.id,
          projectTitle: selectedProjectForEnroll.title,
          difficulty: selectedProjectForEnroll.difficulty,
          teamType: enrollTeamType,
          dpdpConsent: true
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to complete enrollment.");
      }

      setEnrollSuccess(true);
      if (data.enrollment) {
        setUserEnrollments((prev) => [data.enrollment, ...prev]);
      }
    } catch (err: any) {
      setEnrollError(err.message || "Enrollment failed. Please try again.");
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <div className="bg-[#FAFCFF] min-h-screen text-slate-900 pt-24 pb-28 font-sans selection:bg-[#0066FF] selection:text-white">
      {/* ── 1. HEADER SECTION (REDESIGNED HERO CARD) ── */}
      <section className="w-full px-4 sm:px-8 lg:px-12 mb-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-8 sm:p-12 border-2 border-slate-800 shadow-2xl hover:border-blue-500/40 transition-all duration-500 group">
          {/* Background Ambient Glows */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/25 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            {/* Left Column: Badge, Title & Description */}
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/15 text-cyan-300 font-mono text-xs font-extrabold border border-cyan-500/30 backdrop-blur-md shadow-xs">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
                </span>
                <Layers size={14} className="text-cyan-400" />
                <span>45-DAY VIRTUAL INTERNSHIP &amp; PRODUCTION SYSTEMS</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-sans leading-tight">
                Software Engineering <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">Playground</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed font-normal">
                Select an industrial-grade production system, inspect the PRD, and ship verifiable code with daily proof-of-work.
              </p>

              {/* Stats Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2 font-mono text-xs">
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md hover:bg-white/15 transition-all duration-300">
                  <Layers size={18} className="text-blue-400 shrink-0" />
                  <div>
                    <div className="text-white font-bold text-sm">{allProjectsList.length}+</div>
                    <div className="text-slate-300 text-[10px]">Production PRDs</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md hover:bg-white/15 transition-all duration-300">
                  <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-white font-bold text-sm">100%</div>
                    <div className="text-emerald-300 text-[10px] font-bold">Verifiable PoW</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md hover:bg-white/15 transition-all duration-300">
                  <Flame size={18} className="text-amber-400 shrink-0" />
                  <div>
                    <div className="text-white font-bold text-sm">Daily</div>
                    <div className="text-amber-300 text-[10px] font-bold">Standup Streak</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md hover:bg-white/15 transition-all duration-300">
                  <Briefcase size={18} className="text-purple-400 shrink-0" />
                  <div>
                    <div className="text-white font-bold text-sm">45-Day</div>
                    <div className="text-slate-300 text-[10px]">Virtual Internship</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: CTA Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 font-mono text-xs shrink-0 self-start lg:self-center">
              <Link
                href="/arena/custom-project"
                className="px-7 py-4 rounded-2xl bg-gradient-to-r from-[#0066FF] via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 text-white font-extrabold transition-all duration-300 shadow-xl hover:shadow-blue-500/30 flex items-center justify-center gap-2.5 group cursor-pointer hover:scale-105 active:scale-95 text-sm"
              >
                <Sparkles size={16} className="text-amber-300 group-hover:scale-110 transition-transform" />
                <span>Propose Custom System</span>
                <ArrowRight size={15} className="text-cyan-300 group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>

              <Link
                href="/arena/daily-log"
                className="px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border-2 border-white/20 text-white font-extrabold transition-all duration-300 backdrop-blur-md flex items-center justify-center gap-2.5 text-sm cursor-pointer hover:scale-105 active:scale-95"
              >
                <Terminal size={16} className="text-cyan-400" />
                <span>Daily Standup Log</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── ACTIVE ENROLLMENT NOTIFICATION BANNER ── */}
      {activeEnrollment && (
        <section className="w-full px-4 sm:px-8 lg:px-12 mb-6">
          <div className="p-4 sm:p-5 rounded-3xl bg-blue-50/90 border-2 border-[#0066FF]/40 text-[#0066FF] font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0066FF] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Lock size={18} />
              </div>
              <div>
                <div className="font-extrabold font-sans text-slate-900 text-sm flex items-center gap-2">
                  <span>Single Project Enrollment Limit Active</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono">1 Active Track</span>
                </div>
                <p className="text-xs text-slate-600 font-mono mt-0.5">
                  You are currently building <strong>{activeEnrollment.projectTitle}</strong>. Complete or leave this track to unlock other projects.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <Link
                href={`/arena/${activeEnrollment.projectId}`}
                className="px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold transition-all shadow-xs"
              >
                Open PRD &rarr;
              </Link>
              <Link
                href="/profile"
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border-2 border-slate-300 font-bold transition-all"
              >
                My Profile
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── 2. FILTER & SEARCH BAR ── */}
      <section className="w-full px-4 sm:px-8 lg:px-12 mb-8">
        <div className="bg-white border-2 border-slate-300 rounded-3xl p-5 sm:p-6 shadow-md hover:shadow-lg transition-all duration-300 space-y-4">
          
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search systems by keyword, algorithm, tech stack (PyTorch, Rust, PostGIS, LangGraph, Docker)..."
                className="w-full bg-slate-50 border-2 border-slate-300 rounded-2xl pl-12 pr-12 py-3.5 text-xs sm:text-sm font-mono text-slate-950 placeholder:text-slate-500 focus:bg-white focus:outline-none focus:border-[#0066FF] transition-all duration-200 font-bold"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 font-mono text-xs font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Domain Dropdown */}
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="w-full sm:w-64 bg-slate-50 border-2 border-slate-300 rounded-2xl px-4 py-3.5 text-xs sm:text-sm font-mono text-slate-950 focus:bg-white focus:outline-none focus:border-[#0066FF] transition-all duration-200 font-bold"
            >
              <option value="All">All Domains ({allProjectsList.length})</option>
              {allDomains.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Tier Selector Pills */}
          <div className="flex items-center justify-between gap-2.5 flex-wrap pt-3 border-t-2 border-slate-100 font-sans text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-slate-500 text-xs font-black font-mono uppercase tracking-wider mr-1">Tier:</span>
              {(["All", "Baby Step", "Easy", "Intermediate", "Hard", "Insane", "Go To Hell"] as const).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setActiveTier(tier)}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs rounded-xl font-extrabold transition-all duration-200 cursor-pointer border-2 ${
                    activeTier === tier
                      ? "bg-[#0066FF] text-white border-[#0066FF] shadow-md scale-[1.02]"
                      : "bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-slate-200/70"
                  }`}
                >
                  {tier === "All" ? `All Systems (${filteredProjects.length})` : tier === "Go To Hell" ? "Go To Hell 💀" : tier}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-600 font-mono font-bold">
              Showing {paginatedProjects.length} of {filteredProjects.length} Systems
            </div>
          </div>

        </div>
      </section>

      {/* ── 3. SIMPLIFIED 4-COLUMN PROJECTS GRID ── */}
      <section className="w-full px-4 sm:px-8 lg:px-12 mb-12">
        {paginatedProjects.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border-2 border-slate-300 text-center space-y-4 shadow-md">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto border-2 border-slate-200">
              <Search size={26} />
            </div>
            <h3 className="text-lg font-black text-slate-950 font-sans">No projects match your filter</h3>
            <p className="text-xs text-slate-600 font-mono">Try searching for a different keyword or resetting domain filters.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedDomain("All");
                setActiveTier("All");
              }}
              className="px-6 py-3 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-mono text-xs font-extrabold cursor-pointer transition-all shadow-md"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedProjects.map((project) => {
              const isThisEnrolled = activeEnrollments.some((e) => e.projectId === project.id);

              let isCardLocked = false;
              let cardLockReason = "";

              if (!isThisEnrolled && activeEnrollments.length > 0) {
                const isTargetBabyStep = project.difficulty === "Baby Step";
                const hasBabyStepActive = activeEnrollments.some((e) => e.difficulty === "Baby Step");
                const hasNonBabyStepActive = activeEnrollments.some((e) => e.difficulty !== "Baby Step");

                if (isTargetBabyStep) {
                  if (hasNonBabyStepActive) {
                    isCardLocked = true;
                    const activeDoc = activeEnrollments.find((e) => e.difficulty !== "Baby Step");
                    cardLockReason = `Locked: You are currently enrolled in a non-Baby Step project ("${activeDoc?.projectTitle || "Active Track"}"). Complete or leave it to unlock Baby Step projects.`;
                  } else {
                    const babyStepCount = activeEnrollments.filter((e) => e.difficulty === "Baby Step").length;
                    if (babyStepCount >= 2) {
                      isCardLocked = true;
                      cardLockReason = "Locked: Maximum 2 Baby Step projects reached. Complete or leave one on your profile to enroll in another.";
                    }
                  }
                } else {
                  if (hasBabyStepActive) {
                    isCardLocked = true;
                    cardLockReason = "Locked: You have active Baby Step enrollments. Complete or leave your Baby Step projects to unlock non-Baby Step tracks.";
                  } else if (activeEnrollments.length >= 1) {
                    isCardLocked = true;
                    cardLockReason = `Locked: You are currently enrolled in "${activeEnrollments[0].projectTitle}". Complete or leave it to unlock this project.`;
                  }
                }
              }

              return (
                <div
                  key={project.id}
                  className={`bg-white border-2 rounded-3xl p-6 sm:p-7 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between space-y-5 group ${
                    isThisEnrolled
                      ? "border-emerald-500 ring-2 ring-emerald-500/20"
                      : isCardLocked
                      ? "border-slate-200 opacity-90"
                      : "border-slate-300 hover:border-[#0066FF] hover:-translate-y-1.5"
                  }`}
                >
                  <div>
                    {/* Card Header: Difficulty & Domain */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-3 py-1 rounded-full bg-blue-100/70 text-[#0066FF] font-mono text-[10px] font-black border border-blue-300 uppercase tracking-wider">
                        {project.domain}
                      </span>
                      {isThisEnrolled ? (
                        <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border-2 border-emerald-300 flex items-center gap-1">
                          <CheckCircle2 size={10} /> Active Track
                        </span>
                      ) : isCardLocked ? (
                        <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-500 border-2 border-slate-200 flex items-center gap-1" title={cardLockReason}>
                          <Lock size={10} /> Locked
                        </span>
                      ) : (
                        <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-black uppercase tracking-wider border-2 ${
                          project.difficulty === "Go To Hell" || project.difficulty === "Expert Tier"
                            ? "bg-slate-950 text-purple-300 border-purple-800"
                            : project.difficulty === "Insane" 
                            ? "bg-rose-100 text-rose-800 border-rose-300" 
                            : project.difficulty === "Hard"
                            ? "bg-amber-100 text-amber-900 border-amber-300"
                            : project.difficulty === "Intermediate"
                            ? "bg-blue-100 text-[#0066FF] border-blue-300"
                            : project.difficulty === "Easy"
                            ? "bg-cyan-100 text-cyan-900 border-cyan-300"
                            : "bg-emerald-100 text-emerald-900 border-emerald-300"
                        }`}>
                          {project.difficulty === "Expert Tier" ? "Go To Hell" : project.difficulty}
                        </span>
                      )}
                    </div>

                    {/* Title & Overview */}
                    <h3 className="text-base font-extrabold text-slate-950 font-sans group-hover:text-[#0066FF] transition-colors duration-200 line-clamp-2 mb-2 leading-snug">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-600 font-sans line-clamp-3 leading-relaxed mb-4 font-medium">
                      {project.overview}
                    </p>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t-2 border-slate-100">
                      {project.techStack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-mono text-[10px] font-bold border border-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 4 && (
                        <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-500 font-mono text-[10px] font-bold border border-slate-300">
                          +{project.techStack.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 2 Clean Action Buttons */}
                  <div className="flex items-center gap-2.5 pt-4 border-t-2 border-slate-100 font-mono text-xs">
                    <Link
                      href={`/arena/${project.id}`}
                      className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-200 text-slate-800 font-extrabold text-center transition-all duration-200 flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <span>Inspect PRD</span>
                      <ExternalLink size={12} />
                    </Link>

                    {isThisEnrolled ? (
                      <Link
                        href={`/arena/${project.id}`}
                        className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 border-2 border-emerald-600 text-white font-extrabold text-center transition-all duration-200 shadow-md flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 size={13} />
                        <span>Enrolled</span>
                      </Link>
                    ) : isCardLocked ? (
                      <button
                        disabled
                        title={cardLockReason}
                        className="flex-1 py-3 rounded-2xl bg-slate-100 border-2 border-slate-200 text-slate-400 font-extrabold text-center transition-all duration-200 opacity-70 cursor-not-allowed flex items-center justify-center gap-1.5"
                      >
                        <Lock size={12} className="text-slate-400" />
                        <span>Locked</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEnrollClick(project)}
                        className="flex-1 py-3 rounded-2xl bg-[#0066FF] hover:bg-blue-600 border-2 border-[#0066FF] text-white font-extrabold text-center transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Enroll</span>
                        <ArrowRight size={13} />
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* ── 4. PAGINATION CONTROLS ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-12 font-mono text-xs">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-5 py-2.5 rounded-2xl bg-white border-2 border-slate-300 text-slate-800 font-extrabold disabled:opacity-40 hover:bg-slate-50 transition-all cursor-pointer shadow-xs"
            >
              &larr; Prev
            </button>
            <span className="px-5 py-2.5 rounded-2xl bg-slate-100 border-2 border-slate-200 font-black text-slate-900">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-5 py-2.5 rounded-2xl bg-white border-2 border-slate-300 text-slate-800 font-extrabold disabled:opacity-40 hover:bg-slate-50 transition-all cursor-pointer shadow-xs"
            >
              Next &rarr;
            </button>
          </div>
        )}
      </section>

      {/* ── 5. QUICK FREE TOOLS STRIP ── */}
      <section className="w-full px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 font-sans text-xs">
          <Link
            href="/arena/roadmaps"
            className="p-6 rounded-3xl bg-white border-2 border-slate-300 hover:border-[#0066FF] transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 block group"
          >
            <BookOpen size={24} className="text-[#0066FF] mb-3 group-hover:scale-110 transition-transform duration-300" />
            <h4 className="font-extrabold text-slate-950 font-sans text-base group-hover:text-[#0066FF] transition-colors">50 Role Roadmaps (Free)</h4>
            <p className="text-slate-600 text-xs font-sans mt-1.5 font-medium leading-relaxed">Prerequisites &amp; architecture milestones for every track.</p>
          </Link>

          <Link
            href="/arena/career-checklist"
            className="p-6 rounded-3xl bg-white border-2 border-slate-300 hover:border-emerald-600 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 block group"
          >
            <Star size={24} className="text-emerald-600 mb-3 group-hover:scale-110 transition-transform duration-300" />
            <h4 className="font-extrabold text-slate-950 font-sans text-base group-hover:text-emerald-700 transition-colors">LinkedIn UGC Promoter</h4>
            <p className="text-slate-600 text-xs font-sans mt-1.5 font-medium leading-relaxed">Share daily build logs &amp; earn +50 Karma Coins per post.</p>
          </Link>

          <Link
            href="/arena/daily-log"
            className="p-6 rounded-3xl bg-white border-2 border-slate-300 hover:border-purple-600 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 block group"
          >
            <Terminal size={24} className="text-purple-600 mb-3 group-hover:scale-110 transition-transform duration-300" />
            <h4 className="font-extrabold text-slate-950 font-sans text-base group-hover:text-purple-600 transition-colors">Daily PoW Logger</h4>
            <p className="text-slate-600 text-xs font-sans mt-1.5 font-medium leading-relaxed">Submit daily GitHub commits to build your verified streak.</p>
          </Link>
        </div>
      </section>

      {/* ── 6. 1-CLICK STREAMLINED ENROLLMENT MODAL ── */}
      {showEnrollModal && selectedProjectForEnroll && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 backdrop-blur-md p-4 sm:p-6">
          <div className="min-h-full flex items-center justify-center">
            <div className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 text-slate-900">
            
            <button
              onClick={() => {
                setShowEnrollModal(false);
                setEnrollSuccess(false);
                setEnrollError("");
              }}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X size={18} />
            </button>

            {enrollSuccess ? (
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-xl font-bold font-sans text-slate-900">
                  Enrolled in {selectedProjectForEnroll.title}!
                </h3>
                <p className="text-xs text-slate-600 font-sans max-w-md mx-auto">
                  Your onboarding email with GitHub checklist and PRD specifications has been sent to <strong>{user?.email}</strong>.
                </p>

                {/* Paid Track Upgrade Box */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 to-blue-950 text-white text-left border border-blue-500/30 space-y-3 font-mono text-xs">
                  <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-[10px] uppercase">
                    <Sparkles size={13} />
                    <span>UPGRADE TO 1-MONTH VIRTUAL AI INTERNSHIP</span>
                  </div>
                  <h4 className="text-sm font-bold font-sans text-white">
                    Get Code Audits, QR Certificate &amp; 15 Referrals
                  </h4>
                  <p className="text-[11px] text-slate-300 font-sans">
                    Solo Fellow Track: <strong>₹299</strong> &bull; Squad Track: <strong>₹1,999</strong>
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowRazorpayModal(true)}
                    className="w-full py-2.5 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-center transition-all shadow-sm cursor-pointer block"
                  >
                    Upgrade to Paid Fellow Track (₹299) →
                  </button>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Link
                    href={`/arena/${selectedProjectForEnroll.id}`}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-xs font-bold text-center"
                  >
                    Open PRD Blueprint
                  </Link>
                  <Link
                    href="/profile"
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold text-center"
                  >
                    Go to Profile Workspace
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-[11px] font-mono text-[#0066FF] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-emerald-500" />
                  <span>INSTANT ENROLLMENT</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 font-sans">
                  Enroll in {selectedProjectForEnroll.title}
                </h3>
                <p className="text-xs text-slate-500 font-sans mt-1">
                  Start logging your daily commits, earning Karma, and building your verified proof-of-work.
                </p>

                {enrollError && (
                  <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-mono text-xs">
                    {enrollError}
                  </div>
                )}

                <form onSubmit={handleEnrollSubmit} className="mt-5 space-y-4 font-mono text-xs">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Student Builder</label>
                    <input
                      type="text"
                      disabled
                      value={`${studentProfile?.displayName || user?.displayName || "Builder"} (${user?.email})`}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-600 font-sans text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Primary Role</label>
                      <select
                        value={enrollRole}
                        onChange={(e) => setEnrollRole(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                      >
                        <option value="AI Engineer">AI Engineer</option>
                        <option value="Backend Dev">Backend Dev</option>
                        <option value="Frontend Dev">Frontend Dev</option>
                        <option value="Fullstack Dev">Fullstack Dev</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Format</label>
                      <select
                        value={enrollTeamType}
                        onChange={(e) => setEnrollTeamType(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                      >
                        <option value="Solo">Solo Shipper</option>
                        <option value="Squad">Squad Team</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 font-sans">
                    ✨ <strong>What happens next:</strong> You will receive an immediate confirmation email with repo setup checklist, daily log instructions, and Discord access.
                  </div>

                  <div className="pt-3 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowEnrollModal(false)}
                      className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={enrolling}
                      className="flex-2 py-3 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {enrolling ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          <span>Enrolling...</span>
                        </>
                      ) : (
                        <span>Confirm Enrollment</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>
      </div>
    )}

      {/* ── 7. REUSABLE BUILDER PROFILE GATE MODAL ── */}
      <BuilderProfileGateModal
        isOpen={showGateModal}
        onClose={() => setShowGateModal(false)}
        title="Complete Builder Profile to Enroll"
        description="To track your 45-day commit progress, assign PRD repositories, and verify your university graduation year for company referrals, a completed profile is mandatory."
        requiredActionName="Arena Project Enrollment"
      />

      {/* ── 8. RAZORPAY CHECKOUT MODAL ── */}
      <RazorpayModal
        isOpen={showRazorpayModal}
        onClose={() => setShowRazorpayModal(false)}
        amount={299}
        itemName="Verified Student Fellow Track (1-Month Virtual AI Internship)"
        description="Unlock formal cryptographic QR certificates, weekly architecture reviews, and automated SLA test gates."
        itemCategory="FELLOWSHIP_PASS"
      />

    </div>
  );
}
