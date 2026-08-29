"use client";

import React, { useState } from "react";
import { 
  Mail, 
  Send, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Download, 
  FileText, 
  Calendar,
  AlertCircle,
  Loader2
} from "lucide-react";

interface BroadcastLog {
  id: string;
  subject: string;
  targetAudience: string;
  sentAt: string;
  recipientCount: number;
  openRate: string;
  status: "Sent" | "Scheduled" | "Draft";
}

const PAST_BROADCASTS: BroadcastLog[] = [
  {
    id: "b-1",
    subject: "🔥 Showcase Thursday: 4 New LangGraph & Qdrant Projects Live!",
    targetAudience: "All Community Builders (2,410)",
    sentAt: "Aug 28, 2026",
    recipientCount: 2410,
    openRate: "48.2%",
    status: "Sent"
  },
  {
    id: "b-2",
    subject: "📄 Wednesday AI Resume Teardowns — 8 Review Slots Open",
    targetAudience: "Active Forum Members (1,240)",
    sentAt: "Aug 27, 2026",
    recipientCount: 1240,
    openRate: "54.1%",
    status: "Sent"
  },
  {
    id: "b-3",
    subject: "🎙️ 3rd Saturday AMA with Dr. Promit Ray on Foundation Models",
    targetAudience: "AI Frontier Attendees (520)",
    sentAt: "Aug 15, 2026",
    recipientCount: 520,
    openRate: "62.8%",
    status: "Sent"
  }
];

export default function NewsletterBroadcastPage() {
  const [subject, setSubject] = useState("");
  const [audience, setAudience] = useState("all-builders");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [logs, setLogs] = useState<BroadcastLog[]>(PAST_BROADCASTS);

  const applyTemplate = (type: "showcase" | "resume" | "ama") => {
    if (type === "showcase") {
      setSubject("🔥 Showcase Thursday: This Week's Top AI Community Builds");
      setContent(`Hey Builders,\n\nIt's Showcase Thursday! Check out this week's top community projects built with LangGraph, MCP, and Qdrant.\n\n👉 Join the live demo stream and upvote your favorite builds at https://community.botmartz.com/showcase\n\nKeep building,\nSoham Sharma & Botmartz Community Team`);
    } else if (type === "resume") {
      setSubject("📄 Wednesday Resume Reviews: Get 1-on-1 AI Architect Feedback");
      setContent(`Hey Builders,\n\nTomorrow is AI Resume & Portfolio Review Wednesday! Whether you're interviewing for AI Engineer, RAG Architect, or Research positions, drop your resume in the channel for direct feedback.\n\n👉 Submit your resume at https://community.botmartz.com/discussions?channel=resume-review\n\nBest,\nBotmartz Career Guild`);
    } else if (type === "ama") {
      setSubject("🎙️ 3rd Saturday AMA: Foundation Models & Reasoning with Dr. Promit Ray");
      setContent(`Hey Builders,\n\nOur monthly AI Architect AMA is happening this 3rd Saturday! Submit your burning questions on test-time compute, inference quantization, and enterprise deployment.\n\n👉 RSVP and drop your questions at https://community.botmartz.com/events?type=ama\n\nSee you on the live stream!`);
    }
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) return;

    setLoading(true);
    setTimeout(() => {
      const newLog: BroadcastLog = {
        id: `b-${Date.now()}`,
        subject: subject.trim(),
        targetAudience: audience === "all-builders" ? "All Community Builders (2,410)" : "Active Forum Members (1,240)",
        sentAt: "Just now",
        recipientCount: audience === "all-builders" ? 2410 : 1240,
        openRate: "Delivering...",
        status: "Sent"
      };
      setLogs([newLog, ...logs]);
      setLoading(false);
      setSentSuccess(true);
      setSubject("");
      setContent("");
      setTimeout(() => setSentSuccess(false), 5000);
    }, 800);
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="text-xs font-mono text-[#0066FF] uppercase font-bold tracking-wider mb-1">
            COMMUNITY OUTREACH &amp; RETENTION
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Newsletter &amp; Weekly Broadcasts</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert("Exported 2,410 subscriber emails to CSV.")}
            className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={14} /> Export Subscribers
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
        <h2 className="text-lg font-bold text-slate-900 mb-2">Compose Community Broadcast</h2>
        <p className="text-xs text-slate-500 mb-6">Dispatched securely via SMTP with personalized tags and unsubscribe headers.</p>

        {sentSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 size={16} /> Broadcast dispatched successfully to 2,410 community builders!
          </div>
        )}

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
                <option value="all-builders">🌍 All Community Builders (2,410)</option>
                <option value="forum-active">💬 Active Forum Posters (1,240)</option>
                <option value="summit-paid">🎟️ AI Frontier Paid Attendees (520)</option>
                <option value="bootcamp-alumni">🎓 Bootcamp Cohort Alumni (180)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-700 mb-1">Message Content (Markdown supported)</label>
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
            <div className="text-[11px] font-mono text-slate-400">
              Estimated Delivery: Instant • High-Priority Pool
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#0066FF] hover:bg-[#0052CC] text-white px-7 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
              <span>{loading ? "Sending..." : "Send Broadcast Now"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Broadcast History */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Broadcast History &amp; Open Rate Tracking</h2>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-mono uppercase text-[11px] border-b border-slate-200">
            <tr>
              <th className="p-4">Subject</th>
              <th className="p-4">Target Segment</th>
              <th className="p-4">Dispatched At</th>
              <th className="p-4">Recipients</th>
              <th className="p-4 text-right">Open Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-900 font-sans">{log.subject}</td>
                <td className="p-4 text-slate-600">{log.targetAudience}</td>
                <td className="p-4 text-slate-400">{log.sentAt}</td>
                <td className="p-4 text-[#0066FF] font-bold">{log.recipientCount}</td>
                <td className="p-4 text-right text-emerald-600 font-bold">{log.openRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
