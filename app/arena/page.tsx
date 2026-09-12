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
import BuilderProfileGateModal from "@/app/_components/BuilderProfileGateModal";
import RazorpayModal from "@/app/_components/RazorpayModal";

export default function ArenaPage() {
  const { user, studentProfile } = useAuth();

  // State for Catalog
  const [allProjectsList, setAllProjectsList] = useState<ArenaProject[]>(ARENA_PROJECTS);
  const [activeTier, setActiveTier] = useState<"All" | "Baby Step" | "Easy" | "Intermediate" | "Hard" | "Insane" | "Go To Hell">("All");
  const [selectedDomain, setSelectedDomain] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 9;

  // Enrollment & Gating States
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
    user &&
    studentProfile?.collegeName &&
    studentProfile?.studentIdRollNo
  );

  const handleEnrollClick = (project: ArenaProject) => {
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
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 p-6 sm:p-10 border border-slate-800 shadow-2xl">
          {/* Background Ambient Glows */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            {/* Left Column: Badge, Title & Description */}
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-cyan-400 font-mono text-xs font-bold border border-cyan-500/20 backdrop-blur-md shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <Layers size={14} className="text-cyan-400" />
                <span>45-DAY VIRTUAL INTERNSHIP & PRODUCTION SYSTEMS</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-sans leading-tight">
                Software Engineering <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">Playground</span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                Select an industrial-grade production system, inspect the PRD, and ship verifiable code with daily proof-of-work.
              </p>

              {/* Stats Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono text-xs">
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <Layers size={16} className="text-blue-400 shrink-0" />
                  <div>
                    <div className="text-white font-bold text-sm">59+</div>
                    <div className="text-slate-400 text-[10px]">Production PRDs</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-white font-bold text-sm">100%</div>
                    <div className="text-slate-400 text-[10px]">Verifiable PoW</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <Flame size={16} className="text-amber-400 shrink-0" />
                  <div>
                    <div className="text-white font-bold text-sm">Daily</div>
                    <div className="text-slate-400 text-[10px]">Standup Streak</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <Briefcase size={16} className="text-purple-400 shrink-0" />
                  <div>
                    <div className="text-white font-bold text-sm">45-Day</div>
                    <div className="text-slate-400 text-[10px]">Virtual Internship</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: CTA Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 font-mono text-xs shrink-0 self-start lg:self-center">
              <Link
                href="/arena/custom-project"
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2.5 group"
              >
                <Sparkles size={16} className="text-amber-300 group-hover:scale-110 transition-transform" />
                <span>Propose Custom System</span>
                <ArrowRight size={14} className="text-cyan-300 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/arena/daily-log"
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold transition-all backdrop-blur-md flex items-center justify-center gap-2.5"
              >
                <Terminal size={16} className="text-cyan-400" />
                <span>Daily Standup Log</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. FILTER & SEARCH BAR ── */}
      <section className="w-full px-4 sm:px-8 lg:px-12 mb-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
          
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search systems by keyword, algorithm, tech stack (PyTorch, Rust, PostGIS, LangGraph, Docker)..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#0066FF] transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-mono text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Domain Dropdown */}
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="w-full sm:w-64 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF] transition-all"
            >
              <option value="All">All Domains ({allProjectsList.length})</option>
              {allDomains.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Tier Selector Pills */}
          <div className="flex items-center justify-between gap-2 flex-wrap pt-2 border-t border-slate-100 font-mono text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-slate-400 text-[11px] uppercase font-bold mr-1">Tier:</span>
              {(["All", "Baby Step", "Easy", "Intermediate", "Hard", "Insane", "Go To Hell"] as const).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setActiveTier(tier)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    activeTier === tier
                      ? "bg-[#0066FF] text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tier === "All" ? `All Systems (${filteredProjects.length})` : tier === "Go To Hell" ? "Go To Hell 💀" : tier}
                </button>
              ))}
            </div>

            <div className="text-[11px] text-slate-500">
              Showing {paginatedProjects.length} of {filteredProjects.length} Systems
            </div>
          </div>

        </div>
      </section>

      {/* ── 3. SIMPLIFIED 4-COLUMN PROJECTS GRID ── */}
      <section className="w-full px-4 sm:px-8 lg:px-12 mb-12">
        {paginatedProjects.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search size={22} />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-sans">No projects match your filter</h3>
            <p className="text-xs text-slate-500 font-mono">Try searching for a different keyword or resetting domain filters.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedDomain("All");
                setActiveTier("All");
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white font-mono text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white border border-slate-200 hover:border-blue-400/80 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5 group"
              >
                <div>
                  {/* Card Header: Difficulty & Domain */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0066FF] font-mono text-[10px] font-bold border border-blue-100">
                      {project.domain}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                      project.difficulty === "Go To Hell" || project.difficulty === "Expert Tier"
                        ? "bg-slate-950 text-purple-300 border border-purple-800"
                        : project.difficulty === "Insane" 
                        ? "bg-rose-100 text-rose-800 border border-rose-200" 
                        : project.difficulty === "Hard"
                        ? "bg-amber-100 text-amber-800 border border-amber-200"
                        : project.difficulty === "Intermediate"
                        ? "bg-blue-100 text-[#0066FF] border border-blue-200"
                        : project.difficulty === "Easy"
                        ? "bg-cyan-100 text-cyan-800 border border-cyan-200"
                        : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    }`}>
                      {project.difficulty === "Expert Tier" ? "Go To Hell" : project.difficulty}
                    </span>
                  </div>

                  {/* Title & Overview */}
                  <h3 className="text-base font-bold text-slate-900 font-sans group-hover:text-[#0066FF] transition-colors line-clamp-2 mb-2 leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-sans line-clamp-3 leading-relaxed mb-4">
                    {project.overview}
                  </p>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 font-mono text-[10px] font-medium border border-slate-200/60"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 4 && (
                      <span className="px-1.5 py-0.5 rounded-md bg-slate-50 text-slate-400 font-mono text-[10px]">
                        +{project.techStack.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* 2 Clean Action Buttons */}
                <div className="flex items-center gap-2 pt-4 border-t border-slate-100 font-mono text-xs">
                  <Link
                    href={`/arena/${project.id}`}
                    className="flex-1 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-center transition-all flex items-center justify-center gap-1"
                  >
                    <span>Inspect PRD</span>
                    <ExternalLink size={11} />
                  </Link>

                  <button
                    onClick={() => handleEnrollClick(project)}
                    className="flex-1 py-2.5 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-center transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Enroll</span>
                    <ArrowRight size={12} />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* ── 4. PAGINATION CONTROLS ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10 font-mono text-xs">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold disabled:opacity-40 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              &larr; Prev
            </button>
            <span className="px-4 py-2 font-bold text-slate-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold disabled:opacity-40 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Next &rarr;
            </button>
          </div>
        )}
      </section>

      {/* ── 5. QUICK FREE TOOLS STRIP ── */}
      <section className="w-full px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          <Link
            href="/arena/roadmaps"
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 transition-all shadow-xs block"
          >
            <BookOpen size={20} className="text-[#0066FF] mb-2" />
            <h4 className="font-bold text-slate-900 font-sans text-sm">50 Role Roadmaps (Free)</h4>
            <p className="text-slate-500 text-[11px] font-sans mt-1">Prerequisites &amp; architecture milestones for every track.</p>
          </Link>

          <Link
            href="/arena/career-checklist"
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 transition-all shadow-xs block"
          >
            <Star size={20} className="text-emerald-600 mb-2" />
            <h4 className="font-bold text-slate-900 font-sans text-sm">LinkedIn UGC Promoter</h4>
            <p className="text-slate-500 text-[11px] font-sans mt-1">Share daily build logs &amp; earn +50 Karma Coins per post.</p>
          </Link>

          <Link
            href="/arena/daily-log"
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 transition-all shadow-xs block"
          >
            <Terminal size={20} className="text-purple-600 mb-2" />
            <h4 className="font-bold text-slate-900 font-sans text-sm">Daily PoW Logger</h4>
            <p className="text-slate-500 text-[11px] font-sans mt-1">Submit daily GitHub commits to build your verified streak.</p>
          </Link>
        </div>
      </section>

      {/* ── 6. 1-CLICK STREAMLINED ENROLLMENT MODAL ── */}
      {showEnrollModal && selectedProjectForEnroll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 relative text-slate-900">
            
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
