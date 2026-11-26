import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { adminDb, hasAdminCredentials } from "@/lib/firebase-admin";
import { getSmtpTransporter } from "@/lib/mail-templates";
import {
  generateHackathonUniqueCode,
  SOLO_HACKATHON_FEE,
  TEAM_HACKATHON_FEE,
  HackathonMember,
} from "@/lib/hackathons";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      projectId,
      projectTitle,
      mode,
      teamName,
      leader,
      members,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !projectId || !mode || !leader?.email || !leader?.name) {
      return NextResponse.json(
        { success: false, error: "Missing required payment or registration fields." },
        { status: 400 }
      );
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (key_secret && razorpay_signature && !String(razorpay_order_id).startsWith("order_hack_mock_")) {
      const generated_signature = crypto
        .createHmac("sha256", key_secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (generated_signature !== razorpay_signature) {
        return NextResponse.json(
          { success: false, error: "Payment verification failed: Invalid cryptographic signature." },
          { status: 400 }
        );
      }
    }

    const cleanMode: "solo" | "team" = mode === "team" ? "team" : "solo";
    const amountPaid = cleanMode === "team" ? TEAM_HACKATHON_FEE : SOLO_HACKATHON_FEE;
    const cleanLeaderEmail = String(leader.email).toLowerCase().trim();
    const cleanLeaderName = String(leader.name).trim();
    const cleanTeamName =
      cleanMode === "team" ? String(teamName || "").trim() || `${cleanLeaderName}'s Team` : cleanLeaderName;

    const cleanMembers: HackathonMember[] =
      cleanMode === "team" && Array.isArray(members)
        ? members
            .filter((m: any) => m?.name?.trim() && m?.email?.trim())
            .slice(0, 3)
            .map((m: any) => ({
              name: String(m.name).trim(),
              email: String(m.email).toLowerCase().trim(),
              phone: m.phone ? String(m.phone).trim() : "",
              role: m.role ? String(m.role).trim() : "Member",
            }))
        : [{ name: cleanLeaderName, email: cleanLeaderEmail, phone: leader.phone || "", role: "Solo Builder" }];

    const uniqueCode = generateHackathonUniqueCode();
    const nowMs = Date.now();
    const createdAt = new Date(nowMs).toISOString();
    const expiresAt = new Date(nowMs + 24 * 60 * 60 * 1000).toISOString();

    const registrationRecord = {
      id: uniqueCode,
      uniqueCode,
      projectId,
      projectTitle: projectTitle || "Online Hackathon Track",
      mode: cleanMode,
      teamName: cleanTeamName,
      leader: {
        name: cleanLeaderName,
        email: cleanLeaderEmail,
        phone: String(leader.phone || "").trim(),
        organization: String(leader.organization || "").trim(),
        github: String(leader.github || "").trim(),
      },
      members: cleanMembers,
      amountPaid,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      paymentStatus: "paid" as const,
      createdAt,
      expiresAt,
      submitted: false,
    };

    if (adminDb && hasAdminCredentials) {
      // Save inside this specific project's individual registrations table (subcollection)
      await adminDb
        .collection("hackathon_projects")
        .doc(projectId)
        .collection("registrations")
        .doc(uniqueCode)
        .set(registrationRecord);

      // Also log into orders & payments ledgers
      await adminDb.collection("orders").add({
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        itemName: `Hackathon (${cleanMode.toUpperCase()}): ${projectTitle || projectId}`,
        itemCategory: "ONLINE_HACKATHON",
        amount: amountPaid,
        currency: "INR",
        email: cleanLeaderEmail,
        name: cleanLeaderName,
        phone: leader.phone || "",
        status: "PAID",
        paymentMethod: "RAZORPAY",
        metadata: { uniqueCode, projectId, mode: cleanMode, teamName: cleanTeamName },
        createdAt,
      });

      await adminDb.collection("payments").add({
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        amount: amountPaid,
        currency: "INR",
        email: cleanLeaderEmail,
        name: cleanLeaderName,
        method: "Razorpay (Hackathon Entry)",
        status: "COMPLETED",
        createdAt,
      });
    }

    // Send confirmation email to Team Leader / Solo Builder with Unique ID & 24-hour validity
    let emailSent = false;
    try {
      const smtp = await getSmtpTransporter();
      if (smtp?.transporter) {
        const deadlineFormatted = new Date(expiresAt).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          dateStyle: "medium",
          timeStyle: "short",
        });

        await smtp.transporter.sendMail({
          from: `"Botmartz Hackathons" <${smtp.smtpUser}>`,
          to: cleanLeaderEmail,
          subject: `Hackathon Entry Confirmed | Unique ID: ${uniqueCode}`,
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
              <h1 style="margin:8px 0 0;font-size:22px;font-weight:800;">Registration &amp; Payment Confirmed</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;font-size:14px;line-height:1.6;">
              <p style="margin:0 0 16px;">Hi <strong>${cleanLeaderName}</strong>,</p>
              <p style="margin:0 0 20px;">Your <strong>${cleanMode === "team" ? "Team" : "Solo"}</strong> entry for <strong>${projectTitle || projectId}</strong> is confirmed (₹${amountPaid} Paid).</p>
              <div style="background:#070E54;border-radius:12px;padding:20px;text-align:center;margin-bottom:20px;">
                <div style="font-size:11px;color:#cbd5e1;text-transform:uppercase;letter-spacing:1px;">Your Hackathon Unique ID</div>
                <div style="font-size:26px;font-weight:900;color:#D9F83B;letter-spacing:2px;margin-top:6px;">${uniqueCode}</div>
                <div style="font-size:12px;color:#e2e8f0;margin-top:8px;">Valid for 24 Hours (Until ${deadlineFormatted} IST)</div>
              </div>
              <p style="margin:0 0 8px;"><strong>${cleanMode === "team" ? "Team Name" : "Participant"}:</strong> ${cleanTeamName}</p>
              <p style="margin:0 0 8px;"><strong>Selected Project:</strong> ${projectTitle || projectId}</p>
              <p style="margin:0 0 20px;"><strong>Important:</strong> This Unique ID will automatically expire and be removed after 24 hours. Submit your working GitHub repo &amp; deployed live link on the Hackathons page before the 24-hour timer ends.</p>
              <p style="margin:0;font-size:12px;color:#64748b;">Perks included for eligible submissions: Verified Hackathon Certificate, Job Recommendation Letter &amp; Direct Screening Round Eligibility.</p>
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
      console.warn("Hackathon registration email warning:", mailErr);
    }

    return NextResponse.json({
      success: true,
      registration: registrationRecord,
      emailSent,
    });
  } catch (err: any) {
    console.error("verify-and-enroll error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to complete hackathon enrollment." },
      { status: 500 }
    );
  }
}
