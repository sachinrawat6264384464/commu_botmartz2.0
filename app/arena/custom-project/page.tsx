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
      <div className="min-h-screen bg-white text-slate-900 pt-24 pb-28 font-sans">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">

          {/* =========================================================================
              HERO BANNER
          ========================================================================= */}
          <div
            className="relative bg-[#162774] border border-white/15 rounded-3xl p-8 sm:p-11 shadow-2xl overflow-hidden text-white mb-10"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          >
            <div className="relative z-10 w-full">
              <Link
                href="/arena"
                className="inline-flex items-center gap-2 text-xs font-sans font-bold text-blue-200 hover:text-white mb-4 transition-colors"
              >
                <ArrowLeft size={14} /> Back to Arena Catalog
              </Link>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-sans leading-tight">
                Propose a Custom Production Project
              </h1>

              <p className="text-blue-100/85 text-sm sm:text-base font-sans mt-3 leading-relaxed w-full max-w-3xl font-medium">
                Follow our <strong className="text-white">Top-Company Problem Discovery Framework</strong>. Benchmark 20–30 leading tech companies in your target sector, pinpoint the mathematical or architectural bottleneck, pair it with verified open datasets, and submit your PRD for Founder Soham Sharma&apos;s review.
              </p>
            </div>
          </div>

          {/* =========================================================================
              SECTION 1: THE 4-STEP RESEARCH METHODOLOGY
          ========================================================================= */}
          <div className="mb-12 w-full space-y-6">
            <div>
              <div className="text-xs font-sans font-extrabold text-[#162774] uppercase tracking-widest mb-2">
                Research Blueprint Methodology
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-sans mb-2.5 tracking-tight leading-tight">
                How to Formulate a Tier-1 Industry Problem Statement
              </h2>
              <p className="text-base text-slate-700 font-sans font-medium leading-relaxed max-w-4xl">
                Do not propose generic CRUD or clone apps. To build an undeniable portfolio project that impresses engineering directors, follow this 4-step architecture pattern:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 font-sans">
              {[
                {
                  num: "01",
                  title: "Company Benchmark",
                  desc: "Benchmark 20–30 market leaders in the sector. Study their engineering blogs, architectural hurdles, and known bottlenecks.",
                  tag: "Market Research Phase",
                },
                {
                  num: "02",
                  title: "Pinpoint Bottleneck",
                  desc: "Define the mathematical, concurrency, or latency constraint (e.g., sub-150ms p95 latency, GPU slice memory pressure, lock contention).",
                  tag: "SLA & Metrics Focus",
                },
                {
                  num: "03",
                  title: "Pair Open Data",
                  desc: "Identify free, verified open datasets or live WebSockets (e.g. Sentinel-2, MIMIC-IV, SEC EDGAR) to train & feed your system.",
                  tag: "Authentic Datasets",
                },
                {
                  num: "04",
                  title: "Schemas & Docker SLAs",
                  desc: "Document PostgreSQL / Vector schemas, REST/gRPC endpoints, and automated Dockerized test criteria for verification.",
                  tag: "System Blueprint PRD",
                },
              ].map((step, idx) => (
                <div
                  key={step.num}
                  className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 ${idx === 0
                      ? "bg-[#162774] text-white border border-[#162774]"
                      : "bg-[#F4F6FB] hover:bg-white text-slate-950 border border-slate-200 hover:border-[#162774]"
                    }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <span
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 ${idx === 0
                            ? "bg-white text-[#162774]"
                            : "bg-[#162774] text-white"
                          }`}
                      >
                        {step.num}
                      </span>
                    </div>
                    <h3
                      className={`text-lg sm:text-xl font-extrabold mb-2.5 leading-snug ${idx === 0 ? "text-white" : "text-slate-950"
                        }`}
                    >
                      {step.title}
                    </h3>
                    <p
                      className={`text-sm sm:text-[15px] font-medium leading-relaxed ${idx === 0 ? "text-blue-100/90" : "text-slate-700"
                        }`}
                    >
                      {step.desc}
                    </p>
                  </div>
                  <div
                    className={`mt-6 pt-4 border-t text-xs font-extrabold uppercase tracking-wider ${idx === 0
                        ? "border-white/15 text-blue-100"
                        : "border-slate-200 text-[#162774]"
                      }`}
                  >
                    {step.tag}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* =========================================================================
              SECTION 2: CURATED INDUSTRY PROBLEMS & DATA SOURCES MATRIX
          ========================================================================= */}
          <div className="mb-12 space-y-6 w-full">
            <div>
              <div className="text-xs font-sans font-extrabold text-[#162774] uppercase tracking-widest mb-2">
                Curated Data &amp; Architecture Matrix
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-sans tracking-tight leading-tight">
                Industry Problem Statements &amp; Verified Data Sources
              </h2>
              <p className="text-base text-slate-700 font-sans font-medium mt-2 max-w-4xl leading-relaxed">
                Draw inspiration from these verified public data repositories and architecture patterns to power your custom system proposal.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-sans">
              {INDUSTRY_DATASETS.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl bg-[#F4F6FB] border border-slate-200 hover:border-[#162774] hover:bg-white transition-all duration-300 shadow-sm hover:shadow-xl overflow-hidden flex flex-col justify-between"
                >
                  {/* Card Top Blue Header */}
                  <div
                    className="bg-[#162774] px-6 py-5 flex items-center justify-between gap-3"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
                      backgroundSize: "28px 28px",
                    }}
                  >
                    <h3 className="font-extrabold text-white text-lg sm:text-xl font-sans leading-snug">
                      {item.industry}
                    </h3>
                    <span className="px-3.5 py-1 rounded-full bg-white text-[#162774] text-xs font-extrabold shrink-0">
                      Track {idx + 1}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="text-slate-700 text-sm sm:text-[15px] font-sans font-medium leading-relaxed">
                        <strong className="text-slate-950 font-extrabold">Researched Leaders:</strong> {item.companies}
                      </div>

                      <div className="p-4 rounded-2xl bg-white border border-slate-200 text-sm sm:text-[15px] font-sans text-slate-700 font-medium leading-relaxed">
                        <span className="text-xs uppercase tracking-wider text-[#162774] font-extrabold block mb-1.5">
                          Core Technical Bottleneck
                        </span>
                        {item.commonProblem}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm sm:text-[15px] pt-1">
                      <div className="p-4 rounded-2xl bg-white text-slate-700 border border-slate-200 leading-relaxed font-medium">
                        <strong className="block text-xs uppercase tracking-wider text-[#162774] font-extrabold mb-1.5">
                          Open Data Sources
                        </strong>
                        {item.dataSources}
                      </div>
                      <div className="p-4 rounded-2xl bg-white text-slate-700 border border-slate-200 leading-relaxed font-medium">
                        <strong className="block text-xs uppercase tracking-wider text-[#162774] font-extrabold mb-1.5">
                          Target Architecture
                        </strong>
                        {item.exampleSolution}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* =========================================================================
              SECTION 3: CUSTOM PROPOSAL SUBMISSION FORM
          ========================================================================= */}
          <div className="rounded-3xl border border-slate-200 bg-white shadow-lg overflow-hidden w-full">

            {successMsg ? (
              <div className="text-center py-14 px-6 space-y-4 font-sans w-full">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 size={36} />
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-sans tracking-tight">
                  Proposal Submitted Successfully!
                </h2>
                <p className="text-slate-700 max-w-2xl mx-auto leading-relaxed text-base font-sans font-medium">
                  {successMsg} Founder Soham Sharma will evaluate your problem statement, open data sources, and system architecture specifications.
                </p>
                <div className="pt-6 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/arena"
                    className="px-6 py-3.5 rounded-xl bg-[#162774] hover:bg-[#1D3189] text-white font-bold text-sm transition-all shadow-md"
                  >
                    Return to Arena Catalog
                  </Link>
                  <Link
                    href="/profile"
                    className="px-6 py-3.5 rounded-xl bg-[#F4F6FB] hover:bg-slate-100 text-[#162774] font-bold text-sm border border-slate-200 transition-all"
                  >
                    View My Profile &amp; Submissions
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="font-sans">
                {/* Form Top Header Banner */}
                <div
                  className="bg-[#162774] text-white px-6 sm:px-10 py-7 sm:py-8"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                >
                  <div className="text-xs font-extrabold text-blue-200 uppercase tracking-widest mb-2">
                    Submission Portal
                  </div>
                  <h3 className="text-2xl sm:text-4xl font-extrabold text-white font-sans tracking-tight">
                    Submit Your Custom Project Proposal
                  </h3>
                  <p className="text-blue-100/85 text-sm sm:text-base font-sans font-medium mt-1.5">
                    Fill in your industry research details for founder evaluation and PRD indexing.
                  </p>
                </div>

                <div className="p-6 sm:p-10 space-y-8">
                  {errorMsg && (
                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2 text-sm font-semibold">
                      <AlertCircle size={18} className="shrink-0 text-rose-600" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Step 1: Student Details */}
                  <div className="p-6 sm:p-7 rounded-2xl bg-[#F4F6FB] border border-slate-200 space-y-5">
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                      <span className="w-7 h-7 rounded-full bg-[#162774] text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                        01
                      </span>
                      <span className="text-sm font-extrabold text-slate-950 uppercase tracking-wider">
                        Builder &amp; Institution Profile
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm text-slate-800 font-bold mb-2">Your Full Name *</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Ananya Patel"
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-base font-medium text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-[#162774] transition-all shadow-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-800 font-bold mb-2">Student Email *</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. ananya@college.edu"
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-base font-medium text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-[#162774] transition-all shadow-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm text-slate-800 font-bold mb-2">College / University *</label>
                        <input
                          type="text"
                          required
                          value={college}
                          onChange={(e) => setCollege(e.target.value)}
                          placeholder="e.g. IIT Indore / SGSITS Indore"
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-base font-medium text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-[#162774] transition-all shadow-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-800 font-bold mb-2">GitHub Username</label>
                        <input
                          type="text"
                          value={github}
                          onChange={(e) => setGithub(e.target.value)}
                          placeholder="e.g. ananyapatel"
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-base font-medium text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-[#162774] transition-all shadow-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Project Title & Domain */}
                  <div className="p-6 sm:p-7 rounded-2xl bg-[#F4F6FB] border border-slate-200 space-y-5">
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                      <span className="w-7 h-7 rounded-full bg-[#162774] text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                        02
                      </span>
                      <span className="text-sm font-extrabold text-slate-950 uppercase tracking-wider">
                        Proposal Architecture Specs
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm text-slate-800 font-bold mb-2">Project Title *</label>
                        <input
                          type="text"
                          required
                          value={projectTitle}
                          onChange={(e) => setProjectTitle(e.target.value)}
                          placeholder="e.g. Multi-Tenant Satellite Flood Prediction API"
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-base font-medium text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-[#162774] transition-all shadow-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-800 font-bold mb-2">Domain Track *</label>
                        <select
                          value={domain}
                          onChange={(e) => setDomain(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-base font-medium text-slate-950 focus:outline-none focus:border-[#162774] transition-all shadow-xs"
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

                    <div>
                      <label className="block text-sm text-slate-800 font-bold mb-2">
                        Top 20–30 Companies Researched &amp; Benchmarked *
                      </label>
                      <input
                        type="text"
                        required
                        value={targetCompanies}
                        onChange={(e) => setTargetCompanies(e.target.value)}
                        placeholder="e.g. Planet Labs, Sentinel Hub, Descartes Labs, Maxar, Capella Space..."
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-base font-medium text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-[#162774] transition-all shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-slate-800 font-bold mb-2">
                        Core Problem Statement &amp; Bottlenecks Identified *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={problemStatement}
                        onChange={(e) => setProblemStatement(e.target.value)}
                        placeholder="Describe the exact technical problem, latency requirements (<150ms), concurrency constraints, memory bottlenecks, or drawbacks of existing commercial solutions..."
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-base font-medium text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-[#162774] transition-all shadow-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm text-slate-800 font-bold mb-2">
                          Open Data Sources / APIs to be Utilized *
                        </label>
                        <input
                          type="text"
                          required
                          value={dataSource}
                          onChange={(e) => setDataSource(e.target.value)}
                          placeholder="e.g. Copernicus Open Access Hub (Sentinel-2 L2A API)"
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-base font-medium text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-[#162774] transition-all shadow-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-800 font-bold mb-2">
                          Target Tech Stack (comma separated) *
                        </label>
                        <input
                          type="text"
                          required
                          value={techStack}
                          onChange={(e) => setTechStack(e.target.value)}
                          placeholder="e.g. Python, FastAPI, PyTorch, PostGIS, Qdrant, Docker"
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-base font-medium text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-[#162774] transition-all shadow-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-slate-800 font-bold mb-2">
                        System Architecture PRD Specs (Markdown) *
                      </label>
                      <textarea
                        rows={6}
                        required
                        value={prdMarkdown}
                        onChange={(e) => setPrdMarkdown(e.target.value)}
                        placeholder="Include your DB schemas, endpoints, microservices diagram, and target latency SLA (e.g. <150ms p95)..."
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-base font-medium text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-[#162774] transition-all shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-slate-800 font-bold mb-2">GitHub Repo Link (Optional)</label>
                      <input
                        type="url"
                        value={githubRepo}
                        onChange={(e) => setGithubRepo(e.target.value)}
                        placeholder="https://github.com/username/project-repo"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-base font-medium text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-[#162774] transition-all shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Consent Checkbox */}
                  <div className="pt-1">
                    <label className="flex items-start gap-3 cursor-pointer text-slate-700 text-sm sm:text-base font-medium">
                      <input
                        type="checkbox"
                        checked={dpdpConsent}
                        onChange={(e) => setDpdpConsent(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded text-[#162774] border-slate-300 focus:ring-[#162774] cursor-pointer shrink-0"
                      />
                      <span>
                        I confirm this is an authentic software system proposal based on my industry research, and grant consent to process this data under Botmartz academic guidelines.
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-2xl bg-[#162774] hover:bg-[#1D3189] text-white font-extrabold text-base uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-lg hover:shadow-xl"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin text-white" /> : (
                      <>
                        <Send size={16} />
                        <span>Submit Proposal for Founder Review</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>
      </div>
    </AuthGate>
  );
}
