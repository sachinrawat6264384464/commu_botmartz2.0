import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { adminDb, hasAdminCredentials } from "@/lib/firebase-admin";
import { getSmtpTransporter } from "@/lib/mail-templates";
import {
  DEFAULT_EXTEND_DAYS,
  DEFAULT_EXTEND_PRICE,
  DEFAULT_ROADMAP_PRICE,
  DEFAULT_ROADMAP_VALIDITY_DAYS,
  ensureManagedRoadmaps,
  generateRoadmapUniqueCode,
} from "@/lib/roadmaps-server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      action = "unlock",
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      roadmapId,
      uniqueCode: existingCode,
      userName,
      userEmail,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return NextResponse.json(
        { success: false, error: "Missing required Razorpay payment IDs." },
        { status: 400 }
      );
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (key_secret && razorpay_signature && !String(razorpay_order_id).startsWith("order_road_mock_")) {
      const generated = crypto
        .createHmac("sha256", key_secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");
      if (generated !== razorpay_signature) {
        return NextResponse.json(
          { success: false, error: "Payment signature verification failed." },
          { status: 400 }
        );
      }
    }

    const nowMs = Date.now();
    const nowIso = new Date(nowMs).toISOString();

    if (action === "extend") {
      const cleanCode = String(existingCode || "").trim().toUpperCase();
      if (!cleanCode || !adminDb || !hasAdminCredentials) {
        return NextResponse.json(
          { success: false, error: "Valid Unique Code and database connection required." },
          { status: 400 }
        );
      }

      const ref = adminDb.collection("roadmap_purchases").doc(cleanCode);
      const snap = await ref.get();
      if (!snap.exists) {
        return NextResponse.json(
          { success: false, error: "Unique Code not found." },
          { status: 404 }
        );
      }

      const data = snap.data() as any;
      const baseTime = Math.max(nowMs, new Date(data.expiresAt || 0).getTime());
      const rmSnap = await adminDb.collection("career_roadmaps").doc(data.roadmapId).get();
      const rmData = rmSnap.exists ? (rmSnap.data() as any) : null;
      const extendDays = Number(rmData?.extendDays || DEFAULT_EXTEND_DAYS);
      const extendPrice = Number(rmData?.extendPrice || DEFAULT_EXTEND_PRICE);

      const newExpiresAt = new Date(baseTime + extendDays * 24 * 60 * 60 * 1000).toISOString();
      const newAmountPaid = (Number(data.amountPaid) || 0) + extendPrice;
      const newExtCount = (Number(data.extensionCount) || 0) + 1;

      await ref.update({
        expiresAt: newExpiresAt,
        amountPaid: newAmountPaid,
        extensionCount: newExtCount,
        lastExtendedAt: nowIso,
      });

      await adminDb.collection("payments").add({
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        amount: extendPrice,
        currency: "INR",
        email: data.userEmail,
        name: data.userName,
        method: "Razorpay (Roadmap +2 Days Extend)",
        status: "COMPLETED",
        createdAt: nowIso,
      });

      try {
        const smtp = await getSmtpTransporter();
        if (smtp?.transporter && data.userEmail) {
          const validUntil = new Date(newExpiresAt).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            dateStyle: "medium",
            timeStyle: "short",
          });
          await smtp.transporter.sendMail({
            from: `"Botmartz Roadmaps" <${smtp.smtpUser}>`,
            to: data.userEmail,
            subject: `Roadmap Validity Extended (+${extendDays} Days) | Code: ${cleanCode}`,
            html: `<div style="font-family:sans-serif;padding:24px;color:#0f172a;">
              <h2 style="color:#070E54;">Validity Extended by +${extendDays} Days</h2>
              <p>Hi <strong>${data.userName}</strong>, your ₹${extendPrice} extension payment for <strong>${data.roadmapTitle}</strong> is confirmed.</p>
              <p><strong>Unique Code:</strong> <span style="font-size:18px;font-weight:800;color:#1D3189;">${cleanCode}</span></p>
              <p><strong>New Expiry:</strong> ${validUntil} IST</p>
              <p>Enter this Unique Code in the top input bar on <strong>/arena/roadmaps</strong> to view your unlocked roadmap.</p>
            </div>`,
          });
        }
      } catch (mailErr) {
        console.warn("Roadmap extend email warning:", mailErr);
      }

      return NextResponse.json({
        success: true,
        purchase: { ...data, expiresAt: newExpiresAt, amountPaid: newAmountPaid, extensionCount: newExtCount },
      });
    }

    // Initial Unlock Payment
    const roadmaps = await ensureManagedRoadmaps();
    const target = roadmaps.find((r) => r.id === roadmapId);
    if (!target) {
      return NextResponse.json({ success: false, error: "Roadmap not found." }, { status: 404 });
    }

    const cleanName = String(userName || "Builder").trim();
    const cleanEmail = String(userEmail || "").toLowerCase().trim();
    const validityDays = Number(target.validityDays || DEFAULT_ROADMAP_VALIDITY_DAYS);
    const pricePaid = Number(target.price || DEFAULT_ROADMAP_PRICE);
    const uniqueCode = generateRoadmapUniqueCode();
    const expiresAt = new Date(nowMs + validityDays * 24 * 60 * 60 * 1000).toISOString();

    const purchaseRecord = {
      id: uniqueCode,
      uniqueCode,
      roadmapId: target.id,
      roadmapTitle: target.roleName,
      domain: target.category,
      userName: cleanName,
      userEmail: cleanEmail,
      amountPaid: pricePaid,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      createdAt: nowIso,
      expiresAt,
      extensionCount: 0,
    };

    if (adminDb && hasAdminCredentials) {
      await adminDb.collection("roadmap_purchases").doc(uniqueCode).set(purchaseRecord);

      await adminDb.collection("orders").add({
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        itemName: `Career Roadmap: ${target.roleName}`,
        itemCategory: "CAREER_ROADMAP",
        amount: pricePaid,
        currency: "INR",
        email: cleanEmail,
        name: cleanName,
        status: "PAID",
        paymentMethod: "RAZORPAY",
        metadata: { uniqueCode, roadmapId: target.id },
        createdAt: nowIso,
      });

      await adminDb.collection("payments").add({
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        amount: pricePaid,
        currency: "INR",
        email: cleanEmail,
        name: cleanName,
        method: "Razorpay (Career Roadmap)",
        status: "COMPLETED",
        createdAt: nowIso,
      });
    }

    let emailSent = false;
    try {
      const smtp = await getSmtpTransporter();
      if (smtp?.transporter && cleanEmail) {
        const validUntil = new Date(expiresAt).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          dateStyle: "medium",
          timeStyle: "short",
        });

        await smtp.transporter.sendMail({
          from: `"Botmartz Roadmaps" <${smtp.smtpUser}>`,
          to: cleanEmail,
          subject: `Roadmap Unlocked (${target.roleName}) | Code: ${uniqueCode}`,
          html: `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0f172a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="background:#070E54;padding:24px 32px;color:#ffffff;">
              <div style="font-size:12px;font-weight:800;color:#D9F83B;text-transform:uppercase;">Botmartz Career Roadmaps</div>
              <h1 style="margin:8px 0 0;font-size:20px;font-weight:800;">Payment Confirmed &amp; Unique Code Ready</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;font-size:14px;line-height:1.6;">
              <p>Hi <strong>${cleanName}</strong>,</p>
              <p>Thank you for unlocking <strong>${target.roleName}</strong> (₹${pricePaid} Paid).</p>
              <div style="background:#070E54;border-radius:12px;padding:20px;text-align:center;margin:20px 0;">
                <div style="font-size:11px;color:#cbd5e1;text-transform:uppercase;letter-spacing:1px;">Your Roadmap Unique Code</div>
                <div style="font-size:26px;font-weight:900;color:#D9F83B;letter-spacing:2px;margin-top:6px;">${uniqueCode}</div>
                <div style="font-size:12px;color:#e2e8f0;margin-top:8px;">Valid for ${validityDays} Days (Until ${validUntil} IST)</div>
              </div>
              <p><strong>How to Access:</strong> Go to the <strong>Career Roadmaps</strong> page and enter this Unique Code in the top unlock input box. After ${validityDays} days, this code becomes invalid — you can extend validity by +${DEFAULT_EXTEND_DAYS} days anytime for ₹${DEFAULT_EXTEND_PRICE}.</p>
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
      console.warn("Roadmap unlock email warning:", mailErr);
    }

    return NextResponse.json({
      success: true,
      purchase: purchaseRecord,
      roadmap: target,
      emailSent,
    });
  } catch (err: any) {
    console.error("Roadmap verify-payment error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Payment verification failed." },
      { status: 500 }
    );
  }
}
