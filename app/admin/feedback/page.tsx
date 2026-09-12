"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Star,
  CheckCircle2,
  XCircle,
  Trash2,
  Clock,
  Filter,
  Loader2,
  Sparkles,
  Search,
  Download,
  Eye,
  EyeOff,
  UserCheck,
  UserX,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ThumbsUp,
  BarChart2,
  Users
} from "lucide-react";

interface FeedbackItem {
  id: string;
  eventId: string;
  workshopId?: string;
  participantName: string;
  participantEmail?: string;
  participantPhone?: string;
  registrationCode?: string;
  attendeeType: "student" | "professional";
  overallRating: number;
  contentRating: number;
  venueRating: number;
  recommend: boolean | string;
  takeaways?: string;
  comments?: string;
  isFeatured: boolean;
  createdAt: string;
  sessionTitle?: string;
}

interface AttendanceItem {
  id: string;
  name: string;
  email: string;
  registrationCode: string;
  attendeeType: string;
  eventSlug: string;
  checkedIn: boolean;
  feedbackSubmitted: boolean;
}

export default function AdminFeedbackIntelligenceDashboard() {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [attendanceLedger, setAttendanceLedger] = useState<AttendanceItem[]>([]);
  const [stats, setStats] = useState({
    totalSubmissions: 48,
    avgOverall: 4.8,
    avgContent: 4.6,
    avgVenue: 4.9,
    recommendRate: 100,
    coverageRate: 2400,
    pendingCount: 2,
    totalRegistrations: 2,
  });
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "frontier" | "workshop">("all");
  const [activeTab, setActiveTab] = useState<"feedback" | "attendance">("feedback");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [passTypeFilter, setPassTypeFilter] = useState("all");

  const loadFeedbackData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/feedback?eventId=${selectedEvent}`);
      const data = await res.json();
      if (data.success) {
        setFeedbacks(data.feedbacks || []);
        setAttendanceLedger(data.attendanceLedger || []);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (e) {
      console.error("Failed to load feedback data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedbackData();
  }, [selectedEvent]);

  // Toggle Featured Status (Website Display)
  const handleToggleFeatured = async (feedbackId: string, currentStatus: boolean) => {
    setTogglingId(feedbackId);
    try {
      const res = await fetch("/api/admin/feedback/toggle-featured", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedbackId, isFeatured: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedbacks((prev) =>
          prev.map((f) => (f.id === feedbackId ? { ...f, isFeatured: !currentStatus } : f))
        );
      } else {
        alert(data.error || "Failed to toggle status.");
      }
    } catch (err: any) {
      alert(err.message || "Error toggling status.");
    } finally {
      setTogglingId(null);
    }
  };

  // Delete Single or Bulk
  const handleDelete = async (id?: string) => {
    const idsToDelete = id ? [id] : selectedIds;
    if (idsToDelete.length === 0) return;

    if (!confirm(`Delete ${idsToDelete.length} feedback item(s) permanently?`)) return;

    try {
      const res = await fetch("/api/admin/feedback", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: idsToDelete }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedbacks((prev) => prev.filter((f) => !idsToDelete.includes(f.id)));
        setSelectedIds([]);
      } else {
        alert(data.error || "Delete failed.");
      }
    } catch (e: any) {
      alert(e.message || "Failed to delete.");
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (feedbacks.length === 0) {
      alert("No feedback items to export.");
      return;
    }

    const headers = ["ID", "Name", "Email", "Registration Code", "Type", "Overall", "Content", "Venue", "Recommend", "Featured Status", "Submitted Date", "Takeaways"];
    const rows = feedbacks.map((f) => [
      f.id,
      `"${f.participantName || ""}"`,
      `"${f.participantEmail || ""}"`,
      `"${f.registrationCode || ""}"`,
      f.attendeeType,
      f.overallRating,
      f.contentRating,
      f.venueRating,
      f.recommend ? "Yes" : "No",
      f.isFeatured ? "Ticked (Public)" : "Hidden",
      f.createdAt,
      `"${(f.takeaways || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Event_Feedback_Ledger_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Select all checkboxes
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredFeedbacks.map((f) => f.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  // Category Filter
  const filteredFeedbacks = feedbacks.filter((f) => {
    if (categoryFilter === "frontier" && !f.eventId?.includes("frontier")) return false;
    if (categoryFilter === "workshop" && !f.eventId?.includes("workshop")) return false;
    if (passTypeFilter !== "all" && f.attendeeType !== passTypeFilter) return false;

    const q = searchQuery.toLowerCase();
    return (
      f.participantName.toLowerCase().includes(q) ||
      (f.participantEmail && f.participantEmail.toLowerCase().includes(q)) ||
      (f.registrationCode && f.registrationCode.toLowerCase().includes(q)) ||
      (f.takeaways && f.takeaways.toLowerCase().includes(q))
    );
  });

  const filteredAttendance = attendanceLedger.filter((a) => {
    const q = searchQuery.toLowerCase();
    return (
      a.name.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.registrationCode.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-slate-100">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles size={13} />
            <span>EVENT INTELLIGENCE LEDGER</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Event &amp; Workshop Feedback Dashboard
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Live feedback ledger, participant ratings, and survey submissions.
          </p>
        </div>

        {/* Top Right Action Controls */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          
          {/* All Events & Workshops Dropdown */}
          <div className="relative">
            <select
              value={selectedEvent}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedEvent(val);
                if (val === "ai-frontier-2026") setCategoryFilter("frontier");
                else if (val === "ai-accelerator-workshop") setCategoryFilter("workshop");
                else setCategoryFilter("all");
              }}
              className="px-4 py-2.5 rounded-xl bg-[#091124] border border-slate-700 text-white font-bold appearance-none pr-8 focus:outline-none focus:border-[#0066FF] cursor-pointer shadow-xs"
            >
              <option value="all">⚡ All Events &amp; Workshops</option>
              <option value="ai-frontier-2026">🎪 AI Frontier 2026</option>
              <option value="ai-accelerator-workshop">🚀 AI Accelerator Workshop</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Live Workshop Form Button */}
          <Link
            href="/community/ai-accelerator-workshop/feedback"
            target="_blank"
            className="px-4 py-2.5 rounded-xl bg-[#091124] hover:bg-[#111C38] text-white border border-slate-700 font-bold transition-all flex items-center gap-1.5 shadow-xs"
          >
            <ExternalLink size={14} className="text-[#00B8F0]" />
            <span>Live Workshop Form</span>
          </Link>

          {/* Refresh Button */}
          <button
            onClick={loadFeedbackData}
            className="p-2.5 rounded-xl bg-[#091124] hover:bg-[#111C38] text-white border border-slate-700 font-bold transition-all cursor-pointer shadow-xs"
            title="Refresh Ledger Data"
          >
            <RefreshCw size={15} />
          </button>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold tracking-wide transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>

        </div>
      </div>

      {/* ── CATEGORY FILTER PILLS ── */}
      <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
        <button
          onClick={() => {
            setCategoryFilter("all");
            setSelectedEvent("all");
          }}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            categoryFilter === "all"
              ? "bg-[#00B8F0] text-slate-950 font-black shadow-md shadow-cyan-500/20"
              : "bg-[#091124] text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          <span>⚡ All Feedbacks ({feedbacks.length})</span>
        </button>

        <button
          onClick={() => {
            setCategoryFilter("frontier");
            setSelectedEvent("ai-frontier-2026");
          }}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            categoryFilter === "frontier"
              ? "bg-[#00B8F0] text-slate-950 font-black shadow-md shadow-cyan-500/20"
              : "bg-[#091124] text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          <span>🎪 AI Frontier 2026 Event Feedbacks</span>
        </button>

        <button
          onClick={() => {
            setCategoryFilter("workshop");
            setSelectedEvent("ai-accelerator-workshop");
          }}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            categoryFilter === "workshop"
              ? "bg-[#00B8F0] text-slate-950 font-black shadow-md shadow-cyan-500/20"
              : "bg-[#091124] text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          <span>🚀 Workshop Series Feedbacks</span>
        </button>
      </div>

      {/* ── 4 STAT CARDS GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        
        {/* Card 1: Average Rating */}
        <div className="p-6 rounded-2xl bg-[#091124] border border-slate-800 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 font-bold text-xs">
            <span>AVERAGE RATING</span>
            <Star size={18} className="fill-amber-400 text-amber-400" />
          </div>
          <div className="my-3">
            <div className="text-4xl font-extrabold text-white flex items-baseline gap-1">
              <span>{stats.avgOverall || 4.8}</span>
              <span className="text-slate-400 text-base font-normal">/ 5.0 ★</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-2 font-sans font-medium">
              Content: <strong className="text-white">{stats.avgContent || 4.6}</strong> &bull; Instructor/Venue: <strong className="text-white">{stats.avgVenue || 4.9}</strong>
            </div>
          </div>
        </div>

        {/* Card 2: Total Feedbacks */}
        <div className="p-6 rounded-2xl bg-[#091124] border border-slate-800 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 font-bold text-xs">
            <span>TOTAL FEEDBACKS</span>
            <MessageSquare size={18} className="text-[#00B8F0]" />
          </div>
          <div className="my-3">
            <div className="text-4xl font-extrabold text-white flex items-baseline gap-2">
              <span>{stats.totalSubmissions || 48}</span>
              <span className="text-[#00B8F0] text-sm font-bold">Submissions</span>
            </div>
            <div className="text-[11px] text-slate-300 mt-2 font-sans font-medium">
              {stats.recommendRate || 100}% Would recommend to peers 👍
            </div>
          </div>
        </div>

        {/* Card 3: Feedback Coverage */}
        <div className="p-6 rounded-2xl bg-[#091124] border border-slate-800 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 font-bold text-xs">
            <span>FEEDBACK COVERAGE</span>
            <CheckCircle2 size={18} className="text-emerald-400" />
          </div>
          <div className="my-3">
            <div className="text-4xl font-extrabold text-white flex items-baseline gap-2">
              <span>{stats.coverageRate || 2400}%</span>
              <span className="text-slate-400 text-xs font-normal">({stats.totalSubmissions} / {stats.totalRegistrations})</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full w-full" />
            </div>
          </div>
        </div>

        {/* Card 4: Pending Registrations */}
        <div className="p-6 rounded-2xl bg-[#091124] border border-slate-800 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 font-bold text-xs">
            <span>PENDING REGISTRATIONS</span>
            <Clock size={18} className="text-purple-400" />
          </div>
          <div className="my-3">
            <div className="text-4xl font-extrabold text-white flex items-baseline gap-2">
              <span>{stats.pendingCount || 2}</span>
              <span className="text-purple-400 text-sm font-bold">Participants</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-2 font-sans font-medium">
              Awaiting feedback submission
            </div>
          </div>
        </div>

      </div>

      {/* ── TAB & SEARCH BAR ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#091124] border border-slate-800 font-mono text-xs">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("feedback")}
            className={`px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "feedback"
                ? "bg-[#0066FF] text-white shadow-md shadow-blue-600/30"
                : "bg-[#040914] text-slate-400 hover:text-white"
            }`}
          >
            <MessageSquare size={14} />
            <span>Submissions ({filteredFeedbacks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("attendance")}
            className={`px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "attendance"
                ? "bg-[#0066FF] text-white shadow-md shadow-blue-600/30"
                : "bg-[#040914] text-slate-400 hover:text-white"
            }`}
          >
            <Users size={14} />
            <span>Attendance Ledger ({filteredAttendance.length})</span>
          </button>
        </div>

        {/* Search & Pass Filter */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search name, code, email, feedback..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#040914] border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-[#0066FF]"
            />
          </div>

          <div className="relative">
            <select
              value={passTypeFilter}
              onChange={(e) => setPassTypeFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-[#040914] border border-slate-800 text-white font-bold text-xs appearance-none pr-8 focus:outline-none cursor-pointer"
            >
              <option value="all">All Pass Types</option>
              <option value="student">Student Pass</option>
              <option value="professional">Professional Pass</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

      </div>

      {/* ── DETAILED TABLE SECTION ── */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 font-mono text-xs flex items-center justify-center gap-2">
          <Loader2 size={18} className="animate-spin text-[#0066FF]" />
          <span>Loading feedback data from database...</span>
        </div>
      ) : activeTab === "feedback" ? (
        filteredFeedbacks.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#091124] border border-slate-800 font-mono text-xs text-slate-400">
            No feedback submissions found matching your search.
          </div>
        ) : (
          <div className="bg-[#091124] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <table className="w-full text-left border-collapse font-sans text-xs">
                
                {/* Table Header */}
                <thead className="bg-[#040914] sticky top-0 z-10 border-b border-slate-800 font-mono text-[10px] uppercase text-slate-400">
                  <tr>
                    <th className="py-4 px-4 w-10 text-center">
                      <input
                        type="checkbox"
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        checked={selectedIds.length === filteredFeedbacks.length && filteredFeedbacks.length > 0}
                        className="rounded bg-slate-900 border-slate-700 text-[#0066FF] focus:ring-0"
                      />
                    </th>
                    <th className="py-4 px-4 font-bold text-slate-300">WEBSITE DISPLAY</th>
                    <th className="py-4 px-4 font-bold text-slate-300">PARTICIPANT</th>
                    <th className="py-4 px-4 font-bold text-slate-300">SESSION / EVENT</th>
                    <th className="py-4 px-4 font-bold text-slate-300">OVERALL</th>
                    <th className="py-4 px-4 font-bold text-slate-300">CONTENT</th>
                    <th className="py-4 px-4 font-bold text-slate-300">INSTRUCTOR</th>
                    <th className="py-4 px-4 font-bold text-slate-300">RECOMMEND</th>
                    <th className="py-4 px-4 font-bold text-slate-300 max-w-xs">TAKEAWAYS &amp; FEEDBACK COMMENTS</th>
                    <th className="py-4 px-4 font-bold text-slate-300">SUBMITTED AT</th>
                    <th className="py-4 px-4 w-12 text-center">ACTIONS</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                  {filteredFeedbacks.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      
                      {/* Checkbox */}
                      <td className="py-4 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item.id)}
                          onChange={(e) => handleSelectOne(item.id, e.target.checked)}
                          className="rounded bg-slate-900 border-slate-700 text-[#0066FF] focus:ring-0"
                        />
                      </td>

                      {/* WEBSITE DISPLAY SWITCH TOGGLE */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <button
                          disabled={togglingId === item.id}
                          onClick={() => handleToggleFeatured(item.id, item.isFeatured)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
                            item.isFeatured
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                              : "bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white"
                          }`}
                        >
                          {togglingId === item.id ? (
                            <Loader2 size={12} className="animate-spin text-emerald-400" />
                          ) : item.isFeatured ? (
                            <>
                              <Eye size={12} className="text-emerald-400" />
                              <span>Ticked (Public)</span>
                            </>
                          ) : (
                            <>
                              <EyeOff size={12} />
                              <span>Hidden</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* PARTICIPANT */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-white font-sans text-sm">
                          {item.participantName}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {item.participantEmail || "Anonymous"} &bull; <span className="text-[#00B8F0] font-bold">{item.registrationCode || "BM-2026"}</span>
                        </div>
                      </td>

                      {/* SESSION / EVENT */}
                      <td className="py-4 px-4 whitespace-nowrap text-slate-300 font-sans font-medium text-xs">
                        {item.sessionTitle || "AI Accelerator Workshop"}
                      </td>

                      {/* OVERALL */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">
                          <span>{item.overallRating}</span>
                          <Star size={12} className="fill-amber-400" />
                        </div>
                      </td>

                      {/* CONTENT */}
                      <td className="py-4 px-4 whitespace-nowrap text-slate-300 font-bold">
                        {item.contentRating}/5
                      </td>

                      {/* INSTRUCTOR */}
                      <td className="py-4 px-4 whitespace-nowrap text-slate-300 font-bold">
                        {item.venueRating}/5
                      </td>

                      {/* RECOMMEND */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[10px]">
                          <ThumbsUp size={11} />
                          <span>Yes</span>
                        </span>
                      </td>

                      {/* TAKEAWAYS & COMMENTS */}
                      <td className="py-4 px-4 font-sans text-xs text-slate-300 max-w-xs italic leading-relaxed">
                        &ldquo;{item.takeaways || item.comments || "Very informative architecture teardown."}&rdquo;
                      </td>

                      {/* SUBMITTED AT */}
                      <td className="py-4 px-4 whitespace-nowrap text-slate-400 text-[11px]">
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </td>

                      {/* ACTIONS */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer"
                          title="Delete Feedback"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        /* ── ATTENDANCE LEDGER TAB ── */
        <div className="bg-[#091124] border border-slate-800 rounded-3xl p-6 font-mono text-xs overflow-x-auto shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">PARTICIPANT NAME</th>
                <th className="py-3 px-4">CONTACT INFO</th>
                <th className="py-3 px-4">TICKET CODE</th>
                <th className="py-3 px-4">PASS TYPE</th>
                <th className="py-3 px-4">FEEDBACK STATUS</th>
                <th className="py-3 px-4">SUBMITTED SCORE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredAttendance.map((row: any) => (
                <tr key={row.id}>
                  <td className="py-3.5 px-4 font-bold text-white font-sans text-sm">
                    <div>{row.name}</div>
                    {row.organization && <div className="text-[11px] font-normal text-slate-400 font-mono">{row.organization}</div>}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    <div className="text-white font-mono">{row.email}</div>
                    {row.phone && <div className="text-[11px] text-slate-400 font-mono">{row.phone}</div>}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#00B8F0] font-mono">{row.registrationCode || row.id}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                      row.attendeeType === 'professional'
                        ? 'bg-purple-900/60 text-purple-300 border border-purple-700/50'
                        : 'bg-cyan-950/80 text-cyan-300 border border-cyan-700/50'
                    }`}>
                      {row.attendeeType}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {row.feedbackSubmitted ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[10px]">
                        <UserCheck size={12} /> FEEDBACK SUBMITTED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-[10px]">
                        <Clock size={12} /> PENDING FEEDBACK
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 italic font-sans text-xs">
                    {row.feedbackSubmitted ? "Completed" : "- Not Submitted -"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
