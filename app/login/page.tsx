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
  Check,
  UserPlus,
  UserCheck,
  Building2,
  GraduationCap,
  Github,
  Mail,
  User,
  RefreshCw,
  Search,
  Ticket,
  KeyRound
} from "lucide-react";
import { TOTAL_SYSTEMS_COUNT } from "@/lib/arena-projects";
import { useAuth } from "@/lib/auth-context";

function StudentLoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/profile";
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "signin";

  const {
    user,
    studentProfile,
    loading: authLoading,
    signInWithGoogle,
    setupRecaptcha,
    sendPhoneOtp,
    completeStudentProfile,
    logout,
    loginWithCustomToken
  } = useAuth();

  // Primary mode state: signup vs signin (defaults to signin on /login route)
  const [authMode, setAuthMode] = useState<"signup" | "signin">(initialMode);
  const [authMethod, setAuthMethod] = useState<"passcode" | "google" | "phone">("passcode");
  const [hoveredSide, setHoveredSide] = useState<"left" | "right" | null>(null);

  // Sync mode search param with authMode state
  useEffect(() => {
    const modeParam = searchParams.get("mode");
    if (modeParam === "signup") {
      setAuthMode("signup");
    } else {
      setAuthMode("signin");
    }
  }, [searchParams]);

  // Sign Up Form State
  const [signUpForm, setSignUpForm] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    track: "bundle", // Open Builder Pass
    githubUsername: ""
  });

  // Sign In Passcode State
  const [passcodeForm, setPasscodeForm] = useState({
    email: "",
    passcode: ""
  });

  // Sign In Phone State
  const [phone, setPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  // Status & Messaging States
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle Passcode Sign In Submission
  const handlePasscodeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcodeForm.email.trim()) {
      setError("Please enter your registered email address.");
      return;
    }
    if (!passcodeForm.passcode.trim()) {
      setError("Please enter your Passcode / Access Code.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      const res = await fetch("/api/auth/passcode-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: passcodeForm.email.trim(),
          passcode: passcodeForm.passcode.trim()
        })
      });

      const data = await res.json();
      if (data.success) {
        if (loginWithCustomToken) {
          await loginWithCustomToken(data.customToken, data.user);
        }
        setInfoMsg(`Signed in successfully as ${data.user.displayName}! Redirecting to workspace...`);
        setTimeout(() => {
          router.push(redirectUrl);
        }, 800);
      } else {
        setError(data.error || "Invalid email or Passcode.");
      }
    } catch (err: any) {
      setError(err.message || "Passcode login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };


  // Handle Sign Up Registration Submission
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Strict Schema & Input Validation
    if (!signUpForm.name.trim() || signUpForm.name.trim().length < 2) {
      setError("Validation Error: Please enter your full name (minimum 2 characters).");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!signUpForm.email.trim() || !emailRegex.test(signUpForm.email.trim())) {
      setError("Validation Error: Please enter a valid email address (e.g. name@example.com).");
      return;
    }

    if (signUpForm.phone.trim() && signUpForm.phone.replace(/\D/g, "").length < 10) {
      setError("Validation Error: Mobile phone number must contain at least 10 digits.");
      return;
    }

    const registeredEmail = signUpForm.email.trim().toLowerCase();

    // If an existing session is active and different email is registering, log out first to prevent session confusion
    if (user && user.email?.toLowerCase() !== registeredEmail) {
      try {
        await logout();
      } catch (lErr) {
        console.warn("Pre-signup logout notice:", lErr);
      }
    }

    try {
      setSubmitting(true);
      setError("");

      // 2. Call Backend Direct Registration API (Saves to Firestore & triggers Welcome Email + Drip Sequence)
      const res = await fetch("/api/admin/direct-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signUpForm.name.trim(),
          email: registeredEmail,
          phone: signUpForm.phone.trim(),
          organization: signUpForm.organization.trim(),
          plan: signUpForm.track,
          githubUsername: signUpForm.githubUsername.trim()
        })
      });

      const data = await res.json();

      if (data.success) {
        setRegistrationSuccess(data.registration);

        // Clear input fields
        setSignUpForm({
          name: "",
          email: "",
          phone: "",
          organization: "",
          track: "bundle",
          githubUsername: ""
        });

        setInfoMsg(`Account created successfully! Welcome email & 45-day onboarding drip sequence dispatched to ${registeredEmail}.`);
      } else {
        setError(data.error || "Registration failed. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during signup.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Google Sign-In / Google Quick Registration
  const handleGoogleLogin = async () => {
    try {
      setSubmitting(true);
      setError("");
      const loggedUser = await signInWithGoogle();
      if (loggedUser) {
        // Automatically save initial profile if info exists
        if (signUpForm.name || signUpForm.organization) {
          try {
            await completeStudentProfile({
              displayName: signUpForm.name || loggedUser.displayName || "Builder",
              email: loggedUser.email || signUpForm.email,
              collegeName: signUpForm.organization,
              phoneNumber: signUpForm.phone,
              githubUsername: signUpForm.githubUsername,
              karmaCoins: 100
            });
          } catch (e) { }
        }
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

  // Handle Phone OTP Send
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
      if (
        err?.code === "auth/operation-not-allowed" ||
        err?.message?.includes("operation-not-allowed") ||
        err?.message?.includes("region enabled")
      ) {
        setError("auth/operation-not-allowed");
      } else {
        setError(err.message || "Failed to send SMS OTP.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Phone OTP Verify
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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center font-mono text-xs text-slate-300">
        <Loader2 size={22} className="animate-spin text-[#0066FF] mr-2.5" />
        <span className="font-semibold text-slate-200">Authenticating zero-trust session...</span>
      </div>
    );
  }

  return (
    <div
      className="min-h-[calc(100vh-80px)] bg-white text-slate-900 py-4 sm:py-5 font-sans selection:bg-[#D9F83B] selection:text-slate-950 flex flex-col justify-center relative overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(29, 49, 137, 0.11) 1px, transparent 1px), linear-gradient(to bottom, rgba(29, 49, 137, 0.11) 1px, transparent 1px)",
        backgroundSize: "72px 72px",
      }}
    >
      <div id="recaptcha-container" suppressHydrationWarning={true}></div>

      {/* Dynamic 100% Full-Width Container */}
      <div className="w-full max-w-[1340px] mx-auto px-4 sm:px-8 lg:px-10 relative z-10 flex-1 flex flex-col justify-center">

        {/* ── 2-COLUMN SPLIT HERO LOGIN / SIGNUP LAYOUT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full">

          {/* ── LEFT COLUMN (7 COLS): HIGH-TECH HERO BRANDING BANNER ── */}
          <div
            onMouseEnter={() => setHoveredSide("left")}
            onMouseLeave={() => setHoveredSide(null)}
            className="lg:col-span-7 relative overflow-hidden rounded-3xl bg-[#070E54]/95 p-5 sm:p-6 border border-white/15 shadow-2xl flex flex-col justify-between backdrop-blur-xl hover:border-[#D9F83B]/40 transition-all duration-500 group text-white"
          >
            {/* Slow-motion sliding background fill when cursor hovers the Right Form */}
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 bg-gradient-to-br from-[#1D3189] via-[#172875] to-[#0E185C] transition-transform duration-1000 ease-in-out ${
                hoveredSide === "right" ? "translate-x-0" : "-translate-x-full"
              }`}
            />

            <div className="relative z-10 space-y-3.5">
              {/* Top Row: Badge + Top-Right 180deg Rotating Circle Arrow */}
              <div className="flex items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D9F83B] text-slate-950 font-sans text-[10px] font-extrabold uppercase tracking-wider shadow-xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-60"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-950"></span>
                  </span>
                  <span>Virtual AI Internship &amp; Builder Network</span>
                </div>

                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/25 group-hover:bg-[#D9F83B] group-hover:border-[#D9F83B] flex items-center justify-center shrink-0 transition-all duration-700 ease-in-out">
                  <ArrowRight
                    size={17}
                    className="text-[#D9F83B] group-hover:text-slate-950 transition-transform duration-700 ease-in-out group-hover:rotate-180"
                  />
                </div>
              </div>

              {/* Heading */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans leading-tight">
                Build Real Systems with{" "}
                <span className="text-[#D9F83B]">Verifiable Proof-of-Work</span>
              </h1>

              <p className="text-xs sm:text-[13px] text-blue-100/85 font-sans leading-relaxed font-normal">
                {authMode === "signup"
                  ? `Create your student builder account to unlock 100 free Welcome Karma Coins, ${TOTAL_SYSTEMS_COUNT} production PRDs, and daily Git commit logs.`
                  : "Sign in to access your student Karma Wallet, daily Git commit standup log, Agile sprint workspaces, and founder architecture teardowns."}
              </p>

              {/* 4 Feature Cards Grid (Clean Editorial Structure, No Icons) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-0.5 font-sans">
                <div className="group/feat relative overflow-hidden p-3 rounded-xl bg-white/[0.06] border border-white/15 border-l-4 border-l-[#D9F83B] hover:bg-white hover:text-slate-950 transition-all duration-300">
                  <span className="absolute top-2 right-3 text-lg font-black text-white/15 group-hover/feat:text-[#1D3189]/15 select-none">01</span>
                  <div className="text-white group-hover/feat:text-slate-950 font-bold text-xs mb-0.5 transition-colors">Daily Git Commit Logger</div>
                  <div className="text-[#D9F83B] group-hover/feat:text-[#1D3189] text-[11px] font-semibold transition-colors">+20 to +70 Coins Every Day</div>
                </div>

                <div className="group/feat relative overflow-hidden p-3 rounded-xl bg-white/[0.06] border border-white/15 border-l-4 border-l-[#D9F83B] hover:bg-white hover:text-slate-950 transition-all duration-300">
                  <span className="absolute top-2 right-3 text-lg font-black text-white/15 group-hover/feat:text-[#1D3189]/15 select-none">02</span>
                  <div className="text-white group-hover/feat:text-slate-950 font-bold text-xs mb-0.5 transition-colors">{TOTAL_SYSTEMS_COUNT} Production System PRDs</div>
                  <div className="text-blue-200/80 group-hover/feat:text-slate-600 text-[11px] transition-colors">LangGraph, eBPF, PostGIS</div>
                </div>

                <div className="group/feat relative overflow-hidden p-3 rounded-xl bg-white/[0.06] border border-white/15 border-l-4 border-l-[#D9F83B] hover:bg-white hover:text-slate-950 transition-all duration-300">
                  <span className="absolute top-2 right-3 text-lg font-black text-white/15 group-hover/feat:text-[#1D3189]/15 select-none">03</span>
                  <div className="text-white group-hover/feat:text-slate-950 font-bold text-xs mb-0.5 transition-colors">Agile Workspaces &amp; Chat</div>
                  <div className="text-blue-200/80 group-hover/feat:text-slate-600 text-[11px] transition-colors">Jira/Linear Boards &amp; Live Squad</div>
                </div>

                <div className="group/feat relative overflow-hidden p-3 rounded-xl bg-white/[0.06] border border-white/15 border-l-4 border-l-[#D9F83B] hover:bg-white hover:text-slate-950 transition-all duration-300">
                  <span className="absolute top-2 right-3 text-lg font-black text-white/15 group-hover/feat:text-[#1D3189]/15 select-none">04</span>
                  <div className="text-white group-hover/feat:text-slate-950 font-bold text-xs mb-0.5 transition-colors">Cryptographic Credentials</div>
                  <div className="text-[#D9F83B] group-hover/feat:text-[#1D3189] text-[11px] font-semibold transition-colors">QR Verifiable PDF Certificates</div>
                </div>
              </div>

              {/* ── CLEAN SPRINT & KARMA PIPELINE WIDGET ── */}
              <div className="p-3.5 rounded-2xl bg-[#1D3189]/40 border border-white/15 backdrop-blur-md space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] font-extrabold text-white font-sans uppercase tracking-wider">
                    Active Cohort Architecture Pipeline
                  </span>
                  <span className="text-[10px] font-sans text-slate-950 font-bold px-2.5 py-0.5 rounded-full bg-[#D9F83B]">
                    Live Telemetry: Active
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px] font-sans">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-[#D9F83B] font-bold">Week 1</div>
                    <div className="text-blue-100/80 text-[10px]">PRD &amp; Setup</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-[#D9F83B] font-bold">Week 2–3</div>
                    <div className="text-blue-100/80 text-[10px]">Core Build</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-[#D9F83B] font-bold">Week 4</div>
                    <div className="text-blue-100/80 text-[10px]">SLA &amp; Review</div>
                  </div>
                </div>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-sans text-blue-100">
                  <span className="px-2 py-0.5 rounded-md bg-white/10 border border-white/10 font-medium">LangGraph</span>
                  <span className="px-2 py-0.5 rounded-md bg-white/10 border border-white/10 font-medium">Firestore Pipelines</span>
                  <span className="px-2 py-0.5 rounded-md bg-white/10 border border-white/10 font-medium">Hostinger SMTP</span>
                  <span className="px-2 py-0.5 rounded-md bg-white/10 border border-white/10 font-medium">PostGIS</span>
                  <span className="px-2 py-0.5 rounded-md bg-white/10 border border-white/10 font-medium">RBAC Security</span>
                </div>
              </div>
            </div>

            {/* Bottom Founder Stat Ticker */}
            <div className="relative z-10 pt-3 mt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs font-sans text-blue-100">
              <span className="flex items-center gap-2 font-semibold text-white">
                <ShieldCheck size={15} className="text-[#D9F83B]" />
                <span>Zero-Trust Authenticated Sessions</span>
              </span>
              <span className="text-slate-950 font-bold px-3 py-0.5 rounded-full bg-[#D9F83B] text-[11px]">
                100 Free Welcome Coins
              </span>
            </div>
          </div>

          {/* ── RIGHT COLUMN (5 COLS): AUTH CARD WITH SIGN UP & SIGN IN TABS ── */}
          <div className="lg:col-span-5 flex flex-col">

            {/* REGISTRATION SUCCESS CARD VIEW */}
            {registrationSuccess ? (
              <div className="h-full bg-white rounded-3xl border-2 border-emerald-400 shadow-2xl p-8 space-y-6 font-sans text-xs relative overflow-hidden flex flex-col justify-between animate-fadeIn">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500" />

                <div className="space-y-4 pt-2 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border-4 border-emerald-200 shadow-md">
                    <CheckCircle2 size={36} />
                  </div>

                  <div>
                    <span className="text-[11px] font-mono uppercase font-black text-emerald-600 tracking-wider">
                      Account Registered &amp; Ticket Generated
                    </span>
                    <h2 className="text-2xl font-black text-slate-900 mt-1">
                      Welcome, {registrationSuccess.name}!
                    </h2>
                    <p className="text-slate-600 text-xs mt-1">
                      Your builder record has been stored in the Firestore database.
                    </p>
                  </div>

                  {/* Ticket Details Box */}
                  <div className="p-4 rounded-2xl bg-slate-900 text-white border-2 border-slate-800 text-left space-y-2 font-mono">
                    <div className="flex items-center justify-between text-xs text-cyan-300 border-b border-slate-800 pb-2">
                      <span className="flex items-center gap-1.5 font-bold">
                        <Ticket size={14} className="text-amber-400" />
                        <span>Sign-In Passcode</span>
                      </span>
                      <span className="bg-cyan-500/20 text-cyan-300 font-extrabold px-2.5 py-0.5 rounded border border-cyan-400/40 text-[11px] font-mono tracking-wider">
                        {registrationSuccess.passcode || registrationSuccess.checkInCode}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1">
                      <div>
                        <span className="text-slate-400 text-[10px] block uppercase">Email</span>
                        <span className="font-bold text-white truncate block">{registrationSuccess.email}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block uppercase">Track Plan</span>
                        <span className="font-bold text-emerald-300 block uppercase">{registrationSuccess.plan}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Welcome Bonus:</span>
                      <span className="text-amber-400 font-black flex items-center gap-1">
                        <Coins size={14} /> +100 Karma Coins Allocated
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-sans flex items-center gap-2 text-left">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>
                      <strong>Passcode Sent to Email:</strong> Your passcode <strong>{registrationSuccess.passcode || registrationSuccess.checkInCode}</strong> was sent to <strong>{registrationSuccess.email}</strong>.
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-2 font-mono text-xs">
                  <Link
                    href="/arena"
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#0066FF] to-blue-600 hover:from-blue-700 hover:to-blue-600 text-white font-bold uppercase tracking-wider text-center transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 cursor-pointer text-xs font-mono"
                  >
                    <span>Enter AI Builder Arena &amp; PRDs &rarr;</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      const emailToFill = registrationSuccess.email;
                      const passcodeToFill = registrationSuccess.passcode || registrationSuccess.checkInCode;
                      setPasscodeForm({ email: emailToFill || "", passcode: passcodeToFill || "" });
                      setRegistrationSuccess(null);
                      setAuthMode("signin");
                      setAuthMethod("passcode");
                      setError("");
                      setInfoMsg("Registration completed! Sign in with your Passcode below.");
                    }}
                    className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold font-mono text-xs cursor-pointer transition-all"
                  >
                    Sign In with Passcode &rarr;
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRegistrationSuccess(null);
                      setAuthMode("signup");
                      setError("");
                      setInfoMsg("");
                    }}
                    className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold font-mono text-xs cursor-pointer transition-all"
                  >
                    Register Another Student Account
                  </button>
                </div>
              </div>
            ) : user ? (
              /* ALREADY LOGGED IN STATE */
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
                      <CheckCircle2 size={16} /> Authenticated Session Active
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

                <div className="space-y-2.5 font-mono text-xs">
                  <Link
                    href={redirectUrl}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#0066FF] to-blue-600 hover:from-blue-700 hover:to-blue-600 text-white font-bold uppercase tracking-wider text-center transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 cursor-pointer text-xs"
                  >
                    <span>Continue to Workspace &rarr;</span>
                    <ArrowRight size={16} />
                  </Link>

                  <button
                    type="button"
                    onClick={async () => {
                      await logout();
                      setRegistrationSuccess(null);
                      setError("");
                      setInfoMsg("");
                    }}
                    className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border-2 border-slate-200 text-slate-700 font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Sign Out to Register New Account</span>
                  </button>
                </div>
              </div>
            ) : (
              /* MAIN AUTH CARD (SIGN UP / SIGN IN) */
              <div
                onMouseEnter={() => setHoveredSide("right")}
                onMouseLeave={() => setHoveredSide(null)}
                className="h-full bg-white rounded-3xl border border-slate-200/90 shadow-xl p-5 sm:p-6 space-y-4 relative overflow-hidden flex flex-col justify-between transition-all duration-500"
              >
                {/* Slow-motion sliding background fill when cursor hovers the Left Box */}
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-[#EEF3FF] via-[#E5EDFF] to-[#F4FBE0] transition-transform duration-1000 ease-in-out ${
                    hoveredSide === "left" ? "translate-x-0" : "-translate-x-full"
                  }`}
                />
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#D9F83B] z-10" />

                <div className="relative z-10 space-y-5">

                  {/* ── TOP MAIN MODE TABS: SIGN UP vs SIGN IN ── */}
                  <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 font-sans text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("signup");
                        setError("");
                        setInfoMsg("");
                      }}
                      className={`py-2.5 px-3 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center ${authMode === "signup"
                          ? "bg-[#1D3189] text-white shadow-md font-bold"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 font-semibold"
                        }`}
                    >
                      <span>Create Account (Sign Up)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("signin");
                        setError("");
                        setInfoMsg("");
                      }}
                      className={`py-2.5 px-3 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center ${authMode === "signin"
                          ? "bg-[#1D3189] text-white shadow-md font-bold"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 font-semibold"
                        }`}
                    >
                      <span>Sign In to Portal</span>
                    </button>
                  </div>

                  {/* Header Title */}
                  <div className="text-center space-y-1">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 font-sans tracking-tight">
                      {authMode === "signup" ? "Create Builder Account" : "Sign In to Builder Portal"}
                    </h2>
                    <p className="text-slate-600 text-xs font-sans font-medium">
                      {authMode === "signup"
                        ? "Register to claim 100 Welcome Coins & access system PRDs."
                        : "Access your student Karma Wallet & active project sprint."}
                    </p>
                  </div>

                  {/* Error & Info Banner Messages */}
                  {error && (
                    error === "auth/operation-not-allowed" ? (
                      <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 text-xs font-sans space-y-3 shadow-sm">
                        <div className="flex items-center gap-2 font-bold text-amber-800 text-sm">
                          <AlertCircle size={20} className="shrink-0 text-amber-600" />
                          <span>Firebase Phone Auth &amp; SMS Region Policy Not Enabled</span>
                        </div>
                        <p className="text-amber-800 font-medium">
                          Firebase requires enabling Phone Authentication and granting permission to send SMS to country codes like <strong>+91 (India)</strong>.
                        </p>
                        <div className="pt-1 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => {
                              setAuthMethod("google");
                              setError("");
                            }}
                            className="px-3.5 py-2 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold font-mono text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <span>Sign In with Google Instead &rarr;</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div id="login-error-msg" data-testid="login-error-msg" className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-700 text-xs sm:text-sm font-sans font-medium flex items-start gap-2.5">
                        <AlertCircle size={18} className="shrink-0 mt-0.5 text-rose-600" />
                        <span>{error}</span>
                      </div>
                    )
                  )}

                  {infoMsg && (
                    <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-emerald-700 text-xs sm:text-sm font-sans font-medium flex items-start gap-2.5">
                      <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-emerald-600" />
                      <span>{infoMsg}</span>
                    </div>
                  )}

                  {/* ══════════════════════════════════════════════════════════════ */}
                  {/* MODE 1: FULL SIGN UP FORM                                     */}
                  {/* ══════════════════════════════════════════════════════════════ */}
                  {authMode === "signup" && (
                    <form onSubmit={handleSignUpSubmit} className="space-y-3.5 font-sans text-xs">

                      {/* Full Name */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1 font-sans">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={signUpForm.name}
                          onChange={(e) => setSignUpForm({ ...signUpForm, name: e.target.value })}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-slate-900 text-xs font-sans font-medium focus:outline-none focus:border-[#1D3189] focus:bg-white transition-all"
                        />
                      </div>

                      {/* Email Address */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1 font-sans">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={signUpForm.email}
                          onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                          placeholder="student@college.edu"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-slate-900 text-xs font-sans font-medium focus:outline-none focus:border-[#1D3189] focus:bg-white transition-all"
                        />
                      </div>

                      {/* Phone & College Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1 font-sans">
                            Mobile Phone
                          </label>
                          <input
                            type="tel"
                            value={signUpForm.phone}
                            onChange={(e) => setSignUpForm({ ...signUpForm, phone: e.target.value })}
                            placeholder="9876543210"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-slate-900 text-xs font-sans font-medium focus:outline-none focus:border-[#1D3189] focus:bg-white transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1 font-sans">
                            College / Org
                          </label>
                          <input
                            type="text"
                            value={signUpForm.organization}
                            onChange={(e) => setSignUpForm({ ...signUpForm, organization: e.target.value })}
                            placeholder="e.g. IET DAVV / PBCOE"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-slate-900 text-xs font-sans font-medium focus:outline-none focus:border-[#1D3189] focus:bg-white transition-all"
                          />
                        </div>
                      </div>

                      {/* Select Cohort Track */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1 font-sans">
                          Select Builder Track *
                        </label>
                        <select
                          value={signUpForm.track}
                          onChange={(e) => setSignUpForm({ ...signUpForm, track: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-slate-900 text-xs font-sans font-semibold focus:outline-none focus:border-[#1D3189] focus:bg-white transition-all cursor-pointer"
                        >
                          <option value="bundle">Open Builder Pass (100% Free - 100 Coins)</option>
                          <option value="bootcamp-01">Verified Cohort Pass (₹299 - Full Certificate &amp; Squad)</option>
                          <option value="bootcamp-02">Founder Placement Track (₹1,999 - 1-on-1 Teardown)</option>
                        </select>
                      </div>

                      {/* GitHub Username */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1 font-sans">
                          GitHub Username (Optional)
                        </label>
                        <input
                          type="text"
                          value={signUpForm.githubUsername}
                          onChange={(e) => setSignUpForm({ ...signUpForm, githubUsername: e.target.value })}
                          placeholder="e.g. alex-developer"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-slate-900 text-xs font-sans font-medium focus:outline-none focus:border-[#1D3189] focus:bg-white transition-all"
                        />
                      </div>

                      {/* Submit Registration Button */}
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3.5 rounded-xl bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-sans text-sm font-bold transition-all shadow-lg shadow-lime-400/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
                      >
                        {submitting ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            <span>Creating Account &amp; Saving to Database...</span>
                          </>
                        ) : (
                          <span>Create Account &amp; Save Profile &rarr;</span>
                        )}
                      </button>

                      {/* Or Quick Sign-Up with Google */}
                      <div className="relative py-1 flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-slate-200" />
                        </div>
                        <span className="relative px-3 bg-white text-[10px] text-slate-400 uppercase font-bold font-mono">
                          Or Quick Sign-Up With
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={submitting}
                        className="w-full py-3 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 border-2 border-slate-200 font-mono text-xs font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-2xs"
                      >
                        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
                        <span>Continue with Google Sign-Up</span>
                      </button>

                    </form>
                  )}

                  {/* ══════════════════════════════════════════════════════════════ */}
                  {/* MODE 2: SIGN IN METHOD SELECTOR (GOOGLE / PHONE)               */}
                  {/* ══════════════════════════════════════════════════════════════ */}
                  {authMode === "signin" && (
                    <div className="space-y-4 font-sans text-xs">

                      {/* Sub Auth Method Switcher (Passcode / Google / Phone) */}
                      <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl font-sans text-xs border border-slate-200">
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMethod("passcode");
                            setError("");
                          }}
                          className={`py-2 rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center ${authMethod === "passcode"
                              ? "bg-[#1D3189] text-white shadow-xs font-bold"
                              : "text-slate-600 hover:text-slate-900 font-semibold"
                            }`}
                        >
                          <span>Passcode</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setAuthMethod("google");
                            setError("");
                          }}
                          className={`py-2 rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center ${authMethod === "google"
                              ? "bg-[#1D3189] text-white shadow-xs font-bold"
                              : "text-slate-600 hover:text-slate-900 font-semibold"
                            }`}
                        >
                          <span>Google</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setAuthMethod("phone");
                            setError("");
                          }}
                          className={`py-2 rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center ${authMethod === "phone"
                              ? "bg-[#1D3189] text-white shadow-xs font-bold"
                              : "text-slate-600 hover:text-slate-900 font-semibold"
                            }`}
                        >
                          <span>Phone OTP</span>
                        </button>
                      </div>

                      {/* PASSCODE SIGN IN */}
                      {authMethod === "passcode" && (
                        <form id="login-form" data-testid="login-form" noValidate onSubmit={handlePasscodeLogin} className="space-y-3.5 font-sans text-xs">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1 font-sans">
                              Registered Email *
                            </label>
                            <input
                              id="email-input"
                              data-testid="email-input"
                              type="email"
                              value={passcodeForm.email}
                              onChange={(e) => setPasscodeForm({ ...passcodeForm, email: e.target.value })}
                              placeholder="student@college.edu"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-slate-900 text-xs font-sans font-medium focus:outline-none focus:border-[#1D3189] focus:bg-white transition-all"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1 font-sans">
                              Passcode / Access Code *
                            </label>
                            <input
                              id="password-input"
                              data-testid="password-input"
                              type="password"
                              value={passcodeForm.passcode}
                              onChange={(e) => setPasscodeForm({ ...passcodeForm, passcode: e.target.value })}
                              placeholder="e.g. BM-849201"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-slate-900 text-xs font-sans font-semibold focus:outline-none focus:border-[#1D3189] focus:bg-white transition-all tracking-wider uppercase"
                            />
                            <p className="text-[11px] text-slate-500 font-sans font-normal mt-1">
                              Enter the Passcode sent to your registered email upon signup.
                            </p>
                          </div>

                          <button
                            id="signin-btn"
                            data-testid="signin-btn"
                            type="submit"
                            disabled={submitting}
                            className="w-full py-3.5 rounded-xl bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-sans text-sm font-bold transition-all shadow-lg shadow-lime-400/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                          >
                            {submitting ? (
                              <>
                                <Loader2 size={16} className="animate-spin" />
                                <span>Verifying Passcode...</span>
                              </>
                            ) : (
                              <span>Sign In</span>
                            )}
                          </button>
                        </form>
                      )}

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

                          <div className="p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200 text-slate-700 font-sans text-xs space-y-1.5">
                            <div className="flex items-center gap-1.5 text-[#0066FF] font-black uppercase tracking-wider text-[11px] font-mono">
                              <Sparkles size={14} />
                              <span>Instant Community Perks:</span>
                            </div>
                            <div className="text-slate-600 font-medium space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF]" />
                                <span>Claim <strong className="text-slate-900 font-bold">100 Welcome Karma Coins</strong> instantly</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF]" />
                                <span>Open all {TOTAL_SYSTEMS_COUNT} Production System PRDs &amp; Roadmaps</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* PHONE OTP SIGN IN */}
                      {authMethod === "phone" && (
                        <div className="space-y-4">
                          {!confirmationResult ? (
                            <form onSubmit={handleSendPhoneOtp} className="space-y-4 font-sans text-xs sm:text-sm">
                              <div>
                                <label className="block text-slate-900 font-extrabold mb-1">Mobile Number *</label>
                                <div className="flex rounded-2xl border-2 border-slate-200 overflow-hidden focus-within:border-[#0066FF] bg-slate-50">
                                  <span className="px-4 py-3 text-slate-700 bg-slate-200 font-black border-r border-slate-300 font-mono">
                                    +91
                                  </span>
                                  <input
                                    type="tel"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="9876543210"
                                    className="flex-1 bg-transparent px-4 py-3 text-slate-900 font-bold focus:outline-none text-sm font-mono placeholder:text-slate-400"
                                  />
                                </div>
                              </div>

                              <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-3.5 rounded-2xl bg-[#0066FF] hover:bg-blue-600 text-white font-extrabold uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs font-mono"
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
                                <label className="block text-slate-900 font-extrabold mb-1">Enter 6-Digit SMS Code *</label>
                                <input
                                  type="text"
                                  required
                                  maxLength={6}
                                  value={otpCode}
                                  onChange={(e) => setOtpCode(e.target.value)}
                                  placeholder="123456"
                                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 py-3 text-center text-xl font-black tracking-widest text-slate-900 focus:outline-none focus:border-[#0066FF] font-mono"
                                />
                              </div>

                              <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs font-mono"
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
                                  className="text-xs text-slate-500 hover:text-slate-900 font-bold underline cursor-pointer font-mono"
                                >
                                  Change Phone Number
                                </button>
                              </div>
                            </form>
                          )}
                        </div>
                      )}

                    </div>
                  )}

                </div>

                {/* Zero-Trust Security Footer Notice */}
                <div className="relative z-10 pt-3 border-t border-slate-200/70 flex items-center justify-between text-[11px] text-slate-500 font-sans font-medium">
                  <span>256-bit Encrypted</span>
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
