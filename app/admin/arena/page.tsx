"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Terminal,
  Trophy,
  Flame,
  Bug,
  Search,
  Download,
  Filter,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  Loader2,
  HardDrive,
  Rocket
} from "lucide-react";
import { ARENA_PROJECTS } from "@/lib/arena-projects";

export default function AdminArenaDashboardPage() {
  const [stats, setStats] = useState<any>({
    totalEnrolled: 0,
    totalLogs: 0,
    totalBugs: 0,
    gthApplicants: 0,
    totalClaims: 0,
    roleCounts: {},
  });
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [recentBugs, setRecentBugs] = useState<any[]>([]);
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"students" | "logs" | "bugs" | "gth" | "shippers">("students");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("All");

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/arena/stats");
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setEnrollments(data.enrollments || []);
        setRecentLogs(data.recentLogs || []);
        setRecentBugs(data.recentBugs || []);
        setClaims(data.recentClaims || []);
      }
    } catch (e) {
      console.error("Failed to load arena admin data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredEnrollments = enrollments.filter((e) => {
    const matchesDiff = filterDifficulty === "All" || e.difficulty === filterDifficulty;
    const matchesSearch =
      searchQuery === "" ||
      (e.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.projectTitle || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.role || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDiff && matchesSearch;
  });

  const gthEnrollments = enrollments.filter(
    (e) => e.difficulty === "Expert Tier" || e.difficulty === "Go To Hell 💀" || e.projectId === "p10" || e.projectId === "p40" || e.projectId === "p50"
  );

  const exportCSV = () => {
    if (enrollments.length === 0) return;
    const headers = ["Name", "Email", "WhatsApp", "Discord", "Role", "Project", "Difficulty", "Streak", "XP", "DPDP Consent", "Registered At"];
    const rows = enrollments.map((e) => [
      `"${e.name || ""}"`,
      `"${e.email || ""}"`,
      `"${e.whatsapp || ""}"`,
      `"${e.discord || ""}"`,
      `"${e.role || ""}"`,
      `"${e.projectTitle || ""}"`,
      `"${e.difficulty || ""}"`,
      e.streak || 0,
      e.xp || 100,
      e.dpdpConsent ? "Yes" : "No",
      `"${e.createdAt || ""}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `botmartz_arena_builders_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto font-sans text-slate-900">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0066FF] font-mono text-xs font-bold uppercase tracking-wider mb-2 border border-blue-200">
            <Flame size={14} className="text-amber-500" /> Arena Operations Control
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Builder &amp; 30-Day Internship Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Monitor real-time student registrations, daily PoW submissions, peer pentesting bugs, and GTH 1 Lakh prize finalists.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-mono font-bold flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
          <a
            href="https://drive.google.com/drive/folders/1KExMwvCxqd1rn9tgcbIFxAK0vw900CfH?usp=drive_link"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-mono font-bold flex items-center gap-2 shadow-xs"
          >
            <HardDrive size={14} />
            <span>5TB Drive ↗</span>
          </a>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-1">
            <span>Builders</span>
            <Users size={15} className="text-[#0066FF]" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.totalEnrolled}</div>
          <span className="text-[10px] font-mono text-emerald-600 font-bold">● Active Cohort</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-1">
            <span>PoW Logs</span>
            <Terminal size={15} className="text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.totalLogs}</div>
          <span className="text-[10px] font-mono text-slate-500">Commits Logged</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-1">
            <span>Bug Reports</span>
            <Bug size={15} className="text-rose-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.totalBugs}</div>
          <span className="text-[10px] font-mono text-rose-600 font-bold">● Peer Vulnerabilities</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-1">
            <span>15-Co Referrals</span>
            <Rocket size={15} className="text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.totalClaims || claims.length}</div>
          <span className="text-[10px] font-mono text-purple-600 font-bold">● 3-Project Claims</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 text-white border border-rose-600/80 shadow-md">
          <div className="flex items-center justify-between text-xs font-mono text-rose-400 mb-1">
            <span>GTH Slots</span>
            <Flame size={15} className="text-rose-500" />
          </div>
          <div className="text-2xl font-black text-white">{stats.gthApplicants} / 5</div>
          <span className="text-[10px] font-mono text-amber-400 font-bold">₹1 Lakh Pool</span>
        </div>
      </div>

      {/* Role Breakdown Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-8 shadow-xs">
        <h3 className="text-xs font-mono font-bold uppercase text-slate-500 mb-3">
          Squad Role Distribution Across Enrolled Students:
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {Object.entries(stats.roleCounts || {}).map(([role, count]) => (
            <div key={role} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-xs font-bold text-slate-900">{count as any}</div>
              <div className="text-[10px] font-mono text-slate-500 truncate">{role}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
        
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab("students")}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold cursor-pointer transition-all ${
              activeTab === "students" ? "bg-[#0066FF] text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Registered Students ({filteredEnrollments.length})
          </button>
          <button
            onClick={() => setActiveTab("shippers")}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold cursor-pointer transition-all ${
              activeTab === "shippers" ? "bg-purple-600 text-white shadow-xs" : "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200"
            }`}
          >
            15-Company Referrals ({claims.length})
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold cursor-pointer transition-all ${
              activeTab === "logs" ? "bg-[#0066FF] text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Daily PoW Logs ({recentLogs.length})
          </button>
          <button
            onClick={() => setActiveTab("bugs")}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold cursor-pointer transition-all ${
              activeTab === "bugs" ? "bg-[#0066FF] text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Pentest Bug Reports ({recentBugs.length})
          </button>
          <button
            onClick={() => setActiveTab("gth")}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold cursor-pointer transition-all ${
              activeTab === "gth" ? "bg-slate-950 text-purple-300 border border-purple-600 shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Expert Tier Finalists ({gthEnrollments.length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Search student, email, project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
          />
        </div>

      </div>

      {/* Tab 1: Registered Students Table */}
      {activeTab === "students" && (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
                  <th className="py-3.5 px-4">Student &amp; Contacts</th>
                  <th className="py-3.5 px-4">Project &amp; Track</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Mode</th>
                  <th className="py-3.5 px-4">Streak</th>
                  <th className="py-3.5 px-4">DPDP Consent</th>
                  <th className="py-3.5 px-4">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 font-mono">
                      Loading arena builders data...
                    </td>
                  </tr>
                ) : filteredEnrollments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 font-mono">
                      No matching students found.
                    </td>
                  </tr>
                ) : (
                  filteredEnrollments.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{student.name}</div>
                        <div className="text-[11px] text-slate-500">{student.email}</div>
                        <div className="text-[10px] text-[#0066FF] font-semibold">WA: {student.whatsapp}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800 line-clamp-1">{student.projectTitle}</div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-[#0066FF] font-bold">
                          {student.difficulty}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-700">
                        {student.role}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {student.teamType === "Squad" ? `Squad (${student.teamName})` : "Solo"}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 font-bold">
                          🔥 {student.streak || 0}d
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-emerald-600 font-bold">✓ Verified</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : "Active"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Shippers 15-Company Referrals Table */}
      {activeTab === "shippers" && (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-purple-50 border-b border-purple-200 text-purple-900 font-bold uppercase text-[11px]">
                  <th className="py-3.5 px-4">Master Shipper</th>
                  <th className="py-3.5 px-4">Target Roles &amp; Locations</th>
                  <th className="py-3.5 px-4">3 Shipped Projects</th>
                  <th className="py-3.5 px-4">Founder Notes</th>
                  <th className="py-3.5 px-4">Status &amp; Actions</th>
                  <th className="py-3.5 px-4">Claimed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {claims.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 font-mono">
                      No 3-project referral claims submitted yet.
                    </td>
                  </tr>
                ) : (
                  claims.map((claim) => (
                    <tr key={claim.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{claim.name}</div>
                        <div className="text-[11px] text-slate-500">{claim.email}</div>
                        <div className="text-[10px] text-[#0066FF] font-semibold">WA: {claim.whatsapp}</div>
                        <div className="flex items-center gap-2 mt-1">
                          {claim.linkedin && (
                            <a href={claim.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#0A66C2] hover:underline text-[10px] font-bold">
                              LinkedIn ↗
                            </a>
                          )}
                          {claim.github && (
                            <a href={claim.github} target="_blank" rel="noopener noreferrer" className="text-slate-700 hover:underline text-[10px] font-bold">
                              GitHub ↗
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{claim.preferredRoles}</div>
                        <div className="text-[11px] text-slate-500">{claim.targetLocations}</div>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs text-[11px] text-slate-600 space-y-1">
                        <div>1: {claim.project1Summary}</div>
                        <div>2: {claim.project2Summary}</div>
                        <div>3: {claim.project3Summary}</div>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs text-[11px] text-slate-500 italic">
                        {claim.notesForFounder || "—"}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-md bg-purple-100 text-purple-800 font-bold block w-fit mb-1.5">
                          {claim.status || "Under Review"}
                        </span>
                        <div className="text-[10px] text-emerald-600 font-bold">
                          ✓ 15-Company Pipeline Active
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {claim.submittedAt ? new Date(claim.submittedAt).toLocaleDateString() : "Just now"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Daily PoW Logs Table */}
      {activeTab === "logs" && (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
                  <th className="py-3.5 px-4">Student &amp; Day</th>
                  <th className="py-3.5 px-4">Project</th>
                  <th className="py-3.5 px-4">Architecture Research Notes</th>
                  <th className="py-3.5 px-4">GitHub Proof</th>
                  <th className="py-3.5 px-4">LinkedIn / Discord</th>
                  <th className="py-3.5 px-4">Logged At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 font-mono">
                      No daily standups submitted yet.
                    </td>
                  </tr>
                ) : (
                  recentLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold mr-1.5">
                          Day {log.dayNumber}
                        </span>
                        <div className="font-bold text-slate-900 mt-1">{log.studentName || log.studentEmail}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-bold">
                        {log.projectTitle}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs">
                        <p className="line-clamp-2 text-[11px]">{log.researchNotes}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <a
                          href={log.commitUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0066FF] hover:underline font-bold inline-flex items-center gap-1"
                        >
                          <span>Commit</span> <ExternalLink size={12} />
                        </a>
                      </td>
                      <td className="py-3.5 px-4 text-[11px]">
                        {log.linkedinPostUrl ? (
                          <a href={log.linkedinPostUrl} target="_blank" rel="noopener noreferrer" className="text-[#0A66C2] hover:underline block">
                            LinkedIn Post ↗
                          </a>
                        ) : <span className="text-slate-400">—</span>}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {log.submittedAt ? new Date(log.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Pentest Bug Reports Table */}
      {activeTab === "bugs" && (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
                  <th className="py-3.5 px-4">Severity &amp; Bug Title</th>
                  <th className="py-3.5 px-4">Target Project</th>
                  <th className="py-3.5 px-4">Pen-tester</th>
                  <th className="py-3.5 px-4">Repro Proof</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentBugs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 font-mono">
                      No peer penetration test bug reports logged yet.
                    </td>
                  </tr>
                ) : (
                  recentBugs.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase mr-2 ${
                            b.severity === "Critical" ? "bg-rose-100 text-rose-800" : b.severity === "High" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-[#0066FF]"
                          }`}
                        >
                          {b.severity}
                        </span>
                        <span className="font-bold text-slate-900">{b.vulnerabilityTitle}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-bold">{b.targetProjectTitle}</td>
                      <td className="py-3.5 px-4 text-slate-600">{b.reporterName} ({b.reporterEmail})</td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px] max-w-xs truncate">{b.pocSteps}</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-600">{b.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: GTH 5-Slot Finalist Review Board */}
      {activeTab === "gth" && (
        <div className="bg-slate-950 text-white border-2 border-rose-600/80 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-xs font-mono text-purple-400 uppercase font-bold">Expert Tier Evaluation Board</div>
              <h3 className="text-xl font-bold text-white">Expert Tier Finalists (5 Slots Max)</h3>
            </div>
            <div className="px-4 py-2 rounded-xl bg-purple-500/20 text-purple-300 font-mono text-xs font-bold border border-purple-500/40">
              Prize: ₹1,00,000 Total Pool
            </div>
          </div>

          <div className="space-y-4">
            {gthEnrollments.length === 0 ? (
              <div className="py-8 text-center text-slate-400 font-mono text-xs">
                No applicants for the GTH extreme tier yet.
              </div>
            ) : (
              gthEnrollments.map((g, idx) => (
                <div key={g.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-bold">Slot #{idx + 1}</span>
                      <span className="text-base font-bold text-white">{g.name}</span>
                      <span className="text-slate-400 text-xs">({g.email})</span>
                    </div>
                    <div className="text-slate-400 text-[11px] mt-1">
                      Role: {g.role} • WhatsApp: {g.whatsapp} • GitHub: {g.github || "N/A"}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-500/40">
                      Under Strict Audit
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
}
