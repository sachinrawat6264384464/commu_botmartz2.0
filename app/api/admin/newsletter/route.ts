import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { emailProvider } from "@/lib/email/provider";
import { sanitizeInput, wrapInBaseLayout } from "@/lib/email/template-engine";
import { buildUnsubscribeUrl } from "@/lib/email/tokens";

export async function GET() {
  try {
    if (!adminDb) {
      return NextResponse.json({ success: false, error: "Database unavailable." }, { status: 500 });
    }

    const [subSnap, broadcastSnap] = await Promise.all([
      adminDb.collection("newsletter_subscribers").get(),
      adminDb.collection("newsletter_broadcasts").orderBy("sentAt", "desc").limit(25).get().catch(() => null),
    ]);

    const subscribers: Array<{
      email: string;
      name: string;
      status: string;
      source: string;
      subscribedAt: number;
    }> = [];

    const seen = new Set<string>();
    subSnap.forEach((doc) => {
      const d = doc.data();
      const email = String(d.email || doc.id).trim().toLowerCase();
      if (!email.includes("@") || seen.has(email)) return;
      seen.add(email);
      subscribers.push({
        email,
        name: d.name || "Subscriber",
        status: d.status || "ACTIVE",
        source: d.source || "footer",
        subscribedAt: Number(d.subscribedAt || d.createdAt || 0),
      });
    });

    subscribers.sort((a, b) => b.subscribedAt - a.subscribedAt);

    const broadcasts: Array<any> = [];
    if (broadcastSnap) {
      broadcastSnap.forEach((doc) => {
        const d = doc.data();
        broadcasts.push({
          id: doc.id,
          type: d.type || "CUSTOM_BROADCAST",
          subject: d.subject || "Newsletter Broadcast",
          targetAudience: d.targetAudience || "Active Subscribers",
          sentAt: d.sentAt || Date.now(),
          recipientCount: Number(d.recipientCount || 0),
          sentCount: Number(d.sentCount || d.recipientCount || 0),
          failedCount: Number(d.failedCount || 0),
          totalUpdates: Number(d.totalUpdates || 0),
          status: d.status || "Sent",
        });
      });
    }

    const activeCount = subscribers.filter((s) => s.status === "ACTIVE").length;

    return NextResponse.json({
      success: true,
      activeCount,
      totalCount: subscribers.length,
      subscribers,
      broadcasts,
    });
  } catch (err: any) {
    console.error("[AdminNewsletter GET] Error:", err);
    return NextResponse.json({ success: false, error: err.message || "Failed to load newsletter stats." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!adminDb) {
      return NextResponse.json({ success: false, error: "Database unavailable." }, { status: 500 });
    }

    const body = await req.json().catch(() => ({}));
    const subject = String(body?.subject || "").trim();
    const content = String(body?.content || "").trim();
    const audience = String(body?.audience || "all-builders");
    const testEmail = typeof body?.testEmail === "string" ? body.testEmail.trim().toLowerCase() : "";

    if (!subject || !content) {
      return NextResponse.json({ success: false, error: "Subject and content are required." }, { status: 400 });
    }

    let recipients: string[] = [];
    if (testEmail && testEmail.includes("@")) {
      recipients = [testEmail];
    } else {
      const subSnap = await adminDb
        .collection("newsletter_subscribers")
        .where("status", "==", "ACTIVE")
        .get();

      const unique = new Set<string>();
      subSnap.forEach((doc) => {
        const email = String(doc.data()?.email || doc.id).trim().toLowerCase();
        if (email.includes("@")) unique.add(email);
      });
      recipients = Array.from(unique);
    }

    if (recipients.length === 0) {
      return NextResponse.json({ success: false, error: "No active subscribers found." }, { status: 400 });
    }

    const formattedParagraphs = content
      .split("\n")
      .map((line) =>
        line.trim()
          ? `<p style="margin:0 0 12px 0;font-size:14px;color:#E2E8F0;line-height:1.65;">${sanitizeInput(line)}</p>`
          : `<div style="height:8px;"></div>`
      )
      .join("");

    const contentHtml = `
      <h1 style="margin:0 0 16px 0;font-size:21px;font-weight:800;color:#FFFFFF;">${sanitizeInput(subject)}</h1>
      ${formattedParagraphs}
    `;

    let sentCount = 0;
    let failedCount = 0;

    for (const recipient of recipients) {
      const html = wrapInBaseLayout({
        title: subject,
        badge: "COMMUNITY DISPATCH",
        contentHtml,
        unsubscribeUrl: buildUnsubscribeUrl(recipient),
        recipientEmail: recipient,
      });

      const res = await emailProvider.sendEmail({
        to: recipient,
        subject,
        html,
        text: `${subject}\n\n${content}`,
      });

      if (res.success) sentCount++;
      else failedCount++;
    }

    const now = Date.now();
    const docRef = await adminDb.collection("newsletter_broadcasts").add({
      type: testEmail ? "TEST_BROADCAST" : "CUSTOM_BROADCAST",
      subject,
      targetAudience: testEmail ? `Test (${testEmail})` : `${audience} (${recipients.length})`,
      recipientCount: recipients.length,
      sentCount,
      failedCount,
      sentAt: now,
      status: "Sent",
    });

    return NextResponse.json({
      success: true,
      broadcastId: docRef.id,
      recipientCount: recipients.length,
      sentCount,
      failedCount,
      message: `Broadcast delivered to ${sentCount}/${recipients.length} recipient(s).`,
    });
  } catch (err: any) {
    console.error("[AdminNewsletter POST] Error:", err);
    return NextResponse.json({ success: false, error: err.message || "Failed to send broadcast." }, { status: 500 });
  }
}
