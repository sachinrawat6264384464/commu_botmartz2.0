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

    // 2. Dynamic Candidate Name Overlay (Covers sample name in template, removes duplicate line)
    page.drawRectangle({
      x: 55,
      y: 260,
      width: 410,
      height: 60,
      color: rgb(1, 1, 1),
    });

    page.drawText(recipientName, {
      x: 55,
      y: 275,
      size: 34,
      font: fontBold,
      color: rgb(0, 0.4, 1), // #0066FF
    });

    // 3. Dynamic Description Overlay
    page.drawRectangle({
      x: 55,
      y: 185,
      width: 410,
      height: 65,
      color: rgb(1, 1, 1),
    });

    page.drawText(`for the successful completion of the ${title}, validating practical skills in using`, {
      x: 55,
      y: 225,
      size: 9.5,
      font: fontRegular,
      color: rgb(0.2, 0.25, 0.35),
    });

    page.drawText(`AI tools to improve productivity, creativity, and professional performance.`, {
      x: 55,
      y: 208,
      size: 9.5,
      font: fontRegular,
      color: rgb(0.2, 0.25, 0.35),
    });

    // 4. Dynamic Badges Overlay in Blue Ribbon Column (Triangle Layout, Shifted Slightly Down)
    const badgeColors = [
      rgb(0.95, 0.35, 0.55), // Pink
      rgb(0.95, 0.55, 0.2),  // Orange
      rgb(0.6, 0.35, 0.9),   // Purple
      rgb(0.95, 0.3, 0.35),  // Red
      rgb(1, 0.78, 0),       // Amber Gold
      rgb(0.1, 0.75, 0.5)    // Emerald
    ];

    // Triangle Positions (Center X = 640, shifted down)
    const trianglePositions = [
      { x: 640, y: 355 }, // Row 1 (Apex)
      { x: 595, y: 300 }, { x: 685, y: 300 }, // Row 2 (Middle)
      { x: 550, y: 245 }, { x: 640, y: 245 }, { x: 730, y: 245 } // Row 3 (Base)
    ];

    trianglePositions.forEach((pos, idx) => {
      // Outer Badge Circle
      page.drawCircle({
        x: pos.x,
        y: pos.y,
        size: 18,
        color: badgeColors[idx],
      });
      // Inner Ring
      page.drawCircle({
        x: pos.x,
        y: pos.y,
        size: 13,
        borderColor: rgb(1, 1, 1),
        borderWidth: 1.8,
      });
      // Center Star Dot
      page.drawCircle({
        x: pos.x,
        y: pos.y,
        size: 5,
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



