"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserCheck, ArrowRight, Sparkles, ShieldCheck, Lock, Loader2, CheckCircle2, Coins, Flame, Terminal } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function HeroAuthForm() {
  const router = useRouter();
  const { user, studentProfile, loading: authLoading, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<"signup" | "signin">("signup");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    college: "",
    track: "bundle",
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (activeTab === "signup") {
        if (!form.name.trim() || form.name.trim().length < 2) {
          setErrorMsg("Validation Error: Please enter your full name (minimum 2 characters).");
          setLoading(false);
          return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!form.email.trim() || !emailRegex.test(form.email.trim())) {
          setErrorMsg("Validation Error: Please enter a valid email address.");
          setLoading(false);
          return;
        }

        const registeredEmail = form.email.trim();

        // Direct registration or signup API
        const res = await fetch("/api/admin/direct-register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name.trim(),
            email: registeredEmail,
            organization: form.college.trim(),
            plan: form.track
          })
        });

        const data = await res.json();
        if (data.success) {
          // Clear input fields immediately
          setForm({
            name: "",
            email: "",
            college: "",
            track: "bundle",
            password: ""
          });

          setSuccessMsg(`Account created successfully! Welcome email sent to ${registeredEmail}. Redirecting to Sign In...`);
          setTimeout(() => {
            setActiveTab("signin");
            setSuccessMsg("Account created successfully! Please sign in with your email.");
          }, 1500);
        } else {
          setErrorMsg(data.error || "Registration failed. Please try again.");
        }
      } else {
        // Sign in
        if (!form.email.trim()) {
          setErrorMsg("Please enter your registered email address.");
          setLoading(false);
          return;
        }

        if (!form.password.trim()) {
          setErrorMsg("Please enter your Passcode / Access Code.");
          setLoading(false);
          return;
        }

        const res = await fetch("/api/auth/passcode-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email.trim(),
            passcode: form.password.trim()
          })
        });

        const data = await res.json();
        if (data.success) {
          setSuccessMsg(`Signed in successfully as ${data.user.displayName}! Redirecting...`);
          setTimeout(() => {
            router.push("/arena");
          }, 1000);
        } else {
          setErrorMsg(data.error || "Invalid email or Passcode.");
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // If student is logged in, show their active session, profile & progress instead of the auth form
  if (user) {
    const displayName = studentProfile?.displayName || user.displayName || user.email?.split("@")[0] || "Builder";
    const userEmail = user.email || "";
    const karmaCoins = studentProfile?.karmaCoins ?? 100;
    const persona = studentProfile?.personaType || "Verified Builder";
    const photoURL = user.photoURL;

    return (
      <div className="w-full bg-slate-900 text-white border-2 border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4 font-sans relative overflow-hidden flex flex-col justify-between hover:border-blue-500/50 transition-all duration-300">
        
        {/* Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0066FF] via-cyan-400 to-emerald-400" />

        {/* Top Status Badge */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-extrabold text-emerald-400 uppercase tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span>Session Active</span>
          </span>
          <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-400/30 px-2.5 py-0.5 rounded-full font-bold">
            Cohort 1 Pass Active
          </span>
        </div>

        {/* User Info Header */}
        <div className="flex items-center gap-3.5 pt-1">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0066FF] to-indigo-600 text-white flex items-center justify-center font-black text-xl overflow-hidden border-2 border-blue-400/40 shadow-lg shrink-0">
            {photoURL ? (
              <img src={photoURL} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <span>{displayName.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-black text-white truncate font-sans tracking-tight">
              {displayName}
            </h3>
            <p className="text-xs text-slate-400 truncate font-mono">{userEmail}</p>
            <div className="inline-block mt-1 px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-mono font-bold border border-blue-500/30">
              {persona}
            </div>
          </div>
        </div>

        {/* Student Progress & Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5 pt-1 font-mono">
          <div className="p-3 rounded-2xl bg-slate-800/90 border border-slate-700/90 space-y-1">
            <div className="flex items-center gap-1 text-[10px] text-slate-400 uppercase font-bold">
              <Coins size={13} className="text-amber-400" />
              <span>Karma Balance</span>
            </div>
            <div className="text-lg font-black text-amber-400 font-sans">{karmaCoins} Coins</div>
            <div className="text-[10px] text-emerald-400 font-medium">100 Welcome Bonus</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/90 border border-slate-700/90 space-y-1">
            <div className="flex items-center gap-1 text-[10px] text-slate-400 uppercase font-bold">
              <Flame size={13} className="text-rose-400" />
              <span>Sprint Clock</span>
            </div>
            <div className="text-lg font-black text-white font-sans">45-Day Cohort</div>
            <div className="text-[10px] text-cyan-300 font-medium">Daily Git Tracker</div>
          </div>
        </div>

        {/* Quick Action Navigation Buttons */}
        <div className="space-y-2 pt-1 font-mono text-xs">
          <Link
            href="/arena"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#0066FF] via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold uppercase tracking-wider text-center transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 cursor-pointer border border-blue-400/30"
          >
            <Terminal size={15} />
            <span>Enter AI Arena &amp; PRDs &rarr;</span>
          </Link>

          <Link
            href="/profile"
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-center transition-all flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
          >
            <UserCheck size={14} className="text-cyan-400" />
            <span>View Profile &amp; Verifiable Proofs</span>
          </Link>

          <button
            type="button"
            onClick={() => logout()}
            className="w-full py-1.5 text-[11px] text-slate-400 hover:text-rose-400 font-medium text-center transition-all cursor-pointer"
          >
            Sign Out of Session
          </button>
        </div>

        {/* Security Notice */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span className="flex items-center gap-1">
            <ShieldCheck size={12} className="text-emerald-400" />
            <span>Authenticated Session</span>
          </span>
          <span>DPDP Compliant</span>
        </div>

      </div>
    );
  }

  return (
    <div className="w-full bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-3 font-mono text-xs text-slate-900 relative overflow-hidden">
      
      {/* Decorative Top Accent Glow */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0066FF] via-[#0092D7] to-purple-600" />

      {/* Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 text-[#0066FF]">
            <UserCheck size={16} />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-950 font-sans tracking-tight">
              {activeTab === "signup" ? "Join Cohort 1 & Start" : "Sign In to Dashboard"}
            </h3>
            <p className="text-[10px] text-slate-500 font-mono">
              {activeTab === "signup" ? "Claim 100 Welcome Coins & PRD access." : "Access your verified progress & logs."}
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200 text-[10px] font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab("signup");
              setErrorMsg(null);
            }}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              activeTab === "signup"
                ? "bg-[#0066FF] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("signin");
              setErrorMsg(null);
            }}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              activeTab === "signin"
                ? "bg-[#0066FF] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Sign In
          </button>
        </div>
      </div>

      {/* Messages */}
      {successMsg && (
        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-2">
          <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px]">
          {errorMsg}
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-2.5">
        {activeTab === "signup" ? (
          <>
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-0.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono focus:outline-none focus:border-[#0066FF] focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-0.5">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="student@college.edu"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono focus:outline-none focus:border-[#0066FF] focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-0.5">
                College / Organization
              </label>
              <input
                type="text"
                placeholder="e.g. IET DAVV / PBCOE"
                value={form.college}
                onChange={(e) => setForm({ ...form, college: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono focus:outline-none focus:border-[#0066FF] focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-0.5">
                Select Track
              </label>
              <select
                value={form.track}
                onChange={(e) => setForm({ ...form, track: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs font-sans focus:outline-none focus:border-[#0066FF] focus:bg-white transition-all"
              >
                <option value="bundle">Open Builder Pass (100% Free)</option>
                <option value="bootcamp-01">Verified Cohort Pass (₹299)</option>
                <option value="bootcamp-02">Founder Placement Track (₹1,999)</option>
              </select>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-0.5">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="student@college.edu"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono focus:outline-none focus:border-[#0066FF] focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-0.5">
                Passcode / Access Code *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. BM-849201"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono font-bold focus:outline-none focus:border-[#0066FF] focus:bg-white transition-all uppercase tracking-wider"
              />
            </div>
          </>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
        >
          {loading ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Sparkles size={15} />
          )}
          <span>
            {loading
              ? "Processing..."
              : activeTab === "signup"
              ? "Create Student Account & Start"
              : "Sign In to Dashboard"}
          </span>
          {!loading && <ArrowRight size={14} />}
        </button>

        {/* Divider */}
        <div className="relative py-1 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <span className="relative px-2 bg-white text-[9px] text-slate-400 uppercase font-bold">
            Or Continue With
          </span>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={() => {
            setSuccessMsg("Redirecting to Google Auth...");
            setTimeout(() => router.push("/login"), 800);
          }}
          className="w-full py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-mono text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
          <span>Continue with Google</span>
        </button>

      </form>

      <div className="pt-1 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1 font-sans">
        <ShieldCheck size={12} className="text-emerald-600" />
        <span>Zero spam. SSL encrypted. Instant setup.</span>
      </div>

    </div>
  );
}
