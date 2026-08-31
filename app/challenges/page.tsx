"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Trophy, 
  Flame, 
  Clock, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Award,
  Shield,
  Zap,
  Terminal,
  Github,
  Globe,
  Video,
  Send,
  X,
  Loader2,
  Check,
  AlertCircle,
  MessageCircle
} from "lucide-react";
import AuthGate from "@/app/_components/AuthGate";

interface Challenge {
  id: string;
  title: string;
  badge: string;
  status: "active" | "upcoming" | "ended";
  prizePool: string;
  deadline: string;
  participants: number;
  description: string;
  objectives: string[];
  tags: string[];
}

const CHALLENGES: Challenge[] = [
  {
    id: "hack-01",
    title: "The 48-Hour Multi-Agent Frontier Hackathon",
    badge: "Flagship Hackathon",
    status: "active",
    prizePool: "₹1,00,000 + Cloud Credits",
    deadline: "5 Days Remaining",
    participants: 142,
    description: "Build an autonomous, deterministic multi-agent workflow using LangGraph, CrewAI, or AutoGen that solves a real enterprise workflow (e.g. KYC verification, legal drafting, or automated PR review).",
    objectives: [
      "Must include state checkpointing and recovery",
      "Must have at least 1 Human-in-the-Loop approval gate",
      "Must include automated evaluation benchmark (e.g. RAGAS or custom assertions)",
      "Public GitHub repo with video demo"
    ],
    tags: ["MultiAgent", "LangGraph", "Hackathon"]
  },
  {
    id: "chal-02",
    title: "Weekly Arena: Zero-Hallucination PDF Table Extractor",
    badge: "Weekly Mini-Battle",
    status: "active",
    prizePool: "₹15,000 + AI Frontier VIP Pass",
    deadline: "48 Hours Left",
    participants: 68,
    description: "Extract complex nested tables from multi-column financial balance sheets without hallucinating rows or columns. Evaluated automatically against ground truth test sets.",
    objectives: [
      "Zero dropped rows or hallucinated numerical values",
      "Preserve multi-level headers and merged cells",
      "Execution time under 800ms per PDF page"
    ],
    tags: ["PDFParsing", "VisionLLMs", "RAG"]
  },
  {
    id: "hack-02",
    title: "Local-First AI Hackathon: On-Device Small Models (SLMs)",
    badge: "Upcoming Cohort",
    status: "upcoming",
    prizePool: "₹50,000",
    deadline: "Starts September 20, 2026",
    participants: 95,
    description: "Build ultra-low-latency applications running locally using quantized models (Llama 3.2, Gemma 2, Phi-3.5) with WebGPU and Ollama.",
    objectives: [
      "Must run 100% offline with zero cloud API keys",
      "Quantization optimization with ONNX or GGUF",
      "Smooth client-side user experience"
    ],
    tags: ["LocalAI", "Ollama", "WebGPU"]
  }
];

export default function ChallengesPage() {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [formMode, setFormMode] = useState<"register" | "submit">("register");

  // Form State
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [discordHandle, setDiscordHandle] = useState("");
  const [githubHandle, setGithubHandle] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teamSize, setTeamSize] = useState("1");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectPitch, setProjectPitch] = useState("");
  const [techStackInput, setTechStackInput] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [agreedToRules, setAgreedToRules] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<any>(null);
  const [error, setError] = useState("");

  const handleOpenModal = (challenge: Challenge, mode: "register" | "submit") => {
    setSelectedChallenge(challenge);
    setFormMode(mode);
    setError("");
    setSubmittedSuccess(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChallenge) return;

    setSubmitting(true);
    setError("");

    try {
      const techStackArray = techStackInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        challengeId: selectedChallenge.id,
        challengeTitle: selectedChallenge.title,
        type: formMode,
        teamName: teamName || `${leadName}'s Team`,
        teamSize,
        leadName,
        leadEmail,
        leadPhone,
        discordHandle,
        githubHandle,
        projectTitle,
        projectPitch,
        techStack: techStackArray,
        githubUrl,
        demoUrl,
        videoUrl,
        agreedToRules,
      };

      const res = await fetch("/api/challenges/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Submission failed. Please check details.");
      }

      setSubmittedSuccess(data);
    } catch (err: any) {
      setError(err.message || "An error occurred while submitting.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthGate
      featureTitle="Community Hackathons & Arena Challenges"
      featureDescription="Sign in to register your team, submit GitHub repositories, and compete for cash prizes and cloud compute credits."
    >
      <div className="bg-[#FAFCFF] min-h-screen text-slate-900 py-12 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-mono text-xs font-semibold mb-4">
            <Trophy size={14} /> COMMUNITY HACKATHONS &amp; ARENA
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Build, Compete &amp; Win Real Cash &amp; Credits
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Test your applied AI engineering skills in 48-hour sprints and weekly prompt battles. Complete your team registration or submit your project repo for live review.
          </p>

          <div className="flex items-center justify-center gap-3 mt-6">
            <a
              href="https://discord.gg/k75ZpEnzp"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-mono text-xs font-bold border border-indigo-200 transition-colors inline-flex items-center gap-1.5"
            >
              <span>#hackathon-lounge Discord</span>
            </a>
            <a
              href="https://chat.whatsapp.com/DkzKwpjuktaCYAofOtMlAQ"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-mono text-xs font-bold border border-emerald-200 transition-colors inline-flex items-center gap-1.5"
            >
              <MessageCircle size={14} />
              <span>WhatsApp Alerts</span>
            </a>
          </div>
        </div>

        {/* Challenge Cards */}
        <div className="space-y-8 max-w-5xl mx-auto">
          {CHALLENGES.map(c => (
            <div
              key={c.id}
              className={`rounded-3xl p-8 shadow-xs transition-all border ${
                c.status === "active"
                  ? "bg-white border-amber-300 shadow-md"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-[#0066FF] border border-blue-100 font-mono text-xs font-bold uppercase">
                    {c.badge}
                  </span>
                  {c.status === "active" ? (
                    <span className="flex items-center gap-1.5 text-emerald-600 font-mono text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      LIVE NOW
                    </span>
                  ) : (
                    <span className="text-slate-400 font-mono text-xs">Upcoming</span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-slate-600">
                  <div className="flex items-center gap-1.5 text-amber-600 font-bold">
                    <Trophy size={14} />
                    <span>{c.prizePool}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Clock size={14} />
                    <span>{c.deadline}</span>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-3">{c.title}</h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">{c.description}</p>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-8">
                <div className="text-xs font-mono text-slate-700 uppercase font-bold mb-3">
                  Evaluation &amp; Submission Criteria:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {c.objectives.map((obj, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 size={14} className="text-[#0066FF] shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                  <Users size={14} className="text-[#0066FF]" />
                  <span>{c.participants} Registered Builders</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleOpenModal(c, "submit")}
                    className="bg-white border border-slate-300 hover:border-[#0066FF] text-slate-800 hover:text-[#0066FF] px-5 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Submit Project Repo</span>
                    <Send size={13} />
                  </button>

                  <button
                    onClick={() => handleOpenModal(c, "register")}
                    className="bg-[#0066FF] hover:bg-[#0052CC] text-white px-6 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Register Team Now</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* ── Interactive Registration & Submission Modal ── */}
      {selectedChallenge && (
        <div 
          onClick={() => setSelectedChallenge(null)}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 mb-6">
              <div>
                <span className="px-2.5 py-0.5 rounded bg-blue-50 text-[#0066FF] font-mono text-[10px] font-bold uppercase">
                  {selectedChallenge.badge}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1.5 leading-snug">
                  {selectedChallenge.title}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedChallenge(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Success State */}
            {submittedSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check size={32} />
                </div>
                <h4 className="text-2xl font-bold text-slate-900">Registration Confirmed!</h4>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Your entry has been received and saved to our engineering ledger. Submission ID: <strong className="font-mono text-[#0066FF]">{submittedSuccess.id}</strong>.
                </p>
                
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 text-left space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Team:</span>
                    <span className="font-bold font-mono text-slate-900">{teamName || leadName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Lead Email:</span>
                    <span className="font-mono text-slate-900">{leadEmail}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Track:</span>
                    <span className="font-mono text-emerald-600 font-bold">{selectedChallenge.badge}</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href="https://discord.gg/k75ZpEnzp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold"
                  >
                    Join #hackathon-arena on Discord →
                  </a>
                  <button
                    onClick={() => setSelectedChallenge(null)}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-xs font-bold"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleFormSubmit} className="space-y-5">
                {/* Mode Selector Tabs */}
                <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setFormMode("register")}
                    className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      formMode === "register" ? "bg-white text-[#0066FF] shadow-xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    1. Team Registration
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormMode("submit")}
                    className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      formMode === "submit" ? "bg-white text-[#0066FF] shadow-xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    2. Project Code &amp; Demo Submission
                  </button>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono flex items-center gap-2">
                    <AlertCircle size={15} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Team & Lead Contact Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-700 font-bold mb-1">
                      Lead Builder Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Soham Sharma"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-700 font-bold mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="soham@botmartz.com"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-700 font-bold mb-1">
                      WhatsApp Phone Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-700 font-bold mb-1">
                      Discord Handle / Tag
                    </label>
                    <input
                      type="text"
                      placeholder="soham_ai#0001"
                      value={discordHandle}
                      onChange={(e) => setDiscordHandle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-700 font-bold mb-1">
                      Team Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Agentic Frontier"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-700 font-bold mb-1">
                      Team Size
                    </label>
                    <select
                      value={teamSize}
                      onChange={(e) => setTeamSize(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                    >
                      <option value="1">Solo Builder (1 Person)</option>
                      <option value="2">Duo (2 Builders)</option>
                      <option value="3">Trio (3 Builders)</option>
                      <option value="4">Squad (4 Builders)</option>
                    </select>
                  </div>
                </div>

                {/* Project Submission Fields */}
                {formMode === "submit" && (
                  <div className="pt-3 border-t border-slate-100 space-y-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-700 font-bold mb-1">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. AutoRAG: Multi-Agent Hallucination Auditor"
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        required={formMode === "submit"}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-700 font-bold mb-1">
                        Public GitHub Repository URL *
                      </label>
                      <input
                        type="url"
                        placeholder="https://github.com/your-username/your-repo"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        required={formMode === "submit"}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-700 font-bold mb-1">
                          Live Demo / Hosted URL
                        </label>
                        <input
                          type="url"
                          placeholder="https://demo.vercel.app"
                          value={demoUrl}
                          onChange={(e) => setDemoUrl(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-700 font-bold mb-1">
                          Video Walkthrough / Loom URL
                        </label>
                        <input
                          type="url"
                          placeholder="https://loom.com/share/..."
                          value={videoUrl}
                          onChange={(e) => setVideoUrl(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-700 font-bold mb-1">
                        Tech Stack (Comma-separated)
                      </label>
                      <input
                        type="text"
                        placeholder="LangGraph, Ollama, Qdrant, Next.js, FastEmbed"
                        value={techStackInput}
                        onChange={(e) => setTechStackInput(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-700 font-bold mb-1">
                        Architecture &amp; System Overview
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Briefly explain your state checkpointing, evaluation methodology, and edge cases handled..."
                        value={projectPitch}
                        onChange={(e) => setProjectPitch(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                      />
                    </div>
                  </div>
                )}

                {/* Terms Agreement */}
                <div className="flex items-start gap-2.5 pt-2">
                  <input
                    type="checkbox"
                    id="rulesCheck"
                    checked={agreedToRules}
                    onChange={(e) => setAgreedToRules(e.target.checked)}
                    required
                    className="mt-1 rounded text-[#0066FF] focus:ring-[#0066FF]"
                  />
                  <label htmlFor="rulesCheck" className="text-xs text-slate-600">
                    I confirm that this submission complies with Botmartz open evaluation rules, includes genuine code, and is ready for live architectural review.
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {submitting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        <span>{formMode === "submit" ? "Submit Project for Evaluation" : "Confirm Team Registration"}</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      </div>
    </AuthGate>
  );
}
