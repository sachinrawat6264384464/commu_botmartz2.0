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
      x: 140,
      y: 520,
      size: 40,
      font: fontBold,
      color: rgb(0, 0.4, 1), // #0066FF
    });

    page.drawText("of Completion", {
      x: 175,
      y: 488,
      size: 22,
      font: fontBold,
      color: rgb(0, 0.4, 1), // #0066FF
    });

    // Project Title (Centered, In BLACK)
    const titleX = Math.max(35, 245 - Math.min(title.length * 3.5, 200));
    page.drawText(title, {
      x: titleX,
      y: 425,
      size: 14,
      font: fontBold,
      color: rgb(0.1, 0.15, 0.25), // BLACK
    });

    // Certify Intro
    page.drawText("This is to proudly certify that", {
      x: 175,
      y: 370,
      size: 11,
      font: fontRegular,
      color: rgb(0.3, 0.35, 0.45),
    });

    // ONLY ONE Candidate Name (Dynamic Logged-in User)
    const nameX = Math.max(50, 245 - (recipientName.length * 7));
    page.drawText(recipientName, {
      x: nameX,
      y: 300,
      size: 36,
      font: fontBold,
      color: rgb(0, 0.4, 1), // #0066FF
    });

    // Blue Underline
    page.drawLine({
      start: { x: 130, y: 288 },
      end: { x: 360, y: 288 },
      thickness: 3,
      color: rgb(0, 0.4, 1),
    });

    // Description Paragraph
    page.drawText(`for the successful completion of the program, validating practical skills in using`, {
      x: 50,
      y: 235,
      size: 9.5,
      font: fontRegular,
      color: rgb(0.2, 0.25, 0.35),
    });

    page.drawText(`AI tools to improve productivity, creativity, and professional performance.`, {
      x: 50,
      y: 218,
      size: 9.5,
      font: fontRegular,
      color: rgb(0.2, 0.25, 0.35),
    });

    // 3. Dynamic Badges Overlay in Blue Ribbon Column (Triangle/Pyramid Formation)
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
      { x: 605, y: 295 }, { x: 695, y: 295 }, // Row 2 (Middle)
      { x: 560, y: 240 }, { x: 650, y: 240 }, { x: 740, y: 240 } // Row 3 (Base)
    ];

    trianglePositions.forEach((pos, idx) => {
      // Outer Scalloped Rosette Petals (Simulated via overlapping circles)
      const numPetals = 8;
      for (let i = 0; i < numPetals; i++) {
        const angle = (i * Math.PI * 2) / numPetals;
        page.drawCircle({
          x: pos.x + Math.cos(angle) * 5,
          y: pos.y + Math.sin(angle) * 5,
          size: 16,
          color: badgeColors[idx],
        });
      }

      // Main Badge Body Circle
      page.drawCircle({
        x: pos.x,
        y: pos.y,
        size: 19,
        color: badgeColors[idx],
      });

      // White Stitched Inner Ring
      page.drawCircle({
        x: pos.x,
        y: pos.y,
        size: 14,
        borderColor: rgb(1, 1, 1),
        borderWidth: 1.5,
      });

      // Center White Emblem Dot
      page.drawCircle({
        x: pos.x,
        y: pos.y,
        size: 6,
        color: rgb(1, 1, 1),
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



