"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Award,
  Plus,
  Search,
  CheckCircle2,
  Download,
  Loader2,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  RefreshCw
} from "lucide-react";

export default function AdminCertificatesPage() {
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [programTitle, setProgramTitle] = useState("Botmartz Virtual Internship Playground 2026");
  const [track, setTrack] = useState("Production Engineering Systems");
  const [submitting, setSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState("");

  const loadCertificates = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/certificates");
      const data = await res.json();
      if (data.certificates && Array.isArray(data.certificates)) {
        setCerts(data.certificates);
      }
    } catch (e) {
      console.warn("Failed to load certificates:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertificates();
  }, []);

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim() || !recipientEmail.trim()) return;

    setSubmitting(true);
    setStatusMsg("");

    try {
      const res = await fetch("/api/admin/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: recipientName.trim(),
          email: recipientEmail.trim(),
          eventTitle: programTitle,
          track: track,
          issueDate: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to issue certificate.");
      }

      setStatusMsg(`Certificate ${data.certificateId} issued & persisted to Firestore!`);
      setRecipientName("");
      setRecipientEmail("");
      loadCertificates();
    } catch (err: any) {
      alert(err.message || "Failed to issue certificate.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to revoke/delete this certificate from the database?")) return;

    try {
      await fetch(`/api/admin/certificates?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      setCerts(prev => prev.filter(c => c.id !== id));
    } catch (e) {
      alert("Failed to delete certificate.");
    }
  };

  const copyVerifyLink = (certId: string) => {
    const url = `https://community.botmartz.com/certificates?query=${encodeURIComponent(certId)}`;
    navigator.clipboard.writeText(url);
    setCopiedId(certId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredCerts = certs.filter(c => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (c.certificateId || c.id || "").toLowerCase().includes(q) ||
      (c.name || "").toLowerCase().includes(q) ||
      (c.email || "").toLowerCase().includes(q) ||
      (c.eventTitle || c.event || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="text-xs font-mono text-[#0066FF] uppercase font-bold tracking-wider mb-1">
            CREDENTIALS &amp; AUTHENTICATION LEDGER
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Certificate Issuer &amp; Database Registry
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Issue cryptographically verifiable completion certificates stored in live Cloud Firestore.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadCertificates}
            disabled={loading}
            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-mono font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            <span>Refresh Live Database</span>
          </button>
          <Link
            href="/certificates"
            target="_blank"
            className="px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-1.5"
          >
            <span>Public Verification Desk</span>
            <ExternalLink size={13} />
          </Link>
        </div>
      </div>

      {statusMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-mono text-xs flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Issue Certificate Form */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs font-mono text-xs">
        <div className="flex items-center gap-2 text-[#0066FF] font-bold uppercase text-[11px] mb-2">
          <Plus size={14} /> Issue New Verified Certificate
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-4 font-sans">
          Register Student Credential in Firestore
        </h2>

        <form onSubmit={handleIssue} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-slate-700 font-bold mb-1 text-[10px] uppercase">Recipient Full Name *</label>
            <input
              type="text"
              placeholder="e.g. Rahul Sharma"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1 text-[10px] uppercase">Student Email *</label>
            <input
              type="email"
              placeholder="rahul@college.edu"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1 text-[10px] uppercase">Program / Cohort *</label>
            <input
              type="text"
              placeholder="Cohort 1 Virtual Internship"
              value={programTitle}
              onChange={(e) => setProgramTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
              required
            />
          </div>

          <div className="flex flex-col justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 size={14} className="animate-spin" /> : <span>Issue to Firestore</span>}
            </button>
          </div>
        </form>
      </div>

      {/* Registry Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-sans">
              Live Verified Certificates ({filteredCerts.length})
            </h2>
            <p className="text-[11px] text-slate-500">
              Directly synced from Cloud Firestore collection `certificates`.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search by ID, name, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#0066FF]"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400 flex items-center justify-center gap-2">
            <Loader2 size={16} className="animate-spin text-[#0066FF]" />
            <span>Loading live certificates from Firestore database...</span>
          </div>
        ) : filteredCerts.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            No certificates found in the database. Issue one above!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Certificate ID</th>
                  <th className="p-3.5">Recipient Details</th>
                  <th className="p-3.5">Program / Track</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredCerts.map((c) => {
                  const certId = c.certificateId || c.id;
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 font-bold text-[#0066FF]">
                        {certId}
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 font-sans">{c.name}</div>
                        <div className="text-slate-500 text-[11px]">{c.email}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="text-slate-800 font-semibold">{c.eventTitle || c.event}</div>
                        <div className="text-[10px] text-slate-400">{c.issueDate || c.date}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold inline-flex items-center gap-1">
                          <CheckCircle2 size={11} /> {c.status || "Verified"}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => copyVerifyLink(certId)}
                            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                            title="Copy Verification Link"
                          >
                            {copiedId === certId ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                          </button>
                          <Link
                            href={`/certificates?query=${encodeURIComponent(certId)}`}
                            target="_blank"
                            className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0066FF] transition-colors"
                            title="View Public Certificate"
                          >
                            <ExternalLink size={13} />
                          </Link>
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                            title="Revoke Certificate"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
