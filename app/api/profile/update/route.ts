import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      uid,
      email,
      displayName,
      username,
      bio,
      collegeName,
      degreeBranch,
      graduationYear,
      studentIdRollNo,
      githubUsername,
      linkedinUrl,
      portfolioUrl,
      cityLocation,
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

    const profileRef = adminDb.collection("student_profiles").doc(uid);
    const existingSnap = await profileRef.get();
    const existingData = existingSnap.exists ? existingSnap.data() || {} : {};

    // Calculate completeness score
    let score = 0;
    if (displayName && username) score += 20;
    if (collegeName && graduationYear) score += 20;
    if (githubUsername) score += 20;
    if (linkedinUrl) score += 20;
    if (dpdpConsent) score += 20;

    // Check if 100% bonus was already claimed
    let karmaCoins = existingData.karmaCoins || 100;
    let awardedBonus = existingData.completedProfileBonusAwarded || false;

    if (score === 100 && !awardedBonus) {
      karmaCoins += 100; // Award +100 Karma coins for full 100% profile completion
      awardedBonus = true;

      // Log wallet transaction
      try {
        await adminDb.collection("wallet_transactions").add({
          studentEmail: email,
          studentUid: uid,
          amountCoins: 100,
          type: "BONUS_PROFILE_COMPLETION",
          description: "Earned +100 Karma Coins for 100% Verified Builder Profile",
          createdAt: new Date().toISOString()
        });
      } catch (e) {
        console.warn("Wallet log warning:", e);
      }
    }

    const cleanUsername = (username || email.split("@")[0]).toLowerCase().replace(/[^a-z0-9_]/g, "");

    const profileData = {
      uid,
      email: email.toLowerCase().trim(),
      displayName: displayName || existingData.displayName || "Botmartz Builder",
      username: cleanUsername,
      bio: bio || existingData.bio || "Student AI builder shipping real-world systems.",
      collegeName: collegeName || existingData.collegeName || "",
      degreeBranch: degreeBranch || existingData.degreeBranch || "B.Tech Computer Science",
      graduationYear: graduationYear || existingData.graduationYear || "2026",
      studentIdRollNo: studentIdRollNo || existingData.studentIdRollNo || "",
      githubUsername: githubUsername ? githubUsername.replace("https://github.com/", "").replace("/", "").trim() : (existingData.githubUsername || ""),
      linkedinUrl: linkedinUrl || existingData.linkedinUrl || "",
      portfolioUrl: portfolioUrl || existingData.portfolioUrl || "",
      cityLocation: cityLocation || existingData.cityLocation || "Indore / Remote India",
      primaryTechStack: primaryTechStack || existingData.primaryTechStack || ["Next.js", "Python", "LangGraph", "FastAPI"],
      aiSpecialization: aiSpecialization || existingData.aiSpecialization || "Autonomous Agent Architect",
      dpdpConsent: dpdpConsent !== undefined ? dpdpConsent : (existingData.dpdpConsent ?? true),
      completenessScore: score,
      isVerifiedBuilder: score >= 80,
      karmaCoins,
      completedProfileBonusAwarded: awardedBonus,
      reputationLevel: existingData.reputationLevel || (score === 100 ? 2 : 1),
      updatedAt: new Date().toISOString()
    };

    await profileRef.set(profileData, { merge: true });

    return NextResponse.json({
      success: true,
      message: "Builder profile updated successfully.",
      profile: profileData,
      score,
      bonusAwarded: score === 100 && !existingData.completedProfileBonusAwarded
    });
  } catch (err: any) {
    console.error("Profile update error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update profile." },
      { status: 500 }
    );
  }
}
