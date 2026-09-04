import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import RefundPolicyClient from "./RefundPolicyClient";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | Botmartz Community",
  description:
    "Official Refund & Cancellation Policy for Botmartz Community programs including the 45-Day Virtual AI Internship, Workshops, AI Summits, and Karma Coin wallet top-ups.",
  keywords: [
    "Botmartz refund policy",
    "Botmartz cancellation policy",
    "Razorpay refund terms",
    "AI internship refund India",
    "Botmartz student guarantees"
  ],
  alternates: {
    canonical: "/refund-policy"
  },
  openGraph: {
    title: "Refund & Cancellation Policy | Botmartz Community",
    description:
      "Transparent, fair, and fast reversals for all Botmartz fellowships, workshops, and passes.",
    url: "https://community.botmartz.com/refund-policy",
    images: [{ url: "/logo.png", width: 1200, height: 630 }]
  }
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-[#0066FF] selection:text-white font-sans antialiased">
      
      {/* Hero Header */}
      <div className="relative border-b border-slate-800 bg-linear-to-b from-slate-900 via-slate-950 to-slate-950 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          
          <div className="flex items-center gap-2 text-xs font-mono text-[#0066FF] uppercase font-bold tracking-wider">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span>LEGAL, COMPLIANCE &amp; CONSUMER ASSURANCE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-sans">
            Refund &amp; Cancellation Policy
          </h1>

          <p className="text-slate-400 text-sm sm:text-base max-w-3xl font-sans leading-relaxed">
            Transparent, builder-first guidelines governing purchases across the 45-Day Virtual AI Fellowship, hands-on masterclasses, developer summit passes, and Karma Coin packs.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 font-mono text-xs text-slate-500">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Governed by Founder Soham Sharma</span>
            </span>
            <span>•</span>
            <span>Last Updated: September 2026</span>
            <span>•</span>
            <span className="text-slate-400">Razorpay 256-Bit Escrow Gateway</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Policy Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <RefundPolicyClient />
      </div>

      {/* Footer Assistance CTA */}
      <div className="border-t border-slate-900 bg-slate-900/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-lg font-bold text-white font-sans">
              Have questions regarding a recent charge?
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Our billing support team typically responds to all inquiries within 24 business hours.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
            <Link
              href="/virtual-ai-internship"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-all border border-slate-700"
            >
              Explore Programs
            </Link>
            <a
              href="mailto:support@botmartz.com?subject=Refund%20Question"
              className="px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5"
            >
              <span>Contact Billing Desk</span>
              <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
