"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  RefreshCw,
  Loader2,
  X,
  CheckCircle2,
} from "lucide-react";
import { HackathonProject } from "@/lib/hackathons";

export default function AdminHackathonsPage() {
  const [activeTab, setActiveTab] = useState<"projects" | "registrations" | "submissions">("projects");
  const [projects, setProjects] = useState<HackathonProject[]>([]);
  const [registrationsByProject, setRegistrationsByProject] = useState<Record<string, any[]>>({});
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>("All");

  // Create / Edit Project Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [domain, setDomain] = useState("AI Agents & DevOps");
  const [difficulty, setDifficulty] = useState<"Intermediate" | "Hard" | "Insane">("Hard");
  const [tagline, setTagline] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [techStack, setTechStack] = useState("Next.js, TypeScript, Python, FastAPI");
  const [deliverables, setDeliverables] = useState(
    "Working GitHub repository\nLive deployed demo URL\nClean README & architecture notes"
  );
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/hackathons");
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects || []);
        setRegistrationsByProject(data.registrationsByProject || {});
        setSubmissions(data.submissions || []);
      }
    } catch (err) {
      console.error("Failed to fetch admin hackathon data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setTitle("");
    setDomain("AI Agents & DevOps");
    setDifficulty("Hard");
    setTagline("");
    setProblemStatement("");
    setTechStack("Next.js, TypeScript, Python, FastAPI");
    setDeliverables("Working GitHub repository\nLive deployed demo URL\nClean README & architecture notes");
    setIsActive(true);
    setModalOpen(true);
  };

  const openEditModal = (proj: HackathonProject) => {
    setEditingId(proj.id);
    setTitle(proj.title);
    setDomain(proj.domain);
    setDifficulty(proj.difficulty);
    setTagline(proj.tagline || "");
    setProblemStatement(proj.problemStatement || "");
    setTechStack((proj.techStack || []).join(", "));
    setDeliverables((proj.deliverables || []).join("\n"));
    setIsActive(proj.isActive !== false);
    setModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch("/api/admin/hackathons", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(editingId ? { id: editingId } : {}),
          title,
          domain,
          difficulty,
          tagline,
          problemStatement,
          techStack,
          deliverables,
          isActive,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || "Failed to save project.");
        return;
      }
      setModalOpen(false);
      await loadData();
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async (id: string, projTitle: string) => {
    if (!confirm(`Delete "${projTitle}" and its registration table?`)) return;
    await fetch(`/api/admin/hackathons?id=${encodeURIComponent(id)}&type=project`, {
      method: "DELETE",
    });
    await loadData();
  };

  const handleStatusChange = async (submissionId: string, newStatus: string) => {
    await fetch("/api/admin/hackathons", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "submission", submissionId, status: newStatus }),
    });
    await loadData();
  };

  const handleDeleteSubmission = async (id: string) => {
    if (!confirm(`Delete submission ${id}?`)) return;
    await fetch(`/api/admin/hackathons?id=${encodeURIComponent(id)}&type=submission`, {
      method: "DELETE",
    });
    await loadData();
  };

  const totalRegistrations = Object.values(registrationsByProject).reduce(
    (sum, list) => sum + list.length,
    0
  );

  return (
    <div className="p-6 sm:p-8 space-y-6 font-sans text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#1D3189]">
            Admin Command Center
          </div>
          <h1 className="text-2xl font-extrabold text-slate-950 mt-0.5">
            Online Hackathons, Registrations &amp; Submissions
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create/Edit/Delete hackathon projects, inspect per-project 24-hour Unique IDs, and review submitted GitHub &amp; live links.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={loadData}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="px-5 py-2.5 rounded-xl bg-[#1D3189] hover:bg-[#152468] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus size={15} />
            <span>Add Hackathon Project</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Total Hackathon Projects</div>
          <div className="text-2xl font-black text-slate-950 mt-1">{projects.length}</div>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Active 24h Enrollments</div>
          <div className="text-2xl font-black text-[#1D3189] mt-1">{totalRegistrations}</div>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Submitted Projects Table</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">{submissions.length}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl border border-slate-200 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab("projects")}
          className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
            activeTab === "projects" ? "bg-[#070E54] text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Manage Projects ({projects.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("registrations")}
          className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
            activeTab === "registrations" ? "bg-[#070E54] text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Per-Project Registrations ({totalRegistrations})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("submissions")}
          className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
            activeTab === "submissions" ? "bg-[#070E54] text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Submitted Projects ({submissions.length})
        </button>
      </div>

      {loading ? (
        <div className="p-12 bg-white rounded-3xl border border-slate-200 flex items-center justify-center gap-2 text-sm font-semibold text-slate-600">
          <Loader2 size={18} className="animate-spin text-[#1D3189]" />
          <span>Loading Admin Hackathon Data...</span>
        </div>
      ) : activeTab === "projects" ? (
        /* TAB 1: MANAGE PROJECTS (CREATE, EDIT, UPDATE, DELETE) */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((proj) => (
            <div key={proj.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-[#1D3189] text-[10px] font-bold uppercase">
                    {proj.domain}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    proj.isActive !== false ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"
                  }`}>
                    {proj.isActive !== false ? "Active" : "Hidden"}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-slate-950">{proj.title}</h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{proj.problemStatement}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {(proj.techStack || []).map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                <span className="font-bold text-slate-500">
                  Enrolled: {(registrationsByProject[proj.id] || []).length}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(proj)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-[#1D3189] hover:text-white text-slate-800 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Edit3 size={13} />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteProject(proj.id, proj.title)}
                    className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : activeTab === "registrations" ? (
        /* TAB 2: PER-PROJECT INDIVIDUAL REGISTRATIONS TABLES */
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-3">
            <span className="text-xs font-bold text-slate-600">Filter by Project:</span>
            <select
              value={selectedProjectFilter}
              onChange={(e) => setSelectedProjectFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
            >
              <option value="All">All Projects ({projects.length})</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>

          {projects
            .filter((p) => selectedProjectFilter === "All" || p.id === selectedProjectFilter)
            .map((proj) => {
              const regs = registrationsByProject[proj.id] || [];
              return (
                <div key={proj.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-950">{proj.title}</h3>
                      <p className="text-[11px] text-slate-500">Individual Project Table • {regs.length} Active Records</p>
                    </div>
                  </div>
                  {regs.length === 0 ? (
                    <div className="p-6 text-xs text-slate-500">No active enrollments in this project yet.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-500 uppercase text-[10px]">
                          <tr>
                            <th className="px-4 py-3">Unique Code</th>
                            <th className="px-4 py-3">Mode</th>
                            <th className="px-4 py-3">Team / Builder</th>
                            <th className="px-4 py-3">Leader Email &amp; Phone</th>
                            <th className="px-4 py-3">Members</th>
                            <th className="px-4 py-3">Fee</th>
                            <th className="px-4 py-3">Expires At</th>
                            <th className="px-4 py-3">Submitted</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {regs.map((r) => (
                            <tr key={r.uniqueCode} className="hover:bg-slate-50">
                              <td className="px-4 py-3 font-extrabold text-[#1D3189]">{r.uniqueCode}</td>
                              <td className="px-4 py-3 uppercase font-bold">{r.mode}</td>
                              <td className="px-4 py-3 font-bold text-slate-900">{r.teamName}</td>
                              <td className="px-4 py-3">
                                <div>{r.leader?.email}</div>
                                <div className="text-[10px] text-slate-500">{r.leader?.phone}</div>
                              </td>
                              <td className="px-4 py-3">
                                {(r.members || []).map((m: any, i: number) => (
                                  <div key={i} className="text-[11px]">{m.name}</div>
                                ))}
                              </td>
                              <td className="px-4 py-3 font-bold">₹{r.amountPaid}</td>
                              <td className="px-4 py-3 text-[11px] text-slate-600">
                                {new Date(r.expiresAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                              </td>
                              <td className="px-4 py-3">
                                {r.submitted ? (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">Yes</span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">Pending</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      ) : (
        /* TAB 3: SEPARATE SUBMITTED PROJECTS TABLE */
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="px-6 py-4 bg-[#070E54] text-white flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold">Submitted Hackathon Projects Table</h3>
              <p className="text-xs text-blue-200">Dedicated table containing only final submitted builds</p>
            </div>
          </div>

          {submissions.length === 0 ? (
            <div className="p-10 text-center text-xs text-slate-500">No hackathon projects submitted yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Unique ID</th>
                    <th className="px-4 py-3">Team / Builder</th>
                    <th className="px-4 py-3">Project</th>
                    <th className="px-4 py-3">Leader &amp; Members</th>
                    <th className="px-4 py-3">GitHub Link</th>
                    <th className="px-4 py-3">Deployed Link</th>
                    <th className="px-4 py-3">Submitted At</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {submissions.map((sub) => (
                    <tr key={sub.uniqueCode} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-extrabold text-[#1D3189]">{sub.uniqueCode}</td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-950">{sub.teamName}</div>
                        <div className="text-[10px] uppercase text-slate-500 font-bold">{sub.mode}</div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800 max-w-[200px]">{sub.projectTitle}</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold">{sub.leader?.email}</div>
                        <div className="text-[10px] text-slate-500">
                          {(sub.members || []).map((m: any) => m.name).join(", ")}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={sub.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#1D3189] font-bold hover:underline"
                        >
                          <span>GitHub</span>
                          <ExternalLink size={12} />
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={sub.deployedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-700 font-bold hover:underline"
                        >
                          <span>Live App</span>
                          <ExternalLink size={12} />
                        </a>
                      </td>
                      <td className="px-4 py-3 text-[11px] text-slate-600">
                        {new Date(sub.submittedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={sub.status || "Submitted"}
                          onChange={(e) => handleStatusChange(sub.uniqueCode, e.target.value)}
                          className="px-2 py-1 rounded-lg border border-slate-200 bg-white font-bold text-[11px]"
                        >
                          <option value="Submitted">Submitted</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Winner">Winner</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => handleDeleteSubmission(sub.uniqueCode)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                          title="Delete submission"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* CREATE / EDIT PROJECT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/75 backdrop-blur-sm p-4 overflow-y-auto flex items-center justify-center">
          <div className="relative w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-extrabold text-slate-950 mb-4">
              {editingId ? "Edit Hackathon Project" : "Add New Hackathon Project"}
            </h3>

            <form onSubmit={handleSaveProject} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Domain *</label>
                  <input
                    type="text"
                    required
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                  >
                    <option value="Intermediate">Intermediate</option>
                    <option value="Hard">Hard</option>
                    <option value="Insane">Insane</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Short Tagline *</label>
                <input
                  type="text"
                  required
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Problem Statement *</label>
                <textarea
                  rows={3}
                  required
                  value={problemStatement}
                  onChange={(e) => setProblemStatement(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tech Stack (Comma-separated)</label>
                <input
                  type="text"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deliverables (One per line)</label>
                <textarea
                  rows={3}
                  value={deliverables}
                  onChange={(e) => setDeliverables(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                />
              </div>

              <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                <span>Active &amp; Visible on /hackathons</span>
              </label>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 rounded-xl bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-bold text-sm cursor-pointer flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
                <span>{editingId ? "Update Hackathon Project" : "Create Hackathon Project"}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
