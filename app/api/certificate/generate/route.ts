import { NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function POST(request: Request) {
  try {
    const { name, eventTitle, certificateId, issueDate } = await request.json();

    const recipientName = name || "Candidate Builder";
    const title = eventTitle || "Virtual AI & Cloud Engineering Internship";
    const certId = certificateId || `CERT-BM-${Math.floor(100000 + Math.random() * 900000)}`;
    const date = issueDate || new Date().toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });

    // Create a new PDF document (A4 Landscape)
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([842, 595]);
    const { width, height } = page.getSize();

    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // 1. Clean Crisp Off-White Background & Double Indigo Frame
    page.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: rgb(0.99, 0.99, 1),
    });

    // Outer Indigo Frame
    page.drawRectangle({
      x: 16,
      y: 16,
      width: width - 32,
      height: height - 32,
      borderColor: rgb(0.31, 0.27, 0.9), // Indigo #4F46E5
      borderWidth: 6,
    });

    // Inner Fine Border Line
    page.drawRectangle({
      x: 24,
      y: 24,
      width: width - 48,
      height: height - 48,
      borderColor: rgb(0.78, 0.82, 0.98),
      borderWidth: 1.5,
    });

    // 2. Top Header Branding: BOTMARTZ AI SOLUTIONS
    page.drawText("Botmartz AI Solutions", {
      x: 55,
      y: height - 60,
      size: 18,
      font: fontBold,
      color: rgb(0.2, 0.15, 0.6),
    });

    page.drawText(`Certificate ID: ${certId}`, {
      x: width - 230,
      y: height - 60,
      size: 10,
      font: fontBold,
      color: rgb(0.35, 0.4, 0.5),
    });

    // 3. Certificate Header
    const certTitle = "CERTIFICATE OF COMPLETION";
    page.drawText(certTitle, {
      x: width / 2 - 140,
      y: height - 120,
      size: 16,
      font: fontBold,
      color: rgb(0.45, 0.5, 0.6),
    });

    const displayTitle = title.toUpperCase();
    page.drawText(displayTitle, {
      x: Math.max(55, width / 2 - (displayTitle.length * 5.5)),
      y: height - 150,
      size: 18,
      font: fontBold,
      color: rgb(0.1, 0.12, 0.2),
    });

    // 4. Recipient Section
    page.drawText("ISSUED TO", {
      x: width / 2 - 30,
      y: height - 195,
      size: 10,
      font: fontBold,
      color: rgb(0.5, 0.55, 0.65),
    });

    page.drawText(recipientName, {
      x: width / 2 - (recipientName.length * 8.5),
      y: height - 240,
      size: 28,
      font: fontBold,
      color: rgb(0.08, 0.1, 0.25),
    });

    // 5. Description Paragraph
    const descLine1 = `Awarded for the successful completion of the ${title}, validating practical skills in using`;
    const descLine2 = `production AI tools, cloud engineering architecture, and 45 days of verified proof-of-work.`;
    
    page.drawText(descLine1, {
      x: width / 2 - 280,
      y: height - 280,
      size: 10,
      font: fontRegular,
      color: rgb(0.3, 0.35, 0.45),
    });

    page.drawText(descLine2, {
      x: width / 2 - 270,
      y: height - 296,
      size: 10,
      font: fontRegular,
      color: rgb(0.3, 0.35, 0.45),
    });

    // 6. 5 Scalloped Skill Badge Emblems (Matching Reference Screenshot 2!)
    const badgeLabels = ["FOUNDATIONS & AI", "PYTHON AGENTS", "MCP ARCH", "LINUX & GCP", "AWS SERVICES"];
    const badgeColors = [
      rgb(0.9, 0.35, 0.55), // Pink
      rgb(0.95, 0.5, 0.2),  // Orange
      rgb(0.55, 0.3, 0.85), // Purple
      rgb(0.9, 0.3, 0.35),  // Coral/Red
      rgb(0.2, 0.6, 0.95)   // Sky Blue
    ];

    const startX = width / 2 - 160;
    badgeLabels.forEach((label, idx) => {
      const row = idx < 3 ? 0 : 1;
      const colInRow = idx < 3 ? idx : idx - 3;
      const bx = row === 0 ? startX + colInRow * 110 : startX + 55 + colInRow * 110;
      const by = row === 0 ? 175 : 125;

      // Scalloped Badge Circle
      page.drawCircle({
        x: bx,
        y: by,
        size: 18,
        color: badgeColors[idx],
      });

      page.drawCircle({
        x: bx,
        y: by,
        size: 14,
        borderColor: rgb(1, 1, 1),
        borderWidth: 1.5,
      });

      page.drawText(label, {
        x: bx - 28,
        y: by - 26,
        size: 6.5,
        font: fontBold,
        color: rgb(0.2, 0.25, 0.35),
      });
    });

    // 7. Date of Issue & CPD Seal Left, Signatory Right
    page.drawText("Date of issue", {
      x: 65,
      y: 85,
      size: 9,
      font: fontBold,
      color: rgb(0.45, 0.5, 0.6),
    });

    page.drawText(date, {
      x: 65,
      y: 68,
      size: 11,
      font: fontBold,
      color: rgb(0.1, 0.15, 0.25),
    });

    page.drawText("CPD CERTIFIED • BOTMARTZ VERIFIED", {
      x: 65,
      y: 50,
      size: 8,
      font: fontBold,
      color: rgb(0.31, 0.27, 0.9),
    });

    // Signatory Right: Soham Sharma
    page.drawText("Soham Sharma", {
      x: width - 230,
      y: 85,
      size: 13,
      font: fontBold,
      color: rgb(0.08, 0.1, 0.2),
    });

    page.drawText("Founder & Lead Architect", {
      x: width - 230,
      y: 70,
      size: 9,
      font: fontBold,
      color: rgb(0.31, 0.27, 0.9),
    });

    page.drawText("Botmartz AI Solutions", {
      x: width - 230,
      y: 56,
      size: 8.5,
      font: fontRegular,
      color: rgb(0.4, 0.45, 0.55),
    });

    // Bottom Verification URL
    page.drawText(`Verify authenticity at community.botmartz.com/certificates?query=${certId}`, {
      x: width / 2 - 200,
      y: 30,
      size: 8,
      font: fontRegular,
      color: rgb(0.5, 0.55, 0.65),
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
