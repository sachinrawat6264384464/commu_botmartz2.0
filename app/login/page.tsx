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
  BookOpen,
  Star,
  Quote,
  Check
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      const loggedUser = await signInWithGoogle();
      if (loggedUser) {
        router.push(redirectUrl);
      }
    } catch (err: any) {
      if (err?.code !== "auth/popup-closed-by-user" && !err?.message?.includes("popup-closed-by-user")) {
        setError(err.message || "Google Sign-In failed. Please try again.");
      }
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

  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-mono text-xs text-slate-600">
        <Loader2 size={22} className="animate-spin text-[#0066FF] mr-2.5" />
        <span className="font-semibold text-slate-700">Authenticating zero-trust session...</span>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 text-slate-900 pt-20 pb-12 font-sans selection:bg-[#0066FF] selection:text-white flex flex-col justify-center relative overflow-hidden">
      <div id="recaptcha-container" suppressHydrationWarning={true}></div>

      {/* Soft Background Mesh Glows for White Theme */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Dynamic 100% Full-Width Container */}
      <div className="w-full px-4 sm:px-8 lg:px-12 relative z-10 flex-1 flex flex-col justify-center">
        
        {/* ── 2-COLUMN SPLIT HERO LOGIN LAYOUT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full flex-1">
          
          {/* ── LEFT COLUMN (7 COLS): HIGH-TECH HERO BRANDING BANNER ── */}
          <div className="lg:col-span-7 relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-blue-950 p-8 sm:p-12 border-2 border-slate-800 shadow-2xl flex flex-col justify-between min-h-[calc(100vh-180px)] lg:min-h-[620px] backdrop-blur-xl hover:border-blue-500/50 transition-all duration-500 group text-white">
            {/* Background Ambient Glows */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />

            <div className="relative z-10 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 text-cyan-300 font-mono text-xs font-black border border-cyan-400/30 backdrop-blur-md shadow-xs">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
                </span>
                <Sparkles size={14} className="text-cyan-400" />
                <span>45-DAY VIRTUAL AI INTERNSHIP &amp; BUILDER NETWORK</span>
              </div>

              {/* Heading */}
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-sans leading-tight">
                Build Real Systems with <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">Verifiable Proof-of-Work</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed font-normal">
                Sign in to access your student Karma Wallet, daily Git commit standup log, Agile sprint workspaces, and founder architecture teardowns.
              </p>

              {/* 4 Feature Badges Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 font-sans">
                <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-800/90 border-2 border-slate-700/90 hover:border-cyan-400/60 hover:bg-slate-800 transition-all duration-300 shadow-md">
                  <Terminal size={22} className="text-cyan-400 shrink-0" />
                  <div>
                    <div className="text-white font-bold text-xs sm:text-sm">Daily Git Commit Logger</div>
                    <div className="text-cyan-300 text-xs font-mono font-medium">+20 to +70 Coins Every Day</div>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-800/90 border-2 border-slate-700/90 hover:border-blue-400/60 hover:bg-slate-800 transition-all duration-300 shadow-md">
                  <Layers size={22} className="text-blue-400 shrink-0" />
                  <div>
                    <div className="text-white font-bold text-xs sm:text-sm">50 Production System PRDs</div>
                    <div className="text-slate-300 text-xs font-mono">LangGraph, eBPF, PostGIS</div>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-800/90 border-2 border-slate-700/90 hover:border-purple-400/60 hover:bg-slate-800 transition-all duration-300 shadow-md">
                  <KanbanSquare size={22} className="text-purple-400 shrink-0" />
                  <div>
                    <div className="text-white font-bold text-xs sm:text-sm">Agile Workspaces &amp; Chat</div>
                    <div className="text-slate-300 text-xs font-mono">Jira/Linear Boards &amp; Live Squad</div>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-800/90 border-2 border-slate-700/90 hover:border-emerald-400/60 hover:bg-slate-800 transition-all duration-300 shadow-md">
                  <Award size={22} className="text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-white font-bold text-xs sm:text-sm">Cryptographic Credentials</div>
                    <div className="text-emerald-300 text-xs font-mono font-medium">QR Verifiable PDF Certificates</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Founder Stat Ticker */}
            <div className="relative z-10 pt-6 mt-6 border-t-2 border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-300">
              <span className="flex items-center gap-2 font-bold text-slate-200">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>Zero-Trust Authenticated Sessions</span>
              </span>
              <span className="text-cyan-300 font-extrabold px-3.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40">100 Free Welcome Coins</span>
            </div>
          </div>

          {/* ── RIGHT COLUMN (5 COLS): AUTH FORM CARD ── */}
          <div className="lg:col-span-5 flex flex-col h-full min-h-[calc(100vh-180px)] lg:min-h-[620px]">
            
            {/* ALREADY LOGGED IN STATE */}
            {user ? (
              <div className="h-full bg-white rounded-3xl border-2 border-slate-200 shadow-xl p-8 sm:p-10 text-center space-y-6 font-sans text-xs relative overflow-hidden flex flex-col justify-between hover:border-[#0066FF] transition-all">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0066FF] via-blue-500 to-cyan-500" />
                
                <div className="space-y-4 pt-4">
                  <div className="w-20 h-20 rounded-full bg-blue-50 text-[#0066FF] flex items-center justify-center mx-auto overflow-hidden border-4 border-blue-200 shadow-md">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || "User"} className="w-full h-full object-cover" />
                    ) : (
                      <CheckCircle2 size={38} />
                    )}
                  </div>

                  <div>
                    <div className="text-xs text-emerald-600 font-extrabold uppercase tracking-wider mb-1 flex items-center justify-center gap-1.5 font-mono">
                      <CheckCircle2 size={16} /> Already Signed In
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 font-sans">
                      {studentProfile?.displayName || user.displayName || "Builder"}
                    </h3>
                    <p className="text-slate-500 font-semibold text-sm mt-1">{user.email}</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-200 flex items-center justify-between text-left">
                  <div>
                    <span className="text-xs text-slate-500 uppercase font-extrabold font-mono">Karma Balance</span>
                    <div className="text-base font-black text-slate-900 flex items-center gap-2 mt-0.5">
                      <Coins size={18} className="text-amber-500" />
                      <span>{studentProfile?.karmaCoins ?? 100} Coins</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 uppercase font-extrabold font-mono">Role Status</span>
                    <div className="text-sm font-black text-[#0066FF] mt-0.5">
                      {studentProfile?.personaType || "Verified Builder"}
                    </div>
                  </div>
                </div>

                <Link
                  href={redirectUrl}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#0066FF] to-blue-600 hover:from-blue-700 hover:to-blue-600 text-white font-bold uppercase tracking-wider text-center transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 cursor-pointer text-sm font-mono"
                >
                  <span>Continue to Workspace</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              /* SIGN IN FORM CARD */
              <div className="h-full bg-white rounded-3xl border-2 border-slate-200 shadow-xl p-8 sm:p-10 space-y-6 relative overflow-hidden flex flex-col justify-between hover:border-[#0066FF] hover:shadow-2xl transition-all duration-500">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0066FF] via-blue-500 to-cyan-500" />
                
                <div className="space-y-6">
                  {/* Form Header */}
                  <div className="text-center space-y-2">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0066FF] flex items-center justify-center mx-auto border-2 border-blue-100 shadow-xs">
                      <Lock size={26} />
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-[#0066FF] font-mono text-[11px] font-black uppercase tracking-wider border border-blue-200">
                      <ShieldCheck size={13} /> Zero-Trust Builder Gate
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans tracking-tight">
                      Sign In to Builder Portal
                    </h2>
                    <p className="text-slate-600 text-xs sm:text-sm font-sans font-medium">
                      Access your student Karma Wallet &amp; active 45-day sprint clock.
                    </p>
                  </div>

                  {/* Error & Info Messages */}
                  {error && (
                    <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-700 text-xs sm:text-sm font-sans font-medium flex items-start gap-2.5">
                      <AlertCircle size={18} className="shrink-0 mt-0.5 text-rose-600" />
                      <span>{error}</span>
                    </div>
                  )}

                  {infoMsg && (
                    <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-emerald-700 text-xs sm:text-sm font-sans font-medium flex items-start gap-2.5">
                      <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-emerald-600" />
                      <span>{infoMsg}</span>
                    </div>
                  )}

                  {/* Auth Method Switcher */}
                  <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl font-sans text-xs sm:text-sm border-2 border-slate-200">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMethod("google");
                        setError("");
                      }}
                      className={`py-2.5 rounded-xl font-extrabold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                        authMethod === "google"
                          ? "bg-[#0066FF] text-white shadow-md"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
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
                      className={`py-2.5 rounded-xl font-extrabold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                        authMethod === "phone"
                          ? "bg-[#0066FF] text-white shadow-md"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                      }`}
                    >
                      <Phone size={15} />
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
                        className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-[#0066FF] via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-sans text-sm font-black transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-blue-500/25 cursor-pointer border border-blue-400/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                      >
                        {submitting ? (
                          <Loader2 size={18} className="animate-spin text-white" />
                        ) : (
                          <svg className="w-5 h-5 shrink-0 bg-white rounded-full p-0.5 shadow-xs" viewBox="0 0 24 24">
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

                      <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 text-slate-700 font-sans text-xs space-y-2">
                        <div className="flex items-center gap-1.5 text-[#0066FF] font-black uppercase tracking-wider text-[11px] font-mono">
                          <Sparkles size={14} />
                          <span>Instant Community Perks:</span>
                        </div>
                        <div className="text-slate-600 font-medium space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF]" />
                            <span>Claim <strong className="text-slate-900 font-bold">100 Welcome Karma Coins</strong> instantly</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF]" />
                            <span>Open all 50 Production System PRDs &amp; Roadmaps</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF]" />
                            <span>Open to Students, Engineers &amp; Founders worldwide</span>
                          </div>
                        </div>
                      </div>

                      {/* Verified Builder Quote / Proof Widget */}
                      <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 border-2 border-slate-800 shadow-md">
                        <div className="flex items-center justify-between text-xs text-amber-400 font-mono font-bold">
                          <span className="flex items-center gap-1.5">
                            <Star size={13} className="fill-amber-400 text-amber-400" />
                            <span>Verified Builder Proof</span>
                          </span>
                          <span className="text-slate-400 text-[10px] uppercase tracking-wider">Cohort Alum</span>
                        </div>
                        <p className="text-xs text-slate-300 italic font-sans leading-relaxed">
                          &ldquo;Logging daily commits and building frontier AI system architectures got me recognized directly by top technical founders.&rdquo;
                        </p>
                        <div className="text-[11px] text-cyan-300 font-mono font-bold pt-1.5 border-t border-slate-800 flex items-center justify-between">
                          <span>— AI Engineering Intern</span>
                          <span className="text-emerald-400 flex items-center gap-1">
                            <Check size={12} /> 100% Karma Verified
                          </span>
                        </div>
                      </div>

                      {/* Active Cohort Indicator Bar */}
                      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-xs font-mono text-emerald-800 font-bold">
                        <span className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Live Cohort Enrollment Active</span>
                        </span>
                        <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black border border-emerald-300">
                          84% Filled
                        </span>
                      </div>
                    </div>
                  )}

                  {/* PHONE OTP SIGN IN */}
                  {authMethod === "phone" && (
                    <div className="space-y-4">
                      {!confirmationResult ? (
                        <form onSubmit={handleSendPhoneOtp} className="space-y-4 font-sans text-xs sm:text-sm">
                          <div>
                            <label className="block text-white font-extrabold mb-2">Mobile Number *</label>
                            <div className="flex rounded-2xl border-2 border-slate-700 overflow-hidden focus-within:border-cyan-400 bg-slate-950">
                              <span className="px-4 py-3.5 text-slate-300 bg-slate-800 font-black border-r-2 border-slate-700 font-mono">
                                +91
                              </span>
                              <input
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="9876543210"
                                className="flex-1 bg-transparent px-4 py-3.5 text-white font-bold focus:outline-none text-sm font-mono placeholder:text-slate-500"
                              />
                            </div>
                          </div>

                          <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-3.5 rounded-2xl bg-[#0066FF] hover:bg-blue-600 text-white font-extrabold uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs sm:text-sm font-mono"
                          >
                            {submitting ? (
                              <>
                                <Loader2 size={18} className="animate-spin" />
                                <span>Sending SMS OTP...</span>
                              </>
                            ) : (
                              <span>Send 6-Digit OTP &rarr;</span>
                            )}
                          </button>
                        </form>
                      ) : (
                        <form onSubmit={handleVerifyPhoneOtp} className="space-y-4 font-sans text-xs sm:text-sm">
                          <div>
                            <label className="block text-white font-extrabold mb-2">Enter 6-Digit SMS Code *</label>
                            <input
                              type="text"
                              required
                              maxLength={6}
                              value={otpCode}
                              onChange={(e) => setOtpCode(e.target.value)}
                              placeholder="123456"
                              className="w-full bg-slate-950 border-2 border-slate-700 rounded-2xl px-4 py-3.5 text-center text-xl font-black tracking-widest text-white focus:outline-none focus:border-cyan-400 font-mono"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs sm:text-sm font-mono"
                          >
                            {submitting ? (
                              <>
                                <Loader2 size={18} className="animate-spin" />
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
                              className="text-xs text-slate-400 hover:text-white font-bold underline cursor-pointer font-mono"
                            >
                              Change Phone Number
                            </button>
                          </div>
                        </form>
                      )}

                      {/* Verified Builder Quote / Proof Widget */}
                      <div className="p-4 rounded-2xl bg-slate-950 text-white space-y-2 border-2 border-slate-800 shadow-md">
                        <div className="flex items-center justify-between text-xs text-amber-400 font-mono font-bold">
                          <span className="flex items-center gap-1.5">
                            <Star size={13} className="fill-amber-400 text-amber-400" />
                            <span>Verified Builder Proof</span>
                          </span>
                          <span className="text-slate-400 text-[10px] uppercase tracking-wider">Cohort Alum</span>
                        </div>
                        <p className="text-xs text-slate-300 italic font-sans leading-relaxed">
                          &ldquo;Logging daily commits and building frontier AI system architectures got me recognized directly by top technical founders.&rdquo;
                        </p>
                        <div className="text-[11px] text-cyan-300 font-mono font-bold pt-1.5 border-t border-slate-800 flex items-center justify-between">
                          <span>— AI Engineering Intern</span>
                          <span className="text-emerald-400 flex items-center gap-1">
                            <Check size={12} /> 100% Karma Verified
                          </span>
                        </div>
                      </div>

                      {/* Active Cohort Indicator Bar */}
                      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/30 text-xs font-mono text-emerald-300 font-bold">
                        <span className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Live Cohort Enrollment Active</span>
                        </span>
                        <span className="bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black border border-emerald-500/40">
                          84% Filled
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Zero-Trust Notice */}
                <div className="pt-4 border-t-2 border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono font-bold">
                  <span className="flex items-center gap-1.5">
                    <Lock size={14} className="text-emerald-400" />
                    <span>256-bit Encrypted</span>
                  </span>
                  <span className="text-slate-400">DPDP 2023 Compliant</span>
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
