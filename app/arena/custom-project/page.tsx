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
  ShieldCheck
} from "lucide-react";

export default function CustomProjectProposalPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [college, setCollege] = useState("");
  const [github, setGithub] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [domain, setDomain] = useState("AI & Distributed Systems");
  const [techStack, setTechStack] = useState("");
  const [prdMarkdown, setPrdMarkdown] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const [dpdpConsent, setDpdpConsent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

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
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <Link
            href="/arena"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-600 hover:text-[#0066FF] mb-3 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Arena
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0066FF] font-mono text-xs font-bold uppercase tracking-wider mb-2 border border-blue-200">
            <Sparkles size={14} /> Custom Track
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Submit Your Own Custom Engineering Proposal
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm font-mono mt-1">
            Build your own frontier project for the 45-day cohort (14th Sept - Diwali). Reviewed and approved directly by Founder Soham Sharma.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-8">
        
        {/* Antigravity Research Agent Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3 text-blue-900">
            <Bot size={20} className="text-[#0066FF] shrink-0" />
            <div>
              <span className="font-bold">Need assistance drafting your PRD?</span>
              <p className="text-blue-700 text-[11px]">Use our Antigravity Research Agent blueprint to automate architecture research.</p>
            </div>
          </div>
          <Link
            href="/arena/antigravity-guide"
            className="px-3 py-1.5 rounded-xl bg-white border border-blue-300 text-[#0066FF] font-bold shrink-0 hover:bg-blue-100 transition-colors"
          >
            Agent Guide →
          </Link>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          
          {successMsg ? (
            <div className="text-center py-10 space-y-4">
              <CheckCircle2 size={48} className="text-emerald-600 mx-auto" />
              <h2 className="text-2xl font-bold text-slate-900">Proposal Submitted!</h2>
              <p className="text-xs font-mono text-slate-600 max-w-md mx-auto leading-relaxed">
                {successMsg} You can track the approval status on your profile or on Saturday office hours.
              </p>
              <div className="pt-4 flex items-center justify-center gap-3">
                <Link
                  href="/arena"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-mono text-xs font-bold"
                >
                  Return to Arena
                </Link>
                <Link
                  href="/arena/progress"
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-800 font-mono text-xs font-bold border border-slate-200"
                >
                  View Standup Stream
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 font-mono text-xs">
              
              {/* Student Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Your Full Name:</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Yash Sharma"
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
                    placeholder="e.g. yash@college.edu"
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
                    placeholder="e.g. SGSITS Indore / IIT Indore"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">GitHub Username:</label>
                  <input
                    type="text"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="e.g. yashsharma"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>

              {/* Project Details */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Project Title:</label>
                <input
                  type="text"
                  required
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. Autonomous Quantum Circuit Simulator with Rust & WebAssembly"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Primary Domain:</label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  >
                    <option value="AI & Distributed Systems">AI &amp; Distributed Systems</option>
                    <option value="Geospatial & Defence Tech">Geospatial &amp; Defence Tech</option>
                    <option value="Biomedical & Healthcare AI">Biomedical &amp; Healthcare AI</option>
                    <option value="High-Frequency Systems & Rust">High-Frequency Systems &amp; Rust</option>
                    <option value="Cybersecurity & Zero-Trust">Cybersecurity &amp; Zero-Trust</option>
                    <option value="Modern Web & Mobile">Modern Web &amp; Mobile</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Tech Stack (comma-separated):</label>
                  <input
                    type="text"
                    value={techStack}
                    onChange={(e) => setTechStack(e.target.value)}
                    placeholder="e.g. Rust, WebAssembly, Next.js, Redis"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>

              {/* PRD Markdown */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Technical PRD &amp; Architecture Outline (Markdown):
                </label>
                <textarea
                  rows={8}
                  required
                  value={prdMarkdown}
                  onChange={(e) => setPrdMarkdown(e.target.value)}
                  placeholder={`## 1. Problem Statement\nWhat real-world engineering challenge does this solve?\n\n## 2. Technical Architecture\nWhat databases, streaming layers, or models are used?\n\n## 3. 45-Day Milestones\n- Phase 1 (Days 1-15):\n- Phase 2 (Days 16-30):\n- Phase 3 (Days 31-45):`}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              {/* GitHub Repo */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">GitHub Repo URL (if already created):</label>
                <input
                  type="url"
                  value={githubRepo}
                  onChange={(e) => setGithubRepo(e.target.value)}
                  placeholder="https://github.com/username/project"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              {/* DPDP Consent */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={dpdpConsent}
                    onChange={(e) => setDpdpConsent(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-[#0066FF]"
                  />
                  <span className="text-[11px] text-slate-600 leading-snug">
                    I grant explicit consent under the <strong>DPDP Act 2023</strong> for Botmartz to process my engineering proposal, technical artifacts, and student contact details strictly for cohort evaluation and founder review.
                  </span>
                </label>
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-xs cursor-pointer"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <Send size={15} />
                    <span>Submit Proposal to Founder Soham Sharma</span>
                  </>
                )}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
