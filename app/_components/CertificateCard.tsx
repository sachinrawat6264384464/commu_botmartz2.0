"use client";

import React from "react";
import { Sparkles, Terminal, Layers, Code2, ShieldCheck, Zap, Lock, QrCode } from "lucide-react";

interface CertificateCardProps {
  certificateId: string;
  name: string;
  eventTitle: string;
  issueDate?: string;
  className?: string;
}

// SVG Scalloped Starburst Rosette Badge Emblem Component (Replicating Target Reference Screenshot 2!)
function RosetteBadge({
  color,
  label,
  icon: Icon
}: {
  color: string;
  label: string;
  icon: any;
}) {
  return (
    <div className="flex flex-col items-center group cursor-pointer transition-transform hover:scale-105">
      <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center filter drop-shadow-md">
        <svg viewBox="0 0 100 100" className={`w-full h-full ${color}`}>
          <path
            d="M50 0 C54 7, 62 4, 67 10 C72 16, 79 17, 82 24 C86 31, 93 35, 93 43 C94 51, 98 58, 95 66 C92 74, 93 82, 87 88 C81 94, 73 93, 66 96 C58 98, 51 94, 43 93 C35 93, 31 86, 24 82 C17 79, 16 72, 10 67 C4 62, 7 54, 0 50 C7 46, 4 38, 10 33 C16 28, 17 21, 24 18 C31 14, 35 7, 43 7 C51 6, 58 2, 66 5 Z"
            fill="currentColor"
          />
          <circle cx="50" cy="50" r="34" fill="white" opacity="0.25" />
          <circle cx="50" cy="50" r="28" fill="none" stroke="white" strokeWidth="2.5" strokeDasharray="3 3" />
        </svg>
        <Icon className="absolute text-white stroke-[2.2]" size={20} />
      </div>
      <span className="text-[9px] font-mono font-extrabold text-slate-700 uppercase mt-1 tracking-tight text-center max-w-[80px]">
        {label}
      </span>
    </div>
  );
}

export default function CertificateCard({
  certificateId,
  name,
  eventTitle,
  issueDate = "22 September 2026",
  className = ""
}: CertificateCardProps) {
  const qrVerificationUrl = typeof window !== "undefined"
    ? `${window.location.origin}/certificates?query=${certificateId}`
    : `https://community.botmartz.com/certificates?query=${certificateId}`;

  return (
    <div
      className={`relative w-full rounded-3xl bg-[#FCFDFF] border-4 sm:border-8 border-[#4F46E5] p-6 sm:p-10 shadow-2xl overflow-hidden font-sans text-slate-900 selection:bg-indigo-600 selection:text-white ${className}`}
    >
      {/* Background Micro-Grid & Watermark Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Inner Decorative Fine Border */}
      <div className="relative border-2 border-indigo-200/80 rounded-2xl p-6 sm:p-8 bg-white/90 backdrop-blur-xs space-y-6 text-center shadow-inner">
        
        {/* 1. Header: Logo Left, ID Right */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
              <Sparkles size={16} />
            </div>
            <span className="font-serif font-black text-indigo-900 text-lg sm:text-xl tracking-tight">
              Botmartz <span className="text-indigo-600 font-sans font-extrabold text-sm">AI SOLUTIONS</span>
            </span>
          </div>

          <div className="text-right font-mono text-xs text-slate-500 font-bold">
            <span>Certificate ID: </span>
            <span className="text-indigo-900 font-mono font-extrabold">{certificateId}</span>
          </div>
        </div>

        {/* 2. Certificate Title Header */}
        <div className="space-y-1 pt-2">
          <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest">
            CERTIFICATE OF COMPLETION
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-slate-900 uppercase tracking-tight leading-snug max-w-2xl mx-auto">
            {eventTitle || "45-DAY VIRTUAL AI ENGINEERING FELLOWSHIP"}
          </h1>
        </div>

        {/* 3. Recipient Section */}
        <div className="space-y-1 py-1">
          <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest">
            ISSUED TO
          </div>
          <div className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-slate-900 tracking-tight text-indigo-950 inline-block border-b-2 border-slate-300 px-4 pb-1">
            {name || "Candidate Builder"}
          </div>
        </div>

        {/* 4. Description Text */}
        <p className="text-xs sm:text-sm text-slate-600 font-sans max-w-2xl mx-auto leading-relaxed px-2">
          Awarded for the successful completion of the <strong className="text-slate-900">{eventTitle}</strong>, validating practical skills in using production AI tools, GCP/AWS cloud architecture, and 45 days of verified proof-of-work.
        </p>

        {/* 5. 5 Scalloped Starburst Rosette Badge Emblems (Matching Reference Screenshot 2!) */}
        <div className="py-4 border-t border-b border-slate-200/80">
          <div className="flex flex-col items-center space-y-3">
            {/* Top Row: 3 Rosettes */}
            <div className="flex items-center justify-center gap-6 sm:gap-10">
              <RosetteBadge color="text-pink-500" label="Foundations & AI" icon={Sparkles} />
              <RosetteBadge color="text-orange-500" label="Python Agents" icon={Code2} />
              <RosetteBadge color="text-purple-600" label="MCP Arch" icon={Layers} />
            </div>
            {/* Bottom Row: 2 Rosettes */}
            <div className="flex items-center justify-center gap-6 sm:gap-10 pt-1">
              <RosetteBadge color="text-rose-500" label="Linux & GCP" icon={Terminal} />
              <RosetteBadge color="text-amber-500" label="AWS Services" icon={Zap} />
            </div>
          </div>
        </div>

        {/* 6. Footer: Date & Stamp Left, QR & Signature Right */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2 text-left font-mono text-xs">
          
          {/* Bottom Left: Issue Date & CPD Seal */}
          <div className="space-y-3">
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-300 w-32 pb-0.5">
                Date of issue
              </div>
              <div className="font-sans font-bold text-slate-900 text-sm mt-1">{issueDate}</div>
            </div>

            {/* Official Certification Seal Emblem */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 shadow-xs">
              <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold">
                <ShieldCheck size={16} />
              </div>
              <div className="flex flex-col text-[9px] leading-tight font-sans">
                <span className="font-extrabold uppercase text-purple-950">CPD CERTIFIED</span>
                <span className="text-purple-700">Botmartz Verified</span>
              </div>
            </div>
          </div>

          {/* Bottom Right: QR Code & Signature */}
          <div className="flex items-center gap-4 text-right sm:text-right self-end sm:self-auto">
            {/* Founder Signature */}
            <div className="space-y-0.5">
              <div className="font-serif font-black text-slate-900 text-base sm:text-lg tracking-tight">
                Soham Sharma
              </div>
              <div className="text-[11px] text-indigo-600 font-bold font-sans">
                Founder &amp; Lead Architect
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Botmartz AI Solutions
              </div>
            </div>

            {/* QR Code */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white p-1.5 rounded-xl border-2 border-slate-300 shadow-sm flex items-center justify-center shrink-0">
              <QrCode size={60} className="text-slate-900" />
            </div>
          </div>

        </div>

        {/* Disclaimer Footer */}
        <div className="text-[9px] text-slate-400 font-sans pt-2 border-t border-slate-100">
          All trademarks, logos, and brand names are the property of their respective owners. Use of these does not imply endorsement by or affiliation with Botmartz AI Solutions.
        </div>

      </div>
    </div>
  );
}
