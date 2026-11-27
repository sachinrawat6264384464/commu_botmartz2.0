"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  signInWithCustomToken,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

export interface StudentProfile {
  uid: string;
  email: string;
  displayName: string;
  username: string;
  photoURL?: string;
  phoneNumber?: string;
  bio?: string;
  personaType?: "STUDENT" | "WORKING_PROFESSIONAL" | "FOUNDER_BUILDER" | "RESEARCHER";
  collegeName?: string;
  collegeCountry?: string;
  degreeBranch?: string;
  graduationYear?: string;
  studentIdRollNo?: string;
  companyName?: string;
  companyCountry?: string;
  designationRole?: string;
  yearsOfExperience?: string;
  workDomain?: string;
  country?: string;
  cityLocation?: string;
  timezone?: string;
  githubUsername?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  discordHandle?: string;
  whatsappNumber?: string;
  currentRole?: string;
  primaryTechStack?: string[];
  aiSpecialization?: string;
  karmaCoins?: number;
  reputationLevel?: number;
  phoneVerified?: boolean;
  collegeVerified?: boolean;
  isPaidFellow?: boolean;
  fellowshipTrack?: string;
  isWorkshopEnrolled?: boolean;
  workshopTrack?: string;
  role?: string;
  dpdpConsent?: boolean;
  createdAt?: any;
  updatedAt?: any;
}

interface AuthContextType {
  user: User | null;
  studentProfile: StudentProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<User | null>;
  loginWithCustomToken: (customToken: string, userData?: any) => Promise<User | null>;
  setupRecaptcha: (containerId: string) => RecaptchaVerifier;
  sendPhoneOtp: (phoneNumber: string, recaptcha: RecaptchaVerifier) => Promise<ConfirmationResult>;
  completeStudentProfile: (profile: Partial<StudentProfile>) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  studentProfile: null,
  loading: true,
  signInWithGoogle: async () => null,
  loginWithCustomToken: async () => null,
  setupRecaptcha: () => ({} as any),
  sendPhoneOtp: async () => ({} as any),
  completeStudentProfile: async () => {},
  logout: async () => {},
  refreshProfile: async () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (uid: string, email: string) => {
    try {
      const docRef = doc(db, "student_profiles", uid);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        setStudentProfile(snap.data() as StudentProfile);
      } else {
        const starterProfile: StudentProfile = {
          uid,
          email: email || "",
          displayName: auth.currentUser?.displayName || "Builder",
          username: (email?.split("@")[0] || `builder_${uid.slice(0, 5)}`).toLowerCase().replace(/[^a-z0-9_]/g, "_"),
          photoURL: auth.currentUser?.photoURL || "",
          collegeName: "",
          degreeBranch: "",
          graduationYear: "2026",
          studentIdRollNo: "",
          karmaCoins: 100,
          reputationLevel: 1,
          phoneVerified: !!auth.currentUser?.phoneNumber,
          collegeVerified: false,
          dpdpConsent: true
        };

        try {
          await setDoc(docRef, starterProfile, { merge: true });
        } catch (setErr) {
          console.warn("Starter profile save warning:", setErr);
        }

        setStudentProfile(starterProfile);
      }
    } catch (e) {
      console.error("Error fetching student profile:", e);
    }
  };

  useEffect(() => {
    // 1. Enable local persistence
    try {
      setPersistence(auth, browserLocalPersistence).catch(() => {});
    } catch (e) {}

    // 2. Restore local session backup immediately on load
    if (typeof window !== "undefined") {
      try {
        const rawSaved = localStorage.getItem("botmartz_session");
        if (rawSaved) {
          const saved = JSON.parse(rawSaved);
          if (saved && saved.email) {
            const tempUser: any = {
              uid: saved.uid || `usr_${saved.email.replace(/[^a-z0-9]/g, "_")}`,
              email: saved.email,
              displayName: saved.displayName || "Builder",
              photoURL: saved.photoURL || ""
            };
            setUser((prev) => prev || tempUser);
            setStudentProfile((prev) => prev || {
              uid: tempUser.uid,
              email: saved.email,
              displayName: saved.displayName || "Builder",
              username: saved.username || saved.email.split("@")[0],
              karmaCoins: saved.karmaCoins
            });
          }
        }
      } catch (e) {}
    }

    // 3. Firebase Auth listener
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("botmartz_session", JSON.stringify({
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL
            }));
          } catch (e) {}
        }
        await fetchProfile(currentUser.uid, currentUser.email || "");
      } else {
        // Check if cached local session exists before marking unauthenticated
        if (typeof window !== "undefined") {
          try {
            const rawSaved = localStorage.getItem("botmartz_session");
            if (rawSaved) {
              const saved = JSON.parse(rawSaved);
              if (saved && saved.email) {
                const tempUser: any = {
                  uid: saved.uid || `usr_${saved.email.replace(/[^a-z0-9]/g, "_")}`,
                  email: saved.email,
                  displayName: saved.displayName || "Builder",
                  photoURL: saved.photoURL || ""
                };
                setUser(tempUser);
                setStudentProfile((prev) => prev || {
                  uid: tempUser.uid,
                  email: saved.email,
                  displayName: saved.displayName || "Builder",
                  username: saved.username || saved.email.split("@")[0],
                  karmaCoins: saved.karmaCoins
                });
                setLoading(false);
                return;
              }
            }
          } catch (e) {}
        }
        setUser(null);
        setStudentProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithCustomToken = async (customToken: string, userData?: any): Promise<User | null> => {
    try {
      if (typeof window !== "undefined" && userData) {
        try {
          localStorage.setItem("botmartz_session", JSON.stringify(userData));
        } catch (e) {}
      }

      if (customToken) {
        const res = await signInWithCustomToken(auth, customToken);
        setUser(res.user);
        setLoading(false);
        await fetchProfile(res.user.uid, res.user.email || userData?.email || "");
        return res.user;
      }
    } catch (err) {
      console.warn("signInWithCustomToken notice:", err);
    }

    if (userData && userData.email) {
      const fallbackUser: any = {
        uid: userData.uid || `usr_${userData.email.replace(/[^a-z0-9]/g, "_")}`,
        email: userData.email,
        displayName: userData.displayName || "Builder",
        photoURL: ""
      };
      setUser(fallbackUser);
      setStudentProfile({
        uid: fallbackUser.uid,
        email: userData.email,
        displayName: userData.displayName || "Builder",
        username: userData.username || userData.email.split("@")[0],
        karmaCoins: userData.karmaCoins ?? 100
      });
      setLoading(false);
      return fallbackUser;
    }

    return null;
  };

  const signInWithGoogle = async (): Promise<User | null> => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const res = await signInWithPopup(auth, provider);
      const u = res.user;
      setUser(u);
      setLoading(false);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("botmartz_session", JSON.stringify({
            uid: u.uid,
            email: u.email,
            displayName: u.displayName,
            photoURL: u.photoURL
          }));
        } catch (e) {}
      }
      await fetchProfile(u.uid, u.email || "");
      return u;
    } catch (err: any) {
      if (err?.code === "auth/popup-closed-by-user" || err?.message?.includes("popup-closed-by-user")) {
        console.warn("Google sign-in popup was closed by user.");
        return null;
      }
      console.error("Google Sign-In error:", err);
      throw err;
    }
  };

  const setupRecaptcha = (containerId: string): RecaptchaVerifier => {
    if (typeof window === "undefined") return {} as any;
    
    // Clear any previous instance
    if ((window as any).recaptchaVerifier) {
      try {
        (window as any).recaptchaVerifier.clear();
      } catch (e) {}
    }

    const recaptcha = new RecaptchaVerifier(auth, containerId, {
      size: "invisible",
      callback: () => {
        // reCAPTCHA solved
      }
    });

    (window as any).recaptchaVerifier = recaptcha;
    return recaptcha;
  };

  const sendPhoneOtp = async (phoneNumber: string, recaptcha: RecaptchaVerifier): Promise<ConfirmationResult> => {
    try {
      const cleanPhone = phoneNumber.startsWith("+") ? phoneNumber : `+91${phoneNumber.replace(/^0+/, "")}`;
      const confirmationResult = await signInWithPhoneNumber(auth, cleanPhone, recaptcha);
      return confirmationResult;
    } catch (err: any) {
      console.warn("Phone OTP Notice:", err?.code || err?.message);
      if (
        err?.code === "auth/operation-not-allowed" ||
        err?.message?.includes("operation-not-allowed") ||
        err?.message?.includes("region enabled")
      ) {
        const errorMsg = "Firebase Phone Authentication & SMS Region Policy (+91 India) is not enabled in Firebase Console.";
        const customErr: any = new Error(errorMsg);
        customErr.code = "auth/operation-not-allowed";
        throw customErr;
      }
      throw err;
    }
  };

  const completeStudentProfile = async (profileData: Partial<StudentProfile>) => {
    const activeUid = auth.currentUser?.uid || user?.uid;
    const activeEmail = auth.currentUser?.email || user?.email || profileData.email || "";

    if (!activeUid) throw new Error("No authenticated user.");

    const updatedData: Partial<StudentProfile> = {
      uid: activeUid,
      email: activeEmail,
      displayName: profileData.displayName || auth.currentUser?.displayName || user?.displayName || "Builder",
      username: (profileData.username || activeEmail.split("@")[0] || `builder_${activeUid.slice(0, 5)}`).toLowerCase().trim(),
      photoURL: auth.currentUser?.photoURL || profileData.photoURL || "",
      phoneNumber: auth.currentUser?.phoneNumber || profileData.phoneNumber || "",
      collegeName: profileData.collegeName || "",
      degreeBranch: profileData.degreeBranch || "",
      graduationYear: profileData.graduationYear || "2026",
      studentIdRollNo: profileData.studentIdRollNo || "",
      githubUsername: profileData.githubUsername || "",
      linkedinUrl: profileData.linkedinUrl || "",
      karmaCoins: studentProfile?.karmaCoins || 100,
      reputationLevel: studentProfile?.reputationLevel || 1,
      phoneVerified: !!auth.currentUser?.phoneNumber || !!profileData.phoneNumber,
      collegeVerified: !!profileData.collegeName,
      dpdpConsent: true,
      updatedAt: serverTimestamp()
    };

    const docRef = doc(db, "student_profiles", activeUid);
    await setDoc(docRef, updatedData, { merge: true });
    setStudentProfile((prev) => ({ ...(prev || {}), ...(updatedData as any) }));

    if (activeEmail) {
      try {
        const walletRef = doc(db, "student_wallets", activeEmail.toLowerCase().trim());
        await setDoc(walletRef, {
          studentEmail: activeEmail.toLowerCase().trim(),
          balance: studentProfile?.karmaCoins || 100,
          totalEarned: studentProfile?.karmaCoins || 100,
          totalSpent: 0,
          reputationLevel: 1,
          unlockedPerks: ["Community Member Access"]
        }, { merge: true });
      } catch (wErr) {
        console.warn("Wallet write warning:", wErr);
      }
    }
  };

  const logout = async () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("botmartz_session");
        localStorage.removeItem("botmartz_user_enrollments");
        localStorage.removeItem("botmartz_user_logs");
        localStorage.removeItem("botmartz_user_claimed_badges");
      } catch (e) {}
    }
    await fbSignOut(auth).catch(() => {});
    setUser(null);
    setStudentProfile(null);
  };

  const refreshProfile = async () => {
    const activeUid = auth.currentUser?.uid || user?.uid;
    const activeEmail = auth.currentUser?.email || user?.email || "";
    if (activeUid) {
      await fetchProfile(activeUid, activeEmail);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        studentProfile,
        loading,
        signInWithGoogle,
        loginWithCustomToken,
        setupRecaptcha,
        sendPhoneOtp,
        completeStudentProfile,
        logout,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

