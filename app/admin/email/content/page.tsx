"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, CheckCircle2, AlertCircle, Loader2, Plus, Calendar, Layers, RefreshCw, FileText, Send } from "lucide-react";

export default function AdminEmailContentPage() {
  const [features, setFeatures] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchContentData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/email/content");
      const data = await res.json();
      if (data.success) {
        setFeatures(data.features || []);
        setArticles(data.articles || []);
      }
    } catch (e) {
      console.error("Failed to load CMS content", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContentData();
  }, []);

  const handleGenerateAiDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt) {
      setMsg({ type: "error", text: "Please enter a topic prompt for AI generation." });
      return;
    }

    setAiGenerating(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/email/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "GENERATE_AI_DRAFT",
          prompt: aiPrompt,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMsg({ type: "success", text: "AI Newsletter Draft generated successfully and saved for Admin Review!" });
        setAiPrompt("");
        fetchContentData();
      } else {
        setMsg({ type: "error", text: data.error || "Failed to generate AI draft." });
      }
    } catch (e) {
      setMsg({ type: "error", text: "Network error during AI draft generation." });
    } finally {
      setAiGenerating(false);
    }
  };

  const handleApproveArticle = async (articleId: string) => {
    try {
      const res = await fetch("/api/admin/email/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "APPROVE_CONTENT",
          articleId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMsg({ type: "success", text: "Content approved for scheduled newsletter distribution!" });
        fetchContentData();
      }
    } catch (e) {
      setMsg({ type: "error", text: "Failed to approve content." });
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="text-xs font-mono text-[#0066FF] uppercase font-bold tracking-wider mb-1">
            DYNAMIC CONTENT & AI NEWSLETTER ENGINE
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Email CMS &amp; Smart Scheduler Rules</h1>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Dynamic Feature Content, AI Draft Review, Weekend Skipping &amp; Collision Prevention
          </p>
        </div>

        <button
          onClick={fetchContentData}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {msg && (
        <div
          className={`flex items-center gap-3 p-4 rounded-2xl border text-xs font-mono font-bold ${
            msg.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {msg.type === "success" ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Smart Business-Day Scheduler Rule Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-[#0A1124] text-white border border-blue-800/40 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-cyan-400" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-400">
                ACTIVE SCHEDULER RULES (MON, WED, FRI)
              </span>
            </div>
            <h3 className="text-lg font-bold">Smart Business-Day Scheduling &amp; Weekend Blocking</h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Marketing &amp; Onboarding Feature emails are automatically constrained to <strong>Monday, Wednesday, and Friday</strong>. Weekend sends (Saturday/Sunday) are automatically skipped and rescheduled for the next eligible business day. Collision control enforces <strong>max 1 marketing email/day per user</strong>.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-mono">
            <span className="px-3 py-1.5 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-300">
              Weekend Skip: ACTIVE
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300">
              Max Daily: 1 Email
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: AI Content Studio & Feature Catalog */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Optional AI Content Layer */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#0066FF]" />
            <h2 className="text-lg font-bold text-slate-900">AI Newsletter Draft Studio</h2>
          </div>
          <p className="text-xs text-slate-500">
            Generate beginner-friendly newsletter summaries and technical teardowns using project data. AI drafts require Admin Approval before dispatch.
          </p>

          <form onSubmit={handleGenerateAiDraft} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1">
                Topic or Feature Focus Prompt
              </label>
              <input
                type="text"
                placeholder="e.g. Multi-Agent RAG Orchestration & SLA Benchmarking"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-900 focus:border-[#0066FF] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={aiGenerating}
              className="w-full py-3 bg-[#0066FF] hover:bg-blue-700 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {aiGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Generating AI Draft...
                </>
              ) : (
                <>
                  Generate AI Newsletter Draft <Sparkles className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Pending Articles Review List */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase text-slate-700">Content Approval Queue</h4>

            {articles.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">No content items found.</div>
            ) : (
              articles.map((art) => (
                <div key={art.id} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{art.title}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          art.status === "APPROVED" || art.status === "PUBLISHED"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {art.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{art.summary}</p>
                  </div>

                  {art.status === "DRAFT" && (
                    <button
                      onClick={() => handleApproveArticle(art.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-[10px] font-bold uppercase rounded-lg shrink-0"
                    >
                      Approve &amp; Schedule
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Feature Catalog CMS */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-bold text-slate-900">Dynamic Feature Catalog</h2>
            </div>
            <span className="text-xs font-mono text-slate-400">Drip Step Sources</span>
          </div>

          <p className="text-xs text-slate-500">
            Features configured here are dynamically injected into onboarding drip emails (<span className="font-mono text-blue-600">LIVE_CONTENT</span> mode). Updating a feature updates future emails automatically.
          </p>

          <div className="space-y-3 pt-2">
            {features.map((feat) => (
              <div key={feat.slug || feat.featureId} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{feat.name}</span>
                  <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-mono font-bold">
                    slug: {feat.slug}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{feat.fullDescription}</p>

                {feat.benefits && feat.benefits.length > 0 && (
                  <ul className="pl-4 list-disc text-[11px] text-slate-500 space-y-0.5">
                    {feat.benefits.map((b: string, i: number) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
