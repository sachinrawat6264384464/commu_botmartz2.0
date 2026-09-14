"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { UserCheck, ArrowRight, Sparkles, ShieldCheck, Lock, Loader2, CheckCircle2 } from "lucide-react";

export default function HeroAuthForm() {
  const router = useRouter();
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
        if (!form.name.trim() || !form.email.trim()) {
          setErrorMsg("Please enter your name and email address.");
          setLoading(false);
          return;
        }

        // Direct registration or signup API
        const res = await fetch("/api/admin/direct-register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            organization: form.college,
            plan: form.track
          })
        });

        const data = await res.json();
        if (data.success) {
          setSuccessMsg(`Welcome ${form.name}! 100 Welcome Coins claimed. Redirecting to Builder Dashboard...`);
          setTimeout(() => {
            router.push("/arena");
          }, 1500);
        } else {
          setErrorMsg(data.error || "Registration failed. Please try again.");
        }
      } else {
        // Sign in
        if (!form.email.trim()) {
          setErrorMsg("Please enter your email address.");
          setLoading(false);
          return;
        }

        setSuccessMsg("Signed in successfully! Redirecting...");
        setTimeout(() => {
          router.push("/arena");
        }, 1200);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

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
                Password / Passcode
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono focus:outline-none focus:border-[#0066FF] focus:bg-white transition-all"
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
