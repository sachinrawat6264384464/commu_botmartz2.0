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
  Lock,
  QrCode,
  Sparkles,
  Building2,
  Linkedin,
  Flame,
  Zap,
  Check
} from "lucide-react";
import LinkedInShareModal from "@/app/_components/LinkedInShareModal";
import CertificateCard from "@/app/_components/CertificateCard";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function CertificatesContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query") || "";

  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [shareModalOpen, setShareModalOpen] = useState(false);

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
        setError(data.error || "No official credential found matching this Certificate ID or email.");
      }
    } catch (err) {
      setError("Verification service unreachable. Please check network connection.");
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
    let downloaded = false;

    // Method 1: High-res DOM Capture (1:1 visual fidelity)
    try {
      const certElement = document.getElementById("certificate-download-card");
      if (certElement) {
        const canvas = await html2canvas(certElement, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: "#ffffff",
        });

        const imgData = canvas.toDataURL("image/png", 1.0);
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "a4",
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`botmartz-${result.certificateId || result.id}.pdf`);
        downloaded = true;
      }
    } catch (domErr) {
      console.warn("DOM PDF Capture failed, switching to server generator:", domErr);
    }

    // Method 2: Server-Side API Generator Fallback
    if (!downloaded) {
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
          downloaded = true;
        } else {
          alert("Unable to generate PDF certificate from server.");
        }
      } catch (apiErr) {
        console.error("API PDF Generation Error:", apiErr);
        alert("Network error generating PDF certificate.");
      }
    }

    setDownloading(false);
  };

  return (
    <div className="bg-[#FAFCFF] min-h-screen text-slate-900 pb-16 pt-6 font-sans selection:bg-[#0066FF] selection:text-white">
      <div className="w-full px-4 sm:px-8 lg:px-12 relative z-10">
        
        {/* ── 1. TECH HERO BANNER CARD ── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-[#0B1528] to-blue-950 p-6 sm:p-10 border border-slate-800 shadow-2xl mb-10">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-cyan-400 font-mono text-xs font-bold border border-cyan-500/30 backdrop-blur-md">
                <ShieldCheck size={14} className="text-cyan-400" />
                <span>BOTMARTZ AI SOLUTIONS &bull; VERIFICATION ENGINE</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-sans leading-tight">
                Verify Candidate <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">Certificates &amp; Badges</span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                Validate the cryptographic authenticity of 45-day AI engineering completion certificates, earned streak badges, and founder mentorship credentials issued by Soham Sharma.
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-2 font-mono text-xs text-slate-400">
                <span className="text-[11px] font-bold uppercase text-slate-400">Sample Credentials:</span>
                {["CERT-BM-982314", "CERT-BM-B1-98231", "CERT-2026-0812", "AI-AGENT-2026"].map((sample) => (
                  <button
                    key={sample}
                    onClick={() => handleQuickSample(sample)}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-cyan-300 text-[11px] font-bold transition-all cursor-pointer"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>

            {/* Embedded Glass Search Box */}
            <div className="w-full lg:max-w-md bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md shadow-xl">
              <form onSubmit={handleSearch} className="space-y-3 font-mono text-xs">
                <label className="text-[11px] text-slate-300 font-bold uppercase tracking-wider block">
                  Certificate Search Query:
                </label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter Unique Certificate ID (e.g. CERT-BM-XXXXXX)..."
                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#0066FF] to-cyan-600 hover:from-blue-600 hover:to-cyan-500 text-white py-3 rounded-xl font-bold uppercase tracking-wider transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : "Verify Authentic Credential ↗"}
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
              <strong className="block text-sm font-bold font-mono">Certificate Verification Failed</strong>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* ── 2. VERIFIED CERTIFICATE CARD DISPLAY (Matching User Screenshot 3 Aesthetic!) ── */}
        {result ? (
          <div className="max-w-5xl mx-auto bg-white border-2 border-emerald-500 rounded-3xl p-4 sm:p-8 shadow-2xl relative overflow-hidden font-sans mb-16">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-cyan-500 to-[#0066FF]" />

            {/* Verification Header Badge */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2 text-emerald-600 text-xs font-mono uppercase font-black">
                <CheckCircle2 size={18} className="text-emerald-500" />
                <span>Verified Authentic Record &bull; Botmartz AI Solutions</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-mono text-[11px] font-bold border border-emerald-200">
                SHA-256 Ledger Verified
              </span>
            </div>

            {/* Main Certificate Visual Frame (Matching Target Reference Screenshot 2 Design!) */}
            <CertificateCard
              certificateId={result.certificateId || result.id}
              name={result.name}
              eventTitle={result.eventTitle || result.programTitle || "45-Day Virtual AI Engineering Internship"}
              issueDate={result.issueDate || "22 September 2026"}
            />

            {/* Action Buttons: PDF Download & Direct LinkedIn Share */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handleDownloadPDF}
                  disabled={downloading}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#0066FF] hover:bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-bold transition-all shadow-md shadow-blue-500/20 cursor-pointer disabled:opacity-60"
                >
                  {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                  <span>{downloading ? "Generating PDF..." : "Download Official PDF"}</span>
                </button>

                <button
                  onClick={() => setShareModalOpen(true)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#0077B5] hover:bg-[#006097] text-white px-6 py-3.5 rounded-2xl font-bold transition-all shadow-md shadow-blue-700/20 cursor-pointer"
                >
                  <Linkedin size={16} />
                  <span>Share on LinkedIn ↗</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 self-center">
                <Lock size={13} className="text-emerald-600" />
                <span>Verified on Botmartz Registry</span>
              </div>
            </div>

            {/* LinkedIn Modal */}
            <LinkedInShareModal
              isOpen={shareModalOpen}
              onClose={() => setShareModalOpen(false)}
              candidateName={result.name}
              projectTitle={result.eventTitle || result.programTitle || "45-Day Virtual AI Engineering Internship"}
              certificateId={result.certificateId || result.id}
              verificationUrl={typeof window !== "undefined" ? `${window.location.origin}/certificates?query=${result.certificateId || result.id}` : `https://community.botmartz.com/certificates?query=${result.certificateId || result.id}`}
            />

          </div>
        ) : (
          /* ── 3. RICH FEATURES & TRUST SHOWCASE GRID (Default View) ── */
          <div className="space-y-12">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-mono text-xs">
              <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 hover:border-[#0066FF] transition-all shadow-md hover:shadow-xl space-y-3 group">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0066FF] border border-blue-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Lock size={22} />
                </div>
                <h3 className="font-bold text-slate-900 font-sans text-sm group-hover:text-[#0066FF] transition-colors">SHA-256 Verified Ledger</h3>
                <p className="text-slate-600 text-xs font-sans leading-relaxed">
                  Cryptographically signed completion credentials verified against Botmartz database to prevent tampering.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 hover:border-cyan-500 transition-all shadow-md hover:shadow-xl space-y-3 group">
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 border border-cyan-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <QrCode size={22} />
                </div>
                <h3 className="font-bold text-slate-900 font-sans text-sm group-hover:text-cyan-600 transition-colors">Direct QR Verification</h3>
                <p className="text-slate-600 text-xs font-sans leading-relaxed">
                  Every issued PDF includes a scannable QR code linking to candidate proof-of-work commit history.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 hover:border-purple-500 transition-all shadow-md hover:shadow-xl space-y-3 group">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Building2 size={22} />
                </div>
                <h3 className="font-bold text-slate-900 font-sans text-sm group-hover:text-purple-600 transition-colors">Botmartz AI Endorsed</h3>
                <p className="text-slate-600 text-xs font-sans leading-relaxed">
                  Officially issued by Botmartz AI Solutions with founder endorsement by Soham Sharma.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 hover:border-emerald-500 transition-all shadow-md hover:shadow-xl space-y-3 group">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Award size={22} />
                </div>
                <h3 className="font-bold text-slate-900 font-sans text-sm group-hover:text-emerald-600 transition-colors">Gamified Skill Badges</h3>
                <p className="text-slate-600 text-xs font-sans leading-relaxed">
                  Includes 10-day, 20-day streak badges and production system milestone credentials.
                </p>
              </div>
            </div>

            {/* Sample Search Quick Box */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-blue-950 rounded-3xl p-8 sm:p-10 border border-slate-800 text-white shadow-2xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4 max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 font-mono text-[11px] font-bold border border-cyan-500/20">
                    <Sparkles size={13} /> CREDENTIAL VERIFICATION DEMO
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black font-sans text-white">
                    Need to verify candidate credentials for hiring?
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                    Type the Unique Certificate ID (e.g. CERT-BM-982314) found on the PDF credential to view candidate proof of work.
                  </p>
                </div>

                <div className="w-full md:w-auto shrink-0 font-mono text-xs">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                      <FileCheck size={16} /> Sample Verification ID:
                    </div>
                    <code className="block p-3 rounded-xl bg-slate-900 text-cyan-300 text-sm font-bold border border-slate-800 text-center">
                      CERT-BM-982314
                    </code>
                    <button
                      onClick={() => handleQuickSample("CERT-BM-982314")}
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
