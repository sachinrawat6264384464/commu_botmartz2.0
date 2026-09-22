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

    // 1. Thick Outer Violet Border Frame & Crisp White Card
    page.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: rgb(0.31, 0.27, 0.9), // Deep Indigo #4F46E5
    });

    // Inner Light Blue Certificate Card
    page.drawRectangle({
      x: 20,
      y: 20,
      width: width - 40,
      height: height - 40,
      color: rgb(0.94, 0.96, 0.99), // Soft Light Blue
    });

    // 2. Top Header Branding: Cursive Botmartz Left, ID Right
    page.drawText("Botmartz", {
      x: 55,
      y: height - 60,
      size: 26,
      font: fontTimesItalic,
      color: rgb(0.25, 0.2, 0.75),
    });

    const certIdText = `CERTIFICATE ID: ${certId}`;
    page.drawText(certIdText, {
      x: width - 230,
      y: height - 55,
      size: 9,
      font: fontBold,
      color: rgb(0.55, 0.6, 0.65),
    });

    // 3. Certificate Header Title
    const certSubTitle = "CERTIFICATE OF COMPLETION";
    page.drawText(certSubTitle, {
      x: width / 2 - (certSubTitle.length * 4.2),
      y: height - 110,
      size: 13,
      font: fontBold,
      color: rgb(0.5, 0.55, 0.65),
    });

    const displayTitle = title.toUpperCase();
    page.drawText(displayTitle, {
      x: Math.max(55, width / 2 - (displayTitle.length * 6)),
      y: height - 145,
      size: 22,
      font: fontTimesBold,
      color: rgb(0.08, 0.1, 0.2),
    });

    // 4. Recipient Section
    page.drawText("ISSUED TO", {
      x: width / 2 - 30,
      y: height - 190,
      size: 10,
      font: fontBold,
      color: rgb(0.5, 0.55, 0.65),
    });

    page.drawText(recipientName, {
      x: width / 2 - (recipientName.length * 9.5),
      y: height - 235,
      size: 34,
      font: fontTimes,
      color: rgb(0.08, 0.1, 0.2),
    });

    // Subtle line below name
    page.drawLine({
      start: { x: width / 2 - 70, y: height - 248 },
      end: { x: width / 2 + 70, y: height - 248 },
      thickness: 1,
      color: rgb(0.8, 0.82, 0.88),
    });

    // 5. Description Paragraph
    const descLine1 = `Awarded for the successful completion of the ${title}, validating practical skills in using`;
    const descLine2 = `AI tools to improve productivity, creativity, and professional performance.`;
    
    page.drawText(descLine1, {
      x: Math.max(50, width / 2 - (descLine1.length * 2.8)),
      y: height - 285,
      size: 10,
      font: fontRegular,
      color: rgb(0.3, 0.35, 0.45),
    });

    page.drawText(descLine2, {
      x: Math.max(50, width / 2 - (descLine2.length * 2.8)),
      y: height - 300,
      size: 10,
      font: fontRegular,
      color: rgb(0.3, 0.35, 0.45),
    });

    // 6. 5 Scalloped Skill Badge Emblems in 1 Single Horizontal Row
    const badgeColors = [
      rgb(0.9, 0.35, 0.55), // Pink
      rgb(0.95, 0.5, 0.2),  // Orange
      rgb(0.55, 0.3, 0.85), // Purple
      rgb(0.9, 0.3, 0.35),  // Coral/Red
      rgb(0.85, 0.25, 0.65) // Magenta
    ];

    const startX = width / 2 - 140;
    [0, 1, 2, 3, 4].forEach((idx) => {
      const bx = startX + idx * 70;
      const by = 165;

      // Outer Scallop Circle
      page.drawCircle({
        x: bx,
        y: by,
        size: 19,
        color: badgeColors[idx],
      });

      // Inner Dashed/White Ring
      page.drawCircle({
        x: bx,
        y: by,
        size: 14,
        borderColor: rgb(1, 1, 1),
        borderWidth: 1.5,
      });
    });

    // 7. Date of Issue & CPD Seal Left, QR Code Box Right
    page.drawText("Date of issue", {
      x: 65,
      y: 95,
      size: 9,
      font: fontRegular,
      color: rgb(0.45, 0.5, 0.6),
    });

    page.drawLine({
      start: { x: 65, y: 88 },
      end: { x: 195, y: 88 },
      thickness: 1,
      color: rgb(0.75, 0.8, 0.85),
    });

    page.drawText(date, {
      x: 65,
      y: 72,
      size: 11,
      font: fontTimesBold,
      color: rgb(0.1, 0.15, 0.25),
    });

    // CPD Certified Seal Box Left
    page.drawRectangle({
      x: 65,
      y: 35,
      width: 28,
      height: 28,
      color: rgb(0.1, 0.08, 0.35),
    });

    page.drawText("CPD", {
      x: 69,
      y: 47,
      size: 9,
      font: fontBold,
      color: rgb(1, 1, 1),
    });

    page.drawText("CERTIFIED", {
      x: 100,
      y: 52,
      size: 8,
      font: fontBold,
      color: rgb(0.35, 0.25, 0.8),
    });

    page.drawText("The CPD Certification Service", {
      x: 100,
      y: 41,
      size: 7,
      font: fontRegular,
      color: rgb(0.5, 0.55, 0.65),
    });

    // Scannable QR Code Box Right
    page.drawRectangle({
      x: width - 115,
      y: 45,
      width: 55,
      height: 55,
      borderColor: rgb(0.75, 0.8, 0.85),
      borderWidth: 1,
      color: rgb(0.98, 0.98, 1),
    });

    page.drawText("QR CODE", {
      x: width - 106,
      y: 68,
      size: 7.5,
      font: fontBold,
      color: rgb(0.3, 0.35, 0.45),
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

