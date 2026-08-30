"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Compass, ArrowRight, Layers, Sparkles } from "lucide-react";

export default function EcosystemsRedirectPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FAFCFF] text-slate-900 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-center">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0066FF] flex items-center justify-center mx-auto mb-4">
          <Compass size={24} />
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2 font-sans">
          Ecosystems Unified into Career Roadmaps
        </h1>
        <p className="text-xs text-slate-600 font-mono mb-6 leading-relaxed">
          We have simplified the platform! All industry sectors and domain tracks are now integrated into our 50 Progressive Career Roadmaps.
        </p>

        <div className="space-y-2.5 font-mono text-xs">
          <Link
            href="/arena/roadmaps"
            className="w-full py-3 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold block transition-all shadow-xs"
          >
            Explore 50 Career Roadmaps →
          </Link>
          <Link
            href="/arena"
            className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold block transition-all"
          >
            Go to Internship Playground
          </Link>
        </div>
      </div>
    </div>
  );
}
