"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Terminal,
  CheckCircle2,
  Calendar,
  Github,
  Linkedin,
  MessageSquare,
  HardDrive,
  Loader2,
  ExternalLink,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Clock,
  Presentation,
  BookOpen,
  Search,
  Check,
  PauseCircle
} from "lucide-react";
import { ARENA_PROJECTS } from "@/lib/arena-projects";
import { useAuth } from "@/lib/auth-context";

export default function DailyPoWLogPage() {
  const { user, studentProfile } = useAuth();

  const [form, setForm] = useState({
    studentEmail: "",
    studentName: "",
    projectId: "p1",
    dayNumber: "1",
    commitUrl: "",
    researchNotes: "",
    pitchDeckUrl: "",
    linkedinPostUrl: "",
    discordMessageUrl: "",
    blockers: "",
    isLearningPause: false,
    learningTopic: ""
  });

  const [searchProjectQuery, setSearchProjectQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [userLogs, setUserLogs] = useState<any[]>([]);

  // Autofill if logged in
  useEffect(() => {
    if (user?.email) {
      setForm((prev) => ({
        ...prev,
        studentEmail: user.email || "",
        studentName: user.displayName || studentProfile?.displayName || prev.studentName,
        projectId: prev.projectId
      }));
      fetchRecentLogs(user.email);
    }
  }, [user, studentProfile]);

  const filteredProjects = ARENA_PROJECTS.filter((p) =>
    p.title.toLowerCase().includes(searchProjectQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchProjectQuery.toLowerCase()) ||
    p.domain.toLowerCase().includes(searchProjectQuery.toLowerCase())
  );

  const selectedProject = ARENA_PROJECTS.find((p) => p.id === form.projectId) || ARENA_PROJECTS[0];

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

    try {
      const res = await fetch("/api/arena/daily-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          projectTitle: selectedProject?.title || "Production System"
        })
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
    <div className="bg-[#FAFCFF] min-h-screen text-slate-900 selection:bg-[#0066FF] selection:text-white pt-24 pb-28 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200">
            <Terminal size={14} /> Daily Proof-of-Work (PoW) Logger
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
            Submit Daily Standup &amp; Build Log
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-mono">
            Log your daily GitHub commits, pitch deck architecture, and technical roadblocks. Earn +50 Karma Coins per verified submission.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xs mb-10">
          
          {success ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2 font-sans">
                Day {form.dayNumber} Proof-of-Work Verified!
              </h2>
              <p className="text-xs text-slate-600 font-mono max-w-md mx-auto mb-6">
                Your standup log, commit hash, and blockers have been logged to the public ledger. +50 Karma Coins credited.
              </p>
              <div className="flex justify-center gap-4 font-mono text-xs">
                <button
                  onClick={() => setSuccess(false)}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold"
                >
                  Log Another Update
                </button>
                <Link
                  href="/arena/progress"
                  className="px-6 py-2.5 rounded-xl bg-blue-50 text-[#0066FF] border border-blue-200 font-bold"
                >
                  View Public Feed →
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 font-mono text-xs">
              
              {/* Student Identity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5 uppercase text-[10px]">
                    Registered Student Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@college.edu"
                    value={form.studentEmail}
                    onChange={(e) => setForm({ ...form, studentEmail: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5 uppercase text-[10px]">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={form.studentName}
                    onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>

              {/* Searchable Project Selector & Day Number */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1.5 uppercase text-[10px]">
                    Selected Production System *
                  </label>
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                      <input
                        type="text"
                        placeholder="Search system by name (e.g. Drone, Satellite, Rust, RAG)..."
                        value={searchProjectQuery}
                        onChange={(e) => setSearchProjectQuery(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-[11px] text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                      />
                    </div>
                    <select
                      value={form.projectId}
                      onChange={(e) => setForm({ ...form, projectId: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                    >
                      {filteredProjects.map((p) => (
                        <option key={p.id} value={p.id}>
                          [{p.difficulty}] {p.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5 uppercase text-[10px]">
                    Cohort Day # (1-45) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={45}
                    required
                    value={form.dayNumber}
                    onChange={(e) => setForm({ ...form, dayNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>

              {/* Dedicated Concept Learning Pause Option */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="learningPauseCheck"
                  checked={form.isLearningPause}
                  onChange={(e) => setForm({ ...form, isLearningPause: e.target.checked })}
                  className="mt-1 w-4 h-4 rounded text-[#0066FF] cursor-pointer"
                />
                <div className="flex-1">
                  <label htmlFor="learningPauseCheck" className="font-bold text-amber-900 cursor-pointer block text-xs">
                    Concept Learning Day (Pause Project Coding to Study System Design / AI Foundations)
                  </label>
                  <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed font-sans">
                    Take time to master core prerequisites (e.g. database deadlocks, vector math, WebSockets) before writing code. Maintains your streak without penalty.
                  </p>
                  {form.isLearningPause && (
                    <input
                      type="text"
                      placeholder="What concept are you studying today? (e.g. B-Tree indexing, CRDT resolution, CUDA kernels)..."
                      value={form.learningTopic}
                      onChange={(e) => setForm({ ...form, learningTopic: e.target.value })}
                      className="mt-2 w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  )}
                </div>
              </div>

              {/* GitHub Commit URL & Pitch Deck URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5 uppercase text-[10px] flex items-center gap-1.5">
                    <Github size={12} /> Today's GitHub Commit / PR URL {!form.isLearningPause && "*"}
                  </label>
                  <input
                    type="url"
                    required={!form.isLearningPause}
                    placeholder="https://github.com/org/repo/commit/abc1234"
                    value={form.commitUrl}
                    onChange={(e) => setForm({ ...form, commitUrl: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5 uppercase text-[10px] flex items-center gap-1.5">
                    <Presentation size={12} /> System Pitch Deck / Architecture Slides
                  </label>
                  <input
                    type="url"
                    placeholder="https://docs.google.com/presentation/d/... (Slides/Notion)"
                    value={form.pitchDeckUrl}
                    onChange={(e) => setForm({ ...form, pitchDeckUrl: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>

              {/* Daily Engineering Standup Notes */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5 uppercase text-[10px]">
                  What Did You Build / Learn Today? (150 Words) *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail the technical implementation, benchmark metrics achieved, or failure cases resolved today..."
                  value={form.researchNotes}
                  onChange={(e) => setForm({ ...form, researchNotes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              {/* Blockers & Doubts field for core team help */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5 uppercase text-[10px] flex items-center gap-1.5">
                  <HelpCircle size={12} className="text-amber-600" /> What doubts or blockers do you have? (Optional — reviewed by core team)
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe any deadlocks, CUDA memory errors, or architecture questions so Founder Soham Sharma & squad can unblock you..."
                  value={form.blockers}
                  onChange={(e) => setForm({ ...form, blockers: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              {/* Social Proof Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5 uppercase text-[10px] flex items-center gap-1.5">
                    <Linkedin size={12} className="text-blue-700" /> LinkedIn Progress Post Link (+50 Coins)
                  </label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/posts/..."
                    value={form.linkedinPostUrl}
                    onChange={(e) => setForm({ ...form, linkedinPostUrl: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5 uppercase text-[10px] flex items-center gap-1.5">
                    <MessageSquare size={12} className="text-indigo-600" /> Discord Message Link
                  </label>
                  <input
                    type="url"
                    placeholder="https://discord.com/channels/..."
                    value={form.discordMessageUrl}
                    onChange={(e) => setForm({ ...form, discordMessageUrl: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <span>Submit Day {form.dayNumber} Proof-of-Work</span>}
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
