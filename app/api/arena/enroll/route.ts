import { NextResponse } from "next/server";
import { adminDb, hasAdminCredentials } from "@/lib/firebase-admin";
import { getSmtpTransporter, buildArenaEnrollmentEmail } from "@/lib/mail-templates";
import { ARENA_PROJECTS } from "@/lib/arena-projects";
import { emitEvent } from "@/lib/email/automation-engine";
import { addDocToFirestoreRest, fetchDocsFromFirestoreRest, saveDocToFirestoreRest } from "@/lib/firestore-rest";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")?.toLowerCase().trim();

    if (!email) {
      return NextResponse.json({ error: "Email query param is required." }, { status: 400 });
    }

    let enrollments: any[] = [];

    if (adminDb && hasAdminCredentials) {
      try {
        const snap = await adminDb
          .collection("arena_enrollments")
          .where("email", "==", email)
          .orderBy("createdAt", "desc")
          .get();

        enrollments = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      } catch (dbErr) {
        console.warn("Firestore query error (falling back to REST):", dbErr);
        try {
          const snap = await adminDb
            .collection("arena_enrollments")
            .where("email", "==", email)
            .get();
          enrollments = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        } catch (e2) {}
      }
    }

    // Direct Firestore Database REST API fallback
    if (enrollments.length === 0) {
      enrollments = await fetchDocsFromFirestoreRest("arena_enrollments", "email", email);
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

    if (!name || !email || !projectId) {
      return NextResponse.json(
        { error: "Name, email, and project selection are required." },
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
    const targetProject = ARENA_PROJECTS.find((p) => p.id === projectId);
    const targetDifficulty = difficulty || targetProject?.difficulty || "Hard";

    // Multi-tier enrollment limits:
    // - Baby Step tier: Max 2 active projects (strictly within Baby Step tier).
    // - Non-Baby Step tiers: Max 1 active project.
    // - No mixing Baby Step and non-Baby Step active enrollments.
    if (adminDb && hasAdminCredentials) {
      try {
        const existingSnap = await adminDb
          .collection("arena_enrollments")
          .where("email", "==", cleanEmail)
          .get();

        const activeDocs: any[] = existingSnap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((e: any) => e.status !== "Completed" && e.status !== "Finished" && e.status !== "Cancelled" && e.status !== "Unenrolled");

        // 1. Check if already enrolled in this exact project
        const alreadyEnrolled = activeDocs.find((e) => e.projectId === projectId);
        if (alreadyEnrolled) {
          return NextResponse.json(
            { error: `You are already enrolled in "${alreadyEnrolled.projectTitle}". Visit your profile or daily log workspace to continue.` },
            { status: 400 }
          );
        }

        const isTargetBabyStep = targetDifficulty === "Baby Step";
        const hasBabyStepActive = activeDocs.some((e) => e.difficulty === "Baby Step");
        const hasNonBabyStepActive = activeDocs.some((e) => e.difficulty !== "Baby Step");

        if (isTargetBabyStep) {
          if (hasNonBabyStepActive) {
            const nonBabyStepDoc = activeDocs.find((e) => e.difficulty !== "Baby Step");
            return NextResponse.json(
              { error: `Tier Constraint: You are currently enrolled in a non-Baby Step project ("${nonBabyStepDoc?.projectTitle || "Active Project"}"). You cannot enroll in Baby Step projects while active in a non-Baby Step project. Please complete or leave your active project first.` },
              { status: 400 }
            );
          }
          const babyStepCount = activeDocs.filter((e) => e.difficulty === "Baby Step").length;
          if (babyStepCount >= 2) {
            return NextResponse.json(
              { error: `Baby Step Limit Reached: You can enroll in a maximum of 2 Baby Step projects at a time. Please complete or leave an active project first.` },
              { status: 400 }
            );
          }
        } else {
          // Target is Non-Baby Step
          if (hasBabyStepActive) {
            return NextResponse.json(
              { error: `Tier Constraint: You currently have active Baby Step enrollments. You cannot enroll in non-Baby Step projects while active in Baby Step projects. Please complete or leave your Baby Step projects first.` },
              { status: 400 }
            );
          }
          if (activeDocs.length >= 1) {
            return NextResponse.json(
              { error: `Single Project Limit: You are currently enrolled in "${activeDocs[0].projectTitle}". You must complete or leave your active project before enrolling in a new one.` },
              { status: 400 }
            );
          }
        }
      } catch (checkErr) {
        console.warn("Active enrollment verification check warning:", checkErr);
      }
    }

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
      difficulty: targetDifficulty,
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
    let savedToFirestore = false;

    if (adminDb && hasAdminCredentials) {
      try {
        const docRef = await adminDb.collection("arena_enrollments").add(enrollmentData);
        id = docRef.id;
        savedToFirestore = true;

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

    // Direct Firestore Database REST API fallback to guarantee database persistence
    if (!savedToFirestore) {
      await saveDocToFirestoreRest("arena_enrollments", id, { id, ...enrollmentData });
    }

    // Trigger Dual-Layer Asynchronous Transactional Onboarding Email (Non-blocking)
    (async () => {
      try {
        // 1. Emit automation event
        await emitEvent("USER_COMPLETED_ACTION", {
          email: cleanEmail,
          name: name.trim(),
          metadata: {
            action: "PROJECT_ENROLLED",
            projectTitle: projectTitle || targetProject?.title || "Selected Arena Project",
            projectId,
            difficulty: targetDifficulty,
            teamType: teamType || "Solo Shipper",
            enrollmentId: id,
            enrolledAt: enrollmentData.createdAt,
            overview: targetProject?.overview || "",
            productionSla: targetProject?.productionSla || "",
          }
        }).catch((evtErr) => console.warn("Automation event PROJECT_ENROLLED warning:", evtErr));

        // 2. Direct SMTP Mailer Fallback
        const smtp = await getSmtpTransporter();
        if (smtp?.transporter) {
          const emailHtml = buildArenaEnrollmentEmail({
            name: name.trim(),
            email: cleanEmail,
            projectTitle: projectTitle || targetProject?.title || "Selected Arena Project",
            difficulty: targetDifficulty,
            projectId,
            teamType: teamType || "Solo Shipper",
            enrollmentId: id,
            enrolledAt: enrollmentData.createdAt,
            category: targetProject?.domain || "AI Systems",
            overview: targetProject?.overview || "",
            productionSla: targetProject?.productionSla || "",
          });

          smtp.transporter.sendMail({
            from: `"Botmartz Builders Arena" <${smtp.smtpUser}>`,
            to: cleanEmail,
            subject: `⚡ Slot Confirmed: ${projectTitle || targetProject?.title || "Virtual AI Internship Track"} | Botmartz`,
            html: emailHtml,
          }).catch((mailErr) => {
            console.warn("Could not dispatch onboarding email:", mailErr);
          });
        }
      } catch (mailCatch) {
        console.warn("Mail transporter error:", mailCatch);
      }
    })();

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
