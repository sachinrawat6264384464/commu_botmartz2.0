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
    <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center transform hover:scale-110 transition-transform filter drop-shadow-md">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Smooth 12-lobed scalloped flower path */}
        <path
          d="M 50,4 C 55,4 57,9 62,11 C 67,13 72,10 76,14 C 80,18 78,23 81,28 C 84,33 90,34 91,39 C 92,44 88,48 88,53 C 88,58 92,62 91,67 C 90,72 84,74 81,79 C 78,84 80,89 76,92 C 72,96 67,93 62,95 C 57,97 55,102 50,102 C 45,102 43,97 38,95 C 33,93 28,96 24,92 C 20,89 22,84 19,79 C 16,74 10,72 9,67 C 8,62 12,58 12,53 C 12,48 8,44 9,39 C 10,34 16,33 19,28 C 22,23 20,18 24,14 C 28,10 33,13 38,11 C 43,9 45,4 50,4 Z"
          className={fillColor}
        />
        {/* Inner subtle dashed white ring */}
        <circle cx="50" cy="53" r="30" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
      </svg>
      <Icon className="absolute text-white stroke-[2.2] drop-shadow-xs" size={22} />
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
    <div className={`w-full max-w-4xl mx-auto rounded-[28px] bg-[#4F46E5] p-3.5 sm:p-5 shadow-2xl ${className}`}>
      {/* Inner Light Blue Certificate Container */}
      <div className="relative w-full rounded-[22px] bg-[#F0F5FE] p-6 sm:p-10 shadow-inner overflow-hidden font-sans text-slate-900">
        
        {/* Background Light Blue Security Micro-Grid & Watermark */}
        <div className="absolute inset-0 bg-[radial-gradient(#a5b4fc_1.2px,transparent_1.2px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        {/* Certificate Content */}
        <div className="relative space-y-6 text-center">
          
          {/* 1. Top Header: Cursive Brand Logo Left, ID Right */}
          <div className="flex items-center justify-between gap-4 pb-2">
            {/* Elegant Cursive Script Brand Logo (Matching "Coursiv" style from reference image) */}
            <div className="flex items-center gap-1.5">
              <span className="font-serif italic font-bold text-indigo-700 text-3xl sm:text-4xl tracking-tight leading-none drop-shadow-xs">
                Botmartz
              </span>
            </div>

            <div className="text-right font-sans text-[10px] sm:text-xs text-slate-400 font-semibold tracking-wider uppercase">
              <span>CERTIFICATE ID: </span>
              <span className="text-slate-700 font-mono font-bold">{certificateId || "CERT-BM-B1-98231"}</span>
            </div>
          </div>

          {/* 2. Certificate Header Title */}
          <div className="space-y-2 pt-2">
            <div className="text-[11px] sm:text-xs font-sans font-medium text-slate-500 uppercase tracking-[0.25em]">
              CERTIFICATE OF COMPLETION
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-slate-900 tracking-wider leading-snug max-w-2xl mx-auto uppercase">
              {formattedTitle}
            </h1>
          </div>

          {/* 3. Recipient Section */}
          <div className="space-y-1.5 py-1">
            <div className="text-[10px] sm:text-[11px] font-sans font-medium text-slate-400 uppercase tracking-[0.2em]">
              ISSUED TO
            </div>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-slate-900 tracking-wide text-center">
              {name || "Kabir Mehta"}
            </div>
            {/* Subtle underline line centered under name */}
            <div className="w-32 sm:w-44 h-[1px] bg-slate-300 mx-auto mt-2" />
          </div>

          {/* 4. Description Text */}
          <p className="text-xs sm:text-sm text-slate-600 font-sans max-w-2xl mx-auto leading-relaxed px-4">
            Awarded for the successful completion of the <strong className="text-slate-900 font-semibold">{formattedTitle}</strong>, validating practical skills in using AI tools to improve productivity, creativity, and professional performance.
          </p>

          {/* 5. 5 Scalloped Flower Rosette Badges (Exact 3-top, 2-bottom replica of Target Screenshot 2!) */}
          <div className="py-4">
            <div className="flex flex-col items-center space-y-3">
              {/* Top Row: 3 Flower Rosettes */}
              <div className="flex items-center justify-center gap-6 sm:gap-10">
                <FlowerRosette fillColor="fill-pink-500" icon={Heart} />
                <FlowerRosette fillColor="fill-orange-500" icon={Code2} />
                <FlowerRosette fillColor="fill-purple-600" icon={Sparkles} />
              </div>
              {/* Bottom Row: 2 Flower Rosettes */}
              <div className="flex items-center justify-center gap-6 sm:gap-10">
                <FlowerRosette fillColor="fill-rose-500" icon={Sun} />
                <FlowerRosette fillColor="fill-fuchsia-500" icon={ShieldCheck} />
              </div>
            </div>
          </div>

          {/* 6. Footer: Date & CPD Stamp Left, QR Code Right (Exact Replica of Screenshot 2!) */}
          <div className="flex items-end justify-between gap-6 pt-4 text-left border-t border-slate-100">
            
            {/* Bottom Left: Date of Issue & CPD Seal */}
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="text-[11px] text-slate-500 font-sans font-medium">
                  Date of issue
                </div>
                <div className="w-36 border-b border-slate-300 pb-1 font-serif text-sm font-semibold text-slate-800">
                  {issueDate}
                </div>
              </div>

              {/* Official CPD Certified Stamp Logo */}
              <div className="flex items-center gap-2 pt-1">
                <div className="w-9 h-9 rounded-lg bg-indigo-950 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                  <ShieldCheck size={22} className="text-purple-300" />
                </div>
                <div className="flex flex-col text-[9px] font-sans leading-tight text-indigo-950">
                  <span className="text-xs font-black tracking-wider uppercase">CPD</span>
                  <span className="text-[8px] text-purple-700 tracking-wider font-bold uppercase">CERTIFIED</span>
                  <span className="text-[7px] text-slate-400 font-normal">The CPD Certification Service</span>
                </div>
              </div>
            </div>

            {/* Bottom Right: Clean Scannable QR Code */}
            <div className="flex flex-col items-end gap-1 shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white p-1 rounded-lg border border-slate-300 shadow-xs flex items-center justify-center">
                <QrCode size={56} className="text-slate-900" />
              </div>
            </div>

          </div>

          {/* Bottom Fine Print Disclaimer */}
          <div className="text-[8px] sm:text-[9px] text-slate-400 font-sans pt-2">
            All trademarks, logos, and brand names are the property of their respective owners. Use of these does not imply endorsement by or affiliation with Botmartz AI Solutions.
          </div>

        </div>
      </div>
    </div>
  );
}

