import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getSmtpTransporter } from "@/lib/mail-templates";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      collegeOrCompany,
      experienceLevel,
      track,
      amount = 0,
      paymentId = "MANUAL_DIRECT",
      orderId = `ORD_DIR_${Date.now()}`
    } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Valid email address is required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanName = name || "Builder";
    const paymentTimestamp = new Date().toISOString();
    const invoiceNumber = `INV-BMZ-${Date.now().toString().slice(-6)}`;
    const checkInCode = `WS-${Math.floor(10000 + Math.random() * 90000)}`;

    if (adminDb) {
      // 1. Record in workshop_registrations
      await adminDb.collection("workshop_registrations").add({
        registrationId: `REG_${Date.now().toString().slice(-6)}`,
        name: cleanName,
        email: cleanEmail,
        phone: phone || "",
        collegeOrCompany: collegeOrCompany || "Independent Builder",
        experienceLevel: experienceLevel || "Intermediate",
        track: track || "Production AI Engineering & Multi-Agent Workshop",
        amount: Number(amount) || 0,
        currency: "INR",
        orderId,
        paymentId,
        checkInCode,
        invoiceNumber,
        status: amount > 0 ? "PAID" : "FREE_REGISTERED",
        paymentMethod: amount > 0 ? "RAZORPAY" : "FREE_TIER",
        createdAt: paymentTimestamp
      });

      // 2. Record in orders & payments if paid
      if (amount > 0) {
        await adminDb.collection("orders").add({
          orderId,
          paymentId,
          invoiceNumber,
          itemName: track || "Production AI Engineering Workshop",
          itemCategory: "WORKSHOP_PASS",
          amount: Number(amount),
          currency: "INR",
          email: cleanEmail,
          name: cleanName,
          phone: phone || "",
          status: "PAID",
          paymentMethod: "RAZORPAY",
          createdAt: paymentTimestamp
        });
      }
    }

    // Send confirmation email
    try {
      const smtp = await getSmtpTransporter();
      if (smtp && cleanEmail) {
        const fromEmail = smtp.smtpUser || process.env.SMTP_USER || "team@botmartz.com";
        const emailSubject = `Registration Confirmed: ${track || "Production AI Engineering Workshop"} (${checkInCode})`;
        const htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 24px;">
              <img src="https://raw.githubusercontent.com/soham2710/botmartz-community/main/public/logo.png" alt="Botmartz Logo" style="height: 60px; margin-bottom: 12px;" />
              <h1 style="color: #0066FF; margin: 0; font-size: 24px; font-weight: 800;">BOTMARTZ COMMUNITY</h1>
              <p style="color: #64748b; font-size: 12px; text-transform: uppercase; margin-top: 4px;">Welcome to the next generation of builders</p>
            </div>

            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
              <h2 style="color: #0f172a; margin: 0 0 12px 0; font-size: 18px;">Welcome, ${cleanName}!</h2>
              <p style="color: #475569; font-size: 14px; margin: 0 0 16px 0; line-height: 1.5;">
                We are thrilled to welcome you to the <strong>Botmartz Community</strong>. You have successfully registered for our upcoming workshop. Botmartz is a premier community for elite builders and AI enthusiasts. Here you'll gain real skills, build real projects, and make a real impact.
              </p>
              <h3 style="color: #0f172a; margin: 0 0 8px 0; font-size: 16px;">Community Features:</h3>
              <ul style="color: #475569; font-size: 14px; margin: 0 0 16px 0; padding-left: 20px; line-height: 1.6;">
                <li><strong>Exclusive AI Engineering Workshops</strong> taught by industry experts.</li>
                <li><strong>Private WhatsApp Group</strong> for networking, updates, and Q&A.</li>
                <li><strong>Project Collaboration</strong> with peers to build production-ready applications.</li>
                <li><strong>Career Opportunities</strong> and continuous skill enhancement.</li>
              </ul>
              
              <div style="text-align: center; margin-top: 20px;">
                <a href="https://chat.whatsapp.com/DkzKwpjuktaCYAofOtMlAQ" style="display: inline-block; background-color: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">Join our WhatsApp Group</a>
              </div>
            </div>

            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin-bottom: 20px; text-align: center;">
              <h2 style="color: #166534; margin: 0 0 8px 0; font-size: 18px;">✔ Your Workshop Seat is Confirmed</h2>
              <p style="color: #15803d; font-size: 13px; margin: 0;">Pass Check-in Code: <strong>${checkInCode}</strong></p>
            </div>

            <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 24px;">
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; color: #64748b;">Attendee Name</td>
                <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #0f172a;">${cleanName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; color: #64748b;">Attendee Email</td>
                <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #0f172a;">${cleanEmail}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; color: #64748b;">Track</td>
                <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #0066FF;">${track || "Production AI Engineering"}</td>
              </tr>
            </table>

            <p style="color: #94a3b8; font-size: 11px; text-align: center; margin-top: 32px;">
              Botmartz AI Solution Pvt Ltd &bull; Indore, India
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
      console.warn("SMTP workshop registration mail non-fatal error:", mailErr);
    }

    return NextResponse.json({
      success: true,
      checkInCode,
      invoiceNumber,
      message: "Workshop registration successful!"
    });
  } catch (err: any) {
    console.error("Workshop registration error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to register for workshop." },
      { status: 500 }
    );
  }
}
