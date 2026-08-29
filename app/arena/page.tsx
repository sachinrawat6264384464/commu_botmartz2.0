"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Flame,
  ShieldAlert,
  Code2,
  Cpu,
  Layers,
  ArrowRight,
  CheckCircle2,
  FileText,
  Upload,
  Search,
  ExternalLink,
  Users,
  Trophy,
  Calendar,
  AlertTriangle,
  FolderGit2,
  Bug,
  BookOpen,
  Check,
  Loader2,
  HardDrive,
  MessageSquare,
  Linkedin,
  Github,
  Instagram,
  Terminal,
  Play,
  Activity,
  Award,
  ShieldCheck
} from "lucide-react";
import { ARENA_PROJECTS, ArenaProject } from "@/lib/arena-projects";
import { AnalysisResponse } from "@/lib/resume-matcher";

export default function ArenaPage() {
  // State for Filters
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [selectedDomain, setSelectedDomain] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // State for Resume Analyzer
  const [resumeText, setResumeText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [analysisError, setAnalysisError] = useState("");

  // State for Enrollment Modal
  const [enrollModalProject, setEnrollModalProject] = useState<ArenaProject | null>(null);
  const [enrollForm, setEnrollForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
    discord: "",
    github: "",
    linkedin: "",
    instagram: "",
    role: "Backend Dev",
    teamType: "Solo",
    teamName: "",
    experience: "Student / Self-Taught",
    followedLinkedIn: false,
    followedBotmartz: false,
    followedGithub: false,
    joinedDiscord: false,
    dpdpConsent: false,
  });
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState(false);
  const [enrollError, setEnrollError] = useState("");

  // Filter projects
  const filteredProjects = ARENA_PROJECTS.filter((p) => {
    const matchesDiff = selectedDifficulty === "All" || p.difficulty === selectedDifficulty;
    const matchesDomain = selectedDomain === "All" || p.domain === selectedDomain;
    const matchesSearch =
      searchQuery === "" ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDiff && matchesDomain && matchesSearch;
  });

  // Handle Resume Analysis
  const handleAnalyzeResume = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText || resumeText.trim().length < 15) {
      setAnalysisError("Please paste your resume text or technical bio (at least 15 characters).");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError("");

    try {
      const res = await fetch("/api/arena/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to analyze resume.");
      }

      setAnalysisResult(data.analysis);
    } catch (err: any) {
      setAnalysisError(err.message || "Failed to run analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle Enrollment
  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollModalProject) return;

    if (!enrollForm.dpdpConsent) {
      setEnrollError("You must accept the DPDP Act Data Protection consent to continue.");
      return;
    }

    setIsEnrolling(true);
    setEnrollError("");

    try {
      const res = await fetch("/api/arena/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...enrollForm,
          projectId: enrollModalProject.id,
          projectTitle: enrollModalProject.title,
          difficulty: enrollModalProject.difficulty,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to complete enrollment.");
      }

      setEnrollSuccess(true);
    } catch (err: any) {
      setEnrollError(err.message || "Failed to register.");
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <div className="bg-[#FAFCFF] min-h-screen text-slate-900 selection:bg-[#0066FF] selection:text-white pt-20 pb-28">

      {/* =========================================================================
          HERO SECTION: THE INTERNSHIP PLAYGROUND
      ========================================================================= */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-[#F0F6FF] via-[#F8FAFC] to-white py-16 sm:py-24">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#0066FF]/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#0066FF]/30 text-[#0066FF] text-xs font-mono font-bold uppercase tracking-wider mb-6 shadow-xs">
            <Activity size={14} className="text-[#0066FF]" />
            <span>COHORT 1: 14TH SEPT (GANESH CHATURTHI) – DIWALI 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.12] font-sans">
            Virtual Internship Playground. <br />
            <span className="bg-gradient-to-r from-[#0066FF] via-[#00B8F0] to-[#2563EB] bg-clip-text text-transparent">
              Ship Production Engineering Systems.
            </span>
          </h1>

          <p className="text-slate-600 text-base sm:text-lg max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
            Central India&apos;s premier 45-Day Virtual Internship Playground. Choose from 50 production systems across <strong>AI Agents, Satellite Geospatial, Autonomous Drones, Medical Imaging, High-Frequency FinTech, and Rust Kernels</strong>. Submit daily proof-of-work, pass automated test benchmarks, and unlock 15 direct company referrals.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-10">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-left">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-mono mb-1">
                <Layers size={14} className="text-[#0066FF]" /> 50 Production Systems
              </div>
              <div className="text-lg font-bold text-slate-900">Multi-Domain Catalog</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-left">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-mono mb-1">
                <Users size={14} className="text-emerald-600" /> Cross-Role Squads
              </div>
              <div className="text-lg font-bold text-slate-900">Devs, AI, Pentest &amp; QA</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-left">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-mono mb-1">
                <Award size={14} className="text-purple-600" /> 15 Company Referrals
              </div>
              <div className="text-lg font-bold text-slate-900">Complete 3 Projects</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-left">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-mono mb-1">
                <ShieldCheck size={14} className="text-blue-600" /> Saturday Teardowns
              </div>
              <div className="text-lg font-bold text-slate-900">Indore AI Hub &amp; Discord</div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 font-mono text-xs">
            <Link
              href="/arena/shippers"
              className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase tracking-wider transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              <Award size={15} />
              <span>3-Project Milestone (15 Referrals)</span>
            </Link>
            <a
              href="#resume-matcher"
              className="px-6 py-3.5 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold uppercase tracking-wider transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              <Search size={15} />
              <span>Scan Resume &amp; Match</span>
            </a>
            <a
              href="#projects-catalog"
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-mono font-bold uppercase tracking-wider border border-slate-300 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <FolderGit2 size={15} />
              <span>Explore 50 Projects</span>
            </a>
            <Link
              href="/arena/daily-log"
              className="px-6 py-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-mono font-bold uppercase tracking-wider border border-emerald-300 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Terminal size={15} />
              <span>Submit Daily Log</span>
            </Link>
          </div>

        </div>
      </section>

      {/* =========================================================================
          THE SHIPPERS FLYWHEEL BANNER: COMPLETE 3 PROJECTS -> 15 REFERRALS
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-indigo-800/80 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[11px] font-bold uppercase tracking-wider mb-2 border border-purple-500/30">
              <span>THE SHIPPERS CIRCLE MILESTONE</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Complete 3 Projects → Get Fast-Tracked to 15 Hiring Companies
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              Build 1 Solo + 2 Squad projects (or any 3). Unlock 15 direct tech company referrals, 1-on-1 profile teardowns, and a personal LinkedIn recommendation from Founder Soham Sharma.
            </p>
          </div>

          <Link
            href="/arena/shippers"
            className="px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold uppercase tracking-wider transition-all whitespace-nowrap shadow-md cursor-pointer flex items-center gap-2 shrink-0"
          >
            <span>Enter Shippers Circle</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: RESUME SCANNER & INTELLIGENT PROJECT MATCHER
      ========================================================================= */}
      <section id="resume-matcher" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm">
          
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-[#0066FF] font-mono text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles size={14} /> AI &amp; Keyword Skill Analysis Engine
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-2">
              Match Your Skills to Production Projects
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-mono">
              Paste your resume or GitHub bio text below. Our engine extracts your technical taxonomy (Python, Django, FastAPI, PostgreSQL, Next.js, LangGraph, Qdrant, Docker, AWS, etc.), scores you against all 50 production projects, and generates curated learning resources for missing skills.
            </p>
          </div>

          <form onSubmit={handleAnalyzeResume} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-700 font-bold mb-1.5">
                Paste Resume Text, Technical Bio, or Stacks Summary:
              </label>
              <textarea
                rows={5}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="e.g. Fullstack engineer with 2 years of experience in Python, FastAPI, Django, PostgreSQL, Docker, and PyTorch. Familiar with LangChain, Redis, and building REST APIs..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#0066FF] transition-all"
                required
              />
            </div>

            {analysisError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono">
                {analysisError}
              </div>
            )}

            <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
              <span className="text-xs text-slate-400 font-mono">
                ⚡ Processed safely with zero 3rd-party LLM data retention under DPDP Act.
              </span>
              <button
                type="submit"
                disabled={isAnalyzing}
                className="px-6 py-3.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 disabled:opacity-60 shadow-sm"
              >
                {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <><Search size={15} /><span>Run Skills Diagnosis</span></>}
              </button>
            </div>
          </form>

          {/* Analysis Results Display */}
          {analysisResult && (
            <div className="mt-10 pt-8 border-t border-slate-200 animate-fadeIn">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
                <div>
                  <span className="text-xs font-mono text-slate-500 uppercase">Assessment Level:</span>
                  <div className="text-lg font-bold text-slate-900">{analysisResult.experienceLevel}</div>
                </div>
                <div className="px-4 py-2 rounded-xl bg-blue-50 border border-blue-200 text-[#0066FF] font-mono text-xs font-bold">
                  Recommended: {analysisResult.recommendedTrack}
                </div>
              </div>

              <div className="mb-6 p-4 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs font-medium text-slate-700 leading-relaxed">
                {analysisResult.summary}
              </div>

              {/* Detected Skills Badges */}
              <div className="mb-8">
                <div className="text-xs font-mono text-slate-500 uppercase mb-2">Detected Technical Keywords:</div>
                <div className="flex flex-wrap gap-1.5">
                  {analysisResult.extractedSkills.map((s) => (
                    <span key={s} className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-semibold">
                      ✓ {s.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Top Matches Cards */}
              <h3 className="text-base font-bold text-slate-900 mb-4 font-mono uppercase tracking-wider">
                Top Matched Projects &amp; Curated Learning Gaps:
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {analysisResult.topMatches.map((m) => (
                  <div key={m.project.id} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0066FF] font-mono text-[11px] font-bold">
                          {m.matchScore}% Profile Match
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-600">{m.project.difficulty}</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mb-1">{m.project.title}</h4>
                      <p className="text-xs text-slate-600 mb-4 line-clamp-2">{m.project.tagline}</p>

                      {/* Learning Gaps */}
                      {m.learningGaps.length > 0 && (
                        <div className="space-y-2 mb-4 bg-white p-3.5 rounded-xl border border-slate-200">
                          <div className="text-[11px] font-mono text-slate-500 font-bold uppercase">Learning Gap Resources:</div>
                          {m.learningGaps.map((gap, i) => (
                            <a
                              key={i}
                              href={gap.resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between text-xs text-[#0066FF] hover:underline font-medium"
                            >
                              <span>📖 Learn {gap.skill.toUpperCase()}: {gap.resource.title}</span>
                              <ExternalLink size={12} className="shrink-0" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 pt-3 border-t border-slate-200">
                      <Link
                        href={`/arena/${m.project.slug}`}
                        className="flex-1 text-center px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-mono font-bold transition-all"
                      >
                        View Architecture
                      </Link>
                      <button
                        onClick={() => setEnrollModalProject(m.project)}
                        className="flex-1 text-center px-4 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-mono font-bold transition-all cursor-pointer shadow-xs"
                      >
                        Enroll Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>
      </section>

      {/* =========================================================================
          SECTION 3: 50 PRODUCTION PROJECTS CATALOG
      ========================================================================= */}
      <section id="projects-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-[#0066FF] font-mono text-xs font-bold uppercase tracking-wider mb-3">
            <Cpu size={14} /> Production Systems Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 font-sans">
            50 Production Systems Matrix
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-mono">
            Zero toy applications. Every project requires multi-tier databases, real-time message streams, latency benchmarking, and automated test gates.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
          {/* Difficulty Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {["All", "Intermediate", "Hard", "Insane", "Expert Tier"].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  selectedDifficulty === diff
                    ? diff === "Expert Tier"
                      ? "bg-slate-950 text-purple-300 border border-purple-600 shadow-sm"
                      : "bg-[#0066FF] text-white shadow-xs"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search stack, LangGraph, AWS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#0066FF]"
            />
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const isGTH = project.difficulty === "Expert Tier";
            return (
              <div
                key={project.id}
                className={`rounded-3xl p-6 transition-all flex flex-col justify-between relative overflow-hidden ${
                  isGTH
                    ? "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-2 border-purple-600/80 text-white shadow-xl shadow-purple-950/30"
                    : "bg-white border border-slate-200 text-slate-900 shadow-xs hover:shadow-md hover:border-blue-300"
                }`}
              >
                {/* Top Badge */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                        isGTH
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                          : project.difficulty === "Insane"
                          ? "bg-purple-100 text-purple-700 border border-purple-200"
                          : project.difficulty === "Hard"
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : "bg-blue-100 text-[#0066FF] border border-blue-200"
                      }`}
                    >
                      {project.difficulty}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">{project.domain}</span>
                  </div>

                  {project.prizePool && (
                    <div className="mb-3 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold flex items-center gap-1.5">
                      <Trophy size={14} className="text-amber-400" />
                      <span>{project.prizePool}</span>
                    </div>
                  )}

                  <h3 className={`text-lg font-bold mb-2 leading-snug font-sans ${isGTH ? "text-white" : "text-slate-900"}`}>
                    {project.title}
                  </h3>
                  <p className={`text-xs mb-4 leading-relaxed line-clamp-3 font-sans ${isGTH ? "text-slate-300" : "text-slate-600"}`}>
                    {project.tagline}
                  </p>

                  {/* Tech Stack Badges */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold ${
                          isGTH ? "bg-slate-800 text-slate-300 border border-slate-700" : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Target Roles */}
                  <div className="mb-6">
                    <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Supported Squad Roles:</div>
                    <div className="flex flex-wrap gap-1">
                      {project.targetRoles.map((role) => (
                        <span key={role} className="text-[10px] font-mono text-slate-500 bg-slate-50 dark:bg-slate-800/40 px-1.5 py-0.5 rounded">
                          • {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-3 font-mono text-xs">
                  <Link
                    href={`/arena/${project.slug}`}
                    className={`flex-1 text-center py-2.5 rounded-xl font-bold transition-all ${
                      isGTH
                        ? "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                        : "bg-white hover:bg-slate-100 text-slate-800 border border-slate-300"
                    }`}
                  >
                    View PRD
                  </Link>
                  <button
                    onClick={() => setEnrollModalProject(project)}
                    className={`flex-1 text-center py-2.5 rounded-xl font-bold transition-all cursor-pointer shadow-xs ${
                      isGTH
                        ? "bg-purple-600 hover:bg-purple-500 text-white shadow-purple-900/50"
                        : "bg-[#0066FF] hover:bg-[#0052CC] text-white"
                    }`}
                  >
                    {isGTH ? "Apply for 5 Slots" : "Enroll in Track"}
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </section>

      {/* =========================================================================
          SECTION 4: CROSS-ROLE SQUAD DYNAMICS (DEVS + PENTESTERS + QA + PM)
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#0066FF]/20 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-[#00B8F0] font-mono text-xs font-bold uppercase tracking-wider mb-4 border border-blue-500/30">
              <Users size={14} /> Cross-Functional Squad Simulation
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3 font-sans">
              Not Just Coding. Real Engineering Squads.
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-mono">
              Every project in the Internship Playground runs like a high-growth tech startup. Developers build and deploy to cloud environments, Cybersecurity Pen-testers exploit live staging builds, QA Automation writes Playwright suites, and PMs manage sprint velocity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-mono text-xs">
            
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-4">
                <Code2 size={20} />
              </div>
              <h3 className="font-bold text-white text-base mb-2 font-sans">Developers &amp; AI Engineers</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-3 font-sans">
                Build core state machines, vector pipelines, Redis task queues, and deploy containers.
              </p>
              <span className="text-[11px] text-[#00B8F0] font-semibold">Deliverable: Live Cloud URL + Code</span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center mb-4">
                <Bug size={20} />
              </div>
              <h3 className="font-bold text-white text-base mb-2 font-sans">Cybersecurity Pen-testers</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-3 font-sans">
                Attack student live staging deployments. Hunt OWASP Top 10, SSRF, IDOR &amp; Prompt Injections.
              </p>
              <span className="text-[11px] text-rose-400 font-semibold">Deliverable: 5 Verified Bug CVE Reports</span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
                <Terminal size={20} />
              </div>
              <h3 className="font-bold text-white text-base mb-2 font-sans">QA Automation Engineers</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-3 font-sans">
                Write Playwright E2E suites and distributed k6 load tests for 10,000 concurrent user spikes.
              </p>
              <span className="text-[11px] text-amber-400 font-semibold">Deliverable: CI/CD Harness &amp; k6 Report</span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-4">
                <BookOpen size={20} />
              </div>
              <h3 className="font-bold text-white text-base mb-2 font-sans">Product Managers</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-3 font-sans">
                Author technical PRDs, user stories, Mermaid diagrams, and post-launch product telemetry funnels.
              </p>
              <span className="text-[11px] text-purple-400 font-semibold">Deliverable: Technical PRD &amp; Backlog</span>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 5: SUBMISSION DELIVERABLES & WEEKEND OFFICE HOURS
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mb-4">
                <HardDrive size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 font-sans">
                Proof-of-Work Submission Guidelines
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4 font-mono">
                Submit public GitHub repositories, live deployment URLs (Vercel / AWS / Render / Hugging Face), passing benchmark logs, and 2-minute Loom architecture walkthroughs.
              </p>
            </div>
            <Link
              href="/arena/daily-log"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#0066FF] hover:underline"
            >
              <span>Submit Proof-of-Work Daily Log</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center mb-4">
                <Calendar size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 font-sans">
                Weekend Architecture &amp; Teardowns
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4 font-mono">
                Live Discord Stage sessions every Saturday 5:00 PM – 7:00 PM IST and in-person at Indore AI Hub. Bring code bottlenecks, DB deadlocks, or prompt regressions for live technical teardowns.
              </p>
            </div>
            <a
              href="https://discord.gg/k75ZpEnzp"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold text-indigo-600 hover:underline"
            >
              <span>Join #office-hours on Discord</span>
              <ExternalLink size={14} />
            </a>
          </div>

        </div>
      </section>

      {/* =========================================================================
          ENROLLMENT MODAL WITH MANDATORY SOCIALS & DPDP CONSENT
      ========================================================================= */}
      {enrollModalProject && (
        <div
          onClick={() => setEnrollModalProject(null)}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
          >
            {enrollSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Enrollment Verified!</h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed font-mono">
                  Welcome to <strong>{enrollModalProject.title}</strong>. Your track starts now! Check Discord #arena-squads and submit your Day 1 Proof of Work.
                </p>
                <div className="pt-4 flex justify-center gap-3">
                  <Link
                    href="/arena/daily-log"
                    className="px-6 py-3 rounded-xl bg-[#0066FF] text-white text-xs font-mono font-bold uppercase tracking-wider"
                  >
                    Open Daily PoW Logger
                  </Link>
                  <button
                    onClick={() => {
                      setEnrollModalProject(null);
                      setEnrollSuccess(false);
                    }}
                    className="px-5 py-3 rounded-xl bg-slate-100 text-slate-700 text-xs font-mono font-bold"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-mono text-[#0066FF] uppercase font-bold">
                      {enrollModalProject.difficulty} Track
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">{enrollModalProject.title}</h3>
                  </div>
                  <button
                    onClick={() => setEnrollModalProject(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {enrollError && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono">
                    {enrollError}
                  </div>
                )}

                <form onSubmit={handleEnrollSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-600 mb-1 font-semibold">Full Name *</label>
                      <input
                        type="text"
                        placeholder="Soham Sharma"
                        value={enrollForm.name}
                        onChange={(e) => setEnrollForm({ ...enrollForm, name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-600 mb-1 font-semibold">Email Address *</label>
                      <input
                        type="email"
                        placeholder="soham@example.com"
                        value={enrollForm.email}
                        onChange={(e) => setEnrollForm({ ...enrollForm, email: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-600 mb-1 font-semibold">WhatsApp Number *</label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={enrollForm.whatsapp}
                        onChange={(e) => setEnrollForm({ ...enrollForm, whatsapp: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-600 mb-1 font-semibold">Discord Username</label>
                      <input
                        type="text"
                        placeholder="soham#1234 or @soham"
                        value={enrollForm.discord}
                        onChange={(e) => setEnrollForm({ ...enrollForm, discord: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-mono text-slate-600 mb-1 font-semibold">GitHub Profile</label>
                      <input
                        type="text"
                        placeholder="github.com/soham2710"
                        value={enrollForm.github}
                        onChange={(e) => setEnrollForm({ ...enrollForm, github: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-600 mb-1 font-semibold">LinkedIn Profile</label>
                      <input
                        type="text"
                        placeholder="linkedin.com/in/soham"
                        value={enrollForm.linkedin}
                        onChange={(e) => setEnrollForm({ ...enrollForm, linkedin: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-600 mb-1 font-semibold">Instagram Handle</label>
                      <input
                        type="text"
                        placeholder="@soham"
                        value={enrollForm.instagram}
                        onChange={(e) => setEnrollForm({ ...enrollForm, instagram: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-600 mb-1 font-semibold">Selected Role in Track</label>
                      <select
                        value={enrollForm.role}
                        onChange={(e) => setEnrollForm({ ...enrollForm, role: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                      >
                        {enrollModalProject.targetRoles.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-600 mb-1 font-semibold">Participation Mode</label>
                      <select
                        value={enrollForm.teamType}
                        onChange={(e) => setEnrollForm({ ...enrollForm, teamType: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                      >
                        <option value="Solo">Solo Builder (1 Person)</option>
                        <option value="Squad">Squad Team (2-4 Members)</option>
                      </select>
                    </div>
                  </div>

                  {/* Mandatory Community Verification Actions */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                    <div className="text-xs font-mono font-bold text-slate-800 uppercase mb-1">
                      Mandatory Builder Verification Actions:
                    </div>
                    <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enrollForm.followedLinkedIn}
                        onChange={(e) => setEnrollForm({ ...enrollForm, followedLinkedIn: e.target.checked })}
                        className="rounded text-[#0066FF]"
                        required
                      />
                      <span>Followed Soham Sharma &amp; Botmartz AI on LinkedIn</span>
                    </label>
                    <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enrollForm.followedGithub}
                        onChange={(e) => setEnrollForm({ ...enrollForm, followedGithub: e.target.checked })}
                        className="rounded text-[#0066FF]"
                        required
                      />
                      <span>Starred &amp; Followed Botmartz GitHub Organization</span>
                    </label>
                    <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enrollForm.joinedDiscord}
                        onChange={(e) => setEnrollForm({ ...enrollForm, joinedDiscord: e.target.checked })}
                        className="rounded text-[#0066FF]"
                        required
                      />
                      <span>Joined the Official Discord Server &amp; WhatsApp Pulse Group</span>
                    </label>
                  </div>

                  {/* DPDP Act Data Privacy Consent */}
                  <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-slate-700 leading-relaxed">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enrollForm.dpdpConsent}
                        onChange={(e) => setEnrollForm({ ...enrollForm, dpdpConsent: e.target.checked })}
                        className="rounded text-[#0066FF] mt-0.5"
                        required
                      />
                      <span className="font-mono text-[11px]">
                        <strong>DPDP Act 2023 Consent:</strong> I hereby consent to Botmartz storing my technical project submissions and logs strictly for evaluation, internship matching, and certification purposes.
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isEnrolling}
                    className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 mt-4"
                  >
                    {isEnrolling ? <Loader2 size={16} className="animate-spin" /> : <><span>Confirm Arena Registration</span> <ArrowRight size={15} /></>}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
