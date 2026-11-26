"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowLeft,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Bot,
  ShieldCheck,
  Building2,
  Database,
  Search,
  BookOpen,
  ArrowRight,
  Code2,
  Cpu,
  Zap,
  Globe,
  Layers,
  Check
} from "lucide-react";
import AuthGate from "@/app/_components/AuthGate";

export default function CustomProjectProposalPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [college, setCollege] = useState("");
  const [github, setGithub] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [domain, setDomain] = useState("AI & Distributed Systems");
  const [targetCompanies, setTargetCompanies] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [dataSource, setDataSource] = useState("");
  const [techStack, setTechStack] = useState("");
  const [prdMarkdown, setPrdMarkdown] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const [dpdpConsent, setDpdpConsent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const INDUSTRY_DATASETS = [
    {
      industry: "Geospatial & Earth Observation",
      companies: "Planet Labs, Capella Space, Sentinel Hub, Descartes Labs, Maxar",
      commonProblem: "Handling multi-gigabyte GeoTIFF imagery chunking, cloud masking, and sub-100ms vector spatial search without CPU bottlenecks.",
      dataSources: "Copernicus Open Access Hub (Sentinel-2), AWS Open Data Earth (Landsat-8), USGS EarthExplorer.",
      exampleSolution: "Tile-chunked FastAPI streamer with PyTorch U-Net inference & Qdrant Geo-radius filters."
    },
    {
      industry: "Healthcare & Life Sciences",
      companies: "Tempus AI, PathAI, Aidoc, Epic Systems, Paige AI",
      commonProblem: "Segmenting 3D volumetric medical scans (DICOM/NIfTI) while preserving patient privacy and deterministic audit logs.",
      dataSources: "PhysioNet (MIMIC-IV), The Cancer Imaging Archive (TCIA), Kaggle RSNA Brain Hemorrhage.",
      exampleSolution: "MONAI / PyTorch 3D UNETR pipeline with GPU slice inference and encrypted DICOM metadata parser."
    },
    {
      industry: "FinTech & Algorithmic Trading",
      companies: "Jane Street, Citadel Securities, Zerodha, Stripe, Razorpay, Plaid",
      commonProblem: "Processing 100,000+ real-time tick messages/sec with deterministic FIFO order book matching and zero GC jitter.",
      dataSources: "SEC EDGAR 10-K/Q filings API, Yahoo Finance WebSocket, NSE India Historical Bhavcopy, Binance Trade Stream.",
      exampleSolution: "Rust L3 Lock-free ring buffer order book matching engine with gRPC market data broadcast."
    },
    {
      industry: "Autonomous LLM Agents & Infrastructure",
      companies: "LangChain, Qdrant, Pinecone, vLLM, Modal, CrewAI, Cognition",
      commonProblem: "State checkpointing across multi-turn cyclic agent swarms with memory pruning and Postgres transaction deadlock prevention.",
      dataSources: "HuggingFace Datasets (FineWeb, MultiWOZ), arXiv papers with code, GitHub Public API.",
      exampleSolution: "LangGraph state machine with Redis cluster memory cache and FastEmbed sub-50ms vector indexing."
    },
    {
      industry: "Autonomous CyberSecurity & Cloud eBPF",
      companies: "CrowdStrike, Wiz, Sysdig, Palo Alto Networks, Datadog",
      commonProblem: "Detecting malicious syscalls and privilege escalations in Kubernetes containers at kernel level without latency overhead.",
      dataSources: "OWASP JuiceShop, MITRE ATT&CK Matrix, CVE Details API, NVD NIST Vulnerability Feeds.",
      exampleSolution: "Linux eBPF kernel hook monitor streaming ring buffer telemetry to a Prometheus dashboard."
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dpdpConsent) {
      setErrorMsg("Please grant DPDP data processing consent to proceed.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/arena/custom-proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: name,
          studentEmail: email,
          college,
          githubUsername: github,
          projectTitle,
          domain,
          targetCompanies,
          problemStatement,
          dataSource,
          techStack: techStack.split(",").map((s) => s.trim()).filter(Boolean),
          prdMarkdown,
          githubRepo,
          dpdpConsent
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Submission failed.");
      }

      setSuccessMsg(data.message || "Proposal submitted successfully for founder review!");
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGate
      featureTitle="Custom Blueprint Proposal"
      featureDescription="Sign in to propose your own unique production architecture, define industry problem statements, and submit PRDs for founder review."
    >
      <div
        className="min-h-screen bg-white text-slate-900 selection:bg-[#D9F83B] selection:text-slate-950 pt-24 pb-28 font-sans"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(29, 49, 137, 0.11) 1px, transparent 1px), linear-gradient(to bottom, rgba(29, 49, 137, 0.11) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      >
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
          
          {/* =========================================================================
              HERO BANNER
          ========================================================================= */}
          <div className="relative bg-[#070E54] border border-white/15 rounded-3xl p-8 sm:p-10 shadow-2xl overflow-hidden text-white mb-10">
            <div className="relative z-10 w-full">
              <Link
                href="/arena"
                className="inline-flex items-center gap-2 text-xs font-sans font-bold text-blue-200 hover:text-[#D9F83B] mb-4 transition-colors"
              >
                <ArrowLeft size={14} /> Back to Arena Catalog
              </Link>
              
              <div className="block">
                <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#D9F83B] text-slate-950 font-sans text-[11px] font-extrabold uppercase tracking-wider mb-4">
                  Custom Track Blueprint
                </div>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-sans">
                Propose a Custom <span className="text-[#D9F83B]">Production Project</span>
              </h1>

              <p className="text-blue-100/85 text-xs sm:text-sm font-sans mt-3 leading-relaxed w-full max-w-3xl">
                Follow our <strong className="text-white">Top-Company Problem Discovery Framework</strong>. Benchmark 20–30 leading tech companies in your target sector, pinpoint the mathematical or architectural bottleneck, pair it with verified open datasets, and submit your PRD for Founder Soham Sharma&apos;s review.
              </p>
            </div>
          </div>

          {/* =========================================================================
              SECTION 1: THE 4-STEP RESEARCH METHODOLOGY
          ========================================================================= */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs mb-10 w-full">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0066FF] uppercase mb-1">
              <Code2 size={15} /> RESEARCH BLUEPRINT METHODOLOGY
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 font-sans mb-2 tracking-tight">
              How to Formulate a Tier-1 Industry Problem Statement
            </h2>
            <p className="text-xs text-slate-600 font-mono mb-8 leading-relaxed w-full">
              Do not propose generic CRUD or clone apps. To build an undeniable portfolio project that impresses engineering directors, follow this 4-step architecture pattern:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
              <div className="p-5 rounded-2xl bg-gradient-to-b from-blue-50/70 to-slate-50 border border-blue-100/80 hover:border-blue-300 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 font-bold text-blue-700 mb-2">
                    <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-extrabold shadow-xs">1</span>
                    <span className="font-sans text-sm font-bold text-slate-900">Company Benchmark</span>
                  </div>
                  <p className="text-slate-600 text-[11px] font-sans leading-relaxed">
                    Benchmark 20–30 market leaders in the sector. Study their engineering blogs, architectural hurdles, and known bottlenecks.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-blue-100 text-[10px] text-blue-800 font-bold flex items-center gap-1">
                  <Building2 size={12} /> Market Research Phase
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-b from-emerald-50/70 to-slate-50 border border-emerald-100/80 hover:border-emerald-300 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 font-bold text-emerald-700 mb-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-extrabold shadow-xs">2</span>
                    <span className="font-sans text-sm font-bold text-slate-900">Pinpoint Bottleneck</span>
                  </div>
                  <p className="text-slate-600 text-[11px] font-sans leading-relaxed">
                    Define the mathematical, concurrency, or latency constraint (e.g., sub-150ms p95 latency, GPU slice memory pressure, lock contention).
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-emerald-100 text-[10px] text-emerald-800 font-bold flex items-center gap-1">
                  <Zap size={12} /> SLA &amp; Metrics Focus
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-b from-purple-50/70 to-slate-50 border border-purple-100/80 hover:border-purple-300 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 font-bold text-purple-700 mb-2">
                    <span className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center text-xs font-extrabold shadow-xs">3</span>
                    <span className="font-sans text-sm font-bold text-slate-900">Pair Open Data</span>
                  </div>
                  <p className="text-slate-600 text-[11px] font-sans leading-relaxed">
                    Identify free, verified open datasets or live WebSockets (e.g. Sentinel-2, MIMIC-IV, SEC EDGAR) to train &amp; feed your system.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-purple-100 text-[10px] text-purple-800 font-bold flex items-center gap-1">
                  <Database size={12} /> Authentic Datasets
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-50/70 to-slate-50 border border-amber-100/80 hover:border-amber-300 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 font-bold text-amber-700 mb-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-600 text-white flex items-center justify-center text-xs font-extrabold shadow-xs">4</span>
                    <span className="font-sans text-sm font-bold text-slate-900">Schemas &amp; Docker SLAs</span>
                  </div>
                  <p className="text-slate-600 text-[11px] font-sans leading-relaxed">
                    Document PostgreSQL / Vector schemas, REST/gRPC endpoints, and automated Dockerized test criteria for verification.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-amber-100 text-[10px] text-amber-800 font-bold flex items-center gap-1">
                  <ShieldCheck size={12} /> System Blueprint PRD
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              SECTION 2: CURATED INDUSTRY PROBLEMS & DATA SOURCES MATRIX
          ========================================================================= */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs mb-10 space-y-6 w-full">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-700 uppercase mb-1">
                <Database size={15} /> CURATED DATA &amp; ARCHITECTURE MATRIX
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 font-sans tracking-tight">
                Industry Problem Statements &amp; Verified Data Sources
              </h2>
              <p className="text-xs text-slate-600 font-mono mt-1 w-full">
                Draw inspiration from these verified public data repositories and architecture patterns to power your custom system proposal.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
              {INDUSTRY_DATASETS.map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200/90 hover:border-blue-300 hover:bg-white transition-all space-y-3.5 flex flex-col justify-between shadow-xs"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-slate-200/70">
                      <h3 className="font-bold text-slate-900 text-base font-sans flex items-center gap-2">
                        <Building2 size={18} className="text-[#0066FF]" />
                        <span>{item.industry}</span>
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0066FF] text-[10px] font-bold">
                        Track {idx + 1}
                      </span>
                    </div>

                    <div className="text-slate-600 text-[11px] font-sans">
                      <strong className="text-slate-900">Researched Leaders:</strong> {item.companies}
                    </div>

                    <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-100 text-[11px] font-sans text-rose-950">
                      <span className="text-rose-700 font-bold block mb-0.5">Core Technical Bottleneck:</span>
                      {item.commonProblem}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px] pt-1">
                    <div className="p-3 rounded-2xl bg-blue-50/80 text-blue-950 border border-blue-100">
                      <strong className="block text-blue-700 mb-1 font-sans">Open Data Sources:</strong>
                      {item.dataSources}
                    </div>
                    <div className="p-3 rounded-2xl bg-emerald-50/80 text-emerald-950 border border-emerald-100">
                      <strong className="block text-emerald-700 mb-1 font-sans">Target Architecture:</strong>
                      {item.exampleSolution}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* =========================================================================
              SECTION 3: CUSTOM PROPOSAL SUBMISSION FORM
          ========================================================================= */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs w-full">
            
            {successMsg ? (
              <div className="text-center py-12 space-y-4 font-mono text-xs w-full">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 size={36} />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 font-sans tracking-tight">
                  Proposal Submitted Successfully!
                </h2>
                <p className="text-slate-600 w-full leading-relaxed text-sm font-sans">
                  {successMsg} Founder Soham Sharma will evaluate your problem statement, open data sources, and system architecture specifications.
                </p>
                <div className="pt-6 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/arena"
                    className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-md"
                  >
                    Return to Arena Catalog
                  </Link>
                  <Link
                    href="/profile"
                    className="px-6 py-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0066FF] font-bold text-xs border border-blue-200 transition-all"
                  >
                    View My Profile &amp; Submissions
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 font-mono text-xs">
                
                <div className="border-b border-slate-100 pb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0066FF] font-bold text-xs uppercase mb-2">
                    <FileText size={14} /> Submission Portal
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 font-sans tracking-tight">
                    Submit Your Custom Project Proposal
                  </h3>
                  <p className="text-slate-500 text-xs font-sans mt-0.5">
                    Fill in your industry research details for founder evaluation and PRD indexing.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2 text-xs">
                    <AlertCircle size={18} className="shrink-0 text-rose-600" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Student Details */}
                <div className="space-y-4">
                  <div className="text-xs font-bold text-[#0066FF] uppercase font-sans">
                    1. Builder &amp; Institution Profile
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1.5 font-sans">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Ananya Patel"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF] transition-all shadow-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1.5 font-sans">Student Email *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. ananya@college.edu"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF] transition-all shadow-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1.5 font-sans">College / University *</label>
                      <input
                        type="text"
                        required
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        placeholder="e.g. IIT Indore / SGSITS Indore"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF] transition-all shadow-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1.5 font-sans">GitHub Username</label>
                      <input
                        type="text"
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
                        placeholder="e.g. ananyapatel"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF] transition-all shadow-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Project Title & Domain */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="text-xs font-bold text-[#0066FF] uppercase font-sans">
                    2. Proposal Architecture Specs
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1.5 font-sans">Project Title *</label>
                      <input
                        type="text"
                        required
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        placeholder="e.g. Multi-Tenant Satellite Flood Prediction API"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF] transition-all shadow-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1.5 font-sans">Domain Track *</label>
                      <select
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF] transition-all shadow-xs"
                      >
                        <option>Geospatial &amp; Earth Observation</option>
                        <option>Healthcare &amp; Life Sciences AI</option>
                        <option>FinTech &amp; High-Frequency Systems</option>
                        <option>Autonomous LLM Agents &amp; Infrastructure</option>
                        <option>CyberSecurity &amp; Cloud eBPF</option>
                        <option>Edge Computing &amp; Embedded Systems</option>
                        <option>Distributed Systems &amp; Databases</option>
                      </select>
                    </div>
                  </div>

                  {/* 20-30 Companies Researched */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5 font-sans">
                      Top 20–30 Companies Researched &amp; Benchmarked *
                    </label>
                    <input
                      type="text"
                      required
                      value={targetCompanies}
                      onChange={(e) => setTargetCompanies(e.target.value)}
                      placeholder="e.g. Planet Labs, Sentinel Hub, Descartes Labs, Maxar, Capella Space..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF] transition-all shadow-xs"
                    />
                  </div>

                  {/* Core Problem Statement */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5 font-sans">
                      Core Problem Statement &amp; Bottlenecks Identified *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={problemStatement}
                      onChange={(e) => setProblemStatement(e.target.value)}
                      placeholder="Describe the exact technical problem, latency requirements (<150ms), concurrency constraints, memory bottlenecks, or drawbacks of existing commercial solutions..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF] transition-all shadow-xs"
                    />
                  </div>

                  {/* Open Data Sources */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5 font-sans">
                      Open Data Sources / APIs to be Utilized *
                    </label>
                    <input
                      type="text"
                      required
                      value={dataSource}
                      onChange={(e) => setDataSource(e.target.value)}
                      placeholder="e.g. Copernicus Open Access Hub (Sentinel-2 L2A API) + USGS EarthExplorer"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF] transition-all shadow-xs"
                    />
                  </div>

                  {/* Tech Stack */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5 font-sans">
                      Target Tech Stack (comma separated) *
                    </label>
                    <input
                      type="text"
                      required
                      value={techStack}
                      onChange={(e) => setTechStack(e.target.value)}
                      placeholder="e.g. Python, FastAPI, PyTorch, PostGIS, Qdrant, Docker"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF] transition-all shadow-xs"
                    />
                  </div>

                  {/* PRD Markdown / System Architecture Specs */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5 font-sans">
                      System Architecture PRD Specs (Markdown) *
                    </label>
                    <textarea
                      rows={6}
                      required
                      value={prdMarkdown}
                      onChange={(e) => setPrdMarkdown(e.target.value)}
                      placeholder="Include your DB schemas, endpoints, microservices diagram, and target latency SLA (e.g. <150ms p95)..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF] transition-all shadow-xs"
                    />
                  </div>

                  {/* GitHub Repo */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5 font-sans">GitHub Repo Link (Optional)</label>
                    <input
                      type="url"
                      value={githubRepo}
                      onChange={(e) => setGithubRepo(e.target.value)}
                      placeholder="https://github.com/username/project-repo"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF] transition-all shadow-xs"
                    />
                  </div>
                </div>

                {/* Consent Checkbox */}
                <div className="pt-2 border-t border-slate-100">
                  <label className="flex items-start gap-3 cursor-pointer text-slate-700 font-sans text-xs">
                    <input
                      type="checkbox"
                      checked={dpdpConsent}
                      onChange={(e) => setDpdpConsent(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-[#0066FF] border-slate-300 focus:ring-[#0066FF] cursor-pointer"
                    />
                    <span>
                      I confirm this is an authentic software system proposal based on my industry research, and grant consent to process this data under Botmartz academic guidelines.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold font-sans uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-xl"
                >
                  {loading ? <Loader2 size={18} className="animate-spin text-cyan-400" /> : (
                    <>
                      <Send size={16} />
                      <span>Submit Proposal for Founder Review</span>
                    </>
                  )}
                </button>

              </form>
            )}

          </div>

        </div>
      </div>
    </AuthGate>
  );
}
