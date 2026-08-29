import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      name,
      email,
      whatsapp,
      discord,
      github,
      linkedin,
      instagram,
      role,
      projectId,
      projectTitle,
      difficulty,
      teamType,
      teamName,
      experience,
      dpdpConsent,
    } = body;

    if (!name || !email || !whatsapp || !projectId) {
      return NextResponse.json(
        { error: "Name, email, WhatsApp, and project selection are required." },
        { status: 400 }
      );
    }

    if (!dpdpConsent) {
      return NextResponse.json(
        { error: "DPDP Act data protection consent is mandatory to participate in the arena." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const enrollmentData = {
      name: name.trim(),
      email: cleanEmail,
      whatsapp: whatsapp.trim(),
      discord: (discord || "").trim(),
      github: (github || "").trim(),
      linkedin: (linkedin || "").trim(),
      instagram: (instagram || "").trim(),
      role: role || "Developer",
      projectId,
      projectTitle: projectTitle || "Selected Arena Project",
      difficulty: difficulty || "Hard",
      teamType: teamType || "Solo",
      teamName: (teamName || "").trim(),
      experience: experience || "Student / Learner",
      dpdpConsent: Boolean(dpdpConsent),
      dpdpConsentTimestamp: new Date().toISOString(),
      status: "Active",
      streak: 0,
      stars: 0,
      xp: 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let id = `enroll_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    if (adminDb) {
      try {
        const docRef = await adminDb.collection("arena_enrollments").add(enrollmentData);
        id = docRef.id;
      } catch (dbErr) {
        console.error("Firestore enrollment write warning:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Successfully registered for the Botmartz Builder Arena & 30-Day Internship Track!",
      enrollmentId: id,
      enrollment: enrollmentData,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to process enrollment." },
      { status: 500 }
    );
  }
}
