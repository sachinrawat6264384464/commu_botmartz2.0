"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  HardDrive,
  Presentation,
  ShieldCheck,
  Send,
  Loader2,
  Check,
  X,
  Star,
  Sparkles,
  UserPlus,
  Briefcase,
  AlertCircle,
  FileText,
  KanbanSquare,
  Coins,
  Lightbulb,
  Lock,
  Unlock,
  Compass
} from "lucide-react";
import { ArenaProject } from "@/lib/arena-projects";
import { useAuth } from "@/lib/auth-context";
import BuilderProfileGateModal from "@/app/_components/BuilderProfileGateModal";

interface Props {
  project: ArenaProject;
}

export default function ProjectPRDClient({ project }: Props) {
  const { user, studentProfile } = useAuth();

  // Hint Unlock State
  const [hintUnlocked, setHintUnlocked] = useState(false);
  const [unlockedHintText, setUnlockedHintText] = useState("");
  const [unlockingHint, setUnlockingHint] = useState(false);
  const [hintError, setHintError] = useState("");

  // Determine hint coin cost: 1000 coins for Baby Step / Easy, 300 for others
  const isIntro = project.difficulty === "Baby Step" || project.difficulty === "Easy";
  const hintCost = isIntro ? 1000 : 300;

  useEffect(() => {
    if (user?.email) {
      fetch(`/api/arena/unlock-hint?email=${encodeURIComponent(user.email)}&projectId=${encodeURIComponent(project.id)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.unlocked) {
            setHintUnlocked(true);
            setUnlockedHintText(data.hint || project.hint || project.architectureNotes);
          }
        })
        .catch(() => {});
    }
  }, [user, project]);

  const handleUnlockHint = async () => {
    if (!user?.email) {
      setShowGateModal(true);
      return;
    }

    setUnlockingHint(true);
    setHintError("");
    try {
      const res = await fetch("/api/arena/unlock-hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, projectId: project.id })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setHintError(data.error || `Insufficient Karma Coins. You need ${hintCost} coins to unlock this hint.`);
      } else {
        setHintUnlocked(true);
        setUnlockedHintText(data.hint);
      }
    } catch (e: any) {
      setHintError(e.message || "Failed to unlock architecture hint.");
    } finally {
      setUnlockingHint(false);
    }
  };

  // Profile Gating State
  const [showGateModal, setShowGateModal] = useState(false);

  // Enrollment Modal State
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [teamType, setTeamType] = useState<"Solo" | "Squad">("Solo");
  const [teamName, setTeamName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [github, setGithub] = useState("");
  const [role, setRole] = useState("Backend Dev");
  const [dpdpConsent, setDpdpConsent] = useState(true);
  const [termsConsent, setTermsConsent] = useState(true);

  // Squad Members State
  const [squadMembers, setSquadMembers] = useState<
    { name: string; emailOrHandle: string; role: string }[]
  >([{ name: "", emailOrHandle: "", role: "AI Engineer" }]);

  const [enrolling, setEnrolling] = useState(false);
  const [enrolledSuccess, setEnrolledSuccess] = useState(false);
  const [enrollError, setEnrollError] = useState("");

  // Testimonials State
  // Testimonials State
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewName, setReviewName] = useState("");
  const [reviewRole, setReviewRole] = useState("AI Engineer");
  const [reviewCollege, setReviewCollege] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch(`/api/testimonials?targetId=${encodeURIComponent(project.id)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.testimonials)) {
        setTestimonials(data.testimonials);
      }
    } catch (e) {
      console.warn("Failed to load testimonials:", e);
    } finally {
      setLoadingTestimonials(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [project.id]);

  // Autofill user details if logged in
  useEffect(() => {
    if (user?.email) {
      setName(user.displayName || studentProfile?.displayName || "");
      setEmail(user.email);
      setWhatsapp(studentProfile?.phoneNumber || "");
      setGithub(studentProfile?.githubUsername || "");
      setReviewName(user.displayName || studentProfile?.displayName || "");
      setReviewCollege(studentProfile?.collegeName || "");
    }
  }, [user, studentProfile]);

  const handleAddSquadMember = () => {
    if (squadMembers.length < 3) {
      setSquadMembers([
        ...squadMembers,
        { name: "", emailOrHandle: "", role: "Frontend Dev" }
      ]);
    }
  };

  const handleRemoveSquadMember = (index: number) => {
    setSquadMembers(squadMembers.filter((_, i) => i !== index));
  };

  const handleSquadMemberChange = (
    index: number,
    field: "name" | "emailOrHandle" | "role",
    val: string
  ) => {
    const updated = [...squadMembers];
    updated[index][field] = val;
    setSquadMembers(updated);
  };

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnrollError("");

    if (!dpdpConsent) {
      setEnrollError("Please accept the DPDP Act 2023 data processing consent to proceed.");
      return;
    }
    if (!termsConsent) {
      setEnrollError("Please accept the Community Honor Code and Terms to proceed.");
      return;
    }

    setEnrolling(true);

    try {
      const res = await fetch("/api/arena/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          whatsapp,
          github,
          role,
          teamType,
          teamName: teamType === "Squad" ? teamName : "Solo",
          projectId: project.id,
          projectTitle: project.title,
          difficulty: project.difficulty,
          dpdpConsent: true,
          squadMembers: teamType === "Squad" ? squadMembers : []
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to enroll in project.");
      }

      setEnrolledSuccess(true);
    } catch (err: any) {
      setEnrollError(err.message || "Failed to submit enrollment.");
    } finally {
      setEnrolling(false);
    }
  };

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    setReviewSubmitting(true);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetType: "PROJECT_PRD",
          targetId: project.id,
          targetTitle: project.title,
          authorName: reviewName.trim() || "Verified Builder",
          authorEmail: user?.email || "",
          authorRole: reviewRole,
          authorCollegeOrCompany: reviewCollege.trim() || "Botmartz Student",
          rating: reviewRating,
          content: reviewText.trim()
        })
      });

      const data = await res.json();
      if (data.success) {
        setReviewSubmitted(true);
        setTimeout(() => {
          setShowReviewModal(false);
          setReviewSubmitted(false);
          setReviewText("");
        }, 3000);
      } else {
        alert(data.error || "Failed to submit testimonial.");
      }
    } catch (err: any) {
      alert(err.message || "Failed to submit review.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const isGTH = project.difficulty === "Go To Hell" || project.difficulty === "Expert Tier";

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

        {/* Hero Header Card */}
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
                  : project.difficulty === "Baby Step"
                  ? "bg-emerald-100 text-emerald-800"
                  : project.difficulty === "Easy"
                  ? "bg-cyan-100 text-cyan-800"
                  : "bg-blue-100 text-[#0066FF]"
              }`}
            >
              {project.difficulty === "Expert Tier" ? "Go To Hell" : project.difficulty} Track
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-mono font-bold">
              {project.domain}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-mono font-bold">
              Cohort 1 Flagship System
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
          <div className="mt-8 flex flex-wrap items-center gap-4 font-mono text-xs">
            <button
              onClick={() => {
                if (!user) {
                  setShowGateModal(true);
                } else {
                  setShowEnrollModal(true);
                }
              }}
              className="px-6 py-3.5 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              <UserPlus size={15} />
              <span>Enroll in this Project</span>
            </button>
            <Link
              href={`/arena/${project.slug || project.id}/workspace`}
              className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
            >
              <KanbanSquare size={15} />
              <span>Agile Workspace &amp; QA Suite &rarr;</span>
            </Link>
            <Link
              href={`/arena/daily-log?projectId=${project.id}`}
              className="px-6 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-white font-bold uppercase tracking-wider transition-all border border-slate-300 dark:border-slate-700 flex items-center gap-2"
            >
              <Terminal size={15} />
              <span>Log Day Proof-of-Work &rarr;</span>
            </Link>
          </div>
        </div>

        {/* =========================================================================
            ARCHITECTURE HINT UNLOCKER (300 to 1,000 KARMA COINS)
        ========================================================================= */}
        <section className="bg-gradient-to-r from-amber-50 via-blue-50 to-purple-50 border border-amber-200 rounded-3xl p-6 sm:p-8 mb-8 shadow-xs font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Lightbulb size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm font-sans">Architectural Blueprint &amp; Implementation Hint</span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 font-bold text-[10px]">
                    {hintUnlocked ? "UNLOCKED" : `COST: ${hintCost} COINS`}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-mono mt-0.5">
                  {hintUnlocked
                    ? "Verified architectural shortcut and edge-case mitigation strategy for this production system."
                    : `Spend ${hintCost} Karma Coins from your wallet to reveal implementation hints, schema pitfalls, and edge cases.`}
                </p>
              </div>
            </div>

            {!hintUnlocked && (
              <button
                onClick={handleUnlockHint}
                disabled={unlockingHint}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold transition-all cursor-pointer flex items-center gap-2 shadow-xs shrink-0 self-start sm:self-auto"
              >
                {unlockingHint ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Unlocking...</span>
                  </>
                ) : (
                  <>
                    <Coins size={14} className="text-amber-950" />
                    <span>Unlock Hint ({hintCost} Coins)</span>
                  </>
                )}
              </button>
            )}
          </div>

          {hintError && (
            <div className="p-3 rounded-xl bg-rose-100 text-rose-800 border border-rose-200 mb-3 text-xs flex items-center gap-2">
              <AlertCircle size={14} />
              <span>{hintError}</span>
            </div>
          )}

          {hintUnlocked ? (
            <div className="p-4 rounded-2xl bg-white border border-emerald-300 text-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-[11px] uppercase">
                <Check size={14} /> Architecture Secret Unlocked
              </div>
              <p className="leading-relaxed font-sans text-xs text-slate-700">
                {unlockedHintText || project.hint || project.architectureNotes || "Follow the low-level design specifications and verify acceptance gates with k6/playwright."}
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-white/70 border border-dashed border-amber-300 flex items-center justify-between text-slate-400 select-none blur-[2px] hover:blur-none transition-all">
              <span>🔒 Architectural secret, memory-leak mitigation patterns, and optimal indexing keys are locked behind {hintCost} Karma Coins...</span>
            </div>
          )}
        </section>

        {/* =========================================================================
            HIGH-LEVEL DESIGN (HLD) & LOW-LEVEL DESIGN (LLD)
        ========================================================================= */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 mb-8 shadow-xs font-mono text-xs">
          <div className="flex items-center gap-2.5 text-xs font-mono font-bold text-indigo-700 uppercase mb-2">
            <Compass size={16} /> System Design Blueprint
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 font-sans">
            High-Level Design (HLD) &amp; Low-Level Design (LLD)
          </h2>
          <p className="text-slate-600 text-xs font-mono mb-6 leading-relaxed">
            Every production system in the Arena requires comprehensive design documentation before writing code:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-900 font-sans text-sm pb-2 border-b border-slate-200">
                <span>1. High-Level Design (HLD)</span>
                <span className="text-[10px] text-indigo-600 font-mono">Topology</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed font-mono">
                {project.highLevelDesign || project.architectureNotes || "Client Ingress -> API Gateway -> Distributed Worker Pool -> PostgreSQL / Vector Store -> Cache / Telemetry Layer."}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-900 font-sans text-sm pb-2 border-b border-slate-200">
                <span>2. Low-Level Design (LLD)</span>
                <span className="text-[10px] text-purple-600 font-mono">Class &amp; Data Contract</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed font-mono">
                {project.lowLevelDesign || "Atomic database transactions, strict Pydantic/Zod schemas, mutex locks for concurrent buffer writes, and structured error responses with HTTP standard error codes."}
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 1: WHERE IS THIS PRODUCT USED & TARGET BUYERS
        ========================================================================= */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 mb-8 shadow-xs">
          <div className="flex items-center gap-2.5 text-xs font-mono font-bold text-emerald-700 uppercase mb-2">
            <Briefcase size={16} /> Product Application &amp; Target Market
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 font-sans">
            Where Can This Product Be Used?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-mono leading-relaxed mb-6">
            Understanding who uses and buys your engineering system is essential for your pitch deck and recruiter screens:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 mb-1 font-sans">1. Target Ecosystem</div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Deployed across {project.domain} teams at enterprises, research labs, and defence agencies.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 mb-1 font-sans">2. Primary Buyer / User</div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                VP of Engineering, Operations Chiefs, Quantitative Hedge Funds, or Disaster Response Wings.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 mb-1 font-sans">3. Commercial Value</div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Replaces high-latency manual workflows with real-time autonomous pipelines, cutting costs by 60%+.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: TECHNICAL ARCHITECTURE & COMPONENT TOPOLOGY
        ========================================================================= */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 mb-8 shadow-xs">
          <div className="flex items-center gap-2.5 text-xs font-mono font-bold text-[#0066FF] uppercase mb-2">
            <Cpu size={16} /> Technical Architecture Breakdown
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 font-sans">
            System Topology &amp; Component Pipeline
          </h2>
          <div className="bg-slate-950 text-slate-200 p-5 rounded-2xl font-mono text-xs leading-relaxed mb-6 border border-slate-800">
            {project.architectureNotes}
          </div>

          <h3 className="text-sm font-bold font-mono uppercase text-slate-800 mb-3 flex items-center gap-2">
            <Database size={15} className="text-[#0066FF]" /> Database Schema &amp; Storage DDL
          </h3>
          <div className="space-y-2 mb-8">
            {project.databaseSchema.map((schema, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl font-mono text-xs text-slate-800"
              >
                <code>{schema}</code>
              </div>
            ))}
          </div>

          <h3 className="text-sm font-bold font-mono uppercase text-slate-800 mb-3 flex items-center gap-2">
            <Terminal size={15} className="text-purple-600" /> Core API Endpoints
          </h3>
          <div className="space-y-2.5">
            {project.apiEndpoints.map((ep, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs gap-2"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      ep.method === "GET"
                        ? "bg-blue-100 text-blue-800"
                        : ep.method === "POST"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {ep.method}
                  </span>
                  <span className="font-bold text-slate-900">{ep.path}</span>
                </div>
                <span className="text-slate-500 text-[11px]">{ep.description}</span>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: 5-POINT PROOF-OF-WORK DELIVERABLE REQUIREMENTS
        ========================================================================= */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 mb-8 shadow-xs font-mono text-xs">
          <div className="flex items-center gap-2 text-purple-700 font-bold uppercase mb-2">
            <Presentation size={15} /> Final Submission Deliverables
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 font-sans">
            5-Point Proof-of-Work Required for Referral Unlock
          </h2>
          <p className="text-slate-600 text-xs font-mono mb-6 leading-relaxed">
            To pass the final engineering audit by Soham Sharma &amp; squad, students must submit:
          </p>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="font-bold text-slate-800">1. Clean Public GitHub Repository</span>
              <span className="text-slate-500 text-[11px]">Passing tests, Dockerfile, and architecture diagram</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="font-bold text-slate-800">2. Live Production URL</span>
              <span className="text-slate-500 text-[11px]">Deployed on AWS / Vercel / Railway with SSL</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="font-bold text-slate-800">3. System Architecture &amp; Pitch Deck</span>
              <span className="text-slate-500 text-[11px]">5-Slide deck on target market, system topology &amp; KPIs</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="font-bold text-slate-800">4. 2-Minute Loom Demo Video</span>
              <span className="text-slate-500 text-[11px]">Code walkthrough &amp; live request benchmark demonstration</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="font-bold text-slate-800">5. Automated Benchmark Log</span>
              <span className="text-slate-500 text-[11px]">k6 load test report showing p95 latency under SLA</span>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: STUDENT TESTIMONIALS & REVIEWS
        ========================================================================= */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 mb-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
            <div>
              <div className="text-xs font-mono font-bold text-amber-700 uppercase mb-1">
                Verified Student Reviews
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-sans">
                Builder Testimonials &amp; Project Feedback
              </h2>
            </div>

            <button
              onClick={() => setShowReviewModal(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
            >
              <Star size={13} className="text-amber-400 fill-amber-400" />
              <span>Add Your Testimonial</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            {testimonials.map((t, idx) => (
              <div key={t.id || idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-bold text-slate-900 font-sans text-sm block">
                        {t.authorName || t.author}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {t.authorRole || t.role} • {t.authorCollegeOrCompany || t.college}
                      </span>
                    </div>
                    <div className="flex text-amber-400">
                      {Array.from({ length: t.rating || 5 }).map((_, i) => (
                        <Star key={i} size={13} className="fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-700 text-xs font-sans leading-relaxed my-2">
                    &quot;{t.content || t.text}&quot;
                  </p>
                </div>
                <div className="text-[10px] text-slate-400 text-right pt-2 border-t border-slate-200/60">
                  {t.createdAt ? new Date(t.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : t.date || "Verified Cohort"}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* =========================================================================
          INTERACTIVE DIRECT ENROLLMENT MODAL
      ========================================================================= */}
      {showEnrollModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl font-mono text-xs max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] text-[#0066FF] font-bold uppercase">Direct Project Enrollment</span>
                <h3 className="text-lg font-bold text-slate-900 font-sans">{project.title}</h3>
              </div>
              <button onClick={() => setShowEnrollModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {enrolledSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="text-xl font-bold text-slate-900 font-sans">
                  Successfully Enrolled in {project.title}!
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Your project slot has been locked. You are now registered to submit daily standups, attend Saturday teardowns, and unlock 15 company referrals.
                </p>
                <div className="flex gap-3 justify-center pt-2">
                  <Link
                    href="/arena/daily-log"
                    className="px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold"
                  >
                    Open Daily PoW Standup →
                  </Link>
                  <button
                    onClick={() => setShowEnrollModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleEnrollSubmit} className="space-y-4">
                
                {/* Team Type Switch */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5 uppercase text-[10px]">
                    Participation Format:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setTeamType("Solo")}
                      className={`py-2.5 rounded-xl font-bold border transition-all cursor-pointer ${
                        teamType === "Solo"
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      Solo Shipper
                    </button>
                    <button
                      type="button"
                      onClick={() => setTeamType("Squad")}
                      className={`py-2.5 rounded-xl font-bold border transition-all cursor-pointer ${
                        teamType === "Squad"
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      Cross-Functional Squad
                    </button>
                  </div>
                </div>

                {teamType === "Squad" && (
                  <div>
                    <label className="block text-slate-700 font-bold mb-1 uppercase text-[10px]">
                      Squad / Team Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Geospatial Squad"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                    />
                  </div>
                )}

                {/* Leader Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1 uppercase text-[10px]">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1 uppercase text-[10px]">Student Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="student@college.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1 uppercase text-[10px]">WhatsApp Phone # *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1 uppercase text-[10px]">Your Primary Role *</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                    >
                      <option value="Backend Dev">Backend Dev (Python/Node/Rust)</option>
                      <option value="AI Engineer">AI Engineer (PyTorch/LangGraph)</option>
                      <option value="Frontend Dev">Frontend Dev (Next.js/React)</option>
                      <option value="QA Tester">QA Automation Engineer</option>
                      <option value="Pen-tester">Security Pen-tester</option>
                    </select>
                  </div>
                </div>

                {/* Squad Members Sub-form */}
                {teamType === "Squad" && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 uppercase text-[10px]">
                        Squad Teammates ({squadMembers.length}/3)
                      </span>
                      {squadMembers.length < 3 && (
                        <button
                          type="button"
                          onClick={handleAddSquadMember}
                          className="text-[#0066FF] font-bold text-[11px] hover:underline cursor-pointer"
                        >
                          + Add Teammate
                        </button>
                      )}
                    </div>

                    {squadMembers.map((member, idx) => (
                      <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold">
                          <span>Teammate #{idx + 1}</span>
                          {squadMembers.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveSquadMember(idx)}
                              className="text-rose-500 hover:text-rose-700"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="text"
                            placeholder="Full Name"
                            value={member.name}
                            onChange={(e) => handleSquadMemberChange(idx, "name", e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px]"
                          />
                          <input
                            type="text"
                            placeholder="Email or @handle"
                            value={member.emailOrHandle}
                            onChange={(e) => handleSquadMemberChange(idx, "emailOrHandle", e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px]"
                          />
                          <select
                            value={member.role}
                            onChange={(e) => handleSquadMemberChange(idx, "role", e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[11px]"
                          >
                            <option value="AI Engineer">AI Engineer</option>
                            <option value="Backend Dev">Backend Dev</option>
                            <option value="Frontend Dev">Frontend Dev</option>
                            <option value="QA Tester">QA Tester</option>
                            <option value="Pen-tester">Pen-tester</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* DPDP Act & Terms Consent */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <label className="flex items-start gap-2.5 cursor-pointer text-slate-700 text-[11px] leading-relaxed">
                    <input
                      type="checkbox"
                      checked={dpdpConsent}
                      onChange={(e) => setDpdpConsent(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300 text-[#0066FF] focus:ring-blue-500 w-4 h-4 cursor-pointer shrink-0"
                    />
                    <span>
                      <strong className="text-slate-900">DPDP Act 2023 Consent:</strong> I grant explicit consent for Botmartz to store my technical project submissions, commit telemetry, and contact details strictly for evaluation, fellowship matching, and verifiable certification.
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer text-slate-700 text-[11px] leading-relaxed">
                    <input
                      type="checkbox"
                      checked={termsConsent}
                      onChange={(e) => setTermsConsent(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300 text-[#0066FF] focus:ring-blue-500 w-4 h-4 cursor-pointer shrink-0"
                    />
                    <span>
                      <strong className="text-slate-900">Honor Code &amp; Terms:</strong> I agree to the Zero-Plagiarism Honor Code, 45-Day Milestone Standards, and Community Guidelines.
                    </span>
                  </label>
                </div>

                {enrollError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                    {enrollError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={enrolling}
                  className="w-full py-3.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {enrolling ? <Loader2 size={15} className="animate-spin" /> : <span>Confirm Enrollment &amp; Lock Slot</span>}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* =========================================================================
          TESTIMONIAL SUBMISSION MODAL
      ========================================================================= */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 font-sans">Submit Builder Testimonial</h3>
              <button onClick={() => setShowReviewModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>

            {reviewSubmitted ? (
              <div className="py-6 text-center text-emerald-700 font-bold space-y-2">
                <CheckCircle2 size={32} className="mx-auto text-emerald-600" />
                <div className="text-sm">Thank You for Your Feedback!</div>
                <p className="text-xs text-slate-500 font-normal font-sans">
                  Your testimonial has been submitted for admin approval and will appear publicly once verified by our team.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAddTestimonial} className="space-y-3.5">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Role / Domain *</label>
                  <select
                    value={reviewRole}
                    onChange={(e) => setReviewRole(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                  >
                    <option value="AI Engineer">AI Engineer</option>
                    <option value="Backend Dev">Backend Dev</option>
                    <option value="Frontend Dev">Frontend Dev</option>
                    <option value="Fullstack Dev">Fullstack Dev</option>
                    <option value="Cloud DevOps">Cloud DevOps</option>
                    <option value="QA Tester">QA Tester</option>
                    <option value="Product Manager">Product Manager</option>
                    <option value="Data & Financial ML">Data & Financial ML</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">College / Organization *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SGSITS Indore or Company"
                    value={reviewCollege}
                    onChange={(e) => setReviewCollege(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Star Rating (1-5)</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setReviewRating(num)}
                        className={`p-2 rounded-lg border cursor-pointer ${
                          reviewRating >= num ? "bg-amber-100 text-amber-800 border-amber-300" : "bg-slate-50 text-slate-400"
                        }`}
                      >
                        <Star size={16} className={reviewRating >= num ? "fill-amber-400" : ""} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Your Review / Project Experience *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="What did you build, what architectural skills did you gain, and how did it help your portfolio?"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900"
                  />
                </div>
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="w-full py-3 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold cursor-pointer transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {reviewSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Submitting for Review...</span>
                    </>
                  ) : (
                    <span>Submit for Admin Approval &rarr;</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Builder Profile Gate Modal */}
      <BuilderProfileGateModal
        isOpen={showGateModal}
        onClose={() => setShowGateModal(false)}
        title="Complete Profile to Enroll"
        description="To track your 45-day commit progress, assign PRD repositories, and verify your graduation year for recruiter referrals, an authenticated student profile is mandatory."
        requiredActionName="Project Enrollment"
      />

    </div>
  );
}
