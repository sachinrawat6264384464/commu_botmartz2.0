"use client";

import React from "react";
import { Heart, Sparkles, Code2, Sun, ShieldCheck } from "lucide-react";

interface CertificateCardProps {
  certificateId: string;
  name: string;
  eventTitle: string;
  issueDate?: string;
  className?: string;
}

// Scalloped Badge Rosette for Left Blue Ribbon
function FlowerRosette({
  fillColor,
  icon: Icon,
  label
}: {
  fillColor: string;
  icon: any;
  label?: string;
}) {
  return (
    <div className="flex items-center gap-2.5 font-sans group">
      <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center transform group-hover:scale-110 transition-transform filter drop-shadow-md shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path
            d="M 50,4 C 55,4 57,9 62,11 C 67,13 72,10 76,14 C 80,18 78,23 81,28 C 84,33 90,34 91,39 C 92,44 88,48 88,53 C 88,58 92,62 91,67 C 90,72 84,74 81,79 C 78,84 80,89 76,92 C 72,96 67,93 62,95 C 57,97 55,102 50,102 C 45,102 43,97 38,95 C 33,93 28,96 24,92 C 20,89 22,84 19,79 C 16,74 10,72 9,67 C 8,62 12,58 12,53 C 12,48 8,44 9,39 C 10,34 16,33 19,28 C 22,23 20,18 24,14 C 28,10 33,13 38,11 C 43,9 45,4 50,4 Z"
            className={fillColor}
          />
          <circle cx="50" cy="53" r="30" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
        </svg>
        <Icon className="absolute text-white stroke-[2.2] drop-shadow-xs" size={16} />
      </div>
      {label && (
        <span className="text-[10px] sm:text-xs font-medium text-blue-50 tracking-wide font-sans leading-tight">
          {label}
        </span>
      )}
    </div>
  );
}

export default function CertificateCard({
  certificateId,
  name,
  eventTitle,
  issueDate = "9 August 2026",
  className = ""
}: CertificateCardProps) {
  const formattedTitle = eventTitle || "AI MASTERY CERTIFICATE PROGRAM";
  const candidateName = name || "Sachin Rawat";

  return (
    <div className={`w-full max-w-5xl mx-auto rounded-[24px] bg-white border-4 border-slate-200 shadow-2xl overflow-hidden font-sans text-slate-900 ${className}`}>
      <div className="flex flex-col md:flex-row min-h-[480px] relative">
        
        {/* ── 1. LEFT BLUE RIBBON COLUMN (Badges Earned) ── */}
        <div className="w-full md:w-64 bg-[#0066FF] p-6 text-white flex flex-col justify-between relative shrink-0">
          
          <div className="space-y-5 relative z-10">
            {/* Column Header */}
            <div className="border-b border-blue-400/40 pb-3">
              <h3 className="text-lg sm:text-xl font-bold font-sans tracking-wide text-white">
                Badges Earned
              </h3>
              <p className="text-[10px] text-blue-200 font-mono">
                Verified Skill Milestones
              </p>
            </div>

            {/* Vertical List of Earned Badges */}
            <div className="space-y-3">
              <FlowerRosette fillColor="fill-pink-500" icon={Heart} label="Foundations & AI" />
              <FlowerRosette fillColor="fill-orange-500" icon={Code2} label="Python Agents" />
              <FlowerRosette fillColor="fill-purple-500" icon={Sparkles} label="MCP Architecture" />
              <FlowerRosette fillColor="fill-rose-500" icon={Sun} label="Linux & Cloud GCP" />
              <FlowerRosette fillColor="fill-amber-400" icon={ShieldCheck} label="AWS Services" />
            </div>
          </div>

          {/* Bottom Seal/Logo in Blue Ribbon */}
          <div className="pt-4 border-t border-blue-400/30 flex items-center gap-2 text-xs text-blue-100 font-mono">
            <ShieldCheck size={20} className="text-amber-300 shrink-0" />
            <div className="leading-tight text-[9px]">
              <div className="font-bold text-white uppercase">Botmartz Certified</div>
              <div className="text-blue-200">SHA-256 Ledger Verified</div>
            </div>
          </div>
        </div>

        {/* ── 2. MAIN CERTIFICATE BODY (Center & Right) ── */}
        <div className="flex-1 p-6 sm:p-10 flex flex-col justify-between text-center relative bg-white">
          
          {/* Top Right Header: ID & Brand */}
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-serif italic font-black text-[#0066FF] text-2xl tracking-tight">
                Botmartz
              </span>
              <span className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-widest">
                AI Solutions
              </span>
            </div>

            <div className="text-right font-mono text-[10px] sm:text-xs text-slate-400 font-bold">
              <span>CERTIFICATE ID: </span>
              <span className="text-slate-800">{certificateId || "CERT-BM-982314"}</span>
            </div>
          </div>

          {/* Certificate Title */}
          <div className="space-y-1.5 pt-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-extrabold text-[#0066FF] tracking-tight leading-none">
              Certificate
            </h1>
            <h2 className="text-xl sm:text-2xl font-sans font-bold text-[#0066FF] tracking-normal">
              of Completion
            </h2>
          </div>

          {/* Candidate Name Section */}
          <div className="space-y-2 py-4">
            <div className="text-xs sm:text-sm font-sans font-medium text-slate-600">
              This is to proudly certify that
            </div>
            
            <div className="text-3xl sm:text-4xl lg:text-5xl font-sans font-extrabold text-[#0066FF] tracking-tight">
              {candidateName}
            </div>

            {/* Blue Horizontal Underline */}
            <div className="w-48 sm:w-64 h-[2px] bg-[#0066FF] mx-auto rounded-full" />
          </div>

          {/* Description Paragraph */}
          <p className="text-xs sm:text-sm text-slate-600 font-sans max-w-xl mx-auto leading-relaxed px-2">
            for the successful completion of the <strong className="text-slate-900 font-bold">{formattedTitle}</strong>, validating practical skills in using production AI tools to improve productivity, creativity, and professional performance.
          </p>

          {/* Footer: Date & CPD Stamp Left, Signature & QR Right */}
          <div className="flex flex-col sm:flex-row items-end justify-between gap-4 pt-6 text-left border-t border-slate-100 mt-4">
            
            {/* Left: Issue Date & CPD Certified */}
            <div className="space-y-2">
              <div className="text-[11px] text-slate-400 font-mono">
                Date of issue: <strong className="text-slate-800 font-sans">{issueDate}</strong>
              </div>

              {/* CPD Stamp */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-950 text-white flex items-center justify-center font-bold text-xs">
                  <ShieldCheck size={18} className="text-purple-300" />
                </div>
                <div className="text-[8px] font-sans leading-tight text-indigo-950 font-bold">
                  <div className="text-xs font-black uppercase">CPD</div>
                  <div className="text-purple-700 uppercase">CERTIFIED</div>
                  <div className="text-slate-400 font-normal text-[7px]">Service #98231</div>
                </div>
              </div>
            </div>

            {/* Right: Founder Signature & QR Code */}
            <div className="flex items-end gap-4 text-right">
              <div className="text-right space-y-0.5">
                <div className="font-serif italic font-bold text-slate-900 text-sm sm:text-base">
                  Soham Sharma
                </div>
                <div className="text-[10px] text-[#0066FF] font-sans font-bold">
                  Founder &amp; Lead Architect
                </div>
              </div>

              <div className="w-14 h-14 bg-white p-1 rounded-lg border border-slate-300 shadow-xs flex items-center justify-center shrink-0">
                <img src="/qr-code.png" alt="QR Code" className="w-full h-full object-contain" />
              </div>
            </div>

          </div>

        </div>

        {/* ── 3. RIGHT YELLOW ACCENT BAR ── */}
        <div className="hidden md:block w-3.5 bg-[#FFC700] shrink-0" />

      </div>
    </div>
  );
}


