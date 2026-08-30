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
  Loader2,
  Building,
  Clock,
  Award
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { UNIVERSITIES_DIRECTORY } from "@/lib/universities-directory";
import { COMPANIES_DIRECTORY } from "@/lib/companies-directory";

const GLOBAL_COUNTRIES = [
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Germany",
  "Singapore",
  "United Arab Emirates",
  "Australia",
  "Switzerland",
  "France",
  "Netherlands",
  "Japan",
  "Other Global"
];

const TIMEZONES = [
  "IST (India Standard Time - UTC+5:30)",
  "EST (US Eastern Time - UTC-5)",
  "PST (US Pacific Time - UTC-8)",
  "CST (US Central Time - UTC-6)",
  "GMT / UTC (Greenwich Mean Time - UTC+0)",
  "BST (British Summer Time - UTC+1)",
  "CET (Central European Time - UTC+1)",
  "GST (Gulf Standard Time - UTC+4)",
  "SGT (Singapore Time - UTC+8)",
  "AEST (Australian Eastern Time - UTC+10)",
  "Other Timezone"
];

const AI_SPECIALIZATIONS = [
  "Autonomous Agent Architect",
  "RAG & Knowledge Graph Engineer",
  "Multimodal AI & Computer Vision",
  "Full Stack AI Developer (FastAPI + Next.js)",
  "Distributed Systems & ML Ops Engineer",
  "High-Frequency FinTech / Quant AI",
  "Kernel eBPF & Cloud Infrastructure"
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
    personaType: "STUDENT" as "STUDENT" | "WORKING_PROFESSIONAL" | "FOUNDER_BUILDER",
    // Student Fields
    collegeName: "",
    customCollegeName: "",
    degreeBranch: "B.Tech Computer Science",
    graduationYear: "2026",
    studentIdRollNo: "",
    // Professional Fields
    companyName: "",
    customCompanyName: "",
    designationRole: "Software Engineer",
    yearsOfExperience: "1-3 Years",
    workDomain: "AI & Fullstack Systems",
    // Global & Location
    country: "India",
    cityLocation: "Indore, MP",
    timezone: "IST (India Standard Time - UTC+5:30)",
    // Online Handles
    githubUsername: "",
    linkedinUrl: "",
    portfolioUrl: "",
    aiSpecialization: "Autonomous Agent Architect",
    dpdpConsent: true
  });

  // Sync form data when studentProfile loads
  useEffect(() => {
    if (studentProfile) {
      const p = studentProfile as any;
      setFormData({
        displayName: p.displayName || user?.displayName || "",
        username: p.username || user?.email?.split("@")[0] || "",
        bio: p.bio || (p.personaType === "WORKING_PROFESSIONAL" ? "Software & AI Engineer shipping deterministic production architectures." : "Student Builder developing agent swarms and full-stack AI systems."),
        personaType: p.personaType || "STUDENT",
        collegeName: p.collegeName || "",
        customCollegeName: "",
        degreeBranch: p.degreeBranch || "B.Tech Computer Science",
        graduationYear: p.graduationYear || "2026",
        studentIdRollNo: p.studentIdRollNo || "",
        companyName: p.companyName || "",
        customCompanyName: "",
        designationRole: p.designationRole || "Software Engineer",
        yearsOfExperience: p.yearsOfExperience || "1-3 Years",
        workDomain: p.workDomain || "AI & Fullstack Systems",
        country: p.country || "India",
        cityLocation: p.cityLocation || "Indore, MP",
        timezone: p.timezone || "IST (India Standard Time - UTC+5:30)",
        githubUsername: p.githubUsername || "",
        linkedinUrl: p.linkedinUrl || "",
        portfolioUrl: p.portfolioUrl || "",
        aiSpecialization: p.aiSpecialization || "Autonomous Agent Architect",
        dpdpConsent: p.dpdpConsent !== false
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

    const effectiveCollege = formData.collegeName === "Other" 
      ? formData.customCollegeName.trim() 
      : formData.collegeName;

    const effectiveCompany = formData.companyName === "Other"
      ? formData.customCompanyName.trim()
      : formData.companyName;

    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          ...formData,
          collegeName: effectiveCollege,
          companyName: effectiveCompany
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
  const isProfessional = (studentProfile as any)?.personaType === "WORKING_PROFESSIONAL" || (studentProfile as any)?.personaType === "FOUNDER_BUILDER";
  let score = 0;
  if (studentProfile?.displayName && studentProfile?.username) score += 20;
  if (isProfessional) {
    if ((studentProfile as any)?.companyName && (studentProfile as any)?.designationRole) score += 20;
  } else {
    if (studentProfile?.collegeName && studentProfile?.graduationYear) score += 20;
  }
  if (studentProfile?.githubUsername) score += 20;
  if (studentProfile?.linkedinUrl || (studentProfile as any)?.portfolioUrl) score += 20;
  if (studentProfile?.dpdpConsent !== false) score += 20;

  const coins = (studentProfile as any)?.karmaCoins || 100;
  const username = studentProfile?.username || user?.email?.split("@")[0] || "builder";
  const publicProfileUrl = `/member/${username}`;

  return (
    <div className="bg-[#FAFCFF] min-h-screen text-slate-900 selection:bg-[#0066FF] selection:text-white pt-24 pb-28 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* =========================================================================
            HEADER & PUBLIC PROFILE SEARCH
        ========================================================================= */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 border-b border-slate-200/80 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0066FF] font-mono text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Universal Builder Identity &bull; India &amp; Global</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
              Builder Profile &amp; Proof-of-Work
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-mono mt-1">
              Your verified identity, contributions, and verified university or company credentials.
            </p>
          </div>

          <form onSubmit={handleSearch} className="w-full md:w-80">
            <div className="relative font-mono text-xs">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                value={searchHandle}
                onChange={(e) => setSearchHandle(e.target.value)}
                placeholder="Lookup builder @handle or email..."
                className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0066FF] transition-all shadow-xs"
              />
            </div>
          </form>
        </div>

        {/* =========================================================================
            COMPLETENESS METER & 100% REWARD BANNER
        ========================================================================= */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 mb-8 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 font-sans">
                  Profile Completeness Score
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0066FF] font-mono text-xs font-bold">
                  {score}%
                </span>
                {score === 100 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 size={12} /> Verified Builder
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                Complete all 5 verification points to unlock company referral dispatches and earn <strong>+100 Karma Coins</strong>.
              </p>
            </div>

            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-mono text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Edit3 size={14} />
              <span>{score === 100 ? "Edit Profile" : "Complete Profile (Earn +100 Coins)"}</span>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-6">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                score === 100
                  ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                  : "bg-gradient-to-r from-blue-600 to-cyan-500"
              }`}
              style={{ width: `${score}%` }}
            />
          </div>

          {/* 5 Verification Checkpoints */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
            <div className={`p-3 rounded-2xl border flex items-center gap-2 ${
              studentProfile?.displayName ? "bg-emerald-50/60 border-emerald-200 text-emerald-800" : "bg-slate-50 border-slate-200 text-slate-400"
            }`}>
              {studentProfile?.displayName ? <CheckCircle2 size={15} className="text-emerald-600 shrink-0" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />}
              <span className="truncate">Identity (20%)</span>
            </div>

            <div className={`p-3 rounded-2xl border flex items-center gap-2 ${
              (studentProfile?.collegeName || (studentProfile as any)?.companyName) ? "bg-emerald-50/60 border-emerald-200 text-emerald-800" : "bg-slate-50 border-slate-200 text-slate-400"
            }`}>
              {(studentProfile?.collegeName || (studentProfile as any)?.companyName) ? <CheckCircle2 size={15} className="text-emerald-600 shrink-0" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />}
              <span className="truncate">{isProfessional ? "Company" : "College"} (20%)</span>
            </div>

            <div className={`p-3 rounded-2xl border flex items-center gap-2 ${
              studentProfile?.githubUsername ? "bg-emerald-50/60 border-emerald-200 text-emerald-800" : "bg-slate-50 border-slate-200 text-slate-400"
            }`}>
              {studentProfile?.githubUsername ? <CheckCircle2 size={15} className="text-emerald-600 shrink-0" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />}
              <span className="truncate">GitHub (20%)</span>
            </div>

            <div className={`p-3 rounded-2xl border flex items-center gap-2 ${
              studentProfile?.linkedinUrl ? "bg-emerald-50/60 border-emerald-200 text-emerald-800" : "bg-slate-50 border-slate-200 text-slate-400"
            }`}>
              {studentProfile?.linkedinUrl ? <CheckCircle2 size={15} className="text-emerald-600 shrink-0" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />}
              <span className="truncate">LinkedIn (20%)</span>
            </div>

            <div className={`p-3 rounded-2xl border flex items-center gap-2 ${
              studentProfile?.dpdpConsent !== false ? "bg-emerald-50/60 border-emerald-200 text-emerald-800" : "bg-slate-50 border-slate-200 text-slate-400"
            }`}>
              {studentProfile?.dpdpConsent !== false ? <CheckCircle2 size={15} className="text-emerald-600 shrink-0" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />}
              <span className="truncate">DPDP Consent (20%)</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            MAIN PROFILE HERO CARD
        ========================================================================= */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 mb-8 shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#0066FF] to-indigo-500 text-white font-mono text-2xl font-bold flex items-center justify-center shadow-md">
                {(studentProfile?.displayName || user?.displayName || "B")[0].toUpperCase()}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-2xl font-extrabold text-slate-900 font-sans">
                    {studentProfile?.displayName || user?.displayName || "Botmartz Builder"}
                  </h2>
                  <span className="text-xs font-mono text-slate-500">
                    @{username}
                  </span>
                  {score >= 80 && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                      VERIFIED BUILDER
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 font-sans mt-1 max-w-xl">
                  {(studentProfile as any)?.bio || "Building production AI systems, agent swarms, and high-frequency backend telemetry."}
                </p>

                {/* Badges */}
                <div className="flex items-center gap-3 mt-3 font-mono text-xs text-slate-600 flex-wrap">
                  {isProfessional ? (
                    <span className="flex items-center gap-1 text-slate-700 font-medium">
                      <Building size={14} className="text-indigo-600" />
                      {(studentProfile as any)?.companyName || "Tech Professional"} &bull; {(studentProfile as any)?.designationRole || "Engineer"}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-slate-700 font-medium">
                      <GraduationCap size={14} className="text-[#0066FF]" />
                      {studentProfile?.collegeName || "Engineering Student"} &bull; {studentProfile?.degreeBranch || "B.Tech CSE"} ({studentProfile?.graduationYear || "2026"})
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-slate-500">
                    <MapPin size={13} className="text-rose-500" />
                    {(studentProfile as any)?.cityLocation || "Indore / India"} ({(studentProfile as any)?.country || "India"})
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Clock size={13} className="text-purple-500" />
                    {(studentProfile as any)?.timezone || "IST"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Public Profile Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              <button
                onClick={handleCopyPublicProfile}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedLink ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                <span>{copiedLink ? "Link Copied!" : "Copy Public Link"}</span>
              </button>

              <Link
                href={publicProfileUrl}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <span>View Public Portfolio</span>
                <ExternalLink size={13} />
              </Link>
            </div>

          </div>

          {/* Social Links & Wallet Balance */}
          <div className="flex items-center justify-between gap-4 mt-6 pt-6 border-t border-slate-100 flex-wrap font-mono text-xs">
            <div className="flex items-center gap-4 flex-wrap">
              {studentProfile?.githubUsername && (
                <a
                  href={`https://github.com/${studentProfile.githubUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-slate-700 hover:text-black font-bold"
                >
                  <Github size={15} />
                  <span>github.com/{studentProfile.githubUsername}</span>
                </a>
              )}
              {studentProfile?.linkedinUrl && (
                <a
                  href={studentProfile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[#0066FF] hover:underline font-bold"
                >
                  <Linkedin size={15} />
                  <span>LinkedIn Profile</span>
                </a>
              )}
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-bold">
              <Coins size={15} className="text-amber-600" />
              <span>Karma Coins Balance: {coins}</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            ENROLLED ARENA BLUEPRINTS
        ========================================================================= */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 mb-8 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-sans">
                My Enrolled Production PRDs
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Active engineering systems assigned to your proof-of-work streak.
              </p>
            </div>

            <Link
              href="/arena"
              className="px-4 py-2 rounded-xl bg-blue-50 text-[#0066FF] font-mono text-xs font-bold hover:bg-blue-100 transition-colors"
            >
              Browse 50 Systems &rarr;
            </Link>
          </div>

          {loadingEnrollments ? (
            <div className="py-12 text-center text-slate-400 font-mono text-xs flex items-center justify-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              <span>Loading enrolled blueprints...</span>
            </div>
          ) : enrolledProjects.length === 0 ? (
            <div className="py-12 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 space-y-3">
              <Layers size={28} className="text-slate-400 mx-auto" />
              <div className="font-bold text-slate-700 font-sans text-sm">No Active PRD Enrollments Yet</div>
              <p className="text-xs text-slate-500 font-mono max-w-sm mx-auto">
                Explore the 50 production AI blueprints in the Arena catalog and enroll in your first track to begin shipping.
              </p>
              <Link
                href="/arena"
                className="inline-block px-5 py-2.5 rounded-xl bg-[#0066FF] text-white font-mono text-xs font-bold"
              >
                Enroll in a Project
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
              {enrolledProjects.map((ep) => (
                <div
                  key={ep.id || ep.projectId}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-bold mb-2">
                      <span className="px-2 py-0.5 rounded-md bg-blue-100 text-[#0066FF]">
                        {ep.teamType || "Solo"} Track
                      </span>
                      <span className="text-emerald-700 font-bold">
                        {ep.status || "Active"}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 font-sans mb-1">
                      {ep.projectTitle || "Production AI System"}
                    </h4>
                    <div className="text-[11px] text-slate-500">
                      Role: <strong>{ep.role || "AI Engineer"}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-200/80">
                    <Link
                      href={`/arena/${ep.projectId}`}
                      className="flex-1 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-center hover:bg-slate-100 transition-colors"
                    >
                      Open PRD
                    </Link>
                    <Link
                      href="/arena/daily-log"
                      className="flex-1 py-2 rounded-xl bg-[#0066FF] text-white font-bold text-center hover:bg-blue-600 transition-colors"
                    >
                      Log Commit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* =========================================================================
          UNIVERSAL EDIT PROFILE MODAL (STUDENTS & PROFESSIONALS WORLDWIDE)
      ========================================================================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 my-8 relative text-slate-900">
            
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="text-[11px] font-mono text-[#0066FF] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Universal Builder Profile</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-sans">
              Edit Profile &amp; Verification
            </h3>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Support for students &amp; professionals across India and worldwide.
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
              
              {/* Persona Selector */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Select Your Builder Persona *</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, personaType: "STUDENT" })}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer font-sans ${
                      formData.personaType === "STUDENT"
                        ? "bg-blue-50 border-[#0066FF] text-[#0066FF] font-bold shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <GraduationCap size={16} className="mx-auto mb-1" />
                    <span className="text-xs">Student / University</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, personaType: "WORKING_PROFESSIONAL" })}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer font-sans ${
                      formData.personaType === "WORKING_PROFESSIONAL"
                        ? "bg-blue-50 border-[#0066FF] text-[#0066FF] font-bold shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Briefcase size={16} className="mx-auto mb-1" />
                    <span className="text-xs">Working Professional</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, personaType: "FOUNDER_BUILDER" })}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer font-sans ${
                      formData.personaType === "FOUNDER_BUILDER"
                        ? "bg-blue-50 border-[#0066FF] text-[#0066FF] font-bold shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Building size={16} className="mx-auto mb-1" />
                    <span className="text-xs">Founder / Freelancer</span>
                  </button>
                </div>
              </div>

              {/* Name & Handle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    placeholder="e.g. Soham Sharma"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Username / Public @handle *</label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "") })}
                    placeholder="e.g. rahul_ai"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Short Bio</label>
                <input
                  type="text"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="e.g. Fullstack AI Engineer developing multi-agent LangGraph architectures."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              {/* ── CONDITIONAL SECTION: STUDENT ── */}
              {formData.personaType === "STUDENT" && (
                <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100 space-y-3">
                  <div className="font-bold text-[#0066FF] font-sans flex items-center gap-1.5">
                    <GraduationCap size={15} />
                    <span>University &amp; Academic Credentials</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">College / University *</label>
                      <select
                        value={formData.collegeName}
                        onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0066FF]"
                      >
                        <option value="">Select College / University</option>
                        {UNIVERSITIES_DIRECTORY.map((u) => (
                          <option key={u.name} value={u.name}>
                            {u.name} ({u.country})
                          </option>
                        ))}
                        <option value="Other">Other / Not Listed (Type Custom)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Student Roll / Enrollment No *</label>
                      <input
                        type="text"
                        required
                        value={formData.studentIdRollNo}
                        onChange={(e) => setFormData({ ...formData, studentIdRollNo: e.target.value })}
                        placeholder="e.g. 0801CS221045"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0066FF]"
                      />
                    </div>
                  </div>

                  {formData.collegeName === "Other" && (
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Custom College Name &amp; City *</label>
                      <input
                        type="text"
                        required
                        value={formData.customCollegeName}
                        onChange={(e) => setFormData({ ...formData, customCollegeName: e.target.value })}
                        placeholder="e.g. Technical University of Munich / Delhi University"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0066FF]"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Degree &amp; Branch</label>
                      <input
                        type="text"
                        value={formData.degreeBranch}
                        onChange={(e) => setFormData({ ...formData, degreeBranch: e.target.value })}
                        placeholder="e.g. B.Tech Computer Science / MCA"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0066FF]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Graduation Year *</label>
                      <select
                        value={formData.graduationYear}
                        onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0066FF]"
                      >
                        <option value="2025">2025</option>
                        <option value="2026">2026 (Active Batch)</option>
                        <option value="2027">2027</option>
                        <option value="2028">2028</option>
                        <option value="2029">2029</option>
                        <option value="Passout">Passout / Alumni</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* ── CONDITIONAL SECTION: WORKING PROFESSIONAL OR FOUNDER ── */}
              {(formData.personaType === "WORKING_PROFESSIONAL" || formData.personaType === "FOUNDER_BUILDER") && (
                <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 space-y-3">
                  <div className="font-bold text-indigo-700 font-sans flex items-center gap-1.5">
                    <Briefcase size={15} />
                    <span>Company &amp; Professional Experience</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Company / Organization *</label>
                      <select
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0066FF]"
                      >
                        <option value="">Select Company</option>
                        {COMPANIES_DIRECTORY.map((c) => (
                          <option key={c.name} value={c.name}>
                            {c.name} ({c.headquarters})
                          </option>
                        ))}
                        <option value="Other">Other / Startup / Self-Employed (Type Custom)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Designation / Role *</label>
                      <input
                        type="text"
                        required
                        value={formData.designationRole}
                        onChange={(e) => setFormData({ ...formData, designationRole: e.target.value })}
                        placeholder="e.g. Senior Backend Engineer / AI Lead"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0066FF]"
                      />
                    </div>
                  </div>

                  {formData.companyName === "Other" && (
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Custom Company / Startup Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.customCompanyName}
                        onChange={(e) => setFormData({ ...formData, customCompanyName: e.target.value })}
                        placeholder="e.g. Stealth AI Lab / Apex Consulting"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0066FF]"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Years of Experience</label>
                      <select
                        value={formData.yearsOfExperience}
                        onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0066FF]"
                      >
                        <option value="Fresher / < 1 Year">Fresher / &lt; 1 Year</option>
                        <option value="1-3 Years">1-3 Years</option>
                        <option value="3-5 Years">3-5 Years</option>
                        <option value="5-8 Years">5-8 Years</option>
                        <option value="8+ Years">8+ Years (Staff / Principal)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Domain Focus</label>
                      <input
                        type="text"
                        value={formData.workDomain}
                        onChange={(e) => setFormData({ ...formData, workDomain: e.target.value })}
                        placeholder="e.g. Distributed LLM Inference / FinTech"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0066FF]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Location & Timezone (Global Scope) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Country *</label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  >
                    {GLOBAL_COUNTRIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">City / Region *</label>
                  <input
                    type="text"
                    required
                    value={formData.cityLocation}
                    onChange={(e) => setFormData({ ...formData, cityLocation: e.target.value })}
                    placeholder="e.g. Indore, MP / Berlin / Austin"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Timezone *</label>
                  <select
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  >
                    {TIMEZONES.map((tz) => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* GitHub & LinkedIn */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">GitHub Username *</label>
                  <div className="relative">
                    <Github className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input
                      type="text"
                      required
                      value={formData.githubUsername}
                      onChange={(e) => setFormData({ ...formData, githubUsername: e.target.value })}
                      placeholder="github_handle"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">LinkedIn Profile URL *</label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input
                      type="url"
                      value={formData.linkedinUrl}
                      onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                    />
                  </div>
                </div>
              </div>

              {/* Specialization */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">AI Specialization Track</label>
                <select
                  value={formData.aiSpecialization}
                  onChange={(e) => setFormData({ ...formData, aiSpecialization: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                >
                  {AI_SPECIALIZATIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Consent */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-slate-700 text-xs font-sans">
                  <input
                    type="checkbox"
                    checked={formData.dpdpConsent}
                    onChange={(e) => setFormData({ ...formData, dpdpConsent: e.target.checked })}
                    className="mt-0.5 rounded text-[#0066FF] focus:ring-[#0066FF]"
                  />
                  <span>
                    I confirm my profile details are accurate and grant DPDP Act data protection consent for verified portfolio listings and startup recruiter referrals.
                  </span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="flex-2 py-3 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {savingProfile ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Saving Profile...</span>
                    </>
                  ) : (
                    <span>Save &amp; Update Profile</span>
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
