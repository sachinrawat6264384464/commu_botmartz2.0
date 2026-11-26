import { NextRequest, NextResponse } from "next/server";
import { adminDb, hasAdminCredentials } from "@/lib/firebase-admin";
import { getSmtpTransporter } from "@/lib/mail-templates";
import { findRegistrationByCode } from "@/lib/hackathons-server";

function isValidHttpUrl(val: string): boolean {
  try {
    const u = new URL(val);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { uniqueCode, githubUrl, deployedUrl, notes } = body;

    const cleanCode = String(uniqueCode || "").trim().toUpperCase();
    const cleanGithub = String(githubUrl || "").trim();
    const cleanDeployed = String(deployedUrl || "").trim();

    if (!cleanCode || !cleanGithub || !cleanDeployed) {
      return NextResponse.json(
        { success: false, error: "Unique ID, GitHub link, and Deployed link are all required." },
        { status: 400 }
      );
    }

    if (!isValidHttpUrl(cleanGithub) || !isValidHttpUrl(cleanDeployed)) {
      return NextResponse.json(
        { success: false, error: "Please enter valid http:// or https:// URLs for GitHub and Deployed links." },
        { status: 400 }
      );
    }

    if (!adminDb || !hasAdminCredentials) {
      return NextResponse.json(
        { success: false, error: "Database connection unavailable." },
        { status: 503 }
      );
    }

    const found = await findRegistrationByCode(cleanCode);
    if (!found) {
      return NextResponse.json(
        { success: false, error: "Invalid Unique ID or 24-hour window already expired." },
        { status: 404 }
      );
    }

    const reg = found.data;
    const expiresMs = new Date(reg.expiresAt).getTime();
    if (!Number.isFinite(expiresMs) || Date.now() > expiresMs) {
      await found.ref.delete();
      return NextResponse.json(
        { success: false, error: "Submission rejected: 24-hour validity window has expired." },
        { status: 410 }
      );
    }

    const existingSub = await adminDb.collection("hackathon_submissions").doc(cleanCode).get();
    if (existingSub.exists) {
      return NextResponse.json(
        { success: false, error: "A project has already been submitted for this Unique ID." },
        { status: 409 }
      );
    }

    const submittedAt = new Date().toISOString();
    const submissionRecord = {
      id: cleanCode,
      uniqueCode: cleanCode,
      projectId: reg.projectId,
      projectTitle: reg.projectTitle,
      mode: reg.mode,
      teamName: reg.teamName,
      leader: {
        name: reg.leader?.name || reg.teamName,
        email: reg.leader?.email || "",
        phone: reg.leader?.phone || "",
      },
      members: Array.isArray(reg.members) ? reg.members : [],
      githubUrl: cleanGithub,
      deployedUrl: cleanDeployed,
      notes: String(notes || "").trim(),
      submittedAt,
      status: "Submitted" as const,
    };

    // Save into dedicated separate submissions table
    await adminDb.collection("hackathon_submissions").doc(cleanCode).set(submissionRecord);

    // Mark registration as submitted
    await found.ref.update({ submitted: true, submittedAt });

    // Send submission confirmation email ("Under 24 hours result will be declared")
    let emailSent = false;
    const leaderEmail = reg.leader?.email;
    if (leaderEmail) {
      try {
        const smtp = await getSmtpTransporter();
        if (smtp?.transporter) {
          await smtp.transporter.sendMail({
            from: `"Botmartz Hackathons" <${smtp.smtpUser}>`,
            to: leaderEmail,
            subject: `Project Submitted (${cleanCode}) | Results Within 24 Hours`,
            html: `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0f172a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="background:#070E54;padding:24px 32px;color:#ffffff;">
              <div style="font-size:12px;font-weight:800;letter-spacing:1px;color:#D9F83B;text-transform:uppercase;">Botmartz Online Hackathons</div>
              <h1 style="margin:8px 0 0;font-size:22px;font-weight:800;">Project Submission Received</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;font-size:14px;line-height:1.6;">
              <p style="margin:0 0 16px;">Hi <strong>${reg.leader?.name || reg.teamName}</strong>,</p>
              <p style="margin:0 0 18px;">Your hackathon submission for <strong>${reg.projectTitle}</strong> has been recorded successfully.</p>
              <div style="background:#f1f5f9;border-left:4px solid #D9F83B;padding:16px;border-radius:8px;margin-bottom:20px;">
                <div style="font-weight:800;color:#070E54;font-size:15px;">Under 24 hours, results will be declared.</div>
                <div style="font-size:12px;color:#475569;margin-top:4px;">Our engineering panel will review your GitHub repository and live deployment for Certificate, Job Recommendation &amp; Screening Round eligibility.</div>
              </div>
              <p style="margin:0 0 6px;"><strong>Unique ID:</strong> ${cleanCode}</p>
              <p style="margin:0 0 6px;"><strong>Team / Builder:</strong> ${reg.teamName}</p>
              <p style="margin:0 0 6px;"><strong>GitHub Repo:</strong> <a href="${cleanGithub}" style="color:#1D3189;">${cleanGithub}</a></p>
              <p style="margin:0;"><strong>Live Deployed Link:</strong> <a href="${cleanDeployed}" style="color:#1D3189;">${cleanDeployed}</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
          });
          emailSent = true;
        }
      } catch (mailErr) {
        console.warn("Hackathon submission email warning:", mailErr);
      }
    }

    return NextResponse.json({
      success: true,
      submission: submissionRecord,
      emailSent,
      message: "Project submitted successfully! Under 24 hours, results will be declared.",
    });
  } catch (err: any) {
    console.error("hackathon submit error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to submit hackathon project." },
      { status: 500 }
    );
  }
}
