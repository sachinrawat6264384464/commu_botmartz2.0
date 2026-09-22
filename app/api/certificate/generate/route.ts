import { NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";

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

    // Load and embed the exact PNG template image
    const imagePath = path.join(process.cwd(), "public", "Blue and Yellow Modern Certificate of Completion.png");
    const imageBytes = fs.readFileSync(imagePath);
    const templatePng = await pdfDoc.embedPng(imageBytes);

    // 1. Draw base PNG image covering the entire PDF page
    page.drawImage(templatePng, {
      x: 0,
      y: 0,
      width,
      height,
    });

    // 2. Full Left Panel White Mask (Covers from x: 0 to 478, y: 140 to 595 to eliminate all background PNG ghosting and edge gaps)
    page.drawRectangle({
      x: 0,
      y: 140,
      width: 478,
      height: 455, // 140 + 455 = 595 (Top of PDF Page)
      color: rgb(1, 1, 1),
    });

    // "Certificate of Completion" Header (Centered in Left Panel)
    page.drawText("Certificate", {
      x: 125,
      y: 518,
      size: 46,
      font: fontBold,
      color: rgb(0, 0.4, 1), // #0066FF
    });

    page.drawText("of Completion", {
      x: 168,
      y: 482,
      size: 26,
      font: fontBold,
      color: rgb(0, 0.4, 1), // #0066FF
    });

    // Project Title (Centered, In BOLD BLACK)
    const titleX = Math.max(30, 240 - Math.min(title.length * 4, 200));
    page.drawText(title, {
      x: titleX,
      y: 422,
      size: 16,
      font: fontBold,
      color: rgb(0.1, 0.15, 0.25), // BLACK
    });

    // Certify Intro
    page.drawText("This is to proudly certify that", {
      x: 165,
      y: 368,
      size: 12,
      font: fontRegular,
      color: rgb(0.3, 0.35, 0.45),
    });

    // ONLY ONE Candidate Name (Dynamic Logged-in User)
    const nameX = Math.max(40, 240 - (recipientName.length * 8.5));
    page.drawText(recipientName, {
      x: nameX,
      y: 298,
      size: 42,
      font: fontBold,
      color: rgb(0, 0.4, 1), // #0066FF
    });

    // Blue Underline
    page.drawLine({
      start: { x: 110, y: 285 },
      end: { x: 370, y: 285 },
      thickness: 4,
      color: rgb(0, 0.4, 1),
    });

    // Description Paragraph (Larger & Crisp)
    page.drawText(`for the successful completion of the program, validating practical skills in using`, {
      x: 42,
      y: 232,
      size: 10.5,
      font: fontRegular,
      color: rgb(0.15, 0.2, 0.3),
    });

    page.drawText(`AI tools to improve productivity, creativity, and professional performance.`, {
      x: 42,
      y: 214,
      size: 10.5,
      font: fontRegular,
      color: rgb(0.15, 0.2, 0.3),
    });

    // 3. Dynamic Scalloped Badges Overlay in Blue Ribbon Column (Triangle Formation)
    const badgeColors = [
      rgb(0.95, 0.35, 0.55), // Pink
      rgb(0.95, 0.55, 0.2),  // Orange
      rgb(0.6, 0.35, 0.9),   // Purple
      rgb(0.95, 0.3, 0.35),  // Red
      rgb(1, 0.78, 0),       // Amber Gold
      rgb(0.1, 0.75, 0.5)    // Emerald
    ];

    // Triangle Positions (Center X = 650)
    const trianglePositions = [
      { x: 650, y: 350 }, // Row 1 (Apex)
      { x: 595, y: 285 }, { x: 705, y: 285 }, // Row 2 (Middle)
      { x: 540, y: 220 }, { x: 650, y: 220 }, { x: 760, y: 220 } // Row 3 (Base)
    ];

    trianglePositions.forEach((pos, idx) => {
      const color = badgeColors[idx];

      // 12 Outer Scalloped Petals
      const numPetals = 12;
      for (let i = 0; i < numPetals; i++) {
        const angle = (i * Math.PI * 2) / numPetals;
        page.drawCircle({
          x: pos.x + Math.cos(angle) * 11,
          y: pos.y + Math.sin(angle) * 11,
          size: 13,
          color,
        });
      }

      // Main Center Body
      page.drawCircle({
        x: pos.x,
        y: pos.y,
        size: 23,
        color,
      });

      // White Dashed / Stitched Inner Ring
      page.drawCircle({
        x: pos.x,
        y: pos.y,
        size: 17,
        borderColor: rgb(1, 1, 1),
        borderWidth: 1.8,
      });

      // Inner Solid Emblem Disc
      page.drawCircle({
        x: pos.x,
        y: pos.y,
        size: 10,
        color: rgb(1, 1, 1),
      });

      // Center Color Star Dot
      page.drawCircle({
        x: pos.x,
        y: pos.y,
        size: 5,
        color,
      });
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



