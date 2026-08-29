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
  ConfirmationResult
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
  collegeName: string;
  degreeBranch: string;
  graduationYear: string;
  studentIdRollNo: string;
  githubUsername?: string;
  linkedinUrl?: string;
  karmaCoins?: number;
  reputationLevel?: number;
  phoneVerified?: boolean;
  collegeVerified?: boolean;
  dpdpConsent?: boolean;
  createdAt?: any;
  updatedAt?: any;
}

interface AuthContextType {
  user: User | null;
  studentProfile: StudentProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<User | null>;
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
        // Check if there is an existing wallet by email to pull karma
        setStudentProfile({
          uid,
          email: email || "",
          displayName: auth.currentUser?.displayName || "Student Builder",
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
        });
      }
    } catch (e) {
      console.error("Error fetching student profile:", e);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser.uid, currentUser.email || "");
      } else {
        setStudentProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<User | null> => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const res = await signInWithPopup(auth, provider);
      const u = res.user;
      setUser(u);
      await fetchProfile(u.uid, u.email || "");
      return u;
    } catch (err: any) {
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
      console.error("Phone OTP Error:", err);
      throw err;
    }
  };

  const completeStudentProfile = async (profileData: Partial<StudentProfile>) => {
    if (!auth.currentUser) throw new Error("No authenticated user.");
    const uid = auth.currentUser.uid;
    const email = auth.currentUser.email || profileData.email || "";

    const updatedData: StudentProfile = {
      uid,
      email,
      displayName: profileData.displayName || auth.currentUser.displayName || "Student Builder",
      username: (profileData.username || email.split("@")[0] || `builder_${uid.slice(0, 5)}`).toLowerCase().trim(),
      photoURL: auth.currentUser.photoURL || profileData.photoURL || "",
      phoneNumber: auth.currentUser.phoneNumber || profileData.phoneNumber || "",
      collegeName: profileData.collegeName || "",
      degreeBranch: profileData.degreeBranch || "",
      graduationYear: profileData.graduationYear || "2026",
      studentIdRollNo: profileData.studentIdRollNo || "",
      githubUsername: profileData.githubUsername || "",
      linkedinUrl: profileData.linkedinUrl || "",
      karmaCoins: studentProfile?.karmaCoins || 100,
      reputationLevel: studentProfile?.reputationLevel || 1,
      phoneVerified: !!auth.currentUser.phoneNumber || !!profileData.phoneNumber,
      collegeVerified: !!profileData.collegeName && !!profileData.studentIdRollNo,
      dpdpConsent: true,
      updatedAt: serverTimestamp(),
      createdAt: studentProfile?.createdAt || serverTimestamp()
    };

    const docRef = doc(db, "student_profiles", uid);
    await setDoc(docRef, updatedData, { merge: true });
    setStudentProfile(updatedData);

    // Also link email in student_wallets
    if (email) {
      const walletRef = doc(db, "student_wallets", email.toLowerCase().trim());
      await setDoc(walletRef, {
        studentEmail: email.toLowerCase().trim(),
        balance: 100,
        totalEarned: 100,
        totalSpent: 0,
        reputationLevel: 1,
        unlockedPerks: ["Community Member Access"]
      }, { merge: true });
    }
  };

  const logout = async () => {
    await fbSignOut(auth);
    setUser(null);
    setStudentProfile(null);
  };

  const refreshProfile = async () => {
    if (auth.currentUser) {
      await fetchProfile(auth.currentUser.uid, auth.currentUser.email || "");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        studentProfile,
        loading,
        signInWithGoogle,
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
