"use client";

import React, { useState } from "react";
import { X, Copy, Check, ExternalLink, Linkedin, Sparkles, ShieldCheck, Award } from "lucide-react";

interface LinkedInShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  projectTitle: string;
  certificateId: string;
  verificationUrl: string;
  earnedBadges?: string[];
  rank?: number;
  totalPoints?: number;
}

export default function LinkedInShareModal({
  isOpen,
  onClose,
  candidateName,
  projectTitle,
  certificateId,
  verificationUrl,
  earnedBadges = ["10-Day Streak", "Foundations & AI"],
  rank = 1,
  totalPoints = 2151
}: LinkedInShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const defaultPostContent = `🚀 Excited to announce that I have successfully completed the ${projectTitle} & 45-Day Proof-of-Work Sprint with @Botmartz AI Solutions!

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
    // 1. Copy full formatted post content to clipboard automatically
    navigator.clipboard.writeText(defaultPostContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 4000);

    // 2. Ensure public URL for LinkedIn crawler (localhost URLs fail LinkedIn preview)
    const targetUrl = verificationUrl.includes("localhost")
      ? `https://community.botmartz.com/certificates?query=${certificateId}`
      : verificationUrl;

    const encodedUrl = encodeURIComponent(targetUrl);
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    window.open(linkedInUrl, "_blank", "width=650,height=700");
  };

  const handleAddToLinkedInProfile = () => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const certName = encodeURIComponent(projectTitle || "45-Day Virtual AI Engineering Fellowship");
    const orgName = encodeURIComponent("Botmartz AI Solutions");
    const certUrl = encodeURIComponent(verificationUrl);
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
              <h3 className="font-bold text-sm font-sans text-white">Share Verified Credential</h3>
              <p className="text-[11px] text-slate-400 font-mono">LinkedIn UGC &amp; Certifications &bull; Botmartz AI Solutions</p>
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
          
          {/* Badge & Certificate Info Pill */}
          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-[#0066FF] font-bold">
              <ShieldCheck size={16} />
              <span>Verified Certificate: {certificateId}</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
              Soham Sharma Signed
            </span>
          </div>

          {/* Pre-filled Post Editor Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-600">
              <label>LinkedIn Post Template (Auto-Generated)</label>
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
            <span>Post text includes your proof-of-work badges, certificate verification link, and Soham Sharma founder mentorship tag.</span>
          </div>

          {/* Action Buttons (Add to LinkedIn Profile + Post Feed Update) */}
          <div className="pt-2 space-y-2.5">
            <button
              onClick={handleAddToLinkedInProfile}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold font-mono text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Award size={18} />
              <span>Add License &amp; Certification to LinkedIn Profile 📜</span>
            </button>

            <button
              onClick={handleLinkedInShare}
              className="w-full py-3.5 rounded-2xl bg-[#0077B5] hover:bg-[#006097] text-white font-bold font-mono text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Linkedin size={18} />
              <span>Post Feed Update on LinkedIn ↗</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
