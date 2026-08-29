"use client";

import React, { useState } from "react";
import { Award, Plus, Search, CheckCircle2, Download } from "lucide-react";

export default function AdminCertificatesPage() {
  const [certs, setCerts] = useState<any[]>([
    { id: "CERT-2026-0812", name: "Ananya Sharma", email: "ananya.ai@outlook.com", event: "AI Frontier 2026", date: "August 2026" },
    { id: "CERT-2026-0813", name: "Vikram Mehta", email: "vmehta@techcorp.io", event: "AI Frontier 2026", date: "August 2026" },
    { id: "CERT-2026-0814", name: "Sneha Patel", email: "sneha.p@gmail.com", event: "AI Agent Accelerator", date: "July 2026" },
  ]);

  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [programTitle, setProgramTitle] = useState("AI Frontier 2026");

  const handleIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim() || !recipientEmail.trim()) return;

    const newId = `CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setCerts(prev => [
      { id: newId, name: recipientName, email: recipientEmail, event: programTitle, date: "August 2026" },
      ...prev
    ]);
    alert(`Certificate ${newId} issued for ${recipientName}!`);
    setRecipientName("");
    setRecipientEmail("");
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <div>
          <div className="text-xs font-mono text-purple-400 uppercase font-bold">CREDENTIALS &amp; CERTIFICATION</div>
          <h1 className="text-2xl font-bold text-white">Certificate Issuer &amp; Registry</h1>
        </div>
      </div>

      {/* Issue Certificate Form */}
      <div className="bg-[#0B1524] border border-white/10 rounded-2xl p-6 shadow-xl">
        <h2 className="text-sm font-bold font-mono text-white uppercase mb-4">+ Issue New Verified Certificate</h2>
        <form onSubmit={handleIssue} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Recipient Full Name"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            className="bg-[#050B14] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white"
            required
          />
          <input
            type="email"
            placeholder="Recipient Email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            className="bg-[#050B14] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white"
            required
          />
          <input
            type="text"
            placeholder="Program / Event"
            value={programTitle}
            onChange={(e) => setProgramTitle(e.target.value)}
            className="bg-[#050B14] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white"
            required
          />
          <button
            type="submit"
            className="bg-[#0066FF] hover:bg-[#0052CC] text-white px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition-all shadow-md cursor-pointer"
          >
            Issue Certificate
          </button>
        </form>
      </div>

      {/* Registry Table */}
      <div className="bg-[#0B1524] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#070E1B] text-slate-400 font-mono uppercase text-[11px] border-b border-white/10">
            <tr>
              <th className="p-4">Certificate ID</th>
              <th className="p-4">Recipient</th>
              <th className="p-4">Program / Event</th>
              <th className="p-4">Issue Date</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {certs.map((c) => (
              <tr key={c.id} className="hover:bg-white/[0.02]">
                <td className="p-4 font-mono font-bold text-purple-400">{c.id}</td>
                <td className="p-4">
                  <div className="font-bold text-white">{c.name}</div>
                  <div className="text-slate-400 text-[11px]">{c.email}</div>
                </td>
                <td className="p-4 text-slate-200 font-medium">{c.event}</td>
                <td className="p-4 font-mono text-slate-400">{c.date}</td>
                <td className="p-4 text-right">
                  <a
                    href={`/certificates`}
                    target="_blank"
                    className="text-[#00B8F0] hover:underline font-mono text-[11px] font-bold"
                  >
                    Verify ↗
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
