"use client";

import React, { useEffect, useState } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Users,
  Download,
  Send,
  Upload,
  Loader2,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { ManagedWorkshop, WorkshopRegistration } from "@/lib/workshops";

interface AdminWorkshopItem extends ManagedWorkshop {
  registrations: WorkshopRegistration[];
  revenueCollected: number;
}

const EMPTY_FORM = {
  id: "",
  title: "",
  category: "AI Engineering",
  tagline: "",
  description: "",
  imageUrl: "",
  whatYouWillBuild: "",
  curriculum: "",
  instructor: "Soham Sharma",
  scheduleDate: "Saturday • 6:00 PM IST",
  duration: "3 Hours Live",
  mode: "Live Online + Q&A",
  price: 699,
  isPaid: true,
  seatsLimit: 100,
  joinLink: "",
  status: "UPCOMING" as ManagedWorkshop["status"],
};

export default function AdminWorkshopsPage() {
  const [workshops, setWorkshops] = useState<AdminWorkshopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

  const [attendeesWorkshop, setAttendeesWorkshop] = useState<AdminWorkshopItem | null>(null);
  const [joinLinkInput, setJoinLinkInput] = useState("");
  const [sendingJoinMail, setSendingJoinMail] = useState(false);

  const loadWorkshops = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/workshops");
      const data = await res.json();
      if (data.success) {
        setWorkshops(data.workshops || []);
      }
    } catch (err) {
      console.error("Failed to load admin workshops:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkshops();
  }, []);

  const totalRegistrations = workshops.reduce((s, w) => s + (w.registrations?.length || 0), 0);
  const totalRevenue = workshops.reduce((s, w) => s + (w.revenueCollected || 0), 0);

  const openAddModal = () => {
    setForm(EMPTY_FORM);
    setIsEditing(false);
    setFormOpen(true);
  };

  const openEditModal = (ws: AdminWorkshopItem) => {
    setForm({
      id: ws.id,
      title: ws.title,
      category: ws.category,
      tagline: ws.tagline,
      description: ws.description,
      imageUrl: ws.imageUrl,
      whatYouWillBuild: (ws.whatYouWillBuild || []).join("\n"),
      curriculum: (ws.curriculum || []).join("\n"),
      instructor: ws.instructor,
      scheduleDate: ws.scheduleDate,
      duration: ws.duration,
      mode: ws.mode,
      price: ws.price,
      isPaid: ws.isPaid,
      seatsLimit: ws.seatsLimit,
      joinLink: ws.joinLink || "",
      status: ws.status || "UPCOMING",
    });
    setIsEditing(true);
    setFormOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImg(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/cloudinary/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success && data.url) {
        setForm((prev) => ({ ...prev, imageUrl: data.url }));
        setBanner({ type: "success", text: "Image uploaded to Cloudinary!" });
      } else {
        setBanner({ type: "error", text: data.error || "Cloudinary upload failed." });
      }
    } catch {
      setBanner({ type: "error", text: "Error uploading image to Cloudinary." });
    } finally {
      setUploadingImg(false);
    }
  };

  const handleSaveWorkshop = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setBanner(null);
    try {
      const payload = {
        ...form,
        price: Number(form.price) || 0,
        seatsLimit: Number(form.seatsLimit) || 100,
        whatYouWillBuild: form.whatYouWillBuild.split("\n").map((s) => s.trim()).filter(Boolean),
        curriculum: form.curriculum.split("\n").map((s) => s.trim()).filter(Boolean),
      };
      const res = await fetch("/api/admin/workshops", {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setBanner({ type: "success", text: data.message || "Workshop saved!" });
        setFormOpen(false);
        await loadWorkshops();
      } else {
        setBanner({ type: "error", text: data.error || "Failed to save workshop." });
      }
    } catch {
      setBanner({ type: "error", text: "Network error saving workshop." });
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePaid = async (ws: AdminWorkshopItem) => {
    try {
      const res = await fetch("/api/admin/workshops", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: ws.id, isPaid: !ws.isPaid }),
      });
      const data = await res.json();
      if (data.success) {
        await loadWorkshops();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete workshop "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/workshops?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setBanner({ type: "success", text: "Workshop deleted." });
        await loadWorkshops();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportAttendeesCsv = (ws: AdminWorkshopItem) => {
    const list = ws.registrations || [];
    if (list.length === 0) return;
    const header = "ticketCode,name,email,phone,organization,experienceLevel,amountPaid,paymentId,registeredAt\n";
    const rows = list
      .map(
        (r) =>
          `"${r.ticketCode}","${r.name}","${r.email}","${r.phone}","${r.organization}","${r.experienceLevel}",${r.amountPaid},"${r.razorpayPaymentId}","${new Date(r.registeredAt).toISOString()}"`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${ws.slug || ws.id}-attendees.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSendJoinLinkEmail = async () => {
    if (!attendeesWorkshop || !joinLinkInput.trim()) return;
    setSendingJoinMail(true);
    try {
      const res = await fetch("/api/admin/workshops", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: attendeesWorkshop.id,
          action: "send_join_email",
          joinLink: joinLinkInput.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBanner({ type: "success", text: data.message });
        await loadWorkshops();
      } else {
        setBanner({ type: "error", text: data.error || "Failed to send join link." });
      }
    } catch {
      setBanner({ type: "error", text: "Error sending join link emails." });
    } finally {
      setSendingJoinMail(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="text-xs font-mono text-[#162774] uppercase font-bold tracking-wider mb-1">
            WORKSHOP CMS &amp; PER-WORKSHOP ATTENDEES
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Workshops, Cloudinary Banners &amp; Payments
          </h1>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="px-5 py-3 rounded-2xl bg-[#162774] hover:bg-[#1D3189] text-[#D9F83B] text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
        >
          <Plus size={16} /> Add New Workshop
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 border-l-4 border-l-[#162774]">
          <div className="text-xs font-bold text-slate-500">Total Workshops</div>
          <div className="text-2xl font-extrabold text-slate-950 mt-1">{workshops.length}</div>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200 border-l-4 border-l-[#D9F83B]">
          <div className="text-xs font-bold text-slate-500">Total Registrations</div>
          <div className="text-2xl font-extrabold text-[#162774] mt-1">{totalRegistrations}</div>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200 border-l-4 border-l-emerald-500">
          <div className="text-xs font-bold text-slate-500">Total Revenue Collected</div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">₹{totalRevenue.toLocaleString()}</div>
        </div>
      </div>

      {banner && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
            banner.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-rose-50 border-rose-200 text-rose-700"
          }`}
        >
          {banner.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{banner.text}</span>
        </div>
      )}

      {/* Workshops Table */}
      {loading ? (
        <div className="p-12 bg-white border border-slate-200 rounded-3xl flex items-center justify-center gap-2 text-xs font-bold text-slate-600">
          <Loader2 size={16} className="animate-spin text-[#162774]" /> Loading Workshops...
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] border-b border-slate-200">
                <tr>
                  <th className="p-4">Workshop</th>
                  <th className="p-4">Schedule</th>
                  <th className="p-4">Pricing</th>
                  <th className="p-4">Attendees Table</th>
                  <th className="p-4">Revenue</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {workshops.map((ws) => (
                  <tr key={ws.id} className="hover:bg-slate-50/60">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={ws.imageUrl || "/workshops/ws-python.png"}
                          alt={ws.title}
                          className="w-16 h-10 rounded-lg object-cover bg-[#162774] shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-950">{ws.title}</div>
                          <div className="text-[11px] text-slate-500">
                            {ws.category} &bull; {ws.instructor}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-700">
                      <div className="font-semibold">{ws.scheduleDate}</div>
                      <div className="text-[11px] text-slate-400">{ws.duration}</div>
                    </td>
                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => handleTogglePaid(ws)}
                        className={`px-3 py-1 rounded-full text-[11px] font-extrabold cursor-pointer ${
                          ws.isPaid
                            ? "bg-[#162774] text-[#D9F83B]"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {ws.isPaid ? `Paid • ₹${ws.price}` : "Free (Pay OFF)"}
                      </button>
                    </td>
                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => {
                          setAttendeesWorkshop(ws);
                          setJoinLinkInput(ws.joinLink || "");
                        }}
                        className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#162774] font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Users size={13} />
                        <span>{ws.registrations?.length || 0} Registered</span>
                      </button>
                    </td>
                    <td className="p-4 font-extrabold text-emerald-700">
                      ₹{(ws.revenueCollected || 0).toLocaleString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(ws)}
                          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(ws.id, ws.title)}
                          className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Workshop Modal */}
      {formOpen && (
        <div
          onClick={() => setFormOpen(false)}
          className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg font-extrabold text-slate-950">
                {isEditing ? "Edit Workshop" : "Add New Workshop"}
              </h2>
              <button type="button" onClick={() => setFormOpen(false)} className="p-1.5 text-slate-500 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveWorkshop} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Workshop Title *</label>
                  <input
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <input
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tagline</label>
                <input
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              {/* Cloudinary Banner Upload */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="block font-bold text-slate-700">
                  Cover Image (Cloudinary Upload or URL)
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    placeholder="https://res.cloudinary.com/..."
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200"
                  />
                  <label className="px-4 py-2 rounded-xl bg-[#162774] text-[#D9F83B] font-bold flex items-center justify-center gap-1.5 cursor-pointer shrink-0">
                    {uploadingImg ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    <span>{uploadingImg ? "Uploading..." : "Upload to Cloudinary"}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                {form.imageUrl && (
                  <img src={form.imageUrl} alt="Preview" className="h-28 w-48 object-cover rounded-xl border border-slate-200" />
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Instructor</label>
                  <input
                    value={form.instructor}
                    onChange={(e) => setForm({ ...form, instructor: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Schedule Date</label>
                  <input
                    value={form.scheduleDate}
                    onChange={(e) => setForm({ ...form, scheduleDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration</label>
                  <input
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price (INR)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
                <div className="pt-4">
                  <label className="inline-flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isPaid}
                      onChange={(e) => setForm({ ...form, isPaid: e.target.checked })}
                    />
                    <span>Paid Workshop (Razorpay ON)</span>
                  </label>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Live Join Link</label>
                  <input
                    value={form.joinLink}
                    onChange={(e) => setForm({ ...form, joinLink: e.target.value })}
                    placeholder="https://meet.google.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">What You Will Build (1 per line)</label>
                  <textarea
                    rows={4}
                    value={form.whatYouWillBuild}
                    onChange={(e) => setForm({ ...form, whatYouWillBuild: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Curriculum (1 per line)</label>
                  <textarea
                    rows={4}
                    value={form.curriculum}
                    onChange={(e) => setForm({ ...form, curriculum: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 rounded-full bg-[#162774] hover:bg-[#1D3189] text-[#D9F83B] font-extrabold text-sm cursor-pointer disabled:opacity-60"
              >
                {saving ? "Saving..." : isEditing ? "Update Workshop" : "Create Workshop"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Per-Workshop Attendees Table Modal */}
      {attendeesWorkshop && (
        <div
          onClick={() => setAttendeesWorkshop(null)}
          className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-5"
          >
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <div className="text-[11px] font-mono text-[#162774] font-bold uppercase">
                  DEDICATED WORKSHOP REGISTRATIONS TABLE
                </div>
                <h2 className="text-xl font-extrabold text-slate-950">{attendeesWorkshop.title}</h2>
                <p className="text-xs text-slate-500">
                  {attendeesWorkshop.registrations?.length || 0} Registered &bull; ₹
                  {(attendeesWorkshop.revenueCollected || 0).toLocaleString()} Collected
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleExportAttendeesCsv(attendeesWorkshop)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download size={14} /> Export CSV
                </button>
                <button
                  type="button"
                  onClick={() => setAttendeesWorkshop(null)}
                  className="p-2 rounded-xl bg-slate-100 text-slate-600 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* 1-Click Send Joining Link Email */}
            <div className="p-4 rounded-2xl bg-[#162774] text-white flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="url"
                value={joinLinkInput}
                onChange={(e) => setJoinLinkInput(e.target.value)}
                placeholder="Paste Google Meet / Zoom joining link to email all attendees..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-blue-200/60 focus:outline-none"
              />
              <button
                type="button"
                disabled={sendingJoinMail}
                onClick={handleSendJoinLinkEmail}
                className="px-4 py-2 rounded-xl bg-[#D9F83B] text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-60"
              >
                <Send size={13} />
                <span>{sendingJoinMail ? "Sending..." : "Send Joining Link Email"}</span>
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="p-3">Ticket</th>
                    <th className="p-3">Attendee</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Organization</th>
                    <th className="p-3">Payment ID</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(!attendeesWorkshop.registrations || attendeesWorkshop.registrations.length === 0) ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-400">
                        No registrations in this workshop&apos;s table yet.
                      </td>
                    </tr>
                  ) : (
                    attendeesWorkshop.registrations.map((reg) => (
                      <tr key={reg.registrationId} className="hover:bg-slate-50/50">
                        <td className="p-3 font-mono font-bold text-[#162774]">{reg.ticketCode}</td>
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{reg.name}</div>
                          <div className="text-[11px] text-slate-500">{reg.email}</div>
                        </td>
                        <td className="p-3 text-slate-700">{reg.phone || "-"}</td>
                        <td className="p-3 text-slate-600">{reg.organization}</td>
                        <td className="p-3 font-mono text-[11px] text-slate-500">{reg.razorpayPaymentId}</td>
                        <td className="p-3 text-right font-extrabold text-emerald-700">
                          {reg.amountPaid > 0 ? `₹${reg.amountPaid}` : "Free"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
