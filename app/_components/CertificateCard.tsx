"use client";

import React from "react";
import { Heart, Sparkles, Code2, Sun, ShieldCheck, QrCode } from "lucide-react";

interface CertificateCardProps {
  certificateId: string;
  name: string;
  eventTitle: string;
  issueDate?: string;
  className?: string;
}

// Smooth 12-Lobed Scalloped Flower Rosette Emblem (Exact replica of Coursiv Reference Screenshot 2!)
function FlowerRosette({
  fillColor,
  icon: Icon,
}: {
  fillColor: string;
  icon: any;
}) {
  return (
    <div className="relative w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center transform hover:scale-110 transition-transform filter drop-shadow-md shrink-0">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Smooth 12-lobed scalloped flower path */}
        <path
          d="M 50,4 C 55,4 57,9 62,11 C 67,13 72,10 76,14 C 80,18 78,23 81,28 C 84,33 90,34 91,39 C 92,44 88,48 88,53 C 88,58 92,62 91,67 C 90,72 84,74 81,79 C 78,84 80,89 76,92 C 72,96 67,93 62,95 C 57,97 55,102 50,102 C 45,102 43,97 38,95 C 33,93 28,96 24,92 C 20,89 22,84 19,79 C 16,74 10,72 9,67 C 8,62 12,58 12,53 C 12,48 8,44 9,39 C 10,34 16,33 19,28 C 22,23 20,18 24,14 C 28,10 33,13 38,11 C 43,9 45,4 50,4 Z"
          className={fillColor}
        />
        {/* Inner subtle dashed white ring */}
        <circle cx="50" cy="53" r="30" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
      </svg>
      <Icon className="absolute text-white stroke-[2.2] drop-shadow-xs" size={20} />
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

  return (
    <div className={`w-full max-w-4xl mx-auto rounded-[28px] bg-[#4F46E5] p-3 sm:p-4 shadow-2xl ${className}`}>
      {/* Inner Light Blue Certificate Container - Landscape Rectangle Proportions */}
      <div className="relative w-full rounded-[22px] bg-[#EAF2FF] p-5 sm:p-8 shadow-inner overflow-hidden font-sans text-slate-900">
        
        {/* Background Light Blue Security Micro-Grid & Watermark */}
        <div className="absolute inset-0 bg-[radial-gradient(#93c5fd_1.5px,transparent_1.5px)] [background-size:18px_18px] opacity-70 pointer-events-none" />

        {/* Certificate Content */}
        <div className="relative space-y-4 sm:space-y-5 text-center">
          
          {/* 1. Top Header: Small Brand Logo Left, ID Right */}
          <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
            {/* Small Constrained Logo Image */}
            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="Botmartz AI Solutions"
                className="h-8 sm:h-10 max-w-[130px] sm:max-w-[160px] object-contain drop-shadow-xs shrink-0"
              />
              <span className="font-serif italic font-bold text-indigo-950 text-base sm:text-lg tracking-tight hidden sm:inline">
                Botmartz <span className="text-[10px] font-sans font-bold text-slate-500 uppercase not-italic tracking-wider">AI Solutions</span>
              </span>
            </div>

            <div className="text-right font-sans text-[10px] sm:text-xs text-slate-500 font-semibold tracking-wider uppercase shrink-0">
              <span>CERTIFICATE ID: </span>
              <span className="text-slate-800 font-mono font-bold">{certificateId || "CERT-BM-B1-98231"}</span>
            </div>
          </div>

          {/* 2. Certificate Header Title */}
          <div className="space-y-1 pt-1">
            <div className="text-[10px] sm:text-xs font-sans font-medium text-slate-500 uppercase tracking-[0.25em]">
              CERTIFICATE OF COMPLETION
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-slate-900 tracking-wider leading-snug max-w-2xl mx-auto uppercase">
              {formattedTitle}
            </h1>
          </div>

          {/* 3. Recipient Section */}
          <div className="space-y-1 py-0.5">
            <div className="text-[10px] sm:text-[11px] font-sans font-medium text-slate-400 uppercase tracking-[0.2em]">
              ISSUED TO
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-serif font-normal text-slate-900 tracking-wide text-center">
              {name || "Kabir Mehta"}
            </div>
            {/* Subtle underline line centered under name */}
            <div className="w-28 sm:w-40 h-[1px] bg-slate-300 mx-auto mt-1.5" />
          </div>

          {/* 4. Description Text */}
          <p className="text-xs sm:text-sm text-slate-600 font-sans max-w-2xl mx-auto leading-relaxed px-4">
            Awarded for the successful completion of the <strong className="text-slate-900 font-semibold">{formattedTitle}</strong>, validating practical skills in using AI tools to improve productivity, creativity, and professional performance.
          </p>

          {/* 5. 5 Scalloped Flower Rosette Badges in 1 Single Horizontal Row */}
          <div className="py-2">
            <div className="flex items-center justify-center gap-3 sm:gap-6 flex-wrap">
              <FlowerRosette fillColor="fill-pink-500" icon={Heart} />
              <FlowerRosette fillColor="fill-orange-500" icon={Code2} />
              <FlowerRosette fillColor="fill-purple-600" icon={Sparkles} />
              <FlowerRosette fillColor="fill-rose-500" icon={Sun} />
              <FlowerRosette fillColor="fill-fuchsia-500" icon={ShieldCheck} />
            </div>
          </div>

          {/* 6. Footer: Date & CPD Stamp Left, Official QR Code Image Right */}
          <div className="flex items-end justify-between gap-6 pt-3 text-left border-t border-slate-200/80">
            
            {/* Bottom Left: Date of Issue & CPD Seal */}
            <div className="space-y-2">
              <div className="space-y-0.5">
                <div className="text-[10px] text-slate-500 font-sans font-medium">
                  Date of issue
                </div>
                <div className="w-32 border-b border-slate-300 pb-0.5 font-serif text-xs sm:text-sm font-semibold text-slate-800">
                  {issueDate}
                </div>
              </div>

              {/* Official CPD Certified Stamp Logo */}
              <div className="flex items-center gap-2 pt-0.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-950 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                  <ShieldCheck size={20} className="text-purple-300" />
                </div>
                <div className="flex flex-col text-[8.5px] font-sans leading-tight text-indigo-950">
                  <span className="text-xs font-black tracking-wider uppercase">CPD</span>
                  <span className="text-[8px] text-purple-700 tracking-wider font-bold uppercase">CERTIFIED</span>
                  <span className="text-[7px] text-slate-400 font-normal">The CPD Certification Service</span>
                </div>
              </div>
            </div>

            {/* Bottom Right: Official Scannable QR Code Image */}
            <div className="flex flex-col items-end gap-1 shrink-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white p-1 rounded-lg border border-slate-300 shadow-xs flex items-center justify-center overflow-hidden">
                <img
                  src="/qr-code.png"
                  alt="QR Code Verification"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

          </div>

          {/* Bottom Fine Print Disclaimer */}
          <div className="text-[8px] sm:text-[8.5px] text-slate-400 font-sans pt-1">
            All trademarks, logos, and brand names are the property of their respective owners. Use of these does not imply endorsement by or affiliation with Botmartz AI Solutions.
          </div>

        </div>
      </div>
    </div>
  );
}

