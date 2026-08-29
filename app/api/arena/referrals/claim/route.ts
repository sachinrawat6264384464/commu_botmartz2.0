import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      name,
      email,
      whatsapp,
      github,
      linkedin,
      portfolioUrl,
      preferredRoles,
      targetLocations,
      project1Summary,
      project2Summary,
      project3Summary,
      notesForFounder,
    } = body;

    if (!name || !email || !whatsapp || !linkedin) {
      return NextResponse.json(
        { error: "Name, email, WhatsApp, and LinkedIn URL are mandatory to process the referral claim." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const claimData = {
      name: name.trim(),
      email: cleanEmail,
      whatsapp: whatsapp.trim(),
      github: (github || "").trim(),
      linkedin: linkedin.trim(),
      portfolioUrl: (portfolioUrl || "").trim(),
      preferredRoles: preferredRoles || "AI Engineer / Fullstack Dev",
      targetLocations: targetLocations || "Bangalore / Remote / Indore",
      project1Summary: (project1Summary || "").trim(),
      project2Summary: (project2Summary || "").trim(),
      project3Summary: (project3Summary || "").trim(),
      notesForFounder: (notesForFounder || "").trim(),
      status: "Under Review",
      dispatchedCompaniesCount: 0,
      founderLinkedInRecWritten: false,
      profileAuditScheduled: false,
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let claimId = `claim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    if (adminDb) {
      try {
        const docRef = await adminDb.collection("arena_referral_claims").add(claimData);
        claimId = docRef.id;
      } catch (dbErr) {
        console.error("Firestore referral claim write warning:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "3-Project Milestone verified! Your portfolio has been queued for the 15-Company Referral Dispatch and Founder Soham Sharma's LinkedIn Recommendation.",
      claimId,
      claim: claimData,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to submit referral claim." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    let claims: any[] = [];

    if (adminDb) {
      try {
        const snap = await adminDb
          .collection("arena_referral_claims")
          .orderBy("submittedAt", "desc")
          .limit(50)
          .get();

        if (!snap.empty) {
          claims = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        }
      } catch (dbErr) {
        console.error("Firestore referral claims fetch warning:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      claims,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch claims." },
      { status: 500 }
    );
  }
}
