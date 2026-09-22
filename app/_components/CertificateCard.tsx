"use client";

import React from "react";
import { Heart, Sparkles, Code2, Sun, ShieldCheck, Award } from "lucide-react";

interface BadgeItem {
  name: string;
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

// Scalloped Badge Rosette pill for Blue Column
function BadgePill({
  color = "bg-pink-500",
  icon: Icon = Heart,
  label
}: {
  color?: string;
  icon?: any;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2.5 sm:gap-3 bg-white/15 hover:bg-white/25 backdrop-blur-md px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all border border-white/20 shadow-md">
      <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full ${color} flex items-center justify-center text-white shrink-0 shadow-lg`}>
        <Icon size={14} className="stroke-[2.5]" />
      </div>
      <span className="text-[11px] sm:text-xs lg:text-sm font-bold text-white tracking-wide font-sans leading-tight drop-shadow-xs">
        {label}
      </span>
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

  const defaultBadges: BadgeItem[] = [
    { name: "Foundations & AI", color: "bg-pink-500", icon: Heart },
    { name: "Python Agents", color: "bg-orange-500", icon: Code2 },
    { name: "MCP Architecture", color: "bg-purple-500", icon: Sparkles },
    { name: "Linux & Cloud GCP", color: "bg-rose-500", icon: Sun },
    { name: "AWS Services", color: "bg-amber-400", icon: ShieldCheck }
  ];

  const badgeList = badges && badges.length > 0 ? badges : defaultBadges;

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

        {/* 4. DYNAMIC BADGES EARNED OVERLAY (Placed inside Blue Ribbon Column) */}
        <div className="absolute left-[59%] top-[30.5%] w-[34%] max-h-[46%] flex flex-col justify-start gap-2 sm:gap-2.5 z-10 px-1 overflow-y-auto">
          {badgeList.map((badge, idx) => (
            <BadgePill
              key={idx}
              color={badge.color || "bg-cyan-500"}
              icon={badge.icon || Award}
              label={badge.name}
            />
          ))}
        </div>

      </div>
    </div>
  );
}




