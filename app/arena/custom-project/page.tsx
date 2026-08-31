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
  Code2
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
      <div className="min-h-screen bg-[#FAFCFF] text-slate-900 pb-24 font-sans selection:bg-[#0066FF] selection:text-white">
        
        {/* Header */}
        <div className="bg-white border-b border-slate-200 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link
            href="/arena"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-500 hover:text-[#0066FF] mb-3 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Arena
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0066FF] font-mono text-xs font-bold uppercase tracking-wider mb-2 border border-blue-200">
            <Sparkles size={14} /> Custom Track Blueprint
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Propose a Custom Production Project
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm font-mono mt-2 leading-relaxed">
            Follow our <strong>Top-Company Problem Discovery Framework</strong>. Analyze 20–30 leading tech companies in your target industry, identify the bottleneck, pair it with open data, and submit your PRD for Founder Soham Sharma&apos;s review.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8 space-y-8">
        
        {/* =========================================================================
            SECTION 1: THE 4-STEP RESEARCH METHODOLOGY
        ========================================================================= */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="text-xs font-mono font-bold text-[#0066FF] uppercase mb-1">
            RESEARCH BLUEPRINT
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-sans mb-3">
            How to Formulate a Tier-1 Industry Problem Statement
          </h2>
          <p className="text-xs text-slate-600 font-mono mb-6 leading-relaxed">
            Do not propose generic clone apps. To build an undeniable portfolio project, follow this 4-step engineering pattern:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 font-bold text-blue-600 mb-1">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-[10px]">1</span>
                <span>Top 20–30 Company Benchmark</span>
              </div>
              <p className="text-slate-600 text-[11px] font-sans">
                List 20–30 market leaders in the sector. Study their engineering blogs, architectural hurdles, and known drawbacks.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 font-bold text-emerald-600 mb-1">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px]">2</span>
                <span>Identify the Exact Bottleneck</span>
              </div>
              <p className="text-slate-600 text-[11px] font-sans">
                Define the mathematical, concurrency, or latency bottleneck (e.g. sub-150ms latency, high memory pressure, cache invalidation).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 font-bold text-purple-600 mb-1">
                <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center text-[10px]">3</span>
                <span>Pair with Authentic Public Data</span>
              </div>
              <p className="text-slate-600 text-[11px] font-sans">
                Identify free, verified open datasets or live WebSocket APIs to train, benchmark, and feed your system.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 font-bold text-amber-600 mb-1">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px]">4</span>
                <span>Define Multi-Table Schemas &amp; SLAs</span>
              </div>
              <p className="text-slate-600 text-[11px] font-sans">
                Document PostgreSQL / Vector schemas, REST/gRPC endpoints, and automated Dockerized test criteria.
              </p>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTION 2: CURATED INDUSTRY PROBLEMS & DATA SOURCES MATRIX
        ========================================================================= */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div>
            <div className="text-xs font-mono font-bold text-emerald-700 uppercase mb-1">
              CURATED DATA MATRIX
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-sans">
              Industry Problem Statements &amp; Data Sources
            </h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Use these verified public data repositories to power your custom system architecture.
            </p>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {INDUSTRY_DATASETS.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all space-y-2"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="font-bold text-slate-900 text-sm font-sans flex items-center gap-2">
                    <Building2 size={16} className="text-[#0066FF]" />
                    <span>{item.industry}</span>
                  </h3>
                </div>

                <div className="text-slate-600 text-[11px] font-sans">
                  <strong>Top Companies Researched:</strong> {item.companies}
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 text-[11px]">
                  <span className="text-rose-600 font-bold">Core Problem:</span> {item.commonProblem}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-900 border border-blue-100">
                    <strong className="block text-blue-700 mb-0.5">Open Data Sources:</strong>
                    {item.dataSources}
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-100">
                    <strong className="block text-emerald-700 mb-0.5">Architecture Solution:</strong>
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
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          
          {successMsg ? (
            <div className="text-center py-10 space-y-4 font-mono text-xs">
              <CheckCircle2 size={48} className="text-emerald-600 mx-auto" />
              <h2 className="text-2xl font-bold text-slate-900 font-sans">Proposal Submitted Successfully!</h2>
              <p className="text-slate-600 max-w-md mx-auto leading-relaxed">
                {successMsg} Founder Soham Sharma will review your problem statement, data sources, and architecture specifications.
              </p>
              <div className="pt-4 flex items-center justify-center gap-3">
                <Link
                  href="/arena"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold"
                >
                  Return to Arena
                </Link>
                <Link
                  href="/profile"
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-800 font-bold border border-slate-200"
                >
                  View My Profile
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 font-mono text-xs">
              
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-sans mb-1">
                  Submit Your Custom Project Proposal
                </h3>
                <p className="text-slate-500 text-[11px]">
                  Fill in your industry research details for founder evaluation.
                </p>
              </div>

              {errorMsg && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Student Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Your Full Name:</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ananya Patel"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Student Email:</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. ananya@college.edu"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">College / Institution:</label>
                  <input
                    type="text"
                    required
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. IIT Indore / SGSITS Indore"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">GitHub Username:</label>
                  <input
                    type="text"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="e.g. ananyapatel"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>

              {/* Project Title & Domain */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Project Title:</label>
                  <input
                    type="text"
                    required
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="e.g. Multi-Tenant Satellite Flood Prediction API"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Domain Track:</label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-[#0066FF]"
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
                <label className="block text-slate-700 font-bold mb-1">
                  Top 20–30 Companies Researched &amp; Benchmarked:
                </label>
                <input
                  type="text"
                  required
                  value={targetCompanies}
                  onChange={(e) => setTargetCompanies(e.target.value)}
                  placeholder="e.g. Planet Labs, Sentinel Hub, Descartes Labs, Maxar, Capella Space..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              {/* Core Problem Statement */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Core Problem Statement &amp; Bottlenecks Identified:
                </label>
                <textarea
                  required
                  rows={3}
                  value={problemStatement}
                  onChange={(e) => setProblemStatement(e.target.value)}
                  placeholder="Describe the exact technical problem, latency requirements, concurrency constraints, or drawbacks of existing commercial solutions..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              {/* Open Data Sources */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Open Data Sources / APIs to be Utilized:
                </label>
                <input
                  type="text"
                  required
                  value={dataSource}
                  onChange={(e) => setDataSource(e.target.value)}
                  placeholder="e.g. Copernicus Open Access Hub (Sentinel-2 L2A API) + USGS EarthExplorer"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              {/* Tech Stack */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Target Tech Stack (comma separated):
                </label>
                <input
                  type="text"
                  required
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  placeholder="e.g. Python, FastAPI, PyTorch, PostGIS, Qdrant, Docker"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              {/* PRD Markdown / System Architecture Specs */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  System Architecture PRD Specs (Markdown):
                </label>
                <textarea
                  rows={6}
                  required
                  value={prdMarkdown}
                  onChange={(e) => setPrdMarkdown(e.target.value)}
                  placeholder="Include your DB schemas, endpoints, and target latency SLA (e.g. <150ms p95)..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono text-xs focus:bg-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              {/* GitHub Repo */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">GitHub Repo Link (Optional):</label>
                <input
                  type="url"
                  value={githubRepo}
                  onChange={(e) => setGithubRepo(e.target.value)}
                  placeholder="https://github.com/username/project-repo"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              {/* Consent Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={dpdpConsent}
                    onChange={(e) => setDpdpConsent(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-[#0066FF] border-slate-300 focus:ring-[#0066FF]"
                  />
                  <span>
                    I confirm this is an authentic software system proposal based on my industry research, and grant consent to process this data under Botmartz academic guidelines.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : (
                  <>
                    <Send size={15} />
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
