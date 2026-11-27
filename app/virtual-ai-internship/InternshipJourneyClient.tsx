"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { TOTAL_SYSTEMS_COUNT } from "@/lib/arena-projects";

export default function InternshipJourneyClient() {
  const steps = [
    {
      num: "01",
      title: "Enroll & Start Daily Sprints",
      desc: (
        <>
          Select an enrolled project from the Internship Playground blueprints. Read the schema requirements, initialize your repository, and log daily commits on{" "}
          <Link href="/arena/daily-log" className="text-white group-hover:text-[#1D3189] underline font-bold transition-colors duration-500">
            /arena/daily-log
          </Link>
          .
        </>
      ),
      tag: "Daily Commit Streaks",
      href: "/arena/daily-log",
    },
    {
      num: "02",
      title: 'Conquer the "Insane" Benchmark',
      desc: "Build one of the high-difficulty systems (Satellite Imagery, 3D MRI, Rust Order Book, LangGraph Swarm) and pass automated SLA benchmarks (<150ms latency, zero memory leaks).",
      tag: "Strict Test SLA Gates",
      href: "/arena",
    },
    {
      num: "03",
      title: "Founder Code Audit & Recommendation",
      desc: "Once your system passes code review, Founder Soham Sharma provides a detailed architecture audit, technical feedback, and a personalized recommendation letter for your portfolio.",
      tag: "Verifiable Proof of Work",
      href: "/certificates",
    },
  ];

  return (
    <>
      {/* ── 2. HOW THE FELLOWSHIP WORKS (SCROLL FROM LEFT + 45DEG CIRCLE ARROW) ── */}
      <section className="py-20 border-b border-slate-200/80 overflow-hidden">
        <div className="w-full px-4 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center max-w-3xl mx-auto mb-14"
          >
            <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#162774] text-white font-sans text-[11px] font-extrabold uppercase tracking-wider mb-3">
              The 3-Step Milestone Journey
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight font-sans">
              How You Build Your Engineering Portfolio
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm font-sans mt-2 font-medium">
              Follow our clear 3-step pipeline to transform from a student to a production engineer.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 font-sans text-xs">
            {steps.map((step, idx) => {
              const isBlueSlideCard = idx === 0;
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: idx * 0.14, ease: "easeOut" }}
                  className={`relative overflow-hidden rounded-3xl bg-white border border-l-4 border-l-[#162774] flex flex-col justify-between transition-all duration-500 group ${
                    isBlueSlideCard
                      ? "border-[#162774]/25 shadow-lg hover:shadow-2xl hover:-translate-y-1.5"
                      : "border-slate-200 shadow-md hover:shadow-xl hover:-translate-y-1.5"
                  }`}
                >
                  {/* Default Navbar blue (#162774) + grid lines ONLY on 01 that slides left on hover to reveal white theme */}
                  {isBlueSlideCard && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-[#162774] translate-x-0 group-hover:-translate-x-full transition-transform duration-700 ease-in-out"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
                      }}
                    />
                  )}

                  <div className="relative z-10 p-8 pb-4 flex-1">
                    {/* Top Row: Custom Shaped Number Badge + Top-Right Circle Arrow (45deg on hover) */}
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <span
                        className={`inline-flex items-center justify-center px-4 py-1.5 rounded-tr-2xl rounded-bl-2xl rounded-tl-md rounded-br-md font-black text-sm tracking-wider transition-colors duration-500 shadow-xs ${
                          isBlueSlideCard
                            ? "bg-white text-[#162774] group-hover:bg-[#162774] group-hover:text-white"
                            : "bg-[#162774] text-white"
                        }`}
                      >
                        {step.num}
                      </span>

                      <Link
                        href={step.href}
                        aria-label={step.title}
                        className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-500 shrink-0 ${
                          isBlueSlideCard
                            ? "bg-white/15 group-hover:bg-[#162774] border-white/25 group-hover:border-[#162774] text-white"
                            : "bg-slate-100 group-hover:bg-[#162774] border-slate-200 group-hover:border-[#162774] text-slate-900 group-hover:text-white"
                        }`}
                      >
                        <ArrowRight
                          size={15}
                          className="transition-transform duration-500 ease-out group-hover:rotate-45"
                        />
                      </Link>
                    </div>

                    <h3
                      className={`text-xl font-extrabold mb-2 font-sans transition-colors duration-500 ${
                        isBlueSlideCard
                          ? "text-white group-hover:text-slate-950"
                          : "text-slate-950 group-hover:text-[#1D3189]"
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p
                      className={`leading-relaxed font-medium transition-colors duration-500 ${
                        isBlueSlideCard
                          ? "text-blue-100/85 group-hover:text-slate-600"
                          : "text-slate-600"
                      }`}
                    >
                      {step.desc}
                    </p>
                  </div>

                  {isBlueSlideCard ? (
                    <div className="relative z-10 px-8 py-5 font-bold uppercase tracking-wider text-[11px] text-white group-hover:text-[#1D3189] transition-colors duration-500">
                      {step.tag}
                    </div>
                  ) : (
                    <div className="relative overflow-hidden px-8 py-5 border-t border-slate-100 group-hover:border-[#162774] transition-colors duration-500">
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-[#162774] -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out"
                        style={{
                          backgroundImage:
                            "linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
                          backgroundSize: "28px 28px",
                        }}
                      />
                      <div className="relative z-10 font-bold uppercase tracking-wider text-[11px] text-[#1D3189] group-hover:text-white transition-colors duration-500">
                        {step.tag}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. WEEKLY FOUNDER OFFICE HOURS & CLINICS (SCROLL FROM LEFT + CIRCLE CHECKS + 45DEG CIRCLE ARROW) ── */}
      <section className="py-16 border-b border-slate-200/80 overflow-hidden">
        <div className="w-full px-4 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="bg-[#162774] text-white rounded-3xl p-8 sm:p-12 border border-white/15 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          >
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-white/15 border border-white/20 text-white font-sans text-[11px] font-extrabold uppercase tracking-wider">
                Weekly Mentorship &amp; Live Reviews
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-sans">
                Saturday Founder Technical Office Hours
              </h2>
              <p className="text-blue-100/85 font-sans text-xs sm:text-sm leading-relaxed">
                Join Founder Soham Sharma every Saturday from <strong className="text-white">3:00 PM – 7:00 PM IST</strong> on Google Meet for live architecture teardowns, latency profiling, schema reviews, and code debugging.
              </p>
              <div className="flex flex-wrap gap-5 text-xs font-sans pt-2">
                {["1-on-1 Code Teardowns", "System Design Q&A", "Architecture Defense"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-blue-50 font-bold">
                    <span className="w-5 h-5 rounded-full bg-white text-[#162774] flex items-center justify-center shrink-0">
                      <Check size={11} strokeWidth={3} />
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full lg:w-auto font-sans text-xs">
              <Link
                href="/arena/calendar"
                className="relative overflow-hidden px-6 py-3.5 rounded-2xl bg-white text-[#162774] font-bold text-center transition-all duration-300 shadow-lg flex items-center justify-between gap-3 group/btn"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-blue-50 -translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-in-out"
                />
                <span className="relative z-10">View Event Calendar</span>
                <span className="relative z-10 w-7 h-7 rounded-full bg-[#162774] text-white flex items-center justify-center transition-transform duration-500 group-hover/btn:rotate-45 shrink-0">
                  <ArrowRight size={13} />
                </span>
              </Link>
              <Link
                href="/discussions"
                className="relative overflow-hidden px-6 py-3.5 rounded-2xl bg-white/10 text-white hover:text-[#162774] font-bold text-center transition-colors duration-500 border border-white/25 group/btn"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-white -translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-in-out"
                />
                <span className="relative z-10">Join Discussions Forum</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
