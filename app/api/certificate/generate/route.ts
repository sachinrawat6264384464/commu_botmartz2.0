import { NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function POST(request: Request) {
  try {
    const { name, eventTitle, certificateId, issueDate } = await request.json();

    const recipientName = name || "Community Attendee";
    const title = eventTitle || "AI Frontier 2026 Summit";
    const certId = certificateId || `CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const date = issueDate || "August 2026";

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([842, 595]); // A4 Landscape
    const { width, height } = page.getSize();

    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Background Navy
    page.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: rgb(0.02, 0.04, 0.08),
    });

    // Decorative Neon Border
    page.drawRectangle({
      x: 20,
      y: 20,
      width: width - 40,
      height: height - 40,
      borderColor: rgb(0, 0.72, 0.94),
      borderWidth: 2,
    });

    page.drawRectangle({
      x: 28,
      y: 28,
      width: width - 56,
      height: height - 56,
      borderColor: rgb(0, 0.4, 1),
      borderWidth: 1,
    });

    // Header Branding
    page.drawText("BOTMARTZ AI SOLUTIONS", {
      x: 60,
      y: height - 80,
      size: 14,
      font: fontBold,
      color: rgb(0, 0.72, 0.94),
    });

    page.drawText("CERTIFICATE OF PARTICIPATION & EXCELLENCE", {
      x: 60,
      y: height - 140,
      size: 26,
      font: fontBold,
      color: rgb(1, 1, 1),
    });

    page.drawText("This official credential certifies that", {
      x: 60,
      y: height - 190,
      size: 14,
      font: fontRegular,
      color: rgb(0.6, 0.7, 0.8),
    });

    // Recipient Name
    page.drawText(recipientName.toUpperCase(), {
      x: 60,
      y: height - 245,
      size: 32,
      font: fontBold,
      color: rgb(0, 0.72, 0.94),
    });

    // Event Info
    page.drawText(`has successfully participated in and completed all keynote sessions of`, {
      x: 60,
      y: height - 295,
      size: 13,
      font: fontRegular,
      color: rgb(0.8, 0.85, 0.9),
    });

    page.drawText(title, {
      x: 60,
      y: height - 330,
      size: 18,
      font: fontBold,
      color: rgb(1, 1, 1),
    });

    // Verification ID and Footer
    page.drawText(`Certificate ID: ${certId}`, {
      x: 60,
      y: 80,
      size: 11,
      font: fontBold,
      color: rgb(0, 0.72, 0.94),
    });

    page.drawText(`Issued: ${date} · Verified at community.botmartz.com/certificates`, {
      x: 60,
      y: 60,
      size: 10,
      font: fontRegular,
      color: rgb(0.5, 0.6, 0.7),
    });

    // Signatures
    page.drawText("Soham Sharma", {
      x: width - 260,
      y: 85,
      size: 14,
      font: fontBold,
      color: rgb(1, 1, 1),
    });

    page.drawText("Founder & AI Director, Botmartz", {
      x: width - 260,
      y: 65,
      size: 10,
      font: fontRegular,
      color: rgb(0.6, 0.7, 0.8),
    });

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="botmartz-certificate-${certId}.pdf"`,
      },
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Failed to generate certificate PDF" }, { status: 500 });
  }
}
