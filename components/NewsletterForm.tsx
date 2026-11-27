"use client";

import React, { useState } from "react";
import { Mail, CheckCircle2, AlertCircle, Loader2, Send } from "lucide-react";

interface NewsletterFormProps {
  variant?: "footer" | "standalone" | "card";
  className?: string;
}

export default function NewsletterForm({ variant = "footer", className = "" }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "already" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: variant }),
      });

      const data = await res.json();

      if (data.success) {
        if (data.alreadySubscribed) {
          setStatus("already");
          setMessage("You are already subscribed to the Botmartz dispatch!");
        } else {
          setStatus("success");
          setMessage("Thank you! You are now subscribed to Botmartz Community updates.");
          setEmail("");
        }
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to subscribe. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Connection error. Please check your network and try again.");
    }
  };

  if (variant === "card") {
    return (
      <div className={`relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-[#0A1124] to-[#040914] p-8 shadow-2xl backdrop-blur-xl ${className}`}>
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="relative z-10">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-cyan-400">
              BOTMARTZ DISPATCH
            </span>
          </div>
          <h3 className="mb-2 text-2xl font-bold text-white">Join 5,000+ AI Builders & Engineers</h3>
          <p className="mb-6 text-sm leading-relaxed text-slate-400">
            Get high-signal weekly technical deep dives, system architecture breakdowns, and live bootcamp announcements directly to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
              <input
                id="newsletter-card-email-input"
                type="email"
                placeholder="Enter your work email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "submitting"}
                className="w-full rounded-xl border border-slate-800 bg-[#050B14] py-3.5 pl-12 pr-4 text-sm text-white placeholder-slate-500 transition-all focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <button
              id="newsletter-card-submit-btn"
              type="submit"
              disabled={status === "submitting"}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3.5 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-cyan-500/20 transition-all hover:opacity-95 disabled:opacity-50"
            >
              {status === "submitting" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Subscribing...
                </>
              ) : (
                <>
                  Subscribe Now <Send className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {message && (
            <div
              className={`mt-4 flex items-center gap-2.5 rounded-xl border p-3 text-xs font-medium ${
                status === "success" || status === "already"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : "border-rose-500/30 bg-rose-500/10 text-rose-400"
              }`}
            >
              {status === "success" || status === "already" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0" />
              )}
              <span>{message}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default Footer Form Variant
  return (
    <div className={`space-y-3 font-sans ${className}`}>
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#D9F83B]" />
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-white">
            Stay Ahead in AI &amp; System Design
          </h4>
        </div>
        <p className="text-xs sm:text-[13px] text-blue-100/90 font-medium leading-relaxed">
          Subscribe to receive weekly proof-of-work project updates and cohorts.{" "}
          <span className="text-[#D9F83B] font-semibold">No spam, ever.</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative flex max-w-md items-center">
        <input
          id="newsletter-footer-email-input"
          type="email"
          placeholder="your.email@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "submitting"}
          className="w-full rounded-xl border border-white bg-white py-2.5 pl-4 pr-28 text-xs font-medium text-slate-950 placeholder-slate-400 shadow-sm transition-all focus:border-[#D9F83B] focus:outline-none"
        />
        <button
          id="newsletter-footer-submit-btn"
          type="submit"
          disabled={status === "submitting"}
          className="absolute right-1.5 rounded-lg bg-[#D9F83B] hover:bg-[#e5ff59] px-3.5 py-1.5 text-xs font-bold text-slate-950 transition-all cursor-pointer disabled:opacity-50"
        >
          {status === "submitting" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Subscribe"}
        </button>
      </form>

      {message && (
        <div
          className={`flex items-center gap-2 text-xs font-medium ${
            status === "success" || status === "already" ? "text-emerald-400" : "text-rose-400"
          }`}
        >
          {status === "success" || status === "already" ? (
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          ) : (
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          )}
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}
