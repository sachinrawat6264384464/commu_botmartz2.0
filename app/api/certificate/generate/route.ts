import { NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function POST(request: Request) {
  try {
    const { name, eventTitle, certificateId, issueDate } = await request.json();

    const recipientName = name || "Kabir Mehta";
    const title = eventTitle || "AI MASTERY CERTIFICATE PROGRAM";
    const certId = certificateId || `CERT-BM-${Math.floor(100000 + Math.random() * 900000)}`;
    const date = issueDate || "9 August 2026";

    // Create a new PDF document (A4 Landscape)
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([842, 595]);
    const { width, height } = page.getSize();

    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontTimesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    const fontTimes = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const fontTimesItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanBoldItalic);

    // 1. Base White Canvas
    page.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: rgb(1, 1, 1),
    });

    // 2. Left Blue Ribbon Column (#0066FF)
    const ribbonWidth = 200;
    page.drawRectangle({
      x: 0,
      y: 0,
      width: ribbonWidth,
      height,
      color: rgb(0, 0.4, 1), // #0066FF
    });

    // Badges Earned Header in Blue Ribbon
    page.drawText("Badges Earned", {
      x: 25,
      y: height - 55,
      size: 16,
      font: fontBold,
      color: rgb(1, 1, 1),
    });

    page.drawText("Verified Skill Milestones", {
      x: 25,
      y: height - 72,
      size: 8,
      font: fontRegular,
      color: rgb(0.8, 0.9, 1),
    });

    // Draw 5 Skill Circles vertically down the blue column
    const badgeLabels = ["Foundations & AI", "Python Agents", "MCP Architecture", "Linux & Cloud GCP", "AWS Services"];
    const badgeColors = [
      rgb(0.95, 0.35, 0.55),
      rgb(0.95, 0.55, 0.2),
      rgb(0.6, 0.35, 0.9),
      rgb(0.95, 0.3, 0.35),
      rgb(1, 0.78, 0)
    ];

    badgeLabels.forEach((label, idx) => {
      const by = height - 120 - idx * 60;
      page.drawCircle({
        x: 42,
        y: by,
        size: 16,
        color: badgeColors[idx],
      });
      page.drawCircle({
        x: 42,
        y: by,
        size: 12,
        borderColor: rgb(1, 1, 1),
        borderWidth: 1.5,
      });
      page.drawText(label, {
        x: 68,
        y: by - 4,
        size: 9,
        font: fontBold,
        color: rgb(1, 1, 1),
      });
    });

    // 3. Right Yellow Accent Bar (#FFC700)
    page.drawRectangle({
      x: width - 16,
      y: 0,
      width: 16,
      height,
      color: rgb(1, 0.78, 0),
    });

    // 4. Main Body Content (Center-Right)
    const contentCenterX = ribbonWidth + (width - ribbonWidth - 16) / 2;

    // Top Header: Botmartz AI Solutions Left, Certificate ID Right
    page.drawText("Botmartz", {
      x: ribbonWidth + 35,
      y: height - 55,
      size: 22,
      font: fontTimesItalic,
      color: rgb(0, 0.4, 1),
    });

    page.drawText("AI SOLUTIONS", {
      x: ribbonWidth + 125,
      y: height - 52,
      size: 9,
      font: fontBold,
      color: rgb(0.5, 0.55, 0.65),
    });

    page.drawText(`CERTIFICATE ID: ${certId}`, {
      x: width - 210,
      y: height - 52,
      size: 9,
      font: fontBold,
      color: rgb(0.4, 0.45, 0.55),
    });

    // Certificate Title Headers
    page.drawText("Certificate", {
      x: contentCenterX - 85,
      y: height - 125,
      size: 34,
      font: fontBold,
      color: rgb(0, 0.4, 1),
    });

    page.drawText("of Completion", {
      x: contentCenterX - 65,
      y: height - 155,
      size: 20,
      font: fontBold,
      color: rgb(0, 0.4, 1),
    });

    // Recipient Section
    page.drawText("This is to proudly certify that", {
      x: contentCenterX - 80,
      y: height - 210,
      size: 11,
      font: fontRegular,
      color: rgb(0.35, 0.4, 0.5),
    });

    page.drawText(recipientName, {
      x: contentCenterX - (recipientName.length * 10),
      y: height - 260,
      size: 38,
      font: fontBold,
      color: rgb(0, 0.4, 1),
    });

    // Blue Underline
    page.drawLine({
      start: { x: contentCenterX - 110, y: height - 275 },
      end: { x: contentCenterX + 110, y: height - 275 },
      thickness: 2,
      color: rgb(0, 0.4, 1),
    });

    // Description
    const descLine1 = `for the successful completion of the ${title}, validating practical skills in using`;
    const descLine2 = `production AI tools, cloud engineering architecture, and 45 days of verified proof-of-work.`;
    
    page.drawText(descLine1, {
      x: contentCenterX - 230,
      y: height - 320,
      size: 10,
      font: fontRegular,
      color: rgb(0.3, 0.35, 0.45),
    });

    page.drawText(descLine2, {
      x: contentCenterX - 220,
      y: height - 338,
      size: 10,
      font: fontRegular,
      color: rgb(0.3, 0.35, 0.45),
    });

    // Footer: Date Left, Signature & QR Right
    page.drawText(`Date of issue: ${date}`, {
      x: ribbonWidth + 35,
      y: 75,
      size: 10,
      font: fontBold,
      color: rgb(0.2, 0.25, 0.35),
    });

    page.drawText("CPD CERTIFIED • BOTMARTZ VERIFIED", {
      x: ribbonWidth + 35,
      y: 55,
      size: 8,
      font: fontBold,
      color: rgb(0, 0.4, 1),
    });

    // Founder Signatory Right
    page.drawText("Soham Sharma", {
      x: width - 210,
      y: 75,
      size: 14,
      font: fontTimesItalic,
      color: rgb(0.08, 0.1, 0.2),
    });

    page.drawText("Founder & Lead Architect", {
      x: width - 210,
      y: 60,
      size: 9,
      font: fontBold,
      color: rgb(0, 0.4, 1),
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

