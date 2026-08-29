import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Layers,
  Cpu,
  Database,
  Terminal,
  Trophy,
  ExternalLink,
  ShieldAlert,
  BookOpen,
  Calendar,
  ArrowLeft,
  CheckCircle2,
  Users,
  Flame,
  Code2,
  HardDrive
} from "lucide-react";
import { ARENA_PROJECTS, ArenaProject } from "@/lib/arena-projects";

interface Props {
  params: Promise<{ projectId: string }>;
}

export async function generateStaticParams() {
  return ARENA_PROJECTS.map((p) => ({
    projectId: p.slug,
  }));
}

export default async function ProjectDetailPage({ params }: Props) {
  const { projectId } = await params;
  const project = ARENA_PROJECTS.find(
    (p) => p.slug === projectId || p.id === projectId
  );

  if (!project) {
    notFound();
  }

  const isGTH = project.difficulty === "Expert Tier";

  return (
    <div className="bg-[#FAFCFF] min-h-screen text-slate-900 selection:bg-[#0066FF] selection:text-white pt-24 pb-28 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link
          href="/arena"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-500 hover:text-[#0066FF] transition-colors mb-6"
        >
          <ArrowLeft size={14} /> Back to Internship Playground
        </Link>

        {/* Hero Header */}
        <div
          className={`rounded-3xl p-8 sm:p-12 mb-10 relative overflow-hidden border ${
            isGTH
              ? "bg-slate-950 text-white border-rose-600/80 shadow-2xl shadow-rose-950/40"
              : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase ${
                isGTH
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                  : project.difficulty === "Insane"
                  ? "bg-purple-100 text-purple-800"
                  : "bg-blue-100 text-[#0066FF]"
              }`}
            >
              {project.difficulty} Track
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-mono font-bold">
              {project.domain}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-mono">
              30-Day Milestone Sprint
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
            {project.title}
          </h1>
          <p className={`text-sm sm:text-base leading-relaxed mb-6 ${isGTH ? "text-slate-300" : "text-slate-600"}`}>
            {project.overview}
          </p>

          {project.prizePool && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm font-mono font-bold flex items-center gap-2">
              <Trophy size={18} className="text-amber-400" />
              <span>Finalist Prize Pool: {project.prizePool}</span>
            </div>
          )}

          {/* Stacks */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            {project.techStack.map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/arena"
              className="px-6 py-3.5 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-sm"
            >
              Enroll in this Project
            </Link>
            <Link
              href="/arena/daily-log"
              className="px-6 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-white text-xs font-mono font-bold uppercase tracking-wider transition-all border border-slate-300 dark:border-slate-700"
            >
              Submit Daily Standup
            </Link>
          </div>
        </div>

        {/* Architecture Section */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 mb-8 shadow-xs">
          <div className="flex items-center gap-2.5 text-xs font-mono font-bold text-[#0066FF] uppercase mb-2">
            <Cpu size={16} /> Technical Architecture Breakdown
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
            System Topology &amp; Component Pipeline
          </h2>
          <div className="bg-slate-950 text-slate-200 p-5 rounded-2xl font-mono text-xs leading-relaxed mb-6 border border-slate-800">
            {project.architectureNotes}
          </div>

          <h3 className="text-sm font-bold font-mono uppercase text-slate-800 mb-3">
            Database Schema &amp; Entities:
          </h3>
          <div className="space-y-2 mb-6">
            {project.databaseSchema.map((schema, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800">
                <span className="text-[#0066FF] font-bold mr-2">TABLE #{idx + 1}:</span>
                {schema}
              </div>
            ))}
          </div>

          <h3 className="text-sm font-bold font-mono uppercase text-slate-800 mb-3">
            Core REST / gRPC API Specifications:
          </h3>
          <div className="space-y-2">
            {project.apiEndpoints.map((ep, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-md font-bold ${ep.method === "POST" ? "bg-emerald-100 text-emerald-800" : ep.method === "GET" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"}`}>
                    {ep.method}
                  </span>
                  <span className="font-bold text-slate-900">{ep.path}</span>
                </div>
                <span className="text-slate-600">{ep.description}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 30-Day Milestones Sprint */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 mb-8 shadow-xs">
          <div className="flex items-center gap-2.5 text-xs font-mono font-bold text-[#0066FF] uppercase mb-2">
            <Calendar size={16} /> Execution Sprint Roadmap
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">
            30-Day Structured Deliverables
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {project.milestones.map((m, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-[#0066FF] font-bold mb-1">
                    <span>{m.phase}</span>
                    <span className="text-slate-500">{m.days}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">{m.goal}</h3>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {m.deliverables.map((d, dIdx) => (
                      <li key={dIdx} className="flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Strict Automated Testing & Acceptance Gates Section */}
        <section className="bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 mb-8 border border-slate-800 shadow-xl">
          <div className="flex items-center gap-2.5 text-xs font-mono font-bold text-rose-400 uppercase mb-2">
            <ShieldAlert size={16} /> Strict Automated Verification &amp; Acceptance Gates
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
            Deterministic Evaluation Benchmarks
          </h2>
          <p className="text-xs text-slate-300 mb-6 font-mono leading-relaxed">
            Zero subjective grading. To receive project completion certification, your codebase must pass the automated benchmark test suite and fulfill every hard SLA gate below.
          </p>

          {/* Test Command Box */}
          <div className="mb-6">
            <div className="text-[11px] font-mono text-slate-400 uppercase mb-1.5 font-bold">Automated Test Execution Command:</div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-emerald-400 flex items-center justify-between gap-3">
              <code>$ {project.strictTestCommand}</code>
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                Automated Gate
              </span>
            </div>
          </div>

          {/* Acceptance Gates Table */}
          <div className="space-y-3 mb-6">
            <div className="text-[11px] font-mono text-slate-400 uppercase font-bold">Mandatory Acceptance Criteria:</div>
            {project.acceptanceGates.map((gate, gIdx) => (
              <div key={gIdx} className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 font-mono text-xs">
                <div>
                  <span className="font-bold text-white">{gate.rule}</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">{gate.description}</p>
                </div>
                <span className="px-3 py-1 rounded-lg bg-blue-500/20 text-[#00B8F0] font-bold text-xs border border-blue-500/30 shrink-0">
                  {gate.threshold}
                </span>
              </div>
            ))}
          </div>

          {/* Production SLA */}
          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-xs flex items-center justify-between flex-wrap gap-2">
            <span><strong>Production SLA Target:</strong> {project.productionSla}</span>
            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-[10px] font-bold">Production Ready</span>
          </div>
        </section>

        {/* Learning Resources & Attack Surface */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-700 uppercase mb-3">
              <BookOpen size={15} /> Curated YouTube &amp; Learning Docs
            </div>
            <div className="space-y-3">
              {project.learningResources.map((res, i) => (
                <a
                  key={i}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-xs font-medium text-slate-800 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-mono font-bold text-[#0066FF]">
                      {res.type}
                    </span>
                    <span className="line-clamp-1">{res.title}</span>
                  </div>
                  <ExternalLink size={13} className="text-slate-400 shrink-0" />
                </a>
              ))}
            </div>
          </div>

          {project.pentestAttackSurface && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-600 uppercase mb-3">
                <ShieldAlert size={15} /> Pen-testing Attack Vectors
              </div>
              <div className="space-y-2 text-xs text-slate-700 font-mono">
                {project.pentestAttackSurface.map((atk, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200 flex items-start gap-2">
                    <span className="text-rose-600 font-bold">⚠️</span>
                    <span>{atk}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </section>

        {/* 5TB Google Drive Banner */}
        <div className="p-6 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <HardDrive size={20} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Submit Artifacts to 5TB Community Drive</h4>
              <p className="text-xs text-slate-600">Store raw datasets, video walkthroughs, and architecture backups.</p>
            </div>
          </div>
          <a
            href="https://drive.google.com/drive/folders/1KExMwvCxqd1rn9tgcbIFxAK0vw900CfH?usp=drive_link"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-mono font-bold whitespace-nowrap transition-all shadow-xs"
          >
            Open 5TB Folder ↗
          </a>
        </div>

      </div>
    </div>
  );
}
