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
  Terminal
} from "lucide-react";

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
  return (
    <div className="bg-[#050B14] min-h-screen text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-semibold mb-4">
            <Trophy size={14} /> COMMUNITY HACKATHONS &amp; ARENA
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            Build, Compete &amp; Win Real Cash &amp; Credits
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Test your AI engineering skills in 48-hour sprints and weekly prompt challenges. Get reviewed by top AI architects and win cash prizes.
          </p>
        </div>

        {/* Challenge Cards */}
        <div className="space-y-8 max-w-5xl mx-auto">
          {CHALLENGES.map(c => (
            <div
              key={c.id}
              className={`rounded-3xl p-8 shadow-2xl transition-all border ${
                c.status === "active"
                  ? "bg-[#0B1524] border-[#00B8F0]/40 shadow-[0_0_30px_rgba(0,184,240,0.15)]"
                  : "bg-[#091222] border-white/10"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-[#0066FF]/20 text-[#60A5FA] font-mono text-xs font-bold uppercase">
                    {c.badge}
                  </span>
                  {c.status === "active" ? (
                    <span className="flex items-center gap-1 text-emerald-400 font-mono text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      LIVE NOW
                    </span>
                  ) : (
                    <span className="text-slate-500 font-mono text-xs">Upcoming</span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <Trophy size={14} />
                    <span>{c.prizePool}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock size={14} />
                    <span>{c.deadline}</span>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white mb-3">{c.title}</h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">{c.description}</p>

              <div className="bg-[#050B14] border border-white/5 rounded-2xl p-5 mb-8">
                <div className="text-xs font-mono text-slate-400 uppercase font-bold mb-3">
                  Evaluation &amp; Submission Criteria:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {c.objectives.map((obj, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 size={14} className="text-[#00B8F0] shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <Users size={14} className="text-[#00B8F0]" />
                  <span>{c.participants} Registered Builders</span>
                </div>

                <button
                  onClick={() => alert(`Registered for ${c.title}! We will send submission templates to your email.`)}
                  className="bg-[#0066FF] hover:bg-[#0052CC] text-white px-7 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Enter Challenge Now</span>
                  <ArrowRight size={14} />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
