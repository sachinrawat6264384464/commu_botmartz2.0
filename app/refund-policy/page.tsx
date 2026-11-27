import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight } from "lucide-react";
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
    <div
      className="min-h-screen bg-white text-slate-900 pt-24 pb-16 font-sans antialiased selection:bg-[#D9F83B] selection:text-slate-950"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(29, 49, 137, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(29, 49, 137, 0.08) 1px, transparent 1px)",
        backgroundSize: "72px 72px",
      }}
    >
      <div className="w-full px-4 sm:px-8 lg:px-12 space-y-10">
        {/* Hero Header */}
        <section
          className="rounded-3xl bg-[#162774] text-white p-7 sm:p-11 border border-white/15 shadow-2xl space-y-4"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        >
          <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#D9F83B] text-slate-950 font-sans text-[11px] font-extrabold uppercase tracking-wider">
            Legal, Compliance &amp; Consumer Assurance
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-sans">
            Refund &amp; <span className="text-[#D9F83B]">Cancellation Policy</span>
          </h1>

          <p className="text-blue-100/85 text-xs sm:text-sm max-w-3xl font-sans leading-relaxed">
            Transparent, builder-first guidelines governing purchases across the 45-Day Virtual AI Fellowship, hands-on masterclasses, developer summit passes, and Karma Coin packs.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-blue-200/80">
            <span className="text-[#D9F83B] font-bold">
              Governed by Founder Soham Sharma
            </span>
            <span>&bull;</span>
            <span>Last Updated: September 2026</span>
            <span>&bull;</span>
            <span>Razorpay 256-Bit Escrow Gateway</span>
          </div>
        </section>

        {/* Main Interactive Policy Content (Left Sticky TOC + Right Scrollable Sections) */}
        <RefundPolicyClient />

        {/* Footer Assistance CTA */}
        <section
          className="flex flex-col md:flex-row items-center justify-between gap-6 p-7 sm:p-10 rounded-3xl bg-[#162774] text-white border border-white/15 shadow-2xl"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        >
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-lg sm:text-xl font-extrabold text-white font-sans">
              Have questions regarding a recent charge?
            </h3>
            <p className="text-xs sm:text-sm text-blue-100/80 font-sans">
              Our billing support team typically responds to all inquiries within 24 business hours.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0 font-sans text-xs sm:text-sm">
            <Link
              href="/virtual-ai-internship"
              className="group relative overflow-hidden px-6 py-3 rounded-full bg-white/10 text-white font-extrabold transition-colors duration-300 border border-white/25 inline-flex items-center justify-center"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-white -translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"
              />
              <span className="relative z-10 group-hover:text-[#162774] transition-colors duration-300">
                Explore Programs
              </span>
            </Link>
            <a
              href="mailto:support@botmartz.com?subject=Refund%20Question"
              className="group relative overflow-hidden px-6 py-3 rounded-full bg-[#D9F83B] text-slate-950 font-extrabold transition-all shadow-lg inline-flex items-center gap-2.5"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-white -translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"
              />
              <span className="relative z-10">Contact Billing Support</span>
              <span className="relative z-10 w-6 h-6 rounded-full bg-[#162774] text-[#D9F83B] flex items-center justify-center transition-transform duration-300 group-hover:rotate-[60deg]">
                <ArrowRight size={12} />
              </span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
