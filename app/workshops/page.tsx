"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Terminal, Award, CheckCircle2, Calendar, Clock, ArrowRight, ShieldCheck, Cpu, Code2, Sparkles, Zap, Star, Activity, Check, Layers, UserCheck } from "lucide-react";
import RazorpayModal from "@/app/_components/RazorpayModal";

export default function WorkshopsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [selectedPass, setSelectedPass] = useState({
    name: "Hands-on AI Agent & RAG Accelerator (9th Sept 9 PM)",
    amount: 0,
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
    <div className="bg-[#FAFCFF] min-h-screen text-slate-900 py-12 pt-24 font-sans relative overflow-hidden">
      
      {/* Dynamic Full-Width Container */}
      <div className="w-full px-4 sm:px-8 lg:px-12 max-w-[1700px] mx-auto relative z-10">
        
        {/* Top Live Banner Badge */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#0066FF] font-mono text-xs uppercase tracking-wider mb-4 font-bold shadow-2xs">
            <Zap size={14} className="text-amber-500 fill-amber-500 animate-pulse" />
            <span>Cohort 1 Live Masterclasses &bull; 14th Sept &ndash; Diwali 2026</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black text-slate-950 mb-4 font-sans tracking-tight leading-tight">
            AI Engineering Bootcamps &amp; Cohorts
          </h1>
          
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-mono text-xs sm:text-sm leading-relaxed">
            Zero-fluff live masterclasses where you architect and deploy production RAG clusters, autonomous agent state machines, and real-time telemetry systems.
          </p>

          {/* Interactive Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-6 font-mono text-xs">
            {["ALL", "AI AGENTS", "ENTERPRISE RAG", "DEFENCE & EMBEDDED"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-4 py-2 rounded-full transition-all duration-200 cursor-pointer font-bold ${
                  activeFilter === tab
                    ? "bg-[#0066FF] text-white shadow-md shadow-blue-500/20"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {tab === "ALL" ? "All Masterclasses" : tab}
              </button>
            ))}
          </div>
        </div>

        {/* 3-Column Bootcamps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          
          {/* Bootcamp 1: AI Agent Accelerator */}
          {(activeFilter === "ALL" || activeFilter === "AI AGENTS") && (
            <div className="bg-white border-2 border-blue-500/50 rounded-3xl p-8 sm:p-9 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0066FF] to-blue-400" />
              
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-blue-100/80 text-[#0066FF] font-mono text-xs font-bold uppercase border border-blue-200">
                    Live Masterclass
                  </span>
                  <span className="text-xs font-mono text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    Live Online
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mb-3 font-sans group-hover:text-[#0066FF] transition-colors">
                  Hands-on AI Agent Accelerator
                </h2>
                
                <p className="text-xs font-mono text-slate-600 leading-relaxed mb-6">
                  Build production LangGraph state machines, Pydantic schema validators, deterministic tool calling pipelines, and automated RAGAS evaluation harnesses.
                </p>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 font-mono text-[11px] mb-6">
                  {["#LangGraph", "#Pydantic", "#FastAPI", "#Docker", "#RAGAS"].map((t, ti) => (
                    <span key={ti} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold border border-slate-200/80">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="space-y-2.5 text-xs text-slate-700 font-mono mb-8 p-4 rounded-2xl bg-blue-50/40 border border-blue-100">
                  <div className="flex items-center gap-2">
                    <Clock size={15} className="text-[#0066FF] shrink-0" />
                    <span>Every Saturday 5:00 PM – 7:00 PM IST</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award size={15} className="text-[#0066FF] shrink-0" />
                    <span>Cryptographic QR Verified PDF Certificate</span>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="text-xs font-mono text-slate-400 uppercase font-bold tracking-wider mb-3">
                    What You Will Build:
                  </div>
                  <div className="space-y-2.5 font-mono text-xs text-slate-800">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 size={15} className="text-[#0066FF] shrink-0 mt-0.5" />
                      <span>Deterministic State Machine Architecture with LangGraph</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 size={15} className="text-[#0066FF] shrink-0 mt-0.5" />
                      <span>Human-in-the-Loop checkpointers &amp; approval queues</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 size={15} className="text-[#0066FF] shrink-0 mt-0.5" />
                      <span>Safe tool-calling against PostgreSQL &amp; REST APIs</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 size={15} className="text-[#0066FF] shrink-0 mt-0.5" />
                      <span>Production deployment via FastAPI &amp; Docker containers</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4 font-mono text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Community Access</div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-sans">Free Access</div>
                </div>
                <button
                  onClick={() => handleEnroll("Hands-on AI Agent Accelerator", 0, "Live Masterclass Series")}
                  className="bg-[#0066FF] hover:bg-[#0052CC] text-white px-7 py-3.5 rounded-2xl font-bold uppercase tracking-wider transition-all shadow-md shadow-blue-500/20 cursor-pointer flex items-center gap-2"
                >
                  <span>Enroll Free</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* Bootcamp 2: Enterprise RAG & Hybrid Search */}
          {(activeFilter === "ALL" || activeFilter === "ENTERPRISE RAG") && (
            <div className="bg-white border-2 border-amber-400/80 rounded-3xl p-8 sm:p-9 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 to-amber-300" />
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-500 text-slate-950 font-mono text-[10px] font-bold uppercase tracking-wider shadow-xs">
                Most Popular Track ⭐
              </div>

              <div>
                <div className="flex items-center justify-between gap-2 mb-4 pt-2">
                  <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-900 font-mono text-xs font-bold uppercase border border-amber-200">
                    Deep Dive Track
                  </span>
                  <span className="text-xs font-mono text-amber-700 font-bold flex items-center gap-1">
                    <UserCheck size={14} /> 1-on-1 Review
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mb-3 font-sans group-hover:text-amber-600 transition-colors">
                  Enterprise RAG &amp; Hybrid Search
                </h2>
                
                <p className="text-xs font-mono text-slate-600 leading-relaxed mb-6">
                  Master layout-aware PDF extraction, hybrid dense/sparse vector search with OpenSearch and Qdrant, cross-encoder rerankers, and citation provenance.
                </p>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 font-mono text-[11px] mb-6">
                  {["#Qdrant", "#OpenSearch", "#BGE-Reranker", "#HybridBM25", "#PDFPlumber"].map((t, ti) => (
                    <span key={ti} className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 font-bold border border-amber-200/80">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="space-y-2.5 text-xs text-slate-700 font-mono mb-8 p-4 rounded-2xl bg-amber-50/40 border border-amber-200/60">
                  <div className="flex items-center gap-2">
                    <Clock size={15} className="text-amber-700 shrink-0" />
                    <span>Interactive Live Coding + 1-on-1 Founder Teardown</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award size={15} className="text-amber-700 shrink-0" />
                    <span>Includes Verifiable Cryptographic PDF Certificate</span>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="text-xs font-mono text-slate-400 uppercase font-bold tracking-wider mb-3">
                    What You Will Build:
                  </div>
                  <div className="space-y-2.5 font-mono text-xs text-slate-800">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 size={15} className="text-amber-600 shrink-0 mt-0.5" />
                      <span>Table extraction &amp; chunking over complex multi-column PDFs</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 size={15} className="text-amber-600 shrink-0 mt-0.5" />
                      <span>Hybrid vector + BM25 indexing in Qdrant &amp; OpenSearch</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 size={15} className="text-amber-600 shrink-0 mt-0.5" />
                      <span>Cross-encoder reranking (BGE) for 95%+ retrieval precision</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 size={15} className="text-amber-600 shrink-0 mt-0.5" />
                      <span>Automated RAGAS SLA benchmark evaluation harnesses</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4 font-mono text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Tuition Fee</div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-950 font-sans">₹499</div>
                </div>
                <button
                  onClick={() => handleEnroll("Enterprise RAG & Hybrid Retrieval Bootcamp", 499, "Deep Dive Track + 1-on-1 Founder Review")}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-7 py-3.5 rounded-2xl font-bold uppercase tracking-wider transition-all shadow-md shadow-amber-500/20 cursor-pointer flex items-center gap-2"
                >
                  <span>Enroll ₹499</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* Bootcamp 3: Defence & Embedded Systems */}
          {(activeFilter === "ALL" || activeFilter === "DEFENCE & EMBEDDED") && (
            <div className="bg-slate-950 text-white border border-slate-800 rounded-3xl p-8 sm:p-9 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500" />
              
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-mono text-xs font-bold uppercase border border-purple-500/30">
                    Frontier Systems
                  </span>
                  <span className="text-xs font-mono text-purple-400 font-bold flex items-center gap-1">
                    <Cpu size={14} /> High SLA
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 font-sans group-hover:text-purple-400 transition-colors">
                  Autonomous Edge &amp; Satellite AI
                </h2>
                
                <p className="text-xs font-mono text-slate-400 leading-relaxed mb-6">
                  Architect real-time object detection pipelines on edge hardware, satellite imagery segmentation, and zero-latency Rust inference bindings.
                </p>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 font-mono text-[11px] mb-6">
                  {["#Rust", "#TensorRT", "#ONNX", "#YOLOv8", "#EmbeddedLinux"].map((t, ti) => (
                    <span key={ti} className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 font-bold border border-slate-800">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="space-y-2.5 text-xs text-slate-300 font-mono mb-8 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center gap-2">
                    <Clock size={15} className="text-purple-400 shrink-0" />
                    <span>Indore Tech Hub In-Person &amp; Live Discord</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award size={15} className="text-purple-400 shrink-0" />
                    <span>Cryptographic QR PDF &amp; Job Dispatch</span>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="text-xs font-mono text-slate-400 uppercase font-bold tracking-wider mb-3">
                    What You Will Build:
                  </div>
                  <div className="space-y-2.5 font-mono text-xs text-slate-300">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 size={15} className="text-purple-400 shrink-0 mt-0.5" />
                      <span>ONNX &amp; TensorRT quantization for Jetson Nano &amp; Raspberry Pi</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 size={15} className="text-purple-400 shrink-0 mt-0.5" />
                      <span>Rust FFI bindings for low-latency video frame processing</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 size={15} className="text-purple-400 shrink-0 mt-0.5" />
                      <span>Satellite imagery change detection with PyTorch &amp; GDAL</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 size={15} className="text-purple-400 shrink-0 mt-0.5" />
                      <span>Offline resilience &amp; local SQLite WAL buffer queues</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800 flex items-center justify-between gap-4 font-mono text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Founder Fellowship Track</div>
                  <div className="text-2xl sm:text-3xl font-black text-white font-sans">₹1,999</div>
                </div>
                <button
                  onClick={() => handleEnroll("Autonomous Edge & Satellite AI Fellowship Track", 1999, "Founder Placement Track + 1-on-1 Code Review")}
                  className="bg-purple-600 hover:bg-purple-500 text-white px-7 py-3.5 rounded-2xl font-bold uppercase tracking-wider transition-all shadow-md shadow-purple-500/20 cursor-pointer flex items-center gap-2"
                >
                  <span>Enroll ₹1,999</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Guaranteed Fellowship Trust Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 mb-16 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left font-mono text-xs">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0">
                <ShieldCheck size={22} />
              </div>
              <div>
                <div className="font-bold text-white text-sm font-sans">Cryptographic Credentials</div>
                <div className="text-slate-400 text-[11px] mt-0.5">QR verifiable PDF certificate upon passing automated test suites.</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
                <UserCheck size={22} />
              </div>
              <div>
                <div className="font-bold text-white text-sm font-sans">Founder Code Teardowns</div>
                <div className="text-slate-400 text-[11px] mt-0.5">Direct 1-on-1 architecture reviews with Founder Soham Sharma.</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <Award size={22} />
              </div>
              <div>
                <div className="font-bold text-white text-sm font-sans">Direct Partner Dispatch</div>
                <div className="text-slate-400 text-[11px] mt-0.5">Top project submitters get referred directly to 15 partner companies.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home CTA */}
        <div className="text-center font-mono text-xs">
          <Link
            href="/"
            className="text-[#0066FF] hover:underline font-bold inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full border border-slate-200 shadow-2xs hover:shadow-md transition-all"
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

