"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, Mail, ArrowRight, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Invalid admin credentials.");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("botmartz_admin_role", data.role || "super-admin");
        localStorage.setItem("botmartz_admin_email", data.email);
      }

      setTimeout(() => {
        router.push("/admin");
      }, 200);
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Invalid admin email or security password.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFCFF] flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full shadow-lg">
        
        <div className="flex justify-center mb-6">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Botmartz Logo"
              width={72}
              height={72}
              className="object-contain drop-shadow-sm"
              priority
            />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 text-center mb-1">Botmartz Admin Center</h1>
        <p className="text-xs text-slate-500 text-center mb-6">
          Enter your administrator email &amp; security password to continue.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-600 mb-1.5 font-medium">Administrator Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="email"
                placeholder="soham@botmartz.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-600 mb-1.5 font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-sm mt-6 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <><span>Sign In to Admin</span> <ArrowRight size={14} /></>}
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-slate-100 text-center">
          <a
            href="/"
            className="text-xs font-mono text-slate-500 hover:text-slate-800 transition-colors"
          >
            ← Return to Community Public Site
          </a>
        </div>

      </div>
    </div>
  );
}
