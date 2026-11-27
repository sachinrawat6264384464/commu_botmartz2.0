"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
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
  Award,
  Code2,
  Terminal,
  Crown,
  Bell,
  Mail
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { TOTAL_SYSTEMS_COUNT } from "@/lib/arena-projects";
import { useToast } from "@/lib/toast-context";
import { UNIVERSITIES_DIRECTORY } from "@/lib/universities-directory";
import { COMPANIES_DIRECTORY } from "@/lib/companies-directory";
import { ARENA_PROJECTS } from "@/lib/arena-projects";
import { computeUserBadgeStatuses } from "@/lib/badges";
import LinkedInShareModal from "@/app/_components/LinkedInShareModal";
import AuthGate from "@/app/_components/AuthGate";

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

const BADGE_ICON_MAP: Record<string, any> = {
  Flame,
  Zap,
  Trophy,
  Award,
  ShieldCheck,
  Crown,
  Sparkles,
  Terminal,
  Layers,
};

function renderBadgeEmblem(
  iconName: string,
  isClaimed: boolean,
  isEligible: boolean,
  badgeBg: string
) {
  const IconComp = BADGE_ICON_MAP[iconName] || Trophy;

  if (isClaimed) {
    return (
      <div className="relative shrink-0 group">
        <div
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${badgeBg} flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 ring-4 ring-emerald-100 border border-white/50 transform group-hover:scale-110 transition-transform duration-300`}
        >
          <IconComp size={30} className="drop-shadow-md text-white stroke-[2.2]" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 ring-2 ring-white flex items-center justify-center text-white shadow-md">
          <CheckCircle2 size={14} className="stroke-[3]" />
        </div>
      </div>
    );
  }

  if (isEligible) {
    return (
      <div className="relative shrink-0 group">
        <div
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${badgeBg} flex items-center justify-center text-white shadow-lg shadow-blue-500/30 ring-4 ring-blue-100 border border-white/40 transform group-hover:scale-105 transition-transform duration-300 animate-pulse`}
        >
          <IconComp size={30} className="drop-shadow-md text-white stroke-[2.2]" />
        </div>
        <div className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-900 ring-2 ring-white text-[9px] font-black uppercase tracking-tighter shadow-xs">
          UNLOCKED
        </div>
      </div>
    );
  }

  return (
    <div className="relative shrink-0 opacity-60">
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
        <IconComp size={26} className="text-slate-400 stroke-[1.5]" />
      </div>
      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-300 ring-2 ring-white flex items-center justify-center text-slate-600">
        <Lock size={11} />
      </div>
    </div>
  );
}

export default function StudentProfilePortal() {
  const { user, studentProfile, loading: authLoading, refreshProfile } = useAuth();
  const { showToast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [searchHandle, setSearchHandle] = useState("");
  const [enrolledProjects, setEnrolledProjects] = useState<any[]>([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);
  const [unenrollingId, setUnenrollingId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const cached = localStorage.getItem("botmartz_user_claimed_badges");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setClaimedBadges((prev) => Array.from(new Set([...prev, ...parsed])));
        }
      }
    } catch (e) { }
  }, []);

  const handleUnenroll = async (enrollmentId: string, projectId: string, projectTitle: string) => {
    if (!user?.email) return;
    if (!confirm(`Are you sure you want to unenroll from "${projectTitle || projectId}"? You can re-enroll at any time.`)) {
      return;
    }

    setUnenrollingId(enrollmentId || projectId);
    try {
      const res = await fetch("/api/arena/unenroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, enrollmentId, projectId })
      });
      const data = await res.json();
      if (data.success) {
        setEnrolledProjects((prev) => prev.filter((p) => p.id !== enrollmentId && p.projectId !== projectId));
        showToast(`Unenrolled from "${projectTitle || projectId}"`, "info");
      } else {
        showToast(data.error || "Failed to unenroll from project.", "error");
      }
    } catch (e: any) {
      showToast(e.message || "Failed to unenroll from project.", "error");
    } finally {
      setUnenrollingId(null);
    }
  };

  // LinkedIn Checklist State
  const [linkedinTasks, setLinkedinTasks] = useState({
    headline: true,
    githubInFeatured: true,
    day1Post: false,
    skillTags: true,
    portfolioLink: false,
    peerConnect: true
  });
  const [copiedHeadline, setCopiedHeadline] = useState(false);
  const [copiedPostTemplate, setCopiedPostTemplate] = useState(false);

  // Email Notification Preferences State
  const [notificationPrefs, setNotificationPrefs] = useState({
    deadlineWarnings: true,
    dailyStandupReminder: true,
    walletAlerts: true,
    discussionAlerts: true,
    saturdayMeetups: true,
    recruiterAlerts: true
  });
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [prefsSuccessMsg, setPrefsSuccessMsg] = useState("");
  const [serviceBookings, setServiceBookings] = useState<any[]>([]);
  const [hackathonRegistrations, setHackathonRegistrations] = useState<any[]>([]);
  const [workshopRegistrations, setWorkshopRegistrations] = useState<any[]>([]);
  const [walletData, setWalletData] = useState<any>(null);
  const [walletTransactions, setWalletTransactions] = useState<any[]>([]);
  const [redeemingPerkId, setRedeemingPerkId] = useState<string | null>(null);
  const [activeProfileSection, setActiveProfileSection] = useState<
    "completeness" | "countdown" | "projects" | "badges" | "certificates" | "resume" | "linkedin" | "notifications" | "tour" | "activity" | "wallet"
  >("completeness");

  useEffect(() => {
    if (user?.email) {
      fetch(`/api/profile/activity?email=${encodeURIComponent(user.email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            if (Array.isArray(data.serviceBookings)) setServiceBookings(data.serviceBookings);
            if (Array.isArray(data.hackathonRegistrations)) setHackathonRegistrations(data.hackathonRegistrations);
            if (Array.isArray(data.workshopRegistrations)) setWorkshopRegistrations(data.workshopRegistrations);
          }
        })
        .catch(() => {});

      fetch(`/api/arena/wallet?email=${encodeURIComponent(user.email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.wallet) {
            setWalletData(data.wallet);
          }
          if (data.success && Array.isArray(data.transactions)) {
            setWalletTransactions(data.transactions);
          }
        })
        .catch(() => {});
    }
  }, [user?.email]);

  const handleRedeemPerk = async (perk: { id: string; title: string; cost: number }) => {
    if (!user?.email) return;
    setRedeemingPerkId(perk.id);
    try {
      const res = await fetch("/api/arena/wallet/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentEmail: user.email,
          perkId: perk.id,
          perkTitle: perk.title,
          perkCost: perk.cost,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Redeemed "${perk.title}"! Code: ${data.fulfillmentCode || "Sent to Email"}`, "success");
        const wRes = await fetch(`/api/arena/wallet?email=${encodeURIComponent(user.email)}`);
        const wData = await wRes.json();
        if (wData.success && wData.wallet) setWalletData(wData.wallet);
        if (wData.success && Array.isArray(wData.transactions)) setWalletTransactions(wData.transactions);
        await refreshProfile();
      } else {
        showToast(data.error || "Insufficient Karma Coins balance.", "error");
      }
    } catch {
      showToast("Failed to redeem perk.", "error");
    } finally {
      setRedeemingPerkId(null);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetch(`/api/profile/notifications?email=${encodeURIComponent(user.email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.preferences) {
            setNotificationPrefs((prev) => ({ ...prev, ...data.preferences }));
          }
        })
        .catch(() => { });
    }
  }, [user?.email]);

  const handleSaveNotificationPrefs = async () => {
    if (!user?.email) return;
    setSavingPrefs(true);
    setPrefsSuccessMsg("");
    try {
      const res = await fetch("/api/profile/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, preferences: notificationPrefs })
      });
      const data = await res.json();
      if (data.success) {
        setPrefsSuccessMsg("Notification preferences updated successfully.");
        setTimeout(() => setPrefsSuccessMsg(""), 3500);
      }
    } catch (e: any) {
      alert("Failed to save notification preferences: " + e.message);
    } finally {
      setSavingPrefs(false);
    }
  };

  // Resume Generator State
  const [selectedResumeId, setSelectedResumeId] = useState<string>("p1");
  const [copiedResumePlain, setCopiedResumePlain] = useState(false);
  const [copiedResumeLatex, setCopiedResumeLatex] = useState(false);

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

      if (p.claimedBadges && Array.isArray(p.claimedBadges)) {
        setClaimedBadges((prev) => {
          const merged = Array.from(new Set([...prev, ...p.claimedBadges]));
          try {
            localStorage.setItem("botmartz_user_claimed_badges", JSON.stringify(merged));
          } catch (e) { }
          return merged;
        });
      }
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

  const earliestEnrollmentDate = useMemo(() => {
    if (!enrolledProjects || enrolledProjects.length === 0) {
      return studentProfile?.createdAt ? new Date(studentProfile.createdAt).getTime() : null;
    }
    const dates = enrolledProjects
      .map((p) => (p.createdAt ? new Date(p.createdAt).getTime() : null))
      .filter((t): t is number => Boolean(t && !isNaN(t)));
    if (dates.length === 0) return Date.now();
    return Math.min(...dates);
  }, [enrolledProjects, studentProfile]);

  const daysElapsed = earliestEnrollmentDate
    ? Math.min(45, Math.max(1, Math.floor((Date.now() - earliestEnrollmentDate) / (1000 * 60 * 60 * 24)) + 1))
    : 1;

  const daysRemaining = Math.max(0, 45 - daysElapsed);
  const percentComplete = Math.min(100, Math.round((daysElapsed / 45) * 100));

  const completedEnrollments = enrolledProjects.filter(
    (e) => e.status === "Completed" || e.status === "Finished"
  );

  const [claimedBadges, setClaimedBadges] = useState<string[]>([]);

  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [shareModalData, setShareModalData] = useState<{
    isOpen: boolean;
    projectTitle: string;
    certId: string;
  }>({
    isOpen: false,
    projectTitle: "",
    certId: ""
  });

  const badgeStatuses = computeUserBadgeStatuses(
    daysElapsed,
    completedEnrollments.length,
    claimedBadges
  );

  const handleClaimBadge = async (badgeId: string) => {
    if (!user?.email) {
      alert("Please log in to claim your earned badge.");
      return;
    }

    setClaimingId(badgeId);
    try {
      const res = await fetch("/api/badges/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, badgeId })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        const updated = [...claimedBadges, badgeId];
        setClaimedBadges(updated);
        try {
          localStorage.setItem("botmartz_user_claimed_badges", JSON.stringify(updated));
        } catch (e) { }
        showToast(`🎉 Badge Claimed Successfully! ${data.message || ""}`, "success");
      } else {
        showToast(data.error || "Failed to claim badge.", "error");
      }
    } catch (e) {
      console.warn("Claim badge error:", e);
    } finally {
      setClaimingId(null);
    }
  };

  const handleClaimAllBadges = async () => {
    if (!user?.email) return;
    const eligibleIds = badgeStatuses.filter((b) => b.isEligible).map((b) => b.id);
    if (eligibleIds.length === 0) return;

    try {
      const res = await fetch("/api/badges/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, badgeIds: eligibleIds })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const updated = Array.from(new Set([...claimedBadges, ...eligibleIds]));
        setClaimedBadges(updated);
        try {
          localStorage.setItem("botmartz_user_claimed_badges", JSON.stringify(updated));
        } catch (e) { }
        showToast(`🎉 Successfully Claimed ${eligibleIds.length} Badges!`, "success");
      }
    } catch (e) {
      console.warn("Claim all badges error:", e);
    }
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

  if (authLoading || !user) {
    return (
      <AuthGate
        featureTitle="Builder Profile & Portfolio"
        featureDescription="Sign in to view and manage your verified builder profile, 45-day sprint progress, certificates, and career checklist."
      >
        <div />
      </AuthGate>
    );
  }

  return (
    <div
      className="bg-white min-h-screen text-slate-900 selection:bg-[#D9F83B] selection:text-slate-950 pt-24 pb-28 font-sans"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(29, 49, 137, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(29, 49, 137, 0.08) 1px, transparent 1px)",
        backgroundSize: "72px 72px",
      }}
    >
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">

        {/* =========================================================================
            HERO BANNER: 3 SEPARATE EQUAL #162774 BOXES WITH WHITE GAP
        ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: -16, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8"
        >
          {/* BOX 1: IDENTITY & BIO */}
          <div
            className="relative bg-[#162774] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-xl overflow-hidden text-white flex flex-col justify-between gap-5"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          >
            <div className="relative z-10 space-y-3">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#D9F83B] text-slate-950 font-sans text-[11px] font-extrabold uppercase tracking-wider">
                Universal Builder Identity
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
                Builder Profile &amp; <span className="text-[#D9F83B]">Portfolio</span>
              </h1>
            </div>

            <div className="relative z-10 flex items-center gap-4 pt-3 border-t border-white/15">
              <div className="w-16 h-16 rounded-2xl bg-[#D9F83B] text-slate-950 font-sans text-2xl font-extrabold flex items-center justify-center shadow-lg shrink-0 border-2 border-white">
                {(studentProfile?.displayName || user?.displayName || "B")[0].toUpperCase()}
              </div>
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-extrabold text-white font-sans tracking-tight truncate">
                    {studentProfile?.displayName || user?.displayName || "Botmartz Builder"}
                  </h2>
                  <span className="text-[11px] font-sans font-extrabold text-slate-950 bg-[#D9F83B] px-2.5 py-0.5 rounded-full">
                    @{username}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-white/85 font-sans font-medium leading-relaxed line-clamp-2">
                  {(studentProfile as any)?.bio || "Building production AI systems, agent swarms, and high-frequency backend telemetry."}
                </p>
              </div>
            </div>
          </div>

          {/* BOX 2: CREDENTIALS, LOCATION & SOCIALS */}
          <div
            className="relative bg-[#162774] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-xl overflow-hidden text-white flex flex-col justify-between gap-5"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          >
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/15 border border-white/20 text-[#D9F83B] font-sans text-[11px] font-extrabold uppercase tracking-wider">
                  Credentials &amp; Location
                </span>
                {score >= 80 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-white text-[#162774] font-sans text-[10px] font-extrabold uppercase tracking-wider">
                    VERIFIED
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap font-sans text-xs font-semibold text-white pt-1">
                {isProfessional ? (
                  <span className="bg-white/10 border border-white/20 px-3.5 py-1.5 rounded-full text-white">
                    {(studentProfile as any)?.companyName || "Tech Professional"} &bull; {(studentProfile as any)?.designationRole || "Engineer"}
                  </span>
                ) : (
                  <span className="bg-white/10 border border-white/20 px-3.5 py-1.5 rounded-full text-white">
                    {studentProfile?.collegeName || "Engineering Student"} &bull; {studentProfile?.degreeBranch || "B.Tech CSE"} ({studentProfile?.graduationYear || "2026"})
                  </span>
                )}
                <span className="bg-white/10 border border-white/20 px-3.5 py-1.5 rounded-full text-white">
                  {(studentProfile as any)?.cityLocation || "Indore / India"} ({(studentProfile as any)?.country || "India"})
                </span>
                <span className="bg-white/10 border border-white/20 px-3.5 py-1.5 rounded-full text-white">
                  {(studentProfile as any)?.timezone || "IST"}
                </span>
              </div>
            </div>

            <div className="relative z-10 pt-3 border-t border-white/15 flex items-center justify-between gap-3 flex-wrap font-sans text-xs font-bold">
              <span className="text-white/75">Profile Score: <strong className="text-[#D9F83B]">{score}%</strong></span>
              <div className="flex items-center gap-3">
                {studentProfile?.githubUsername && (
                  <a
                    href={`https://github.com/${studentProfile.githubUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#D9F83B] transition-colors"
                  >
                    GitHub &rarr;
                  </a>
                )}
                {studentProfile?.linkedinUrl && (
                  <a
                    href={studentProfile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#D9F83B] hover:text-white transition-colors"
                  >
                    LinkedIn &rarr;
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* BOX 3: SEARCH, KARMA BALANCE & PORTFOLIO ACTIONS */}
          <div
            className="relative bg-[#162774] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-xl overflow-hidden text-white flex flex-col justify-between gap-5"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          >
            <form onSubmit={handleSearch} className="relative z-10 w-full">
              <input
                type="text"
                value={searchHandle}
                onChange={(e) => setSearchHandle(e.target.value)}
                placeholder="Lookup builder @handle..."
                className="w-full bg-white border border-white rounded-2xl px-4 py-2.5 text-sm text-slate-950 placeholder:text-slate-400 font-semibold focus:outline-none focus:ring-2 focus:ring-[#D9F83B] transition-all shadow-sm"
              />
            </form>

            <div className="relative z-10 space-y-3 pt-3 border-t border-white/15">
              <div className="flex items-center justify-between px-4 py-2 rounded-full bg-white text-[#162774] font-sans text-xs sm:text-sm font-extrabold shadow-xs">
                <span>Karma Balance</span>
                <span>{coins} Coins</span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleCopyPublicProfile}
                  className="flex-1 px-4 py-2.5 rounded-full bg-white/15 hover:bg-white text-white hover:text-[#162774] border border-white/25 font-sans text-xs sm:text-sm font-bold transition-all flex items-center justify-center cursor-pointer shadow-xs"
                >
                  <span>{copiedLink ? "Copied!" : "Copy Link"}</span>
                </button>

                <Link
                  href={publicProfileUrl}
                  className="group flex-1 pl-4 pr-2 py-2 rounded-full bg-[#D9F83B] hover:bg-white text-[#162774] font-sans text-xs sm:text-sm font-extrabold transition-all flex items-center justify-between gap-2 shadow-lg"
                >
                  <span>Portfolio</span>
                  <span className="w-7 h-7 rounded-full bg-[#162774] text-[#D9F83B] flex items-center justify-center shrink-0">
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-[60deg]" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* =========================================================================
            LEFT STICKY SIDEBAR + 1-CLICK ACTIVE SECTION PANEL (ZERO SCROLLING)
        ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Non-Scrolling Fixed Sidebar */}
          <aside className="lg:col-span-3 lg:sticky lg:top-24 rounded-3xl bg-[#F4F6FB] border border-slate-200 p-3.5 space-y-2 shadow-sm">
            <div className="px-2 pb-1.5 border-b border-slate-200/80 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#162774]">
                  Profile Workspace
                </div>
                <div className="text-sm font-extrabold text-slate-950">
                  Quick Navigation
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#162774] text-[#D9F83B] text-[10px] font-extrabold">
                {score}%
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-1">
              {[
                { id: "completeness", num: "01", label: "Profile Completeness" },
                { id: "countdown", num: "02", label: "45-Day Sprint" },
                { id: "projects", num: "03", label: `Enrolled (${enrolledProjects.length})` },
                { id: "badges", num: "04", label: "Badges & Streaks" },
                { id: "certificates", num: "05", label: "Certificates" },
                { id: "resume", num: "06", label: "Resume Bullets" },
                { id: "linkedin", num: "07", label: "LinkedIn Checklist" },
                { id: "notifications", num: "08", label: "Email Preferences" },
                { id: "tour", num: "09", label: "Platform Tour" },
                { id: "activity", num: "10", label: `Activity & Bookings (${serviceBookings.length + hackathonRegistrations.length + workshopRegistrations.length + enrolledProjects.length})` },
                { id: "wallet", num: "11", label: `Karma Wallet (${walletData?.balance ?? coins})` },
              ].map((nav) => {
                const isActive = activeProfileSection === nav.id;
                return (
                  <button
                    key={nav.id}
                    type="button"
                    onClick={() => setActiveProfileSection(nav.id as any)}
                    className={`group w-full px-3 py-2 rounded-2xl text-left flex items-center justify-between gap-2 transition-all cursor-pointer border ${isActive
                      ? "bg-[#162774] text-white border-[#162774] shadow-md"
                      : "bg-white hover:bg-slate-50 text-slate-800 border-slate-200/80 hover:border-[#162774]"
                      }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`w-6 h-6 rounded-full text-[10px] font-extrabold flex items-center justify-center shrink-0 ${isActive
                          ? "bg-[#D9F83B] text-slate-950"
                          : "bg-[#F4F6FB] text-[#162774] group-hover:bg-[#162774] group-hover:text-[#D9F83B]"
                          }`}
                      >
                        {nav.num}
                      </span>
                      <span className="text-xs font-extrabold truncate">{nav.label}</span>
                    </div>
                    <span
                      className={`w-5 h-5 rounded-full hidden sm:flex items-center justify-center shrink-0 transition-transform duration-300 ${isActive
                        ? "bg-[#D9F83B] text-slate-950"
                        : "bg-slate-100 text-[#162774] group-hover:rotate-[60deg]"
                        }`}
                    >
                      <ArrowRight size={10} />
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Right Active Content Panel (Independent Scroll) */}
          <div className="lg:col-span-9 min-w-0 lg:h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-1">
            <motion.div
              key={activeProfileSection}
              initial={{ opacity: 0, x: 16, filter: "blur(4px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {activeProfileSection === "completeness" && (
                <>
                  {/* =========================================================================
            COMPLETENESS METER & 100% REWARD BANNER (ICON-FREE)
        ========================================================================= */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 mb-6 shadow-xs font-sans">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h3 className="text-xl font-extrabold text-slate-950">
                            Profile Completeness Score
                          </h3>
                          <span className="px-3 py-0.5 rounded-full bg-[#162774] text-[#D9F83B] text-xs font-extrabold">
                            {score}%
                          </span>
                          {score === 100 && (
                            <span className="px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold">
                              Verified Builder
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 font-medium">
                          Complete all 5 verification points to unlock company referral dispatches and earn <strong className="text-[#162774]">+100 Karma Coins</strong>.
                        </p>
                      </div>

                      <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="group relative overflow-hidden px-5 py-2.5 rounded-full bg-[#D9F83B] text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
                      >
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 bg-[#162774] -translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out"
                        />
                        <span className="relative z-10 group-hover:text-white transition-colors duration-500">
                          {score === 100 ? "Edit Profile" : "Complete Profile (+100 Coins)"}
                        </span>
                      </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-3 bg-[#F4F6FB] rounded-full overflow-hidden mb-6 border border-slate-200">
                      <div
                        className="h-full transition-all duration-500 rounded-full bg-[#162774]"
                        style={{ width: `${score}%` }}
                      />
                    </div>

                    {/* 5 Verification Checkpoints (Icon-Free) */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-bold">
                      {[
                        { label: "Identity (20%)", ok: Boolean(studentProfile?.displayName) },
                        { label: `${isProfessional ? "Company" : "College"} (20%)`, ok: Boolean(studentProfile?.collegeName || (studentProfile as any)?.companyName) },
                        { label: "GitHub (20%)", ok: Boolean(studentProfile?.githubUsername) },
                        { label: "LinkedIn (20%)", ok: Boolean(studentProfile?.linkedinUrl) },
                        { label: "DPDP Consent (20%)", ok: studentProfile?.dpdpConsent !== false },
                      ].map((cp, idx) => (
                        <div
                          key={cp.label}
                          className={`p-3 rounded-2xl border flex items-center gap-2 ${cp.ok
                            ? "bg-white border-[#162774] border-l-4 border-l-[#D9F83B] text-slate-950"
                            : "bg-[#F4F6FB] border-slate-200 text-slate-500"
                            }`}
                        >
                          <span className={`w-5 h-5 rounded-full text-[9px] font-extrabold flex items-center justify-center shrink-0 ${cp.ok ? "bg-[#162774] text-[#D9F83B]" : "bg-slate-200 text-slate-500"
                            }`}>
                            0{idx + 1}
                          </span>
                          <span className="truncate">{cp.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Platform Guide & Tour Banner (Icon-Free) */}
                  <div
                    className="p-6 rounded-3xl bg-[#162774] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg font-sans"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
                      backgroundSize: "36px 36px",
                    }}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-base text-white">Explore the Botmartz Platform &amp; Product Tour</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#D9F83B] text-slate-950 text-[10px] font-extrabold uppercase tracking-wider">Interactive Walkthrough</span>
                      </div>
                      <p className="text-xs sm:text-sm text-blue-100/90 font-medium">
                        Discover what each page does ({TOTAL_SYSTEMS_COUNT} PRDs, daily logs, agile workspaces, karma wallet, squad matchmaking, conferences) and how to ship faster.
                      </p>
                    </div>

                    <Link
                      href="/product-tour"
                      className="group px-5 py-2.5 rounded-full bg-[#D9F83B] hover:bg-white text-slate-950 text-xs font-extrabold transition-all shrink-0 flex items-center gap-2 shadow-sm"
                    >
                      <span>Open Tour</span>
                      <ArrowRight size={13} className="transition-transform duration-300 group-hover:rotate-[60deg]" />
                    </Link>
                  </div>
                </>
              )}

              {activeProfileSection === "countdown" && (
                <>

                  {/* =========================================================================
            PERSONAL 45-DAY VIRTUAL AI INTERNSHIP COUNTDOWN & MILESTONES (ICON-FREE)
        ========================================================================= */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs font-sans text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <div>
                        <span className="inline-block px-3.5 py-1 rounded-full bg-[#162774] text-[#D9F83B] font-extrabold text-[10px] uppercase tracking-wider mb-2">
                          Rolling 45-Day Internship Sprint
                        </span>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950 font-sans">
                          Personal 45-Day Progress &amp; Milestone Timer
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                          Every builder operates on their own 45-day window from the day of first enrollment.
                        </p>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        <div className="px-4 py-2 rounded-full bg-[#162774] text-[#D9F83B] text-xs font-extrabold">
                          Day {daysElapsed} / 45
                        </div>
                        <div className={`px-4 py-2 rounded-full text-xs font-extrabold border ${daysRemaining <= 7
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : daysRemaining <= 15
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : "bg-[#D9F83B] text-slate-950 border-[#D9F83B]"
                          }`}>
                          {daysRemaining > 0 ? `${daysRemaining} Days Left` : "Sprint Complete"}
                        </div>
                      </div>
                    </div>

                    {/* Milestone Warnings */}
                    {daysRemaining <= 7 && daysRemaining > 0 && (
                      <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 border-l-4 border-l-rose-600 text-rose-900 mb-6">
                        <div className="font-extrabold text-sm">Final Week Sprint Alert: Complete Cloud Deploy &amp; Audit</div>
                        <p className="text-xs text-rose-700 mt-0.5 font-medium">
                          You have less than 7 days remaining in your 45-day sprint. Ensure your QA test pass rate is 100%, deploy your Docker container to cloud, and push your final commit.
                        </p>
                      </div>
                    )}

                    {daysRemaining <= 15 && daysRemaining > 7 && (
                      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 border-l-4 border-l-amber-500 text-amber-900 mb-6">
                        <div className="font-extrabold text-sm">15-Day Milestone Warning: Finalize Core APIs &amp; QA Test Suite</div>
                        <p className="text-xs text-amber-800 mt-0.5 font-medium">
                          You have 15 days left. Make sure all core microservices are built and your k6 load test scripts demonstrate &lt;150ms p95 latency.
                        </p>
                      </div>
                    )}

                    {/* Progress Bar */}
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-xs text-slate-700 font-bold">
                        <span>Overall Sprint Completion: {percentComplete}%</span>
                        <span>{45 - daysRemaining} / 45 Days Logged</span>
                      </div>
                      <div className="h-3 w-full bg-[#F4F6FB] rounded-full overflow-hidden border border-slate-200">
                        <div
                          className="h-full bg-[#162774] rounded-full transition-all duration-500"
                          style={{ width: `${percentComplete}%` }}
                        />
                      </div>
                    </div>

                    {/* 4-Stage Milestone Matrix */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                      {[
                        { phase: "Stage 1: Days 1–10", title: "Architecture & HLD/LLD", status: daysElapsed >= 10 ? "PASSED" : daysElapsed >= 1 ? "IN_PROGRESS" : "PENDING", desc: "System PRD, schemas & design matrices" },
                        { phase: "Stage 2: Days 11–25", title: "Core Microservices & APIs", status: daysElapsed >= 25 ? "PASSED" : daysElapsed >= 11 ? "IN_PROGRESS" : "PENDING", desc: "Pipeline logic, SLM/agent swarms & Redis" },
                        { phase: "Stage 3: Days 26–35", title: "QA Suite & SLA Benchmarking", status: daysElapsed >= 35 ? "PASSED" : daysElapsed >= 26 ? "IN_PROGRESS" : "PENDING", desc: "k6 load assertions & edge failure tests" },
                        { phase: "Stage 4: Days 36–45", title: "Cloud Deploy & Founder Audit", status: daysElapsed >= 45 ? "PASSED" : daysElapsed >= 36 ? "IN_PROGRESS" : "PENDING", desc: "Container deploy & referral verification" }
                      ].map((stg, idx) => (
                        <div
                          key={idx}
                          className={`p-4 rounded-2xl border transition-all ${stg.status === "PASSED"
                            ? "bg-white border-emerald-300 border-l-4 border-l-emerald-600 text-slate-950"
                            : stg.status === "IN_PROGRESS"
                              ? "bg-white border-[#162774] border-l-4 border-l-[#D9F83B] shadow-sm text-slate-950"
                              : "bg-[#F4F6FB] border-slate-200 text-slate-600"
                            }`}
                        >
                          <div className="flex items-center justify-between text-[10px] font-extrabold mb-1.5">
                            <span className="text-[#162774] uppercase">{stg.phase}</span>
                            <span className={`px-2 py-0.5 rounded-full ${stg.status === "PASSED"
                              ? "bg-emerald-100 text-emerald-800"
                              : stg.status === "IN_PROGRESS"
                                ? "bg-[#D9F83B] text-slate-950"
                                : "bg-white text-slate-500 border border-slate-200"
                              }`}>
                              {stg.status === "PASSED" ? "Done" : stg.status === "IN_PROGRESS" ? "Active" : "Upcoming"}
                            </span>
                          </div>
                          <div className="font-extrabold text-sm text-slate-950 mb-1">{stg.title}</div>
                          <div className="text-xs text-slate-600 font-medium leading-relaxed">{stg.desc}</div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
                      <div className="text-xs text-slate-600 font-medium">
                        Submit daily GitHub commits to keep your streak unbroken and earn +20 to +70 Karma Coins every day.
                      </div>
                      <Link
                        href="/arena/daily-log"
                        className="group relative overflow-hidden px-5 py-2.5 rounded-full bg-[#D9F83B] text-slate-950 font-extrabold text-xs transition-all flex items-center gap-2 shadow-sm"
                      >
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 bg-[#162774] -translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out"
                        />
                        <span className="relative z-10 group-hover:text-white transition-colors duration-500">Log Daily Commit</span>
                        <span className="relative z-10 w-6 h-6 rounded-full bg-slate-950 text-[#D9F83B] group-hover:bg-[#D9F83B] group-hover:text-slate-950 flex items-center justify-center transition-all duration-300 group-hover:rotate-[60deg]">
                          <ArrowRight size={11} />
                        </span>
                      </Link>
                    </div>
                  </div>

                </>
              )}

              {activeProfileSection === "projects" && (
                <>
                  {/* =========================================================================
            ENROLLED ARENA BLUEPRINTS (ICON-FREE)
        ========================================================================= */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs font-sans">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                      <div>
                        <span className="inline-block px-3.5 py-1 rounded-full bg-[#162774] text-[#D9F83B] text-[10px] font-extrabold uppercase tracking-wider mb-1.5">
                          Active System Tracks
                        </span>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950">
                          My Enrolled Production PRDs
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                          Active engineering systems assigned to your proof-of-work streak.
                        </p>
                      </div>

                      <Link
                        href="/arena"
                        className="px-4 py-2 rounded-full bg-[#F4F6FB] border border-slate-200 text-[#162774] text-xs font-extrabold hover:bg-[#162774] hover:text-white transition-colors self-start sm:self-auto"
                      >
                        Browse {TOTAL_SYSTEMS_COUNT} Systems
                      </Link>
                    </div>

                    {loadingEnrollments ? (
                      <div className="py-12 text-center text-slate-500 font-sans text-xs font-semibold">
                        Loading enrolled blueprints...
                      </div>
                    ) : enrolledProjects.length === 0 ? (
                      <div className="p-8 sm:p-10 text-center rounded-3xl bg-[#F4F6FB] border border-slate-200 border-l-4 border-l-[#162774] space-y-3">
                        <span className="inline-block px-3 py-1 rounded-full bg-[#162774] text-[#D9F83B] text-[10px] font-extrabold uppercase tracking-wider">
                          Ready to Enroll
                        </span>
                        <div className="font-extrabold text-slate-950 text-lg">No Active PRD Enrollments Yet</div>
                        <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md mx-auto leading-relaxed">
                          Explore the {TOTAL_SYSTEMS_COUNT} production AI blueprints in the Arena catalog and enroll in your first track to begin shipping.
                        </p>
                        <Link
                          href="/arena"
                          className="group relative overflow-hidden inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D9F83B] text-slate-950 text-xs font-extrabold shadow-sm"
                        >
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 bg-[#162774] -translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out"
                          />
                          <span className="relative z-10 group-hover:text-white transition-colors duration-500">Enroll in a Project</span>
                          <span className="relative z-10 w-5 h-5 rounded-full bg-slate-950 text-[#D9F83B] group-hover:bg-[#D9F83B] group-hover:text-slate-950 flex items-center justify-center transition-all duration-300 group-hover:rotate-[60deg]">
                            <ArrowRight size={10} />
                          </span>
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
                        {enrolledProjects.map((ep) => {
                          const completedDays = Math.min(45, Math.max(ep.lastDayLogged || 0, ep.streak || 0));
                          const progressPct = Math.min(100, Math.round((completedDays / 45) * 100));

                          return (
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
                                <div className="text-[11px] text-slate-500 mb-3">
                                  Role: <strong>{ep.role || "AI Engineer"}</strong>
                                </div>

                                {/* 45-Day Progress Bar */}
                                <div className="p-3 rounded-xl bg-white border border-slate-200/80 space-y-1.5">
                                  <div className="flex items-center justify-between text-[10px]">
                                    <span className="font-bold text-slate-700 font-sans">
                                      Day {completedDays} / 45 Completed
                                    </span>
                                    <span className="font-mono font-bold text-[#0066FF]">{progressPct}%</span>
                                  </div>
                                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-to-r from-[#0066FF] to-cyan-400 rounded-full transition-all duration-300"
                                      style={{ width: `${progressPct}%` }}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col gap-2 pt-3 border-t border-slate-200/80">
                                <div className="flex items-center gap-2">
                                  <Link
                                    href={`/arena/${ep.projectId}`}
                                    className="flex-1 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-center hover:bg-slate-100 transition-colors"
                                  >
                                    Open PRD
                                  </Link>
                                  <Link
                                    href={`/arena/daily-log?projectId=${ep.projectId}`}
                                    className="flex-1 py-2 rounded-xl bg-[#0066FF] text-white font-bold text-center hover:bg-blue-600 transition-colors"
                                  >
                                    Log Commit
                                  </Link>
                                  <button
                                    type="button"
                                    onClick={() => handleUnenroll(ep.id, ep.projectId, ep.projectTitle)}
                                    disabled={unenrollingId === (ep.id || ep.projectId)}
                                    className="px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 text-slate-500 font-bold transition-colors cursor-pointer shrink-0"
                                    title="Unenroll / Leave this project track"
                                  >
                                    {unenrollingId === (ep.id || ep.projectId) ? (
                                      <Loader2 size={13} className="animate-spin text-rose-500" />
                                    ) : (
                                      <span className="text-[10px] text-rose-600">Leave</span>
                                    )}
                                  </button>
                                </div>

                                <Link
                                  href={`/showcase?autoOpen=true&title=${encodeURIComponent(ep.projectTitle || "Production AI System")}&desc=${encodeURIComponent(`Autonomous production build for ${ep.projectTitle}`)}&github=${encodeURIComponent(ep.githubRepoUrl || ep.github || "")}`}
                                  className="w-full py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 font-bold text-center flex items-center justify-center gap-1.5 transition-colors"
                                >
                                  <Sparkles size={12} />
                                  <span>Publish to Community Showcase &rarr;</span>
                                </Link>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>


                </>
              )}

              {activeProfileSection === "badges" && (
                <>
                  {/* =========================================================================
            SECTION BADGES: GAMIFIED CANDIDATE BADGES & STREAKS (ICON-FREE)
        ========================================================================= */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs font-sans">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-6">
                      <div>
                        <span className="inline-block px-3.5 py-1 rounded-full bg-[#162774] text-[#D9F83B] text-[10px] font-extrabold uppercase tracking-wider mb-1.5">
                          Earned Badges &amp; Production Milestones
                        </span>
                        <h3 className="text-xl sm:text-2xl font-extrabold font-sans text-slate-950">
                          Gamified Candidate Badges &amp; Streaks
                        </h3>
                        <p className="text-xs sm:text-sm font-sans font-medium text-slate-600 mt-1">
                          Unlock and claim streak badges (10, 20, 45 days) &amp; project milestones (1, 2, 4 projects).
                        </p>
                      </div>

                      <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-auto">
                        {badgeStatuses.some((b) => b.canClaim) && (
                          <button
                            type="button"
                            onClick={handleClaimAllBadges}
                            className="px-4 py-2 rounded-full bg-[#D9F83B] hover:bg-[#162774] text-slate-950 hover:text-white font-sans text-xs font-extrabold transition-all shadow-sm cursor-pointer"
                          >
                            Claim All Unlocked Badges
                          </button>
                        )}
                        <span className="px-4 py-1.5 rounded-full bg-[#F4F6FB] text-[#162774] font-sans text-xs font-extrabold border border-slate-200">
                          {claimedBadges.length} Badges Claimed
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-sans text-xs">
                      {badgeStatuses.map((b, idx) => (
                        <div
                          key={b.id}
                          className={`p-5 rounded-3xl border flex flex-col justify-between space-y-4 transition-all ${b.isClaimed
                            ? "bg-white border-emerald-300 border-l-4 border-l-emerald-600 shadow-xs"
                            : b.isEligible
                              ? "bg-white border-[#162774] border-l-4 border-l-[#D9F83B] shadow-md"
                              : "bg-[#F4F6FB] border-slate-200 border-l-4 border-l-[#162774]"
                            }`}
                        >
                          <div className="space-y-2.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="w-7 h-7 rounded-full bg-[#162774] text-[#D9F83B] text-[10px] font-extrabold flex items-center justify-center shrink-0">
                                {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                              </span>

                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${b.isClaimed
                                    ? "bg-emerald-100 text-emerald-800"
                                    : b.isEligible
                                      ? "bg-[#D9F83B] text-slate-950"
                                      : "bg-white text-slate-600 border border-slate-200"
                                    }`}
                                >
                                  {b.isClaimed ? "Claimed" : b.isEligible ? "Unlocked" : "Locked"}
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-[10px] text-[#162774] font-extrabold uppercase">
                                  {b.category}
                                </span>
                              </div>
                            </div>

                            <h4 className="font-extrabold text-slate-950 font-sans text-base leading-snug">{b.title}</h4>
                            <p className="text-xs sm:text-[13px] text-slate-600 font-sans font-medium leading-relaxed">{b.description}</p>
                          </div>

                          <div>
                            {b.isClaimed ? (
                              <div className="w-full py-2.5 rounded-xl bg-emerald-100 text-emerald-900 text-center font-extrabold text-xs">
                                Active Verified Badge on Profile
                              </div>
                            ) : b.canClaim ? (
                              <button
                                onClick={() => handleClaimBadge(b.id)}
                                disabled={claimingId === b.id}
                                className="w-full py-2.5 rounded-xl bg-[#D9F83B] hover:bg-[#162774] text-slate-950 hover:text-white font-extrabold text-center transition-all shadow-sm cursor-pointer"
                              >
                                {claimingId === b.id ? "Claiming..." : "Claim Badge Now"}
                              </button>
                            ) : (
                              <div className="w-full py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-center font-bold text-xs">
                                Need {b.requiredCount} {b.category === "streak" ? "Days" : "Projects"}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </>
              )}

              {activeProfileSection === "certificates" && (
                <>
                  {/* =========================================================================
            SECTION CERTIFICATES: OFFICIAL VERIFIED COMPLETION CERTIFICATES (ICON-FREE)
        ========================================================================= */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs font-sans">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                      <div>
                        <span className="inline-block px-3.5 py-1 rounded-full bg-[#162774] text-[#D9F83B] text-[10px] font-extrabold uppercase tracking-wider mb-1.5">
                          Official Credentials
                        </span>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950">
                          Verified Completion Certificates &amp; Passes
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                          Issued by Botmartz AI Solutions upon completing 45 days of proof-of-work.
                        </p>
                      </div>

                      <Link
                        href="/certificates"
                        className="px-4 py-2 rounded-full bg-[#F4F6FB] border border-slate-200 text-[#162774] text-xs font-extrabold hover:bg-[#162774] hover:text-white transition-colors self-start sm:self-auto"
                      >
                        Verify Desk
                      </Link>
                    </div>

                    {completedEnrollments.length === 0 ? (
                      <div className="p-8 rounded-3xl bg-[#F4F6FB] border border-slate-200 border-l-4 border-l-[#162774] text-center space-y-2.5">
                        <span className="inline-block px-3 py-1 rounded-full bg-[#D9F83B] text-slate-950 text-[10px] font-extrabold uppercase tracking-wider">
                          Day {daysElapsed}/45 Logged
                        </span>
                        <h4 className="font-extrabold text-slate-950 text-lg">Certificate Locked</h4>
                        <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md mx-auto leading-relaxed">
                          Your official certificate will generate automatically once you complete 45 days of daily standup logs or mark your project complete.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
                        {completedEnrollments.map((c) => {
                          const certId = c.certificateId || `CERT-BM-${(c.projectId || "888").toUpperCase()}-98231`;
                          return (
                            <div
                              key={c.id || c.projectId}
                              className="rounded-3xl bg-gradient-to-br from-emerald-50/80 via-white to-blue-50/50 border-2 border-emerald-300 p-6 space-y-4 shadow-md"
                            >
                              <div className="flex items-center justify-between">
                                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase text-[10px] flex items-center gap-1">
                                  <CheckCircle2 size={13} className="text-emerald-600" /> Verified Credential
                                </span>
                                <span className="text-slate-500 font-bold text-[11px]">
                                  ID: {certId}
                                </span>
                              </div>

                              <div>
                                <h4 className="font-extrabold text-slate-900 font-sans text-lg">{c.projectTitle}</h4>
                                <p className="text-slate-500 text-xs mt-1">Issued by Soham Sharma &bull; Botmartz AI Solutions</p>
                              </div>

                              <div className="flex flex-wrap items-center gap-2 pt-2">
                                <Link
                                  href={`/certificates?query=${certId}`}
                                  className="flex-1 py-2.5 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-center transition-colors shadow-xs"
                                >
                                  View PDF
                                </Link>

                                <button
                                  onClick={() => setShareModalData({
                                    isOpen: true,
                                    projectTitle: c.projectTitle,
                                    certId
                                  })}
                                  className="flex-1 py-2.5 rounded-xl bg-[#0077B5] hover:bg-[#006097] text-white font-bold text-center transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                  <Linkedin size={14} />
                                  <span>Share on LinkedIn</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>


                </>
              )}

              {activeProfileSection === "resume" && (
                <>
                  {/* =========================================================================
            SECTION A: AUTOMATED PROJECT RESUME STAR BULLET GENERATOR (ENROLLED ONLY)
        ========================================================================= */}
                  <div className="bg-white border border-slate-200 rounded-[28px] p-6 sm:p-8 mb-8 shadow-sm font-sans">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                      <div>
                        <span className="inline-block px-3.5 py-1 rounded-full bg-[#F4F6FB] border border-slate-200 text-[#162774] text-xs font-extrabold uppercase tracking-wider mb-2.5">
                          RECRUITER &amp; ATS OPTIMIZATION
                        </span>
                        <h3 className="text-2xl font-extrabold text-[#162774] tracking-tight">
                          Project Resume Builder &amp; STAR Bullet Generator
                        </h3>
                        <p className="text-sm font-medium text-slate-600 mt-1">
                          Automatically generate metric-driven, recruiter-ready STAR bullet points for your applied Arena projects.
                        </p>
                      </div>

                      {/* Project Selector Dropdown - Strictly Enrolled Projects */}
                      <div className="w-full sm:w-72">
                        <select
                          value={selectedResumeId}
                          onChange={(e) => setSelectedResumeId(e.target.value)}
                          disabled={enrolledProjects.length === 0}
                          className="w-full bg-[#F4F6FB] border border-slate-200 rounded-full px-4 py-2.5 text-sm font-semibold text-[#162774] focus:bg-white focus:outline-none focus:border-[#162774] disabled:opacity-60"
                        >
                          {enrolledProjects.length > 0 ? (
                            enrolledProjects.map((p) => (
                              <option key={p.id || p.projectId} value={p.projectId}>
                                {p.projectTitle || p.projectId}
                              </option>
                            ))
                          ) : (
                            <option value="">No Active Enrollments</option>
                          )}
                        </select>
                      </div>
                    </div>

                    {/* Generated Bullets Display */}
                    {(() => {
                      if (enrolledProjects.length === 0) {
                        return (
                          <div className="p-8 sm:p-10 rounded-2xl bg-[#F4F6FB] border border-slate-200 text-center space-y-3">
                            <div className="text-[#162774] font-extrabold text-lg">Strict Enrolled-Only Proof-of-Work Gate</div>
                            <p className="text-sm font-medium text-slate-600 max-w-md mx-auto leading-relaxed">
                              To prevent unverified resume inflation, STAR bullet points are strictly generated only for projects you have enrolled in and actively logged.
                            </p>
                            <div className="pt-2">
                              <Link
                                href="/arena"
                                className="group inline-flex items-center gap-3 pl-5 pr-2 py-2 rounded-full bg-[#162774] text-white font-bold text-sm hover:bg-[#1e3494] transition-all"
                              >
                                <span>Enroll in an Arena Track</span>
                                <span className="w-7 h-7 rounded-full bg-[#D9F83B] text-[#162774] flex items-center justify-center">
                                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-[60deg]" />
                                </span>
                              </Link>
                            </div>
                          </div>
                        );
                      }

                      const activeEnrolledId = selectedResumeId && enrolledProjects.some((ep) => ep.projectId === selectedResumeId)
                        ? selectedResumeId
                        : enrolledProjects[0]?.projectId;

                      const currentProj = ARENA_PROJECTS.find((p) => p.id === activeEnrolledId || p.slug === activeEnrolledId) || ARENA_PROJECTS[0];
                      const techList = currentProj.techStack.slice(0, 4).join(", ");
                      const bullets = [
                        `Architected and deployed a production ${currentProj.title} utilizing ${techList}, processing high-throughput payloads with sub-150ms p95 latency.`,
                        `Engineered multi-table relational schemas and vector embedding indexing with strict ACID transaction guarantees and zero data loss.`,
                        `Built automated test suites and SLA benchmark pipelines, achieving >85% code coverage and meeting strict production acceptance criteria (${currentProj.productionSla}).`,
                        `Containerized microservices via Docker and established automated GitHub CI/CD workflows for reproducible staging and cloud deployments.`
                      ];

                      const plainText = `• ${bullets.join("\n• ")}`;
                      const latexText = `\\resumeSubheading\n  {${currentProj.title}}{Indore, India}\n  {AI & Systems Engineering Fellow}{Sept 2026 -- Present}\n  \\resumeItemListStart\n    \\resumeItem{${bullets[0]}}\n    \\resumeItem{${bullets[1]}}\n    \\resumeItem{${bullets[2]}}\n    \\resumeItem{${bullets[3]}}\n  \\resumeItemListEnd`;

                      return (
                        <div className="space-y-4">
                          <div className="p-5 sm:p-6 rounded-2xl bg-[#F4F6FB] border border-slate-200 space-y-3">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                              <span className="font-extrabold text-[#162774] text-base">{currentProj.title}</span>
                              <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-xs text-[#162774] font-bold uppercase tracking-wider">{currentProj.difficulty}</span>
                            </div>

                            {bullets.map((b, bi) => (
                              <div key={bi} className="flex items-start gap-2.5 text-slate-700 text-sm font-medium leading-relaxed">
                                <span className="text-[#162774] font-extrabold shrink-0">&bull;</span>
                                <span>{b}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex flex-wrap items-center gap-3 pt-2">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(plainText);
                                setCopiedResumePlain(true);
                                setTimeout(() => setCopiedResumePlain(false), 2000);
                              }}
                              className="px-5 py-2.5 rounded-full bg-[#162774] hover:bg-[#1e3494] text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-xs"
                            >
                              <span>{copiedResumePlain ? "Plain Text Copied!" : "Copy Plain Text Bullets"}</span>
                            </button>

                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(latexText);
                                setCopiedResumeLatex(true);
                                setTimeout(() => setCopiedResumeLatex(false), 2000);
                              }}
                              className="px-5 py-2.5 rounded-full bg-[#F4F6FB] hover:bg-[#D9F83B] text-[#162774] border border-slate-200 font-bold text-xs sm:text-sm transition-all cursor-pointer"
                            >
                              <span>{copiedResumeLatex ? "LaTeX Code Copied!" : "Copy LaTeX (Overleaf) Block"}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                </>
              )}

              {activeProfileSection === "linkedin" && (
                <>
                  {/* =========================================================================
            SECTION B: INTERACTIVE LINKEDIN BUILDER CHECKLIST
        ========================================================================= */}
                  <div className="bg-white border border-slate-200 rounded-[28px] p-6 sm:p-8 mb-8 shadow-sm font-sans">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                      <div>
                        <span className="inline-block px-3.5 py-1 rounded-full bg-[#F4F6FB] border border-slate-200 text-[#162774] text-xs font-extrabold uppercase tracking-wider mb-2.5">
                          LINKEDIN VISIBILITY &amp; REACH
                        </span>
                        <h3 className="text-2xl font-extrabold text-[#162774] tracking-tight">
                          LinkedIn Builder Optimization Checklist
                        </h3>
                        <p className="text-sm font-medium text-slate-600 mt-1">
                          Convert your daily proof-of-work into inbound engineering interview invites.
                        </p>
                      </div>

                      <Link
                        href="/arena/career-checklist"
                        className="group inline-flex items-center gap-3 pl-4 pr-1.5 py-1.5 rounded-full bg-[#F4F6FB] hover:bg-[#162774] text-[#162774] hover:text-white border border-slate-200 hover:border-[#162774] font-bold text-xs sm:text-sm transition-all shrink-0"
                      >
                        <span>Full Career Checklist</span>
                        <span className="w-7 h-7 rounded-full bg-[#162774] group-hover:bg-[#D9F83B] text-white group-hover:text-[#162774] flex items-center justify-center transition-colors">
                          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-[60deg]" />
                        </span>
                      </Link>
                    </div>

                    {/* Checklist Items */}
                    <div className="space-y-3">
                      {[
                        {
                          key: "headline",
                          label: "Optimized Headline (e.g. AI & Distributed Systems Builder @ Botmartz Arena | PyTorch • LangGraph • FastAPI)",
                          action: () => {
                            navigator.clipboard.writeText("AI & Systems Engineering Builder @ Botmartz Arena | PyTorch • LangGraph • FastAPI • Rust");
                            setCopiedHeadline(true);
                            setTimeout(() => setCopiedHeadline(false), 2000);
                          },
                          actionLabel: copiedHeadline ? "Headline Copied!" : "Copy Headline"
                        },
                        {
                          key: "githubInFeatured",
                          label: "Pinned Active GitHub Repository in Featured Section",
                          action: null,
                          actionLabel: null
                        },
                        {
                          key: "day1Post",
                          label: "Published Day 1 / Milestone Proof-of-Work Post with #BotmartzAI",
                          action: () => {
                            const postText = `🚀 Excited to announce I am building production systems in the Botmartz Arena!\n\nTackling industrial PRD blueprints with strict <150ms SLA latency gates and daily GitHub proof-of-work commits.\n\nCheck out my builder profile: https://community.botmartz.com${publicProfileUrl}\n\n#BotmartzAI #SystemsEngineering #AI #FullStack`;
                            navigator.clipboard.writeText(postText);
                            setCopiedPostTemplate(true);
                            setTimeout(() => setCopiedPostTemplate(false), 2000);
                          },
                          actionLabel: copiedPostTemplate ? "Post Template Copied!" : "Copy Post Template"
                        },
                        {
                          key: "skillTags",
                          label: "Added Top 5 Technical Skills (Python, FastAPI, PyTorch, Vector DBs, Docker)",
                          action: null,
                          actionLabel: null
                        },
                        {
                          key: "portfolioLink",
                          label: `Attached Verified Botmartz Profile Link (community.botmartz.com${publicProfileUrl}) in Bio`,
                          action: handleCopyPublicProfile,
                          actionLabel: copiedLink ? "Link Copied!" : "Copy Link"
                        },
                        {
                          key: "peerConnect",
                          label: "Connected with 10+ Fellow Builders in the Community",
                          action: null,
                          actionLabel: null
                        }
                      ].map((item, idx) => {
                        const isDone = (linkedinTasks as any)[item.key];
                        return (
                          <div
                            key={idx}
                            className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${isDone ? "bg-[#D9F83B]/15 border-[#162774]/30 text-[#162774]" : "bg-[#F4F6FB] border-slate-200 text-slate-700"
                              }`}
                          >
                            <label className="flex items-center gap-3 cursor-pointer select-none text-sm font-semibold">
                              <input
                                type="checkbox"
                                checked={Boolean(isDone)}
                                onChange={() => {
                                  setLinkedinTasks((prev) => ({
                                    ...prev,
                                    [item.key]: !isDone
                                  }));
                                }}
                                className="w-4 h-4 rounded accent-[#162774] border-slate-300 focus:ring-[#162774] cursor-pointer"
                              />
                              <span className={isDone ? "font-bold text-[#162774]" : "font-semibold text-slate-800"}>{item.label}</span>
                            </label>

                            {item.action && (
                              <button
                                onClick={item.action}
                                className="px-3.5 py-2 rounded-full bg-white border border-slate-200 hover:border-[#162774] hover:bg-[#162774] hover:text-white text-[#162774] font-bold text-xs shrink-0 transition-all cursor-pointer"
                              >
                                {item.actionLabel}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-5 p-4 rounded-2xl bg-[#162774] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="text-sm font-medium text-white/90">
                        <strong className="text-[#D9F83B] font-extrabold">Tip:</strong> Submitting your live LinkedIn post URL on the Daily Log awards an instant <strong className="text-white font-bold">+50 Karma Coins</strong>!
                      </div>
                      <Link
                        href="/arena/daily-log"
                        className="group inline-flex items-center gap-3 pl-4 pr-1.5 py-1.5 rounded-full bg-[#D9F83B] text-[#162774] font-extrabold text-xs sm:text-sm shrink-0 hover:bg-[#cff227] transition-all"
                      >
                        <span>Submit Post Link (+50)</span>
                        <span className="w-7 h-7 rounded-full bg-[#162774] text-[#D9F83B] flex items-center justify-center">
                          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-[60deg]" />
                        </span>
                      </Link>
                    </div>
                  </div>

                </>
              )}

              {activeProfileSection === "notifications" && (
                <>
                  {/* =========================================================================
            SECTION B2: EMAIL NOTIFICATIONS & SPRINT ALERT PREFERENCES (ICON-FREE)
        ========================================================================= */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs font-sans text-xs">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                      <div>
                        <span className="inline-block px-3.5 py-1 rounded-full bg-[#162774] text-[#D9F83B] font-extrabold text-[10px] uppercase tracking-wider mb-1.5">
                          Communications &amp; Dispatch Control
                        </span>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950">
                          Email Notification &amp; Milestone Alerts
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                          Choose exactly which email notifications and reminders you want to receive. No spam — only critical sprint alerts.
                        </p>
                      </div>

                      <button
                        onClick={handleSaveNotificationPrefs}
                        disabled={savingPrefs}
                        className="px-5 py-2.5 rounded-full bg-[#D9F83B] hover:bg-[#162774] text-slate-950 hover:text-white font-extrabold transition-all shadow-xs cursor-pointer shrink-0 disabled:opacity-50"
                      >
                        {savingPrefs ? "Saving..." : "Save Preferences"}
                      </button>
                    </div>

                    {prefsSuccessMsg && (
                      <div className="p-3.5 rounded-2xl bg-[#F4F6FB] border border-[#162774]/20 border-l-4 border-l-[#162774] text-[#162774] font-bold text-xs mb-6">
                        {prefsSuccessMsg}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          key: "deadlineWarnings",
                          title: "45-Day Milestone & Deadline Warnings",
                          desc: "Receive automated alerts at Day 30 (15 days left) and Day 38 (7 days left) to keep your internship sprint on track."
                        },
                        {
                          key: "dailyStandupReminder",
                          title: "Daily Proof-of-Work Logging Reminder (8:00 PM IST)",
                          desc: "Gentle daily ping to submit your GitHub commit, build your streak, and claim daily Karma Coins."
                        },
                        {
                          key: "walletAlerts",
                          title: "Karma Coins & Wallet Activity",
                          desc: "Instant notifications when coins are credited for PoW logs, tips from squad mates, or hint purchases."
                        },
                        {
                          key: "discussionAlerts",
                          title: "Discussion Replies & Solution Mentions",
                          desc: "Get notified when another engineer answers your question or replies to your technical thread."
                        },
                        {
                          key: "saturdayMeetups",
                          title: "Saturday Indore AI Lab & Wednesday Stage",
                          desc: "Notifications for in-person Indore teardowns (50+ RSVPs) and weekly online live stages."
                        },
                        {
                          key: "recruiterAlerts",
                          title: "Founder & Partner Job Referrals",
                          desc: "Direct interview dispatches from hiring partners looking for top-ranking 45-day internship graduates."
                        }
                      ].map((pref) => {
                        const isChecked = (notificationPrefs as any)[pref.key];
                        return (
                          <div
                            key={pref.key}
                            className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${isChecked
                              ? "bg-white border-[#162774] border-l-4 border-l-[#D9F83B] shadow-2xs"
                              : "bg-[#F4F6FB] border-slate-200 opacity-75"
                              }`}
                          >
                            <div className="space-y-1">
                              <div className="font-extrabold text-slate-950 text-sm">{pref.title}</div>
                              <p className="text-xs text-slate-600 leading-relaxed font-medium">{pref.desc}</p>
                            </div>

                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                setNotificationPrefs({
                                  ...notificationPrefs,
                                  [pref.key]: e.target.checked
                                });
                              }}
                              className="w-5 h-5 mt-0.5 rounded text-[#162774] border-slate-300 focus:ring-[#162774] cursor-pointer shrink-0"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </>
              )}

              {activeProfileSection === "tour" && (
                <>
                  {/* =========================================================================
            SECTION C: BOTMARTZ PLATFORM TOUR & FEATURE SITEMAP
        ========================================================================= */}
                  <div className="bg-white border border-slate-200 rounded-[28px] p-6 sm:p-8 mb-8 shadow-sm font-sans">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                      <div>
                        <span className="inline-block px-3.5 py-1 rounded-full bg-[#F4F6FB] border border-slate-200 text-[#162774] text-xs font-extrabold uppercase tracking-wider mb-2.5">
                          PLATFORM ECOSYSTEM TOUR
                        </span>
                        <h3 className="text-2xl font-extrabold text-[#162774] tracking-tight">
                          Guide to All Platform Features
                        </h3>
                        <p className="text-sm font-medium text-slate-600 mt-1">
                          Every page on Botmartz and how to make the most of it.
                        </p>
                      </div>

                      <Link
                        href="/arena/antigravity-guide"
                        className="group inline-flex items-center gap-3 pl-5 pr-2 py-2 rounded-full bg-[#162774] text-white font-bold text-xs sm:text-sm hover:bg-[#1e3494] transition-all shrink-0"
                      >
                        <span>Full Guide</span>
                        <span className="w-7 h-7 rounded-full bg-[#D9F83B] text-[#162774] flex items-center justify-center">
                          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-[60deg]" />
                        </span>
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        { title: `The Arena (${TOTAL_SYSTEMS_COUNT} PRDs)`, desc: "Production system blueprints with SLA gates.", href: "/arena" },
                        { title: "Daily PoW Logger", desc: "Submit daily GitHub commits & maintain streaks.", href: "/arena/daily-log" },
                        { title: "Virtual AI Fellowship", desc: "45-day structured milestone cohort.", href: "/virtual-ai-internship" },
                        { title: "Builder Karma Wallet", desc: "Redeem coins for clinics, swag & credits.", href: "/arena/wallet" },
                        { title: "Saturday Office Hours", desc: "Weekly live architecture clinics with founder.", href: "/arena/calendar" },
                        { title: "Discussion Channels", desc: "Community forum for code reviews & blockers.", href: "/discussions" }
                      ].map((card, ci) => (
                        <Link
                          key={ci}
                          href={card.href}
                          className="p-5 rounded-2xl bg-[#F4F6FB] border border-slate-200 hover:border-[#162774] hover:bg-white transition-all flex flex-col justify-between group shadow-xs"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="font-extrabold text-base text-[#162774] tracking-tight">{card.title}</span>
                              <span className="text-[11px] font-extrabold text-slate-400">0{ci + 1}</span>
                            </div>
                            <p className="text-sm font-medium text-slate-600 leading-relaxed">{card.desc}</p>
                          </div>
                          <div className="mt-4 inline-flex items-center gap-2 text-xs font-extrabold text-[#162774]">
                            <span>Open Page</span>
                            <span className="w-6 h-6 rounded-full bg-[#162774] group-hover:bg-[#D9F83B] text-white group-hover:text-[#162774] flex items-center justify-center transition-colors">
                              <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:rotate-[60deg]" />
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeProfileSection === "activity" && (
                <div className="bg-white border border-slate-200 rounded-[28px] p-6 sm:p-8 mb-8 shadow-sm font-sans space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="inline-block px-3.5 py-1 rounded-full bg-[#F4F6FB] border border-slate-200 text-[#162774] text-xs font-extrabold uppercase tracking-wider mb-2.5">
                        MY ACTIVITY &amp; REGISTRATIONS
                      </span>
                      <h3 className="text-2xl font-extrabold text-[#162774] tracking-tight">
                        Applied Programs, Services &amp; Bookings
                      </h3>
                      <p className="text-sm font-medium text-slate-600 mt-1">
                        Track every service booking, payment receipt, job/training application, and enrolled Arena project in one place.
                      </p>
                    </div>

                    <Link
                      href="/services"
                      className="group inline-flex items-center gap-3 pl-5 pr-2 py-2 rounded-full bg-[#162774] text-white font-bold text-xs sm:text-sm hover:bg-[#1e3494] transition-all shrink-0"
                    >
                      <span>Browse Services</span>
                      <span className="w-7 h-7 rounded-full bg-[#D9F83B] text-[#162774] flex items-center justify-center">
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-[60deg]" />
                      </span>
                    </Link>
                  </div>

                  {/* Service Bookings & Receipts */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#162774]">
                      Service Bookings &amp; Payment Receipts ({serviceBookings.length})
                    </h4>
                    {serviceBookings.length === 0 ? (
                      <div className="p-6 rounded-2xl bg-[#F4F6FB] border border-slate-200 text-sm font-medium text-slate-600">
                        No service bookings yet. Explore Jobs, 1-on-1 Doubt Sessions, Corporate Training, or Expert Project Reviews on{" "}
                        <Link href="/services" className="text-[#162774] font-extrabold underline">
                          Services
                        </Link>
                        .
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {serviceBookings.map((b) => (
                          <div
                            key={b.id}
                            className="p-4 sm:p-5 rounded-2xl bg-[#F4F6FB] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          >
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-full bg-[#162774] text-[#D9F83B] text-[11px] font-extrabold">
                                  {b.category}
                                </span>
                                <span className="px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-[#162774] text-[11px] font-bold">
                                  Receipt: {b.receiptId}
                                </span>
                              </div>
                              <div className="text-base font-extrabold text-[#162774]">
                                {b.serviceTitle}
                              </div>
                              <div className="text-xs font-medium text-slate-600">
                                Paid ₹{b.amount} ({b.paymentStatus}) &bull; {new Date(b.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            <span className="px-3.5 py-1.5 rounded-full bg-[#D9F83B] text-[#162774] text-xs font-extrabold self-start sm:self-center shrink-0">
                              {b.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Hackathon Participations */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#162774]">
                        Hackathon Participations ({hackathonRegistrations.length})
                      </h4>
                      <Link href="/hackathons" className="text-xs font-extrabold text-[#162774] hover:underline">
                        Explore Hackathons &rarr;
                      </Link>
                    </div>
                    {hackathonRegistrations.length === 0 ? (
                      <div className="p-5 rounded-2xl bg-[#F4F6FB] border border-slate-200 text-sm font-medium text-slate-600">
                        You have not participated in any 24-hour hackathon yet.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {hackathonRegistrations.map((h, idx) => (
                          <div
                            key={h.id || idx}
                            className="p-4 sm:p-5 rounded-2xl bg-[#F4F6FB] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          >
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-full bg-[#162774] text-[#D9F83B] text-[11px] font-extrabold uppercase">
                                  {h.mode || "Solo"} Hackathon
                                </span>
                                {h.uniqueCode && (
                                  <span className="px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-[#162774] text-[11px] font-bold">
                                    Code: {h.uniqueCode}
                                  </span>
                                )}
                              </div>
                              <div className="text-base font-extrabold text-[#162774]">
                                {h.projectTitle || "Online Hackathon Track"}
                              </div>
                              <div className="text-xs font-medium text-slate-600">
                                {h.teamName ? `Team: ${h.teamName} • ` : ""}
                                Paid ₹{h.amountPaid || 0} &bull; {h.createdAt ? new Date(h.createdAt).toLocaleDateString() : "Active"}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                              {!h.submitted && (
                                <Link
                                  href={`/hackathons${h.uniqueCode ? `?submitCode=${encodeURIComponent(h.uniqueCode)}` : ""}`}
                                  className="px-4 py-1.5 rounded-full bg-[#162774] hover:bg-[#0d1952] text-[#D9F83B] text-xs font-extrabold transition-colors"
                                >
                                  Submit Project
                                </Link>
                              )}
                              <span className="px-3.5 py-1.5 rounded-full bg-[#D9F83B] text-[#162774] text-xs font-extrabold">
                                {h.submitted ? "Submitted" : "Registered"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Workshop Registrations */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#162774]">
                        Workshop Registrations ({workshopRegistrations.length})
                      </h4>
                      <Link href="/workshops" className="text-xs font-extrabold text-[#162774] hover:underline">
                        Browse Workshops &rarr;
                      </Link>
                    </div>
                    {workshopRegistrations.length === 0 ? (
                      <div className="p-5 rounded-2xl bg-[#F4F6FB] border border-slate-200 text-sm font-medium text-slate-600">
                        You have not registered for any workshop yet.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {workshopRegistrations.map((w, idx) => (
                          <div
                            key={w.id || idx}
                            className="p-4 sm:p-5 rounded-2xl bg-[#F4F6FB] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          >
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-full bg-[#162774] text-[#D9F83B] text-[11px] font-extrabold">
                                  Workshop
                                </span>
                                {w.checkInCode && (
                                  <span className="px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-[#162774] text-[11px] font-bold">
                                    Ticket: {w.checkInCode}
                                  </span>
                                )}
                                {w.invoiceNumber && (
                                  <span className="px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-[#162774] text-[11px] font-bold">
                                    {w.invoiceNumber}
                                  </span>
                                )}
                              </div>
                              <div className="text-base font-extrabold text-[#162774]">
                                {w.track || w.workshopTitle || "Botmartz Workshop"}
                              </div>
                              <div className="text-xs font-medium text-slate-600">
                                {w.amount > 0 ? `Paid ₹${w.amount}` : "Free Registration"} &bull; {w.createdAt ? new Date(w.createdAt).toLocaleDateString() : "Confirmed"}
                              </div>
                            </div>
                            <span className="px-3.5 py-1.5 rounded-full bg-[#D9F83B] text-[#162774] text-xs font-extrabold self-start sm:self-center shrink-0">
                              {w.status || "Confirmed"}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Enrolled Projects Summary */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#162774]">
                      Enrolled Arena Systems ({enrolledProjects.length})
                    </h4>
                    {enrolledProjects.length === 0 ? (
                      <div className="p-6 rounded-2xl bg-[#F4F6FB] border border-slate-200 text-sm font-medium text-slate-600">
                        You have not enrolled in any Arena PRD track yet.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {enrolledProjects.map((ep, idx) => (
                          <div
                            key={ep.id || idx}
                            className="p-4 rounded-2xl bg-[#F4F6FB] border border-slate-200 flex items-center justify-between gap-3"
                          >
                            <div className="min-w-0">
                              <div className="text-sm font-extrabold text-[#162774] truncate">
                                {ep.projectTitle || ep.projectId}
                              </div>
                              <div className="text-xs font-medium text-slate-600">
                                Status: {ep.status || "Active"}
                              </div>
                            </div>
                            <Link
                              href={`/arena/${ep.projectId}`}
                              className="px-3 py-1.5 rounded-full bg-[#162774] text-[#D9F83B] text-xs font-extrabold shrink-0"
                            >
                              Open
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeProfileSection === "wallet" && (
                <div className="space-y-6 font-sans">
                  {/* Balance & Stats Card */}
                  <div className="bg-[#162774] text-white border border-white/15 rounded-[28px] p-6 sm:p-8 shadow-xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-2">
                        <span className="inline-block px-3.5 py-1 rounded-full bg-[#D9F83B] text-[#162774] text-xs font-extrabold uppercase tracking-wider">
                          Botmartz Karma Wallet
                        </span>
                        <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                          {walletData?.balance ?? coins} <span className="text-[#D9F83B] text-xl">Karma Coins</span>
                        </div>
                        <p className="text-sm font-medium text-white/85">
                          Earn coins via daily GitHub commits, LinkedIn posts &amp; discussions — redeem for founder clinics, swag &amp; referrals.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 shrink-0">
                        <div className="px-4 py-3 rounded-2xl bg-white/10 border border-white/15 text-center">
                          <div className="text-[11px] font-bold uppercase text-white/75">Lifetime Earned</div>
                          <div className="text-lg font-extrabold text-[#D9F83B]">+{walletData?.totalEarned ?? coins}</div>
                        </div>
                        <div className="px-4 py-3 rounded-2xl bg-white/10 border border-white/15 text-center">
                          <div className="text-[11px] font-bold uppercase text-white/75">Level</div>
                          <div className="text-lg font-extrabold text-white">Lv {walletData?.reputationLevel ?? 1}</div>
                        </div>
                        <Link
                          href="/arena/wallet"
                          className="group pl-5 pr-2 py-2.5 rounded-full bg-[#D9F83B] hover:bg-white text-[#162774] font-extrabold text-xs sm:text-sm inline-flex items-center gap-2.5 transition-all"
                        >
                          <span>Buy Packs / Tip</span>
                          <span className="w-7 h-7 rounded-full bg-[#162774] text-[#D9F83B] flex items-center justify-center">
                            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-[60deg]" />
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Redeemable Perks */}
                  <div className="bg-white border border-slate-200 rounded-[28px] p-6 sm:p-8 shadow-sm space-y-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <span className="inline-block px-3.5 py-1 rounded-full bg-[#F4F6FB] border border-slate-200 text-[#162774] text-xs font-extrabold uppercase tracking-wider mb-2">
                          Redeem Perks
                        </span>
                        <h3 className="text-2xl font-extrabold text-[#162774] tracking-tight">
                          Redeemable Perks &amp; Grants
                        </h3>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {[
                        { id: "perk_1", title: "1-on-1 Founder Technical Clinic", cost: 300, badge: "Founder Clinic", desc: "20-minute architecture teardown with Founder Soham Sharma." },
                        { id: "perk_4", title: "Mock System Design Technical Interview", cost: 400, badge: "Interview Prep", desc: "45-minute live technical interview simulation with feedback report." },
                        { id: "perk_5", title: "Cloud GPU & Compute Credits Grant", cost: 500, badge: "Cloud Credits", desc: "$50 AWS / Qdrant cloud credits grant for container deployments." },
                        { id: "perk_3", title: "Official Botmartz Builder Swag & Roadmap Book", cost: 800, badge: "Physical Swag", desc: "Printed AI & Systems Roadmap + Official Builder Tee." },
                        { id: "perk_2", title: "Priority Portfolio Feature & Founder Recommendation", cost: 1000, badge: "Portfolio Feature", desc: "Featured showcase + personalized LinkedIn recommendation." },
                      ].map((perk) => {
                        const bal = walletData?.balance ?? coins;
                        const canAfford = bal >= perk.cost;
                        return (
                          <div
                            key={perk.id}
                            className="p-4 sm:p-5 rounded-2xl bg-[#F4F6FB] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-extrabold text-[#162774] text-base">{perk.title}</span>
                                <span className="px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-[#162774] text-[11px] font-bold">
                                  {perk.badge}
                                </span>
                              </div>
                              <p className="text-sm font-medium text-slate-600">{perk.desc}</p>
                            </div>

                            <button
                              type="button"
                              disabled={redeemingPerkId === perk.id}
                              onClick={() => handleRedeemPerk(perk)}
                              className={`group pl-4 pr-2 py-2 rounded-full font-extrabold text-xs sm:text-sm transition-all cursor-pointer shrink-0 inline-flex items-center gap-2.5 ${
                                canAfford
                                  ? "bg-[#162774] text-[#D9F83B] hover:bg-[#0d1952]"
                                  : "bg-white text-[#162774] border border-slate-200 hover:bg-[#162774] hover:text-white"
                              }`}
                            >
                              <span>{redeemingPerkId === perk.id ? "Redeeming..." : `Redeem ${perk.cost} Coins`}</span>
                              <span className="w-7 h-7 rounded-full bg-[#D9F83B] text-[#162774] flex items-center justify-center">
                                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-[60deg]" />
                              </span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recent Karma Transactions */}
                  <div className="bg-white border border-slate-200 rounded-[28px] p-6 sm:p-8 shadow-sm space-y-4">
                    <h3 className="text-xl font-extrabold text-[#162774] tracking-tight">
                      Recent Karma Activity ({walletTransactions.length})
                    </h3>
                    {walletTransactions.length === 0 ? (
                      <div className="p-5 rounded-2xl bg-[#F4F6FB] border border-slate-200 text-sm font-medium text-slate-600">
                        Your welcome +100 Karma Coins are active. Log daily GitHub commits at{" "}
                        <Link href="/arena/daily-log" className="text-[#162774] font-extrabold underline">
                          Daily PoW Log
                        </Link>{" "}
                        to earn +20 to +70 Coins every day!
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {walletTransactions.map((tx: any, idx: number) => (
                          <div
                            key={tx.id || idx}
                            className="p-4 rounded-2xl bg-[#F4F6FB] border border-slate-200 flex items-center justify-between gap-3"
                          >
                            <div>
                              <div className="text-sm font-extrabold text-[#162774]">{tx.reason || tx.type}</div>
                              <div className="text-xs font-medium text-slate-500">
                                {tx.timestamp ? new Date(tx.timestamp).toLocaleDateString() : ""}
                              </div>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                                tx.type === "SPEND"
                                  ? "bg-rose-100 text-rose-700"
                                  : "bg-[#162774] text-[#D9F83B]"
                              }`}
                            >
                              {tx.type === "SPEND" ? `-${tx.amount}` : `+${tx.amount}`} Coins
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

      </div>

      {/* =========================================================================
          UNIVERSAL EDIT PROFILE MODAL (STUDENTS & PROFESSIONALS WORLDWIDE)
      ========================================================================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl max-w-xl lg:max-w-2xl w-full max-h-[90vh] sm:max-h-[86vh] flex flex-col relative text-slate-900 overflow-hidden">

            {/* Modal Header (Fixed at top) */}
            <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-slate-100 flex items-start justify-between bg-white shrink-0">
              <div>
                <div className="text-[10px] sm:text-[11px] font-mono text-[#0066FF] font-bold uppercase tracking-wider mb-0.5 flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-emerald-600" />
                  <span>Universal Builder Profile</span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 font-sans tracking-tight">
                  Edit Profile &amp; Verification
                </h3>
                <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                  Update your identity, university / company credentials, and public developer handles.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0 -mr-1"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form id="profile-edit-form" onSubmit={handleSaveProfile} className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-4 font-mono text-xs">

              {editSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>{editSuccessMsg}</span>
                </div>
              )}

              {editErrorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-mono text-xs flex items-center gap-2">
                  <AlertCircle size={15} className="text-rose-600 shrink-0" />
                  <span>{editErrorMsg}</span>
                </div>
              )}

              {/* Persona Selector */}
              <div>
                <label className="block text-[11px] text-slate-700 font-bold uppercase tracking-wider mb-1.5">Builder Persona *</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, personaType: "STUDENT" })}
                    className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer font-sans ${formData.personaType === "STUDENT"
                      ? "bg-blue-50 border-[#0066FF] text-[#0066FF] font-bold shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                  >
                    <GraduationCap size={15} className="mx-auto mb-0.5" />
                    <span className="text-[11px] block leading-tight">Student</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, personaType: "WORKING_PROFESSIONAL" })}
                    className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer font-sans ${formData.personaType === "WORKING_PROFESSIONAL"
                      ? "bg-blue-50 border-[#0066FF] text-[#0066FF] font-bold shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                  >
                    <Briefcase size={15} className="mx-auto mb-0.5" />
                    <span className="text-[11px] block leading-tight">Professional</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, personaType: "FOUNDER_BUILDER" })}
                    className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer font-sans ${formData.personaType === "FOUNDER_BUILDER"
                      ? "bg-blue-50 border-[#0066FF] text-[#0066FF] font-bold shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                  >
                    <Building size={15} className="mx-auto mb-0.5" />
                    <span className="text-[11px] block leading-tight">Founder / Solo</span>
                  </button>
                </div>
              </div>

              {/* Name & Handle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-700 font-bold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    placeholder="e.g. Soham Sharma"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-700 font-bold mb-1">Username / Public @handle *</label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "") })}
                    placeholder="e.g. rahul_ai"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF] transition-colors"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-[11px] text-slate-700 font-bold mb-1">Short Bio</label>
                <input
                  type="text"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="e.g. Fullstack AI Engineer developing multi-agent LangGraph architectures."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF] transition-colors"
                />
              </div>

              {/* ── CONDITIONAL SECTION: STUDENT ── */}
              {formData.personaType === "STUDENT" && (
                <div className="p-3.5 sm:p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2.5">
                  <div className="font-bold text-[#0066FF] font-sans text-xs flex items-center gap-1.5">
                    <GraduationCap size={14} />
                    <span>University &amp; Academic Credentials</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] text-slate-700 font-bold mb-1">College / University *</label>
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
                      <label className="block text-[11px] text-slate-700 font-bold mb-1">Student Roll / Enrollment No *</label>
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
                      <label className="block text-[11px] text-slate-700 font-bold mb-1">Custom College Name &amp; City *</label>
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] text-slate-700 font-bold mb-1">Degree &amp; Branch</label>
                      <input
                        type="text"
                        value={formData.degreeBranch}
                        onChange={(e) => setFormData({ ...formData, degreeBranch: e.target.value })}
                        placeholder="e.g. B.Tech Computer Science / MCA"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0066FF]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-700 font-bold mb-1">Graduation Year *</label>
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
                <div className="p-3.5 sm:p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2.5">
                  <div className="font-bold text-indigo-700 font-sans text-xs flex items-center gap-1.5">
                    <Briefcase size={14} />
                    <span>Company &amp; Professional Experience</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] text-slate-700 font-bold mb-1">Company / Organization *</label>
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
                      <label className="block text-[11px] text-slate-700 font-bold mb-1">Designation / Role *</label>
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
                      <label className="block text-[11px] text-slate-700 font-bold mb-1">Custom Company / Startup Name *</label>
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] text-slate-700 font-bold mb-1">Years of Experience</label>
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
                      <label className="block text-[11px] text-slate-700 font-bold mb-1">Domain Focus</label>
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] text-slate-700 font-bold mb-1">Country *</label>
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
                  <label className="block text-[11px] text-slate-700 font-bold mb-1">City / Region *</label>
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
                  <label className="block text-[11px] text-slate-700 font-bold mb-1">Timezone *</label>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] text-slate-700 font-bold mb-1">GitHub Username *</label>
                  <div className="relative">
                    <Github className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                    <input
                      type="text"
                      required
                      value={formData.githubUsername}
                      onChange={(e) => setFormData({ ...formData, githubUsername: e.target.value })}
                      placeholder="github_handle"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-700 font-bold mb-1">LinkedIn Profile URL *</label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                    <input
                      type="url"
                      value={formData.linkedinUrl}
                      onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                    />
                  </div>
                </div>
              </div>

              {/* Specialization */}
              <div>
                <label className="block text-[11px] text-slate-700 font-bold mb-1">AI Specialization Track</label>
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
              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer text-slate-700 text-[11px] font-sans">
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
            </form>

            {/* Modal Footer (Fixed at bottom) */}
            <div className="px-5 sm:px-6 py-3.5 border-t border-slate-100 bg-slate-50/90 flex items-center justify-end gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="profile-edit-form"
                disabled={savingProfile}
                className="px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-xs transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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

          </div>
        </div>
      )}

      {/* LinkedIn UGC Share Modal */}
      <LinkedInShareModal
        isOpen={shareModalData.isOpen}
        onClose={() => setShareModalData((prev) => ({ ...prev, isOpen: false }))}
        candidateName={studentProfile?.displayName || user?.displayName || "Candidate Builder"}
        projectTitle={shareModalData.projectTitle || "45-Day Virtual AI Internship"}
        certificateId={shareModalData.certId || "CERT-BM-982314"}
        verificationUrl={typeof window !== "undefined" ? `${window.location.origin}/certificates?query=${shareModalData.certId}` : `https://community.botmartz.com/certificates?query=${shareModalData.certId}`}
        earnedBadges={claimedBadges.length > 0 ? claimedBadges : ["10-Day Streak", "Foundations & AI"]}
      />
    </div>
  );
}
