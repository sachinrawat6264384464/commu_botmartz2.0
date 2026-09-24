"use client";

import React, { useState, useEffect } from "react";
import { X, ExternalLink, Sparkles } from "lucide-react";

interface LiveCohortPopupProps {
  /** Custom image path */
  imageSrc?: string;
  /** Force open state for testing or direct trigger */
  forceOpen?: boolean;
  /** On close callback */
  onClose?: () => void;
  /** Target link to redirect on click */
  targetUrl?: string;
}

export default function LiveCohortPopup({
  imageSrc = "/gallery/LIVE COHORT (3).png",
  forceOpen = false,
  onClose,
  targetUrl = "https://classes.botmartz.com/"
}: LiveCohortPopupProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      return;
    }

    if (typeof window !== "undefined") {
      const sessionDismissed = sessionStorage.getItem("botmartz_live_cohort_popup_dismissed");
      if (sessionDismissed === "true") {
        return;
      }

      // Smooth 500ms delay on load
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [forceOpen]);

  const handleClose = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsOpen(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("botmartz_live_cohort_popup_dismissed", "true");
    }
    if (onClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      {/* Dark Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity duration-300"
        onClick={() => handleClose()}
      />

      {/* Clean Modal Container without Outer Border or Ring */}
      <div className="relative w-full max-w-sm sm:max-w-md my-auto shadow-2xl z-10 transition-all duration-300">
        
        {/* Floating Close Button */}
        <button
          onClick={(e) => handleClose(e)}
          className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-slate-950/80 hover:bg-red-600 text-white flex items-center justify-center border border-white/20 backdrop-blur-md transition-all duration-200 hover:scale-110 shadow-2xl cursor-pointer"
          title="Close"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* Clickable Image Poster Card redirecting to https://classes.botmartz.com/ */}
        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleClose()}
          className="relative block w-full rounded-2xl overflow-hidden shadow-2xl group cursor-pointer border border-transparent hover:border-blue-500/40 transition-all duration-300 bg-slate-950"
        >
          {/* Pure Poster Image */}
          <img
            src={imageSrc}
            alt="Live Cohort Announcement - Click to Join"
            className="w-full h-auto max-h-[78vh] object-contain rounded-2xl transition-transform duration-300 group-hover:scale-[1.015]"
          />

          {/* Eye-catching CTA Banner at Bottom of Poster */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent pt-6 pb-3 px-3 flex items-center justify-center">
            <div className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-mono font-bold text-xs uppercase tracking-wider text-center shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 border border-cyan-400/40 group-hover:scale-[1.02] transition-transform duration-300">
              <Sparkles size={14} className="text-amber-300 animate-pulse" />
              <span>Click Here to Register Now 🚀</span>
              <ExternalLink size={13} className="text-cyan-200" />
            </div>
          </div>
        </a>

      </div>
    </div>
  );
}
