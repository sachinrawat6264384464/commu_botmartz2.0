import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { adminDb } from "@/lib/firebase-admin";
import { adjustStudentWallet } from "@/lib/wallet";
import { getSmtpTransporter } from "@/lib/mail-templates";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount, // In INR
      itemName,
      itemCategory, // "WORKSHOP_PASS" | "FELLOWSHIP_PASS" | "EVENT_TICKET" | "WALLET_TOPUP"
      customerName,
      customerEmail,
      customerPhone,
      metadata
    } = body;

    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_secret) {
      return NextResponse.json(
        { success: false, error: "Payment verification configuration missing." },
        { status: 500 }
      );
    }

    // Verify HMAC-SHA256 Signature
    if (razorpay_signature) {
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

    const cleanEmail = (customerEmail || "").toLowerCase().trim();
    const cleanName = customerName || "Builder";
    const paymentTimestamp = new Date().toISOString();
    const invoiceNumber = `INV-BMZ-${Date.now().toString().slice(-6)}`;
    const checkInCode = `WS-${Math.floor(10000 + Math.random() * 90000)}`;

    if (adminDb) {
      // 1. Record Order in Firestore
      await adminDb.collection("orders").add({
        orderId: razorpay_order_id || `ORD_${Date.now()}`,
        paymentId: razorpay_payment_id || `PAY_${Date.now()}`,
        invoiceNumber,
        itemName: itemName || "Production AI Engineering Workshop Pass",
        itemCategory: itemCategory || "WORKSHOP_PASS",
        amount: Number(amount) || 0,
        currency: "INR",
        email: cleanEmail,
        name: cleanName,
        phone: customerPhone || "",
        status: "PAID",
        paymentMethod: "RAZORPAY",
        metadata: metadata || {},
        createdAt: paymentTimestamp
      });

      // 2. Record Payment in Firestore Payments Ledger
      await adminDb.collection("payments").add({
        paymentId: razorpay_payment_id || `PAY_${Date.now()}`,
        orderId: razorpay_order_id || `ORD_${Date.now()}`,
        amount: Number(amount) || 0,
        currency: "INR",
        email: cleanEmail,
        name: cleanName,
        method: "Razorpay (Cards/UPI/Netbanking)",
        status: "COMPLETED",
        createdAt: paymentTimestamp
      });

      // 3. Save Dedicated Workshop Registration
      const isWorkshop =
        itemCategory === "WORKSHOP_PASS" ||
        itemName?.toLowerCase().includes("workshop") ||
        itemName?.toLowerCase().includes("accelerator") ||
        itemName?.toLowerCase().includes("bootcamp");

      if (isWorkshop) {
        await adminDb.collection("workshop_registrations").add({
          registrationId: `REG_${Date.now().toString().slice(-6)}`,
          name: cleanName,
          email: cleanEmail,
          phone: customerPhone || "",
          collegeOrCompany: metadata?.college || metadata?.collegeOrCompany || "Independent Builder",
          experienceLevel: metadata?.experienceLevel || "Intermediate",
          track: itemName || "Production AI Engineering & Multi-Agent Workshop",
          amount: Number(amount) || 0,
          currency: "INR",
          orderId: razorpay_order_id || `ORD_${Date.now()}`,
          paymentId: razorpay_payment_id || `PAY_${Date.now()}`,
          checkInCode,
          invoiceNumber,
          status: "PAID",
          paymentMethod: "RAZORPAY",
          metadata: metadata || {},
          createdAt: paymentTimestamp
        });
      }

      // 4. Handle Profile Upgrade & Wallet Bonus (+300 Karma Coins)
      try {
        const profileQuery = await adminDb
          .collection("student_profiles")
          .where("email", "==", cleanEmail)
          .limit(1)
          .get();

        if (!profileQuery.empty) {
          const profileRef = profileQuery.docs[0].ref;
          await profileRef.set(
            {
              isPaidFellow: true,
              isWorkshopEnrolled: true,
              workshopTrack: itemName || "Production AI Engineering Workshop",
              paidAmount: Number(amount) || 0,
              paidAt: paymentTimestamp,
              reputationLevel: 3,
              updatedAt: paymentTimestamp
            },
            { merge: true }
          );
        }
      } catch (pErr) {
        console.warn("Profile fellowship upgrade non-fatal warning:", pErr);
      }

      // Award +300 Bonus Karma Coins to Student Wallet
      try {
        await adjustStudentWallet(
          cleanEmail,
          300,
          "EARN",
          `Bonus +300 Karma Coins for Enrolling in ${itemName || "AI Workshop"}`,
          razorpay_payment_id
        );
      } catch (wErr) {
        console.warn("Wallet bonus credit non-fatal warning:", wErr);
      }

      // 5. Handle Karma Coins Wallet Top-up
      if (itemCategory === "WALLET_TOPUP" || metadata?.coinsAmount) {
        const coinsToAdd =
          Number(metadata?.coinsAmount) ||
          (Number(amount) === 99
            ? 500
            : Number(amount) === 299
            ? 2000
            : Number(amount) === 599
            ? 5000
            : Number(amount) * 5);
        try {
          await adjustStudentWallet(
            cleanEmail,
            coinsToAdd,
            "EARN",
            `Purchased ${itemName || "Karma Credit Pack"} (+${coinsToAdd} Coins for ₹${amount})`,
            razorpay_payment_id
          );
        } catch (wErr) {
          console.warn("Wallet topup credit warning:", wErr);
        }
      }
    }

    // 6. Send Email Confirmation via SMTP
    try {
      const smtp = await getSmtpTransporter();
      if (smtp && cleanEmail) {
        const fromEmail = smtp.smtpUser || process.env.SMTP_USER || "team@botmartz.com";
        const emailSubject = `Pass Confirmed: ${itemName || "Botmartz Workshop Pass"} (${invoiceNumber})`;
        const htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h1 style="color: #0066FF; margin: 0; font-size: 24px; font-weight: 800;">BOTMARTZ</h1>
              <p style="color: #64748b; font-size: 12px; text-transform: uppercase; margin-top: 4px; letter-spacing: 1px;">Workshop Pass &amp; Official Verification</p>
            </div>

            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin-bottom: 20px; text-align: center;">
              <h2 style="color: #166534; margin: 0 0 8px 0; font-size: 18px;">✔ Registration &amp; Payment Successful (₹${amount})</h2>
              <p style="color: #15803d; font-size: 13px; margin: 0;">Payment ID: <strong>${razorpay_payment_id}</strong></p>
            </div>

            <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 24px;">
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; color: #64748b;">Invoice Number</td>
                <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #0f172a;">${invoiceNumber}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; color: #64748b;">Workshop / Track</td>
                <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #0f172a;">${itemName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; color: #64748b;">Registered Attendee</td>
                <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #0f172a;">${cleanName} (${cleanEmail})</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; color: #64748b;">Total Amount Paid</td>
                <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #0066FF; font-size: 15px;">₹${amount}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #64748b;">Check-in Pass Code</td>
                <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #7c3aed; font-size: 16px;">${checkInCode}</td>
              </tr>
            </table>

            <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
              <h3 style="color: #0f172a; margin: 0 0 6px 0; font-size: 14px;">Next Steps:</h3>
              <p style="color: #475569; font-size: 12px; line-height: 1.6; margin: 0;">
                1. Keep your check-in code <strong>${checkInCode}</strong> handy.<br/>
                2. Live workshop meeting links and GitHub starter repositories will be shared 24 hours prior to the session.<br/>
                3. +300 Karma Coins have been credited to your Botmartz account.
              </p>
            </div>

            <div style="text-align: center; margin-top: 24px;">
              <a href="https://community.botmartz.com/profile" style="display: inline-block; background-color: #0066FF; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: bold; font-size: 13px;">
                Open Student Dashboard &rarr;
              </a>
            </div>

            <p style="color: #94a3b8; font-size: 11px; text-align: center; margin-top: 32px;">
              Botmartz AI Solution Pvt Ltd &bull; 100% Verified Payment Gateway &bull; Indore, India
            </p>
          </div>
        `;

        await smtp.transporter.sendMail({
          from: `"Botmartz Workshops" <${fromEmail}>`,
          to: cleanEmail,
          subject: emailSubject,
          html: htmlContent
        });
      }
    } catch (mailErr) {
      console.warn("SMTP confirmation mail warning:", mailErr);
    }

    return NextResponse.json({
      success: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      invoiceNumber,
      checkInCode,
      message: "Workshop registration and payment successfully verified! Pass activated and receipt dispatched."
    });
  } catch (err: any) {
    console.error("Payment verification error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to verify payment." },
      { status: 500 }
    );
  }
}
