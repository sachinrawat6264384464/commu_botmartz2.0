"use client";

import React, { useState } from "react";
import {
  Search,
  Download,
  Mail,
  Phone,
  Building2,
  Calendar,
  CheckCircle2,
  Tag,
  Clock,
  Sparkles,
  Trash2,
  ShieldAlert,
  RefreshCw,
  XCircle
} from "lucide-react";

interface Registration {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  collegeOrCompany?: string;
  experienceLevel?: string;
  track?: string;
  amount?: number;
  paymentId?: string;
  orderId?: string;
  checkInCode?: string;
  invoiceNumber?: string;
  status?: string;
  paymentMethod?: string;
  createdAt?: string;
}

export default function WorkshopsClientTable({ registrations: initialRegistrations }: { registrations: Registration[] }) {
  const [registrations, setRegistrations] = useState<Registration[]>(initialRegistrations);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTrack, setFilterTrack] = useState("ALL");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Registration | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  React.useEffect(() => {
    setRegistrations(initialRegistrations);
  }, [initialRegistrations]);

  const filtered = registrations.filter((r) => {
    const matchQuery =
      (r.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.phone || "").includes(searchTerm) ||
      (r.checkInCode || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.collegeOrCompany || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchTrack =
      filterTrack === "ALL" ||
      (filterTrack === "PAID" && r.status === "PAID") ||
      (filterTrack === "FREE" && r.status !== "PAID");

    return matchQuery && matchTrack;
  });

  const handleDelete = async (reg: Registration) => {
    setDeletingId(reg.id);
    try {
      const res = await fetch("/api/admin/payments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: reg.id,
          source: "workshop_registrations",
          paymentId: reg.paymentId,
          orderId: reg.orderId,
          cascade: true
        })
      });

      const data = await res.json();
      if (data.success) {
        setRegistrations((prev) => prev.filter((r) => r.id !== reg.id));
        setFeedbackMsg({
          type: "success",
          text: `Registration for ${reg.name || reg.email} deleted successfully.`
        });
      } else {
        setFeedbackMsg({
          type: "error",
          text: data.error || "Failed to delete registration."
        });
      }
    } catch (e: any) {
      setFeedbackMsg({
        type: "error",
        text: "Network error while deleting registration."
      });
    } finally {
      setDeletingId(null);
      setDeleteTarget(null);
      setTimeout(() => setFeedbackMsg(null), 4000);
    }
  };

  const exportToCSV = () => {
    if (registrations.length === 0) {
      alert("No attendee registrations available to export.");
      return;
    }

    const headers = [
      "Name",
      "Email",
      "Phone",
      "College/Company",
      "Track",
      "Amount",
      "Status",
      "Payment ID",
      "Order ID",
      "CheckIn Code",
      "Invoice Number",
      "Registration Date"
    ];

    const rows = filtered.map((r) => [
      `"${r.name || ""}"`,
      `"${r.email || ""}"`,
      `"${r.phone || ""}"`,
      `"${r.collegeOrCompany || ""}"`,
      `"${r.track || ""}"`,
      r.amount || 0,
      `"${r.status || "PAID"}"`,
      `"${r.paymentId || ""}"`,
      `"${r.orderId || ""}"`,
      `"${r.checkInCode || ""}"`,
      `"${r.invoiceNumber || ""}"`,
      `"${r.createdAt ? new Date(r.createdAt).toLocaleString() : ""}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `botmartz_workshop_attendees_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Feedback Toast */}
      {feedbackMsg && (
        <div
          className={`p-4 rounded-2xl text-xs font-mono font-semibold flex items-center justify-between shadow-xs transition-all ${
            feedbackMsg.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMsg.type === "success" ? (
              <CheckCircle2 size={16} className="text-emerald-600" />
            ) : (
              <XCircle size={16} className="text-rose-600" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMsg(null)}
            className="text-slate-400 hover:text-slate-600 cursor-pointer font-bold px-2"
          >
            &times;
          </button>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
        {/* Controls Bar */}
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, phone, code..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
            />
          </div>

          {/* Filters & Export */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={filterTrack}
              onChange={(e) => setFilterTrack(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0066FF]"
            >
              <option value="ALL">All Passes ({registrations.length})</option>
              <option value="PAID">Paid Only</option>
              <option value="FREE">Free Tier</option>
            </select>

            <button
              onClick={exportToCSV}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
          </div>

        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500 uppercase font-bold tracking-wider">
                <th className="py-3.5 px-6">Attendee</th>
                <th className="py-3.5 px-6">Track &amp; Amount</th>
                <th className="py-3.5 px-6">Check-in Code</th>
                <th className="py-3.5 px-6">Payment Telemetry</th>
                <th className="py-3.5 px-6">Registered At</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-mono">
                    No workshop registrations found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Attendee */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 font-sans text-sm">{r.name || "Anonymous Builder"}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Mail size={11} className="text-slate-400" />
                        <span>{r.email}</span>
                      </div>
                      {r.phone && (
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Phone size={11} className="text-slate-400" />
                          <span>{r.phone}</span>
                        </div>
                      )}
                      {r.collegeOrCompany && (
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Building2 size={10} />
                          <span>{r.collegeOrCompany}</span>
                        </div>
                      )}
                    </td>

                    {/* Track & Amount */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 line-clamp-1">{r.track || "AI Engineering Workshop"}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-[#0066FF] text-sm">₹{r.amount || 0}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.status === "PAID" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-600"
                        }`}>
                          {r.status || "PAID"}
                        </span>
                      </div>
                    </td>

                    {/* Check-in Code */}
                    <td className="py-4 px-6">
                      <div className="inline-block px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 font-bold text-xs tracking-wider">
                        {r.checkInCode || "WS-AUTO"}
                      </div>
                      {r.invoiceNumber && (
                        <div className="text-[10px] text-slate-400 mt-1">{r.invoiceNumber}</div>
                      )}
                    </td>

                    {/* Payment Telemetry */}
                    <td className="py-4 px-6">
                      <div className="text-[11px] text-slate-700 font-bold">
                        {r.paymentId || "MANUAL"}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[140px] mt-0.5">
                        {r.orderId || "N/A"}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {r.paymentMethod || "Razorpay"}
                      </div>
                    </td>

                    {/* Timestamp */}
                    <td className="py-4 px-6 text-[11px] text-slate-500 whitespace-nowrap">
                      {r.createdAt ? new Date(r.createdAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short"
                      }) : "Recent"}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setDeleteTarget(r)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-rose-200"
                        title="Delete Registration"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-rose-100 shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150 font-sans">
            <div className="flex items-center gap-3 text-rose-600 pb-3 border-b border-rose-100">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <ShieldAlert size={22} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Delete Registration?</h3>
                <p className="text-xs text-slate-500 font-mono">
                  This will remove the pass and associated payment record.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Attendee:</span>
                <span className="font-bold text-slate-900">{deleteTarget.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Email:</span>
                <span className="font-bold text-slate-900">{deleteTarget.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pass Amount:</span>
                <span className="font-black text-rose-600">₹{deleteTarget.amount || 0}</span>
              </div>
              {deleteTarget.paymentId && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment ID:</span>
                  <span className="text-slate-700">{deleteTarget.paymentId}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={deletingId === deleteTarget.id}
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-mono font-bold cursor-pointer transition-all"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deletingId === deleteTarget.id}
                onClick={() => handleDelete(deleteTarget)}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-mono font-bold cursor-pointer transition-all flex items-center gap-2 shadow-md shadow-rose-600/20"
              >
                {deletingId === deleteTarget.id ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    <span>Delete Permanently</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
