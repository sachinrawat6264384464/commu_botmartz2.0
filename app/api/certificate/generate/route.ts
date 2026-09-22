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
    const imagePath = path.join(process.cwd(), "public", "certificate-template.png");
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

    const svgIconPaths = [
      "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
      "M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z",
      "M12 2L9.19 8.63 2 12l7.19 3.37L12 22l2.81-6.63L22 12l-7.19-3.37z",
      "M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1z",
      "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z",
      "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"
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

      // Draw SVG Icon centered inside badge
      try {
        page.drawSvgPath(svgIconPaths[idx], {
          x: pos.x - 9,
          y: pos.y + 9,
          color: rgb(1, 1, 1),
          scale: 0.75,
        });
      } catch (e) {
        page.drawCircle({
          x: pos.x,
          y: pos.y,
          size: 6,
          color: rgb(1, 1, 1),
        });
      }
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



