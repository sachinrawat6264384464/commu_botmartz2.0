"use client";

import React, { useState } from "react";
import {
  Search,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  FileText,
  CreditCard,
  User,
  Mail,
  Phone,
  Building2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Filter
} from "lucide-react";

export interface PaymentRecord {
  id: string;
  paymentId: string;
  orderId?: string;
  invoiceNumber?: string;
  checkInCode?: string;
  attendeeName: string;
  email: string;
  phone?: string;
  collegeOrCompany?: string;
  itemName: string;
  itemCategory: string;
  amount: number;
  currency: string;
  method: string;
  status: "PAID" | "PENDING_UTR" | "REJECTED" | "FREE" | string;
  utrNumber?: string;
  createdAt: string;
  source: string;
}

interface ClientTableProps {
  initialPayments: PaymentRecord[];
  onRefresh?: () => void;
}

export default function PaymentsClientTable({ initialPayments, onRefresh }: ClientTableProps) {
  const [payments, setPayments] = useState<PaymentRecord[]>(initialPayments);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PAID" | "PENDING_UTR" | "FREE" | "REJECTED">("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [selectedTx, setSelectedTx] = useState<PaymentRecord | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Sync if prop changes
  React.useEffect(() => {
    setPayments(initialPayments);
  }, [initialPayments]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setFeedbackMsg(null);
    try {
      const res = await fetch("/api/admin/payments");
      const data = await res.json();
      if (data.success) {
        setPayments(data.payments || []);
        if (onRefresh) onRefresh();
        setFeedbackMsg({ type: "success", text: "Latest payments successfully refreshed from database!" });
      } else {
        setFeedbackMsg({ type: "error", text: data.error || "Failed to fetch payments." });
      }
    } catch (e: any) {
      setFeedbackMsg({ type: "error", text: "Network error while refreshing payments." });
    } finally {
      setRefreshing(false);
      setTimeout(() => setFeedbackMsg(null), 4000);
    }
  };

  const handleApproveUTR = async (tx: PaymentRecord) => {
    if (!confirm(`Approve UTR payment for ${tx.attendeeName} (${tx.paymentId})?`)) return;

    setActionLoadingId(tx.id);
    try {
      const res = await fetch("/api/admin/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "APPROVE_UTR",
          id: tx.id,
          source: tx.source
        })
      });
      const data = await res.json();
      if (data.success) {
        setPayments((prev) =>
          prev.map((p) => (p.id === tx.id ? { ...p, status: "PAID" } : p))
        );
        setFeedbackMsg({ type: "success", text: `UTR approved for ${tx.attendeeName}! Pass activated.` });
      } else {
        alert(data.error || "Failed to approve UTR.");
      }
    } catch (err: any) {
      alert("Error approving UTR.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRejectUTR = async (tx: PaymentRecord) => {
    if (!confirm(`Reject UTR payment for ${tx.attendeeName} (${tx.paymentId})?`)) return;

    setActionLoadingId(tx.id);
    try {
      const res = await fetch("/api/admin/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "REJECT_UTR",
          id: tx.id,
          source: tx.source
        })
      });
      const data = await res.json();
      if (data.success) {
        setPayments((prev) =>
          prev.map((p) => (p.id === tx.id ? { ...p, status: "REJECTED" } : p))
        );
        setFeedbackMsg({ type: "success", text: `UTR marked as rejected.` });
      } else {
        alert(data.error || "Failed to reject UTR.");
      }
    } catch (err: any) {
      alert("Error rejecting UTR.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filter logic
  const filtered = payments.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      (p.paymentId || "").toLowerCase().includes(q) ||
      (p.orderId || "").toLowerCase().includes(q) ||
      (p.invoiceNumber || "").toLowerCase().includes(q) ||
      (p.attendeeName || "").toLowerCase().includes(q) ||
      (p.email || "").toLowerCase().includes(q) ||
      (p.phone || "").toLowerCase().includes(q) ||
      (p.itemName || "").toLowerCase().includes(q) ||
      (p.utrNumber || "").toLowerCase().includes(q) ||
      (p.checkInCode || "").toLowerCase().includes(q);

    const matchStatus =
      statusFilter === "ALL" ||
      (statusFilter === "PAID" && p.status === "PAID") ||
      (statusFilter === "PENDING_UTR" && p.status === "PENDING_UTR") ||
      (statusFilter === "FREE" && p.status === "FREE") ||
      (statusFilter === "REJECTED" && p.status === "REJECTED");

    const matchCategory =
      categoryFilter === "ALL" ||
      p.itemCategory === categoryFilter ||
      (categoryFilter === "WORKSHOP_PASS" && p.itemCategory === "WORKSHOP_PASS") ||
      (categoryFilter === "EVENT_TICKET" && p.itemCategory === "EVENT_TICKET");

    return matchSearch && matchStatus && matchCategory;
  });

  const exportToCSV = () => {
    if (filtered.length === 0) {
      alert("No transaction records to export.");
      return;
    }

    const headers = [
      "Payment ID / UTR",
      "Order ID",
      "Invoice Number",
      "Attendee Name",
      "Email",
      "Phone",
      "Item / Track",
      "Category",
      "Amount (INR)",
      "Status",
      "Method",
      "CheckIn Code",
      "Date Time",
      "Source Collection"
    ];

    const rows = filtered.map((p) => [
      `"${p.paymentId || ""}"`,
      `"${p.orderId || ""}"`,
      `"${p.invoiceNumber || ""}"`,
      `"${p.attendeeName || ""}"`,
      `"${p.email || ""}"`,
      `"${p.phone || ""}"`,
      `"${p.itemName || ""}"`,
      `"${p.itemCategory || ""}"`,
      p.amount || 0,
      `"${p.status || ""}"`,
      `"${p.method || ""}"`,
      `"${p.checkInCode || ""}"`,
      `"${p.createdAt ? new Date(p.createdAt).toLocaleString() : ""}"`,
      `"${p.source || ""}"`
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `botmartz_payment_ledger_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
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
            className="text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            &times;
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by Payment ID, Order ID, Invoice, Name, Email, UTR, or Workshop..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0066FF] focus:bg-white transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex-1 md:flex-none px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin text-[#0066FF]" : ""} />
              <span>{refreshing ? "Fetching..." : "Refresh Live"}</span>
            </button>

            <button
              onClick={exportToCSV}
              className="flex-1 md:flex-none px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 text-[11px] font-bold uppercase mr-1">Status:</span>
            {[
              { id: "ALL", label: `All (${payments.length})` },
              {
                id: "PAID",
                label: `Paid / Captured (${payments.filter((p) => p.status === "PAID").length})`,
                color: "text-emerald-700 bg-emerald-50 border-emerald-200"
              },
              {
                id: "PENDING_UTR",
                label: `UTR Review (${payments.filter((p) => p.status === "PENDING_UTR").length})`,
                color: "text-amber-700 bg-amber-50 border-amber-200"
              },
              {
                id: "FREE",
                label: `Free Tier (${payments.filter((p) => p.status === "FREE").length})`,
                color: "text-blue-700 bg-blue-50 border-blue-200"
              }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl border font-bold transition-all cursor-pointer ${
                  statusFilter === tab.id
                    ? "bg-[#0066FF] border-[#0066FF] text-white shadow-xs"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px] font-bold uppercase">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-bold focus:outline-none focus:border-[#0066FF]"
            >
              <option value="ALL">All Categories</option>
              <option value="WORKSHOP_PASS">Workshop Passes</option>
              <option value="EVENT_TICKET">Summit &amp; Event Tickets</option>
              <option value="ORDER">Orders &amp; Wallet Packs</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-mono uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="p-4 pl-6">Tx &amp; Order ID</th>
                <th className="p-4">Customer / Attendee</th>
                <th className="p-4">Item &amp; Category</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status &amp; Method</th>
                <th className="p-4">Date</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400 font-mono">
                    <CreditCard size={32} className="mx-auto mb-3 text-slate-300 opacity-60" />
                    <p className="font-bold text-slate-700">No matching payments found</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {searchQuery ? "Try clearing search keywords or filters" : "Transactions will appear here in real-time as users register or checkout."}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const isPendingUtr = p.status === "PENDING_UTR";
                  const isPaid = p.status === "PAID";
                  const isFree = p.status === "FREE";
                  const isRejected = p.status === "REJECTED";

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Transaction ID & Invoice */}
                      <td className="p-4 pl-6 font-mono">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{p.paymentId}</span>
                          {p.checkInCode && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-[#0066FF] rounded border border-blue-200 font-bold">
                              {p.checkInCode}
                            </span>
                          )}
                        </div>
                        {p.orderId && (
                          <div className="text-slate-400 text-[10px] truncate max-w-[180px]">
                            Ord: {p.orderId}
                          </div>
                        )}
                        {p.invoiceNumber && (
                          <div className="text-slate-500 text-[10px] font-semibold">
                            {p.invoiceNumber}
                          </div>
                        )}
                      </td>

                      {/* Attendee Info */}
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{p.attendeeName}</div>
                        <div className="text-slate-500 text-[11px] font-mono">{p.email}</div>
                        {p.phone && (
                          <div className="text-slate-400 text-[10px] font-mono">{p.phone}</div>
                        )}
                      </td>

                      {/* Item & Category */}
                      <td className="p-4">
                        <div className="font-medium text-slate-800 line-clamp-1 max-w-[220px]">
                          {p.itemName}
                        </div>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-mono font-bold uppercase">
                          {p.itemCategory}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="p-4 font-mono">
                        <div className={`font-black text-sm ${p.amount > 0 ? "text-slate-900" : "text-slate-400"}`}>
                          {p.amount > 0 ? `₹${p.amount.toLocaleString("en-IN")}` : "Free"}
                        </div>
                        <div className="text-slate-400 text-[10px] uppercase font-bold">{p.currency}</div>
                      </td>

                      {/* Status & Method */}
                      <td className="p-4">
                        <div className="mb-1">
                          {isPaid && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[10px] font-bold uppercase">
                              <CheckCircle2 size={11} className="text-emerald-600" />
                              Captured
                            </span>
                          )}
                          {isPendingUtr && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-mono text-[10px] font-bold uppercase animate-pulse">
                              <Clock size={11} className="text-amber-600" />
                              UTR Review
                            </span>
                          )}
                          {isFree && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-mono text-[10px] font-bold uppercase">
                              Free Seat
                            </span>
                          )}
                          {isRejected && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-mono text-[10px] font-bold uppercase">
                              <XCircle size={11} className="text-rose-600" />
                              Rejected
                            </span>
                          )}
                        </div>
                        <div className="text-slate-400 text-[10px] font-mono truncate max-w-[140px]">
                          {p.method}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="p-4 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        }) : "N/A"}
                        <div className="text-slate-400 text-[10px]">
                          {p.createdAt ? new Date(p.createdAt).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit"
                          }) : ""}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 pr-6 text-right">
                        {isPendingUtr ? (
                          <div className="flex items-center justify-end gap-1.5 font-mono">
                            <button
                              onClick={() => handleApproveUTR(p)}
                              disabled={actionLoadingId === p.id}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold cursor-pointer disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectUTR(p)}
                              disabled={actionLoadingId === p.id}
                              className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg text-[10px] font-bold cursor-pointer disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setSelectedTx(p)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-mono text-[11px] font-bold cursor-pointer transition-all"
                          >
                            Inspect
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-6 animate-in fade-in zoom-in-95 duration-150 font-sans">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center font-bold">
                  <FileText size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Payment Ledger Record</h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    ID: {selectedTx.paymentId}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-400">Customer Name</span>
                <span className="font-bold text-slate-900">{selectedTx.attendeeName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-400">Customer Email</span>
                <span className="font-bold text-slate-900">{selectedTx.email}</span>
              </div>
              {selectedTx.phone && (
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-400">Phone</span>
                  <span className="font-bold text-slate-900">{selectedTx.phone}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-400">Item Description</span>
                <span className="font-bold text-slate-900 text-right max-w-[240px] truncate">{selectedTx.itemName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-400">Amount Paid</span>
                <span className="font-black text-emerald-600 text-sm">
                  {selectedTx.amount > 0 ? `₹${selectedTx.amount.toLocaleString("en-IN")}` : "FREE TIER"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-400">Payment Method</span>
                <span className="font-bold text-slate-800">{selectedTx.method}</span>
              </div>
              {selectedTx.invoiceNumber && (
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-400">Invoice Number</span>
                  <span className="font-bold text-[#0066FF]">{selectedTx.invoiceNumber}</span>
                </div>
              )}
              {selectedTx.checkInCode && (
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-400">Pass Check-In Code</span>
                  <span className="font-bold text-purple-600">{selectedTx.checkInCode}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-400">Source Database</span>
                <span className="font-bold text-slate-600 uppercase text-[10px]">{selectedTx.source}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Transaction Timestamp</span>
                <span className="font-medium text-slate-700">
                  {selectedTx.createdAt ? new Date(selectedTx.createdAt).toLocaleString() : "N/A"}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedTx(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-mono font-bold cursor-pointer"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
