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

    // 2. Dynamic Candidate Name Overlay (Covers sample name in template)
    page.drawRectangle({
      x: 55,
      y: 255,
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

    page.drawLine({
      start: { x: 55, y: 265 },
      end: { x: 380, y: 265 },
      thickness: 2.5,
      color: rgb(0, 0.4, 1),
    });

    // 3. Dynamic Description Overlay
    page.drawRectangle({
      x: 55,
      y: 190,
      width: 410,
      height: 55,
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

    // 4. Dynamic Badges Overlay in Blue Ribbon Column
    const badgeLabels = ["Foundations & AI", "Python Agents", "MCP Architecture", "Linux & Cloud GCP", "AWS Services"];
    const badgeColors = [
      rgb(0.95, 0.35, 0.55),
      rgb(0.95, 0.55, 0.2),
      rgb(0.6, 0.35, 0.9),
      rgb(0.95, 0.3, 0.35),
      rgb(1, 0.78, 0)
    ];

    badgeLabels.forEach((label, idx) => {
      const by = 380 - idx * 46;
      page.drawRectangle({
        x: 520,
        y: by - 8,
        width: 240,
        height: 30,
        color: rgb(1, 1, 1),
        opacity: 0.18,
      });
      page.drawCircle({
        x: 538,
        y: by + 7,
        size: 10,
        color: badgeColors[idx],
      });
      page.drawText(label, {
        x: 558,
        y: by + 3,
        size: 10.5,
        font: fontBold,
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



