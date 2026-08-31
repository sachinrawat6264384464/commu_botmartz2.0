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
  Award
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
    <div className="min-h-screen bg-slate-100 text-slate-900 py-12 px-4 sm:px-6">
      <div id="recaptcha-container"></div>

      <div className="max-w-md mx-auto space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <Image src="/logo.png" alt="Botmartz Logo" width={48} height={48} className="object-contain" />
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0066FF] font-mono text-xs font-bold uppercase tracking-wider border border-blue-200">
            <ShieldCheck size={14} /> Builder Authentication Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans">
            Sign In to Botmartz Builders
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm font-mono">
            Access your Proof-of-Work Heatmap, Karma Wallet, Stage Roadmaps &amp; 15-Company Referral Circle.
          </p>
        </div>

        {/* ALREADY LOGGED IN STATE */}
        {user ? (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 text-center space-y-4 font-mono text-xs">
            <div className="w-14 h-14 rounded-full bg-blue-50 text-[#0066FF] flex items-center justify-center mx-auto overflow-hidden border border-blue-200">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || "User"} className="w-full h-full object-cover" />
              ) : (
                <CheckCircle2 size={28} />
              )}
            </div>

            <div>
              <div className="text-[11px] text-emerald-600 font-bold uppercase">✔ Already Signed In</div>
              <h3 className="text-base font-bold text-slate-900 font-sans mt-0.5">
                {studentProfile?.displayName || user.displayName || "Builder"}
              </h3>
              <p className="text-slate-500 text-xs mt-0.5">{user.email}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center justify-between text-left">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Karma Balance</span>
                <div className="text-sm font-bold text-slate-900 flex items-center gap-1">
                  <Coins size={14} className="text-amber-500" />
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
              className="w-full py-3.5 rounded-2xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold uppercase tracking-wider text-center transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <span>Continue to Workspace</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          /* SIGN IN CARD */
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            
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
                className={`py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
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
                className={`py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
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
                  className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-mono text-xs font-bold transition-all flex items-center justify-center gap-3 shadow-xs hover:border-slate-300 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 size={16} className="animate-spin text-[#0066FF]" />
                  ) : (
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
                  )}
                  <span>Continue with Google</span>
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
