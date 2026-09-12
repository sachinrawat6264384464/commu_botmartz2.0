"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Phone,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Coins,
  Lock,
  Flame,
  Globe2,
  Code2,
  Users,
  Award,
  Layers,
  Terminal,
  KanbanSquare,
  BookOpen
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

function StudentLoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/profile";

  const {
    user,
    studentProfile,
    loading: authLoading,
    signInWithGoogle,
    setupRecaptcha,
    sendPhoneOtp
  } = useAuth();

  const [authMethod, setAuthMethod] = useState<"google" | "phone">("google");
  const [phone, setPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  // Automatically redirect authenticated users
  useEffect(() => {
    if (!authLoading && user) {
      const timer = setTimeout(() => {
        router.push(redirectUrl);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [user, authLoading, redirectUrl, router]);

  const handleGoogleLogin = async () => {
    try {
      setSubmitting(true);
      setError("");
      await signInWithGoogle();
      router.push(redirectUrl);
    } catch (err: any) {
      setError(err.message || "Google Sign-In failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      const recaptcha = setupRecaptcha("recaptcha-container");
      const confirmRes = await sendPhoneOtp(phone, recaptcha);
      setConfirmationResult(confirmRes);
      setInfoMsg(`OTP code sent via SMS to ${phone}. Enter below:`);
    } catch (err: any) {
      setError(err.message || "Failed to send SMS OTP.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim() || !confirmationResult) {
      setError("Please enter the 6-digit OTP received on your phone.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      await confirmationResult.confirm(otpCode);
      setInfoMsg("Phone verified successfully!");
      router.push(redirectUrl);
    } catch (err: any) {
      setError(err.message || "Invalid or expired OTP code.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center font-mono text-xs text-slate-500">
        <Loader2 size={20} className="animate-spin text-[#0066FF] mr-2" />
        <span>Authenticating zero-trust session...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFCFF] text-slate-900 py-12 pt-24 font-sans selection:bg-[#0066FF] selection:text-white">
      <div id="recaptcha-container"></div>

      {/* Dynamic 100% Full-Width Container */}
      <div className="w-full px-4 sm:px-8 lg:px-12 relative z-10">
        
        {/* ── 2-COLUMN SPLIT HERO LOGIN LAYOUT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* ── LEFT COLUMN (7 COLS): HIGH-TECH DARK HERO BRANDING BANNER ── */}
          <div className="lg:col-span-7 relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 p-8 sm:p-12 border border-slate-800 shadow-2xl flex flex-col justify-between min-h-[520px]">
            {/* Background Ambient Glows */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-cyan-400 font-mono text-xs font-bold border border-cyan-500/20 backdrop-blur-md shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <Sparkles size={14} className="text-cyan-400" />
                <span>45-DAY VIRTUAL AI INTERNSHIP &amp; BUILDER NETWORK</span>
              </div>

              {/* Heading */}
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-sans leading-tight">
                Build Real Systems with <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">Verifiable Proof-of-Work</span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed max-w-2xl">
                Sign in to access your student Karma Wallet, daily Git commit standup log, Agile sprint workspaces, and founder architecture teardowns.
              </p>

              {/* 4 Feature Badges Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 font-mono text-xs">
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <Terminal size={18} className="text-cyan-400 shrink-0" />
                  <div>
                    <div className="text-white font-bold text-xs">Daily Git Commit Logger</div>
                    <div className="text-slate-400 text-[10px]">+20 to +70 Coins Every Day</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <Layers size={18} className="text-blue-400 shrink-0" />
                  <div>
                    <div className="text-white font-bold text-xs">50 Production System PRDs</div>
                    <div className="text-slate-400 text-[10px]">LangGraph, eBPF, PostGIS</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <KanbanSquare size={18} className="text-purple-400 shrink-0" />
                  <div>
                    <div className="text-white font-bold text-xs">Agile Workspaces &amp; Chat</div>
                    <div className="text-slate-400 text-[10px]">Jira/Linear Boards &amp; Live Squad</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <Award size={18} className="text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-white font-bold text-xs">Cryptographic Credentials</div>
                    <div className="text-slate-400 text-[10px]">QR Verifiable PDF Certificates</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Founder Stat Ticker */}
            <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Zero-Trust Authenticated Sessions</span>
              </span>
              <span className="text-cyan-300 font-bold">100 Free Welcome Coins</span>
            </div>
          </div>

          {/* ── RIGHT COLUMN (5 COLS): AUTH FORM CARD ── */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            
            {/* ALREADY LOGGED IN STATE */}
            {user ? (
              <div className="bg-white rounded-3xl border-2 border-slate-300 shadow-2xl p-8 text-center space-y-6 font-mono text-xs relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0066FF] via-cyan-500 to-indigo-600" />
                <div className="w-16 h-16 rounded-full bg-blue-50 text-[#0066FF] flex items-center justify-center mx-auto overflow-hidden border-2 border-blue-200 shadow-xs">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || "User"} className="w-full h-full object-cover" />
                  ) : (
                    <CheckCircle2 size={32} />
                  )}
                </div>

                <div>
                  <div className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                    <CheckCircle2 size={14} /> Already Signed In
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 font-sans">
                    {studentProfile?.displayName || user.displayName || "Builder"}
                  </h3>
                  <p className="text-slate-500 text-xs mt-1">{user.email}</p>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center justify-between text-left">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Karma Balance</span>
                    <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <Coins size={15} className="text-amber-500" />
                      <span>{studentProfile?.karmaCoins ?? 100} Coins</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Role Status</span>
                    <div className="text-xs font-bold text-[#0066FF]">
                      {studentProfile?.personaType || "Verified Builder"}
                    </div>
                  </div>
                </div>

                <Link
                  href={redirectUrl}
                  className="w-full py-4 rounded-2xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold uppercase tracking-wider text-center transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  <span>Continue to Workspace</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            ) : (
              /* SIGN IN FORM CARD */
              <div className="bg-white rounded-3xl border-2 border-slate-300 shadow-2xl p-8 sm:p-10 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0066FF] via-cyan-500 to-indigo-600" />
                
                {/* Form Header */}
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0066FF] flex items-center justify-center mx-auto border border-blue-100 shadow-xs mb-3">
                    <Lock size={22} />
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0066FF] font-mono text-xs font-bold uppercase tracking-wider border border-blue-200">
                    <ShieldCheck size={13} /> Zero-Trust Builder Gate
                  </div>
                  <h2 className="text-2xl font-black text-slate-950 font-sans tracking-tight">
                    Sign In to Builder Portal
                  </h2>
                  <p className="text-slate-500 text-xs font-mono">
                    Access your student Karma Wallet &amp; active 45-day sprint clock.
                  </p>
                </div>

                {/* Error & Info Messages */}
                {error && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono flex items-start gap-2">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {infoMsg && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono flex items-start gap-2">
                    <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                    <span>{infoMsg}</span>
                  </div>
                )}

                {/* Auth Method Switcher */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl font-mono text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod("google");
                      setError("");
                    }}
                    className={`py-2.5 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      authMethod === "google"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    <span>Google Sign-In</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod("phone");
                      setError("");
                    }}
                    className={`py-2.5 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      authMethod === "phone"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    <Phone size={13} />
                    <span>Phone OTP</span>
                  </button>
                </div>

                {/* GOOGLE SIGN IN */}
                {authMethod === "google" && (
                  <div className="space-y-4">
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={submitting}
                      className="w-full py-4 px-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-400 text-slate-800 font-mono text-xs font-bold transition-all flex items-center justify-center gap-3 shadow-xs cursor-pointer disabled:opacity-50"
                    >
                      {submitting ? (
                        <Loader2 size={16} className="animate-spin text-[#0066FF]" />
                      ) : (
                        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                      )}
                      <span>Continue with Google Sign-In &rarr;</span>
                    </button>

                    <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100 text-slate-600 font-mono text-[11px] space-y-1.5">
                      <div className="flex items-center gap-1.5 text-blue-700 font-bold">
                        <Sparkles size={13} />
                        <span>Instant Community Perks:</span>
                      </div>
                      <div className="text-slate-600 space-y-1">
                        <div>&bull; Claim <strong>100 Welcome Karma Coins</strong> instantly</div>
                        <div>&bull; Open all 50 Production System PRDs &amp; Roadmaps</div>
                        <div>&bull; Open to Students, Engineers &amp; Founders worldwide</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* PHONE OTP SIGN IN */}
                {authMethod === "phone" && (
                  <div>
                    {!confirmationResult ? (
                      <form onSubmit={handleSendPhoneOtp} className="space-y-4 font-mono text-xs">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1.5">Mobile Number *</label>
                          <div className="flex rounded-2xl border border-slate-200 overflow-hidden focus-within:border-[#0066FF] bg-slate-50">
                            <span className="px-3.5 py-3 text-slate-500 bg-slate-100 font-bold border-r border-slate-200">
                              +91
                            </span>
                            <input
                              type="tel"
                              required
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="9876543210"
                              className="flex-1 bg-transparent px-3 py-3 text-slate-900 focus:outline-none text-xs font-mono"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full py-3.5 rounded-2xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          {submitting ? (
                            <>
                              <Loader2 size={15} className="animate-spin" />
                              <span>Sending SMS OTP...</span>
                            </>
                          ) : (
                            <span>Send 6-Digit OTP &rarr;</span>
                          )}
                        </button>
                      </form>
                    ) : (
                      <form onSubmit={handleVerifyPhoneOtp} className="space-y-4 font-mono text-xs">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1.5">Enter 6-Digit SMS Code *</label>
                          <input
                            type="text"
                            required
                            maxLength={6}
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            placeholder="123456"
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-center text-lg font-bold tracking-widest text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          {submitting ? (
                            <>
                              <Loader2 size={15} className="animate-spin" />
                              <span>Verifying OTP...</span>
                            </>
                          ) : (
                            <span>Verify &amp; Sign In &rarr;</span>
                          )}
                        </button>

                        <div className="text-center">
                          <button
                            type="button"
                            onClick={() => setConfirmationResult(null)}
                            className="text-[11px] text-slate-500 hover:text-slate-800 underline cursor-pointer"
                          >
                            Change Phone Number
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}

                {/* Zero-Trust Notice */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Lock size={12} className="text-emerald-600" />
                    <span>256-bit Encrypted</span>
                  </span>
                  <span>DPDP 2023 Compliant</span>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}

export default function StudentLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center font-mono text-xs text-slate-500 bg-slate-100">
          <Loader2 size={20} className="animate-spin text-[#0066FF] mr-2" />
          <span>Loading Botmartz Builders Auth...</span>
        </div>
      }
    >
      <StudentLoginInner />
    </Suspense>
  );
}
