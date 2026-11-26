"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ArenaProject, TOTAL_SYSTEMS_COUNT } from "@/lib/arena-projects";

export function InsaneMatrixClient({ insaneProjects }: { insaneProjects: ArenaProject[] }) {
  return (
    <section className="py-16 border-b border-slate-200/80 overflow-hidden">
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div
          className="rounded-3xl bg-[#162774] text-white p-7 sm:p-11 border border-white/15 shadow-2xl"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -40, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
          >
            <div>
              <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#D9F83B] text-slate-950 font-sans text-[11px] font-extrabold uppercase tracking-wider mb-3">
                The Crucial Milestone
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
                The &quot;Insane&quot; Projects Matrix
              </h2>
              <p className="text-blue-100/80 text-xs sm:text-sm font-sans mt-1.5">
                Completing any of these 6 production systems unlocks Founder Code Audit &amp; Recommendation eligibility.
              </p>
            </div>

            <Link
              href="/arena"
              className="px-6 py-3 rounded-2xl bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-sans text-xs font-bold transition-all duration-300 shrink-0 flex items-center gap-2.5 group"
            >
              <span>Explore All {TOTAL_SYSTEMS_COUNT} PRDs</span>
              <span className="w-7 h-7 rounded-full bg-slate-950 text-[#D9F83B] flex items-center justify-center transition-transform duration-500 ease-out group-hover:rotate-[60deg]">
                <ArrowRight size={13} />
              </span>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans text-xs">
            {insaneProjects.map((p, idx) => {
              // Alternate split entrance: left column from left, middle from bottom, right from right
              const col = idx % 3;
              const initialOffset =
                col === 0
                  ? { opacity: 0, x: -45, y: 0, filter: "blur(8px)" }
                  : col === 2
                  ? { opacity: 0, x: 45, y: 0, filter: "blur(8px)" }
                  : { opacity: 0, x: 0, y: 36, filter: "blur(8px)" };

              return (
                <motion.div
                  key={p.id}
                  initial={initialOffset}
                  whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.65, delay: (idx % 3) * 0.1, ease: "easeOut" }}
                  className="relative overflow-hidden rounded-3xl bg-white text-slate-950 border border-slate-200 border-l-4 border-l-[#D9F83B] flex flex-col justify-between shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 group"
                >
                  <div className="p-6 pb-4">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#070E54] text-[#D9F83B] font-bold text-[10px] uppercase">
                        {p.difficulty}
                      </span>
                      <span className="text-[11px] text-slate-500 font-semibold">{p.durationDays} Days Sprint</span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-950 font-sans mb-1.5 group-hover:text-[#1D3189] transition-colors duration-300">
                      {p.title}
                    </h3>
                    <p className="text-slate-600 text-xs font-sans line-clamp-3 mb-4 leading-relaxed font-medium">
                      {p.overview}
                    </p>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 font-medium">
                      <span className="text-[#1D3189] font-bold">Strict SLA:</span> {p.productionSla}
                    </div>
                  </div>

                  {/* Bottom Footer Strip: Slow-motion blue slide fill ONLY in this bottom section */}
                  <div className="relative overflow-hidden px-6 py-4 border-t border-slate-100 group-hover:border-[#162774] flex items-center justify-between gap-2 transition-colors duration-500">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-[#162774] -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
                        backgroundSize: "28px 28px",
                      }}
                    />

                    <div className="relative z-10 flex flex-wrap gap-1.5">
                      {p.techStack.slice(0, 2).map((t, ti) => (
                        <span
                          key={ti}
                          className="text-[10px] text-slate-700 bg-slate-100 border border-slate-200 group-hover:bg-white/15 group-hover:text-[#D9F83B] group-hover:border-white/20 px-2.5 py-1 rounded-lg font-semibold transition-all duration-500"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`/arena/${p.slug || p.id}`}
                      className="relative z-10 px-3.5 py-2 rounded-xl bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-bold text-xs transition-all duration-300 flex items-center gap-2 group/btn shrink-0"
                    >
                      <span>View PRD</span>
                      <span className="w-6 h-6 rounded-full bg-slate-950 text-[#D9F83B] flex items-center justify-center transition-transform duration-500 ease-out group-hover/btn:rotate-[60deg]">
                        <ArrowRight size={11} />
                      </span>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export function FounderAuditPolicyClient() {
  const gates = [
    {
      num: "1",
      title: "Conquer 1 Insane-Tier Project:",
      desc: "Must complete either Satellite AI, 3D MRI UNETR, Rust Order Book, LangGraph Multi-Agent Swarm, or Linux Kernel eBPF.",
    },
    {
      num: "2",
      title: "Zero-Tolerance SLA Benchmarking:",
      desc: "System must pass automated tests (p95 latency < 150ms, >85% test coverage, zero memory leaks).",
    },
    {
      num: "3",
      title: "Daily Heatmap Proof-of-Work:",
      desc: "Must maintain an active commit streak on GitHub with clear PR descriptions and architectural reasoning.",
    },
  ];

  return (
    <section className="py-16 border-b border-slate-200/80 overflow-hidden">
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, x: 45, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="p-8 sm:p-10 rounded-3xl bg-[#162774] text-white border border-white/15 shadow-2xl"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        >
          <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#D9F83B] text-slate-950 font-sans text-[11px] font-extrabold uppercase tracking-wider mb-4">
            Strict Meritocracy Policy
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-sans mb-3">
            How Founder Code Audit &amp; Recommendation Works
          </h3>

          <p className="text-blue-100/85 font-sans text-xs sm:text-sm leading-relaxed mb-6">
            We enforce authentic engineering rigor. Founder Soham Sharma reviews your code and writes your portfolio recommendation{" "}
            <strong className="text-white">only when you meet these strict gates:</strong>
          </p>

          <div className="space-y-3 font-sans text-xs text-blue-100/90">
            {gates.map((gate, idx) => (
              <motion.div
                key={gate.num}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -36 : 36, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: idx * 0.1, ease: "easeOut" }}
                className="relative overflow-hidden p-4 rounded-2xl bg-white/[0.06] border border-white/15 flex items-center justify-between gap-4 hover:border-white transition-colors duration-500 group"
              >
                {/* Top-to-bottom slow-motion white slide fill on hover */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-white -translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out"
                />

                <div className="relative z-10 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#D9F83B] group-hover:bg-[#070E54] text-slate-950 group-hover:text-[#D9F83B] font-extrabold flex items-center justify-center shrink-0 transition-colors duration-500">
                    {gate.num}
                  </span>
                  <div className="text-blue-100/90 group-hover:text-slate-700 transition-colors duration-500">
                    <strong className="text-white group-hover:text-slate-950 transition-colors duration-500">{gate.title}</strong> {gate.desc}
                  </div>
                </div>
                <span className="relative z-10 w-7 h-7 rounded-full bg-white/10 group-hover:bg-[#070E54] text-[#D9F83B] flex items-center justify-center shrink-0 transition-all duration-500 ease-out group-hover:rotate-[60deg]">
                  <ArrowRight size={13} />
                </span>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
            <span className="text-blue-200/85 font-sans text-xs font-medium">
              Meet the criteria &rarr; Founder Recommendation unlocked.
            </span>
            <Link
              href="/arena"
              className="px-5 py-2.5 rounded-xl bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-sans text-xs font-bold transition-all flex items-center gap-2.5 group"
            >
              <span>Pick an Insane Project</span>
              <span className="w-6 h-6 rounded-full bg-slate-950 text-[#D9F83B] flex items-center justify-center transition-transform duration-500 ease-out group-hover:rotate-[60deg]">
                <ArrowRight size={12} />
              </span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
