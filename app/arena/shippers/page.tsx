"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Flame,
  Trophy,
  Rocket,
  CheckCircle2,
  Linkedin,
  Building2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  ExternalLink,
  Code2,
  Users,
  Award,
  Loader2,
  Check,
  FileText,
  Star
} from "lucide-react";
import { ARENA_PROJECTS } from "@/lib/arena-projects";

export default function ShippersCirclePage() {
  // Checker state
  const [checkEmail, setCheckEmail] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [builderData, setBuilderData] = useState<any>(null);
  const [checkError, setCheckError] = useState("");

  // Claim modal/form state
  const [claimForm, setClaimForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
    github: "",
    linkedin: "",
    portfolioUrl: "",
    preferredRoles: "AI Engineer / Backend Dev",
    targetLocations: "Bangalore / Remote / Indore",
    project1Summary: "",
    project2Summary: "",
    project3Summary: "",
    notesForFounder: "",
  });
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [claimError, setClaimError] = useState("");

  const handleCheckPortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkEmail || !checkEmail.includes("@")) {
      setCheckError("Please enter a valid registered email address.");
      return;
    }

    setIsChecking(true);
    setCheckError("");

    try {
      const res = await fetch(`/api/arena/builder?email=${encodeURIComponent(checkEmail)}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to load builder records.");
      }

      setBuilderData(data.builder);
      // Pre-fill claim form if builder is found
      setClaimForm((prev) => ({
        ...prev,
        email: data.builder.email,
        name: data.builder.name,
        whatsapp: data.builder.whatsapp || prev.whatsapp,
        github: data.builder.github || prev.github,
        linkedin: data.builder.linkedin || prev.linkedin,
      }));
    } catch (err: any) {
      setCheckError(err.message || "Could not find builder data for this email.");
    } finally {
      setIsChecking(false);
    }
  };

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsClaiming(true);
    setClaimError("");

    try {
      const res = await fetch("/api/arena/referrals/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(claimForm),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit referral claim.");
      }

      setClaimSuccess(true);
    } catch (err: any) {
      setClaimError(err.message || "Failed to submit claim.");
    } finally {
      setIsClaiming(false);
    }
  };

  const HIRING_COMPANIES_SECTORS = [
    { name: "Botmartz AI Solutions Labs", track: "Applied LLMs & Autonomous Agents", location: "Indore & Remote", tags: ["FastAPI", "LangGraph", "PostgreSQL"] },
    { name: "Apex Vector Technologies", track: "Hybrid RAG & Knowledge Retrieval", location: "Bangalore", tags: ["Qdrant", "BM25", "Embeddings"] },
    { name: "PulseStream Distributed Systems", track: "Real-time High-Throughput Pipelines", location: "Hyderabad & Remote", tags: ["Django 5", "Celery", "Redis Streams"] },
    { name: "EdgeNeural Intelligence", track: "On-Device SLMs & WebGPU Inference", location: "Remote (Global)", tags: ["Next.js 16", "Transformers.js", "WASM"] },
    { name: "CipherGuard AppSec Labs", track: "Cloud Pentesting & Vulnerability Research", location: "Bangalore & Pune", tags: ["OWASP", "Burp", "Python Scanners"] },
    { name: "ScaleForge Cloud Infrastructure", track: "Kubernetes & Autonomous eBPF Probes", location: "Mumbai & Remote", tags: ["Rust", "eBPF", "Docker", "AWS"] },
    { name: "DocuMind Financial AI", track: "Document Layout Transformers", location: "Gurugram", tags: ["PyTorch", "LayoutLMv3", "FastAPI"] },
    { name: "HyperTest Quality Automation", track: "Parallel Playwright & Distributed k6", location: "Bangalore & Remote", tags: ["Playwright", "k6", "CI/CD"] },
    { name: "OmniTenant Enterprise SaaS", track: "Multi-Tenant RLS & Cryptographic Ledgers", location: "Remote", tags: ["PostgreSQL RLS", "Prisma", "Next.js"] },
    { name: "SprintSync Product Studio", track: "AI Product Management & Backlog Specs", location: "Indore & Bangalore", tags: ["Technical PRD", "PostHog", "Figma"] },
    { name: "Aegis Healthcare Diagnostics", track: "Medical Imaging & Deep Learning", location: "Delhi NCR", tags: ["PyTorch", "OpenCV", "FastAPI"] },
    { name: "FinMesh Algorithmic Systems", track: "Low-Latency Market Event Telemetry", location: "Mumbai", tags: ["Rust", "Redis", "WebSockets"] },
    { name: "DevFlow Developer Tooling", track: "CLI & MCP Protocol Plugins", location: "Remote", tags: ["TypeScript", "Node.js", "Docker"] },
    { name: "CloudNative Sandbox Network", track: "DevOps Autoscaling & Chaos Testing", location: "Pune & Remote", tags: ["AWS ECS", "Terraform", "Grafana"] },
    { name: "Global AI Freelance & Contracting", track: "High-Ticket Custom AI Engineering", location: "Worldwide Remote", tags: ["Fullstack AI", "Agent Graphs"] }
  ];

  return (
    <div className="bg-[#FAFCFF] min-h-screen text-slate-900 selection:bg-[#0066FF] selection:text-white pt-20 pb-28">

      {/* =========================================================================
          HERO: THE SHIPPERS CIRCLE (3-PROJECT REFERRAL & ENDORSEMENT ENGINE)
      ========================================================================= */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-[#0B1120] via-[#0F172A] to-[#020617] text-white py-16 sm:py-24">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#0066FF]/20 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 text-[#00B8F0] text-xs font-mono font-bold uppercase tracking-wider mb-6 border border-blue-500/30">
            <Rocket size={14} className="text-amber-400" />
            <span>THE ELITE SHIPPERS CIRCLE • CAREER ACCELERATION FLYWHEEL</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.12]">
            Complete 3 Production Projects. <br />
            <span className="bg-gradient-to-r from-[#0066FF] via-[#00B8F0] to-[#38BDF8] bg-clip-text text-transparent">
              Get Fast-Tracked to 15 Hiring Companies.
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
            Ship 3 verifiable production projects (1 Solo + 2 Squad, or any 3). Unlock direct portfolio recommendation to 15 partner tech companies, a 1-on-1 profile audit, and a personal LinkedIn recommendation written by Founder <strong>Soham Sharma</strong>.
          </p>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mb-12 text-left">
            
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-mono text-[#00B8F0] font-bold uppercase mb-2">
                <Building2 size={15} /> 15 Hiring Companies
              </div>
              <div className="font-bold text-white text-sm mb-1">Direct HR-Bypass Referral</div>
              <p className="text-xs text-slate-400">Applications pushed directly to founders &amp; VP of Engineering desks.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase mb-2">
                <Linkedin size={15} /> Founder LinkedIn Rec
              </div>
              <div className="font-bold text-white text-sm mb-1">Written by Soham Sharma</div>
              <p className="text-xs text-slate-400">Personal endorsement on your profile highlighting your architecture proof.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase mb-2">
                <FileText size={15} /> 1-on-1 Profile Surgery
              </div>
              <div className="font-bold text-white text-sm mb-1">Resume &amp; GitHub Teardown</div>
              <p className="text-xs text-slate-400">Comprehensive ATS keyword audit, README restructuring &amp; Loom demo review.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold uppercase mb-2">
                <Award size={15} /> Master Shipper Credential
              </div>
              <div className="font-bold text-white text-sm mb-1">Unlimited Project Stacking</div>
              <p className="text-xs text-slate-400 font-mono">Take on 3, 5, or all 50 projects. Zero limits on your proof of work.</p>
            </div>

          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 font-mono text-xs">
            <a
              href="#portfolio-checker"
              className="px-6 py-3.5 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              <Search size={15} />
              <span>Check My 3-Project Status</span>
            </a>
            <a
              href="#claim-referral"
              className="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold uppercase tracking-wider transition-all border border-slate-700 cursor-pointer flex items-center gap-2"
            >
              <Trophy size={15} className="text-amber-400" />
              <span>Claim 15-Company Referral</span>
            </a>
            <Link
              href="/arena"
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-wider transition-all border border-white/20"
            >
              <span>Explore 50 Projects Matrix</span>
            </Link>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 2: INTERACTIVE PORTFOLIO & MILESTONE CHECKER
      ========================================================================= */}
      <section id="portfolio-checker" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm">
          
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-[#0066FF] font-mono text-xs font-bold uppercase tracking-wider mb-3">
              <Search size={14} /> Real-Time Portfolio &amp; Milestone Engine
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-2">
              Check Your 3-Project Milestone Progress
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Enter your registered builder email address below to inspect all projects you&apos;ve enrolled in, your verified daily standup streak, solo vs. squad split, and whether you&apos;re ready to claim your 15-company referral.
            </p>
          </div>

          <form onSubmit={handleCheckPortfolio} className="flex flex-col sm:flex-row gap-3 max-w-2xl mb-6">
            <input
              type="email"
              placeholder="Enter your registered email (e.g. soham@example.com)..."
              value={checkEmail}
              onChange={(e) => setCheckEmail(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
              required
            />
            <button
              type="submit"
              disabled={isChecking}
              className="px-6 py-3 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 shadow-xs"
            >
              {isChecking ? <Loader2 size={16} className="animate-spin" /> : <><span>Check Portfolio</span> <ArrowRight size={14} /></>}
            </button>
          </form>

          {checkError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono mb-6">
              {checkError}
            </div>
          )}

          {/* Builder Profile Card */}
          {builderData && (
            <div className="mt-8 pt-8 border-t border-slate-200 animate-fadeIn">
              
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-200 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-slate-900">{builderData.name}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0066FF] font-mono text-xs font-bold">
                      {builderData.tier}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-slate-500 mt-1">{builderData.email}</div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="text-right">
                    <div className="font-bold text-slate-900">{builderData.totalDailyLogs} Days</div>
                    <div className="text-slate-500 text-[11px]">Logged Standups</div>
                  </div>
                  <div className="text-right border-l border-slate-200 pl-4">
                    <div className="font-bold text-emerald-600">{builderData.totalProjectsCount} Projects</div>
                    <div className="text-slate-500 text-[11px]">{builderData.soloCount} Solo / {builderData.squadCount} Squad</div>
                  </div>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 mb-6">
                <div className="flex items-center justify-between text-xs font-mono font-bold mb-2">
                  <span className="text-slate-700">15-Company Referral Unlock Status:</span>
                  <span className={builderData.totalProjectsCount >= 3 ? "text-emerald-600" : "text-[#0066FF]"}>
                    {Math.min(builderData.totalProjectsCount, 3)} / 3 Projects Completed
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full transition-all duration-500 ${
                      builderData.totalProjectsCount >= 3 ? "bg-emerald-500" : "bg-[#0066FF]"
                    }`}
                    style={{ width: `${Math.min((builderData.totalProjectsCount / 3) * 100, 100)}%` }}
                  />
                </div>

                {builderData.isEligibleForReferrals ? (
                  <div className="flex items-center justify-between flex-wrap gap-3 pt-2 text-xs font-mono text-emerald-700">
                    <div className="flex items-center gap-1.5 font-bold">
                      <CheckCircle2 size={16} className="text-emerald-600" />
                      <span>🎉 CONGRATULATIONS! You have completed 3 projects and unlocked the 15-Company Referral Pipeline!</span>
                    </div>
                    <a
                      href="#claim-referral"
                      className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold uppercase tracking-wider hover:bg-emerald-700"
                    >
                      Claim Referral Now ↗
                    </a>
                  </div>
                ) : (
                  <div className="text-xs font-mono text-slate-500">
                    💡 Complete <strong>{3 - builderData.totalProjectsCount} more project{3 - builderData.totalProjectsCount === 1 ? "" : "s"}</strong> in the Arena to automatically unlock direct 15-company referrals and Founder Soham Sharma&apos;s LinkedIn endorsement!
                  </div>
                )}
              </div>

              {/* Enrolled Projects List */}
              <div className="space-y-3">
                <div className="text-xs font-mono text-slate-500 uppercase font-bold">Enrolled Projects in Portfolio:</div>
                {builderData.completedProjects.map((p: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-[#0066FF] font-bold flex items-center justify-center text-[11px]">
                        #{idx + 1}
                      </span>
                      <div>
                        <div className="font-bold text-slate-900">{p.project.title}</div>
                        <div className="text-[11px] text-slate-500">Role: {p.role} • Mode: {p.teamType} • {p.logsCount} PoW Logs</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-bold">
                      ✓ Active in Portfolio
                    </span>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>
      </section>

      {/* =========================================================================
          SECTION 3: 15 PARTNER HIRING COMPANIES & SECTORS MATRIX
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-[#0066FF] font-mono text-xs font-bold uppercase tracking-wider mb-3">
            <Building2 size={14} /> Verified Hiring Network
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">
            15 Direct Company Referral Tracks
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            When you complete 3 projects, your profile, GitHub commit proof, and architecture dossiers are dispatched directly to engineering leads across these 15 tech sectors and partner organizations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {HIRING_COMPANIES_SECTORS.map((c, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold text-[#0066FF]">Track #{idx + 1}</span>
                  <span className="text-[10px] font-mono text-slate-500">{c.location}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1">{c.name}</h3>
                <p className="text-xs text-slate-600 mb-4">{c.track}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {c.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-mono font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-emerald-700 font-bold">
                <span>● Direct Fast-Track Hiring</span>
                <span>Tier 3 Shipper</span>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* =========================================================================
          SECTION 4: FOUNDER LINKEDIN RECOMMENDATION GUARANTEE
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-8 sm:p-12 border border-blue-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-[#00B8F0] font-mono text-xs font-bold uppercase tracking-wider mb-4 border border-blue-500/30">
              <Linkedin size={14} /> Founder Endorsement Guarantee
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-4 leading-snug">
              Personal LinkedIn Recommendation <br />
              Written by Soham Sharma
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
              &quot;I personally review every single PR, architecture blueprint, and load testing benchmark from builders who complete 3 production projects. I don&apos;t write generic corporate fluff. I write concrete, technical recommendations on your LinkedIn profile breaking down your deterministic state machines, vector retrieval latency, and execution rigor.&quot;
            </p>

            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 text-xs font-mono text-slate-200 mb-6 max-w-2xl leading-relaxed">
              <div className="text-[#00B8F0] font-bold mb-1">Sample Recommendation Preview:</div>
              &quot;I had the privilege of observing [Builder Name] ship 3 production-grade systems in the Botmartz Builder Arena—including a 4-node LangGraph deterministic agent and a high-throughput Celery/Redis cluster handling 10,000 tasks/min. [Builder Name] demonstrated impeccable architectural purity with zero vibe-coding. Any engineering team looking for a hardcore builder should hire them immediately.&quot;
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold font-mono">
                SS
              </div>
              <div>
                <div className="font-bold text-white text-sm">Soham Sharma</div>
                <div className="text-xs text-slate-400 font-mono">Founder &amp; AI Architect, Botmartz AI Solutions</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: CLAIM 15-COMPANY REFERRAL & PROFILE SURGERY FORM
      ========================================================================= */}
      <section id="claim-referral" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm">
          
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200">
              <Trophy size={14} /> Claim Form
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              Claim 15-Company Referral &amp; Founder Recommendation
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Submit your 3 project links below. Once verified, our team will schedule your 1-on-1 profile audit, dispatch your dossier to our 15 hiring partners, and publish your founder LinkedIn endorsement.
            </p>
          </div>

          {claimSuccess ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Milestone Application Received!</h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed font-mono">
                Your 3-project portfolio has been queued for founder review. We will contact you on WhatsApp (+91 {claimForm.whatsapp}) to schedule your 1-on-1 profile teardown and coordinate the 15-company dispatch!
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <Link
                  href="/arena"
                  className="px-6 py-3 rounded-xl bg-[#0066FF] text-white text-xs font-mono font-bold uppercase tracking-wider"
                >
                  Back to Arena
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleClaimSubmit} className="space-y-4">
              
              {claimError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono">
                  {claimError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-700 font-bold mb-1">Full Name *</label>
                  <input
                    type="text"
                    placeholder="Soham Sharma"
                    value={claimForm.name}
                    onChange={(e) => setClaimForm({ ...claimForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-700 font-bold mb-1">Registered Email *</label>
                  <input
                    type="email"
                    placeholder="soham@example.com"
                    value={claimForm.email}
                    onChange={(e) => setClaimForm({ ...claimForm, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-700 font-bold mb-1">WhatsApp Number *</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={claimForm.whatsapp}
                    onChange={(e) => setClaimForm({ ...claimForm, whatsapp: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-700 font-bold mb-1">LinkedIn Profile URL *</label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/soham"
                    value={claimForm.linkedin}
                    onChange={(e) => setClaimForm({ ...claimForm, linkedin: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-700 font-bold mb-1">GitHub Profile or Org URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/soham2710"
                    value={claimForm.github}
                    onChange={(e) => setClaimForm({ ...claimForm, github: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-700 font-bold mb-1">Live Portfolio / Resume Link</label>
                  <input
                    type="url"
                    placeholder="https://soham.dev or Google Drive PDF URL"
                    value={claimForm.portfolioUrl}
                    onChange={(e) => setClaimForm({ ...claimForm, portfolioUrl: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>

              {/* 3 Project Summaries */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-mono font-bold text-slate-800 uppercase">
                  Summarize Your 3 Shipped Projects (Titles &amp; GitHub/Live URLs):
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-600 mb-1 font-semibold">
                    Project #1 (Solo or Squad) *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Deterministic Agent Engine (Solo) — Live: https://agent.app, GitHub: github.com/..."
                    value={claimForm.project1Summary}
                    onChange={(e) => setClaimForm({ ...claimForm, project1Summary: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-600 mb-1 font-semibold">
                    Project #2 (Squad or Solo) *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. High-Throughput Hybrid RAG (Squad) — Live: https://rag.app, GitHub: github.com/..."
                    value={claimForm.project2Summary}
                    onChange={(e) => setClaimForm({ ...claimForm, project2Summary: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-600 mb-1 font-semibold">
                    Project #3 (Squad or Solo) *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Distributed Task Orchestrator (Squad) — Live: https://task.app, GitHub: github.com/..."
                    value={claimForm.project3Summary}
                    onChange={(e) => setClaimForm({ ...claimForm, project3Summary: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-700 font-bold mb-1">
                  Notes for Founder Soham Sharma (Special skills, architecture focus, target companies):
                </label>
                <textarea
                  rows={3}
                  placeholder="I specialize in low-latency FastAPI services and Qdrant vector retrieval. Aiming for AI Engineer roles at fast-growing generative AI scaleups..."
                  value={claimForm.notesForFounder}
                  onChange={(e) => setClaimForm({ ...claimForm, notesForFounder: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <button
                type="submit"
                disabled={isClaiming}
                className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 mt-4"
              >
                {isClaiming ? <Loader2 size={16} className="animate-spin" /> : <><span>Submit for 15-Company Referral &amp; Founder Recommendation</span> <ArrowRight size={15} /></>}
              </button>

            </form>
          )}

        </div>
      </section>

    </div>
  );
}
