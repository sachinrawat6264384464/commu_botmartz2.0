"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ScanLine, ExternalLink, CheckCircle2, ShieldCheck } from "lucide-react";

export default function AdminScannerPage() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setMessage(`✅ Valid Ticket Pass: Admitted attendee with code ${code.trim().toUpperCase()}`);
    setCode("");
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <div>
          <div className="text-xs font-mono text-[#00B8F0] uppercase font-bold">ON-SITE OPERATIONS</div>
          <h1 className="text-2xl font-bold text-white">Ticket Scanner &amp; Event Desk</h1>
        </div>

        <Link
          href="/event-desk"
          target="_blank"
          className="px-4 py-2.5 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-xl text-xs font-mono font-bold uppercase transition-all shadow-md flex items-center gap-2"
        >
          <ExternalLink size={15} /> Launch Standalone Event Desk Portal
        </Link>
      </div>

      {/* Quick Scanner */}
      <div className="bg-[#0B1524] border border-white/10 rounded-3xl p-8 shadow-2xl max-w-xl">
        <div className="w-12 h-12 rounded-2xl bg-[#00B8F0]/10 border border-[#00B8F0]/30 text-[#00B8F0] flex items-center justify-center mb-6">
          <ScanLine size={24} />
        </div>
        <h2 className="text-lg font-bold text-white mb-2">Instant Ticket Verification</h2>
        <p className="text-xs text-slate-400 mb-6">
          Scan QR codes with your handheld barcode scanner or enter ticket codes manually to admit attendees.
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            placeholder="Scan or enter ticket code (e.g. TC-9821)..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full bg-[#050B14] border border-white/15 rounded-xl px-4 py-3 text-xs sm:text-sm text-white font-mono placeholder:text-slate-500 focus:outline-none focus:border-[#00B8F0]"
          />
          <button
            type="submit"
            className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white py-3 rounded-xl font-mono text-xs font-bold uppercase transition-all shadow-md cursor-pointer"
          >
            Verify &amp; Admit Pass →
          </button>
        </form>

        {message && (
          <div className="mt-4 p-3.5 rounded-xl bg-[#050B14] border border-emerald-500/30 text-xs font-mono text-emerald-300">
            {message}
          </div>
        )}
      </div>

    </div>
  );
}
