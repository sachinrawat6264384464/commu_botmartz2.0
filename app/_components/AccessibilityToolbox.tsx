"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Sparkles,
  Eye,
  HelpCircle,
  X,
  RotateCcw,
  Check,
  Volume2,
  MousePointer,
  Baseline,
  Compass,
  Link2,
  Heading,
  Pause,
  Maximize2,
  Focus
} from "lucide-react";

// Types
export type TextScaling = "100" | "115" | "130" | "145";
export type ContrastMode = "normal" | "high-contrast" | "dark-high-contrast" | "monochrome" | "low-saturation" | "invert";

interface AccessibilityState {
  textScaling: TextScaling;
  contrast: ContrastMode;
  dyslexiaFont: boolean;
  readingGuide: boolean;
  highlightLinks: boolean;
  highlightHeadings: boolean;
  stopAnimations: boolean;
  largeCursor: boolean;
  focusRing: boolean;
  hoverToSpeak: boolean;
  activeProfile: string | null;
}

const DEFAULT_STATE: AccessibilityState = {
  textScaling: "100",
  contrast: "normal",
  dyslexiaFont: false,
  readingGuide: false,
  highlightLinks: false,
  highlightHeadings: false,
  stopAnimations: false,
  largeCursor: false,
  focusRing: false,
  hoverToSpeak: false,
  activeProfile: null
};

// Swastik SVG Component (Ancient symbol of auspiciousness & universal wellbeing)
function SwastikIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Center Swastik Motif */}
      <path d="M12 4v16" />
      <path d="M4 12h16" />
      <path d="M12 4h8" />
      <path d="M12 20H4" />
      <path d="M4 12V4" />
      <path d="M20 12v8" />
    </svg>
  );
}

export default function AccessibilityToolbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"profiles" | "controls" | "guide">("profiles");
  const [state, setState] = useState<AccessibilityState>(DEFAULT_STATE);
  const [mouseY, setMouseY] = useState(0);

  // Load saved preferences on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("botmartz_a11y_settings");
      if (saved) {
        setState(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Could not load accessibility settings", e);
    }
  }, []);

  // Save preferences & apply global DOM modifications
  useEffect(() => {
    try {
      localStorage.setItem("botmartz_a11y_settings", JSON.stringify(state));
    } catch (e) {
      // ignore
    }

    const docEl = document.documentElement;

    // 1. Text Scaling
    docEl.style.fontSize =
      state.textScaling === "115"
        ? "115%"
        : state.textScaling === "130"
        ? "130%"
        : state.textScaling === "145"
        ? "145%"
        : "100%";

    // 2. Contrast Modes
    docEl.classList.remove(
      "a11y-high-contrast",
      "a11y-dark-high-contrast",
      "a11y-monochrome",
      "a11y-low-saturation",
      "a11y-invert"
    );
    if (state.contrast !== "normal") {
      docEl.classList.add(`a11y-${state.contrast}`);
    }

    // 3. Toggles
    docEl.classList.toggle("a11y-dyslexia", state.dyslexiaFont);
    docEl.classList.toggle("a11y-highlight-links", state.highlightLinks);
    docEl.classList.toggle("a11y-highlight-headings", state.highlightHeadings);
    docEl.classList.toggle("a11y-stop-animations", state.stopAnimations);
    docEl.classList.toggle("a11y-large-cursor", state.largeCursor);
    docEl.classList.toggle("a11y-focus-ring", state.focusRing);
  }, [state]);

  // Keyboard shortcut listener (Alt + A & Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === "a" || e.key === "A")) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Mouse move listener for Reading Guide Bar
  useEffect(() => {
    if (!state.readingGuide) return;
    const handleMouseMove = (e: MouseEvent) => {
      setMouseY(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [state.readingGuide]);

  // Hover to speak screen reader using Web Speech API
  useEffect(() => {
    if (!state.hoverToSpeak) return;

    let synth = window.speechSynthesis;
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const text = target.innerText || target.getAttribute("alt") || target.getAttribute("aria-label");
      if (text && text.trim().length > 0 && text.trim().length < 200) {
        synth.cancel();
        const utterance = new SpeechSynthesisUtterance(text.trim());
        utterance.rate = 1.0;
        synth.speak(utterance);
      }
    };

    document.addEventListener("mouseover", handleMouseOver);
    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      synth.cancel();
    };
  }, [state.hoverToSpeak]);

  // Profile activation helper
  const activateProfile = (profileKey: string) => {
    if (profileKey === "visual") {
      setState((prev) => ({
        ...prev,
        textScaling: "130",
        contrast: "high-contrast",
        highlightLinks: true,
        focusRing: true,
        activeProfile: "visual"
      }));
    } else if (profileKey === "adhd") {
      setState((prev) => ({
        ...prev,
        textScaling: "115",
        contrast: "low-saturation",
        stopAnimations: true,
        highlightLinks: true,
        activeProfile: "adhd"
      }));
    } else if (profileKey === "dyslexia") {
      setState((prev) => ({
        ...prev,
        dyslexiaFont: true,
        readingGuide: true,
        highlightHeadings: true,
        activeProfile: "dyslexia"
      }));
    } else if (profileKey === "motor") {
      setState((prev) => ({
        ...prev,
        largeCursor: true,
        focusRing: true,
        stopAnimations: true,
        activeProfile: "motor"
      }));
    }
  };

  const resetDefaults = () => {
    setState(DEFAULT_STATE);
  };

  return (
    <>
      {/* ── GLOBAL INJECTED ACCESSIBILITY STYLES ── */}
      <style jsx global>{`
        /* Dyslexia Friendly Font & Letter Spacing */
        .a11y-dyslexia * {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Comic Sans MS", Arial, sans-serif !important;
          letter-spacing: 0.05em !important;
          word-spacing: 0.1em !important;
          line-height: 1.7 !important;
        }

        /* High Contrast Modes */
        .a11y-high-contrast {
          filter: contrast(150%) !important;
        }
        .a11y-dark-high-contrast {
          filter: contrast(200%) brightness(90%) !important;
        }
        .a11y-monochrome {
          filter: grayscale(100%) !important;
        }
        .a11y-low-saturation {
          filter: saturate(40%) !important;
        }
        .a11y-invert {
          filter: invert(100%) hue-rotate(180deg) !important;
        }

        /* Highlight Links & Buttons */
        .a11y-highlight-links a,
        .a11y-highlight-links button {
          outline: 2px dashed #0066FF !important;
          outline-offset: 2px !important;
          text-decoration: underline !important;
          font-weight: 800 !important;
        }

        /* Highlight Headings */
        .a11y-highlight-headings h1,
        .a11y-highlight-headings h2,
        .a11y-highlight-headings h3,
        .a11y-highlight-headings h4 {
          border-bottom: 3px solid #0066FF !important;
          padding-bottom: 2px !important;
        }

        /* Stop Animations & Motion */
        .a11y-stop-animations *,
        .a11y-stop-animations *::before,
        .a11y-stop-animations *::after {
          animation: none !important;
          transition: none !important;
          scroll-behavior: auto !important;
        }

        /* Large High-Visibility Cursor */
        .a11y-large-cursor,
        .a11y-large-cursor * {
          cursor: crosshair !important;
        }

        /* Keyboard Focus Ring */
        .a11y-focus-ring *:focus-visible {
          outline: 4px solid #00E5FF !important;
          outline-offset: 4px !important;
          box-shadow: 0 0 15px rgba(0, 229, 255, 0.8) !important;
        }
      `}</style>

      {/* ── READING GUIDE TRACKING BAR ── */}
      {state.readingGuide && (
        <div
          className="fixed left-0 right-0 h-8 bg-amber-400/25 pointer-events-none z-[9999] border-y-2 border-amber-400/80 shadow-md backdrop-blur-[1px] transition-transform duration-75"
          style={{ top: `${mouseY - 16}px` }}
        />
      )}

      {/* ── FLOATING ACCESSIBILITY TRIGGER BUTTON (WITH SWASTIK LOGO & LIVE BLUE POINTER) ── */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Accessibility Toolbox"
        className="fixed bottom-6 left-6 z-[999999] group w-14 h-14 sm:w-16 sm:h-16 shrink-0 inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#0066FF] via-blue-600 to-cyan-500 text-white shadow-[0_0_25px_rgba(0,102,255,0.6)] hover:shadow-[0_0_35px_rgba(0,229,255,0.8)] border-2 border-white/80 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer relative"
      >
        {/* Live Blue Glowing Pointer Dot */}
        <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-95" />
          <span className="relative inline-flex rounded-full h-4 w-4 bg-[#0066FF] border-2 border-white shadow-[0_0_12px_#00E5FF]" />
        </span>

        <SwastikIcon className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-300 group-hover:rotate-45 transition-transform duration-500 drop-shadow-[0_0_10px_rgba(52,211,153,1)]" />
        <span className="sr-only">Accessibility Toolbox</span>
        <span className="absolute left-full ml-3 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-[11px] font-mono font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl border border-slate-800">
          Accessibility (Alt+A)
        </span>
      </button>

      {/* ── ACCESSIBILITY TOOLBOX FLOATING PANEL (NO SCREEN-BLOCKING BACKDROP) ── */}
      {isOpen && (
        <div className="fixed bottom-22 left-6 z-[9999] w-[460px] sm:w-[480px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-7.5rem)] bg-[#090D16]/98 backdrop-blur-2xl border-2 border-blue-500/40 rounded-3xl shadow-[0_10px_50px_rgba(0,102,255,0.3)] overflow-hidden font-sans text-white text-xs flex flex-col animate-in slide-in-from-bottom-5 duration-200">
          
          {/* ── HEADER ── */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0066FF]/20 text-emerald-400 flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0 border border-blue-400/40">
                <SwastikIcon className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-white font-sans tracking-tight">
                    Accessibility Toolbox
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-extrabold border border-emerald-500/40">
                    WCAG 2.2 AA/AAA
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans font-medium mt-0.5">
                  Customize your visual and cognitive experience
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* ── TABS HEADER ── */}
          <div className="grid grid-cols-3 border-b border-slate-800 bg-slate-950 font-sans font-extrabold text-xs shrink-0">
            <button
              onClick={() => setActiveTab("profiles")}
              className={`py-3 flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === "profiles"
                  ? "border-[#0066FF] text-[#0066FF] bg-blue-500/10"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sparkles size={14} />
              <span>Profiles</span>
            </button>

            <button
              onClick={() => setActiveTab("controls")}
              className={`py-3 flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === "controls"
                  ? "border-[#0066FF] text-[#0066FF] bg-blue-500/10"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Eye size={14} />
              <span>Custom Controls</span>
            </button>

            <button
              onClick={() => setActiveTab("guide")}
              className={`py-3 flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === "guide"
                  ? "border-[#0066FF] text-[#0066FF] bg-blue-500/10"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <HelpCircle size={14} />
              <span>Guide</span>
            </button>
          </div>

          {/* ── TAB CONTENT SCROLLABLE BODY ── */}
          <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-5 custom-scrollbar">
            
            {/* ── TAB 1: PROFILES ── */}
            {activeTab === "profiles" && (
              <div className="space-y-4">
                <p className="text-slate-300 font-medium text-xs">
                  Select a curated accessibility profile or customize individually:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  
                  {/* 1. Visual Impairment */}
                  <div
                    onClick={() => activateProfile("visual")}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-2 relative ${
                      state.activeProfile === "visual"
                        ? "bg-blue-500/20 border-[#0066FF] shadow-lg shadow-blue-500/20"
                        : "bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-cyan-400 flex items-center justify-center">
                        <Eye size={18} />
                      </div>
                      <span className="text-[10px] font-mono font-black text-cyan-400 uppercase tracking-widest">
                        PROFILE
                      </span>
                    </div>
                    <h4 className="font-black text-sm text-white font-sans">Visual Impairment</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Large text (+30%), High Contrast theme, prominent links &amp; focus highlights.
                    </p>
                  </div>

                  {/* 2. Cognitive & ADHD */}
                  <div
                    onClick={() => activateProfile("adhd")}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-2 relative ${
                      state.activeProfile === "adhd"
                        ? "bg-purple-500/20 border-purple-500 shadow-lg shadow-purple-500/20"
                        : "bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                        <Sparkles size={18} />
                      </div>
                      <span className="text-[10px] font-mono font-black text-purple-400 uppercase tracking-widest">
                        PROFILE
                      </span>
                    </div>
                    <h4 className="font-black text-sm text-white font-sans">Cognitive &amp; ADHD</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Medium text (+15%), Low Saturation colors, paused animations, clear links.
                    </p>
                  </div>

                  {/* 3. Dyslexia & Reading */}
                  <div
                    onClick={() => activateProfile("dyslexia")}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-2 relative ${
                      state.activeProfile === "dyslexia"
                        ? "bg-amber-500/20 border-amber-500 shadow-lg shadow-amber-500/20"
                        : "bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                        <Baseline size={18} />
                      </div>
                      <span className="text-[10px] font-mono font-black text-amber-400 uppercase tracking-widest">
                        PROFILE
                      </span>
                    </div>
                    <h4 className="font-black text-sm text-white font-sans">Dyslexia &amp; Reading</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Dyslexia-friendly typography, tracking Reading Guide bar, heading underlines.
                    </p>
                  </div>

                  {/* 4. Motor Difficulty */}
                  <div
                    onClick={() => activateProfile("motor")}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-2 relative ${
                      state.activeProfile === "motor"
                        ? "bg-emerald-500/20 border-emerald-500 shadow-lg shadow-emerald-500/20"
                        : "bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Compass size={18} />
                      </div>
                      <span className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-widest">
                        PROFILE
                      </span>
                    </div>
                    <h4 className="font-black text-sm text-white font-sans">Motor Difficulty</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Big mouse cursor, bright neon focus ring, frozen motion/animations.
                    </p>
                  </div>

                </div>
              </div>
            )}

            {/* ── TAB 2: CUSTOM CONTROLS ── */}
            {activeTab === "controls" && (
              <div className="space-y-5">
                
                {/* TEXT SCALING */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 font-mono text-[11px] font-black uppercase text-slate-300">
                    <Baseline size={14} className="text-[#0066FF]" />
                    <span>TEXT SCALING</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 p-1 bg-slate-900 rounded-2xl border border-slate-800">
                    {(["100", "115", "130", "145"] as TextScaling[]).map((scale) => (
                      <button
                        key={scale}
                        type="button"
                        onClick={() => setState((prev) => ({ ...prev, textScaling: scale, activeProfile: null }))}
                        className={`py-2 rounded-xl font-mono text-xs font-black transition-all cursor-pointer ${
                          state.textScaling === scale
                            ? "bg-[#0066FF] text-white shadow-md"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {scale}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* COLOR & CONTRAST */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 font-mono text-[11px] font-black uppercase text-slate-300">
                    <Eye size={14} className="text-[#0066FF]" />
                    <span>COLOR &amp; CONTRAST</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: "normal", name: "Normal" },
                      { key: "high-contrast", name: "High Contrast" },
                      { key: "dark-high-contrast", name: "Dark High Contrast" },
                      { key: "monochrome", name: "Monochrome" },
                      { key: "low-saturation", name: "Low Saturation" },
                      { key: "invert", name: "Invert Colors" }
                    ].map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() =>
                          setState((prev) => ({
                            ...prev,
                            contrast: item.key as ContrastMode,
                            activeProfile: null
                          }))
                        }
                        className={`p-3 rounded-2xl border text-left font-extrabold text-xs transition-all flex items-center justify-between cursor-pointer ${
                          state.contrast === item.key
                            ? "bg-blue-500/20 border-[#0066FF] text-cyan-300"
                            : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        <span>{item.name}</span>
                        {state.contrast === item.key && <Check size={14} className="text-cyan-400" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* COGNITIVE & VISUAL ASSISTS TOGGLES */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 font-mono text-[11px] font-black uppercase text-slate-300">
                    <Compass size={14} className="text-[#0066FF]" />
                    <span>COGNITIVE &amp; VISUAL ASSISTS</span>
                  </div>

                  <div className="space-y-2">
                    {[
                      {
                        key: "dyslexiaFont",
                        title: "Dyslexia Friendly Font",
                        desc: "Optimized letter spacing, weight & sans-serif profile"
                      },
                      {
                        key: "readingGuide",
                        title: "Reading Guide (Tracking Bar)",
                        desc: "Horizontal highlight bar that follows mouse cursor"
                      },
                      {
                        key: "highlightLinks",
                        title: "Highlight Links & Buttons",
                        desc: "Adds high-visibility borders/underlines to clickable items"
                      },
                      {
                        key: "highlightHeadings",
                        title: "Highlight Headings",
                        desc: "Accentuates section titles with distinct underlines"
                      },
                      {
                        key: "stopAnimations",
                        title: "Stop Motion & Animations",
                        desc: "Freezes CSS transitions, carousels & moving objects"
                      },
                      {
                        key: "largeCursor",
                        title: "Large High-Visibility Cursor",
                        desc: "Enlarges mouse pointer target area"
                      },
                      {
                        key: "focusRing",
                        title: "Keyboard Focus Ring",
                        desc: "Displays a thick neon outline on currently focused elements"
                      },
                      {
                        key: "hoverToSpeak",
                        title: "Hover-to-Speak Screen Reader",
                        desc: "Reads paragraph and heading text aloud on hover using Web Speech API"
                      }
                    ].map((toggle) => {
                      const isChecked = Boolean(state[toggle.key as keyof AccessibilityState]);
                      return (
                        <div
                          key={toggle.key}
                          onClick={() =>
                            setState((prev) => ({
                              ...prev,
                              [toggle.key]: !isChecked,
                              activeProfile: null
                            }))
                          }
                          className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-all"
                        >
                          <div className="space-y-0.5">
                            <div className="font-black text-xs text-white">{toggle.title}</div>
                            <div className="text-[11px] text-slate-400">{toggle.desc}</div>
                          </div>
                          
                          {/* Toggle Switch */}
                          <div
                            className={`w-11 h-6 rounded-full p-1 transition-colors ${
                              isChecked ? "bg-[#0066FF]" : "bg-slate-800"
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                                isChecked ? "translate-x-5" : "translate-x-0"
                              }`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {/* ── TAB 3: GUIDE ── */}
            {activeTab === "guide" && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-cyan-300 font-extrabold text-xs">
                    <HelpCircle size={16} />
                    <span>Keyboard Navigation Shortcuts</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Our site is built to WCAG 2.2 AA &amp; AAA specifications for universal accessibility.
                  </p>

                  <div className="space-y-2 font-mono text-[11px]">
                    <div className="flex items-center justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-300 font-sans">Toggle Accessibility Panel:</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 font-black">
                        Alt + A
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-300 font-sans">Skip to Main Content:</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 font-black">
                        Tab (1st press)
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-300 font-sans">Close Panel:</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 font-black">
                        Esc
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-300 font-sans">Navigate Elements:</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 font-black">
                        Tab / Shift + Tab
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <span className="text-slate-300 font-sans">Activate Button/Link:</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 font-black">
                        Enter / Space
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-1">
                  <div className="font-black flex items-center gap-1.5">
                    <Check size={15} className="text-emerald-400" />
                    <span>Our Commitment</span>
                  </div>
                  <p className="text-[11px] leading-relaxed opacity-90 font-sans">
                    Botmartz is dedicated to making enterprise AI engineering accessible to everyone. All preferences are automatically saved to your browser session.
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* ── FOOTER BAR ── */}
          <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={resetDefaults}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-extrabold text-xs transition-colors flex items-center gap-2 cursor-pointer border border-slate-700"
            >
              <RotateCcw size={14} />
              <span>Reset All Defaults</span>
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-6 py-2.5 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-black text-xs transition-all shadow-md shadow-blue-500/25 cursor-pointer"
            >
              Done
            </button>
          </div>

        </div>
      )}
    </>
  );
}
