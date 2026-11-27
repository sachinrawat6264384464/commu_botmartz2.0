"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Download,
  Loader2,
  Lock,
  Linkedin,
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
    <div className="bg-white min-h-screen text-slate-900 pb-16 pt-24 font-sans">
      <div className="w-full px-4 sm:px-8 lg:px-12 relative z-10">
        
        {/* ── 1. TECH HERO BANNER CARD ── */}
        <div
          className="relative overflow-hidden rounded-3xl bg-[#162774] p-7 sm:p-10 border border-white/15 shadow-2xl mb-10"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        >
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-3xl">
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-sans leading-tight">
                Verify Candidate Certificates &amp; Badges
              </h1>

              <p className="text-xs sm:text-sm text-blue-100/85 font-sans leading-relaxed">
                Validate the cryptographic authenticity of AI engineering completion certificates, earned streak badges, and founder mentorship credentials issued by Soham Sharma.
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-2 font-sans text-xs text-blue-200">
                <span className="text-[11px] font-bold uppercase text-blue-200/80">Sample Credentials:</span>
                {["CERT-BM-982314", "CERT-BM-B1-98231", "CERT-2026-0812", "AI-AGENT-2026"].map((sample) => (
                  <button
                    key={sample}
                    onClick={() => handleQuickSample(sample)}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white hover:text-[#162774] border border-white/15 text-white text-[11px] font-bold transition-all cursor-pointer"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>

            {/* Embedded Glass Search Box */}
            <div className="w-full lg:max-w-md bg-white/10 border border-white/15 rounded-2xl p-4 backdrop-blur-md shadow-xl">
              <form onSubmit={handleSearch} className="space-y-3 font-sans text-xs">
                <label className="text-[11px] text-blue-100 font-bold uppercase tracking-wider block">
                  Certificate Search Query:
                </label>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter Unique Certificate ID (e.g. CERT-BM-XXXXXX)..."
                  className="w-full bg-white border border-white/20 rounded-xl px-4 py-3 text-xs text-slate-950 placeholder:text-slate-400 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 py-3 px-4 rounded-xl font-extrabold transition-all shadow-lg flex items-center justify-center gap-2.5 group cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      <span>Verify Authentic Credential</span>
                      <span className="w-6 h-6 rounded-full bg-slate-950 text-[#D9F83B] flex items-center justify-center transition-transform duration-300 group-hover:rotate-45">
                        <ArrowRight size={12} />
                      </span>
                    </>
                  )}
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-sans text-xs">
              {[
                {
                  num: "01",
                  title: "SHA-256 Verified Ledger",
                  desc: "Cryptographically signed completion credentials verified against Botmartz database to prevent tampering.",
                  tag: "Tamper-Proof Registry",
                  initial: { opacity: 0, x: -36, y: 0, filter: "blur(6px)" },
                },
                {
                  num: "02",
                  title: "Direct QR Verification",
                  desc: "Every issued PDF includes a scannable QR code linking to candidate proof-of-work commit history.",
                  tag: "Instant Scan Check",
                  initial: { opacity: 0, x: 0, y: 30, filter: "blur(6px)" },
                },
                {
                  num: "03",
                  title: "Botmartz AI Endorsed",
                  desc: "Officially issued by Botmartz AI Solutions with founder endorsement by Soham Sharma.",
                  tag: "Founder Signed",
                  initial: { opacity: 0, x: 0, y: 30, filter: "blur(6px)" },
                },
                {
                  num: "04",
                  title: "Gamified Skill Badges",
                  desc: "Includes 10-day, 20-day streak badges and production system milestone credentials.",
                  tag: "Milestone Proofs",
                  initial: { opacity: 0, x: 36, y: 0, filter: "blur(6px)" },
                },
              ].map((card, idx) => (
                <motion.div
                  key={card.num}
                  initial={card.initial}
                  whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: idx * 0.08, ease: "easeOut" }}
                  className="relative overflow-hidden rounded-3xl bg-[#F4F6FB] hover:bg-white border border-slate-200 border-l-4 border-l-[#162774] hover:border-[#162774] transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between group"
                >
                  <div className="p-6 pb-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="w-7 h-7 rounded-full bg-[#162774] text-white font-extrabold text-[11px] flex items-center justify-center transition-colors duration-500">
                        {card.num}
                      </span>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#162774]">
                        Verified
                      </span>
                    </div>
                    <h3 className="font-extrabold text-slate-950 text-sm group-hover:text-[#162774] transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      {card.desc}
                    </p>
                  </div>

                  <div className="relative overflow-hidden px-6 py-3.5 border-t border-slate-200/80 group-hover:border-[#162774] flex items-center justify-between transition-colors duration-500">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-[#162774] -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
                        backgroundSize: "28px 28px",
                      }}
                    />
                    <span className="relative z-10 text-[11px] font-bold uppercase tracking-wider text-[#1D3189] group-hover:text-white transition-colors duration-500">
                      {card.tag}
                    </span>
                    <span className="relative z-10 w-6 h-6 rounded-full bg-white text-[#162774] flex items-center justify-center transition-all duration-500 group-hover:rotate-45 shadow-2xs">
                      <ArrowRight size={12} />
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Sample Search Quick Box */}
            <div
              className="bg-[#162774] rounded-3xl p-8 sm:p-10 border border-white/15 text-white shadow-2xl relative overflow-hidden"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
                backgroundSize: "56px 56px",
              }}
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4 max-w-xl">
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-sans text-white">
                    Need to verify candidate credentials for hiring?
                  </h2>
                  <p className="text-xs sm:text-sm text-blue-100/85 font-sans leading-relaxed">
                    Type the Unique Certificate ID (e.g. CERT-BM-982314) found on the PDF credential to view candidate proof of work.
                  </p>
                </div>

                <div className="w-full md:w-auto shrink-0 font-sans text-xs">
                  <div className="p-6 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md space-y-3 min-w-[260px]">
                    <div className="text-blue-200 font-extrabold text-[11px] uppercase tracking-wider">
                      Sample Verification ID:
                    </div>
                    <code className="block p-3 rounded-xl bg-white/10 text-white text-sm font-extrabold border border-white/15 text-center tracking-wider">
                      CERT-BM-982314
                    </code>
                    <button
                      onClick={() => handleQuickSample("CERT-BM-982314")}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 group"
                    >
                      <span>Test Sample Search</span>
                      <span className="w-6 h-6 rounded-full bg-slate-950 text-[#D9F83B] flex items-center justify-center transition-transform duration-300 group-hover:rotate-45">
                        <ArrowRight size={12} />
                      </span>
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
