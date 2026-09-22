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

// Scalloped Badge Rosette without text labels
function BadgeRosette({
  color = "fill-pink-500",
  icon: Icon = Heart
}: {
  color?: string;
  icon?: any;
}) {
  return (
    <div className="relative w-8 h-8 sm:w-11 sm:h-11 lg:w-14 lg:h-14 flex items-center justify-center filter drop-shadow-lg transform hover:scale-110 transition-transform">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path
          d="M 50,4 C 55,4 57,9 62,11 C 67,13 72,10 76,14 C 80,18 78,23 81,28 C 84,33 90,34 91,39 C 92,44 88,48 88,53 C 88,58 92,62 91,67 C 90,72 84,74 81,79 C 78,84 80,89 76,92 C 72,96 67,93 62,95 C 57,97 55,102 50,102 C 45,102 43,97 38,95 C 33,93 28,96 24,92 C 20,89 22,84 19,79 C 16,74 10,72 9,67 C 8,62 12,58 12,53 C 12,48 8,44 9,39 C 10,34 16,33 19,26 C 22,23 20,18 24,12 C 28,10 33,13 38,11 C 43,9 45,4 50,4 Z"
          className={color}
        />
        <circle cx="50" cy="53" r="30" fill="none" stroke="white" strokeWidth="2.5" strokeDasharray="3 3" opacity="0.85" />
      </svg>
      <Icon className="absolute text-white stroke-[2.2] drop-shadow-md w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7" />
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
      <div className="relative w-full aspect-[2000/1414] overflow-hidden select-none">
        
        {/* 1. Base Original Template Image */}
        <img
          src="/Blue and Yellow Modern Certificate of Completion.png"
          alt="Certificate of Completion Template"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* 2. DYNAMIC CANDIDATE NAME OVERLAY (Covers sample name in template) */}
        <div className="absolute left-[6.8%] top-[45.8%] w-[48%] bg-white py-1 z-10">
          <h3 className="text-2xl sm:text-4xl lg:text-5xl font-sans font-extrabold text-[#0066FF] tracking-tight leading-tight">
            {candidateName}
          </h3>
          <div className="w-full h-[3px] bg-[#0066FF] rounded-full mt-1.5" />
        </div>

        {/* 3. DYNAMIC PROJECT TITLE / DESCRIPTION OVERLAY */}
        <div className="absolute left-[6.8%] top-[58.5%] w-[48%] bg-white py-1 z-10">
          <p className="text-[10px] sm:text-xs lg:text-sm text-slate-800 font-sans leading-relaxed">
            for the successful completion of the <strong className="font-extrabold text-slate-900">{formattedTitle}</strong>, validating practical skills in using AI tools to improve productivity, creativity, and professional performance.
          </p>
        </div>

        {/* 4. DYNAMIC BADGES EARNED TRIANGLE/PYRAMID OVERLAY (No text names, purely shape badges) */}
        <div className="absolute left-[58.5%] top-[27.5%] w-[35%] max-h-[48%] flex flex-col items-center justify-center gap-1.5 sm:gap-2.5 z-10 px-1">
          {/* Triangle Row 1: 1 Badge (Top Apex) */}
          <div className="flex justify-center">
            <BadgeRosette color={badgeList[0]?.color || "fill-pink-500"} icon={badgeList[0]?.icon || Heart} />
          </div>

          {/* Triangle Row 2: 2 Badges (Middle) */}
          <div className="flex justify-center gap-3 sm:gap-5 lg:gap-7">
            <BadgeRosette color={badgeList[1]?.color || "fill-orange-500"} icon={badgeList[1]?.icon || Code2} />
            <BadgeRosette color={badgeList[2]?.color || "fill-purple-500"} icon={badgeList[2]?.icon || Sparkles} />
          </div>

          {/* Triangle Row 3: 3 Badges (Base) */}
          <div className="flex justify-center gap-2 sm:gap-4 lg:gap-6">
            <BadgeRosette color={badgeList[3]?.color || "fill-rose-500"} icon={badgeList[3]?.icon || Sun} />
            <BadgeRosette color={badgeList[4]?.color || "fill-amber-400"} icon={badgeList[4]?.icon || ShieldCheck} />
            <BadgeRosette color={badgeList[5]?.color || "fill-emerald-400"} icon={badgeList[5]?.icon || Award} />
          </div>
        </div>

      </div>
    </div>
  );
}





