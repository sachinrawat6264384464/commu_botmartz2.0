"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search, Trash2, Edit3, RefreshCw, X } from "lucide-react";

interface ServiceBookingRecord {
  id: string;
  receiptId: string;
  serviceId: string;
  serviceTitle: string;
  category: string;
  amount: number;
  userName: string;
  userEmail: string;
  phone: string;
  organizationOrCollege: string;
  preferredSlot: string;
  notes: string;
  paymentId: string;
  paymentStatus: "Paid" | "Pending" | "Free";
  status: "Pending" | "Scheduled" | "Completed" | "Cancelled";
  adminNotes: string;
  createdAt: string;
}

const STATUS_OPTIONS: ServiceBookingRecord["status"][] = [
  "Pending",
  "Scheduled",
  "Completed",
  "Cancelled",
];

const SERVICE_OPTIONS = [
  { id: "jobs-placement", title: "Direct Tech Jobs & Placement Track", category: "Jobs & Placement", price: 499 },
  { id: "doubt-session", title: "1-on-1 Live Doubt Resolution Session", category: "Doubt Session", price: 199 },
  { id: "content-training", title: "Content & Hands-On AI Training", category: "Content Training", price: 999 },
  { id: "corporate-training", title: "Corporate & Engineering Team Training", category: "Corporate Training", price: 4999 },
  { id: "expert-project-review", title: "Project Review with Industry Experts", category: "Expert Review", price: 799 },
];

export default function AdminServicesPage() {
  const [bookings, setBookings] = useState<ServiceBookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    serviceId: "jobs-placement",
    serviceTitle: "Direct Tech Jobs & Placement Track",
    category: "Jobs & Placement",
    amount: 499,
    userName: "",
    userEmail: "",
    phone: "",
    organizationOrCollege: "",
    preferredSlot: "",
    notes: "",
    paymentStatus: "Paid" as ServiceBookingRecord["paymentStatus"],
    status: "Pending" as ServiceBookingRecord["status"],
    adminNotes: "",
  });

  const showMsg = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/services/bookings", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.bookings)) {
        setBookings(data.bookings);
      }
    } catch {
      showMsg("Failed to fetch service bookings", "err");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      if (statusFilter !== "All" && b.status !== statusFilter) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        b.userName.toLowerCase().includes(q) ||
        b.userEmail.toLowerCase().includes(q) ||
        b.serviceTitle.toLowerCase().includes(q) ||
        b.receiptId.toLowerCase().includes(q) ||
        (b.organizationOrCollege || "").toLowerCase().includes(q)
      );
    });
  }, [bookings, search, statusFilter]);

  const openCreateModal = () => {
    setEditingId(null);
    setForm({
      serviceId: "jobs-placement",
      serviceTitle: "Direct Tech Jobs & Placement Track",
      category: "Jobs & Placement",
      amount: 499,
      userName: "",
      userEmail: "",
      phone: "",
      organizationOrCollege: "",
      preferredSlot: "",
      notes: "",
      paymentStatus: "Paid",
      status: "Pending",
      adminNotes: "",
    });
    setModalOpen(true);
  };

  const openEditModal = (b: ServiceBookingRecord) => {
    setEditingId(b.id);
    setForm({
      serviceId: b.serviceId,
      serviceTitle: b.serviceTitle,
      category: b.category,
      amount: b.amount,
      userName: b.userName,
      userEmail: b.userEmail,
      phone: b.phone || "",
      organizationOrCollege: b.organizationOrCollege || "",
      preferredSlot: b.preferredSlot || "",
      notes: b.notes || "",
      paymentStatus: b.paymentStatus,
      status: b.status,
      adminNotes: b.adminNotes || "",
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editingId ? "PATCH" : "POST";
      const payload = editingId
        ? { id: editingId, ...form }
        : { ...form, skipEmails: true };
      const res = await fetch("/api/services/bookings", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Save failed");
      showMsg(editingId ? "Booking updated!" : "Booking created!");
      setModalOpen(false);
      await fetchBookings();
    } catch (err: any) {
      showMsg(err.message || "Error saving booking", "err");
    } finally {
      setSaving(false);
    }
  };

  const handleQuickStatus = async (id: string, nextStatus: ServiceBookingRecord["status"]) => {
    try {
      const res = await fetch("/api/services/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: nextStatus } : b))
        );
        showMsg(`Status updated to ${nextStatus}`);
      }
    } catch {
      showMsg("Failed to update status", "err");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete booking for "${name}"?`)) return;
    try {
      const res = await fetch(`/api/services/bookings?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setBookings((prev) => prev.filter((b) => b.id !== id));
        showMsg("Booking deleted.");
      }
    } catch {
      showMsg("Failed to delete booking", "err");
    }
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-[#F4F6FB] border border-slate-200 text-[#162774] text-xs font-extrabold uppercase tracking-wider mb-2">
            Firestore: service_bookings &bull; Full CRUD
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#162774] tracking-tight">
            Services, Training &amp; Review Bookings
          </h1>
          <p className="text-sm font-medium text-slate-600 mt-1">
            Track Jobs, Doubt Sessions, Content/Corporate Training &amp; Expert Project Reviews with payment receipts.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={fetchBookings}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-[#162774] text-[#162774] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="px-5 py-2.5 rounded-xl bg-[#162774] hover:bg-[#0d1952] text-[#D9F83B] text-xs sm:text-sm font-extrabold flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Booking</span>
          </button>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, receipt ID, or service..."
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

      {/* Bookings List */}
      {loading ? (
        <div className="p-12 text-center text-sm font-semibold text-slate-500 bg-white rounded-2xl border border-slate-200">
          Loading service bookings...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
          <div className="text-lg font-extrabold text-[#162774]">No Bookings Found</div>
          <p className="text-sm font-medium text-slate-500">
            Bookings made on <code className="text-[#162774] font-bold">/services</code> will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((b) => (
            <div
              key={b.id}
              className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#162774] text-[#D9F83B] text-xs font-extrabold">
                    {b.category}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#F4F6FB] border border-slate-200 text-[#162774] text-xs font-extrabold">
                    ₹{b.amount} ({b.paymentStatus})
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                    {b.receiptId}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {new Date(b.createdAt).toLocaleString()}
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-[#162774]">
                  {b.serviceTitle}{" "}
                  <span className="text-sm font-semibold text-slate-500">
                    &mdash; {b.userName} ({b.userEmail}
                    {b.phone ? ` • ${b.phone}` : ""})
                  </span>
                </h3>

                {(b.notes || b.organizationOrCollege || b.preferredSlot) && (
                  <p className="text-sm font-medium text-slate-700">
                    {b.organizationOrCollege ? `[${b.organizationOrCollege}] ` : ""}
                    {b.preferredSlot ? `Slot: ${b.preferredSlot} • ` : ""}
                    {b.notes}
                  </p>
                )}

                {b.adminNotes && (
                  <p className="text-xs font-bold text-emerald-700">
                    Admin Note: {b.adminNotes}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap lg:flex-col items-center lg:items-end gap-2.5 shrink-0">
                <select
                  value={b.status}
                  onChange={(e) =>
                    handleQuickStatus(b.id, e.target.value as ServiceBookingRecord["status"])
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
                    onClick={() => openEditModal(b)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-[#162774] text-slate-800 hover:text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 size={13} />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(b.id, b.userName)}
                    className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
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
                {editingId ? "Edit Service Booking" : "Add Service Booking"}
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
                <div className="sm:col-span-2">
                  <label className="block text-xs font-extrabold text-[#162774] uppercase mb-1">
                    Service
                  </label>
                  <select
                    value={form.serviceId}
                    onChange={(e) => {
                      const found = SERVICE_OPTIONS.find((s) => s.id === e.target.value);
                      if (found) {
                        setForm({
                          ...form,
                          serviceId: found.id,
                          serviceTitle: found.title,
                          category: found.category,
                          amount: found.price,
                        });
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F6FB] border border-slate-200 text-sm font-semibold"
                  >
                    {SERVICE_OPTIONS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title} (₹{s.price})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#162774] uppercase mb-1">
                    User Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.userName}
                    onChange={(e) => setForm({ ...form, userName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F6FB] border border-slate-200 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-[#162774] uppercase mb-1">
                    User Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.userEmail}
                    onChange={(e) => setForm({ ...form, userEmail: e.target.value })}
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
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value as ServiceBookingRecord["status"] })
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
                  User Notes / Goals
                </label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F6FB] border border-slate-200 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#162774] uppercase mb-1">
                  Admin Notes (Follow-up 1/2, Meeting Link)
                </label>
                <textarea
                  rows={2}
                  value={form.adminNotes}
                  onChange={(e) => setForm({ ...form, adminNotes: e.target.value })}
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
                  {saving ? "Saving..." : editingId ? "Update Booking" : "Create Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
