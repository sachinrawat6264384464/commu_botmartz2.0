import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getSmtpTransporter, buildArenaEnrollmentEmail } from "@/lib/mail-templates";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")?.toLowerCase().trim();

    if (!email) {
      return NextResponse.json({ error: "Email query param is required." }, { status: 400 });
    }

    let enrollments: any[] = [];

    if (adminDb) {
      try {
        const snap = await adminDb
          .collection("arena_enrollments")
          .where("email", "==", email)
          .orderBy("createdAt", "desc")
          .get();

        enrollments = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      } catch (dbErr) {
        console.warn("Firestore query error (falling back):", dbErr);
        // Fallback without index
        const snap = await adminDb
          .collection("arena_enrollments")
          .where("email", "==", email)
          .get();
        enrollments = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      }
    }

    return NextResponse.json({ success: true, enrollments });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch enrollments." }, { status: 500 });
  }
}

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
      tier: "Free Explorer", // Default tier, upgraded to "Verified Fellow" on payment
      isPaidInternship: false,
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

        // Also update student profile with enrolled project
        const userQuery = await adminDb.collection("student_profiles").where("email", "==", cleanEmail).limit(1).get();
        if (!userQuery.empty) {
          const userDoc = userQuery.docs[0];
          const existingEnrolled = userDoc.data().enrolledProjectIds || [];
          if (!existingEnrolled.includes(projectId)) {
            await userDoc.ref.set(
              {
                enrolledProjectIds: [...existingEnrolled, projectId],
                lastEnrolledProject: { id: projectId, title: projectTitle, enrolledAt: new Date().toISOString() },
                updatedAt: new Date().toISOString(),
              },
              { merge: true }
            );
          }
        }
      } catch (dbErr) {
        console.error("Firestore enrollment write warning:", dbErr);
      }
    }

    // Trigger Asynchronous Transactional Onboarding Email
    try {
      const smtp = await getSmtpTransporter();
      if (smtp?.transporter) {
        const emailHtml = buildArenaEnrollmentEmail({
          name: name.trim(),
          email: cleanEmail,
          projectTitle: projectTitle || "Selected Arena Project",
          difficulty: difficulty || "Hard",
          projectId,
          teamType: teamType || "Solo Shipper",
        });

        // Fire and forget or await without blocking response
        smtp.transporter.sendMail({
          from: `"Botmartz Builders Arena" <${smtp.smtpUser}>`,
          to: cleanEmail,
          subject: `⚡ Slot Confirmed: ${projectTitle || "Virtual AI Internship Track"} | Botmartz`,
          html: emailHtml,
        }).catch((mailErr) => {
          console.warn("Could not dispatch onboarding email:", mailErr);
        });
      }
    } catch (mailCatch) {
      console.warn("Mail transporter error:", mailCatch);
    }

    return NextResponse.json({
      success: true,
      message: "Successfully registered for the Botmartz Builder Arena & 1-Month Internship Track! An onboarding email with your project PRD and next steps has been sent.",
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
