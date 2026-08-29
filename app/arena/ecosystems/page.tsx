"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Globe,
  Building2,
  Landmark,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Target,
  AlertTriangle,
  Lightbulb,
  DollarSign,
  Briefcase,
  CheckCircle2,
  Layers,
  Coins
} from "lucide-react";
import { INDUSTRY_ECOSYSTEMS, EcosystemDossier } from "@/lib/ecosystems";
import { ARENA_PROJECTS } from "@/lib/arena-projects";

export default function EcosystemsRadarPage() {
  const [selectedEcoId, setSelectedEcoId] = useState<string>(INDUSTRY_ECOSYSTEMS[0].id);

  const currentEco = INDUSTRY_ECOSYSTEMS.find((e) => e.id === selectedEcoId) || INDUSTRY_ECOSYSTEMS[0];

  const matchedProjects = ARENA_PROJECTS.filter((p) =>
    currentEco.matchingProjectIds.includes(p.id)
  );

  const logEcoTelemetry = (ecoId: string) => {
    fetch("/api/arena/telemetry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: "ECOSYSTEM_EXPLORED",
        metadata: { ecosystemId: ecoId }
      })
    }).catch(() => {});
  };

  const handleSelectEcosystem = (id: string) => {
    setSelectedEcoId(id);
    logEcoTelemetry(id);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-20">
      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 font-mono text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200">
                <Globe size={14} className="text-emerald-600" /> Industry Opportunity Radar
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900">
                Ecosystem Problems &amp; Government Grants Radar
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm font-mono mt-1">
                Analyze buyer-supplier dynamics across Defence, GovTech, Healthcare &amp; FinTech. Solve real industry bottlenecks and pitch for government grant fellowships (iDEX, TIDE 2.0).
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/arena/custom-project"
                className="px-5 py-3 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-2"
              >
                <Sparkles size={14} />
                <span>Pitch Custom Proposal</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 space-y-8">
        
        {/* Ecosystem Selection Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {INDUSTRY_ECOSYSTEMS.map((eco) => (
            <button
              key={eco.id}
              onClick={() => handleSelectEcosystem(eco.id)}
              className={`px-4 py-3 rounded-2xl font-mono text-xs font-bold whitespace-nowrap transition-all border cursor-pointer flex items-center gap-2 ${
                selectedEcoId === eco.id
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
              }`}
            >
              <span>{eco.icon}</span>
              <span>{eco.name}</span>
            </button>
          ))}
        </div>

        {/* Selected Ecosystem Overview Box */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-8">
          
          {/* Header */}
          <div className="border-b border-slate-100 pb-6">
            <div className="flex items-center gap-2 text-2xl font-bold text-slate-900 font-sans">
              <span>{currentEco.icon}</span>
              <span>{currentEco.name}</span>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm font-mono mt-1">
              {currentEco.tagline}
            </p>
          </div>

          {/* Buyer vs. Manufacturing Ecosystem Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200">
              <div className="flex items-center gap-2 text-blue-900 font-bold mb-2 uppercase text-[11px]">
                <Landmark size={14} /> Buyer Landscape &amp; Public Sector
              </div>
              <p className="text-slate-700 font-sans text-xs leading-relaxed">
                {currentEco.buyerLandscape}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 text-slate-900 font-bold mb-2 uppercase text-[11px]">
                <Building2 size={14} /> Private Suppliers &amp; Manufacturers
              </div>
              <p className="text-slate-700 font-sans text-xs leading-relaxed">
                {currentEco.manufacturingLandscape}
              </p>
            </div>
          </div>

          {/* Unsolved Industry Bottlenecks & Ideas */}
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-800 uppercase mb-2">
              <Lightbulb size={15} /> Industry Problem Discovery
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-sans mb-4">
              Top Unsolved Engineering Bottlenecks &amp; Build Ideas
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentEco.unsolvedProblems.map((prob, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between font-mono text-xs hover:border-slate-300 transition-all"
                >
                  <div>
                    <span className="text-[10px] text-amber-700 font-bold uppercase block mb-1">
                      Problem #{idx + 1}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm font-sans mb-2">
                      {prob.title}
                    </h3>
                    <p className="text-slate-600 text-xs font-sans mb-3 leading-relaxed">
                      <strong>Bottleneck:</strong> {prob.bottleneck}
                    </p>
                    <div className="p-3 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-700 font-sans mb-3">
                      <strong>💡 Build Prompt Idea:</strong> {prob.promptIdea}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex flex-wrap gap-1">
                    {prob.recommendedStack.map((stk, sIdx) => (
                      <span key={sIdx} className="px-2 py-0.5 rounded bg-slate-200/80 text-slate-800 text-[10px] font-bold">
                        {stk}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Government Grants & Innovation Challenges */}
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-800 uppercase mb-2">
              <DollarSign size={15} /> Non-Dilutive Government Grants &amp; MOUs
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-sans mb-4">
              Government Innovation Fellowships &amp; Seed Grants
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              {currentEco.governmentGrants.map((gr, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex flex-col justify-between">
                  <div>
                    <span className="text-emerald-900 font-extrabold text-sm block mb-1 font-sans">
                      {gr.name}
                    </span>
                    <div className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold text-[10px] inline-block mb-2">
                      {gr.grantAmount}
                    </div>
                    <p className="text-slate-700 text-xs font-sans leading-relaxed mb-4">
                      {gr.description}
                    </p>
                  </div>

                  <a
                    href={gr.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all shadow-2xs"
                  >
                    <span>Visit Official Grant Portal</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Target Hiring Companies */}
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0066FF] uppercase mb-2">
              <Briefcase size={15} /> Industry Employer Directory
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-sans mb-4">
              Target Companies Hiring in {currentEco.name}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 font-mono text-xs">
              {currentEco.targetCompanies.map((tc, idx) => (
                <a
                  key={idx}
                  href={tc.careerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="font-bold text-slate-900 font-sans text-xs group-hover:text-[#0066FF]">
                      {tc.name}
                    </div>
                    <div className="text-[10px] text-slate-500 font-sans mt-0.5">
                      {tc.domain}
                    </div>
                  </div>
                  <div className="mt-2 text-[10px] text-blue-600 flex items-center gap-1 font-bold">
                    <span>Careers</span>
                    <ExternalLink size={10} />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Matched Production Projects in the Arena */}
          <div>
            <div className="flex items-center justify-between mb-4 font-mono">
              <h2 className="text-base font-bold text-slate-900 font-sans">
                Ready-to-Build Arena Projects for {currentEco.name} ({matchedProjects.length})
              </h2>
              <Link href="/arena" className="text-[#0066FF] font-bold text-xs hover:underline">
                View Full 50-Project Matrix →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              {matchedProjects.map((p) => (
                <div
                  key={p.id}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-[#0066FF] font-bold text-[10px] border border-blue-200">
                        {p.difficulty}
                      </span>
                      <span className="text-[10px] text-slate-400">{p.durationDays} Days Cohort</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm font-sans mb-1">{p.title}</h3>
                    <p className="text-slate-600 text-xs font-sans line-clamp-2 mb-3">{p.overview}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500">{p.domain}</span>
                    <Link
                      href={`/arena/${p.id}`}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 transition-all"
                    >
                      <span>Build Project</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
