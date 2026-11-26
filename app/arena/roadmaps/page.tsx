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
  Check,
  ChevronRight,
  BookOpen,
  GraduationCap
} from "lucide-react";
import { ROLE_ROADMAPS, RoleRoadmap } from "@/lib/roadmaps";
import AuthGate from "@/app/_components/AuthGate";

const PRIMARY_DOMAINS = [
  { id: "Core Engineering", label: "Core Software & Engineering", icon: Code2, desc: "Backend, Frontend, Full Stack, Systems, Low-Latency Rust, Cloud/DevOps" },
  { id: "AI/ML", label: "Artificial Intelligence & Data", icon: Cpu, desc: "PyTorch, Agent Swarms, LangGraph, WebGPU SLM, Computer Vision" },
  { id: "Product & Design", label: "Product Management & Design", icon: Layers, desc: "Technical PM, AI PM, Growth PLG, UI/UX Design Systems" },
  { id: "MBA, Business & Finance", label: "MBA, Strategy & Quant Finance", icon: LineChart, desc: "Algorithmic Trading, PMM, Tech BizOps, Venture Capital" },
  { id: "Cybersecurity & Defense", label: "Cybersecurity & Zero-Trust Defense", icon: Shield, desc: "Autonomous Red-Team Pentesting, Linux eBPF Kernel, Threat Ops" },
  { id: "Cross-Discipline Hybrids", label: "Cross-Discipline Hybrids (Music, Bio, Agri, Law)", icon: Sparkles, desc: "Acoustic DSP, Bio-Informatics, Agritech, RISC-V, LegalTech" }
];

export default function ProgressiveRoadmapsPage() {
  const [selectedDomain, setSelectedDomain] = useState<string>("Core Engineering");
  const [selectedRoleId, setSelectedRoleId] = useState<string>(ROLE_ROADMAPS[0].id);
  const [experienceLevel, setExperienceLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [activeStageNum, setActiveStageNum] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Available roles in selected domain
  const availableRoles = useMemo(() => {
    return ROLE_ROADMAPS.filter((r) => {
      if (selectedDomain === "AI/ML") {
        return r.category === "Core Engineering" && (r.roleName.includes("AI") || r.roleName.includes("Machine Learning") || r.roleName.includes("Vision"));
      }
      return r.category === selectedDomain;
    });
  }, [selectedDomain]);

  // Selected Roadmap
  const currentRoadmap = useMemo(() => {
    const found = ROLE_ROADMAPS.find((r) => r.id === selectedRoleId);
    if (found) return found;
    return availableRoles[0] || ROLE_ROADMAPS[0];
  }, [selectedRoleId, availableRoles]);

  const currentStage =
    currentRoadmap.stages.find((s) => s.stageNumber === activeStageNum) ||
    currentRoadmap.stages[0];

  const handleDomainSelect = (domainId: string) => {
    setSelectedDomain(domainId);
    const firstMatching = ROLE_ROADMAPS.find(r => domainId === "AI/ML" ? (r.category === "Core Engineering" && r.roleName.includes("AI")) : r.category === domainId);
    if (firstMatching) {
      setSelectedRoleId(firstMatching.id);
      setActiveStageNum(1);
    }
  };

  return (
    <AuthGate
      featureTitle="50 Progressive Career Roadmaps"
      featureDescription="Sign in to explore stage-by-stage engineering milestones, foundational prerequisites, and systems design concepts for all 50 specialized roles."
    >
      <div
        className="min-h-screen bg-white text-slate-900 pt-24 pb-24 font-sans selection:bg-[#D9F83B] selection:text-slate-950"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(29, 49, 137, 0.11) 1px, transparent 1px), linear-gradient(to bottom, rgba(29, 49, 137, 0.11) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      >
        
        {/* Header Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
          <div className="bg-[#070E54] text-white rounded-3xl p-7 sm:p-10 border border-white/15 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#D9F83B] text-slate-950 font-sans text-[11px] font-extrabold uppercase tracking-wider mb-3">
                Career Discovery &amp; Learning Roadmaps
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Progressive Career Roadmaps
              </h1>
              <p className="text-blue-100/85 text-xs sm:text-sm font-sans mt-2 leading-relaxed">
                Step-by-step career path guides across 50+ technical, product, and cross-discipline roles. Discover required foundational concepts, system design prerequisites, and measurable stage milestones.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 font-sans text-xs">
              <Link
                href="/arena"
                className="px-5 py-3 rounded-2xl bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-bold transition-all shadow-md"
              >
                Internship Playground &rarr;
              </Link>
            </div>
          </div>
        </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
        {/* =========================================================================
            STEP 1: SELECT PRIMARY DISCIPLINE / DOMAIN
        ========================================================================= */}
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-500 uppercase mb-3">
            <span>Step 1: Choose Your Primary Discipline</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRIMARY_DOMAINS.map((domain) => {
              const IconComp = domain.icon;
              const isSelected = selectedDomain === domain.id;
              return (
                <button
                  key={domain.id}
                  onClick={() => handleDomainSelect(domain.id)}
                  className={`p-5 rounded-3xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-[#0066FF]/20"
                      : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800"
                  }`}
                >
                  <div>
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 ${
                      isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"
                    }`}>
                      <IconComp size={20} />
                    </div>
                    <h3 className="font-bold text-base mb-1 font-sans">{domain.label}</h3>
                    <p className={`text-xs font-mono leading-relaxed ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                      {domain.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono font-bold">
                    <span>{isSelected ? "Selected Discipline" : "Select Path"}</span>
                    <ChevronRight size={14} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            STEP 2: SELECT SPECIALIZED CAREER ROLE
        ========================================================================= */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="text-xs font-mono font-bold text-slate-500 uppercase mb-1">
                Step 2: Select Specific Career Track ({availableRoles.length} Tracks Available)
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-sans">
                Choose Your Target Specialization
              </h2>
            </div>

            {/* Experience Level Selector */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl font-mono text-xs font-bold">
              {(["beginner", "intermediate", "advanced"] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => {
                    setExperienceLevel(lvl);
                    if (lvl === "beginner") setActiveStageNum(1);
                    if (lvl === "intermediate") setActiveStageNum(2);
                    if (lvl === "advanced") setActiveStageNum(3);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl capitalize transition-all cursor-pointer ${
                    experienceLevel === lvl ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Roles Horizontal Pill Bar - Constrained with Custom Scrollbar */}
          <div className="pt-6 w-full max-w-full overflow-x-auto pb-3 flex items-center gap-2.5 scrollbar-thin font-mono text-xs">
            {availableRoles.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setSelectedRoleId(r.id);
                  setActiveStageNum(experienceLevel === "beginner" ? 1 : experienceLevel === "intermediate" ? 2 : 3);
                }}
                className={`px-4 py-3 rounded-2xl font-bold whitespace-nowrap shrink-0 transition-all border cursor-pointer ${
                  currentRoadmap.id === r.id
                    ? "bg-[#0066FF] text-white border-[#0066FF] shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {r.roleName}
              </button>
            ))}
          </div>
        </div>

        {/* =========================================================================
            STEP 3: COMPREHENSIVE PROGRESSIVE ROADMAP BREAKDOWN
        ========================================================================= */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          
          {/* Experience Level Context Banner */}
          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 text-blue-900 font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-[#0066FF] shrink-0" />
              <span>
                <strong>{experienceLevel.toUpperCase()} TRACK:</strong>{" "}
                {experienceLevel === "beginner"
                  ? "Focused on Stage 1 (Foundations, Syntax, REST endpoints & Core Data Structures)."
                  : experienceLevel === "intermediate"
                  ? "Focused on Stage 2 (Distributed Systems, Vector Embeddings, Docker & Database Indexing)."
                  : "Focused on Stage 3 (Sub-150ms SLA gates, ONNX Quantization, Kernel eBPF & Senior Production Mastery)."}
              </span>
            </div>
            <span className="text-[10px] text-[#0066FF] font-bold shrink-0 uppercase bg-white px-2.5 py-1 rounded-lg border border-blue-200 self-start sm:self-auto">
              Stage {experienceLevel === "beginner" ? 1 : experienceLevel === "intermediate" ? 2 : 3} Active
            </span>
          </div>

          {/* Header of Active Roadmap */}
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
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-sans">
                {currentRoadmap.roleName}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-mono mt-1">
                {currentRoadmap.tagline}
              </p>
            </div>

            <div className="text-left md:text-right shrink-0">
              <div className="text-[10px] font-mono text-slate-400 uppercase font-bold mb-1.5">Common Hiring Companies</div>
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

          {/* Stage Progression Stepper */}
          <div className="py-6 border-b border-slate-100">
            <div className="text-xs font-mono text-slate-400 uppercase font-bold mb-3">
              Curriculum Progression ({currentRoadmap.stages.length} Stages)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              {currentRoadmap.stages.map((stage) => (
                <button
                  key={stage.stageNumber}
                  onClick={() => setActiveStageNum(stage.stageNumber)}
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

          {/* Active Stage Deep Dive */}
          <div className="pt-6 grid grid-cols-1 lg:grid-cols-3 gap-8 font-mono text-xs">
            
            {/* Core Competencies & Concept Foundations */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="text-[11px] text-slate-400 uppercase font-bold mb-1">
                  Stage {currentStage.stageNumber} Learning Focus:
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
                  Key Technical Competencies &amp; Algorithms:
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
                  Milestone Deliverables &amp; Proof-of-Work Checklist:
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

            {/* System Design Core Prerequisites */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between font-mono text-xs">
              <div>
                <div className="flex items-center gap-2 text-purple-700 font-bold uppercase text-[11px] mb-2">
                  <GraduationCap size={15} /> System Design &amp; AI Concepts
                </div>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed font-sans">
                  Mandatory concepts to master before building production systems (anti-vibe coding):
                </p>

                <div className="space-y-2 mb-6">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <div className="font-bold text-slate-900 mb-0.5">Database &amp; Latency Internals</div>
                    <div className="text-[11px] text-slate-500">Connection pools, B-Tree vs BRIN indexes, p95 vs p99 latency profiling.</div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <div className="font-bold text-slate-900 mb-0.5">State Machine Determinism</div>
                    <div className="text-[11px] text-slate-500">Idempotency keys, distributed locks, recovery from 504 tool call timeouts.</div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <div className="font-bold text-slate-900 mb-0.5">Automated Test Gates</div>
                    <div className="text-[11px] text-slate-500">Playwright E2E suites, k6 distributed spike tests, zero flaky tests in CI/CD.</div>
                  </div>
                </div>
              </div>

              <Link
                href="/arena/daily-log"
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-center block transition-all shadow-xs"
              >
                Log Stage Progress
              </Link>
            </div>

          </div>

        </div>

      </div>

      </div>
    </AuthGate>
  );
}
