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
  Check,
  Lock,
  QrCode,
  Sparkles,
  Zap,
  Building2,
  ArrowRight
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

  const handleQuickSample = (sampleId: string) => {
    setQuery(sampleId);
    verifyCertificate(sampleId);
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
    <div className="bg-[#FAFCFF] min-h-screen text-slate-900 pb-12 pt-4 font-sans selection:bg-[#0066FF] selection:text-white">
      {/* Dynamic 100% Full-Width Container */}
      <div className="w-full px-4 sm:px-8 lg:px-12 relative z-10">
        
        {/* ── 1. REDESIGNED TECH HERO BANNER CARD ── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 p-6 sm:p-12 border border-slate-800 shadow-2xl mb-12">
          {/* Background Ambient Glows */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            {/* Left Column: Title & Description */}
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-cyan-400 font-mono text-xs font-bold border border-cyan-500/20 backdrop-blur-md shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <ShieldCheck size={14} className="text-cyan-400" />
                <span>SHA-256 CRYPTOGRAPHIC CREDENTIAL REGISTRY</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-sans leading-tight">
                Verify Botmartz <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">Certificates</span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                Validate the authenticity of official completion certificates, speaker badges, and attendee credentials issued by Botmartz in real-time.
              </p>

              {/* Sample Quick Search Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-2 font-mono text-xs text-slate-400">
                <span className="text-[11px] font-bold uppercase text-slate-500">Try Sample IDs:</span>
                {["CERT-2026-0812", "AI-AGENT-2026", "RAG-PRO-99"].map((sample) => (
                  <button
                    key={sample}
                    onClick={() => handleQuickSample(sample)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-300 text-[11px] font-bold transition-all cursor-pointer"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Embedded Glass Search Box */}
            <div className="w-full lg:max-w-md bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md shadow-xl">
              <form onSubmit={handleSearch} className="space-y-3 font-mono text-xs">
                <label className="text-[11px] text-slate-300 font-bold uppercase tracking-wider block">
                  Credential Search Engine:
                </label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Certificate ID or Student Email..."
                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white py-3 rounded-xl font-bold uppercase tracking-wider transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : "Verify Authenticity ↗"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="max-w-4xl mx-auto mb-10 p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono flex items-center gap-3 shadow-xs">
            <AlertCircle size={20} className="shrink-0 text-rose-600" />
            <div className="flex-1 font-sans">
              <strong className="block text-sm font-bold font-mono">Verification Error</strong>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* ── 2. VERIFIED RESULT CARD (If Searched) ── */}
        {result ? (
          <div className="max-w-4xl mx-auto bg-white border-2 border-emerald-500/80 rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden font-mono mb-16">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 to-cyan-500" />

            <div className="flex items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-2 text-emerald-600 text-xs uppercase font-bold tracking-wider">
                <CheckCircle2 size={20} className="text-emerald-500" />
                <span>Valid &amp; Authenticated Record</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                Firestore Verified
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Recipient Name</div>
                <div className="text-xl font-black text-slate-900 font-sans">{result.name}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Certificate ID</div>
                <div className="text-sm text-[#0066FF] font-bold">{result.certificateId || result.id}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Program / Event</div>
                <div className="text-sm font-bold text-slate-800 font-sans">{result.eventTitle || result.programTitle}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Issue Date</div>
                <div className="text-sm text-slate-600 font-bold">{result.issueDate || "August 2026"}</div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">
              <button
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="inline-flex items-center gap-2 bg-[#0066FF] hover:bg-blue-600 text-white px-7 py-3.5 rounded-2xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 cursor-pointer disabled:opacity-60"
              >
                {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                <span>{downloading ? "Generating Official PDF..." : "Download Verified PDF"}</span>
              </button>

              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Lock size={13} className="text-emerald-600" />
                <span>SHA-256 Ledger Signature Verified</span>
              </div>
            </div>
          </div>
        ) : (
          /* ── 3. RICH FEATURES & TRUST SHOWCASE GRID (Default View) ── */
          <div className="space-y-12">
            
            {/* 4 Feature Badges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-mono text-xs">
              <div className="p-6 rounded-3xl bg-white border-2 border-slate-300 hover:border-[#0066FF] transition-all shadow-md hover:shadow-xl space-y-3 group">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0066FF] border border-blue-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Lock size={22} />
                </div>
                <h3 className="font-bold text-slate-900 font-sans text-sm group-hover:text-[#0066FF] transition-colors">Tamper-Proof Ledger</h3>
                <p className="text-slate-600 text-xs font-sans leading-relaxed">
                  Cryptographically signed records stored securely in Firestore ledger prevent forgery or altering of completion credentials.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border-2 border-slate-300 hover:border-cyan-500 transition-all shadow-md hover:shadow-xl space-y-3 group">
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 border border-cyan-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <QrCode size={22} />
                </div>
                <h3 className="font-bold text-slate-900 font-sans text-sm group-hover:text-cyan-600 transition-colors">Scannable QR Verification</h3>
                <p className="text-slate-600 text-xs font-sans leading-relaxed">
                  Every physical badge or digital PDF includes a direct QR link for instant verification by recruiters and employers.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border-2 border-slate-300 hover:border-purple-500 transition-all shadow-md hover:shadow-xl space-y-3 group">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Building2 size={22} />
                </div>
                <h3 className="font-bold text-slate-900 font-sans text-sm group-hover:text-purple-600 transition-colors">Industry Standard</h3>
                <p className="text-slate-600 text-xs font-sans leading-relaxed">
                  Recognized across frontier AI startups, defense labs, and AI engineering cohorts for verifiable proof of work.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border-2 border-slate-300 hover:border-emerald-500 transition-all shadow-md hover:shadow-xl space-y-3 group">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Award size={22} />
                </div>
                <h3 className="font-bold text-slate-900 font-sans text-sm group-hover:text-emerald-600 transition-colors">Vector &amp; PDF Dispatch</h3>
                <p className="text-slate-600 text-xs font-sans leading-relaxed">
                  Generate high-resolution vector PDF certificates with 1-click instant download anytime.
                </p>
              </div>
            </div>

            {/* Visual Credential Preview Card */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-blue-950 rounded-3xl p-8 sm:p-10 border border-slate-800 text-white shadow-2xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4 max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 font-mono text-[11px] font-bold border border-cyan-500/20">
                    <Sparkles size={13} /> CERTIFICATE VERIFICATION GUIDE
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black font-sans text-white">
                    Looking to verify a student or attendee credential?
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                    Simply type the 12-digit Certificate ID found on the bottom left of any Botmartz PDF certificate, or search using the recipient's registered email address.
                  </p>
                </div>

                <div className="w-full md:w-auto shrink-0 font-mono text-xs">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                      <FileCheck size={16} /> Sample Verification ID:
                    </div>
                    <code className="block p-3 rounded-xl bg-slate-900 text-cyan-300 text-sm font-bold border border-slate-800 text-center">
                      CERT-2026-0812
                    </code>
                    <button
                      onClick={() => handleQuickSample("CERT-2026-0812")}
                      className="w-full py-2.5 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold transition-colors cursor-pointer text-center block"
                    >
                      Test Sample Search ↗
                    </button>
                  </div>
                </div>
              </div>
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
