import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { adjustStudentWallet } from "@/lib/wallet";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      uid,
      email,
      displayName,
      username,
      bio,
      personaType, // "STUDENT" | "WORKING_PROFESSIONAL" | "FOUNDER_BUILDER" | "RESEARCHER"
      // Student Fields
      collegeName,
      collegeCountry,
      degreeBranch,
      graduationYear,
      studentIdRollNo,
      // Working Professional Fields
      companyName,
      companyCountry,
      designationRole,
      yearsOfExperience,
      workDomain,
      // Common Fields
      country,
      cityLocation,
      timezone,
      githubUsername,
      linkedinUrl,
      portfolioUrl,
      primaryTechStack,
      aiSpecialization,
      dpdpConsent
    } = body;

    if (!uid || !email) {
      return NextResponse.json(
        { success: false, error: "UID and email are required to update profile." },
        { status: 400 }
      );
    }

    if (!adminDb) {
      return NextResponse.json(
        { success: false, error: "Database service unavailable." },
        { status: 500 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const profileRef = adminDb.collection("student_profiles").doc(uid);
    const existingSnap = await profileRef.get();
    const existingData = existingSnap.exists ? existingSnap.data() || {} : {};

    const effectivePersona = personaType || existingData.personaType || "STUDENT";

    // Calculate completeness score based on persona
    let score = 0;
    // 1. Identity (20%)
    if (displayName && (username || cleanEmail)) score += 20;

    // 2. Academic or Professional Credential (20%)
    if (effectivePersona === "WORKING_PROFESSIONAL" || effectivePersona === "FOUNDER_BUILDER") {
      const comp = companyName || existingData.companyName;
      const desig = designationRole || existingData.designationRole;
      if (comp && desig) score += 20;
    } else {
      const coll = collegeName || existingData.collegeName;
      const grad = graduationYear || existingData.graduationYear;
      if (coll && grad) score += 20;
    }

    // 3. GitHub (20%)
    if (githubUsername || existingData.githubUsername) score += 20;

    // 4. LinkedIn or Portfolio (20%)
    if (linkedinUrl || portfolioUrl || existingData.linkedinUrl || existingData.portfolioUrl) score += 20;

    // 5. Consent & Verification (20%)
    if (dpdpConsent !== false) score += 20;

    // Award bonus if 100% and not previously claimed
    const alreadyAwarded = Boolean(existingData.completedProfileBonusAwarded);
    let awardedNow = false;

    if (score === 100 && !alreadyAwarded) {
      await adjustStudentWallet(
        cleanEmail,
        100,
        "BONUS_PROFILE_COMPLETION",
        "Earned +100 Karma Coins for 100% Verified Builder Profile",
        `profile_100_${uid}`
      );
      awardedNow = true;
    }

    const cleanUsername = (username || cleanEmail.split("@")[0]).toLowerCase().replace(/[^a-z0-9_]/g, "");

    const profileData = {
      uid,
      email: cleanEmail,
      displayName: displayName || existingData.displayName || "Botmartz Builder",
      username: cleanUsername,
      bio: bio || existingData.bio || (effectivePersona === "WORKING_PROFESSIONAL" ? "AI & Software Engineer building production architectures." : "Student AI builder shipping real-world systems."),
      personaType: effectivePersona,
      
      // Student details
      collegeName: collegeName || existingData.collegeName || "",
      collegeCountry: collegeCountry || existingData.collegeCountry || country || "India",
      degreeBranch: degreeBranch || existingData.degreeBranch || (effectivePersona === "STUDENT" ? "B.Tech Computer Science" : ""),
      graduationYear: graduationYear || existingData.graduationYear || (effectivePersona === "STUDENT" ? "2026" : ""),
      studentIdRollNo: studentIdRollNo || existingData.studentIdRollNo || "",

      // Working Professional details
      companyName: companyName || existingData.companyName || "",
      companyCountry: companyCountry || existingData.companyCountry || country || "India",
      designationRole: designationRole || existingData.designationRole || (effectivePersona === "WORKING_PROFESSIONAL" ? "Software Engineer" : ""),
      yearsOfExperience: yearsOfExperience || existingData.yearsOfExperience || (effectivePersona === "WORKING_PROFESSIONAL" ? "2+ Years" : ""),
      workDomain: workDomain || existingData.workDomain || "AI / Backend Infrastructure",

      // Global Location & Timezone
      country: country || existingData.country || "India",
      cityLocation: cityLocation || existingData.cityLocation || "Indore, India",
      timezone: timezone || existingData.timezone || "IST (UTC+5:30)",

      // Links & Tech
      githubUsername: githubUsername ? githubUsername.replace("https://github.com/", "").replace("/", "").trim() : (existingData.githubUsername || ""),
      linkedinUrl: linkedinUrl || existingData.linkedinUrl || "",
      portfolioUrl: portfolioUrl || existingData.portfolioUrl || "",
      primaryTechStack: primaryTechStack || existingData.primaryTechStack || ["Next.js", "Python", "LangGraph", "FastAPI", "PostgreSQL"],
      aiSpecialization: aiSpecialization || existingData.aiSpecialization || "Autonomous AI Agents & Distributed Systems",
      
      dpdpConsent: dpdpConsent !== undefined ? dpdpConsent : (existingData.dpdpConsent ?? true),
      completenessScore: score,
      isVerifiedBuilder: score >= 80,
      completedProfileBonusAwarded: alreadyAwarded || awardedNow,
      reputationLevel: existingData.reputationLevel || (score === 100 ? 2 : 1),
      updatedAt: new Date().toISOString()
    };

    await profileRef.set(profileData, { merge: true });

    return NextResponse.json({
      success: true,
      message: "Builder profile updated successfully.",
      profile: profileData,
      score,
      bonusAwarded: awardedNow
    });
  } catch (err: any) {
    console.error("Profile update error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update profile." },
      { status: 500 }
    );
  }
}
