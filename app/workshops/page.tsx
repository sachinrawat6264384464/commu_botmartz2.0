"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Terminal, Award, CheckCircle2, Calendar, Clock, ArrowRight, ShieldCheck, Cpu, Code2, Sparkles, Zap } from "lucide-react";
import RazorpayModal from "@/app/_components/RazorpayModal";

export default function WorkshopsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPass, setSelectedPass] = useState({
    name: "Hands-on AI Agent & RAG Accelerator (9th Sept 9 PM)",
    amount: 9,
    category: "FELLOWSHIP_PASS" as const,
    desc: "Live Cohort on 9th Sept @ 9:00 PM IST: Build LangGraph state machines, deterministic tool calling, and FastAPI Docker deployments."
  });

  const handleEnroll = (title: string, amount: number, desc: string) => {
    setSelectedPass({
      name: title,
      amount,
      category: "FELLOWSHIP_PASS",
      desc
    });
    setModalOpen(true);
  };

  return (
    <div className="bg-[#FAFCFF] min-h-screen text-slate-900 py-16 pt-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#0066FF] font-mono text-xs uppercase tracking-wider mb-4 font-semibold">
            <Zap size={14} className="text-amber-500 fill-amber-500" />
            <span>Going Live: 9th Sept @ 9:00 PM IST &bull; Flash Pass ₹9</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mb-4 font-sans tracking-tight">
            AI Engineering Bootcamps &amp; Cohorts
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto font-mono text-xs sm:text-sm">
            Zero-fluff live masterclasses where you architect and deploy production RAG clusters and autonomous agent state machines.
          </p>
        </div>

        {/* Bootcamps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          
          {/* Bootcamp 1 */}
          <div className="bg-white border-2 border-blue-500/40 rounded-3xl p-8 shadow-md flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-[#0066FF] font-mono text-xs font-bold uppercase">
                  Live Masterclass
                </span>
                <span className="text-xs font-mono text-emerald-600 font-bold">9th Sept @ 9:00 PM IST</span>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-3 font-sans">Hands-on AI Agent Accelerator</h2>
              <p className="text-xs font-mono text-slate-600 leading-relaxed mb-6">
                Build production LangGraph state machines, Pydantic schema validators, deterministic tool calling pipelines, and automated RAGAS evaluation harnesses.
              </p>

              <div className="space-y-2.5 text-xs text-slate-600 font-mono mb-8 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-[#0066FF]" />
                  <span>9th Sept @ 9:00 PM IST (Live Online)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award size={14} className="text-[#0066FF]" />
                  <span>Includes Verifiable Cryptographic PDF Certificate</span>
                </div>
              </div>

              <div className="mb-8">
                <div className="text-xs font-mono text-slate-400 uppercase font-semibold mb-3">
                  What You Will Build:
                </div>
                <div className="space-y-2 font-mono text-xs text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={14} className="text-[#0066FF] shrink-0 mt-0.5" />
                    <span>Deterministic State Machine Architecture with LangGraph</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={14} className="text-[#0066FF] shrink-0 mt-0.5" />
                    <span>Human-in-the-Loop checkpointers &amp; approval queues</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={14} className="text-[#0066FF] shrink-0 mt-0.5" />
                    <span>Safe tool-calling against PostgreSQL &amp; REST APIs</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={14} className="text-[#0066FF] shrink-0 mt-0.5" />
                    <span>Production deployment via FastAPI and Docker</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4 font-mono text-xs">
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Flash Launch Fee</div>
                <div className="text-3xl font-black text-slate-900">₹9</div>
              </div>
              <button
                onClick={() => handleEnroll("Hands-on AI Agent Accelerator (9th Sept 9 PM)", 9, "Live on 9th Sept @ 9:00 PM IST")}
                className="bg-[#0066FF] hover:bg-[#0052CC] text-white px-6 py-3.5 rounded-xl font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer"
              >
                Enroll for ₹9 &rarr;
              </button>
            </div>
          </div>

          {/* Bootcamp 2 */}
          <div className="bg-white border border-slate-200 hover:border-amber-400 rounded-3xl p-8 shadow-xs hover:shadow-md flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-900 font-mono text-xs font-bold uppercase border border-amber-100">
                  Deep Dive Track
                </span>
                <span className="text-xs font-mono text-amber-700 font-bold">1-on-1 Founder Review</span>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-3 font-sans">Enterprise RAG &amp; Hybrid Search</h2>
              <p className="text-xs font-mono text-slate-600 leading-relaxed mb-6">
                Master layout-aware PDF extraction, hybrid dense/sparse vector search with OpenSearch and Qdrant, cross-encoder rerankers, and citation provenance.
              </p>

              <div className="space-y-2.5 text-xs text-slate-600 font-mono mb-8 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-amber-600" />
                  <span>Interactive Coding + 1-on-1 Review</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award size={14} className="text-amber-600" />
                  <span>Includes Verifiable Cryptographic PDF Certificate</span>
                </div>
              </div>

              <div className="mb-8">
                <div className="text-xs font-mono text-slate-400 uppercase font-semibold mb-3">
                  What You Will Build:
                </div>
                <div className="space-y-2 font-mono text-xs text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={14} className="text-amber-600 shrink-0 mt-0.5" />
                    <span>Table extraction &amp; chunking over complex multi-column PDFs</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={14} className="text-amber-600 shrink-0 mt-0.5" />
                    <span>Hybrid vector + BM25 indexing in Qdrant &amp; OpenSearch</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={14} className="text-amber-600 shrink-0 mt-0.5" />
                    <span>Cross-encoder reranking (BGE) for 95%+ precision</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={14} className="text-amber-600 shrink-0 mt-0.5" />
                    <span>Automated RAGAS evaluation harnesses</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4 font-mono text-xs">
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Tuition Fee</div>
                <div className="text-3xl font-black text-slate-900">₹499</div>
              </div>
              <button
                onClick={() => handleEnroll("Enterprise RAG & Hybrid Retrieval Bootcamp", 499, "Deep Dive Track + 1-on-1 Founder Review")}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-3.5 rounded-xl font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer"
              >
                Enroll for ₹499 &rarr;
              </button>
            </div>
          </div>

        </div>

        {/* Back to Home CTA */}
        <div className="text-center font-mono text-xs">
          <Link
            href="/"
            className="text-[#0066FF] hover:underline font-bold inline-flex items-center gap-1.5"
          >
            <span>&larr; Return to All-in-One Workshop Overview &amp; Direct Registration</span>
          </Link>
        </div>

      </div>

      {/* Razorpay Checkout Modal */}
      <RazorpayModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        amount={selectedPass.amount}
        itemName={selectedPass.name}
        itemCategory={selectedPass.category}
        description={selectedPass.desc}
      />
    </div>
  );
}
