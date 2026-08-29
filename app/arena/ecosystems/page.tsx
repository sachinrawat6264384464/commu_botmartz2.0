"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Globe,
  Building2,
  Landmark,
  ArrowRight,
  ExternalLink,
  Target,
  Lightbulb,
  DollarSign,
  Briefcase,
  CheckCircle2,
  Layers,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  ShieldCheck,
  Cpu,
  Activity,
  Compass
} from "lucide-react";
import { INDUSTRY_ECOSYSTEMS, EcosystemDossier } from "@/lib/ecosystems";
import { ARENA_PROJECTS } from "@/lib/arena-projects";

const ITEMS_PER_PAGE = 4;

export default function EcosystemsRadarPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All Sectors");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEcoId, setSelectedEcoId] = useState<string>(INDUSTRY_ECOSYSTEMS[0].id);

  const categories = useMemo(() => {
    const cats = new Set(INDUSTRY_ECOSYSTEMS.map((e) => e.category));
    return ["All Sectors", ...Array.from(cats)];
  }, []);

  const filteredEcosystems = useMemo(() => {
    return INDUSTRY_ECOSYSTEMS.filter((eco) => {
      const matchesCategory = selectedCategory === "All Sectors" || eco.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        eco.name.toLowerCase().includes(q) ||
        eco.tagline.toLowerCase().includes(q) ||
        eco.buyerLandscape.toLowerCase().includes(q) ||
        eco.manufacturingLandscape.toLowerCase().includes(q) ||
        eco.unsolvedProblems.some((p) => p.title.toLowerCase().includes(q) || p.recommendedStack.some((s) => s.toLowerCase().includes(q))) ||
        eco.targetCompanies.some((c) => c.name.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredEcosystems.length / ITEMS_PER_PAGE) || 1;
  const paginatedEcosystems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEcosystems.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredEcosystems, currentPage]);

  const currentEco = INDUSTRY_ECOSYSTEMS.find((e) => e.id === selectedEcoId) || filteredEcosystems[0] || INDUSTRY_ECOSYSTEMS[0];

  const matchedProjects = ARENA_PROJECTS.filter((p) =>
    currentEco.matchingProjectIds.includes(p.id)
  );

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-20 font-sans">
      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-[#0066FF] font-mono text-xs font-bold uppercase tracking-wider mb-2 border border-blue-200">
                <Globe size={14} /> Industrial Ecosystems &amp; Market Intelligence
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Industry Problem Discovery &amp; Government Grants Radar
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm font-mono mt-1">
                Explore buyer-supplier market structures across 10 strategic sectors. Identify real unsolved engineering bottlenecks, government fellowship schemes, and target hiring enterprises.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/arena/custom-project"
                className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-2"
              >
                <Compass size={14} />
                <span>Pitch Custom Proposal</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
        {/* Filter & Search Bar */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4 font-mono text-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search sectors, technologies (e.g. PyTorch, Rust, SAR, eBPF), companies or problems..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#0066FF]"
              />
            </div>

            {/* Total Records Counter */}
            <div className="text-slate-500 text-xs font-bold">
              Showing {filteredEcosystems.length} Industrial Sectors
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all border cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Sectors Grid with Pagination */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            {paginatedEcosystems.map((eco) => {
              const isSelected = selectedEcoId === eco.id;
              return (
                <div
                  key={eco.id}
                  onClick={() => setSelectedEcoId(eco.id)}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-blue-50/70 border-[#0066FF] shadow-sm"
                      : "bg-white border-slate-200 hover:border-slate-300 shadow-2xs"
                  }`}
                >
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">
                      {eco.category}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm font-sans mb-1.5">
                      {eco.name}
                    </h3>
                    <p className="text-slate-600 text-xs font-sans line-clamp-3 mb-4 leading-relaxed">
                      {eco.tagline}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-bold">
                      {eco.unsolvedProblems.length} Problem Tracks
                    </span>
                    <span className={`font-bold ${isSelected ? "text-[#0066FF]" : "text-slate-700"}`}>
                      {isSelected ? "Active Dossier" : "Inspect"} →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 bg-white border border-slate-200 rounded-2xl p-4 font-mono text-xs">
              <div className="text-slate-500">
                Page {currentPage} of {totalPages}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft size={14} />
                  <span>Previous</span>
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Selected Sector Deep-Dive Dossier Box */}
        {currentEco && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8 animate-fadeIn">
            
            {/* Header */}
            <div className="border-b border-slate-100 pb-6">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0066FF] uppercase mb-1">
                <span>{currentEco.category}</span>
                <span>•</span>
                <span>Comprehensive Industry Dossier</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-sans tracking-tight">
                {currentEco.name}
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm font-mono mt-1 leading-relaxed">
                {currentEco.tagline}
              </p>
              {currentEco.marketOverview && (
                <p className="text-slate-700 text-xs font-sans mt-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 leading-relaxed">
                  <strong>Market Dynamics:</strong> {currentEco.marketOverview}
                </p>
              )}
            </div>

            {/* Buyer vs. Manufacturing Structure */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
              <div className="p-6 rounded-2xl bg-blue-50/60 border border-blue-200">
                <div className="flex items-center gap-2 text-blue-900 font-bold mb-2 uppercase text-[11px]">
                  <Landmark size={15} /> Primary Buyer &amp; Regulatory Landscape
                </div>
                <p className="text-slate-700 font-sans text-xs leading-relaxed">
                  {currentEco.buyerLandscape}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 text-slate-900 font-bold mb-2 uppercase text-[11px]">
                  <Building2 size={15} /> Private Manufacturing &amp; Supplier Landscape
                </div>
                <p className="text-slate-700 font-sans text-xs leading-relaxed">
                  {currentEco.manufacturingLandscape}
                </p>
              </div>
            </div>

            {/* Unsolved Engineering Problems & Project Ideas */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-900 uppercase mb-2">
                <Lightbulb size={15} className="text-amber-600" /> Unsolved Engineering Bottlenecks
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-sans mb-4">
                Real-World Problem Statements &amp; Build Prompts
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentEco.unsolvedProblems.map((prob, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between font-mono text-xs hover:border-slate-300 transition-all"
                  >
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">
                        Challenge Specification #{idx + 1}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm font-sans mb-2">
                        {prob.title}
                      </h4>
                      <p className="text-slate-600 text-xs font-sans mb-3 leading-relaxed">
                        <strong>Engineering Bottleneck:</strong> {prob.bottleneck}
                      </p>
                      <div className="p-3 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-700 font-sans mb-3 leading-relaxed">
                        <strong>Build Prompt:</strong> {prob.promptIdea}
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

            {/* Non-Dilutive Government Grants & Fellowship Links */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-800 uppercase mb-2">
                <DollarSign size={15} /> Non-Dilutive Government Grants &amp; Fellowships
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-sans mb-4">
                Funding Schemes, Innovation Grants &amp; Fellowships
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                {currentEco.governmentGrants.map((gr, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex flex-col justify-between">
                    <div>
                      <span className="text-emerald-950 font-extrabold text-sm block mb-1 font-sans">
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
                      className="py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all shadow-2xs"
                    >
                      <span>Visit Official Portal</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Target Hiring Companies */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0066FF] uppercase mb-2">
                <Briefcase size={15} /> Employer Directory
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-sans mb-4">
                Target Companies &amp; OEMs in {currentEco.name}
              </h3>

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

            {/* Matching Production Systems in the Internship Playground */}
            <div>
              <div className="flex items-center justify-between mb-4 font-mono text-xs">
                <h3 className="text-base font-bold text-slate-900 font-sans">
                  Matching Playground Projects ({matchedProjects.length})
                </h3>
                <Link href="/arena" className="text-[#0066FF] font-bold hover:underline">
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
                      <h4 className="font-bold text-slate-900 text-sm font-sans mb-1">{p.title}</h4>
                      <p className="text-slate-600 text-xs font-sans line-clamp-2 mb-3">{p.overview}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">{p.domain}</span>
                      <Link
                        href={`/arena/${p.id}`}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 transition-all"
                      >
                        <span>Build in Playground</span>
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
