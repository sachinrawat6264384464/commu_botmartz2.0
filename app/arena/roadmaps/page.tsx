"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Compass,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Flame,
  Layers,
  Cpu,
  Shield,
  Database,
  LineChart,
  Terminal,
  ExternalLink,
  Code2,
  Briefcase
} from "lucide-react";
import { ROLE_ROADMAPS, RoleRoadmap } from "@/lib/roadmaps";
import { ARENA_PROJECTS } from "@/lib/arena-projects";

export default function RoadmapsExplorerPage() {
  const [selectedTrackId, setSelectedTrackId] = useState<string>(ROLE_ROADMAPS[0].id);
  const [activeStageNum, setActiveStageNum] = useState<number>(1);

  const currentRoadmap = ROLE_ROADMAPS.find((r) => r.id === selectedTrackId) || ROLE_ROADMAPS[0];
  const currentStage = currentRoadmap.stages.find((s) => s.stageNumber === activeStageNum) || currentRoadmap.stages[0];

  const matchedProjects = ARENA_PROJECTS.filter((p) =>
    currentStage.recommendedProjectIds.includes(p.id)
  );

  const logStageTelemetry = (trackId: string, stageNum: number) => {
    fetch("/api/arena/telemetry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: "ROADMAP_STAGE_CLICK",
        metadata: { trackId, stageNum }
      })
    }).catch(() => {});
  };

  const handleTrackChange = (trackId: string) => {
    setSelectedTrackId(trackId);
    setActiveStageNum(1);
    logStageTelemetry(trackId, 1);
  };

  const handleStageChange = (stageNum: number) => {
    setActiveStageNum(stageNum);
    logStageTelemetry(selectedTrackId, stageNum);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-20">
      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 text-purple-700 font-mono text-xs font-bold uppercase tracking-wider mb-2 border border-purple-200">
                <Compass size={14} /> Stage-Based Engineering Roadmaps
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900">
                Role Progression &amp; Project Matching Engine
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm font-mono mt-1">
                Select your engineering role, track your progression stage (Stage 1 to 4), and build matched production systems from our 50-project catalog.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/arena/ecosystems"
                className="px-5 py-3 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
              >
                🌐 Explore Ecosystems
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 space-y-8">
        
        {/* Track Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {ROLE_ROADMAPS.map((track) => (
            <button
              key={track.id}
              onClick={() => handleTrackChange(track.id)}
              className={`px-4 py-3 rounded-2xl font-mono text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                selectedTrackId === track.id
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
              }`}
            >
              {track.roleName}
            </button>
          ))}
        </div>

        {/* Active Track Overview Box */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${currentRoadmap.badgeColor}`}>
                {currentRoadmap.roleName}
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-2 font-sans">
                {currentRoadmap.tagline}
              </h2>
            </div>

            <div className="text-right shrink-0">
              <div className="text-xs font-mono text-slate-400 uppercase font-bold mb-1">Target Companies</div>
              <div className="flex flex-wrap gap-1.5 justify-start md:justify-end">
                {currentRoadmap.targetCompanies.map((c, i) => (
                  <span key={i} className="px-2.5 py-0.5 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 text-[11px] font-mono">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 4-Stage Stepper Navigation */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-6">
            {currentRoadmap.stages.map((stage) => (
              <button
                key={stage.stageNumber}
                onClick={() => handleStageChange(stage.stageNumber)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer font-mono ${
                  activeStageNum === stage.stageNumber
                    ? "bg-blue-50/70 border-[#0066FF] shadow-xs"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1">
                  <span>STAGE 0{stage.stageNumber}</span>
                  <span>{stage.duration}</span>
                </div>
                <div className="font-bold text-slate-900 text-xs line-clamp-1 font-sans">
                  {stage.stageName}
                </div>
              </button>
            ))}
          </div>

          {/* Active Stage Deep-Dive */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-3xl border border-slate-200">
            {/* Skills & Focus */}
            <div>
              <div className="text-xs font-mono font-bold text-[#0066FF] uppercase tracking-wider mb-1">
                Stage Focus &amp; Core Architecture
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3 font-sans">
                {currentStage.stageName}
              </h3>
              <p className="text-slate-600 text-xs font-sans mb-4 leading-relaxed">
                {currentStage.focus}
              </p>

              <div className="text-xs font-mono font-bold text-slate-700 mb-2 uppercase">
                Core Stack &amp; Protocols:
              </div>
              <div className="flex flex-wrap gap-1.5 mb-6">
                {currentStage.coreSkills.map((sk, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-mono font-bold shadow-2xs">
                    {sk}
                  </span>
                ))}
              </div>

              <div className="text-xs font-mono font-bold text-slate-700 mb-2 uppercase">
                Mandatory Stage Deliverables:
              </div>
              <ul className="space-y-2 text-xs font-sans text-slate-700">
                {currentStage.deliverables.filter(Boolean).map((del, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>{del}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Projects for This Stage */}
            <div>
              <div className="flex items-center justify-between mb-3 font-mono">
                <span className="text-xs font-bold text-purple-700 uppercase">
                  🎯 Recommended Projects for Stage 0{currentStage.stageNumber}
                </span>
                <span className="text-[11px] text-slate-400">({matchedProjects.length} Matched)</span>
              </div>

              <div className="space-y-4">
                {matchedProjects.map((p) => (
                  <div
                    key={p.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-all font-mono text-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-[#0066FF] font-bold text-[10px] border border-blue-200">
                          {p.difficulty}
                        </span>
                        <span className="text-[10px] text-slate-400">{p.durationDays} Days Cohort</span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm font-sans mb-1">
                        {p.title}
                      </h4>
                      <p className="text-slate-600 text-xs font-sans mb-3 line-clamp-2">
                        {p.overview}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {p.techStack.slice(0, 2).map((t, ti) => (
                          <span key={ti} className="text-[10px] text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded">
                            #{t}
                          </span>
                        ))}
                      </div>

                      <Link
                        href={`/arena/${p.id}`}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 transition-all"
                      >
                        <span>Build in Arena</span>
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                ))}

                {matchedProjects.length === 0 && (
                  <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs font-mono">
                    Explore all 50 multi-domain projects in the Arena.
                    <div className="mt-3">
                      <Link href="/arena" className="text-[#0066FF] font-bold underline">
                        View Full Project Matrix →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
