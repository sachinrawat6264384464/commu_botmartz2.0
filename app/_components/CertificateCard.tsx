"use client";

import React from "react";
import { Heart, Sparkles, Code2, Sun, ShieldCheck, Award } from "lucide-react";

interface BadgeItem {
  name?: string;
  color?: string;
  icon?: any;
}

interface CertificateCardProps {
  certificateId?: string;
  name?: string;
  eventTitle?: string;
  issueDate?: string;
  badges?: BadgeItem[];
  className?: string;
}

const COLOR_MAP: Record<string, string> = {
  "fill-pink-500": "#ec4899",
  "fill-orange-500": "#f97316",
  "fill-purple-500": "#a855f7",
  "fill-rose-500": "#f43f5e",
  "fill-amber-400": "#fbbf24",
  "fill-emerald-400": "#10b981",
  "fill-blue-500": "#3b82f6",
  "fill-indigo-500": "#6366f1"
};

// Scalloped Badge Rosette with inline hex fill for 100% html2canvas rendering
function BadgeRosette({
  color = "fill-pink-500",
  icon: Icon = Heart
}: {
  color?: string;
  icon?: any;
}) {
  const hexColor = COLOR_MAP[color] || (color.startsWith("#") ? color : "#ec4899");

  return (
    <div className="relative w-9 h-9 sm:w-12 sm:h-12 lg:w-16 lg:h-16 flex items-center justify-center filter drop-shadow-lg transform hover:scale-110 transition-transform shrink-0">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path
          d="M 50,4 C 55,4 57,9 62,11 C 67,13 72,10 76,14 C 80,18 78,23 81,28 C 84,33 90,34 91,39 C 92,44 88,48 88,53 C 88,58 92,62 91,67 C 90,72 84,74 81,79 C 78,84 80,89 76,92 C 72,96 67,93 62,95 C 57,97 55,102 50,102 C 45,102 43,97 38,95 C 33,93 28,96 24,92 C 20,89 22,84 19,79 C 16,74 10,72 9,67 C 8,62 12,58 12,53 C 12,48 8,44 9,39 C 10,34 16,33 19,26 C 22,23 20,18 24,12 C 28,10 33,13 38,11 C 43,9 45,4 50,4 Z"
          fill={hexColor}
        />
        <circle cx="50" cy="53" r="30" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="3 3" opacity="0.85" />
      </svg>
      <Icon className="absolute text-white stroke-[2.5] drop-shadow-md w-4.5 h-4.5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
    </div>
  );
}

export default function CertificateCard({
  certificateId,
  name,
  eventTitle,
  issueDate = "9 August 2026",
  badges,
  className = ""
}: CertificateCardProps) {
  const formattedTitle = eventTitle || "AI Mastery Certificate Program";
  const candidateName = name || "Sachin Rawat";

  const defaultBadges = [
    { color: "fill-pink-500", icon: Heart },
    { color: "fill-orange-500", icon: Code2 },
    { color: "fill-purple-500", icon: Sparkles },
    { color: "fill-rose-500", icon: Sun },
    { color: "fill-amber-400", icon: ShieldCheck },
    { color: "fill-emerald-400", icon: Award }
  ];

  const badgeList = badges && badges.length >= 6 ? badges : defaultBadges;

  return (
    <div className={`w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-200 bg-white font-sans ${className}`}>
      {/* Container maintaining exact 2000:1414 template aspect ratio */}
      <div id="certificate-download-card" className="relative w-full aspect-[2000/1414] overflow-hidden select-none bg-white">
        
        {/* 1. Base Original Template Image */}
        <img
          src="/Blue and Yellow Modern Certificate of Completion.png"
          alt="Certificate of Completion Template"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* 1. DYNAMIC "Certificate of Completion" HEADER OVERLAY (Centered alignment for "of Completion" under "Certificate") */}
        <div className="absolute left-[2.8%] top-[3.5%] w-[53%] h-[21%] bg-white z-10 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-sans font-extrabold text-[#0066FF] tracking-tight leading-none">
            Certificate
          </h1>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-sans font-semibold text-[#0066FF] tracking-normal pt-1">
            of Completion
          </h2>
        </div>


        {/* 2. SINGLE SOLID WHITE MASK PANEL (Safely positioned below "of Completion" at top-[25.5%] to avoid clipping) */}
        <div className="absolute left-[2.8%] top-[25.5%] w-[53%] h-[50%] bg-white z-10 flex flex-col items-center justify-between text-center px-4 py-2">
          
          {/* Project Title (Directly below "of Completion" in BOLD BLACK) */}
          <div className="w-full">
            <h4 className="text-sm sm:text-base lg:text-xl font-black text-slate-900 tracking-wide font-sans max-w-lg mx-auto leading-snug">
              {formattedTitle}
            </h4>
          </div>

          {/* Certify Intro */}
          <p className="text-xs sm:text-base font-sans font-semibold text-slate-600 tracking-wide">
            This is to proudly certify that
          </p>

          {/* Candidate Name + Blue Underline */}
          <div className="w-full space-y-1">
            <h3 className="text-4xl sm:text-6xl lg:text-7xl font-sans font-extrabold text-[#0066FF] tracking-tight leading-none">
              {candidateName}
            </h3>
            <div className="w-56 sm:w-72 lg:w-80 h-[4px] bg-[#0066FF] mx-auto rounded-full" />
          </div>

          {/* Description Paragraph */}
          <p className="text-xs sm:text-base lg:text-lg text-slate-800 font-sans font-medium leading-relaxed max-w-xl pb-1">
            for the successful completion of the program, validating practical skills in using AI tools to improve productivity, creativity, and professional performance.
          </p>

        </div>


        {/* 4. DYNAMIC BADGES EARNED TRIANGLE OVERLAY (Moved slightly down for perfect centering) */}
        <div className="absolute left-[58.5%] top-[34.5%] w-[35%] max-h-[44%] flex flex-col items-center justify-center gap-2 sm:gap-3.5 z-10 px-1">
          {/* Triangle Row 1: 1 Badge (Top Apex) */}
          <div className="flex justify-center">
            <BadgeRosette color={badgeList[0]?.color || "fill-pink-500"} icon={badgeList[0]?.icon || Heart} />
          </div>

          {/* Triangle Row 2: 2 Badges (Middle) */}
          <div className="flex justify-center gap-4 sm:gap-6 lg:gap-8">
            <BadgeRosette color={badgeList[1]?.color || "fill-orange-500"} icon={badgeList[1]?.icon || Code2} />
            <BadgeRosette color={badgeList[2]?.color || "fill-purple-500"} icon={badgeList[2]?.icon || Sparkles} />
          </div>

          {/* Triangle Row 3: 3 Badges (Base) */}
          <div className="flex justify-center gap-3 sm:gap-5 lg:gap-7">
            <BadgeRosette color={badgeList[3]?.color || "fill-rose-500"} icon={badgeList[3]?.icon || Sun} />
            <BadgeRosette color={badgeList[4]?.color || "fill-amber-400"} icon={badgeList[4]?.icon || ShieldCheck} />
            <BadgeRosette color={badgeList[5]?.color || "fill-emerald-400"} icon={badgeList[5]?.icon || Award} />
          </div>
        </div>


      </div>
    </div>
  );
}





