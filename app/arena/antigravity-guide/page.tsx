"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bot,
  Terminal,
  Code2,
  Sparkles,
  Layers,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Cpu,
  Github,
  GraduationCap,
  Send,
  Loader2,
  ShieldCheck,
  Server,
  Cloud,
  Database
} from "lucide-react";

export default function SystemDesignCurriculumPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    college: "",
    track: "AWS Cloud & Architecture",
    experienceLevel: "Intermediate",
    needs: ""
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Record telemetry
      await fetch("/api/arena/telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "SPECIAL_TRAINING_REQUESTED",
          metadata: form
        })
      });
      setSubmitted(true);
    } catch (e) {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const CURRICULUM_MODULES = [
    {
      num: 1,
      title: "Database Internals & Low-Latency Query Execution",
      icon: Database,
      desc: "Master PostgreSQL index types (B-Tree, BRIN, GIN for full-text), connection pool tuning with asyncpg, and query optimization for sub-10ms p95 latencies.",
      keyTopics: ["B-Tree vs BRIN Indexing", "Connection Pool Starvation", "ACID Isolation Levels", "p95 Profiling"]
    },
    {
      num: 2,
      title: "Async State Machines & Idempotent Agent Workflows",
      icon: Cpu,
      desc: "Deterministic LangGraph execution. Prevent corrupt states during network timeouts on external LLM tool calls using PostgreSQL checkpointers and idempotency keys.",
      keyTopics: ["Transactional Outbox Pattern", "Idempotency Keys", "LangGraph State Recovery", "Backoff Retry Algorithms"]
    },
    {
      num: 3,
      title: "Automated CI/CD Quality Gates & Load Testing",
      icon: ShieldCheck,
      desc: "Set up zero-tolerance testing gates using Playwright for end-to-end browser flows and k6 for 2,000 req/sec load stress tests before cloud deployment.",
      keyTopics: ["Playwright Trace Viewer", "k6 Stress Scripts", "Flaky Test Elimination", "GitHub Actions CI Gate"]
    },
    {
      num: 4,
      title: "AWS Cloud Architecture & Production Container Deployments",
      icon: Cloud,
      desc: "Containerize multi-stage Docker builds, deploy on AWS ECS / App Runner, set up VPC security groups, and monitor latency with CloudWatch alarms.",
      keyTopics: ["Multi-Stage Dockerfile", "AWS ECS / VPC", "CloudWatch Metrics", "Zero-Trust Secrets"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFCFF] text-slate-900 pb-24 font-sans selection:bg-[#0066FF] selection:text-white">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-[#0066FF] font-mono text-xs font-bold uppercase tracking-wider mb-3 border border-blue-200">
            <GraduationCap size={14} /> Core Engineering Foundations
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            System Design &amp; AI Core Curriculum
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm font-mono mt-2 leading-relaxed max-w-3xl">
            Real engineering happens under the hood. Master core system design, database internals, and asynchronous state machines to build resilient systems instead of brittle vibe coding.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
        {/* Anti-Vibe Coding Manifesto */}
        <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-indigo-800/80 shadow-lg">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-[11px] font-bold uppercase tracking-wider mb-2 border border-indigo-500/30">
              <span>ENGINEERING MANIFESTO</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 font-sans">
              Beyond Vibe Coding: Why Core Concepts Matter
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              Generating code with LLMs without understanding database deadlocks, connection pool limits, and state recovery guarantees produces systems that crash at scale. In the Botmartz Builders Cohort, every student learns the deterministic architectural primitives behind their software.
            </p>
          </div>
        </section>

        {/* 4 Core Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CURRICULUM_MODULES.map((mod) => {
            const IconComp = mod.icon;
            return (
              <div
                key={mod.num}
                className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="w-8 h-8 rounded-xl bg-blue-50 text-[#0066FF] font-mono text-xs font-bold flex items-center justify-center">
                      0{mod.num}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Mandatory Prerequisite</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mb-2 font-sans">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-mono leading-relaxed mb-4">
                    {mod.desc}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100 font-mono text-[10px]">
                  {mod.keyTopics.map((k) => (
                    <span key={k} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* =========================================================================
            SPECIAL TRAINING & AWS / AI MENTORSHIP REQUEST FORM
        ========================================================================= */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs">
          <div className="max-w-2xl mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 font-mono text-xs font-bold uppercase tracking-wider mb-2">
              <BookOpen size={13} /> Deep Dive Mentorship
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-sans">
              Request Personal Training in AI &amp; AWS Cloud
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm font-mono mt-1 leading-relaxed">
              Need personalized training to master cloud infrastructure, Rust kernels, or agentic swarms? Submit this request to schedule training with Botmartz engineers.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 text-center bg-emerald-50 border border-emerald-200 rounded-2xl font-mono text-xs text-emerald-900">
              <CheckCircle2 size={32} className="text-emerald-600 mx-auto mb-2" />
              <div className="font-bold text-sm mb-1">Special Training Request Received!</div>
              <p className="text-slate-600">Our engineering leads will review your learning goals and reach out over email/Discord with customized session slots.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase text-[10px]">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase text-[10px]">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="student@college.edu"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase text-[10px]">College / Organization *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SGSITS Indore / IET DAVV"
                    value={form.college}
                    onChange={(e) => setForm({ ...form, college: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase text-[10px]">Training Focus *</label>
                  <select
                    value={form.track}
                    onChange={(e) => setForm({ ...form, track: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  >
                    <option value="AWS Cloud & Architecture">AWS Cloud &amp; Production Deployments</option>
                    <option value="Agentic AI & LangGraph">Agentic AI, LangGraph &amp; Multi-Agent Swarms</option>
                    <option value="PostgreSQL & High-Scale Systems">PostgreSQL Optimization &amp; Latency Tuning</option>
                    <option value="Rust Low-Latency Systems">Rust Systems Programming &amp; Kernels</option>
                    <option value="System Design 101">System Design Fundamentals (Beginner)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1 uppercase text-[10px]">What Specific Concepts Do You Want to Learn? *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe what concepts you want personal guidance on (e.g. Docker containerization, Vector DB indexing, async workers)..."
                  value={form.needs}
                  onChange={(e) => setForm({ ...form, needs: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <span>Submit Mentorship Request</span>}
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
}
