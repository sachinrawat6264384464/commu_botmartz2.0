"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Sparkles,
  Flame,
  Search,
  ExternalLink,
  Layers,
  ArrowRight,
  ChevronDown,
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
import { getDefaultArenaProjectImage } from "@/lib/arena-project-images";
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
  const [domainMenuOpen, setDomainMenuOpen] = useState(false);
  const domainMenuRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (domainMenuRef.current && !domainMenuRef.current.contains(event.target as Node)) {
        setDomainMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  // Fetch live Arena projects from Firestore database
  useEffect(() => {
    fetch("/api/arena/projects", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.projects) && data.projects.length > 0) {
          setAllProjectsList(data.projects);
        }
      })
      .catch((e) => console.warn("Could not fetch arena projects from DB:", e));
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
    <div
      className="bg-white min-h-screen text-slate-900 pt-24 pb-24 font-sans selection:bg-[#D9F83B] selection:text-slate-950"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(29, 49, 137, 0.11) 1px, transparent 1px), linear-gradient(to bottom, rgba(29, 49, 137, 0.11) 1px, transparent 1px)",
        backgroundSize: "72px 72px",
      }}
    >
      {/* ── 1. HEADER SECTION (REDESIGNED HERO CARD) ── */}
      <section className="w-full px-4 sm:px-8 lg:px-12 mb-8">
        <div
          className="relative overflow-hidden rounded-3xl bg-[#162774] p-7 sm:p-10 border border-white/15 shadow-2xl"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        >
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            {/* Left Column: Badge, Title & Description */}
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D9F83B] text-slate-950 font-sans text-[11px] font-extrabold uppercase tracking-wider shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-60"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-950"></span>
                </span>
                <span>Virtual AI Internship &amp; Production Systems</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-sans leading-tight">
                Software Engineering <span className="text-[#D9F83B]">Playground</span>
              </h1>

              <p className="text-sm sm:text-base text-blue-100/85 font-sans leading-relaxed font-normal max-w-2xl">
                Select an industrial-grade production system, inspect the PRD, and ship verifiable code with daily proof-of-work.
              </p>

              {/* Stats Strip (Editorial Cards, No Icons) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-sans">
                <div className="group/stat relative overflow-hidden p-3.5 rounded-2xl bg-white/[0.06] border border-white/15 border-l-4 border-l-[#D9F83B] cursor-pointer transition-all duration-500">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-white -translate-y-full group-hover/stat:translate-y-0 transition-transform duration-700 ease-in-out"
                  />
                  <span className="absolute top-2.5 right-2.5 z-10 w-6 h-6 rounded-full bg-[#D9F83B] group-hover/stat:bg-[#162774] text-slate-950 group-hover/stat:text-[#D9F83B] font-extrabold text-[10px] flex items-center justify-center shadow-xs select-none transition-colors duration-500">01</span>
                  <div className="relative z-10 text-white group-hover/stat:text-slate-950 font-extrabold text-base transition-colors duration-500">{allProjectsList.length}+</div>
                  <div className="relative z-10 text-blue-200/80 group-hover/stat:text-slate-600 text-[11px] font-semibold transition-colors duration-500">Production PRDs</div>
                </div>

                <div className="group/stat relative overflow-hidden p-3.5 rounded-2xl bg-white/[0.06] border border-white/15 border-l-4 border-l-[#D9F83B] cursor-pointer transition-all duration-500">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-white -translate-y-full group-hover/stat:translate-y-0 transition-transform duration-700 ease-in-out"
                  />
                  <span className="absolute top-2.5 right-2.5 z-10 w-6 h-6 rounded-full bg-[#D9F83B] group-hover/stat:bg-[#162774] text-slate-950 group-hover/stat:text-[#D9F83B] font-extrabold text-[10px] flex items-center justify-center shadow-xs select-none transition-colors duration-500">02</span>
                  <div className="relative z-10 text-white group-hover/stat:text-slate-950 font-extrabold text-base transition-colors duration-500">100%</div>
                  <div className="relative z-10 text-[#D9F83B] group-hover/stat:text-[#1D3189] text-[11px] font-semibold transition-colors duration-500">Verifiable PoW</div>
                </div>

                <div className="group/stat relative overflow-hidden p-3.5 rounded-2xl bg-white/[0.06] border border-white/15 border-l-4 border-l-[#D9F83B] cursor-pointer transition-all duration-500">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-white -translate-y-full group-hover/stat:translate-y-0 transition-transform duration-700 ease-in-out"
                  />
                  <span className="absolute top-2.5 right-2.5 z-10 w-6 h-6 rounded-full bg-[#D9F83B] group-hover/stat:bg-[#162774] text-slate-950 group-hover/stat:text-[#D9F83B] font-extrabold text-[10px] flex items-center justify-center shadow-xs select-none transition-colors duration-500">03</span>
                  <div className="relative z-10 text-white group-hover/stat:text-slate-950 font-extrabold text-base transition-colors duration-500">Daily</div>
                  <div className="relative z-10 text-[#D9F83B] group-hover/stat:text-[#1D3189] text-[11px] font-semibold transition-colors duration-500">Standup Streak</div>
                </div>

                <div className="group/stat relative overflow-hidden p-3.5 rounded-2xl bg-white/[0.06] border border-white/15 border-l-4 border-l-[#D9F83B] cursor-pointer transition-all duration-500">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-white -translate-y-full group-hover/stat:translate-y-0 transition-transform duration-700 ease-in-out"
                  />
                  <span className="absolute top-2.5 right-2.5 z-10 w-6 h-6 rounded-full bg-[#D9F83B] group-hover/stat:bg-[#162774] text-slate-950 group-hover/stat:text-[#D9F83B] font-extrabold text-[10px] flex items-center justify-center shadow-xs select-none transition-colors duration-500">04</span>
                  <div className="relative z-10 text-white group-hover/stat:text-slate-950 font-extrabold text-base transition-colors duration-500">4-Week</div>
                  <div className="relative z-10 text-blue-200/80 group-hover/stat:text-slate-600 text-[11px] font-semibold transition-colors duration-500">Virtual Internship</div>
                </div>
              </div>
            </div>

            {/* Right Column: CTA Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 font-sans text-sm shrink-0 self-start lg:self-center">
              <Link
                href="/arena/custom-project"
                className="relative overflow-hidden px-6 py-3.5 rounded-2xl bg-[#D9F83B] text-slate-950 font-bold transition-all duration-300 shadow-lg shadow-lime-400/20 flex items-center justify-between gap-3 group cursor-pointer"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-white -translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out"
                />
                <span className="relative z-10">Propose Custom System</span>
                <span className="relative z-10 w-7 h-7 rounded-full bg-slate-950 text-[#D9F83B] flex items-center justify-center transition-transform duration-300 group-hover:rotate-45">
                  <ArrowRight size={14} />
                </span>
              </Link>

              <Link
                href="/arena/daily-log"
                className="group relative overflow-hidden px-6 py-3.5 rounded-2xl bg-white/10 border border-white/25 hover:border-white text-white font-bold transition-all duration-300 flex items-center justify-center text-center cursor-pointer"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-white -translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out"
                />
                <span className="relative z-10 group-hover:text-slate-950 transition-colors duration-500">
                  Daily Standup Log
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── ACTIVE ENROLLMENT NOTIFICATION BANNER ── */}
      {activeEnrollment && (
        <section className="w-full px-4 sm:px-8 lg:px-12 mb-6">
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#1D3189]/30 text-slate-900 font-sans text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div>
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span>Single Project Enrollment Limit Active</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#D9F83B] text-slate-950 text-[10px] font-bold">1 Active Track</span>
              </div>
              <p className="text-xs text-slate-600 font-sans mt-0.5">
                You are currently building <strong>{activeEnrollment.projectTitle}</strong>. Complete or leave this track to unlock other projects.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <Link
                href={`/arena/${activeEnrollment.projectId}`}
                className="px-4 py-2 rounded-xl bg-[#1D3189] hover:bg-[#152468] text-white font-bold transition-all shadow-xs"
              >
                Open PRD &rarr;
              </Link>
              <Link
                href="/profile"
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-bold transition-all"
              >
                My Profile
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── 2. FILTER & SEARCH BAR ── */}
      <section className="w-full px-4 sm:px-8 lg:px-12 mb-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-md space-y-4">

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search systems by keyword, algorithm, tech stack (PyTorch, Rust, PostGIS, LangGraph, Docker)..."
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 pr-14 py-3 text-xs sm:text-sm font-sans text-slate-950 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#1D3189] transition-all duration-200 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 font-sans text-xs font-bold cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Custom Domain Dropdown with Rotating Circle Arrow */}
            <div ref={domainMenuRef} className="relative w-full sm:w-72">
              <button
                type="button"
                onClick={() => setDomainMenuOpen((prev) => !prev)}
                className={`w-full bg-slate-50 border-2 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-sans text-slate-950 focus:outline-none transition-all duration-300 font-semibold cursor-pointer flex items-center justify-between gap-3 group ${domainMenuOpen ? "border-[#1D3189] bg-white shadow-md" : "border-slate-200 hover:border-[#1D3189] hover:bg-white"
                  }`}
              >
                <span className="truncate">
                  {selectedDomain === "All" ? `All Domains (${allProjectsList.length})` : selectedDomain}
                </span>
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ease-in-out ${domainMenuOpen
                      ? "bg-[#D9F83B] text-slate-950 rotate-180"
                      : "bg-[#1D3189]/10 text-[#1D3189] group-hover:bg-[#1D3189] group-hover:text-white group-hover:rotate-180"
                    }`}
                >
                  <ChevronDown size={14} />
                </span>
              </button>

              {domainMenuOpen && (
                <div className="absolute right-0 mt-2 w-full sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl p-1.5 z-50 max-h-72 overflow-y-auto space-y-0.5 font-sans">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDomain("All");
                      setDomainMenuOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-between cursor-pointer ${selectedDomain === "All"
                        ? "bg-[#070E54] text-white"
                        : "text-slate-700 hover:bg-[#070E54] hover:text-white"
                      }`}
                  >
                    <span>All Domains ({allProjectsList.length})</span>
                    {selectedDomain === "All" && <span className="w-2 h-2 rounded-full bg-[#D9F83B]" />}
                  </button>

                  {allDomains.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => {
                        setSelectedDomain(d);
                        setDomainMenuOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-between cursor-pointer ${selectedDomain === d
                          ? "bg-[#070E54] text-white"
                          : "text-slate-700 hover:bg-[#070E54] hover:text-white"
                        }`}
                    >
                      <span className="truncate pr-2">{d}</span>
                      {selectedDomain === d && <span className="w-2 h-2 rounded-full bg-[#D9F83B] shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tier Selector Pills */}
          <div className="flex items-center justify-between gap-2.5 flex-wrap pt-3 border-t border-slate-100 font-sans text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-slate-500 text-xs font-bold font-sans uppercase tracking-wider mr-1">Tier:</span>
              {(["All", "Baby Step", "Easy", "Intermediate", "Hard", "Insane", "Go To Hell"] as const).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setActiveTier(tier)}
                  className={`px-3.5 py-1.5 text-[11px] sm:text-xs rounded-xl font-bold transition-all duration-200 cursor-pointer border ${activeTier === tier
                      ? "bg-[#1D3189] text-white border-[#1D3189] shadow-sm"
                      : "bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-200/70"
                    }`}
                >
                  {tier === "All" ? `All Systems (${filteredProjects.length})` : tier}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-500 font-sans font-semibold">
              Showing {paginatedProjects.length} of {filteredProjects.length} Systems
            </div>
          </div>

        </div>
      </section>

      {/* ── 3. SIMPLIFIED 4-COLUMN PROJECTS GRID ── */}
      <section className="w-full px-4 sm:px-8 lg:px-12 mb-12">
        {paginatedProjects.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-4 shadow-md">
            <h3 className="text-lg font-extrabold text-slate-950 font-sans">No projects match your filter</h3>
            <p className="text-xs text-slate-600 font-sans">Try searching for a different keyword or resetting domain filters.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedDomain("All");
                setActiveTier("All");
              }}
              className="px-6 py-3 rounded-2xl bg-[#1D3189] hover:bg-[#152468] text-white font-sans text-xs font-bold cursor-pointer transition-all shadow-md"
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

              const techList = Array.isArray(project.techStack) ? project.techStack : [];
              const difficultyLabel = project.difficulty === "Expert Tier" ? "Go To Hell" : (project.difficulty || "Intermediate");

              return (
                <div
                  key={project.id}
                  className={`relative overflow-hidden bg-[#F4F6FB] hover:bg-[#FAFBFD] border rounded-3xl shadow-md hover:shadow-xl transition-all duration-500 flex flex-col justify-between group ${isThisEnrolled
                      ? "border-emerald-500 ring-2 ring-emerald-500/20"
                      : isCardLocked
                        ? "border-slate-200 opacity-90"
                        : "border-slate-200 hover:border-[#1D3189] hover:-translate-y-1"
                    }`}
                >
                  <div className="relative h-40 sm:h-44 w-full overflow-hidden bg-[#162774] border-b border-slate-200/80">
                    <img
                      src={project.imageUrl || getDefaultArenaProjectImage(project.domain)}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070E54]/85 via-[#070E54]/20 to-transparent"
                    />
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                      <span className="px-3 py-1 rounded-full bg-white/95 text-[#162774] border border-white font-sans text-[10px] font-extrabold uppercase tracking-wider truncate shadow-xs">
                        {project.domain || "AI Systems"}
                      </span>
                      {isThisEnrolled ? (
                        <span className="shrink-0 whitespace-nowrap px-2.5 py-0.5 rounded-full font-sans text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500 text-white shadow-xs">
                          Active Track
                        </span>
                      ) : isCardLocked ? (
                        <span className="shrink-0 whitespace-nowrap px-2.5 py-0.5 rounded-full font-sans text-[10px] font-extrabold uppercase tracking-wider bg-slate-900/90 text-slate-200 border border-white/20 shadow-xs" title={cardLockReason}>
                          Locked
                        </span>
                      ) : (
                        <span className={`shrink-0 whitespace-nowrap px-2.5 py-0.5 rounded-full font-sans text-[10px] font-extrabold uppercase tracking-wider border shadow-xs ${project.difficulty === "Go To Hell" || project.difficulty === "Expert Tier"
                            ? "bg-slate-950 text-purple-300 border-purple-700"
                            : project.difficulty === "Insane"
                              ? "bg-rose-600 text-white border-rose-500"
                              : project.difficulty === "Hard"
                                ? "bg-[#D9F83B] text-slate-950 border-[#D9F83B]"
                                : project.difficulty === "Intermediate"
                                  ? "bg-white text-[#162774] border-white"
                                  : project.difficulty === "Easy"
                                    ? "bg-cyan-400 text-slate-950 border-cyan-300"
                                    : "bg-emerald-400 text-slate-950 border-emerald-300"
                          }`}>
                          {difficultyLabel}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6 pb-4 flex-1">
                    {/* Distinct PRD Blueprint Heading Block (White + #162774 Left Bar + #D9F83B Accent) */}
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 border-l-4 border-l-[#162774] mb-3.5 shadow-2xs flex items-start justify-between gap-2.5">
                      <h3 className="text-base sm:text-[17px] font-extrabold text-slate-950 font-sans group-hover:text-[#162774] transition-colors duration-300 line-clamp-2 leading-snug">
                        {project.title}
                      </h3>
                      <span className="w-6 h-6 rounded-full bg-[#D9F83B] group-hover:bg-[#162774] text-slate-950 group-hover:text-[#D9F83B] flex items-center justify-center shrink-0 transition-all duration-500 group-hover:rotate-45 mt-0.5">
                        <ArrowRight size={11} />
                      </span>
                    </div>

                    {/* Formatted Overview */}
                    <p className="text-[13px] text-slate-700 font-sans line-clamp-3 leading-relaxed mb-4 font-medium pl-1">
                      {project.overview}
                    </p>

                    {/* Tech Stack Pills (Color Fill on Hover) */}
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
                      {techList.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 group-hover:bg-[#070E54] group-hover:text-[#D9F83B] group-hover:border-[#070E54] font-sans text-[11px] font-semibold transition-all duration-500"
                        >
                          {tech}
                        </span>
                      ))}
                      {techList.length > 4 && (
                        <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-500 border border-slate-200 group-hover:bg-[#1D3189] group-hover:text-white group-hover:border-[#1D3189] font-sans text-[10px] font-semibold transition-all duration-500">
                          +{techList.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 2 Clean Action Buttons with Bottom Blue Slide Hover */}
                  <div className="relative overflow-hidden px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex items-center gap-2.5 font-sans text-xs">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-[#162774] -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
                        backgroundSize: "28px 28px",
                      }}
                    />
                    <Link
                      href={`/arena/${project.id}`}
                      className="relative z-10 flex-1 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-center transition-all duration-200 flex items-center justify-center shadow-xs"
                    >
                      <span>Inspect PRD</span>
                    </Link>

                    {isThisEnrolled ? (
                      <Link
                        href={`/arena/${project.id}`}
                        className="relative z-10 flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-center transition-all duration-200 shadow-sm flex items-center justify-center"
                      >
                        <span>Enrolled</span>
                      </Link>
                    ) : isCardLocked ? (
                      <button
                        disabled
                        title={cardLockReason}
                        className="relative z-10 flex-1 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-400 font-bold text-center transition-all duration-200 opacity-70 cursor-not-allowed flex items-center justify-center"
                      >
                        <span>Locked</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEnrollClick(project)}
                        className="relative z-10 flex-1 py-2.5 rounded-xl bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-bold text-center transition-all duration-200 shadow-sm flex items-center justify-center cursor-pointer"
                      >
                        <span>Enroll</span>
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
          <div className="flex items-center justify-center gap-3 mt-10 font-sans text-xs">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold disabled:opacity-40 hover:bg-slate-50 transition-all cursor-pointer shadow-xs"
            >
              &larr; Prev
            </button>
            <span className="px-5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 font-bold text-slate-900">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold disabled:opacity-40 hover:bg-slate-50 transition-all cursor-pointer shadow-xs"
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
            className="relative overflow-hidden p-6 rounded-3xl bg-white border border-slate-200 border-l-4 border-l-[#D9F83B] hover:border-[#070E54] transition-all duration-500 shadow-md hover:shadow-xl hover:-translate-y-1 block group"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[#070E54] -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out"
            />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-[#1D3189] group-hover:text-[#D9F83B] uppercase tracking-wider transition-colors duration-500">01 • Roadmaps</span>
                <span className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-[#D9F83B] text-slate-900 flex items-center justify-center transition-all duration-500 group-hover:rotate-45">
                  <ArrowRight size={14} />
                </span>
              </div>
              <h4 className="font-extrabold text-slate-950 font-sans text-base group-hover:text-white transition-colors duration-500">{allProjectsList.length} Role Roadmaps (Free)</h4>
              <p className="text-slate-600 group-hover:text-blue-100/85 text-xs font-sans mt-1.5 font-medium leading-relaxed transition-colors duration-500">Prerequisites &amp; architecture milestones for every track.</p>
            </div>
          </Link>

          <Link
            href="/arena/career-checklist"
            className="relative overflow-hidden p-6 rounded-3xl bg-white border border-slate-200 border-l-4 border-l-[#D9F83B] hover:border-[#070E54] transition-all duration-500 shadow-md hover:shadow-xl hover:-translate-y-1 block group"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[#070E54] -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out"
            />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-[#1D3189] group-hover:text-[#D9F83B] uppercase tracking-wider transition-colors duration-500">02 • Career &amp; UGC</span>
                <span className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-[#D9F83B] text-slate-900 flex items-center justify-center transition-all duration-500 group-hover:rotate-45">
                  <ArrowRight size={14} />
                </span>
              </div>
              <h4 className="font-extrabold text-slate-950 font-sans text-base group-hover:text-white transition-colors duration-500">LinkedIn UGC Promoter</h4>
              <p className="text-slate-600 group-hover:text-blue-100/85 text-xs font-sans mt-1.5 font-medium leading-relaxed transition-colors duration-500">Share daily build logs &amp; earn +50 Karma Coins per post.</p>
            </div>
          </Link>

          <Link
            href="/arena/daily-log"
            className="relative overflow-hidden p-6 rounded-3xl bg-white border border-slate-200 border-l-4 border-l-[#D9F83B] hover:border-[#070E54] transition-all duration-500 shadow-md hover:shadow-xl hover:-translate-y-1 block group"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[#070E54] -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out"
            />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-[#1D3189] group-hover:text-[#D9F83B] uppercase tracking-wider transition-colors duration-500">03 • Proof of Work</span>
                <span className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-[#D9F83B] text-slate-900 flex items-center justify-center transition-all duration-500 group-hover:rotate-45">
                  <ArrowRight size={14} />
                </span>
              </div>
              <h4 className="font-extrabold text-slate-950 font-sans text-base group-hover:text-white transition-colors duration-500">Daily PoW Logger</h4>
              <p className="text-slate-600 group-hover:text-blue-100/85 text-xs font-sans mt-1.5 font-medium leading-relaxed transition-colors duration-500">Submit daily GitHub commits to build your verified streak.</p>
            </div>
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
                  <div className="p-5 rounded-2xl bg-[#070E54] text-white text-left border border-white/15 space-y-3 font-sans text-xs">
                    <div className="text-[#D9F83B] font-bold text-[10px] uppercase tracking-wider">
                      UPGRADE TO 4-WEEK VIRTUAL AI INTERNSHIP
                    </div>
                    <h4 className="text-sm font-bold font-sans text-white">
                      Get Code Audits, QR Certificate &amp; 15 Referrals
                    </h4>
                    <p className="text-[11px] text-blue-100/80 font-sans">
                      Solo Fellow Track: <strong>₹299</strong> &bull; Squad Track: <strong>₹1,999</strong>
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowRazorpayModal(true)}
                      className="w-full py-2.5 rounded-xl bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-bold text-center transition-all shadow-sm cursor-pointer block"
                    >
                      Upgrade to Paid Fellow Track (₹299) →
                    </button>
                  </div>

                  <div className="flex items-center gap-3 pt-2 font-sans">
                    <Link
                      href={`/arena/${selectedProjectForEnroll.id}`}
                      className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold text-center"
                    >
                      Open PRD Blueprint
                    </Link>
                    <Link
                      href="/profile"
                      className="flex-1 py-2.5 rounded-xl bg-[#1D3189] hover:bg-[#152468] text-white text-xs font-bold text-center"
                    >
                      Go to Profile Workspace
                    </Link>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-[11px] font-sans text-[#1D3189] font-bold uppercase tracking-wider mb-1">
                    INSTANT ENROLLMENT
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 font-sans">
                    Enroll in {selectedProjectForEnroll.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-sans mt-1">
                    Start logging your daily commits, earning Karma, and building your verified proof-of-work.
                  </p>

                  {enrollError && (
                    <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-sans text-xs font-medium">
                      {enrollError}
                    </div>
                  )}

                  <form onSubmit={handleEnrollSubmit} className="mt-5 space-y-4 font-sans text-xs">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Student Builder</label>
                      <input
                        type="text"
                        disabled
                        value={`${studentProfile?.displayName || user?.displayName || "Builder"} (${user?.email})`}
                        className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-600 font-sans text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Primary Role</label>
                        <select
                          value={enrollRole}
                          onChange={(e) => setEnrollRole(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#1D3189]"
                        >
                          <option value="AI Engineer">AI Engineer</option>
                          <option value="Backend Dev">Backend Dev</option>
                          <option value="Frontend Dev">Frontend Dev</option>
                          <option value="Fullstack Dev">Fullstack Dev</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Format</label>
                        <select
                          value={enrollTeamType}
                          onChange={(e) => setEnrollTeamType(e.target.value as any)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#1D3189]"
                        >
                          <option value="Solo">Solo Shipper</option>
                          <option value="Squad">Squad Team</option>
                        </select>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 font-sans">
                      <strong>What happens next:</strong> You will receive an immediate confirmation email with repo setup checklist and daily log instructions.
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
                        className="flex-2 py-3 rounded-xl bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-bold transition-all shadow-md shadow-lime-400/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
