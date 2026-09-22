import { NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function POST(request: Request) {
  try {
    const { name, eventTitle, certificateId, issueDate } = await request.json();

    const recipientName = name || "Sachin Rawat";
    const title = eventTitle || "AI Mastery Certificate Program";
    const certId = certificateId || `CERT-BM-${Math.floor(100000 + Math.random() * 900000)}`;

    // Create a new PDF document (A4 Landscape)
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([842, 595]);
    const { width, height } = page.getSize();

    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontTimesItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanBoldItalic);

    // 1. Base White Canvas
    page.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: rgb(1, 1, 1),
    });

    // 2. Far Right Yellow Accent Bar (#FFC700)
    page.drawRectangle({
      x: width - 16,
      y: 0,
      width: 16,
      height,
      color: rgb(1, 0.78, 0),
    });

    // 3. Right Blue Ribbon Column (#0066FF)
    const ribbonWidth = 230;
    const ribbonX = width - 16 - ribbonWidth;

    page.drawRectangle({
      x: ribbonX,
      y: 0,
      width: ribbonWidth,
      height,
      color: rgb(0, 0.4, 1), // #0066FF
    });

    // Top Header in Blue Ribbon
    page.drawText("BOTMARTZ", {
      x: ribbonX + 65,
      y: height - 50,
      size: 16,
      font: fontBold,
      color: rgb(1, 1, 1),
    });

    page.drawText("AI SOLUTIONS", {
      x: ribbonX + 72,
      y: height - 65,
      size: 8,
      font: fontBold,
      color: rgb(0.8, 0.9, 1),
    });

    // Badges Earned Header in Blue Ribbon
    page.drawText("Badges Earned", {
      x: ribbonX + 55,
      y: height - 110,
      size: 16,
      font: fontBold,
      color: rgb(1, 1, 1),
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
      const by = height - 165 - idx * 55;
      page.drawCircle({
        x: ribbonX + 35,
        y: by,
        size: 14,
        color: badgeColors[idx],
      });
      page.drawCircle({
        x: ribbonX + 35,
        y: by,
        size: 10,
        borderColor: rgb(1, 1, 1),
        borderWidth: 1.5,
      });
      page.drawText(label, {
        x: ribbonX + 60,
        y: by - 4,
        size: 10,
        font: fontBold,
        color: rgb(1, 1, 1),
      });
    });

    // Bottom Metallic Rosette Seal
    page.drawCircle({
      x: ribbonX + ribbonWidth / 2,
      y: 65,
      size: 32,
      color: rgb(0.95, 0.95, 0.95),
    });
    page.drawCircle({
      x: ribbonX + ribbonWidth / 2,
      y: 65,
      size: 26,
      color: rgb(0, 0.35, 0.9),
    });
    page.drawText("BOTMARTZ", {
      x: ribbonX + ribbonWidth / 2 - 25,
      y: 68,
      size: 7,
      font: fontBold,
      color: rgb(1, 0.78, 0),
    });
    page.drawText("COMMUNITY", {
      x: ribbonX + ribbonWidth / 2 - 24,
      y: 58,
      size: 5,
      font: fontBold,
      color: rgb(1, 1, 1),
    });

    // 4. MAIN BODY (LEFT SECTION: x: 0 to ribbonX)
    // Top Left Headers
    page.drawText("Certificate", {
      x: 50,
      y: height - 90,
      size: 42,
      font: fontBold,
      color: rgb(0, 0.4, 1),
    });

    page.drawText("of Completion", {
      x: 50,
      y: height - 125,
      size: 22,
      font: fontBold,
      color: rgb(0, 0.4, 1),
    });

    // Recipient Section
    page.drawText("This is to proudly certify that", {
      x: 50,
      y: height - 200,
      size: 12,
      font: fontRegular,
      color: rgb(0.25, 0.3, 0.4),
    });

    page.drawText(recipientName, {
      x: 50,
      y: height - 255,
      size: 38,
      font: fontBold,
      color: rgb(0, 0.4, 1),
    });

    // Blue Underline
    page.drawLine({
      start: { x: 50, y: height - 270 },
      end: { x: 380, y: height - 270 },
      thickness: 2.5,
      color: rgb(0, 0.4, 1),
    });

    // Description Text
    const descLine1 = `for the successful completion of the ${title}, validating practical skills in using`;
    const descLine2 = `AI tools to improve productivity, creativity, and professional performance.`;

    page.drawText(descLine1, {
      x: 50,
      y: height - 320,
      size: 10,
      font: fontRegular,
      color: rgb(0.25, 0.3, 0.4),
    });

    page.drawText(descLine2, {
      x: 50,
      y: height - 338,
      size: 10,
      font: fontRegular,
      color: rgb(0.25, 0.3, 0.4),
    });

    // Founder Signature Section (Bottom Left)
    page.drawText("Soham Sharma", {
      x: 50,
      y: 125,
      size: 20,
      font: fontTimesItalic,
      color: rgb(0, 0.35, 0.85),
    });

    page.drawLine({
      start: { x: 50, y: 115 },
      end: { x: 190, y: 115 },
      thickness: 1.5,
      color: rgb(0, 0.4, 1),
    });

    page.drawText("Soham Sharma", {
      x: 50,
      y: 95,
      size: 13,
      font: fontBold,
      color: rgb(0.1, 0.15, 0.25),
    });

    page.drawText("FOUNDER,", {
      x: 50,
      y: 80,
      size: 8,
      font: fontBold,
      color: rgb(0, 0.4, 1),
    });

    page.drawText("BOTMARTZ AI SOLUTIONS PVT LTD", {
      x: 50,
      y: 68,
      size: 8,
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


