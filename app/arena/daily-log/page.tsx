"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Terminal,
  CheckCircle2,
  Calendar,
  Flame,
  Github,
  Linkedin,
  MessageSquare,
  HardDrive,
  Loader2,
  ExternalLink,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Clock
} from "lucide-react";
import { ARENA_PROJECTS } from "@/lib/arena-projects";

export default function DailyPoWLogPage() {
  const [form, setForm] = useState({
    studentEmail: "",
    studentName: "",
    projectId: "p1",
    dayNumber: "1",
    commitUrl: "",
    researchNotes: "",
    linkedinPostUrl: "",
    discordMessageUrl: "",
    driveFolderUrl: "https://drive.google.com/drive/folders/1KExMwvCxqd1rn9tgcbIFxAK0vw900CfH",
    blockers: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [userLogs, setUserLogs] = useState<any[]>([]);

  const fetchRecentLogs = async (email: string) => {
    if (!email) return;
    try {
      const res = await fetch(`/api/arena/daily-log?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.logs)) {
        setUserLogs(data.logs);
      }
    } catch (e) {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const selectedProj = ARENA_PROJECTS.find(p => p.id === form.projectId);

    try {
      const res = await fetch("/api/arena/daily-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          projectTitle: selectedProj?.title || "Arena Project",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to record daily log.");
      }

      setSuccess(true);
      fetchRecentLogs(form.studentEmail);
    } catch (err: any) {
      setError(err.message || "Failed to submit Proof of Work.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAFCFF] min-h-screen text-slate-900 selection:bg-[#0066FF] selection:text-white pt-24 pb-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200">
            <Terminal size={14} /> Daily Proof-of-Work (PoW) Logger
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">
            Submit Daily Standup &amp; Build Log
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Every day in the 30-Day Arena requires proof of work. Log your GitHub commits, research architecture notes, and public updates on LinkedIn and Discord to maintain your streak.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm mb-12">
          
          {success ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Day {form.dayNumber} PoW Verified!</h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed font-mono">
                Your streak has been updated! Keep shipping tomorrow. Top logs are reviewed weekly on the Sunday Discord Stage.
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => {
                    setSuccess(false);
                    setForm({
                      ...form,
                      dayNumber: String(Math.min(Number(form.dayNumber) + 1, 30)),
                      commitUrl: "",
                      researchNotes: "",
                      linkedinPostUrl: "",
                      discordMessageUrl: "",
                      blockers: "",
                    });
                  }}
                  className="px-6 py-3 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all"
                >
                  Log Next Day
                </button>
                <Link
                  href="/arena"
                  className="px-5 py-3 rounded-xl bg-slate-100 text-slate-700 text-xs font-mono font-bold"
                >
                  Back to Arena
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {error && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono">
                  {error}
                </div>
              )}

              {/* Student Details & Project */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-700 font-bold mb-1.5">Registered Email *</label>
                  <input
                    type="email"
                    placeholder="soham@example.com"
                    value={form.studentEmail}
                    onChange={(e) => {
                      setForm({ ...form, studentEmail: e.target.value });
                      fetchRecentLogs(e.target.value);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-700 font-bold mb-1.5">Your Full Name</label>
                  <input
                    type="text"
                    placeholder="Soham Sharma"
                    value={form.studentName}
                    onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-700 font-bold mb-1.5">Day Number (1 - 30) *</label>
                  <select
                    value={form.dayNumber}
                    onChange={(e) => setForm({ ...form, dayNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  >
                    {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
                      <option key={d} value={d}>Day {d} / 30</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Project Selection */}
              <div>
                <label className="block text-xs font-mono text-slate-700 font-bold mb-1.5">Enrolled Arena Project *</label>
                <select
                  value={form.projectId}
                  onChange={(e) => setForm({ ...form, projectId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                >
                  {ARENA_PROJECTS.map((p) => (
                    <option key={p.id} value={p.id}>{p.title} ({p.difficulty})</option>
                  ))}
                </select>
              </div>

              {/* GitHub Commit Link */}
              <div>
                <label className="block text-xs font-mono text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
                  <Github size={14} className="text-slate-900" />
                  <span>GitHub Commit or Pull Request URL *</span>
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/soham2710/agent-engine/commit/a1b2c3d"
                  value={form.commitUrl}
                  onChange={(e) => setForm({ ...form, commitUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  required
                />
              </div>

              {/* Research Notes */}
              <div>
                <label className="block text-xs font-mono text-slate-700 font-bold mb-1.5">
                  What did you build, debug, or research today? (Architecture Notes):
                </label>
                <textarea
                  rows={4}
                  placeholder="Implemented PostgreSQL state checkpointing for LangGraph node cycles. Fixed race condition in Redis stream subscriber. Tested sub-600ms latency..."
                  value={form.researchNotes}
                  onChange={(e) => setForm({ ...form, researchNotes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  required
                />
              </div>

              {/* Social Proof URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
                    <Linkedin size={14} className="text-[#0A66C2]" />
                    <span>Public LinkedIn Post URL</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/posts/soham_day1-build..."
                    value={form.linkedinPostUrl}
                    onChange={(e) => setForm({ ...form, linkedinPostUrl: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
                    <MessageSquare size={14} className="text-[#5865F2]" />
                    <span>Discord #project-showcase Link</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://discord.com/channels/..."
                    value={form.discordMessageUrl}
                    onChange={(e) => setForm({ ...form, discordMessageUrl: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>

              {/* Blockers & Questions */}
              <div>
                <label className="block text-xs font-mono text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
                  <HelpCircle size={14} className="text-amber-500" />
                  <span>Blockers or Questions for Weekend Stage Doubt Session:</span>
                </label>
                <input
                  type="text"
                  placeholder="Need assistance optimizing Qdrant HNSW indexing memory overhead..."
                  value={form.blockers}
                  onChange={(e) => setForm({ ...form, blockers: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <><span>Submit Day {form.dayNumber} Proof of Work</span> <ArrowRight size={15} /></>}
              </button>

            </form>
          )}

        </div>

        {/* User Submission History */}
        {userLogs.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 font-mono uppercase tracking-wider flex items-center gap-2">
              <Clock size={16} className="text-[#0066FF]" />
              <span>Your Recent Submissions ({userLogs.length} logged):</span>
            </h3>
            <div className="space-y-3">
              {userLogs.map((log) => (
                <div key={log.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs">
                  <div>
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">Day {log.dayNumber}</span>
                      <span>{log.projectTitle}</span>
                    </div>
                    <p className="text-slate-600 mt-1 text-[11px] line-clamp-1">{log.researchNotes}</p>
                  </div>
                  <a
                    href={log.commitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0066FF] hover:underline flex items-center gap-1 text-[11px] shrink-0 font-bold"
                  >
                    <span>View Commit</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
