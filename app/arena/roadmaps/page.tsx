"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Compass,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers,
  Cpu,
  Shield,
  Database,
  LineChart,
  Terminal,
  ExternalLink,
  Code2,
  Briefcase,
  Search,
  Zap,
  Filter,
  Music,
  Heart,
  TrendingUp,
  Brain,
  Atom,
  BookOpen
} from "lucide-react";
import { ROLE_ROADMAPS, RoleRoadmap } from "@/lib/roadmaps";
import { ARENA_PROJECTS } from "@/lib/arena-projects";

const CATEGORIES = [
  "All Roadmaps",
  "Core Engineering",
  "Product & Design",
  "MBA, Business & Finance",
  "Cybersecurity & Defense",
  "Cross-Discipline Hybrids"
] as const;

const PRIMARY_DISCIPLINES = [
  "All Disciplines",
  "Music & Audio",
  "Biology & Genomics",
  "Finance & Quant",
  "Law & Compliance",
  "Agriculture & Food",
  "Education & Learning",
  "Art & Generative Media",
  "Healthcare & Robotics",
  "Semiconductors & Hardware",
  "Clean Energy & BMS",
  "Public Policy & GovTech"
];

const SECONDARY_FOCUS = [
  "All Tech Stacks",
  "AI & Machine Learning",
  "Python & FastAPI",
  "Node.js & TypeScript",
  "Rust & Low-Latency",
  "Cloud & DevOps/SRE",
  "Cybersecurity & Zero-Trust",
  "Product & Business Strategy",
  "IoT & Firmware"
];

export default function RoadmapsExplorerPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Roadmaps");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [fusionPrimary, setFusionPrimary] = useState<string>("All Disciplines");
  const [fusionSecondary, setFusionSecondary] = useState<string>("All Tech Stacks");
  const [selectedTrackId, setSelectedTrackId] = useState<string>(ROLE_ROADMAPS[0].id);
  const [activeStageNum, setActiveStageNum] = useState<number>(1);

  // Filter roadmaps
  const filteredRoadmaps = useMemo(() => {
    return ROLE_ROADMAPS.filter((r) => {
      const matchesCategory =
        selectedCategory === "All Roadmaps" || r.category === selectedCategory;

      const matchesSearch =
        searchQuery === "" ||
        r.roleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.disciplines.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase())) ||
        r.targetCompanies.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesFusionPrimary =
        fusionPrimary === "All Disciplines" ||
        r.disciplines.some((d) => {
          const p = fusionPrimary.toLowerCase();
          return (
            (p.includes("music") && d.toLowerCase().includes("music")) ||
            (p.includes("biology") && d.toLowerCase().includes("biology")) ||
            (p.includes("finance") && (d.toLowerCase().includes("finance") || d.toLowerCase().includes("quant"))) ||
            (p.includes("law") && d.toLowerCase().includes("law")) ||
            (p.includes("agriculture") && d.toLowerCase().includes("agri")) ||
            (p.includes("education") && d.toLowerCase().includes("education")) ||
            (p.includes("art") && (d.toLowerCase().includes("art") || d.toLowerCase().includes("creative"))) ||
            (p.includes("healthcare") && d.toLowerCase().includes("health")) ||
            (p.includes("semiconductor") && d.toLowerCase().includes("semiconductor")) ||
            (p.includes("clean energy") && d.toLowerCase().includes("clean energy")) ||
            (p.includes("govtech") && d.toLowerCase().includes("gov"))
          );
        });

      const matchesFusionSecondary =
        fusionSecondary === "All Tech Stacks" ||
        r.disciplines.some((d) => {
          const s = fusionSecondary.toLowerCase();
          return (
            (s.includes("ai") && d.toLowerCase().includes("ai")) ||
            (s.includes("python") && d.toLowerCase().includes("python")) ||
            (s.includes("node") && d.toLowerCase().includes("node")) ||
            (s.includes("rust") && d.toLowerCase().includes("rust")) ||
            (s.includes("cloud") && (d.toLowerCase().includes("cloud") || d.toLowerCase().includes("devops"))) ||
            (s.includes("security") && (d.toLowerCase().includes("security") || d.toLowerCase().includes("zero-trust"))) ||
            (s.includes("product") && (d.toLowerCase().includes("product") || d.toLowerCase().includes("strategy") || d.toLowerCase().includes("mba"))) ||
            (s.includes("iot") && (d.toLowerCase().includes("iot") || d.toLowerCase().includes("hardware") || d.toLowerCase().includes("firmware")))
          );
        });

      return matchesCategory && matchesSearch && matchesFusionPrimary && matchesFusionSecondary;
    });
  }, [selectedCategory, searchQuery, fusionPrimary, fusionSecondary]);

  // Keep selectedTrack in sync if filtered
  const currentRoadmap = useMemo(() => {
    const found = ROLE_ROADMAPS.find((r) => r.id === selectedTrackId);
    if (found && filteredRoadmaps.some((f) => f.id === found.id)) return found;
    return filteredRoadmaps[0] || ROLE_ROADMAPS[0];
  }, [selectedTrackId, filteredRoadmaps]);

  const currentStage =
    currentRoadmap.stages.find((s) => s.stageNumber === activeStageNum) ||
    currentRoadmap.stages[0];

  const matchedProjects = ARENA_PROJECTS.filter((p) =>
    currentStage.recommendedProjectIds.some(
      (recId) => p.slug === recId || p.id === recId || p.slug.includes(recId)
    )
  );

  const handleTrackChange = (trackId: string) => {
    setSelectedTrackId(trackId);
    setActiveStageNum(1);
  };

  const handleStageChange = (stageNum: number) => {
    setActiveStageNum(stageNum);
  };

  return (
    <div className="min-h-screen bg-[#FAFCFF] text-slate-900 pb-24 font-sans selection:bg-[#0066FF] selection:text-white">
      
      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-[#0066FF] font-mono text-xs font-bold uppercase tracking-wider mb-3">
                <Compass size={14} /> Career Roadmaps &amp; Cross-Discipline Fusion
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                50 Production Role Roadmaps
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm font-mono mt-2 leading-relaxed">
                Explore structured stage progressions across Core Engineering, Product Management, MBA &amp; Strategy, Cybersecurity, and Cross-Discipline Hybrids. Combine any two passions to discover your ideal career path and matching production systems.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
              <Link
                href="/arena"
                className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold uppercase tracking-wider transition-all"
              >
                Explore 50 Systems
              </Link>
              <Link
                href="/arena/ecosystems"
                className="px-5 py-3 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold uppercase tracking-wider transition-all shadow-xs"
              >
                Industrial Ecosystems
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
        {/* =========================================================================
            SECTION 1: CROSS-DISCIPLINE INTEREST & FUSION MATCHER
        ========================================================================= */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-indigo-800/80 shadow-lg">
          <div className="max-w-3xl mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-[11px] font-bold uppercase tracking-wider mb-2 border border-indigo-500/30">
              <Sparkles size={13} /> Interactive Cross-Discipline Fusion Engine
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 font-sans">
              Combine Your Passions (e.g. Music + Tech = Acoustic DSP Engineer)
            </h2>
            <p className="text-xs text-slate-300 font-mono leading-relaxed">
              Don't limit yourself to generic software engineering. Select your foundational domain and technical focus to find high-impact niche disciplines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div>
              <label className="block text-slate-400 font-bold mb-1.5 uppercase text-[10px]">
                1. Select Primary Discipline / Passion:
              </label>
              <select
                value={fusionPrimary}
                onChange={(e) => setFusionPrimary(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#00B8F0]"
              >
                {PRIMARY_DISCIPLINES.map((d) => (
                  <option key={d} value={d} className="bg-slate-900 text-white">
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1.5 uppercase text-[10px]">
                2. Select Technical / Business Focus:
              </label>
              <select
                value={fusionSecondary}
                onChange={(e) => setFusionSecondary(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#00B8F0]"
              >
                {SECONDARY_FOCUS.map((f) => (
                  <option key={f} value={f} className="bg-slate-900 text-white">
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1.5 uppercase text-[10px]">
                3. Quick Keyword Search:
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="text"
                  placeholder="Search role, e.g. 'quant', 'genomics', 'kernel'..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 rounded-xl pl-9 pr-3.5 py-2.5 focus:outline-none focus:border-[#00B8F0]"
                />
              </div>
            </div>
          </div>

          {(fusionPrimary !== "All Disciplines" || fusionSecondary !== "All Tech Stacks" || searchQuery !== "") && (
            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between font-mono text-xs text-indigo-200">
              <span>Showing {filteredRoadmaps.length} matched specialized career paths</span>
              <button
                onClick={() => {
                  setFusionPrimary("All Disciplines");
                  setFusionSecondary("All Tech Stacks");
                  setSearchQuery("");
                }}
                className="text-xs text-indigo-400 hover:text-white underline cursor-pointer"
              >
                Reset Fusion Filters
              </button>
            </div>
          )}
        </div>

        {/* =========================================================================
            SECTION 2: CATEGORY SELECTOR & ROADMAP ROSTER
        ========================================================================= */}
        <div>
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none font-mono text-xs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap border ${
                  selectedCategory === cat
                    ? "bg-[#0066FF] text-white border-[#0066FF] shadow-xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Roadmaps Horizontal Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-mono text-xs">
            {filteredRoadmaps.map((track) => (
              <button
                key={track.id}
                onClick={() => handleTrackChange(track.id)}
                className={`px-4 py-3 rounded-2xl font-bold whitespace-nowrap transition-all border cursor-pointer ${
                  currentRoadmap.id === track.id
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                }`}
              >
                {track.roleName}
              </button>
            ))}
          </div>
        </div>

        {/* =========================================================================
            SECTION 3: ACTIVE ROLE ROADMAP DETAILS
        ========================================================================= */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          
          {/* Top Metadata */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${currentRoadmap.badgeColor}`}>
                  {currentRoadmap.category}
                </span>
                <div className="flex items-center gap-1">
                  {currentRoadmap.disciplines.map((d) => (
                    <span key={d} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono font-semibold">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 font-sans">
                {currentRoadmap.roleName}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-mono mt-1">
                {currentRoadmap.tagline}
              </p>
            </div>

            <div className="text-left md:text-right shrink-0">
              <div className="text-[10px] font-mono text-slate-400 uppercase font-bold mb-1.5">Target Employers</div>
              <div className="flex flex-wrap gap-1 justify-start md:justify-end">
                {currentRoadmap.targetCompanies.map((comp) => (
                  <span
                    key={comp}
                    className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-mono font-semibold"
                  >
                    {comp}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stage Progress Stepper */}
          <div className="py-6 border-b border-slate-100">
            <div className="text-xs font-mono text-slate-400 uppercase font-bold mb-3">
              Curriculum Progression Stages ({currentRoadmap.stages.length} Stages)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              {currentRoadmap.stages.map((stage) => (
                <button
                  key={stage.stageNumber}
                  onClick={() => handleStageChange(stage.stageNumber)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    activeStageNum === stage.stageNumber
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold">Stage {stage.stageNumber}</span>
                    <span className="text-[10px] opacity-75">{stage.duration}</span>
                  </div>
                  <div className="text-xs font-medium truncate font-sans">{stage.stageName}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Stage Details Grid */}
          <div className="pt-6 grid grid-cols-1 lg:grid-cols-3 gap-8 font-mono text-xs">
            
            {/* Focus & Core Skills */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="text-[11px] text-slate-400 uppercase font-bold mb-1">
                  Stage {currentStage.stageNumber} Objective:
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-sans mb-2">
                  {currentStage.stageName} ({currentStage.duration})
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-mono">
                  {currentStage.focus}
                </p>
              </div>

              <div>
                <div className="text-[11px] text-slate-400 uppercase font-bold mb-2">
                  Key Technical Competencies &amp; Tools:
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentStage.coreSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[11px] text-slate-400 uppercase font-bold mb-2">
                  Stage Deliverables &amp; Proof-of-Work Artifacts:
                </div>
                <div className="space-y-2">
                  {currentStage.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                      <CheckCircle2 size={16} className="text-[#0066FF] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommended Projects to Build */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-[#0066FF] font-bold uppercase text-[11px] mb-2">
                  <Zap size={14} /> Matched Production Systems
                </div>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed font-sans">
                  Build one of these systems to clear Stage {currentStage.stageNumber} proof-of-work:
                </p>

                <div className="space-y-3 mb-4">
                  {matchedProjects.length === 0 ? (
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-500 text-xs">
                      Explore any project from the 50-system catalog matching this stack.
                    </div>
                  ) : (
                    matchedProjects.map((p) => (
                      <div key={p.id} className="p-3 bg-white rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold text-[#0066FF]">{p.difficulty}</span>
                          <span className="text-[10px] text-slate-400">{p.domain}</span>
                        </div>
                        <div className="font-bold text-slate-900 text-xs mb-1 font-sans">{p.title}</div>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mb-2 font-sans">{p.tagline}</p>
                        <Link
                          href={`/arena/${p.slug}`}
                          className="text-[#0066FF] hover:underline font-bold text-xs inline-flex items-center gap-1"
                        >
                          View System PRD <ArrowRight size={12} />
                        </Link>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <Link
                href="/arena/daily-log"
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-center block transition-all shadow-xs"
              >
                Submit Stage Proof-of-Work
              </Link>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
