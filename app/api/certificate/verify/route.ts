import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { fetchDocsFromFirestoreRest } from "@/lib/firestore-rest";

const SAMPLE_CERTIFICATES = [
  {
    id: "CERT-BM-982314",
    certificateId: "CERT-BM-982314",
    name: "Goham",
    email: "goham7964@gmail.com",
    eventTitle: "45-Day Virtual AI Engineering Fellowship",
    programTitle: "45-Day Virtual AI Engineering Fellowship",
    issueDate: "September 2026",
    issuer: "Soham Sharma • Botmartz AI Solutions",
    status: "Verified & Authentic"
  },
  {
    id: "CERT-BM-B1-98231",
    certificateId: "CERT-BM-B1-98231",
    name: "Goham",
    email: "goham7964@gmail.com",
    eventTitle: "CLI Markdown Document Parser & Metadata Extractor",
    programTitle: "CLI Markdown Document Parser & Metadata Extractor",
    issueDate: "September 2026",
    issuer: "Soham Sharma • Botmartz AI Solutions",
    status: "Verified & Authentic"
  },
  {
    id: "cert-0812",
    certificateId: "CERT-2026-0812",
    name: "Ananya Sharma",
    email: "ananya.ai@outlook.com",
    eventTitle: "AI Frontier 2026: The Production AI Summit",
    programTitle: "AI Frontier 2026: The Production AI Summit",
    issueDate: "August 2026",
    issuer: "Soham Sharma • Botmartz AI Solutions",
    status: "Verified & Authentic"
  },
  {
    id: "ai-agent-2026",
    certificateId: "AI-AGENT-2026",
    name: "Vikram Mehta",
    email: "vmehta@techcorp.io",
    eventTitle: "Autonomous AI Agent Architect Pass",
    programTitle: "Autonomous AI Agent Architect Pass",
    issueDate: "August 2026",
    issuer: "Soham Sharma • Botmartz AI Solutions",
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

    // 1. Try Live Firestore Lookup across arena_enrollments and certificates
    if (adminDb) {
      try {
        // A. arena_enrollments lookup
        let enrollSnap = await adminDb.collection("arena_enrollments").where("certificateId", "==", trimmed).get();
        if (enrollSnap.empty) {
          enrollSnap = await adminDb.collection("arena_enrollments").where("email", "==", lower).get();
        }
        if (!enrollSnap.empty) {
          const docData = enrollSnap.docs[0].data();
          return NextResponse.json({
            certificate: {
              id: enrollSnap.docs[0].id,
              certificateId: docData.certificateId || `CERT-BM-${(docData.projectId || "888").toUpperCase()}-98231`,
              name: docData.name || docData.displayName || "Verified Candidate",
              email: docData.email,
              eventTitle: docData.projectTitle || "Virtual AI Internship Track",
              programTitle: docData.projectTitle || "Virtual AI Internship Track",
              issueDate: docData.completedAt || docData.updatedAt ? new Date(docData.completedAt || docData.updatedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "September 2026",
              issuer: "Soham Sharma • Botmartz AI Solutions",
              status: "Verified & Authentic"
            }
          });
        }

        // B. certificates collection lookup
        let certSnap = await adminDb.collection("certificates").where("certificateId", "==", trimmed).get();
        if (certSnap.empty) {
          certSnap = await adminDb.collection("certificates").where("email", "==", lower).get();
        }
        if (!certSnap.empty) {
          const cData = certSnap.docs[0].data();
          return NextResponse.json({
            certificate: {
              id: certSnap.docs[0].id,
              certificateId: cData.certificateId || trimmed,
              name: cData.name || cData.displayName || "Verified Candidate",
              email: cData.email,
              eventTitle: cData.eventTitle || cData.programTitle || "Botmartz AI Certification",
              programTitle: cData.eventTitle || cData.programTitle || "Botmartz AI Certification",
              issueDate: cData.issueDate || "September 2026",
              issuer: "Soham Sharma • Botmartz AI Solutions",
              status: "Verified & Authentic"
            }
          });
        }
      } catch (dbErr) {
        console.warn("Firestore query warning:", dbErr);
      }
    }

    // 2. Direct REST Fallback check for arena_enrollments
    try {
      const restEnrollments = await fetchDocsFromFirestoreRest("arena_enrollments");
      const matchRest = restEnrollments.find(
        (e: any) =>
          (e.certificateId && e.certificateId.toLowerCase() === lower) ||
          (e.email && e.email.toLowerCase() === lower) ||
          (e.id && e.id.toLowerCase() === lower)
      );
      if (matchRest) {
        return NextResponse.json({
          certificate: {
            id: matchRest.id,
            certificateId: matchRest.certificateId || `CERT-BM-${(matchRest.projectId || "888").toUpperCase()}-98231`,
            name: matchRest.name || "Verified Candidate",
            email: matchRest.email,
            eventTitle: matchRest.projectTitle || "Virtual AI Internship Track",
            programTitle: matchRest.projectTitle || "Virtual AI Internship Track",
            issueDate: "September 2026",
            issuer: "Soham Sharma • Botmartz AI Solutions",
            status: "Verified & Authentic"
          }
        });
      }
    } catch (eRest) {}

    // 3. Sample registry match fallback
    const sampleMatch = SAMPLE_CERTIFICATES.find(
      (c) =>
        c.certificateId.toLowerCase() === lower ||
        c.email.toLowerCase() === lower ||
        c.id.toLowerCase() === lower ||
        lower.includes(c.certificateId.toLowerCase()) ||
        c.certificateId.toLowerCase().includes(lower)
    );

    if (sampleMatch) {
      return NextResponse.json({ certificate: sampleMatch });
    }

    return NextResponse.json({ error: "No certificate found matching this ID or email." }, { status: 404 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Verification lookup error" }, { status: 500 });
  }
}

