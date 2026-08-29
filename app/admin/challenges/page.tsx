"use client";

import React, { useState, useEffect } from "react";
import { 
  Trophy, 
  Search, 
  Filter, 
  ExternalLink, 
  Github, 
  Video, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Award, 
  RefreshCw, 
  Loader2,
  Users,
  Eye,
  X,
  FileSpreadsheet,
  Edit3
} from "lucide-react";

interface ChallengeSubmission {
  id: string;
  challengeId: string;
  challengeTitle: string;
  type: string;
  teamName: string;
  teamSize: string;
  leadName: string;
  leadEmail: string;
  leadPhone: string;
  discordHandle?: string;
  githubHandle?: string;
  projectTitle?: string;
  projectPitch?: string;
  techStack?: string[];
  githubUrl?: string;
  demoUrl?: string;
  videoUrl?: string;
  status: "Submitted" | "Under Review" | "Shortlisted" | "Winner" | "Rejected";
  score?: number;
  adminNotes?: string;
  submittedAt: string;
}

export default function AdminChallengesPage() {
  const [submissions, setSubmissions] = useState<ChallengeSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChallengeFilter, setSelectedChallengeFilter] = useState("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");
  
  const [activeSubmission, setActiveSubmission] = useState<ChallengeSubmission | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/challenges/list");
      const data = await res.json();
      if (data.success) {
        setSubmissions(data.submissions || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string, newScore?: number, newNotes?: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/challenges/list", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status: newStatus,
          score: newScore,
          adminNotes: newNotes,
        }),
      });
      if (res.ok) {
        setSubmissions(prev =>
          prev.map(sub =>
            sub.id === id
              ? { ...sub, status: newStatus as any, score: newScore ?? sub.score, adminNotes: newNotes ?? sub.adminNotes }
              : sub
          )
        );
        if (activeSubmission && activeSubmission.id === id) {
          setActiveSubmission(prev => prev ? { ...prev, status: newStatus as any, score: newScore ?? prev.score, adminNotes: newNotes ?? prev.adminNotes } : null);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = submissions.filter(sub => {
    const matchesSearch = 
      (sub.teamName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.leadName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.leadEmail || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.projectTitle || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesChallenge = selectedChallengeFilter === "all" || sub.challengeId === selectedChallengeFilter;
    const matchesStatus = selectedStatusFilter === "all" || sub.status === selectedStatusFilter;

    return matchesSearch && matchesChallenge && matchesStatus;
  });

  const exportCSV = () => {
    const headers = ["ID", "Challenge", "Type", "Team Name", "Lead Name", "Email", "Phone", "Status", "Score", "GitHub URL", "Demo URL", "Submitted At"];
    const rows = filtered.map(s => [
      s.id,
      `"${s.challengeTitle}"`,
      s.type,
      `"${s.teamName}"`,
      `"${s.leadName}"`,
      s.leadEmail,
      s.leadPhone,
      s.status,
      s.score || 0,
      s.githubUrl || "",
      s.demoUrl || "",
      s.submittedAt,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `challenges_submissions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Winner": return "bg-amber-100 text-amber-800 border-amber-300 font-bold";
      case "Shortlisted": return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "Under Review": return "bg-blue-100 text-blue-800 border-blue-300";
      case "Rejected": return "bg-rose-100 text-rose-800 border-rose-300";
      default: return "bg-slate-100 text-slate-700 border-slate-300";
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="text-xs font-mono text-[#0066FF] uppercase font-bold tracking-wider mb-1 flex items-center gap-1.5">
            <Trophy size={14} /> HACKATHONS &amp; ARENA CMS
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Challenge Submissions &amp; Evaluations
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchSubmissions}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-mono font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>

          <button
            onClick={exportCSV}
            className="px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <FileSpreadsheet size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="text-xs font-mono text-slate-400 uppercase">Total Entries</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">{submissions.length}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="text-xs font-mono text-slate-400 uppercase">Shortlisted</div>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">
            {submissions.filter(s => s.status === "Shortlisted" || s.status === "Winner").length}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="text-xs font-mono text-slate-400 uppercase">Under Review</div>
          <div className="text-2xl font-bold font-mono text-blue-600 mt-1">
            {submissions.filter(s => s.status === "Under Review" || s.status === "Submitted").length}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="text-xs font-mono text-slate-400 uppercase">Active Challenges</div>
          <div className="text-2xl font-bold font-mono text-amber-600 mt-1">3 Tracks</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by team, lead name, email, or project title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedChallengeFilter}
            onChange={(e) => setSelectedChallengeFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#0066FF]"
          >
            <option value="all">All Tracks</option>
            <option value="hack-01">Multi-Agent Hackathon</option>
            <option value="chal-02">Weekly PDF Arena</option>
            <option value="hack-02">Local-First SLMs</option>
          </select>

          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#0066FF]"
          >
            <option value="all">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Winner">Winner</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 size={24} className="animate-spin text-[#0066FF]" />
            <span className="text-xs font-mono">Loading challenge submissions...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <p className="text-xs font-mono">No submissions matching current criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-mono text-[11px] text-slate-500 uppercase">
                <tr>
                  <th className="px-5 py-3.5">Team &amp; Lead</th>
                  <th className="px-5 py-3.5">Challenge Track</th>
                  <th className="px-5 py-3.5">Project / Code</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Score</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Team & Lead */}
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-900">{item.teamName || item.leadName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{item.leadName} • {item.leadEmail}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{item.leadPhone} {item.discordHandle ? `• ${item.discordHandle}` : ""}</div>
                    </td>

                    {/* Track */}
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#0066FF] border border-blue-100 font-mono text-[10px] font-bold">
                        {item.challengeTitle}
                      </span>
                      <div className="text-[10px] font-mono text-slate-400 mt-1 capitalize">
                        Type: {item.type} • {item.teamSize} member(s)
                      </div>
                    </td>

                    {/* Project & Repos */}
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-900 truncate max-w-xs">
                        {item.projectTitle || "Registration Entry"}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {item.githubUrl && (
                          <a
                            href={item.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#0066FF] hover:underline inline-flex items-center gap-1 font-mono text-[10px]"
                          >
                            <Github size={11} />
                            <span>Repo ↗</span>
                          </a>
                        )}
                        {item.demoUrl && (
                          <a
                            href={item.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 hover:underline inline-flex items-center gap-1 font-mono text-[10px]"
                          >
                            <ExternalLink size={11} />
                            <span>Demo ↗</span>
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="px-5 py-4">
                      <select
                        value={item.status}
                        onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                        disabled={updatingId === item.id}
                        className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono font-bold focus:outline-none ${getStatusColor(item.status)}`}
                      >
                        <option value="Submitted">Submitted</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Winner">Winner 👑</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>

                    {/* Score */}
                    <td className="px-5 py-4 font-mono font-bold text-slate-900">
                      {item.score !== undefined ? `${item.score}/100` : "—"}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setActiveSubmission(item)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-mono font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye size={12} />
                        <span>Inspect</span>
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Inspection Modal ── */}
      {activeSubmission && (
        <div
          onClick={() => setActiveSubmission(null)}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 mb-6">
              <div>
                <span className={`px-2.5 py-0.5 rounded border text-[10px] font-mono uppercase ${getStatusColor(activeSubmission.status)}`}>
                  {activeSubmission.status}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">
                  {activeSubmission.projectTitle || activeSubmission.teamName}
                </h3>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  Track: {activeSubmission.challengeTitle}
                </div>
              </div>
              <button
                onClick={() => setActiveSubmission(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Participant details */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 font-mono">Team:</span>
                  <div className="font-bold text-slate-900">{activeSubmission.teamName} ({activeSubmission.teamSize} member)</div>
                </div>
                <div>
                  <span className="text-slate-400 font-mono">Lead Builder:</span>
                  <div className="font-bold text-slate-900">{activeSubmission.leadName}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-mono">Email:</span>
                  <div className="font-mono text-slate-900">{activeSubmission.leadEmail}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-mono">WhatsApp:</span>
                  <div className="font-mono text-slate-900">{activeSubmission.leadPhone}</div>
                </div>
                {activeSubmission.discordHandle && (
                  <div>
                    <span className="text-slate-400 font-mono">Discord:</span>
                    <div className="font-mono text-slate-900">{activeSubmission.discordHandle}</div>
                  </div>
                )}
                <div>
                  <span className="text-slate-400 font-mono">Submitted At:</span>
                  <div className="font-mono text-slate-600">{new Date(activeSubmission.submittedAt).toLocaleString()}</div>
                </div>
              </div>

              {/* Pitch & Overview */}
              {activeSubmission.projectPitch && (
                <div>
                  <div className="font-mono text-slate-500 uppercase font-bold mb-1">Architecture &amp; System Overview</div>
                  <p className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 leading-relaxed">
                    {activeSubmission.projectPitch}
                  </p>
                </div>
              )}

              {/* Tech Stack */}
              {activeSubmission.techStack && activeSubmission.techStack.length > 0 && (
                <div>
                  <div className="font-mono text-slate-500 uppercase font-bold mb-1.5">Tech Stack</div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeSubmission.techStack.map((tech, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#0066FF] border border-blue-100 font-mono font-bold">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Resource URLs */}
              <div className="pt-2 flex flex-wrap gap-2">
                {activeSubmission.githubUrl && (
                  <a
                    href={activeSubmission.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-slate-900 text-white font-mono font-bold flex items-center gap-1.5 shadow-2xs"
                  >
                    <Github size={14} />
                    <span>Open GitHub Repository</span>
                  </a>
                )}
                {activeSubmission.demoUrl && (
                  <a
                    href={activeSubmission.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-[#0066FF] text-white font-mono font-bold flex items-center gap-1.5 shadow-2xs"
                  >
                    <ExternalLink size={14} />
                    <span>Open Live Demo</span>
                  </a>
                )}
                {activeSubmission.videoUrl && (
                  <a
                    href={activeSubmission.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-purple-600 text-white font-mono font-bold flex items-center gap-1.5 shadow-2xs"
                  >
                    <Video size={14} />
                    <span>Watch Video Walkthrough</span>
                  </a>
                )}
              </div>

              {/* Status Update & Score in Modal */}
              <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-mono font-bold mb-1">Update Status</label>
                  <select
                    value={activeSubmission.status}
                    onChange={(e) => handleUpdateStatus(activeSubmission.id, e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono font-bold"
                  >
                    <option value="Submitted">Submitted</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Winner">Winner 👑</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-mono font-bold mb-1">Score (0-100)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    placeholder="Score (e.g. 88)"
                    defaultValue={activeSubmission.score || 0}
                    onBlur={(e) => handleUpdateStatus(activeSubmission.id, activeSubmission.status, Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
