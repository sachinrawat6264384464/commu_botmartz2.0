"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Award,
  Search,
  CheckCircle2,
  AlertCircle,
  Download,
  ExternalLink,
  ShieldCheck,
  Loader2,
  FileCheck,
  Check
} from "lucide-react";

function CertificatesContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query") || "";

  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const verifyCertificate = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/certificate/verify?query=${encodeURIComponent(searchTerm.trim())}`);
      const data = await res.json();

      if (res.ok && data.certificate) {
        setResult(data.certificate);
      } else {
        setError(data.error || "No certificate found matching this ID or email.");
      }
    } catch (err) {
      setError("Verification request failed. Please check network connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      verifyCertificate(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    verifyCertificate(query);
  };

  const handleDownloadPDF = async () => {
    if (!result) return;
    setDownloading(true);
    try {
      const res = await fetch("/api/certificate/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: result.name,
          eventTitle: result.eventTitle || result.programTitle,
          certificateId: result.certificateId || result.id,
          issueDate: result.issueDate
        })
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `botmartz-${result.certificateId || result.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert("Failed to download PDF certificate.");
      }
    } catch (e) {
      alert("Network error generating PDF.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="bg-[#FAFCFF] min-h-screen text-slate-900 py-16 pt-24 font-sans selection:bg-[#0066FF] selection:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#0066FF] font-mono text-xs uppercase tracking-wider mb-4 font-bold">
            <ShieldCheck size={14} /> Official Credential Verification
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Verify Botmartz Certificates
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto font-mono">
            Validate the authenticity of official completion certificates, speaker badges, and attendee credentials issued by Botmartz.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm mb-10">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Certificate ID (e.g. CERT-2026-0812) or Student Email..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-xs sm:text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#0066FF]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#0066FF] hover:bg-[#0052CC] text-white px-8 py-3.5 rounded-xl text-xs sm:text-sm font-bold font-mono tracking-wider uppercase transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Verify ↗"}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono flex items-center gap-3">
              <AlertCircle size={18} className="shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Result Display */}
        {result && (
          <div className="bg-white border-2 border-emerald-400 rounded-3xl p-8 shadow-md relative overflow-hidden font-mono">
            <div className="flex items-center gap-2 text-emerald-600 text-xs uppercase font-bold tracking-wider mb-6">
              <CheckCircle2 size={18} /> Valid &amp; Verified Credential in Firestore
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 text-xs">
              <div>
                <div className="text-[11px] text-slate-400 uppercase mb-1">Recipient Name</div>
                <div className="text-xl font-bold text-slate-900 font-sans">{result.name}</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400 uppercase mb-1">Certificate ID</div>
                <div className="text-sm text-[#0066FF] font-bold">{result.certificateId || result.id}</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400 uppercase mb-1">Program / Event</div>
                <div className="text-sm font-bold text-slate-800 font-sans">{result.eventTitle || result.programTitle}</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400 uppercase mb-1">Issue Date</div>
                <div className="text-sm text-slate-600">{result.issueDate || "August 2026"}</div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-4">
              <button
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="inline-flex items-center gap-2 bg-[#0066FF] hover:bg-[#0052CC] text-white px-6 py-3.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-60"
              >
                {downloading ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
                <span>{downloading ? "Generating PDF..." : "Download Official PDF"}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function CertificatesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAFCFF] flex items-center justify-center font-mono text-xs text-slate-500">
        Loading Certificates Verification Desk...
      </div>
    }>
      <CertificatesContent />
    </Suspense>
  );
}
