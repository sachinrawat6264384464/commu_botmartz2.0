"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  User, 
  ShieldCheck, 
  Flame, 
  Trophy, 
  ExternalLink, 
  Github, 
  Linkedin, 
  Coins, 
  Calendar, 
  Layers, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Search, 
  BookOpen, 
  MessageSquare, 
  Edit3, 
  Zap, 
  Star, 
  Activity, 
  AlertCircle,
  Copy,
  Check,
  Globe,
  MapPin,
  Briefcase,
  GraduationCap,
  X,
  Loader2
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const POPULAR_COLLEGES = [
  "IIT Indore",
  "SGSITS Indore",
  "IET DAVV Indore",
  "Medi-Caps University Indore",
  "SVVV Indore",
  "Acropolis Institute Indore",
  "IPS Academy Indore",
  "IIT Bombay",
  "IIT Delhi",
  "IIT Kharagpur",
  "IIT Madras",
  "MANIT Bhopal",
  "IIIT Hyderabad",
  "IIIT Bangalore",
  "BITS Pilani",
  "VIT Vellore",
  "SRM Institute of Science and Technology",
  "Delhi Technological University (DTU)",
  "Netaji Subhas University of Technology (NSUT)",
  "Other / Autonomous Engineering College"
];

const AI_SPECIALIZATIONS = [
  "Autonomous Agent Architect",
  "RAG & Knowledge Graph Engineer",
  "Multimodal AI & Computer Vision",
  "Full Stack AI Developer (FastAPI + Next.js)",
  "Distributed Systems & ML Ops Engineer"
];

export default function StudentProfilePortal() {
  const { user, studentProfile, refreshProfile } = useAuth();
  const [searchHandle, setSearchHandle] = useState("");
  const [enrolledProjects, setEnrolledProjects] = useState<any[]>([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Edit Profile Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [editSuccessMsg, setEditSuccessMsg] = useState("");
  const [editErrorMsg, setEditErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    displayName: "",
    username: "",
    bio: "",
    collegeName: "",
    degreeBranch: "B.Tech Computer Science",
    graduationYear: "2026",
    studentIdRollNo: "",
    githubUsername: "",
    linkedinUrl: "",
    portfolioUrl: "",
    cityLocation: "Indore, MP",
    aiSpecialization: "Autonomous Agent Architect",
    dpdpConsent: true
  });

  // Sync form data when studentProfile loads
  useEffect(() => {
    if (studentProfile) {
      setFormData({
        displayName: studentProfile.displayName || user?.displayName || "",
        username: studentProfile.username || user?.email?.split("@")[0] || "",
        bio: (studentProfile as any).bio || "Student Builder developing deterministic agent swarms and full-stack AI systems.",
        collegeName: studentProfile.collegeName || "",
        degreeBranch: studentProfile.degreeBranch || "B.Tech Computer Science",
        graduationYear: studentProfile.graduationYear || "2026",
        studentIdRollNo: studentProfile.studentIdRollNo || "",
        githubUsername: studentProfile.githubUsername || "",
        linkedinUrl: studentProfile.linkedinUrl || "",
        portfolioUrl: (studentProfile as any).portfolioUrl || "",
        cityLocation: (studentProfile as any).cityLocation || "Indore, MP",
        aiSpecialization: (studentProfile as any).aiSpecialization || "Autonomous Agent Architect",
        dpdpConsent: studentProfile.dpdpConsent !== false
      });
    } else if (user) {
      setFormData(prev => ({
        ...prev,
        displayName: user.displayName || "",
        username: user.email?.split("@")[0] || ""
      }));
    }
  }, [studentProfile, user]);

  useEffect(() => {
    if (user?.email) {
      setLoadingEnrollments(true);
      fetch(`/api/arena/enroll?email=${encodeURIComponent(user.email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setEnrolledProjects(data.enrollments || []);
          }
        })
        .catch((e) => console.warn("Failed to load user enrollments:", e))
        .finally(() => setLoadingEnrollments(false));
    }
  }, [user?.email]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchHandle.trim()) {
      window.location.href = `/member/${encodeURIComponent(searchHandle.trim().toLowerCase())}`;
    }
  };

  const handleCopyPublicProfile = () => {
    const handle = studentProfile?.username || user?.email?.split("@")[0] || "builder";
    const profileUrl = `${window.location.origin}/member/${handle}`;
    navigator.clipboard.writeText(profileUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSavingProfile(true);
    setEditErrorMsg("");
    setEditSuccessMsg("");

    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          ...formData
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update profile.");
      }

      setEditSuccessMsg(
        data.bonusAwarded
          ? "🎉 Profile updated to 100%! You earned +100 Karma Coins bonus!"
          : "Builder profile updated successfully."
      );
      await refreshProfile();
      setTimeout(() => {
        setIsEditModalOpen(false);
        setEditSuccessMsg("");
      }, 1500);
    } catch (err: any) {
      setEditErrorMsg(err.message || "Failed to save profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  // Calculate completeness score
  let score = 0;
  if (studentProfile?.displayName && studentProfile?.username) score += 20;
  if (studentProfile?.collegeName && studentProfile?.graduationYear) score += 20;
  if (studentProfile?.githubUsername) score += 20;
  if (studentProfile?.linkedinUrl) score += 20;
  if (studentProfile?.dpdpConsent) score += 20;

  // Generate 70 heat map days
  const heatmapDays = Array.from({ length: 70 }, (_, i) => ({
    day: i + 1,
    active: i % 3 === 0 || i % 7 === 0 || i > 55,
    level: (i % 4),
  }));

  const isProfileComplete = score >= 80;
  const publicHandle = studentProfile?.username || user?.email?.split("@")[0];

  return (
    <div className="min-h-screen bg-[#FAFCFF] text-slate-900 pb-24">
      {/* Hero Header */}
      <div className="bg-white border-b border-slate-200 py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-xs font-mono text-[#0066FF] uppercase font-bold tracking-wider mb-2 flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>VERIFIED BUILDER COMMAND CENTER</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-sans tracking-tight">
            Builder Profile &amp; Internship Workspace
          </h1>
          <p className="text-sm text-slate-600 font-mono mt-2 max-w-2xl leading-relaxed">
            Your centralized portal for verified proof-of-work, 50 Arena PRDs, daily commit streaks, Karma ledger, and 15-company referral placements.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 space-y-8">
        
        {/* Profile Completeness Alert & Progress Meter */}
        {user && (
          <div className={`p-6 rounded-3xl border ${score === 100 ? "bg-emerald-50/70 border-emerald-200" : "bg-blue-50/60 border-blue-200"} shadow-xs space-y-4`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0066FF]">
                    PROFILE COMPLETENESS METER
                  </span>
                  <span className={`px-2 py-0.5 rounded-full font-mono text-[11px] font-bold ${score === 100 ? "bg-emerald-600 text-white" : "bg-blue-600 text-white"}`}>
                    {score}% COMPLETED
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 font-sans mt-1">
                  {score === 100 
                    ? "✨ 100% Verified Builder Profile Active" 
                    : "Complete Your Profile to Unlock Verified Referrals & +100 Karma Coins"}
                </h3>
                <p className="text-xs text-slate-600 font-sans mt-0.5">
                  Top AI startups require a verified GitHub handle, College roll number, and specialization before approving code submissions.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-5 py-2.5 rounded-2xl bg-[#0066FF] hover:bg-blue-600 text-white font-mono text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 size={14} />
                  <span>{score === 100 ? "Edit Profile" : "Complete Profile (+100 Coins)"}</span>
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200/80 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-2.5 rounded-full transition-all duration-500 ${score === 100 ? "bg-emerald-500" : "bg-[#0066FF]"}`}
                style={{ width: `${Math.max(score, 5)}%` }}
              />
            </div>

            {/* 5 Checklist Items */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-200/60 font-mono text-[11px]">
              <div className={`flex items-center gap-1.5 ${studentProfile?.displayName ? "text-emerald-700 font-bold" : "text-slate-500"}`}>
                <CheckCircle2 size={13} className={studentProfile?.displayName ? "text-emerald-600" : "text-slate-300"} />
                <span>Basic Info (20%)</span>
              </div>
              <div className={`flex items-center gap-1.5 ${studentProfile?.collegeName ? "text-emerald-700 font-bold" : "text-slate-500"}`}>
                <CheckCircle2 size={13} className={studentProfile?.collegeName ? "text-emerald-600" : "text-slate-300"} />
                <span>College (20%)</span>
              </div>
              <div className={`flex items-center gap-1.5 ${studentProfile?.githubUsername ? "text-emerald-700 font-bold" : "text-slate-500"}`}>
                <CheckCircle2 size={13} className={studentProfile?.githubUsername ? "text-emerald-600" : "text-slate-300"} />
                <span>GitHub (20%)</span>
              </div>
              <div className={`flex items-center gap-1.5 ${studentProfile?.linkedinUrl ? "text-emerald-700 font-bold" : "text-slate-500"}`}>
                <CheckCircle2 size={13} className={studentProfile?.linkedinUrl ? "text-emerald-600" : "text-slate-300"} />
                <span>LinkedIn (20%)</span>
              </div>
              <div className={`flex items-center gap-1.5 ${studentProfile?.dpdpConsent ? "text-emerald-700 font-bold" : "text-slate-500"}`}>
                <CheckCircle2 size={13} className={studentProfile?.dpdpConsent ? "text-emerald-600" : "text-slate-300"} />
                <span>DPDP Consent (20%)</span>
              </div>
            </div>
          </div>
        )}

        {/* If Logged In: Show Personal Verified Profile Dashboard */}
        {user && studentProfile ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-8">
            
            {/* Profile Header Grid */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="flex items-start sm:items-center gap-4">
                {user.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt={studentProfile.displayName || "User"}
                    width={72}
                    height={72}
                    className="rounded-2xl border border-slate-200 shadow-xs shrink-0"
                  />
                ) : (
                  <div className="w-18 h-18 rounded-2xl bg-[#0066FF] text-white flex items-center justify-center font-bold text-2xl font-sans shrink-0">
                    {studentProfile.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase() || "B"}
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-2xl font-extrabold text-slate-900 font-sans">
                      {studentProfile.displayName || user.displayName || "Botmartz Builder"}
                    </h2>
                    <span className="text-xs font-mono text-slate-500 font-bold">
                      @{studentProfile.username || user.email?.split("@")[0]}
                    </span>
                    {isProfileComplete && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px] flex items-center gap-1 border border-emerald-200">
                        <ShieldCheck size={11} /> 🎓 Verified Student
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-sans text-slate-600 mt-1 max-w-xl">
                    {(studentProfile as any).bio || "Building high-performance AI systems and autonomous agent workflows."}
                  </p>

                  <div className="text-xs font-mono text-slate-500 mt-2 flex items-center gap-3 flex-wrap">
                    <span className="flex items-center gap-1">
                      <GraduationCap size={13} className="text-slate-400" />
                      <span>{studentProfile.collegeName || "College Pending"}</span>
                    </span>
                    <span>&bull;</span>
                    <span>{studentProfile.degreeBranch || "B.Tech"} ({studentProfile.graduationYear || "2026"})</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <MapPin size={13} className="text-slate-400" />
                      <span>{(studentProfile as any).cityLocation || "Indore / Remote"}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Edit3 size={13} />
                  <span>Edit Profile</span>
                </button>

                <button
                  onClick={handleCopyPublicProfile}
                  className="px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#0066FF] font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {copiedLink ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedLink ? "Link Copied!" : "Share Profile"}</span>
                </button>

                {publicHandle && (
                  <Link
                    href={`/member/${publicHandle}`}
                    target="_blank"
                    className="px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <span>Public View</span>
                    <ExternalLink size={12} />
                  </Link>
                )}
              </div>
            </div>

            {/* Quick Stats Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-amber-800 font-bold uppercase block mb-1">Karma Coins</span>
                  <div className="text-2xl font-black text-amber-900 font-mono">
                    {studentProfile.karmaCoins || 100} Coins
                  </div>
                </div>
                <Link
                  href="/arena/wallet"
                  className="text-[11px] text-[#0066FF] hover:underline font-bold mt-2 flex items-center gap-1"
                >
                  <span>+ Buy Credit Pack</span>
                  <ArrowRight size={10} />
                </Link>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200">
                <span className="text-[10px] text-purple-800 font-bold uppercase block mb-1">Reputation Tier</span>
                <div className="text-2xl font-black text-purple-900 font-mono">
                  Level {studentProfile.reputationLevel || 1}
                </div>
                <span className="text-[10px] text-slate-500">
                  {score === 100 ? "Verified Shipper" : "Novice Explorer"}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <span className="text-[10px] text-emerald-800 font-bold uppercase block mb-1">Daily Streak</span>
                <div className="text-2xl font-black text-emerald-900 font-mono">
                  {enrolledProjects.length > 0 ? (enrolledProjects[0].streak || 1) : 0} Days
                </div>
                <span className="text-[10px] text-slate-500">Active PoW Commits</span>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200">
                <span className="text-[10px] text-blue-800 font-bold uppercase block mb-1">Enrolled Systems</span>
                <div className="text-2xl font-black text-blue-900 font-mono">
                  {enrolledProjects.length} PRDs
                </div>
                <span className="text-[10px] text-slate-500">Active Blueprints</span>
              </div>
            </div>

            {/* Enrolled Projects Workspace Section */}
            <div className="space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-sans">Enrolled Arena Projects &amp; Internship Tracks</h3>
                  <p className="text-xs text-slate-500 font-sans mt-0.5">
                    Your active systems under implementation. Daily commits to these repositories build your verified proof-of-work.
                  </p>
                </div>
                <Link
                  href="/arena"
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center gap-1"
                >
                  <span>Explore More PRDs</span>
                  <ArrowRight size={12} />
                </Link>
              </div>

              {loadingEnrollments ? (
                <div className="p-8 text-center text-slate-400">Loading your project enrollments...</div>
              ) : enrolledProjects.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
                  <p className="text-slate-600 font-sans text-sm">
                    You haven&apos;t enrolled in an Arena Project yet. Pick from 50 production-grade PRDs to start your virtual internship!
                  </p>
                  <Link
                    href="/arena"
                    className="inline-block px-5 py-2.5 rounded-xl bg-[#0066FF] text-white font-bold uppercase tracking-wider shadow-sm hover:bg-[#0052CC] transition-all"
                  >
                    Browse 50 Systems Catalog →
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {enrolledProjects.map((ep) => (
                    <div key={ep.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-[#0066FF] font-bold text-[10px]">
                            {ep.difficulty || "Hard Tier"}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                            {ep.tier || "Free Explorer"}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm font-sans mb-1">{ep.projectTitle}</h4>
                        <p className="text-slate-500 text-[11px] font-sans">
                          Role: <strong>{ep.role}</strong> &bull; Format: {ep.teamType} &bull; Enrolled: {ep.createdAt ? new Date(ep.createdAt).toLocaleDateString("en-IN") : "Active"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                        <Link
                          href={`/arena/${ep.projectId}`}
                          className="flex-1 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-center transition-all"
                        >
                          View PRD
                        </Link>
                        <Link
                          href="/arena/daily-log"
                          className="flex-1 py-2 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-center transition-all"
                        >
                          Log Daily PoW
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 1-Month Paid Internship Track Upgrade Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white border border-blue-500/30 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-cyan-300 font-mono text-[10px] font-bold border border-blue-500/40">
                    ⚡ 1-MONTH VIRTUAL AI INTERNSHIP TRACK
                  </span>
                  <h3 className="text-xl font-bold font-sans mt-2">
                    Upgrade to Verified 1-Month Fellow (Solo ₹299 / Squad ₹1,999)
                  </h3>
                  <p className="text-xs text-slate-300 font-sans mt-1 max-w-xl">
                    Get your GitHub codebase audited by founders, receive formal internship completion certification, and unlock 15 direct hiring referrals to AI startups in Indore &amp; Bangalore.
                  </p>
                </div>
                <Link
                  href="/arena/shippers"
                  className="px-6 py-3 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-mono text-xs font-bold uppercase tracking-wider shrink-0 text-center transition-all shadow-lg"
                >
                  Upgrade Track (₹299) →
                </Link>
              </div>
            </div>

            {/* Free Tools Hub */}
            <div className="space-y-4 font-mono text-xs">
              <h3 className="text-base font-bold text-slate-900 font-sans">Free Builder &amp; Career Acceleration Tools</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  href="/arena/roadmaps"
                  className="p-4 rounded-2xl bg-blue-50/50 hover:bg-blue-50 border border-blue-200 transition-all block"
                >
                  <BookOpen size={18} className="text-[#0066FF] mb-2" />
                  <div className="font-bold text-slate-900 font-sans text-sm">50 Role Roadmaps</div>
                  <p className="text-slate-500 text-[11px] font-sans mt-1">Step-by-step technical prerequisites for every AI discipline.</p>
                </Link>

                <Link
                  href="/arena/career-checklist"
                  className="p-4 rounded-2xl bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-200 transition-all block"
                >
                  <Star size={18} className="text-emerald-600 mb-2" />
                  <div className="font-bold text-slate-900 font-sans text-sm">LinkedIn UGC Promoter</div>
                  <p className="text-slate-500 text-[11px] font-sans mt-1">Share project updates on LinkedIn and earn +50 Karma per post.</p>
                </Link>

                <Link
                  href="/discussions"
                  className="p-4 rounded-2xl bg-purple-50/50 hover:bg-purple-50 border border-purple-200 transition-all block"
                >
                  <MessageSquare size={18} className="text-purple-600 mb-2" />
                  <div className="font-bold text-slate-900 font-sans text-sm">Discussions &amp; Q&amp;A</div>
                  <p className="text-slate-500 text-[11px] font-sans mt-1">Ask questions, share code snippets, and review architecture.</p>
                </Link>

                <Link
                  href="/arena/calendar"
                  className="p-4 rounded-2xl bg-amber-50/50 hover:bg-amber-50 border border-amber-200 transition-all block"
                >
                  <Calendar size={18} className="text-amber-600 mb-2" />
                  <div className="font-bold text-slate-900 font-sans text-sm">Office Hours &amp; AMAs</div>
                  <p className="text-slate-500 text-[11px] font-sans mt-1">Live weekend mentorship &amp; architecture teardowns with founders.</p>
                </Link>
              </div>
            </div>

            {/* 70-Day Contribution Heatmap */}
            <div>
              <div className="flex items-center justify-between mb-3 font-mono text-xs">
                <span className="font-bold text-slate-900 uppercase">
                  45-Day Cohort Proof-of-Work Heatmap
                </span>
                <span className="text-slate-400 text-[11px]">70-Day Window</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto">
                <div className="flex gap-1.5 min-w-max">
                  {heatmapDays.map((d) => (
                    <div
                      key={d.day}
                      title={`Day ${d.day}: ${d.active ? "Verified Commit Logged" : "No Activity"}`}
                      className={`w-3.5 h-3.5 rounded-xs transition-all ${
                        d.level === 0
                          ? "bg-slate-900"
                          : d.level === 1
                          ? "bg-emerald-900"
                          : d.level === 2
                          ? "bg-emerald-700"
                          : d.level === 3
                          ? "bg-emerald-500"
                          : "bg-emerald-400"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3 text-[10px] font-mono text-slate-500">
                  <span>14th Sept (Cohort 1 Launch)</span>
                  <div className="flex items-center gap-1.5">
                    <span>Less</span>
                    <div className="w-2.5 h-2.5 rounded-xs bg-slate-900"></div>
                    <div className="w-2.5 h-2.5 rounded-xs bg-emerald-700"></div>
                    <div className="w-2.5 h-2.5 rounded-xs bg-emerald-400"></div>
                    <span>More</span>
                  </div>
                  <span>Diwali 2026</span>
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* Non-logged in banner directing to sign up / login */
          <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-[#0066FF] flex items-center justify-center mx-auto">
              <Lock size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 font-sans">
                Sign In to Access Your Builder Profile &amp; Tracks
              </h2>
              <p className="text-sm text-slate-600 font-mono mt-2 max-w-lg mx-auto">
                Authentication is mandatory to track your enrolled systems, submit daily logs, earn Karma points, and access 15-company referrals.
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/login"
                className="px-6 py-3 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md"
              >
                Sign In / Register →
              </Link>
              <Link
                href="/arena"
                className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-bold uppercase tracking-wider transition-all"
              >
                Explore PRDs
              </Link>
            </div>
          </div>
        )}

        {/* Member Lookup Bar */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 font-sans">
            Search Any Community Member Profile
          </h2>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full font-mono">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={searchHandle}
                onChange={(e) => setSearchHandle(e.target.value)}
                placeholder="Enter GitHub handle or student username (e.g. rahulsharma)..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#0066FF]"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <span>View Heatmap</span>
              <ArrowRight size={13} />
            </button>
          </form>
        </div>

      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-8 text-slate-900 my-8 relative">
            
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="text-[11px] font-mono text-[#0066FF] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-emerald-500" />
              <span>BUILDER VERIFICATION</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 font-sans">
              Update Builder Profile
            </h3>
            <p className="text-xs text-slate-500 font-sans mt-1">
              Reach 100% completeness to unlock your verified badge and claim +100 Karma Coins.
            </p>

            {editSuccessMsg && (
              <div className="mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>{editSuccessMsg}</span>
              </div>
            )}

            {editErrorMsg && (
              <div className="mt-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 font-mono text-xs flex items-center gap-2">
                <AlertCircle size={16} className="text-rose-600 shrink-0" />
                <span>{editErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="mt-6 space-y-4 font-mono text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    placeholder="e.g. Soham Sharma"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Username / Handle</label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "") })}
                    placeholder="e.g. rahul_ai"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Short Bio</label>
                <input
                  type="text"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="e.g. 3rd Year CSE @ SGSITS building LangGraph agents."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">College / University</label>
                  <select
                    value={formData.collegeName}
                    onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  >
                    <option value="">Select University</option>
                    {POPULAR_COLLEGES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Student Roll / ID No</label>
                  <input
                    type="text"
                    required
                    value={formData.studentIdRollNo}
                    onChange={(e) => setFormData({ ...formData, studentIdRollNo: e.target.value })}
                    placeholder="e.g. 0801CS221045"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Degree &amp; Branch</label>
                  <input
                    type="text"
                    value={formData.degreeBranch}
                    onChange={(e) => setFormData({ ...formData, degreeBranch: e.target.value })}
                    placeholder="e.g. B.Tech CSE / IT"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Graduation Year</label>
                  <select
                    value={formData.graduationYear}
                    onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  >
                    <option value="2025">2025</option>
                    <option value="2026">2026 (Batch)</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                    <option value="Passout">Passout / Working</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">GitHub Username</label>
                  <div className="relative">
                    <Github className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input
                      type="text"
                      required
                      value={formData.githubUsername}
                      onChange={(e) => setFormData({ ...formData, githubUsername: e.target.value })}
                      placeholder="github_handle"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">LinkedIn Profile URL</label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input
                      type="url"
                      value={formData.linkedinUrl}
                      onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">City / Location</label>
                  <input
                    type="text"
                    value={formData.cityLocation}
                    onChange={(e) => setFormData({ ...formData, cityLocation: e.target.value })}
                    placeholder="e.g. Indore, Madhya Pradesh"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">AI Specialization Track</label>
                  <select
                    value={formData.aiSpecialization}
                    onChange={(e) => setFormData({ ...formData, aiSpecialization: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  >
                    {AI_SPECIALIZATIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="dpdp"
                  checked={formData.dpdpConsent}
                  onChange={(e) => setFormData({ ...formData, dpdpConsent: e.target.checked })}
                  className="rounded text-[#0066FF] focus:ring-0"
                />
                <label htmlFor="dpdp" className="text-[11px] text-slate-600">
                  I grant DPDP 2023 consent to verify my credentials for hiring referrals and proof-of-work badges.
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200/60">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-2.5 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {savingProfile ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Saving Profile...</span>
                    </>
                  ) : (
                    <span>Save &amp; Claim Verified Badge</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
