"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("super-admin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Verify credentials
    if (
      (email === "botmartz@gmail.com" && password === "Admin@2026##") ||
      (email === "soham@botmartz.com" && password === "Admin@2026##") ||
      (email.includes("@botmartz.com") && password.length >= 6)
    ) {
      if (typeof window !== "undefined") {
        localStorage.setItem("botmartz_admin_role", role);
        localStorage.setItem("botmartz_admin_email", email);
      }
      setTimeout(() => {
        router.push("/admin");
      }, 500);
    } else {
      setLoading(false);
      setError("Invalid admin email or password.");
    }
  };

  return (
    <div className="min-h-screen bg-[#050B14] flex items-center justify-center p-4">
      <div className="bg-[#0B1524] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl">
        
        <div className="w-14 h-14 bg-gradient-to-tr from-[#0066FF] to-[#00B8F0] rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg">
          <ShieldCheck size={28} />
        </div>

        <h1 className="text-2xl font-bold text-white text-center mb-1">Community Control Panel</h1>
        <p className="text-xs text-slate-400 text-center mb-6">
          Sign in with authorized staff or administrator credentials.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">Authorized Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
              <input
                type="email"
                placeholder="admin@botmartz.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#050B14] border border-white/15 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00B8F0]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">Security Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#050B14] border border-white/15 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00B8F0]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">Assigned Role (RBAC)</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-[#050B14] border border-white/15 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-[#00B8F0]"
            >
              <option value="super-admin">👑 Super Administrator (Full Access)</option>
              <option value="event-manager">🎟️ Event / Community Lead</option>
              <option value="volunteer">⚡ Volunteer / Scanner Staff</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md mt-6 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <><span>Authenticate Session</span> <ArrowRight size={14} /></>}
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-white/10 text-center">
          <a
            href="/"
            className="text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors"
          >
            ← Return to Community Public Site
          </a>
        </div>

      </div>
    </div>
  );
}
