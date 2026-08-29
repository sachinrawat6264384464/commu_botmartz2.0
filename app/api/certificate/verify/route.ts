import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

const SAMPLE_CERTIFICATES = [
  {
    id: "cert-0812",
    certificateId: "CERT-2026-0812",
    name: "Ananya Sharma",
    email: "ananya.ai@outlook.com",
    eventTitle: "AI Frontier 2026: The Production AI Summit",
    issueDate: "August 2026",
    status: "Verified & Authentic"
  },
  {
    id: "cert-0813",
    certificateId: "CERT-2026-0813",
    name: "Vikram Mehta",
    email: "vmehta@techcorp.io",
    eventTitle: "AI Frontier 2026 Summit",
    issueDate: "August 2026",
    status: "Verified & Authentic"
  },
  {
    id: "cert-0814",
    certificateId: "CERT-2026-0814",
    name: "Sneha Patel",
    email: "sneha.p@gmail.com",
    eventTitle: "Hands-on AI Agent Accelerator Cohort",
    issueDate: "July 2026",
    status: "Verified & Authentic"
  }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json({ error: "Certificate ID or Email is required" }, { status: 400 });
    }

    const trimmed = query.trim();
    const lower = trimmed.toLowerCase();

    // 1. Try Live Firestore Lookup if available
    try {
      const certRef = adminDb.collection("certificates");
      let snapshot = await certRef.where("certificateId", "==", trimmed).get();

      if (snapshot.empty) {
        snapshot = await certRef.where("email", "==", lower).get();
      }

      if (!snapshot.empty) {
        const certDoc = snapshot.docs[0];
        return NextResponse.json({ certificate: { id: certDoc.id, ...certDoc.data(), status: "Verified & Authentic" } });
      }

      // Check in attendees collection
      const attSnap = await adminDb.collection("attendees").where("email", "==", lower).get();
      if (!attSnap.empty) {
        const attData = attSnap.docs[0].data();
        return NextResponse.json({
          certificate: {
            id: attSnap.docs[0].id,
            certificateId: attData.checkInCode || `CERT-${attSnap.docs[0].id.substring(0, 8).toUpperCase()}`,
            name: attData.name,
            email: attData.email,
            eventTitle: attData.eventTitle || "AI Frontier 2026",
            issueDate: "August 2026",
            status: "Verified & Authentic"
          }
        });
      }
    } catch (dbErr) {
      console.warn("Firestore query fallback:", dbErr);
    }

    // 2. Sample Registry Fallback
    const match = SAMPLE_CERTIFICATES.find(c => 
      c.certificateId.toLowerCase() === lower || c.email.toLowerCase() === lower
    );

    if (match) {
      return NextResponse.json({ certificate: match });
    }

    return NextResponse.json({ error: "No certificate found matching this ID or email." }, { status: 404 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Verification lookup error" }, { status: 500 });
  }
}
