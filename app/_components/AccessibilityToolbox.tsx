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

// Sacred Om (ॐ) SVG/Typography Component
function OmIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center justify-center font-bold text-[#D9F83B] text-lg sm:text-xl leading-none select-none drop-shadow-[0_0_8px_rgba(217,248,59,0.65)] ${className}`}>
      ॐ
    </span>
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

  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setHasDragged(false);
    const rect = e.currentTarget.getBoundingClientRect();
    const currentX = position ? position.x : rect.left;
    const currentY = position ? position.y : rect.top;
    setDragStart({
      x: e.clientX - currentX,
      y: e.clientY - currentY,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newX = Math.max(10, Math.min(window.innerWidth - 70, e.clientX - dragStart.x));
      const newY = Math.max(10, Math.min(window.innerHeight - 70, e.clientY - dragStart.y));
      if (!position || Math.abs(newX - position.x) > 3 || Math.abs(newY - position.y) > 3) {
        setHasDragged(true);
      }
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragStart, position]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setHasDragged(false);
    const rect = e.currentTarget.getBoundingClientRect();
    const currentX = position ? position.x : rect.left;
    const currentY = position ? position.y : rect.top;
    setDragStart({
      x: touch.clientX - currentX,
      y: touch.clientY - currentY,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const newX = Math.max(10, Math.min(window.innerWidth - 70, touch.clientX - dragStart.x));
    const newY = Math.max(10, Math.min(window.innerHeight - 70, touch.clientY - dragStart.y));
    if (!position || Math.abs(newX - position.x) > 3 || Math.abs(newY - position.y) > 3) {
      setHasDragged(true);
    }
    setPosition({ x: newX, y: newY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleButtonClick = () => {
    if (!hasDragged) {
      setIsOpen((prev) => !prev);
    }
  };

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

      {/* ── DRAGGABLE FLOATING ACCESSIBILITY BUTTON (SWASTIK LOGO & LIVE BLUE POINTER) ── */}
      <div
        style={
          position
            ? {
                position: "fixed",
                left: `${position.x}px`,
                top: `${position.y}px`,
                bottom: "auto",
                right: "auto",
              }
            : undefined
        }
        className="fixed bottom-6 left-6 z-[99999] select-none touch-none"
      >
        <button
          type="button"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={handleButtonClick}
          aria-label="Open Accessibility Toolbox"
          className={`group w-10 h-10 sm:w-12 sm:h-12 shrink-0 inline-flex items-center justify-center rounded-full bg-gradient-to-br from-[#070E54] via-[#132270] to-[#1D3189] text-[#D9F83B] shadow-[0_0_20px_rgba(7,14,84,0.65)] hover:shadow-[0_0_24px_rgba(217,248,59,0.45)] border-2 border-[#D9F83B]/80 transition-transform duration-100 relative ${
            isDragging ? "cursor-grabbing scale-110 shadow-2xl" : "cursor-grab hover:scale-105 active:scale-95"
          }`}
        >
          {/* Live Lime Glowing Pointer Dot */}
          <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3 pointer-events-none">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D9F83B] opacity-90" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#D9F83B] border-2 border-[#070E54] shadow-[0_0_8px_rgba(217,248,59,0.9)]" />
          </span>

          <OmIcon className="w-5 h-5 sm:w-6 sm:h-6 pointer-events-none" />
          <span className="sr-only">Accessibility Toolbox</span>
        </button>
      </div>

      {/* ── ACCESSIBILITY TOOLBOX FLOATING PANEL (POPPER ANCHORED ABOVE LOGO, NO BG BLUR) ── */}
      {isOpen && (
        <>
          {/* Invisible Backdrop for Click Outside (No Blur, No Dim) */}
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[999998]"
          />

          <div
            style={
              position
                ? {
                    position: "fixed",
                    left: `${Math.max(16, Math.min(typeof window !== "undefined" ? window.innerWidth - 440 : 400, position.x))}px`,
                    top: position.y > 450 ? "auto" : `${position.y + 70}px`,
                    bottom: position.y > 450 ? `${(typeof window !== "undefined" ? window.innerHeight : 800) - position.y + 12}px` : "auto",
                  }
                : {
                    position: "fixed",
                    bottom: "90px",
                    left: "24px",
                  }
            }
            className="z-[999999] w-[calc(100vw-32px)] sm:w-[440px] max-h-[75vh] sm:max-h-[580px] bg-white border-2 border-[#162774]/20 rounded-3xl shadow-2xl overflow-hidden font-sans text-slate-900 text-xs flex flex-col animate-in slide-in-from-bottom-3 fade-in duration-200"
          >
          
          {/* ── HEADER ── */}
          <div
            className="p-4 sm:p-5 border-b border-white/15 flex items-center justify-between bg-[#162774] text-white shrink-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          >
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-extrabold text-white font-sans tracking-tight">
                  Accessibility Toolbox
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#D9F83B] text-slate-950 font-sans text-[10px] font-extrabold uppercase tracking-wider">
                  WCAG 2.2 AA/AAA
                </span>
              </div>
              <p className="text-[11px] text-blue-100/80 font-sans font-medium mt-0.5">
                Customize your visual and cognitive experience
              </p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#D9F83B] text-white hover:text-slate-950 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <X size={16} />
            </button>
          </div>

          {/* ── TABS HEADER (NO ICONS) ── */}
          <div className="grid grid-cols-3 border-b border-slate-200 bg-[#F4F6FB] font-sans font-extrabold text-xs shrink-0">
            <button
              onClick={() => setActiveTab("profiles")}
              className={`py-3 flex items-center justify-center border-b-2 transition-all cursor-pointer ${
                activeTab === "profiles"
                  ? "border-[#162774] text-[#162774] bg-white"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <span>Profiles</span>
            </button>

            <button
              onClick={() => setActiveTab("controls")}
              className={`py-3 flex items-center justify-center border-b-2 transition-all cursor-pointer ${
                activeTab === "controls"
                  ? "border-[#162774] text-[#162774] bg-white"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <span>Custom Controls</span>
            </button>

            <button
              onClick={() => setActiveTab("guide")}
              className={`py-3 flex items-center justify-center border-b-2 transition-all cursor-pointer ${
                activeTab === "guide"
                  ? "border-[#162774] text-[#162774] bg-white"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <span>Guide</span>
            </button>
          </div>

          {/* ── TAB CONTENT SCROLLABLE BODY ── */}
          <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-5 custom-scrollbar bg-white">
            
            {/* ── TAB 1: PROFILES (NO ICONS, PROJECT COLORS) ── */}
            {activeTab === "profiles" && (
              <div className="space-y-4">
                <p className="text-slate-600 font-medium text-xs">
                  Select a curated accessibility profile or customize individually:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {[
                    {
                      id: "visual" as const,
                      num: "01",
                      title: "Visual Impairment",
                      desc: "Large text (+30%), High Contrast theme, prominent links & focus highlights.",
                    },
                    {
                      id: "adhd" as const,
                      num: "02",
                      title: "Cognitive & ADHD",
                      desc: "Medium text (+15%), Low Saturation colors, paused animations, clear links.",
                    },
                    {
                      id: "dyslexia" as const,
                      num: "03",
                      title: "Dyslexia & Reading",
                      desc: "Dyslexia-friendly typography, tracking Reading Guide bar, heading underlines.",
                    },
                    {
                      id: "motor" as const,
                      num: "04",
                      title: "Motor Difficulty",
                      desc: "Big mouse cursor, bright neon focus ring, frozen motion/animations.",
                    },
                  ].map((prof) => {
                    const isActive = state.activeProfile === prof.id;
                    return (
                      <div
                        key={prof.id}
                        onClick={() => activateProfile(prof.id)}
                        className={`p-4 rounded-2xl border border-l-4 border-l-[#D9F83B] transition-all cursor-pointer space-y-2 relative ${
                          isActive
                            ? "bg-[#162774] border-[#162774] text-white shadow-lg"
                            : "bg-[#F4F6FB] border-slate-200 hover:border-[#162774] hover:bg-white text-slate-900"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`w-6 h-6 rounded-full font-extrabold text-[10px] flex items-center justify-center ${
                              isActive
                                ? "bg-[#D9F83B] text-slate-950"
                                : "bg-[#162774] text-[#D9F83B]"
                            }`}
                          >
                            {prof.num}
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-widest ${
                              isActive ? "text-[#D9F83B]" : "text-[#1D3189]"
                            }`}
                          >
                            PROFILE
                          </span>
                        </div>
                        <h4
                          className={`font-extrabold text-sm font-sans ${
                            isActive ? "text-white" : "text-slate-950"
                          }`}
                        >
                          {prof.title}
                        </h4>
                        <p
                          className={`text-[11px] leading-relaxed ${
                            isActive ? "text-blue-100/85" : "text-slate-600"
                          }`}
                        >
                          {prof.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── TAB 2: CUSTOM CONTROLS (NO ICONS) ── */}
            {activeTab === "controls" && (
              <div className="space-y-5">
                
                {/* TEXT SCALING */}
                <div className="space-y-2.5">
                  <div className="font-sans text-[11px] font-extrabold uppercase tracking-wider text-[#162774]">
                    TEXT SCALING
                  </div>
                  <div className="grid grid-cols-4 gap-2 p-1 bg-[#F4F6FB] rounded-2xl border border-slate-200">
                    {(["100", "115", "130", "145"] as TextScaling[]).map((scale) => (
                      <button
                        key={scale}
                        type="button"
                        onClick={() => setState((prev) => ({ ...prev, textScaling: scale, activeProfile: null }))}
                        className={`py-2 rounded-xl font-sans text-xs font-extrabold transition-all cursor-pointer ${
                          state.textScaling === scale
                            ? "bg-[#162774] text-[#D9F83B] shadow-sm"
                            : "text-slate-600 hover:text-slate-950"
                        }`}
                      >
                        {scale}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* COLOR & CONTRAST */}
                <div className="space-y-2.5">
                  <div className="font-sans text-[11px] font-extrabold uppercase tracking-wider text-[#162774]">
                    COLOR &amp; CONTRAST
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
                        className={`p-3 rounded-2xl border text-left font-bold text-xs transition-all flex items-center justify-between cursor-pointer ${
                          state.contrast === item.key
                            ? "bg-[#162774] border-[#162774] text-[#D9F83B]"
                            : "bg-[#F4F6FB] border-slate-200 text-slate-800 hover:border-[#162774]"
                        }`}
                      >
                        <span>{item.name}</span>
                        {state.contrast === item.key && (
                          <span className="w-2 h-2 rounded-full bg-[#D9F83B] shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* COGNITIVE & VISUAL ASSISTS TOGGLES */}
                <div className="space-y-2.5">
                  <div className="font-sans text-[11px] font-extrabold uppercase tracking-wider text-[#162774]">
                    COGNITIVE &amp; VISUAL ASSISTS
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
                          className="p-3.5 rounded-2xl bg-[#F4F6FB] border border-slate-200 flex items-center justify-between gap-3 cursor-pointer hover:border-[#162774] transition-all"
                        >
                          <div className="space-y-0.5">
                            <div className="font-bold text-xs text-slate-950">{toggle.title}</div>
                            <div className="text-[11px] text-slate-600">{toggle.desc}</div>
                          </div>
                          
                          {/* Toggle Switch */}
                          <div
                            className={`w-11 h-6 rounded-full p-1 transition-colors shrink-0 ${
                              isChecked ? "bg-[#162774]" : "bg-slate-300"
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded-full transition-transform ${
                                isChecked ? "translate-x-5 bg-[#D9F83B]" : "translate-x-0 bg-white"
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

            {/* ── TAB 3: GUIDE (NO ICONS) ── */}
            {activeTab === "guide" && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#F4F6FB] border border-slate-200 space-y-3">
                  <div className="text-[#162774] font-extrabold text-xs uppercase tracking-wider">
                    Keyboard Navigation Shortcuts
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Our site is built to WCAG 2.2 AA &amp; AAA specifications for universal accessibility.
                  </p>

                  <div className="space-y-2 text-[11px]">
                    <div className="flex items-center justify-between py-1.5 border-b border-slate-200">
                      <span className="text-slate-700 font-medium">Toggle Accessibility Panel:</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#162774] text-[#D9F83B] font-bold">
                        Alt + A
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-b border-slate-200">
                      <span className="text-slate-700 font-medium">Skip to Main Content:</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#162774] text-[#D9F83B] font-bold">
                        Tab (1st press)
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-b border-slate-200">
                      <span className="text-slate-700 font-medium">Close Panel:</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#162774] text-[#D9F83B] font-bold">
                        Esc
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-b border-slate-200">
                      <span className="text-slate-700 font-medium">Navigate Elements:</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#162774] text-[#D9F83B] font-bold">
                        Tab / Shift + Tab
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-slate-700 font-medium">Activate Button/Link:</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#162774] text-[#D9F83B] font-bold">
                        Enter / Space
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#162774] text-white border-l-4 border-l-[#D9F83B] text-xs space-y-1">
                  <div className="font-extrabold text-[#D9F83B]">Our Commitment</div>
                  <p className="text-[11px] leading-relaxed text-blue-100/85 font-sans">
                    Botmartz is dedicated to making enterprise AI engineering accessible to everyone. All preferences are automatically saved to your browser session.
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* ── FOOTER BAR (NO ICONS, PROJECT COLORS) ── */}
          <div className="p-4 border-t border-slate-200 bg-[#F4F6FB] flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={resetDefaults}
              className="px-4 py-2 rounded-full bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-950 font-bold text-xs transition-colors cursor-pointer border border-slate-200"
            >
              Reset All Defaults
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-6 py-2 rounded-full bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-extrabold text-xs transition-all shadow-sm cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
        </>
      )}
    </>
  );
}
