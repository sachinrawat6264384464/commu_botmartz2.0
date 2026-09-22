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
    <div className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3 py-2 rounded-xl transition-all border border-white/15">
      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${color} flex items-center justify-center text-white shrink-0 shadow-md`}>
        <Icon size={15} className="stroke-[2.5]" />
      </div>
      <span className="text-xs font-semibold text-white tracking-wide font-sans leading-tight">
        {label}
      </span>
    </div>
  );
}

// Yellow dots pattern
function DotGrid({ className }: { className?: string }) {
  return (
    <svg width="44" height="28" viewBox="0 0 44 28" fill="none" className={className}>
      <circle cx="4" cy="4" r="2.5" fill="#FFC700" />
      <circle cx="16" cy="4" r="2.5" fill="#FFC700" />
      <circle cx="28" cy="4" r="2.5" fill="#FFC700" />
      <circle cx="40" cy="4" r="2.5" fill="#FFC700" />
      <circle cx="4" cy="14" r="2.5" fill="#FFC700" />
      <circle cx="16" cy="14" r="2.5" fill="#FFC700" />
      <circle cx="28" cy="14" r="2.5" fill="#FFC700" />
      <circle cx="40" cy="14" r="2.5" fill="#FFC700" />
      <circle cx="4" cy="24" r="2.5" fill="#FFC700" />
      <circle cx="16" cy="24" r="2.5" fill="#FFC700" />
      <circle cx="28" cy="24" r="2.5" fill="#FFC700" />
      <circle cx="40" cy="24" r="2.5" fill="#FFC700" />
    </svg>
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
    <div className={`w-full max-w-5xl mx-auto rounded-3xl bg-white border-4 border-slate-200 shadow-2xl overflow-hidden font-sans text-slate-900 ${className}`}>
      <div className="flex flex-col md:flex-row min-h-[500px] relative">
        
        {/* ── 1. LEFT MAIN CERTIFICATE BODY (White Background) ── */}
        <div className="flex-1 p-6 sm:p-10 flex flex-col justify-between relative bg-white min-h-[460px]">
          
          {/* Top Left Yellow Dots Grid */}
          <DotGrid className="absolute top-5 left-6" />

          {/* Certificate Header Title */}
          <div className="pt-6 space-y-1 relative z-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-sans font-extrabold text-[#0066FF] tracking-tight leading-none">
              Certificate
            </h1>
            <h2 className="text-2xl sm:text-3xl font-sans font-semibold text-[#0066FF] tracking-normal">
              of Completion
            </h2>
          </div>

          {/* Candidate Name & Certificate Body */}
          <div className="space-y-3 py-6 relative z-10">
            <p className="text-sm sm:text-base font-sans font-medium text-slate-700">
              This is to proudly certify that
            </p>
            
            <div className="inline-block">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-extrabold text-[#0066FF] tracking-tight pb-1">
                {candidateName}
              </h3>
              {/* Blue Horizontal Underline */}
              <div className="w-full h-[3px] bg-[#0066FF] rounded-full" />
            </div>

            {/* Description Paragraph */}
            <p className="text-xs sm:text-sm text-slate-700 font-sans max-w-lg leading-relaxed pt-2">
              for the successful completion of the <strong className="text-slate-900 font-bold">{formattedTitle}</strong>, validating practical skills in using AI tools to improve productivity, creativity, and professional performance.
            </p>
          </div>

          {/* Bottom Left: Founder Signature & Designation */}
          <div className="relative z-10 pt-2">
            {/* Signature Graphic */}
            <div className="font-serif italic font-extrabold text-blue-900 text-3xl pb-1 select-none">
              <span className="font-italic text-[#0066FF] border-b-2 border-[#0066FF] pb-0.5 inline-block">
                Soham
              </span>
            </div>
            <div>
              <div className="font-bold text-slate-900 text-base sm:text-lg leading-tight">
                Soham Sharma
              </div>
              <div className="text-[10px] sm:text-xs font-bold text-[#0066FF] uppercase tracking-wider">
                FOUNDER,
              </div>
              <div className="text-[10px] sm:text-xs font-bold text-[#0066FF] uppercase tracking-wider">
                BOTMARTZ AI SOLUTIONS PVT LTD
              </div>
            </div>
          </div>

          {/* Bottom-Left Yellow Triangle Accent */}
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" className="absolute bottom-0 left-0 pointer-events-none">
            <polygon points="0,60 0,20 40,60" fill="#FFC700" />
          </svg>

          {/* Bottom-Right Yellow Dots Grid */}
          <DotGrid className="absolute bottom-5 right-6" />

        </div>

        {/* ── 2. RIGHT BLUE RIBBON COLUMN (Badges Earned) ── */}
        <div className="w-full md:w-80 bg-[#0066FF] p-6 text-white flex flex-col justify-between relative shrink-0">
          
          <div className="space-y-5 relative z-10">
            {/* Top Brand Header */}
            <div className="text-center space-y-1">
              <div className="flex items-center justify-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-base">
                  🤖
                </div>
                <span className="font-extrabold font-sans text-xl tracking-wider text-white">
                  BOTMARTZ
                </span>
              </div>
              <div className="text-[10px] font-bold text-blue-200 uppercase tracking-widest border-t border-blue-400/40 pt-1">
                AI SOLUTIONS
              </div>
              {/* White Dots */}
              <div className="flex justify-center gap-1.5 text-white/80 text-xs tracking-widest pt-0.5">
                &bull; &bull; &bull; &bull; &bull; &bull;
              </div>
            </div>

            {/* Badges Earned Heading */}
            <div className="text-center pt-2">
              <h3 className="text-xl font-bold font-sans tracking-wide text-white">
                Badges Earned
              </h3>
            </div>

            {/* Earned Badges Stack */}
            <div className="space-y-2.5">
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

          {/* Bottom Rosette Badge Seal */}
          <div className="relative pt-8 pb-4 flex justify-center">
            <div className="relative w-20 h-20 flex items-center justify-center filter drop-shadow-xl transform hover:scale-105 transition-transform">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path
                  d="M 50,2 C 55,2 57,7 62,9 C 67,11 72,8 76,12 C 80,16 78,21 81,26 C 84,31 90,32 91,37 C 92,42 88,46 88,51 C 88,56 92,60 91,65 C 90,70 84,72 81,77 C 78,82 80,87 76,90 C 72,94 67,91 62,93 C 57,95 55,100 50,100 C 45,100 43,95 38,93 C 33,91 28,94 24,90 C 20,87 22,82 19,77 C 16,72 10,70 9,65 C 8,60 12,56 12,51 C 12,46 8,42 9,37 C 10,32 16,31 19,26 C 22,21 20,16 24,12 C 28,8 33,11 38,9 C 43,7 45,2 50,2 Z"
                  className="fill-slate-100 stroke-slate-300"
                  strokeWidth="2"
                />
                <circle cx="50" cy="51" r="34" className="fill-[#0055EE]" />
                <circle cx="50" cy="51" r="30" fill="none" stroke="#FFC700" strokeWidth="2" strokeDasharray="4 2" />
              </svg>
              <div className="absolute text-center text-white font-sans text-[8px] font-extrabold uppercase leading-none">
                <div className="text-[10px]">🤖</div>
                <div className="text-[#FFC700]">BOTMARTZ</div>
                <div className="text-[6px] text-blue-100">COMMUNITY</div>
              </div>
            </div>
          </div>

        </div>

        {/* ── 3. FAR RIGHT YELLOW ACCENT BAR ── */}
        <div className="hidden md:block w-4 bg-[#FFC700] shrink-0" />

      </div>
    </div>
  );
}



