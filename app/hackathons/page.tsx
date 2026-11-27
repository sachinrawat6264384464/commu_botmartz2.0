"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import {
  ArrowRight,
  ChevronDown,
  Check,
  Copy,
  Loader2,
  X,
  CheckCircle2,
} from "lucide-react";
import {
  HackathonProject,
  SOLO_HACKATHON_FEE,
  TEAM_HACKATHON_FEE,
} from "@/lib/hackathons";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function HackathonsPage() {
  const router = useRouter();
  const { user, studentProfile } = useAuth();
  const [projects, setProjects] = useState<HackathonProject[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [modeFilter, setModeFilter] = useState<"all" | "solo" | "team">("all");
  const [domainMenuOpen, setDomainMenuOpen] = useState(false);
  const domainMenuRef = useRef<HTMLDivElement>(null);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (domainMenuRef.current && !domainMenuRef.current.contains(e.target as Node)) {
        setDomainMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Enrollment Modal State (No Account Required)
  const [enrollProject, setEnrollProject] = useState<HackathonProject | null>(null);
  const [mode, setMode] = useState<"solo" | "team">("solo");
  const [teamName, setTeamName] = useState("");
  const [leaderName, setLeaderName] = useState("");
  const [leaderEmail, setLeaderEmail] = useState("");
  const [leaderPhone, setLeaderPhone] = useState("");
  const [leaderOrg, setLeaderOrg] = useState("");
  const [leaderGithub, setLeaderGithub] = useState("");
  const [member2Name, setMember2Name] = useState("");
  const [member2Email, setMember2Email] = useState("");
  const [member3Name, setMember3Name] = useState("");
  const [member3Email, setMember3Email] = useState("");
  const [enrollError, setEnrollError] = useState("");
  const [paying, setPaying] = useState(false);
  const [enrolledReceipt, setEnrolledReceipt] = useState<any>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Submission Section State
  const [subUniqueCode, setSubUniqueCode] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [verifiedReg, setVerifiedReg] = useState<any>(null);
  const [subTeamName, setSubTeamName] = useState("");
  const [subProjectTitle, setSubProjectTitle] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [deployedUrl, setDeployedUrl] = useState("");
  const [subNotes, setSubNotes] = useState("");
  const [submittingProject, setSubmittingProject] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccessPopup, setSubmitSuccessPopup] = useState<any>(null);

  useEffect(() => {
    fetch("/api/hackathons")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.projects)) {
          setProjects(data.projects);
        }
      })
      .catch((err) => console.error("Failed to load hackathons:", err))
      .finally(() => setLoadingProjects(false));
  }, []);

  const domains = useMemo(() => {
    return Array.from(new Set(projects.map((p) => p.domain))).sort();
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (selectedDomain !== "All" && p.domain !== selectedDomain) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = p.title.toLowerCase().includes(q);
        const inDomain = p.domain.toLowerCase().includes(q);
        const inStack = (p.techStack || []).some((t) => t.toLowerCase().includes(q));
        if (!inTitle && !inDomain && !inStack) return false;
      }
      return true;
    });
  }, [projects, selectedDomain, searchQuery]);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    if (user || studentProfile) {
      setLeaderName((prev) => prev || studentProfile?.displayName || user?.displayName || "");
      setLeaderEmail((prev) => prev || studentProfile?.email || user?.email || "");
    }
  }, [user, studentProfile]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const codeParam = params.get("submitCode");
      if (codeParam && user) {
        setSubUniqueCode(codeParam);
        setSubmitModalOpen(true);
      }
    }
  }, [user]);

  const openSubmitWithAuth = () => {
    if (!user) {
      router.push("/login?mode=signin&redirect=/hackathons");
      return;
    }
    setSubmitModalOpen(true);
  };

  const openEnrollModal = (project: HackathonProject, initialMode: "solo" | "team" = "solo") => {
    if (!user) {
      router.push("/login?mode=signin&redirect=/hackathons");
      return;
    }
    setEnrollProject(project);
    setMode(initialMode);
    setEnrollError("");
    setEnrolledReceipt(null);
  };

  const handleEnrollAndPay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollProject) return;
    setEnrollError("");

    if (!leaderName.trim() || !leaderEmail.trim() || !leaderPhone.trim()) {
      setEnrollError("Please fill in Leader Name, Email, and Mobile Number.");
      return;
    }

    const membersPayload: Array<{ name: string; email: string; role: string }> = [
      { name: leaderName.trim(), email: leaderEmail.trim(), role: mode === "team" ? "Team Leader" : "Solo Builder" },
    ];

    if (mode === "team") {
      if (!teamName.trim()) {
        setEnrollError("Team Name is required for Team Hackathon.");
        return;
      }
      if (!member2Name.trim() || !member2Email.trim()) {
        setEnrollError("Team requires at least 2 members (Leader + Member 2).");
        return;
      }
      membersPayload.push({ name: member2Name.trim(), email: member2Email.trim(), role: "Member 2" });
      if (member3Name.trim() || member3Email.trim()) {
        if (!member3Name.trim() || !member3Email.trim()) {
          setEnrollError("Please enter both Name and Email for Member 3, or leave both blank.");
          return;
        }
        membersPayload.push({ name: member3Name.trim(), email: member3Email.trim(), role: "Member 3" });
      }
    }

    setPaying(true);
    try {
      const orderRes = await fetch("/api/hackathons/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: enrollProject.id,
          projectTitle: enrollProject.title,
          mode,
          teamName: mode === "team" ? teamName.trim() : leaderName.trim(),
          leader: {
            name: leaderName.trim(),
            email: leaderEmail.trim(),
            phone: leaderPhone.trim(),
            organization: leaderOrg.trim(),
            github: leaderGithub.trim(),
          },
          members: membersPayload,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || "Could not initialize payment.");
      }

      const completeVerification = async (paymentIds: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        const verifyRes = await fetch("/api/hackathons/verify-and-enroll", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...paymentIds,
            projectId: enrollProject.id,
            projectTitle: enrollProject.title,
            mode,
            teamName: mode === "team" ? teamName.trim() : leaderName.trim(),
            leader: {
              name: leaderName.trim(),
              email: leaderEmail.trim(),
              phone: leaderPhone.trim(),
              organization: leaderOrg.trim(),
              github: leaderGithub.trim(),
            },
            members: membersPayload,
          }),
        });
        const verifyData = await verifyRes.json();
        if (!verifyRes.ok || !verifyData.success) {
          throw new Error(verifyData.error || "Payment verification failed.");
        }
        setEnrolledReceipt(verifyData.registration);
        setPaying(false);
      };

      if (orderData.isDevMock) {
        await completeVerification({
          razorpay_order_id: orderData.orderId,
          razorpay_payment_id: `pay_hack_mock_${Date.now()}`,
          razorpay_signature: "mock_sig",
        });
        return;
      }

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        throw new Error("Razorpay SDK failed to load. Please check your internet connection.");
      }

      const rzp = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Botmartz Online Hackathons",
        description: `${mode === "team" ? "Team (2-3)" : "Solo"} Entry — ${enrollProject.title}`,
        order_id: orderData.orderId,
        prefill: {
          name: leaderName.trim(),
          email: leaderEmail.trim(),
          contact: leaderPhone.trim(),
        },
        theme: { color: "#1D3189" },
        handler: async (response: any) => {
          try {
            await completeVerification({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
          } catch (err: any) {
            setEnrollError(err.message || "Verification failed.");
            setPaying(false);
          }
        },
        modal: {
          ondismiss: () => {
            setPaying(false);
          },
        },
      });
      rzp.open();
    } catch (err: any) {
      setEnrollError(err.message || "Enrollment failed.");
      setPaying(false);
    }
  };

  const handleLookupUniqueCode = async (codeToLookup?: string) => {
    const clean = (codeToLookup ?? subUniqueCode).trim().toUpperCase();
    setLookupError("");
    setVerifiedReg(null);
    setSubTeamName("");
    setSubProjectTitle("");

    if (!clean) {
      setLookupError("Please enter your Unique ID first.");
      return;
    }

    setLookupLoading(true);
    try {
      const res = await fetch("/api/hackathons/lookup-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uniqueCode: clean }),
      });
      const data = await res.json();
      if (!res.ok || !data.valid) {
        setLookupError(data.error || "Invalid or expired Unique ID.");
        return;
      }

      setVerifiedReg(data.registration);
      setSubTeamName(data.registration.teamName || data.registration.leaderName || "");
      setSubProjectTitle(data.registration.projectTitle || "");
      if (data.alreadySubmitted) {
        setLookupError("A project has already been submitted for this Unique ID.");
      }
    } catch (err: any) {
      setLookupError(err.message || "Could not verify Unique ID.");
    } finally {
      setLookupLoading(false);
    }
  };

  // Auto-lookup when a full BM-HACK-XXXXXX code (14 chars) is entered
  useEffect(() => {
    const clean = subUniqueCode.trim().toUpperCase();
    if (/^BM-HACK-[A-Z0-9]{6}$/.test(clean)) {
      handleLookupUniqueCode(clean);
    } else {
      setVerifiedReg(null);
      setSubTeamName("");
      setSubProjectTitle("");
      setLookupError("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subUniqueCode]);

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!verifiedReg) {
      setSubmitError("Please enter a valid, non-expired Unique ID first.");
      return;
    }

    setSubmittingProject(true);
    try {
      const res = await fetch("/api/hackathons/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uniqueCode: subUniqueCode.trim().toUpperCase(),
          githubUrl: githubUrl.trim(),
          deployedUrl: deployedUrl.trim(),
          notes: subNotes.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Submission failed.");
      }

      setSubmitModalOpen(false);
      setSubmitSuccessPopup(data.submission);
      setGithubUrl("");
      setDeployedUrl("");
      setSubNotes("");
    } catch (err: any) {
      setSubmitError(err.message || "Could not submit project.");
    } finally {
      setSubmittingProject(false);
    }
  };

  return (
    <div
      className="bg-white min-h-screen text-slate-900 pt-24 pb-24 font-sans selection:bg-[#D9F83B] selection:text-slate-950"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(29, 49, 137, 0.11) 1px, transparent 1px), linear-gradient(to bottom, rgba(29, 49, 137, 0.11) 1px, transparent 1px)",
        backgroundSize: "72px 72px",
      }}
    >
      {/* ── 1. HERO SECTION ── */}
      <section className="w-full px-4 sm:px-8 lg:px-12 mb-10">
        <div
          className="relative overflow-hidden rounded-3xl bg-[#162774] p-7 sm:p-11 border border-white/15 shadow-2xl"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        >
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-sans leading-tight">
                Ship Real Systems in 24 Hours &amp; Unlock Direct Job Screening
              </h1>

              <p className="text-sm sm:text-base text-blue-100/85 font-sans leading-relaxed max-w-2xl">
                Pick a production problem statement, enroll as a Solo Builder or a Team of 2–3, receive your 24-hour Unique ID via email, and submit your live GitHub &amp; deployed build.
              </p>

              {/* 4 Editorial Perks & Rules Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="group/stat relative overflow-hidden p-3.5 rounded-2xl bg-white/[0.06] border border-white/15 hover:border-white cursor-pointer transition-all duration-500">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-white -translate-y-full group-hover/stat:translate-y-0 transition-transform duration-700 ease-in-out"
                  />
                  <span className="absolute top-2.5 right-2.5 z-10 w-6 h-6 rounded-full bg-white group-hover/stat:bg-[#162774] text-[#162774] group-hover/stat:text-white font-extrabold text-[10px] flex items-center justify-center shadow-xs select-none transition-colors duration-500">01</span>
                  <div className="relative z-10 text-white group-hover/stat:text-slate-950 font-extrabold text-base transition-colors duration-500">₹{SOLO_HACKATHON_FEE}</div>
                  <div className="relative z-10 text-blue-200/85 group-hover/stat:text-[#1D3189] text-[11px] font-semibold transition-colors duration-500">Solo Builder Entry</div>
                </div>

                <div className="group/stat relative overflow-hidden p-3.5 rounded-2xl bg-white/[0.06] border border-white/15 hover:border-white cursor-pointer transition-all duration-500">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-white -translate-y-full group-hover/stat:translate-y-0 transition-transform duration-700 ease-in-out"
                  />
                  <span className="absolute top-2.5 right-2.5 z-10 w-6 h-6 rounded-full bg-white group-hover/stat:bg-[#162774] text-[#162774] group-hover/stat:text-white font-extrabold text-[10px] flex items-center justify-center shadow-xs select-none transition-colors duration-500">02</span>
                  <div className="relative z-10 text-white group-hover/stat:text-slate-950 font-extrabold text-base transition-colors duration-500">₹{TEAM_HACKATHON_FEE}</div>
                  <div className="relative z-10 text-blue-200/85 group-hover/stat:text-[#1D3189] text-[11px] font-semibold transition-colors duration-500">Team (2–3 Members)</div>
                </div>

                <div className="group/stat relative overflow-hidden p-3.5 rounded-2xl bg-white/[0.06] border border-white/15 hover:border-white cursor-pointer transition-all duration-500">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-white -translate-y-full group-hover/stat:translate-y-0 transition-transform duration-700 ease-in-out"
                  />
                  <span className="absolute top-2.5 right-2.5 z-10 w-6 h-6 rounded-full bg-white group-hover/stat:bg-[#162774] text-[#162774] group-hover/stat:text-white font-extrabold text-[10px] flex items-center justify-center shadow-xs select-none transition-colors duration-500">03</span>
                  <div className="relative z-10 text-white group-hover/stat:text-slate-950 font-extrabold text-base transition-colors duration-500">24 Hours</div>
                  <div className="relative z-10 text-blue-200/85 group-hover/stat:text-slate-600 text-[11px] font-semibold transition-colors duration-500">Unique ID Validity</div>
                </div>

                <div className="group/stat relative overflow-hidden p-3.5 rounded-2xl bg-white/[0.06] border border-white/15 hover:border-white cursor-pointer transition-all duration-500">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-white -translate-y-full group-hover/stat:translate-y-0 transition-transform duration-700 ease-in-out"
                  />
                  <span className="absolute top-2.5 right-2.5 z-10 w-6 h-6 rounded-full bg-white group-hover/stat:bg-[#162774] text-[#162774] group-hover/stat:text-white font-extrabold text-[10px] flex items-center justify-center shadow-xs select-none transition-colors duration-500">04</span>
                  <div className="relative z-10 text-white group-hover/stat:text-slate-950 font-extrabold text-base transition-colors duration-500">Job Track</div>
                  <div className="relative z-10 text-blue-200/85 group-hover/stat:text-slate-600 text-[11px] font-semibold transition-colors duration-500">Screening &amp; Referral</div>
                </div>
              </div>
            </div>

            {/* Right Column: 1st/2nd/3rd Winner Trophies & Highlighted Builder Perks */}
            <div className="lg:col-span-4 space-y-3">
              <div className="p-4 sm:p-5 rounded-3xl bg-white text-slate-950 border-2 border-[#D9F83B] shadow-2xl space-y-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#162774] text-[#D9F83B] text-[10px] font-extrabold uppercase tracking-wider">
                    What Every Eligible Builder Gets
                  </span>
                </div>

                {/* 1st / 2nd / 3rd Winner Trophies Podium Visual */}
                <div className="grid grid-cols-3 gap-2 items-end pt-1">
                  {/* 2nd Place - Silver Trophy */}
                  <div className="p-2.5 rounded-2xl bg-[#F4F6FB] border border-slate-200 text-center space-y-1">
                    <svg viewBox="0 0 48 48" className="w-9 h-9 mx-auto" fill="none" aria-hidden="true">
                      <defs>
                        <linearGradient id="silverCup" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#E2E8F0" />
                          <stop offset="50%" stopColor="#94A3B8" />
                          <stop offset="100%" stopColor="#64748B" />
                        </linearGradient>
                      </defs>
                      <path d="M14 8H34V18C34 23.5 29.5 28 24 28C18.5 28 14 23.5 14 18V8Z" fill="url(#silverCup)" />
                      <path d="M14 11H9C9 16 11 19 14 19M34 11H39C39 16 37 19 34 19" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
                      <rect x="21" y="28" width="6" height="8" rx="1" fill="#64748B" />
                      <rect x="15" y="36" width="18" height="5" rx="2" fill="#162774" />
                      <text x="24" y="20" textAnchor="middle" fill="#0F172A" fontSize="9" fontWeight="800">2nd</text>
                    </svg>
                    <div className="text-[10px] font-extrabold text-[#162774]">2nd Winner</div>
                    <div className="text-[9px] font-semibold text-slate-600 leading-tight">Letter + Cert</div>
                  </div>

                  {/* 1st Place - Gold Trophy */}
                  <div className="p-2.5 rounded-2xl bg-[#162774] text-white border-2 border-[#D9F83B] text-center space-y-1 shadow-md -mt-2">
                    <svg viewBox="0 0 48 48" className="w-11 h-11 mx-auto" fill="none" aria-hidden="true">
                      <defs>
                        <linearGradient id="goldCup" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#FEF08A" />
                          <stop offset="50%" stopColor="#FACC15" />
                          <stop offset="100%" stopColor="#CA8A04" />
                        </linearGradient>
                      </defs>
                      <path d="M13 7H35V18C35 24 30 29 24 29C18 29 13 24 13 18V7Z" fill="url(#goldCup)" />
                      <path d="M13 10H8C8 15.5 10 19 13 19M35 10H40C40 15.5 38 19 35 19" stroke="#FACC15" strokeWidth="2.5" strokeLinecap="round" />
                      <rect x="21" y="29" width="6" height="7" rx="1" fill="#CA8A04" />
                      <rect x="14" y="36" width="20" height="5" rx="2" fill="#D9F83B" />
                      <text x="24" y="20" textAnchor="middle" fill="#0F172A" fontSize="9.5" fontWeight="900">1st</text>
                    </svg>
                    <div className="text-[10px] font-extrabold text-[#D9F83B]">1st Winner</div>
                    <div className="text-[9px] font-semibold text-blue-100 leading-tight">Job Screening</div>
                  </div>

                  {/* 3rd Place - Bronze Trophy */}
                  <div className="p-2.5 rounded-2xl bg-[#F4F6FB] border border-slate-200 text-center space-y-1">
                    <svg viewBox="0 0 48 48" className="w-9 h-9 mx-auto" fill="none" aria-hidden="true">
                      <defs>
                        <linearGradient id="bronzeCup" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#FDBA74" />
                          <stop offset="50%" stopColor="#EA580C" />
                          <stop offset="100%" stopColor="#9A3412" />
                        </linearGradient>
                      </defs>
                      <path d="M14 8H34V18C34 23.5 29.5 28 24 28C18.5 28 14 23.5 14 18V8Z" fill="url(#bronzeCup)" />
                      <path d="M14 11H9C9 16 11 19 14 19M34 11H39C39 16 37 19 34 19" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" />
                      <rect x="21" y="28" width="6" height="8" rx="1" fill="#9A3412" />
                      <rect x="15" y="36" width="18" height="5" rx="2" fill="#162774" />
                      <text x="24" y="20" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="800">3rd</text>
                    </svg>
                    <div className="text-[10px] font-extrabold text-[#162774]">3rd Winner</div>
                    <div className="text-[9px] font-semibold text-slate-600 leading-tight">Verified Cert</div>
                  </div>
                </div>

                {/* Highlighted Perk Rows */}
                <div className="space-y-2 pt-0.5">
                  {[
                    { num: "01", text: "Verified Online Hackathon Certificate" },
                    { num: "02", text: "Founder Recommendation Letter for Job Applications" },
                    { num: "03", text: "Solo & Team Eligibility for Direct Job Screening Round" },
                  ].map((perk) => (
                    <div
                      key={perk.num}
                      className="flex items-center gap-2.5 p-2 rounded-xl bg-[#F4F6FB] border border-slate-200/80 border-l-3 border-l-[#162774]"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#162774] text-[#D9F83B] text-[9px] font-extrabold flex items-center justify-center shrink-0">
                        {perk.num}
                      </span>
                      <span className="text-[11px] font-bold text-slate-900 leading-snug">
                        {perk.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={openSubmitWithAuth}
                className="relative overflow-hidden w-full px-6 py-3.5 rounded-2xl bg-[#D9F83B] text-slate-950 font-bold text-sm transition-all flex items-center justify-between group cursor-pointer shadow-lg shadow-lime-400/20"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-white -translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out"
                />
                <span className="relative z-10">Already Have a Unique ID? Submit Project</span>
                <span className="relative z-10 w-7 h-7 rounded-full bg-slate-950 text-[#D9F83B] flex items-center justify-center transition-transform duration-300 group-hover:rotate-[60deg]">
                  <ArrowRight size={14} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. HOW IT WORKS + SOLO VS TEAM TIERS ── */}
      <section className="w-full px-4 sm:px-8 lg:px-12 mb-10 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {[
            {
              num: "01",
              eyebrow: "Step 01 • Instant Entry",
              title: "Pick Project & Pay (No Login)",
              desc: `Choose any live hackathon challenge below. Select Solo (₹${SOLO_HACKATHON_FEE}) or Team (₹${TEAM_HACKATHON_FEE}, 2–3 members) and complete Razorpay checkout.`,
              tag: "Zero-Account Razorpay Entry",
              initial: { opacity: 0, x: -45, y: 0, filter: "blur(8px)" },
            },
            {
              num: "02",
              eyebrow: "Step 02 • 24-Hour Unique ID",
              title: "Unique Code Sent to Leader Email",
              desc: "Your team/solo entry is stored in that project's dedicated database table with a Unique ID valid for strictly 24 hours.",
              tag: "Instant Email Code Dispatch",
              initial: { opacity: 0, x: 0, y: 36, filter: "blur(8px)" },
            },
            {
              num: "03",
              eyebrow: "Step 03 • Ship & Screen",
              title: "Submit GitHub & Live Link",
              desc: "Enter your Unique ID below to auto-fetch your team name, submit your working GitHub & deployed URL, and receive results within 24 hours.",
              tag: "Direct Job Screening Track",
              initial: { opacity: 0, x: 45, y: 0, filter: "blur(8px)" },
            },
          ].map((step, idx) => (
            <motion.div
              key={step.num}
              initial={step.initial}
              whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, delay: idx * 0.1, ease: "easeOut" }}
              className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 border-l-4 border-l-[#162774] hover:border-[#162774] shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between group"
            >
              <div className="p-3 sm:p-6 pb-3 sm:pb-4">
                <div className="flex items-center justify-between gap-1.5 sm:gap-2 mb-2 sm:mb-2.5">
                  <div className="text-[9px] sm:text-xs font-extrabold text-[#1D3189] uppercase tracking-wider leading-tight">
                    {step.eyebrow}
                  </div>
                  <span className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-[#162774] group-hover:bg-[#1D3189] text-white font-extrabold text-[9px] sm:text-[11px] flex items-center justify-center transition-colors duration-500 shrink-0 shadow-xs">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-xs sm:text-lg font-extrabold text-slate-950 group-hover:text-[#1D3189] transition-colors duration-300 mb-1 sm:mb-1.5 leading-snug line-clamp-2">
                  {step.title}
                </h3>
                <p className="text-[10.5px] sm:text-[13px] text-slate-700 leading-snug sm:leading-relaxed font-medium line-clamp-3">
                  {step.desc}
                </p>
              </div>

              <div className="relative overflow-hidden px-3 py-2.5 sm:px-6 sm:py-3.5 border-t border-slate-100 group-hover:border-[#162774] bg-slate-50/70 flex items-center justify-between gap-1.5 transition-colors duration-500">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[#162774] -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                  }}
                />
                <span className="relative z-10 text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-[#1D3189] group-hover:text-white transition-colors duration-500 truncate">
                  {step.tag}
                </span>
                <span className="relative z-10 w-6 h-6 rounded-full bg-white text-[#162774] flex items-center justify-center transition-all duration-500 group-hover:rotate-45 shadow-2xs">
                  <ArrowRight size={12} />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 3. SEARCH & FILTER BAR (SOLO/TEAM + DOMAIN PILLS + SUBMIT TRIGGER) ── */}
      <section className="w-full px-4 sm:px-8 lg:px-12 mb-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-md space-y-4">
          <div className="flex flex-col lg:flex-row items-center gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hackathon challenges by title, domain, or tech stack..."
              className="w-full flex-1 bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm font-sans text-slate-950 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#1D3189] font-medium"
            />

            {/* Custom Domain Dropdown with Rotating Circle Arrow */}
            <div ref={domainMenuRef} className="relative w-full lg:w-72">
              <button
                type="button"
                onClick={() => setDomainMenuOpen((prev) => !prev)}
                className={`w-full bg-slate-50 border-2 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-sans text-slate-950 focus:outline-none transition-all duration-300 font-semibold cursor-pointer flex items-center justify-between gap-3 group ${domainMenuOpen ? "border-[#1D3189] bg-white shadow-md" : "border-slate-200 hover:border-[#1D3189] hover:bg-white"
                  }`}
              >
                <span className="truncate">
                  {selectedDomain === "All" ? `All Domains (${projects.length})` : selectedDomain}
                </span>
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ease-in-out ${domainMenuOpen
                    ? "bg-[#D9F83B] text-slate-950 rotate-180"
                    : "bg-[#1D3189]/10 text-[#1D3189] group-hover:bg-[#1D3189] group-hover:text-white group-hover:rotate-180"
                    }`}
                >
                  <ChevronDown size={14} />
                </span>
              </button>

              {domainMenuOpen && (
                <div className="absolute right-0 mt-2 w-full lg:w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl p-1.5 z-50 max-h-72 overflow-y-auto space-y-0.5 font-sans">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDomain("All");
                      setDomainMenuOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-between cursor-pointer ${selectedDomain === "All"
                      ? "bg-[#070E54] text-white"
                      : "text-slate-700 hover:bg-[#070E54] hover:text-white"
                      }`}
                  >
                    <span>All Domains ({projects.length})</span>
                    {selectedDomain === "All" && <span className="w-2 h-2 rounded-full bg-[#D9F83B]" />}
                  </button>
                  {domains.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => {
                        setSelectedDomain(d);
                        setDomainMenuOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-between cursor-pointer ${selectedDomain === d
                        ? "bg-[#070E54] text-white"
                        : "text-slate-700 hover:bg-[#070E54] hover:text-white"
                        }`}
                    >
                      <span className="truncate pr-2">{d}</span>
                      {selectedDomain === d && <span className="w-2 h-2 rounded-full bg-[#D9F83B] shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={openSubmitWithAuth}
              className="w-full lg:w-auto px-5 py-3 rounded-2xl bg-[#070E54] hover:bg-[#1D3189] text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shrink-0 flex items-center justify-center gap-2"
            >
              <span>Submit Project</span>
              <ArrowRight size={14} className="text-[#D9F83B]" />
            </button>
          </div>

          {/* Filter Pills Row: Solo / Team Mode + Domain Quick Pills */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mr-1">Mode:</span>
              <button
                type="button"
                onClick={() => setModeFilter("all")}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer border ${modeFilter === "all"
                  ? "bg-[#1D3189] text-white border-[#1D3189]"
                  : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                  }`}
              >
                All Modes
              </button>
              <button
                type="button"
                onClick={() => setModeFilter("solo")}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer border ${modeFilter === "solo"
                  ? "bg-[#1D3189] text-white border-[#1D3189]"
                  : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                  }`}
              >
                Solo (₹{SOLO_HACKATHON_FEE})
              </button>
              <button
                type="button"
                onClick={() => setModeFilter("team")}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer border ${modeFilter === "team"
                  ? "bg-[#D9F83B] text-slate-950 border-[#D9F83B]"
                  : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                  }`}
              >
                Team 2–3 (₹{TEAM_HACKATHON_FEE})
              </button>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mr-1">Domain:</span>
              <button
                type="button"
                onClick={() => setSelectedDomain("All")}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer border ${selectedDomain === "All"
                  ? "bg-[#070E54] text-white border-[#070E54]"
                  : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                  }`}
              >
                All
              </button>
              {domains.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSelectedDomain(d)}
                  className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer border ${selectedDomain === d
                    ? "bg-[#070E54] text-white border-[#070E54]"
                    : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                    }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. HACKATHON PROJECTS GRID ── */}
      <section className="w-full px-4 sm:px-8 lg:px-12 mb-16">
        {loadingProjects ? (
          <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center flex items-center justify-center gap-2 text-sm font-semibold text-slate-600">
            <Loader2 size={18} className="animate-spin text-[#1D3189]" />
            <span>Loading Online Hackathon Challenges...</span>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
            <h3 className="text-lg font-extrabold text-slate-950">No hackathon challenges match your filter</h3>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedDomain("All");
              }}
              className="px-5 py-2.5 rounded-xl bg-[#1D3189] text-white text-xs font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredProjects.map((project, idx) => (
              <div
                key={project.id}
                className="relative overflow-hidden bg-[#F4F6FB] hover:bg-[#FAFBFD] border border-slate-200/90 hover:border-[#1D3189] rounded-3xl p-4 sm:p-6 shadow-md hover:shadow-xl transition-all duration-500 flex flex-col justify-between space-y-3.5 sm:space-y-5 group hover:-translate-y-1"
              >
                <div className="space-y-2.5 sm:space-y-4">
                  <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                    <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#1D3189]/10 text-[#1D3189] border border-[#1D3189]/20 font-sans text-[8px] sm:text-[10px] font-bold uppercase tracking-wider truncate">
                      {project.domain}
                    </span>
                    <span className="shrink-0 whitespace-nowrap px-1.5 sm:px-2.5 py-0.5 rounded-full font-sans text-[8px] sm:text-[10px] font-bold uppercase tracking-wider bg-white text-slate-800 border border-slate-200">
                      {project.difficulty}
                    </span>
                  </div>

                  {/* Boxed Blue Heading + Circle Arrow */}
                  <div
                    className="flex items-center justify-between gap-1.5 sm:gap-3 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#162774] text-white shadow-sm"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
                      backgroundSize: "28px 28px",
                    }}
                  >
                    <h3 className="text-[11px] sm:text-lg font-extrabold text-white transition-colors leading-tight sm:leading-snug line-clamp-2 min-w-0">
                      {project.title}
                    </h3>
                    <span className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-white text-[#162774] flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:rotate-[60deg]">
                      <ArrowRight size={11} />
                    </span>
                  </div>

                  {/* Rich Structured Metadata (No Tech Stack Pills) */}
                  <div className="p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white border border-slate-200/90 space-y-1 sm:space-y-2 text-[9.5px] sm:text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-1 sm:gap-2 text-slate-800 font-bold">
                      <span>Solo (1) or Team (2–3)</span>
                      <span className="px-1.5 sm:px-2.5 py-0.5 rounded-full bg-[#162774]/10 text-[#162774] text-[8.5px] sm:text-[10px] font-extrabold">
                        Online &bull; 24 Hours
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-1 sm:gap-2 text-[9px] sm:text-[11px] text-slate-600 font-semibold pt-1 sm:pt-1.5 border-t border-slate-100">
                      <span>Botmartz Community</span>
                      <span className="text-[#162774] font-bold">Open Tech Stack</span>
                    </div>
                    <div className="pt-1 sm:pt-1.5 border-t border-slate-100 text-[9px] sm:text-[11px] font-extrabold text-emerald-700">
                      Reward: Certificate + Direct Job Screening
                    </div>
                  </div>

                  <p className="text-[10px] sm:text-[13px] text-slate-700 leading-snug sm:leading-relaxed font-medium border-l-2 border-l-[#162774] pl-2 sm:pl-3 line-clamp-3">
                    {project.problemStatement}
                  </p>
                </div>

                <div className="pt-2.5 sm:pt-4 border-t border-slate-200/80 space-y-2 sm:space-y-2.5">
                  <div className="flex items-center justify-between text-[9.5px] sm:text-xs font-bold text-slate-800">
                    <span>Solo: ₹{project.soloFee || SOLO_HACKATHON_FEE}</span>
                    <span>Team: ₹{project.teamFee || TEAM_HACKATHON_FEE}</span>
                  </div>
                  <div className={`grid gap-1.5 sm:gap-2.5 ${modeFilter === "all" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
                    {modeFilter !== "team" && (
                      <button
                        type="button"
                        onClick={() => openEnrollModal(project, "solo")}
                        className={`py-1.5 sm:py-2.5 rounded-xl font-bold text-[10px] sm:text-xs transition-all cursor-pointer ${modeFilter === "solo"
                          ? "bg-[#1D3189] hover:bg-[#152468] text-white shadow-sm"
                          : "bg-white hover:bg-[#1D3189] hover:text-white border border-slate-200 text-slate-900"
                          }`}
                      >
                        Enroll Solo (₹{project.soloFee || SOLO_HACKATHON_FEE})
                      </button>
                    )}
                    {modeFilter !== "solo" && (
                      <button
                        type="button"
                        onClick={() => openEnrollModal(project, "team")}
                        className="py-1.5 sm:py-2.5 rounded-xl bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-extrabold text-[10px] sm:text-xs transition-all cursor-pointer shadow-sm"
                      >
                        Enroll Team (₹{project.teamFee || TEAM_HACKATHON_FEE})
                      </button>
                    )}
                  </div>
                </div>

                {/* Left, Top & Right 3px animated border color fill on hover */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-0 bottom-0 left-0 w-[3px] bg-[#162774] scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-500 ease-out"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-0 left-0 right-0 h-[3px] bg-[#162774] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-out"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-0 bottom-0 right-0 w-[3px] bg-[#162774] scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-500 ease-out"
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── 4B. JUDGING RUBRIC (100 POINTS) & OFFICIAL HACKATHON GUIDELINES ── */}
      <section className="w-full px-4 sm:px-8 lg:px-12 mb-16 space-y-8">
        <div
          className="rounded-3xl bg-[#162774] text-white p-4 sm:p-10 border border-white/15 shadow-2xl space-y-5 sm:space-y-6"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/15 pb-5">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                How Judges Score Your Hackathon Submission
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-blue-100/85 max-w-md font-medium">
              Tech stack is completely open — build in any language or framework. You are judged strictly on execution, workflow, UI, and live deployment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {[
              {
                num: "01",
                pts: "20 Points",
                title: "UI / UX & Product Polish",
                desc: "Clean, responsive interface, intuitive navigation, clear error states, and zero broken layouts.",
              },
              {
                num: "02",
                pts: "25 Points",
                title: "Complete Working Project",
                desc: "End-to-end working functionality with real data flow — no static mockups or placeholder buttons.",
              },
              {
                num: "03",
                pts: "15 Points",
                title: "Tech Stack & Architecture",
                desc: "Open tech stack choice! Evaluated on clean code organization, schema design, and API structure.",
              },
              {
                num: "04",
                pts: "20 Points",
                title: "Workflow & System Logic",
                desc: "Logical user/system workflow, edge-case handling, retry/fallback safety, and reliable execution.",
              },
              {
                num: "05",
                pts: "15 Points",
                title: "Live Deployed URL & Repo",
                desc: "Publicly accessible deployed app (Vercel/Render/Railway) plus clean GitHub repository with README.",
              },
              {
                num: "06",
                pts: "5 Bonus Pts",
                title: "Security, Validation & Extras",
                desc: "Input sanitization, rate-limiting, telemetry logs, or standout performance & testing coverage.",
              },
            ].map((rubric) => (
              <div
                key={rubric.num}
                className="p-5 rounded-2xl bg-white text-slate-950 border border-slate-200 border-l-4 border-l-[#162774] shadow-md space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="w-7 h-7 rounded-full bg-[#162774] text-white font-extrabold text-[11px] flex items-center justify-center">
                    {rubric.num}
                  </span>
                  <span className="px-3 py-0.5 rounded-full bg-[#162774] text-white text-[11px] font-extrabold">
                    {rubric.pts}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-slate-950">{rubric.title}</h3>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">{rubric.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Official Hackathon Rules & Guidelines */}
        <div className="rounded-3xl bg-[#F4F6FB] border border-slate-200 border-l-4 border-l-[#D9F83B] p-4 sm:p-9 space-y-4 sm:space-y-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#162774] text-[#D9F83B] text-[10px] font-extrabold uppercase tracking-wider mb-1.5">
                Official Rules &amp; Guidelines
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950">
                Mandatory Participation &amp; Submission Rules
              </h3>
            </div>
            <span className="text-xs font-bold text-[#162774]">Strict 24-Hour Window</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-[13px] text-slate-800 font-medium">
            {[
              {
                title: "Open Tech Stack Freedom",
                desc: "Use any programming language, framework, database, or AI model that solves the problem cleanly.",
              },
              {
                title: "Originality & Anti-Plagiarism",
                desc: "Code must be built during your 24-hour Unique ID window. Copied or pre-built templates are disqualified.",
              },
              {
                title: "Mandatory Deliverables",
                desc: "Submit both a public GitHub Repository URL (with setup README) and a working Live Deployed URL.",
              },
              {
                title: "Solo & Team Eligibility",
                desc: "Solo (1 builder, ₹159) or Team (2–3 members, ₹450). Only 1 submission per Unique ID is evaluated.",
              },
              {
                title: "24-Hour Evaluation & Results",
                desc: "All projects are reviewed within 24 hours of submission. Top scorers unlock certificates & job screening.",
              },
              {
                title: "Clean Deployment Requirement",
                desc: "Your deployed link must load without server crashes, exposed API secrets, or broken core workflows.",
              },
            ].map((rule, i) => (
              <div
                key={rule.title}
                className="relative overflow-hidden p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-[#162774] flex items-start gap-3 transition-colors duration-500 group"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[#162774] -translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                  }}
                />
                <span className="relative z-10 w-6 h-6 rounded-full bg-[#D9F83B] text-slate-950 font-extrabold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  0{i + 1}
                </span>
                <div className="relative z-10">
                  <div className="font-extrabold text-slate-950 group-hover:text-[#D9F83B] transition-colors duration-500 mb-0.5">
                    {rule.title}
                  </div>
                  <div className="text-xs text-slate-600 group-hover:text-blue-100/90 transition-colors duration-500 leading-relaxed">
                    {rule.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. PROJECT SUBMISSION MODAL (OPENED FROM TOP BUTTON) ── */}
      {submitModalOpen && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 backdrop-blur-md p-4">
          <div className="min-h-full flex items-center justify-center">
            <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden">
              <div className="bg-[#070E54] px-6 sm:px-8 py-5 text-white flex items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#D9F83B]">
                    24-Hour Submission Portal
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold mt-0.5">
                    Submit Your Working Hackathon Project
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSubmitModalOpen(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer shrink-0"
                  aria-label="Close submission modal"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleProjectSubmit} className="p-6 sm:p-8 space-y-4 text-xs">
                {/* Unique ID Input + Lookup */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Hackathon Unique ID * (Sent to Team Leader Email)
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <input
                      type="text"
                      required
                      value={subUniqueCode}
                      onChange={(e) => setSubUniqueCode(e.target.value.toUpperCase())}
                      placeholder="e.g. BM-HACK-8F4K2A"
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-slate-950 font-bold uppercase tracking-wider focus:bg-white focus:outline-none focus:border-[#1D3189]"
                    />
                    <button
                      type="button"
                      onClick={() => handleLookupUniqueCode()}
                      disabled={lookupLoading}
                      className="px-5 py-2.5 rounded-xl bg-[#1D3189] hover:bg-[#152468] text-white font-bold transition-all cursor-pointer disabled:opacity-50 shrink-0"
                    >
                      {lookupLoading ? "Checking..." : "Verify Unique ID"}
                    </button>
                  </div>
                  {lookupError && (
                    <p className="mt-1.5 text-xs font-semibold text-rose-600">{lookupError}</p>
                  )}
                  {verifiedReg && !lookupError && (
                    <p className="mt-1.5 text-xs font-semibold text-emerald-700">
                      Verified ({verifiedReg.mode === "team" ? "Team" : "Solo"}) • Valid until{" "}
                      {new Date(verifiedReg.expiresAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
                    </p>
                  )}
                </div>

                {/* Auto-Filled Team Name & Project Title */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Team / Participant Name (Auto-Filled)
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={subTeamName}
                      placeholder="Enter valid Unique ID to auto-fetch..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 font-bold cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Selected Hackathon Project (Auto-Filled)
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={subProjectTitle}
                      placeholder="Auto-fetched from database..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 font-semibold cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Working GitHub & Deployed Links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Working GitHub Repository Link *
                    </label>
                    <input
                      type="url"
                      required
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/username/hackathon-project"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-slate-950 font-medium focus:bg-white focus:outline-none focus:border-[#1D3189]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Live Deployed Link *
                    </label>
                    <input
                      type="url"
                      required
                      value={deployedUrl}
                      onChange={(e) => setDeployedUrl(e.target.value)}
                      placeholder="https://your-project.vercel.app"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-slate-950 font-medium focus:bg-white focus:outline-none focus:border-[#1D3189]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Architecture / Demo Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={subNotes}
                    onChange={(e) => setSubNotes(e.target.value)}
                    placeholder="Key features implemented, test credentials, or walkthrough notes..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-slate-950 font-medium focus:bg-white focus:outline-none focus:border-[#1D3189]"
                  />
                </div>

                {submitError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-semibold">
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submittingProject || !verifiedReg || Boolean(lookupError)}
                  className="w-full py-3.5 rounded-xl bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-bold text-sm transition-all shadow-lg shadow-lime-400/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submittingProject ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Submitting Project...</span>
                    </>
                  ) : (
                    <span>Submit Hackathon Project &rarr;</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── ENROLLMENT & PAYMENT MODAL (NO ACCOUNT REQUIRED) ── */}
      {enrollProject && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 backdrop-blur-md p-4">
          <div className="min-h-full flex items-center justify-center">
            <div className="relative w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 text-slate-900">
              <button
                type="button"
                onClick={() => setEnrollProject(null)}
                className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>

              {enrolledReceipt ? (
                <div className="text-center space-y-5 py-2">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={30} />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-950">Hackathon Enrollment Confirmed</h3>
                    <p className="text-xs text-slate-600 mt-1">
                      Your Unique ID has been emailed to <strong>{enrolledReceipt.leader?.email}</strong> and saved in{" "}
                      <strong>{enrollProject.title}</strong>&apos;s registration table.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#070E54] text-white space-y-2">
                    <div className="text-[11px] uppercase tracking-wider text-blue-200 font-bold">
                      24-Hour Hackathon Unique ID
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-2xl font-black tracking-widest text-[#D9F83B]">
                        {enrolledReceipt.uniqueCode}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(enrolledReceipt.uniqueCode);
                          setCopiedCode(true);
                          setTimeout(() => setCopiedCode(false), 2000);
                        }}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                        title="Copy Unique ID"
                      >
                        {copiedCode ? <Check size={15} /> : <Copy size={15} />}
                      </button>
                    </div>
                    <div className="text-[11px] text-blue-100/80">
                      Valid for 24 hours until{" "}
                      {new Date(enrolledReceipt.expiresAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSubUniqueCode(enrolledReceipt.uniqueCode);
                      setEnrollProject(null);
                      setSubmitModalOpen(true);
                    }}
                    className="w-full py-3 rounded-xl bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-bold text-sm cursor-pointer"
                  >
                    Use Unique ID in Submission Form &rarr;
                  </button>
                </div>
              ) : (
                <form onSubmit={handleEnrollAndPay} className="space-y-4 text-xs">
                  <div>
                    <div className="text-[11px] font-bold text-[#1D3189] uppercase tracking-wider">
                      No Account Needed • Instant Razorpay Entry
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-950 mt-0.5">{enrollProject.title}</h3>
                  </div>

                  {/* Solo vs Team Switcher */}
                  <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setMode("solo")}
                      className={`py-2.5 rounded-xl font-bold transition-all cursor-pointer ${mode === "solo" ? "bg-[#1D3189] text-white shadow-sm" : "text-slate-700"
                        }`}
                    >
                      Solo Builder (₹{SOLO_HACKATHON_FEE})
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("team")}
                      className={`py-2.5 rounded-xl font-bold transition-all cursor-pointer ${mode === "team" ? "bg-[#1D3189] text-white shadow-sm" : "text-slate-700"
                        }`}
                    >
                      Team 2–3 Members (₹{TEAM_HACKATHON_FEE})
                    </button>
                  </div>

                  {mode === "team" && (
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                        Team Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="e.g. Neural Ninjas"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 font-medium focus:bg-white focus:outline-none focus:border-[#1D3189]"
                      />
                    </div>
                  )}

                  {/* Leader Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                        {mode === "team" ? "Team Leader Name *" : "Your Full Name *"}
                      </label>
                      <input
                        type="text"
                        required
                        value={leaderName}
                        onChange={(e) => setLeaderName(e.target.value)}
                        placeholder="e.g. Aarav Verma"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 font-medium focus:bg-white focus:outline-none focus:border-[#1D3189]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                        {mode === "team" ? "Leader Email * (Receives Unique ID)" : "Email * (Receives Unique ID)"}
                      </label>
                      <input
                        type="email"
                        required
                        value={leaderEmail}
                        onChange={(e) => setLeaderEmail(e.target.value)}
                        placeholder="leader@college.edu"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 font-medium focus:bg-white focus:outline-none focus:border-[#1D3189]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={leaderPhone}
                        onChange={(e) => setLeaderPhone(e.target.value)}
                        placeholder="9876543210"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 font-medium focus:bg-white focus:outline-none focus:border-[#1D3189]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                        College / Company
                      </label>
                      <input
                        type="text"
                        value={leaderOrg}
                        onChange={(e) => setLeaderOrg(e.target.value)}
                        placeholder="e.g. IET DAVV"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 font-medium focus:bg-white focus:outline-none focus:border-[#1D3189]"
                      />
                    </div>
                  </div>

                  {mode === "team" && (
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                      <div className="text-[11px] font-bold text-[#1D3189] uppercase">
                        Team Members (Min 2, Max 3 Total Including Leader)
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          value={member2Name}
                          onChange={(e) => setMember2Name(e.target.value)}
                          placeholder="Member 2 Name *"
                          className="px-3 py-2 rounded-xl bg-white border border-slate-200 font-medium focus:outline-none focus:border-[#1D3189]"
                        />
                        <input
                          type="email"
                          required
                          value={member2Email}
                          onChange={(e) => setMember2Email(e.target.value)}
                          placeholder="Member 2 Email *"
                          className="px-3 py-2 rounded-xl bg-white border border-slate-200 font-medium focus:outline-none focus:border-[#1D3189]"
                        />
                        <input
                          type="text"
                          value={member3Name}
                          onChange={(e) => setMember3Name(e.target.value)}
                          placeholder="Member 3 Name (Optional)"
                          className="px-3 py-2 rounded-xl bg-white border border-slate-200 font-medium focus:outline-none focus:border-[#1D3189]"
                        />
                        <input
                          type="email"
                          value={member3Email}
                          onChange={(e) => setMember3Email(e.target.value)}
                          placeholder="Member 3 Email (Optional)"
                          className="px-3 py-2 rounded-xl bg-white border border-slate-200 font-medium focus:outline-none focus:border-[#1D3189]"
                        />
                      </div>
                    </div>
                  )}

                  {enrollError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-semibold">
                      {enrollError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={paying}
                    className="w-full py-3.5 rounded-xl bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-bold text-sm transition-all shadow-lg shadow-lime-400/20 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {paying ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Processing Payment...</span>
                      </>
                    ) : (
                      <span>
                        Pay ₹{mode === "team" ? TEAM_HACKATHON_FEE : SOLO_HACKATHON_FEE} &amp; Get Unique ID &rarr;
                      </span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── SUBMISSION SUCCESS POPUP MODAL ── */}
      {submitSuccessPopup && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md p-4 flex items-center justify-center">
          <div className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-7 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 size={34} />
            </div>
            <h3 className="text-xl font-extrabold text-slate-950">Project Submitted Successfully!</h3>
            <p className="text-sm font-bold text-[#1D3189]">
              Under 24 hours, results will be declared.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Confirmation has been sent to <strong>{submitSuccessPopup.leader?.email || "your registered email"}</strong>. Your Unique ID (<strong>{submitSuccessPopup.uniqueCode}</strong>) is now queued for evaluation.
            </p>
            <button
              type="button"
              onClick={() => setSubmitSuccessPopup(null)}
              className="w-full py-3 rounded-xl bg-[#070E54] hover:bg-[#1D3189] text-white font-bold text-sm cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
