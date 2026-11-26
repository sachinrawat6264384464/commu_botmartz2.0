"use client";

import React, { useEffect, useState } from "react";
import {
  Send,
  Users,
  Sparkles,
  CheckCircle2,
  Download,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface SubscriberItem {
  email: string;
  name: string;
  status: string;
  source: string;
  subscribedAt: number;
}

interface BroadcastLog {
  id: string;
  type?: string;
  subject: string;
  targetAudience: string;
  sentAt: number | string;
  recipientCount: number;
  sentCount?: number;
  failedCount?: number;
  status: string;
}

interface DigestPreview {
  totalUpdates: number;
  windowHours: number;
  updatesByCategory: Record<string, number>;
  items: Array<{
    id: string;
    category: string;
    title: string;
    subtitle: string;
  }>;
}

export default function NewsletterBroadcastPage() {
  const [subject, setSubject] = useState("");
  const [audience, setAudience] = useState("all-builders");
  const [content, setContent] = useState("");
  const [testEmail, setTestEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [digestLoading, setDigestLoading] = useState(false);
  const [statusBanner, setStatusBanner] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [subscribers, setSubscribers] = useState<SubscriberItem[]>([]);
  const [activeCount, setActiveCount] = useState(0);
  const [logs, setLogs] = useState<BroadcastLog[]>([]);
  const [digestPreview, setDigestPreview] = useState<DigestPreview | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const loadData = async () => {
    setInitialLoading(true);
    try {
      const [adminRes, digestRes] = await Promise.all([
        fetch("/api/admin/newsletter"),
        fetch("/api/newsletter/daily-digest?preview=true"),
      ]);
      const adminData = await adminRes.json();
      const digestData = await digestRes.json();

      if (adminData.success) {
        setSubscribers(adminData.subscribers || []);
        setActiveCount(adminData.activeCount || 0);
        setLogs(adminData.broadcasts || []);
      }
      if (digestData.success) {
        setDigestPreview({
          totalUpdates: digestData.totalUpdates || 0,
          windowHours: digestData.windowHours || 24,
          updatesByCategory: digestData.updatesByCategory || {},
          items: digestData.items || [],
        });
      }
    } catch (err) {
      console.error("Failed to load newsletter admin data:", err);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const applyTemplate = (type: "showcase" | "resume" | "ama") => {
    if (type === "showcase") {
      setSubject("Showcase Thursday: This Week's Top AI Community Builds");
      setContent(
        `Hey Builders,\n\nIt's Showcase Thursday! Check out this week's top community projects built with LangGraph, MCP, and Qdrant.\n\nJoin the live demo stream and upvote your favorite builds at https://community.botmartz.com/showcase\n\nKeep building,\nSoham Sharma & Botmartz Community Team`
      );
    } else if (type === "resume") {
      setSubject("Wednesday Resume Reviews: Get 1-on-1 AI Architect Feedback");
      setContent(
        `Hey Builders,\n\nTomorrow is AI Resume & Portfolio Review Wednesday! Whether you're interviewing for AI Engineer, RAG Architect, or Research positions, drop your resume in the channel for direct feedback.\n\nSubmit your resume at https://community.botmartz.com/discussions?channel=resume-review\n\nBest,\nBotmartz Career Guild`
      );
    } else if (type === "ama") {
      setSubject("Saturday AMA: Foundation Models & Reasoning with Dr. Promit Ray");
      setContent(
        `Hey Builders,\n\nOur monthly AI Architect AMA is happening this Saturday! Submit your questions on test-time compute, inference quantization, and enterprise deployment.\n\nRSVP and drop your questions at https://community.botmartz.com/events?type=ama\n\nSee you on the live stream!`
      );
    }
  };

  const handleExportCsv = () => {
    if (subscribers.length === 0) {
      setStatusBanner({ type: "error", text: "No subscribers in database to export yet." });
      return;
    }
    const header = "email,name,status,source,subscribedAt\n";
    const rows = subscribers
      .map(
        (s) =>
          `"${s.email.replace(/"/g, '""')}","${s.name.replace(/"/g, '""')}","${s.status}","${s.source}","${
            s.subscribedAt ? new Date(s.subscribedAt).toISOString() : ""
          }"`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `botmartz-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRunDailyDigest = async (isTest: boolean) => {
    if (isTest && (!testEmail.trim() || !testEmail.includes("@"))) {
      setStatusBanner({ type: "error", text: "Enter a valid Test Email address first." });
      return;
    }
    setDigestLoading(true);
    setStatusBanner(null);
    try {
      const res = await fetch("/api/newsletter/daily-digest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hours: 24,
          force: true,
          testEmail: isTest ? testEmail.trim() : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusBanner({ type: "success", text: data.message || "Daily digest processed." });
        await loadData();
      } else {
        setStatusBanner({ type: "error", text: data.error || "Failed to dispatch daily digest." });
      }
    } catch {
      setStatusBanner({ type: "error", text: "Network error while running daily digest." });
    } finally {
      setDigestLoading(false);
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) return;

    setLoading(true);
    setStatusBanner(null);
    try {
      const res = await fetch("/api/admin/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subject.trim(),
          content: content.trim(),
          audience,
          testEmail: testEmail.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusBanner({ type: "success", text: data.message || "Broadcast delivered!" });
        if (!testEmail.trim()) {
          setSubject("");
          setContent("");
        }
        await loadData();
      } else {
        setStatusBanner({ type: "error", text: data.error || "Failed to send broadcast." });
      }
    } catch {
      setStatusBanner({ type: "error", text: "Connection error while sending broadcast." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="text-xs font-mono text-[#0066FF] uppercase font-bold tracking-wider mb-1">
            COMMUNITY OUTREACH &amp; AUTOMATED DAILY DIGEST
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Newsletter &amp; Daily DB Digests</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200 text-[#0066FF] text-xs font-mono font-bold flex items-center gap-1.5">
            <Users size={14} /> {initialLoading ? "..." : activeCount} Active Subscribers
          </div>
          <button
            type="button"
            onClick={handleExportCsv}
            className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={14} /> Export CSV ({subscribers.length})
          </button>
        </div>
      </div>

      {statusBanner && (
        <div
          className={`p-4 rounded-2xl border text-xs font-mono flex items-center gap-2 ${
            statusBanner.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-rose-50 border-rose-200 text-rose-700"
          }`}
        >
          {statusBanner.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{statusBanner.text}</span>
        </div>
      )}

      {/* Daily Automated DB Digest Panel */}
      <div className="bg-[#070E54] text-white border border-[#1D3189] rounded-3xl p-6 sm:p-8 shadow-lg space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#D9F83B] text-[11px] font-mono font-bold">
              <Sparkles size={13} /> DAILY AUTOMATED DB DIGEST (CRON: 09:00 UTC)
            </div>
            <h2 className="text-lg sm:text-xl font-bold">
              {digestPreview
                ? `${digestPreview.totalUpdates} New Database Update${digestPreview.totalUpdates === 1 ? "" : "s"} in Last 24h`
                : "Scanning database for today's updates..."}
            </h2>
            <p className="text-xs text-blue-100/80">
              Automatically scans Roadmaps, Hackathons, Events, PoW Showcases, and Blocker Bounties updated in the last 24h and emails all active subscribers.
            </p>
          </div>

          <button
            type="button"
            onClick={loadData}
            className="self-start px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw size={13} className={initialLoading ? "animate-spin" : ""} /> Refresh DB Scan
          </button>
        </div>

        {digestPreview && (
          <div className="flex flex-wrap gap-2">
            {Object.entries(digestPreview.updatesByCategory).length === 0 ? (
              <span className="px-3 py-1.5 rounded-xl bg-white/10 text-xs text-blue-100">
                No new records modified in the last 24h (Force Send still works for testing).
              </span>
            ) : (
              Object.entries(digestPreview.updatesByCategory).map(([cat, count]) => (
                <span key={cat} className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs font-mono">
                  {cat}: <strong className="text-[#D9F83B]">{count}</strong>
                </span>
              ))
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 border-t border-white/10">
          <input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="Optional test email (e.g. your@email.com)"
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-blue-200/60 focus:outline-none focus:border-[#D9F83B]"
          />
          <button
            type="button"
            disabled={digestLoading}
            onClick={() => handleRunDailyDigest(true)}
            className="px-4 py-2.5 rounded-xl bg-white text-slate-950 font-mono text-xs font-bold hover:bg-slate-100 cursor-pointer disabled:opacity-60"
          >
            {digestLoading ? "Sending..." : "Send Test Digest"}
          </button>
          <button
            type="button"
            disabled={digestLoading}
            onClick={() => handleRunDailyDigest(false)}
            className="px-5 py-2.5 rounded-xl bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-mono text-xs font-extrabold cursor-pointer disabled:opacity-60"
          >
            {digestLoading ? "Dispatching..." : `Dispatch Daily Digest (${activeCount})`}
          </button>
        </div>
      </div>

      {/* Quick Template Triggers */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <div className="text-xs font-mono text-slate-500 uppercase font-bold mb-3">
          ⚡ 1-Click Community Ritual Templates
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => applyTemplate("showcase")}
            className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-mono text-xs font-bold transition-colors cursor-pointer"
          >
            + Showcase Thursday Blast
          </button>
          <button
            type="button"
            onClick={() => applyTemplate("resume")}
            className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0066FF] border border-blue-200 font-mono text-xs font-bold transition-colors cursor-pointer"
          >
            + Wednesday Resume Review Reminder
          </button>
          <button
            type="button"
            onClick={() => applyTemplate("ama")}
            className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-mono text-xs font-bold transition-colors cursor-pointer"
          >
            + 3rd Saturday AMA Invitation
          </button>
        </div>
      </div>

      {/* Composer Form */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 mb-2">Compose Custom Community Broadcast</h2>
        <p className="text-xs text-slate-500 mb-6">
          Dispatched securely via Hostinger SMTP to real Firestore subscribers with one-click unsubscribe links.
        </p>

        <form onSubmit={handleSendBroadcast} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-mono text-slate-700 mb-1">Email Subject Line</label>
              <input
                type="text"
                placeholder="e.g. Showcase Thursday: 3 New LangGraph Implementations..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-700 mb-1">Target Segment</label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
              >
                <option value="all-builders">🌍 Active Subscribers ({activeCount})</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-700 mb-1">Message Content</label>
            <textarea
              rows={8}
              placeholder="Write your email broadcast content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs sm:text-sm text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-[#0066FF]"
              required
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="text-[11px] font-mono text-slate-500">
              {testEmail.trim()
                ? `Test Mode: Will send ONLY to ${testEmail.trim()}`
                : `Live Mode: Will send to ${activeCount} active subscriber(s)`}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#0066FF] hover:bg-[#0052CC] text-white px-7 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
              <span>{loading ? "Sending..." : testEmail.trim() ? "Send Test Broadcast" : "Send Broadcast Now"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Broadcast History */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Real Broadcast &amp; Daily Digest History</h2>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-mono uppercase text-[11px] border-b border-slate-200">
            <tr>
              <th className="p-4">Subject</th>
              <th className="p-4">Audience</th>
              <th className="p-4">Dispatched At</th>
              <th className="p-4">Delivered</th>
              <th className="p-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-400">
                  No broadcasts dispatched yet. Send a test digest or broadcast above!
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-900 font-sans">{log.subject}</td>
                  <td className="p-4 text-slate-600">{log.targetAudience}</td>
                  <td className="p-4 text-slate-400">
                    {typeof log.sentAt === "number" ? new Date(log.sentAt).toLocaleString() : log.sentAt}
                  </td>
                  <td className="p-4 text-[#0066FF] font-bold">
                    {log.sentCount ?? log.recipientCount}/{log.recipientCount}
                  </td>
                  <td className="p-4 text-right text-emerald-600 font-bold">{log.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
