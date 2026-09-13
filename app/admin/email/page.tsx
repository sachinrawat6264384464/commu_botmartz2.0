"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, Send, CheckCircle2, AlertCircle, RefreshCw, Loader2, Server, Users, ShieldAlert, Sparkles } from "lucide-react";

export default function AdminEmailDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [broadcasting, setBroadcasting] = useState(false);
  const [testingSmtp, setTestingSmtp] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Broadcast Form State
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const fetchEmailStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/email");
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setEvents(data.events || []);
      }
    } catch (err) {
      console.error("Failed to load email stats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmailStats();
  }, []);

  const handleTestSmtp = async () => {
    setTestingSmtp(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "TEST_SMTP" }),
      });
      const data = await res.json();
      if (data.success && data.isConnected) {
        setMsg({ type: "success", text: "Hostinger SMTP Connection Verified & Ready!" });
      } else {
        setMsg({ type: "error", text: "SMTP Verification failed. Check Hostinger credentials in .env" });
      }
    } catch (err) {
      setMsg({ type: "error", text: "Failed to verify Hostinger SMTP transport." });
    } finally {
      setTestingSmtp(false);
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !content) {
      setMsg({ type: "error", text: "Subject and HTML/Text content are required for broadcast." });
      return;
    }

    setBroadcasting(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SEND_BROADCAST",
          subject,
          content,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMsg({ type: "success", text: data.message });
        setSubject("");
        setContent("");
        fetchEmailStats();
      } else {
        setMsg({ type: "error", text: data.error || "Failed to broadcast email." });
      }
    } catch (err) {
      setMsg({ type: "error", text: "Network error during broadcast dispatch." });
    } finally {
      setBroadcasting(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="text-xs font-mono text-[#0066FF] uppercase font-bold tracking-wider mb-1">
            BOTMARTZ EMAIL AUTOMATION & DRIP CONTROL
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Email Infrastructure & Logs</h1>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Powered by Hostinger SMTP Transport & Async Firestore Queue.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/email/content"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            <span>Email CMS &amp; AI Studio</span>
          </Link>
          <button
            onClick={handleTestSmtp}
            disabled={testingSmtp}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2"
          >
            {testingSmtp ? <Loader2 className="h-4 w-4 animate-spin" /> : <Server className="h-4 w-4 text-cyan-400" />}
            Verify Hostinger SMTP
          </button>
          <button
            onClick={fetchEmailStats}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all"
            title="Refresh Metrics"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
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

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-500 uppercase font-bold">Active Subscribers</span>
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-3xl font-black font-mono text-slate-900">{stats?.activeSubscribers ?? 0}</div>
          <div className="text-[11px] font-mono text-slate-500 mt-1 font-semibold">
            {stats?.unsubscribed ?? 0} unsubscribed
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-500 uppercase font-bold">Queued Jobs</span>
            <Mail className="h-5 w-5 text-cyan-600" />
          </div>
          <div className="text-3xl font-black font-mono text-slate-900">{stats?.queuedJobs ?? 0}</div>
          <div className="text-[11px] font-mono text-slate-500 mt-1 font-semibold">Async Firestore Queue</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-500 uppercase font-bold">Emails Sent</span>
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-black font-mono text-emerald-600">{stats?.sentJobs ?? 0}</div>
          <div className="text-[11px] font-mono text-slate-500 mt-1 font-semibold">Hostinger Delivery</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-500 uppercase font-bold">SMTP Provider</span>
            <Server className="h-5 w-5 text-purple-600" />
          </div>
          <div className="text-sm font-bold font-mono text-slate-900">smtp.hostinger.com</div>
          <div className="text-[11px] font-mono text-emerald-600 font-bold mt-1">Port 465 SSL Active</div>
        </div>
      </div>

      {/* Main Grid: Broadcast Form & Event Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Broadcast Dispatcher */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#0066FF]" />
            <h2 className="text-lg font-bold text-slate-900">Send Newsletter Broadcast</h2>
          </div>
          <p className="text-xs text-slate-500">
            Send an instant email campaign to all active newsletter subscribers without blocking backend threads.
          </p>

          <form onSubmit={handleSendBroadcast} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1">
                Campaign Subject Line
              </label>
              <input
                type="text"
                placeholder="e.g. Botmartz Weekly Dispatch: AI Architecture Teardown"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-900 focus:border-[#0066FF] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1">
                Email Message Content (HTML or Text)
              </label>
              <textarea
                rows={6}
                placeholder="Write your email body message here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-900 focus:border-[#0066FF] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={broadcasting}
              className="w-full py-3 bg-[#0066FF] hover:bg-blue-700 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {broadcasting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Queueing Broadcast...
                </>
              ) : (
                <>
                  Queue Broadcast to All Subscribers <Send className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Realtime Delivery Event Audit Trail */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Email Delivery Audit Trail</h2>
            <span className="text-xs font-mono text-slate-400">Last 20 Events</span>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 font-mono text-xs">
            {events.length === 0 ? (
              <div className="py-12 text-center text-slate-400">No email delivery events logged yet.</div>
            ) : (
              events.map((ev) => (
                <div key={ev.id} className="p-3 rounded-2xl border border-slate-100 bg-slate-50 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          ev.eventType === "SENT"
                            ? "bg-emerald-100 text-emerald-700"
                            : ev.eventType === "QUEUED"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {ev.eventType}
                      </span>
                      <span className="font-bold text-slate-800">{ev.recipient}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Template: <span className="text-slate-700">{ev.templateId}</span> | Type: {ev.emailType}
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {ev.timestamp ? new Date(ev.timestamp).toLocaleTimeString() : ""}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
