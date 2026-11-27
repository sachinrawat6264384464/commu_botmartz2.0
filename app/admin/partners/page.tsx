"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search, Trash2, Edit3, RefreshCw, X } from "lucide-react";

interface PartnerRecord {
  id: string;
  organizationName: string;
  contactName: string;
  email: string;
  phone: string;
  organizationType: string;
  partnershipTrack: string;
  cohortOrBudget: string;
  proposal: string;
  websiteOrLinkedin: string;
  status: "Pending" | "In Review" | "Approved" | "Active Partner" | "Archived";
  adminNotes: string;
  createdAt: string;
  updatedAt: string;
}

const STATUS_OPTIONS: PartnerRecord["status"][] = [
  "Pending",
  "In Review",
  "Approved",
  "Active Partner",
  "Archived",
];

const TRACK_OPTIONS = [
  "Campus Tie-Up",
  "Faculty & Teacher Training",
  "Hiring Builders",
  "Sponsor Hackathon",
  "Co-Host Workshop",
  "Enterprise AI R&D",
  "Other",
];

const ORG_TYPE_OPTIONS = [
  "College / University",
  "Startup / Tech Company",
  "Hiring Partner",
  "Sponsor / Community",
  "Mentor / Speaker",
];

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<PartnerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);

  // Create / Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    organizationName: "",
    contactName: "",
    email: "",
    phone: "",
    organizationType: "Startup / Tech Company",
    partnershipTrack: "Campus Tie-Up",
    cohortOrBudget: "",
    websiteOrLinkedin: "",
    proposal: "",
    status: "Pending" as PartnerRecord["status"],
    adminNotes: "",
  });

  const showMsg = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/partners", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.partners)) {
        setPartners(data.partners);
      }
    } catch (e) {
      showMsg("Failed to fetch partners", "err");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const filtered = useMemo(() => {
    return partners.filter((p) => {
      if (statusFilter !== "All" && p.status !== statusFilter) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        p.organizationName.toLowerCase().includes(q) ||
        p.contactName.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.partnershipTrack.toLowerCase().includes(q) ||
        p.proposal.toLowerCase().includes(q)
      );
    });
  }, [partners, search, statusFilter]);

  const openCreateModal = () => {
    setEditingId(null);
    setForm({
      organizationName: "",
      contactName: "",
      email: "",
      phone: "",
      organizationType: "Startup / Tech Company",
      partnershipTrack: "Campus Tie-Up",
      cohortOrBudget: "",
      websiteOrLinkedin: "",
      proposal: "",
      status: "Pending",
      adminNotes: "",
    });
    setModalOpen(true);
  };

  const openEditModal = (item: PartnerRecord) => {
    setEditingId(item.id);
    setForm({
      organizationName: item.organizationName,
      contactName: item.contactName,
      email: item.email,
      phone: item.phone || "",
      organizationType: item.organizationType,
      partnershipTrack: item.partnershipTrack,
      cohortOrBudget: item.cohortOrBudget || "",
      websiteOrLinkedin: item.websiteOrLinkedin || "",
      proposal: item.proposal,
      status: item.status,
      adminNotes: item.adminNotes || "",
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editingId ? "PATCH" : "POST";
      const payload = editingId ? { id: editingId, ...form } : form;
      const res = await fetch("/api/partners", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Save failed");
      }
      showMsg(editingId ? "Partner record updated!" : "New partner record created!");
      setModalOpen(false);
      await fetchPartners();
    } catch (err: any) {
      showMsg(err.message || "Error saving record", "err");
    } finally {
      setSaving(false);
    }
  };

  const handleQuickStatus = async (id: string, nextStatus: PartnerRecord["status"]) => {
    try {
      const res = await fetch("/api/partners", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setPartners((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: nextStatus } : p))
        );
        showMsg(`Status updated to ${nextStatus}`);
      }
    } catch {
      showMsg("Failed to update status", "err");
    }
  };

  const handleDelete = async (id: string, orgName: string) => {
    if (!confirm(`Delete partnership inquiry from "${orgName}"?`)) return;
    try {
      const res = await fetch(`/api/partners?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setPartners((prev) => prev.filter((p) => p.id !== id));
        showMsg("Partner inquiry deleted.");
      }
    } catch {
      showMsg("Failed to delete record", "err");
    }
  };

  const counts = {
    total: partners.length,
    pending: partners.filter((p) => p.status === "Pending").length,
    inReview: partners.filter((p) => p.status === "In Review").length,
    active: partners.filter((p) => p.status === "Approved" || p.status === "Active Partner").length,
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 font-sans text-slate-900">
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl text-sm font-bold shadow-xl ${
            toast.type === "ok"
              ? "bg-[#162774] text-[#D9F83B]"
              : "bg-rose-600 text-white"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-[#F4F6FB] border border-slate-200 text-[#162774] text-xs font-extrabold uppercase tracking-wider mb-2">
            Partnership Pipeline &bull; Firestore: partner_inquiries
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#162774] tracking-tight">
            Partners &amp; Tie-Up Proposals (CRUD)
          </h1>
          <p className="text-sm font-medium text-slate-600 mt-1">
            Review, approve, edit, or delete college MoUs, hiring partners, hackathon sponsors &amp; workshop proposals.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={fetchPartners}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-[#162774] text-[#162774] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="px-5 py-2.5 rounded-xl bg-[#162774] hover:bg-[#0d1952] text-[#D9F83B] text-xs sm:text-sm font-extrabold flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Plus size={16} />
            <span>Add Partner</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Proposals", value: counts.total },
          { label: "Pending Review", value: counts.pending },
          { label: "In Review", value: counts.inReview },
          { label: "Approved / Active", value: counts.active },
        ].map((stat, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-white border border-slate-200 border-l-4 border-l-[#162774] shadow-xs"
          >
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {stat.label}
            </div>
            <div className="text-2xl font-extrabold text-[#162774] mt-1">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search organization, contact, email, or track..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F4F6FB] border border-slate-200 text-sm font-semibold focus:bg-white focus:outline-none focus:border-[#162774]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {["All", ...STATUS_OPTIONS].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                statusFilter === st
                  ? "bg-[#162774] text-[#D9F83B] border-[#162774]"
                  : "bg-[#F4F6FB] text-slate-700 border-slate-200 hover:border-[#162774]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="p-12 text-center text-sm font-semibold text-slate-500 bg-white rounded-2xl border border-slate-200">
          Loading partnership inquiries...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
          <div className="text-lg font-extrabold text-[#162774]">No Partner Inquiries Found</div>
          <p className="text-sm font-medium text-slate-500">
            Proposals submitted on <code className="text-[#162774] font-bold">/partner</code> or created here will appear in this table.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#162774] text-[#D9F83B] text-xs font-extrabold">
                    {item.partnershipTrack}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#F4F6FB] border border-slate-200 text-[#162774] text-xs font-bold">
                    {item.organizationType}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-[#162774]">
                  {item.organizationName}{" "}
                  <span className="text-sm font-semibold text-slate-500">
                    &mdash; {item.contactName} ({item.email}
                    {item.phone ? ` • ${item.phone}` : ""})
                  </span>
                </h3>

                <p className="text-sm font-medium text-slate-700 leading-relaxed">
                  {item.proposal}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 pt-1">
                  {item.cohortOrBudget && <span>Scale / Budget: {item.cohortOrBudget}</span>}
                  {item.websiteOrLinkedin && (
                    <a
                      href={item.websiteOrLinkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#162774] underline"
                    >
                      Website / LinkedIn
                    </a>
                  )}
                  {item.adminNotes && (
                    <span className="text-emerald-700 font-bold">
                      Admin Note: {item.adminNotes}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap lg:flex-col items-center lg:items-end gap-2.5 shrink-0">
                <select
                  value={item.status}
                  onChange={(e) =>
                    handleQuickStatus(item.id, e.target.value as PartnerRecord["status"])
                  }
                  className="px-3.5 py-2 rounded-xl bg-[#F4F6FB] border border-slate-200 text-xs font-extrabold text-[#162774] cursor-pointer"
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(item)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-[#162774] text-slate-800 hover:text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Edit3 size={13} />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.organizationName)}
                    className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-xl font-extrabold text-[#162774]">
                {editingId ? "Edit Partner Inquiry" : "Add New Partner"}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-[#162774] uppercase mb-1">
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.organizationName}
                    onChange={(e) => setForm({ ...form, organizationName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F6FB] border border-slate-200 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-[#162774] uppercase mb-1">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.contactName}
                    onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F6FB] border border-slate-200 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-[#162774] uppercase mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F6FB] border border-slate-200 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-[#162774] uppercase mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F6FB] border border-slate-200 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-[#162774] uppercase mb-1">
                    Organization Type
                  </label>
                  <select
                    value={form.organizationType}
                    onChange={(e) => setForm({ ...form, organizationType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F6FB] border border-slate-200 text-sm font-semibold"
                  >
                    {ORG_TYPE_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-[#162774] uppercase mb-1">
                    Partnership Track
                  </label>
                  <select
                    value={form.partnershipTrack}
                    onChange={(e) => setForm({ ...form, partnershipTrack: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F6FB] border border-slate-200 text-sm font-semibold"
                  >
                    {TRACK_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-[#162774] uppercase mb-1">
                    Scale / Budget
                  </label>
                  <input
                    type="text"
                    value={form.cohortOrBudget}
                    onChange={(e) => setForm({ ...form, cohortOrBudget: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F6FB] border border-slate-200 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-[#162774] uppercase mb-1">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value as PartnerRecord["status"] })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F6FB] border border-slate-200 text-sm font-semibold"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#162774] uppercase mb-1">
                  Website / LinkedIn
                </label>
                <input
                  type="text"
                  value={form.websiteOrLinkedin}
                  onChange={(e) => setForm({ ...form, websiteOrLinkedin: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F6FB] border border-slate-200 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#162774] uppercase mb-1">
                  Proposal / Offer Details *
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.proposal}
                  onChange={(e) => setForm({ ...form, proposal: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F6FB] border border-slate-200 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#162774] uppercase mb-1">
                  Internal Admin Notes
                </label>
                <textarea
                  rows={2}
                  value={form.adminNotes}
                  onChange={(e) => setForm({ ...form, adminNotes: e.target.value })}
                  placeholder="Call scheduled, MoU sent, next follow-up..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F6FB] border border-slate-200 text-sm font-semibold"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#162774] text-[#D9F83B] text-sm font-extrabold cursor-pointer disabled:opacity-60"
                >
                  {saving ? "Saving..." : editingId ? "Update Record" : "Create Partner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
