"use client";

import React, { useState } from "react";
import { X, Copy, Check, ExternalLink, Linkedin, Sparkles, ShieldCheck, Award, Flame, Terminal } from "lucide-react";

interface LinkedInShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  projectTitle: string;
  certificateId?: string;
  verificationUrl?: string;
  earnedBadges?: string[];
  rank?: number;
  totalPoints?: number;
  mode?: "certificate" | "daily_log";
  dayNumber?: number;
  commitUrl?: string;
  researchNotes?: string;
}

export default function LinkedInShareModal({
  isOpen,
  onClose,
  candidateName,
  projectTitle,
  certificateId = "CERT-BM-982314",
  verificationUrl = "https://community.botmartz.com/certificates",
  earnedBadges = ["10-Day Streak", "Foundations & AI"],
  rank = 1,
  totalPoints = 2151,
  mode = "certificate",
  dayNumber = 1,
  commitUrl = "",
  researchNotes = ""
}: LinkedInShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const isDaily = mode === "daily_log";

  // Auto-generate post content depending on mode (Certificate completion vs Daily PoW log)
  const defaultPostContent = isDaily
    ? `🚀 Day ${dayNumber} of 45 | AI Engineering Sprint Update ⚡

Just logged today's GitHub commit for "${projectTitle}" on @Botmartz AI Solutions!

🎯 Progress: Day ${dayNumber}/45 Completed
${commitUrl ? `💻 GitHub Proof-of-Work: ${commitUrl}` : ""}
${researchNotes ? `📝 Key Focus: ${researchNotes.slice(0, 150)}...` : ""}

Mentored by Soham Sharma (Founder & Lead Architect, Botmartz AI Solutions). Building in public! 🚀

#Botmartz #SohamSharma #45DaysOfCode #BuildInPublic #AIEngineering #DevOps #ProofOfWork`
    : `🚀 Excited to announce that I have successfully completed the ${projectTitle} & 45-Day Proof-of-Work Sprint with @Botmartz AI Solutions!

Mentored by Soham Sharma (Founder & Lead Architect, Botmartz AI Solutions). Unlocked ${earnedBadges.length} curriculum & streak badges! 🚀

Leaderboard Rank #${rank} | Total XP: ${totalPoints} Pts

📜 Certificate Verification ID: ${certificateId}
🔗 Verify Credential: ${verificationUrl}

#Botmartz #SohamSharma #AIEngineering #DevOps #ProofOfWork #CloudDevOpsHub #BuildInPublic`;

  const handleCopy = () => {
    navigator.clipboard.writeText(defaultPostContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleLinkedInShare = () => {
    try {
      navigator.clipboard.writeText(defaultPostContent);
    } catch (e) {
      console.warn("Clipboard copy failed", e);
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 5000);

    // Open LinkedIn Feed with shareActive=true and encoded text parameter
    const encodedText = encodeURIComponent(defaultPostContent);
    const linkedInFeedUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodedText}`;
    window.open(linkedInFeedUrl, "_blank");
  };

  const handleAddToLinkedInProfile = () => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const certName = encodeURIComponent(projectTitle || "45-Day Virtual AI Engineering Fellowship");
    const orgName = encodeURIComponent("Botmartz AI Solutions");
    const certUrl = encodeURIComponent(
      verificationUrl.includes("localhost")
        ? `https://community.botmartz.com/certificates?query=${certificateId}`
        : verificationUrl
    );
    const certId = encodeURIComponent(certificateId);

    // Official LinkedIn Profile Add License & Certification Deep Link URL
    const addCertUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${certName}&organizationName=${orgName}&issueYear=${year}&issueMonth=${month}&certUrl=${certUrl}&certId=${certId}`;
    window.open(addCertUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden font-sans">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-blue-950 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#0066FF] flex items-center justify-center text-white font-bold">
              <Linkedin size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm font-sans text-white">
                {isDaily ? `Share Day ${dayNumber} Progress on LinkedIn` : "Share Verified Credential"}
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                {isDaily ? "Daily Proof-of-Work Standup" : "LinkedIn UGC & Certifications"} &bull; Botmartz AI Solutions
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {/* Badge / Info Pill */}
          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-center justify-between text-xs font-mono">
            {isDaily ? (
              <div className="flex items-center gap-2 text-[#0066FF] font-bold">
                <Flame size={16} className="text-amber-500" />
                <span>Sprint Progress: Day {dayNumber} / 45</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[#0066FF] font-bold">
                <ShieldCheck size={16} />
                <span>Verified Certificate: {certificateId}</span>
              </div>
            )}
            <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
              {isDaily ? "+50 Coins Bonus ⭐" : "Soham Sharma Signed"}
            </span>
          </div>

          {/* Copied Success Banner */}
          {copied && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-mono flex items-center gap-2 animate-fadeIn">
              <Check size={16} className="text-emerald-600 shrink-0" />
              <span><strong>Post Text Copied to Clipboard!</strong> Press <strong>Ctrl + V</strong> in LinkedIn post box if not pre-filled automatically.</span>
            </div>
          )}

          {/* Pre-filled Post Editor Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-600">
              <label>{isDaily ? "Daily Log Post Template (Auto-Generated)" : "LinkedIn Post Template (Auto-Generated)"}</label>
              <button
                onClick={handleCopy}
                className="text-[#0066FF] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                <span>{copied ? "Copied to Clipboard!" : "Copy Text"}</span>
              </button>
            </div>

            <textarea
              readOnly
              value={defaultPostContent}
              rows={7}
              className="w-full rounded-2xl bg-slate-50 border border-slate-300 p-3.5 text-xs text-slate-800 font-mono focus:outline-none focus:border-[#0066FF] leading-relaxed resize-none"
            />
          </div>

          {/* Mentorship & Credential Confirmation */}
          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <Award size={16} className="text-amber-500 shrink-0" />
            <span>
              {isDaily
                ? "Posting your daily log on LinkedIn earns +50 Karma Coins and builds your public builder portfolio."
                : "Post text includes your proof-of-work badges, certificate verification link, and Soham Sharma founder mentorship tag."}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2.5">
            {!isDaily && (
              <button
                onClick={handleAddToLinkedInProfile}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold font-mono text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Award size={18} />
                <span>Add License &amp; Certification to LinkedIn Profile 📜</span>
              </button>
            )}

            <button
              onClick={handleLinkedInShare}
              className="w-full py-3.5 rounded-2xl bg-[#0077B5] hover:bg-[#006097] text-white font-bold font-mono text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Linkedin size={18} />
              <span>{isDaily ? `Post Day ${dayNumber} Log on LinkedIn ↗` : "Post Feed Update on LinkedIn ↗"}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

