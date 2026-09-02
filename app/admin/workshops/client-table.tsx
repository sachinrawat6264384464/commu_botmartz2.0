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
  Sparkles
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

export default function WorkshopsClientTable({ registrations }: { registrations: Registration[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTrack, setFilterTrack] = useState("ALL");

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
    <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden font-sans">
      
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
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400 font-mono">
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

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
