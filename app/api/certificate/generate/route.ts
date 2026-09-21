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

    // 1. Clean Crisp Light-Navy Background Border (Matching Premium Certificate Aesthetic)
    page.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: rgb(0.98, 0.99, 1), // Crisp Off-white
    });

    // Elegant Outer Blue Border Frame
    page.drawRectangle({
      x: 18,
      y: 18,
      width: width - 36,
      height: height - 36,
      borderColor: rgb(0, 0.4, 1),
      borderWidth: 6,
    });

    page.drawRectangle({
      x: 26,
      y: 26,
      width: width - 52,
      height: height - 52,
      borderColor: rgb(0.7, 0.85, 1),
      borderWidth: 1.5,
    });

    // 2. Top Header Branding: BOTMARTZ AI SOLUTIONS
    page.drawText("Botmartz AI Solutions", {
      x: 60,
      y: height - 65,
      size: 20,
      font: fontBold,
      color: rgb(0, 0.4, 1),
    });

    page.drawText(`Certificate ID: ${certId}`, {
      x: width - 240,
      y: height - 65,
      size: 11,
      font: fontBold,
      color: rgb(0.3, 0.35, 0.45),
    });

    // 3. Certificate Title
    const certTitle = "CERTIFICATE OF COMPLETION";
    page.drawText(certTitle, {
      x: width / 2 - 170,
      y: height - 130,
      size: 22,
      font: fontBold,
      color: rgb(0.1, 0.15, 0.25),
    });

    page.drawText("PROOF-OF-WORK VIRTUAL AI INTERNSHIP PROGRAM", {
      x: width / 2 - 210,
      y: height - 155,
      size: 14,
      font: fontBold,
      color: rgb(0, 0.4, 1),
    });

    // 4. Recipient Section
    page.drawText("ISSUED TO", {
      x: width / 2 - 35,
      y: height - 200,
      size: 11,
      font: fontBold,
      color: rgb(0.5, 0.55, 0.65),
    });

    page.drawText(recipientName.toUpperCase(), {
      x: width / 2 - (recipientName.length * 9),
      y: height - 245,
      size: 28,
      font: fontBold,
      color: rgb(0.05, 0.1, 0.2),
    });

    // 5. Description Paragraph
    const descLine1 = `Awarded for the successful completion of the ${title}, validating practical skills in using`;
    const descLine2 = `production AI tools, cloud engineering architecture, and 45 days of verified proof-of-work.`;
    
    page.drawText(descLine1, {
      x: width / 2 - 290,
      y: height - 285,
      size: 11,
      font: fontRegular,
      color: rgb(0.3, 0.35, 0.4),
    });

    page.drawText(descLine2, {
      x: width / 2 - 280,
      y: height - 302,
      size: 11,
      font: fontRegular,
      color: rgb(0.3, 0.35, 0.4),
    });

    // 6. Draw 5 Curriculum & Skill Badges at Bottom Center (Matching User Screenshot 3!)
    const badgeLabels = ["FOUNDATIONS & AI", "LINUX & GCP", "AWS SERVICES", "PYTHON AGENTS", "MCP ARCH"];
    const badgeColors = [
      rgb(0, 0.72, 0.8),   // Teal
      rgb(0.9, 0.35, 0.4),  // Coral
      rgb(0.5, 0.3, 0.8),   // Purple
      rgb(0.95, 0.6, 0.2),  // Amber
      rgb(0.2, 0.6, 0.9)    // Sky Blue
    ];

    const startX = width / 2 - 180;
    badgeLabels.forEach((label, idx) => {
      const bx = startX + idx * 75;
      const by = 160;

      // Outer Badge Circle
      page.drawCircle({
        x: bx,
        y: by,
        size: 22,
        color: badgeColors[idx],
      });

      page.drawCircle({
        x: bx,
        y: by,
        size: 19,
        borderColor: rgb(1, 1, 1),
        borderWidth: 1.5,
      });

      // Label under badge
      page.drawText(label, {
        x: bx - 28,
        y: by - 32,
        size: 7,
        font: fontBold,
        color: rgb(0.2, 0.25, 0.35),
      });
    });

    // 7. Issue Date & Signatory (Soham Sharma)
    page.drawText("Date of Issue", {
      x: 70,
      y: 90,
      size: 10,
      font: fontBold,
      color: rgb(0.4, 0.45, 0.55),
    });

    page.drawText(date, {
      x: 70,
      y: 72,
      size: 12,
      font: fontBold,
      color: rgb(0.1, 0.15, 0.25),
    });

    // Founder Signatory: Soham Sharma
    page.drawText("Soham Sharma", {
      x: width - 240,
      y: 90,
      size: 14,
      font: fontBold,
      color: rgb(0.05, 0.1, 0.2),
    });

    page.drawText("Founder & Lead Architect", {
      x: width - 240,
      y: 74,
      size: 10,
      font: fontBold,
      color: rgb(0, 0.4, 1),
    });

    page.drawText("Botmartz AI Solutions", {
      x: width - 240,
      y: 60,
      size: 9,
      font: fontRegular,
      color: rgb(0.4, 0.45, 0.55),
    });

    // Bottom Verification Stamp & Ledger
    page.drawText(`Verify authenticity at community.botmartz.com/certificates?query=${certId}`, {
      x: width / 2 - 200,
      y: 35,
      size: 9,
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
