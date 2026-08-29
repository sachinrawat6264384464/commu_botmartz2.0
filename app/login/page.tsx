"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  GraduationCap,
  ShieldCheck,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  Sparkles,
  UserCheck,
  Building,
  Calendar,
  KeyRound,
  FileCheck,
  Coins
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const POPULAR_COLLEGES = [
  "IIT Indore",
  "SGSITS Indore",
  "IET DAVV Indore",
  "Medi-Caps University Indore",
  "SVVV Indore",
  "IIT Bombay",
  "IIT Delhi",
  "IIT Kharagpur",
  "IIT Madras",
  "NIT Trichy",
  "NIT Surathkal",
  "MANIT Bhopal",
  "IIIT Hyderabad",
  "IIIT Bangalore",
  "BITS Pilani",
  "VIT Vellore",
  "SRM Institute of Science and Technology",
  "Delhi Technological University (DTU)",
  "Netaji Subhas University of Technology (NSUT)",
  "Jadavpur University",
  "Anna University",
  "Other / Self-Taught"
];

function StudentLoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/profile";

  const {
    user,
    studentProfile,
    loading: authLoading,
    signInWithGoogle,
    setupRecaptcha,
    sendPhoneOtp,
    completeStudentProfile
  } = useAuth();

  const [authMethod, setAuthMethod] = useState<"google" | "phone">("google");
  const [phone, setPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  // Student Profile Completion State
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [customCollege, setCustomCollege] = useState("");
  const [degreeBranch, setDegreeBranch] = useState("B.Tech Computer Science");
  const [graduationYear, setGraduationYear] = useState("2026");
  const [studentIdRollNo, setStudentIdRollNo] = useState("");
  const [githubUsername, setGithubUsername] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [dpdpConsent, setDpdpConsent] = useState(true);

  useEffect(() => {
    if (studentProfile) {
      setFullName(studentProfile.displayName || user?.displayName || "");
      setUsername(studentProfile.username || user?.email?.split("@")[0] || "");
      setCollegeName(studentProfile.collegeName || "");
      setDegreeBranch(studentProfile.degreeBranch || "B.Tech Computer Science");
      setGraduationYear(studentProfile.graduationYear || "2026");
      setStudentIdRollNo(studentProfile.studentIdRollNo || "");
      setGithubUsername(studentProfile.githubUsername || "");
      setLinkedinUrl(studentProfile.linkedinUrl || "");
    }
  }, [studentProfile, user]);

  const isProfileIncomplete = user && (!studentProfile?.collegeName || !studentProfile?.studentIdRollNo);

  const handleGoogleLogin = async () => {
    try {
      setSubmitting(true);
      setError("");
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || "Google Sign-In failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      const recaptcha = setupRecaptcha("recaptcha-container");
      const confirmRes = await sendPhoneOtp(phone, recaptcha);
      setConfirmationResult(confirmRes);
      setInfoMsg(`OTP code sent via SMS to ${phone}. Enter below:`);
    } catch (err: any) {
      setError(err.message || "Failed to send SMS OTP.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim() || !confirmationResult) {
      setError("Please enter the 6-digit OTP received on your phone.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      await confirmationResult.confirm(otpCode);
      setInfoMsg("Phone verified successfully!");
    } catch (err: any) {
      setError(err.message || "Invalid or expired OTP code.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveStudentProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalCollege = collegeName === "Other / Self-Taught" ? customCollege : collegeName;

    if (!finalCollege || !studentIdRollNo.trim()) {
      setError("College Name and Student Enrollment / Roll No are required for student verification.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      await completeStudentProfile({
        displayName: fullName.trim(),
        username: username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_"),
        collegeName: finalCollege.trim(),
        degreeBranch,
        graduationYear,
        studentIdRollNo: studentIdRollNo.trim(),
        githubUsername: githubUsername.trim().replace(/^@/, ""),
        linkedinUrl: linkedinUrl.trim(),
        phoneNumber: user?.phoneNumber || phone || "",
        dpdpConsent: true
      });

      router.push(redirectUrl);
    } catch (err: any) {
      setError(err.message || "Failed to save verified student profile.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center font-mono text-xs text-slate-500">
        <Loader2 size={20} className="animate-spin text-[#0066FF] mr-2" />
        <span>Authenticating zero-trust identity...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 py-12 px-4 sm:px-6">
      <div id="recaptcha-container"></div>

      <div className="max-w-xl mx-auto space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <Image src="/logo.png" alt="Botmartz Logo" width={48} height={48} className="object-contain" />
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0066FF] font-mono text-xs font-bold uppercase tracking-wider border border-blue-200">
            <ShieldCheck size={14} /> Official Student Verification Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {isProfileIncomplete ? "Complete Student Verification" : "Sign In to Botmartz Builders"}
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm font-mono">
            {isProfileIncomplete
              ? "Verify your college student credentials to claim 100 Welcome Karma Coins and unlock the 45-day Arena."
              : "Access your Proof-of-Work Heatmap, Karma Wallet, Stage Roadmaps & 15-Company Referral Circle."}
          </p>
        </div>

        {/* Auth Error Banner */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Info Banner */}
        {infoMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{infoMsg}</span>
          </div>
        )}

        {/* STEP 1: LOGIN BOX (When not logged in) */}
        {!user && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            
            {/* Method Tabs */}
            <div className="flex rounded-2xl bg-slate-100 p-1.5 font-mono text-xs font-bold">
              <button
                type="button"
                onClick={() => { setAuthMethod("google"); setError(""); }}
                className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  authMethod === "google"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Mail size={14} />
                <span>Google One-Click</span>
              </button>
              <button
                type="button"
                onClick={() => { setAuthMethod("phone"); setError(""); }}
                className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  authMethod === "phone"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Phone size={14} />
                <span>Phone OTP Verification</span>
              </button>
            </div>

            {/* Google Login Tab */}
            {authMethod === "google" && (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={submitting}
                  className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-3 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span>Continue with Google</span>
                    </>
                  )}
                </button>
                <p className="text-center text-[11px] font-mono text-slate-500">
                  Instant sign-in with your university or personal Google email.
                </p>
              </div>
            )}

            {/* Phone OTP Tab */}
            {authMethod === "phone" && (
              <div className="space-y-4 font-mono text-xs">
                {!confirmationResult ? (
                  <form onSubmit={handleSendPhoneOtp} className="space-y-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">
                        Mobile Number (+91 India):
                      </label>
                      <div className="flex gap-2">
                        <span className="px-3.5 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-bold">
                          +91
                        </span>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. 9876543210"
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      {submitting ? <Loader2 size={15} className="animate-spin" /> : <span>Send Verification OTP</span>}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyPhoneOtp} className="space-y-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">
                        Enter 6-Digit SMS Code:
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="123456"
                        className="w-full text-center tracking-widest text-lg font-bold bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      {submitting ? <Loader2 size={15} className="animate-spin" /> : <span>Verify &amp; Sign In</span>}
                    </button>
                  </form>
                )}
                <p className="text-center text-[11px] text-slate-500">
                  Zero-spam verification. Only 1 account per mobile number.
                </p>
              </div>
            )}

            {/* DPDP Compliance Notice */}
            <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500 font-mono">
              <Lock size={13} className="text-emerald-600 shrink-0" />
              <span>Protected by DPDP Act 2023. Zero third-party data tracking.</span>
            </div>

          </div>
        )}

        {/* STEP 2: STUDENT PROFILE VERIFICATION WIZARD (When user is authenticated) */}
        {user && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            
            {/* Authenticated User Status Pill */}
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <Image src={user.photoURL} alt="Avatar" width={36} height={36} className="rounded-full" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#0066FF] text-white flex items-center justify-center font-bold">
                    {user.email?.charAt(0).toUpperCase() || "S"}
                  </div>
                )}
                <div>
                  <div className="font-bold text-slate-900">{user.displayName || user.email}</div>
                  <div className="text-[11px] text-slate-500">{user.email || user.phoneNumber}</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                Auth Verified
              </span>
            </div>

            {/* Mandatory Student Fields Form */}
            <form onSubmit={handleSaveStudentProfile} className="space-y-4 font-mono text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Full Name:</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Community Handle:</label>
                  <div className="flex">
                    <span className="px-3 py-3 rounded-l-xl bg-slate-100 border border-r-0 border-slate-200 text-slate-500 font-bold">
                      @
                    </span>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="rahul_builder"
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-r-xl p-3 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">College / University Name:</label>
                <select
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                >
                  <option value="">Select your college / university...</option>
                  {POPULAR_COLLEGES.map((col, idx) => (
                    <option key={idx} value={col}>{col}</option>
                  ))}
                </select>
              </div>

              {collegeName === "Other / Self-Taught" && (
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Specify College / Institution Name:</label>
                  <input
                    type="text"
                    required
                    value={customCollege}
                    onChange={(e) => setCustomCollege(e.target.value)}
                    placeholder="e.g. Acropolis Institute of Technology and Research"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Degree &amp; Branch:</label>
                  <select
                    value={degreeBranch}
                    onChange={(e) => setDegreeBranch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  >
                    <option value="B.Tech Computer Science">B.Tech Computer Science</option>
                    <option value="B.Tech AI & Data Science">B.Tech AI &amp; Data Science</option>
                    <option value="B.Tech Electronics & Comm">B.Tech Electronics &amp; Comm</option>
                    <option value="B.Tech Information Tech">B.Tech Information Tech</option>
                    <option value="BCA / MCA">BCA / MCA</option>
                    <option value="B.Sc / M.Sc Computer Science">B.Sc / M.Sc Computer Science</option>
                    <option value="Polytechnic Diploma">Polytechnic Diploma</option>
                    <option value="Self-Taught / Other">Self-Taught / Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Graduation Year:</label>
                  <select
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  >
                    <option value="2025">2025 (Graduated / Final Year)</option>
                    <option value="2026">2026 (3rd Year / 4th Year)</option>
                    <option value="2027">2027 (2nd Year)</option>
                    <option value="2028">2028 (1st Year)</option>
                    <option value="2029">2029 (Freshman)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  College Enrollment / Student ID Roll No:
                </label>
                <input
                  type="text"
                  required
                  value={studentIdRollNo}
                  onChange={(e) => setStudentIdRollNo(e.target.value)}
                  placeholder="e.g. 0801CS221089 or 2022UGCS045"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Used exclusively to verify authentic student status and prevent duplicate accounts.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">GitHub Username:</label>
                  <input
                    type="text"
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                    placeholder="e.g. rahulsharma"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">LinkedIn URL:</label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>

              {/* DPDP Consent */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="dpdp"
                  checked={dpdpConsent}
                  onChange={(e) => setDpdpConsent(e.target.checked)}
                  required
                  className="mt-1"
                />
                <label htmlFor="dpdp" className="text-[11px] text-slate-600 font-sans cursor-pointer">
                  I confirm that I am an authentic student and consent to DPDP Act 2023 verification for project reviews, karma badges, and 15-company referral dispatch.
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <Coins size={15} />
                    <span>Save &amp; Claim 100 Welcome Karma Coins</span>
                  </>
                )}
              </button>
            </form>

          </div>
        )}

      </div>
    </div>
  );
}

export default function StudentLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center font-mono text-xs text-slate-500">
          <Loader2 size={20} className="animate-spin text-[#0066FF] mr-2" />
          <span>Loading student portal...</span>
        </div>
      }
    >
      <StudentLoginInner />
    </Suspense>
  );
}

