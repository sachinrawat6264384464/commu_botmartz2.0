"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Star,
  CheckCircle2,
  XCircle,
  Trash2,
  Clock,
  Filter,
  Loader2,
  Layers,
  Sparkles,
  AlertCircle,
  ExternalLink
} from "lucide-react";

interface TestimonialItem {
  id: string;
  targetType: string;
  targetId: string;
  targetTitle: string;
  authorName: string;
  authorEmail?: string;
  authorRole: string;
  authorCollegeOrCompany: string;
  rating: number;
  content: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  moderatedAt?: string;
}

export default function AdminFeedbackPage() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"PENDING" | "APPROVED" | "REJECTED" | "ALL">("PENDING");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const loadTestimonials = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/testimonials?status=ALL");
      const data = await res.json();
      if (data.success && Array.isArray(data.testimonials)) {
        setTestimonials(data.testimonials);
      }
    } catch (e) {
      console.error("Failed to load testimonials:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handleModerate = async (id: string, action: "APPROVE" | "REJECT" | "DELETE") => {
    setProcessingId(id);
    setFeedbackMsg("");
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action })
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackMsg(data.message);
        if (action === "DELETE") {
          setTestimonials((prev) => prev.filter((t) => t.id !== id));
        } else {
          setTestimonials((prev) =>
            prev.map((t) => (t.id === id ? { ...t, status: action === "APPROVE" ? "APPROVED" : "REJECTED" } : t))
          );
        }
      } else {
        alert(data.error || "Action failed.");
      }
    } catch (e: any) {
      alert(e.message || "Failed to submit moderation.");
    } finally {
      setProcessingId(null);
    }
  };

  const filtered = testimonials.filter((t) => {
    if (activeTab === "ALL") return true;
    return t.status === activeTab;
  });

  const pendingCount = testimonials.filter((t) => t.status === "PENDING").length;
  const approvedCount = testimonials.filter((t) => t.status === "APPROVED").length;
  const rejectedCount = testimonials.filter((t) => t.status === "REJECTED").length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="text-xs font-mono text-[#0066FF] dark:text-[#00B8F0] uppercase font-bold tracking-wider">
            COMMUNITY &amp; ARENA REVIEWS
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Testimonials &amp; Feedback Moderation
          </h1>
          <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">
            Review and approve student testimonials before they appear publicly on PRD pages and homepages.
          </p>
        </div>

        <button
          onClick={loadTestimonials}
          className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-mono text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer self-start sm:self-auto"
        >
          Refresh Feed
        </button>
      </div>

      {feedbackMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs flex items-center gap-2">
          <CheckCircle2 size={15} />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* ── FILTER TABS ── */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto font-mono text-xs">
        <button
          onClick={() => setActiveTab("PENDING")}
          className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "PENDING"
              ? "bg-amber-500 text-white shadow-xs"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
          }`}
        >
          <Clock size={14} />
          <span>Pending Review</span>
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-white text-[10px]">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("APPROVED")}
          className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "APPROVED"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
          }`}
        >
          <CheckCircle2 size={14} />
          <span>Approved &amp; Live ({approvedCount})</span>
        </button>

        <button
          onClick={() => setActiveTab("REJECTED")}
          className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "REJECTED"
              ? "bg-rose-600 text-white shadow-xs"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
          }`}
        >
          <XCircle size={14} />
          <span>Rejected ({rejectedCount})</span>
        </button>

        <button
          onClick={() => setActiveTab("ALL")}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeTab === "ALL"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
          }`}
        >
          All ({testimonials.length})
        </button>
      </div>

      {/* ── TESTIMONIALS LIST ── */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 font-mono text-xs flex items-center justify-center gap-2">
          <Loader2 size={18} className="animate-spin text-[#0066FF]" />
          <span>Loading testimonials database...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#0B1524] border border-slate-200 dark:border-white/10 font-mono text-xs text-slate-400">
          No testimonials found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((t) => (
            <div
              key={t.id}
              className={`p-6 rounded-3xl bg-white dark:bg-[#0B1524] border shadow-sm transition-all flex flex-col justify-between ${
                t.status === "PENDING"
                  ? "border-amber-300 dark:border-amber-500/40 bg-amber-50/10"
                  : t.status === "APPROVED"
                  ? "border-emerald-200 dark:border-emerald-800/40"
                  : "border-rose-200 dark:border-rose-800/40 opacity-75"
              }`}
            >
              <div>
                {/* Status Badge & Target Info */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                      t.status === "PENDING"
                        ? "bg-amber-100 text-amber-800"
                        : t.status === "APPROVED"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {t.status === "PENDING" ? "⏳ Awaiting Review" : t.status === "APPROVED" ? "✔ Live on Site" : "✖ Rejected"}
                  </span>

                  <span className="text-[10px] font-mono text-slate-400">
                    {new Date(t.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>

                {/* Target Project / Event */}
                <div className="text-xs font-mono text-[#0066FF] dark:text-[#00B8F0] font-bold mb-2 truncate">
                  {t.targetTitle || t.targetId}
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                  <span className="text-xs font-mono font-bold text-slate-500 ml-1.5">
                    ({t.rating}/5)
                  </span>
                </div>

                {/* Testimonial Quote */}
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed italic mb-4">
                  &ldquo;{t.content}&rdquo;
                </p>
              </div>

              {/* Author & Moderation Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-xs">
                    {t.authorName}
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    {t.authorRole} &bull; {t.authorCollegeOrCompany}
                  </div>
                  {t.authorEmail && (
                    <div className="text-[10px] font-mono text-slate-400">
                      {t.authorEmail}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {t.status !== "APPROVED" && (
                    <button
                      disabled={processingId === t.id}
                      onClick={() => handleModerate(t.id, "APPROVE")}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1"
                    >
                      <CheckCircle2 size={13} />
                      <span>Approve</span>
                    </button>
                  )}

                  {t.status !== "REJECTED" && (
                    <button
                      disabled={processingId === t.id}
                      onClick={() => handleModerate(t.id, "REJECT")}
                      className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-mono text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1"
                    >
                      <XCircle size={13} />
                      <span>Reject</span>
                    </button>
                  )}

                  <button
                    disabled={processingId === t.id}
                    onClick={() => {
                      if (confirm("Delete this testimonial permanently?")) {
                        handleModerate(t.id, "DELETE");
                      }
                    }}
                    className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-rose-600 transition-all cursor-pointer disabled:opacity-50"
                    title="Delete Permanently"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
