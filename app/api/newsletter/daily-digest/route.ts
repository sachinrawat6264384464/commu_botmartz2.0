import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { emailProvider } from "@/lib/email/provider";
import { sanitizeInput, wrapInBaseLayout } from "@/lib/email/template-engine";
import { buildUnsubscribeUrl } from "@/lib/email/tokens";

interface DigestItem {
  id: string;
  category: "Career Roadmaps" | "Online Hackathons" | "Events & Summits" | "PoW Showcases" | "Blocker Bounties";
  title: string;
  subtitle: string;
  href: string;
  timestamp: number;
}

function toMillis(val: any): number {
  if (!val) return 0;
  if (typeof val === "number") return val;
  if (typeof val === "string") {
    const parsed = Date.parse(val);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  if (typeof val?.toMillis === "function") return val.toMillis();
  if (typeof val?._seconds === "number") return val._seconds * 1000;
  return 0;
}

async function collectRecentUpdates(cutoffMs: number): Promise<DigestItem[]> {
  if (!adminDb) return [];
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://community.botmartz.com";
  const items: DigestItem[] = [];

  const sources: Array<{
    collection: string;
    category: DigestItem["category"];
    getTitle: (d: any) => string;
    getSubtitle: (d: any) => string;
    path: string;
  }> = [
    {
      collection: "roadmaps",
      category: "Career Roadmaps",
      getTitle: (d) => d.roleName || d.title || "New Career Roadmap",
      getSubtitle: (d) => `${d.category || "Engineering"} • ${d.tagline || "Stage-by-stage technical roadmap"}`,
      path: "/arena/roadmaps",
    },
    {
      collection: "hackathons",
      category: "Online Hackathons",
      getTitle: (d) => d.title || "New Hackathon",
      getSubtitle: (d) => `${d.prizePool || "Community Track"} • ${d.theme || d.tagline || "Build & ship production AI"}`,
      path: "/hackathons",
    },
    {
      collection: "events",
      category: "Events & Summits",
      getTitle: (d) => d.title || "New Community Event",
      getSubtitle: (d) => `${d.type || "Summit"} • ${d.date || d.schedule || "Upcoming live session"}`,
      path: "/events",
    },
    {
      collection: "showcases",
      category: "PoW Showcases",
      getTitle: (d) => d.title || d.projectName || "New Proof-of-Work Build",
      getSubtitle: (d) => `By ${d.authorName || "Community Builder"} • ${d.summary || d.description || "Verified production project"}`,
      path: "/showcase",
    },
    {
      collection: "bounties",
      category: "Blocker Bounties",
      getTitle: (d) => d.title || "New Blocker Bounty",
      getSubtitle: (d) => `${d.reward || d.karmaReward || "Karma Reward"} • ${d.stack || "Open engineering challenge"}`,
      path: "/arena/bounties",
    },
  ];

  await Promise.all(
    sources.map(async (src) => {
      try {
        const snap = await adminDb!.collection(src.collection).limit(100).get();
        snap.forEach((doc) => {
          const data = doc.data();
          const ts = Math.max(toMillis(data.updatedAt), toMillis(data.createdAt));
          if (ts >= cutoffMs) {
            items.push({
              id: doc.id,
              category: src.category,
              title: String(src.getTitle(data)).slice(0, 110),
              subtitle: String(src.getSubtitle(data)).slice(0, 160),
              href: `${baseUrl}${src.path}`,
              timestamp: ts,
            });
          }
        });
      } catch (err) {
        console.warn(`[DailyDigest] Could not scan ${src.collection}:`, err);
      }
    })
  );

  return items.sort((a, b) => b.timestamp - a.timestamp);
}

function buildDigestContentHtml(items: DigestItem[], windowHours: number): string {
  const grouped: Record<string, DigestItem[]> = {};
  for (const item of items) {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  }

  const sectionsHtml =
    items.length === 0
      ? `<div style="background:#0F172A;border:1px solid #1E293B;border-radius:12px;padding:20px;margin:16px 0;">
           <p style="margin:0;color:#CBD5E1;font-size:14px;line-height:1.6;">
             New production engineering tracks, system PRDs, and weekly builder rituals are live on Botmartz Community. Jump back into the arena to keep your proof-of-work streak active!
           </p>
         </div>`
      : Object.entries(grouped)
          .map(([cat, list]) => {
            const rows = list
              .slice(0, 5)
              .map(
                (it) => `
                  <div style="background:#0F172A;border:1px solid #1E293B;border-left:3px solid #D9F83B;border-radius:10px;padding:14px 16px;margin-bottom:10px;">
                    <div style="font-size:14px;font-weight:700;color:#FFFFFF;margin-bottom:4px;">${sanitizeInput(it.title)}</div>
                    <div style="font-size:12px;color:#94A3B8;line-height:1.5;margin-bottom:8px;">${sanitizeInput(it.subtitle)}</div>
                    <a href="${it.href}" style="font-size:12px;font-weight:700;color:#D9F83B;text-decoration:none;">Explore Now &rarr;</a>
                  </div>`
              )
              .join("");

            return `
              <div style="margin-top:20px;">
                <div style="font-size:11px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;color:#00B8F0;margin-bottom:10px;">
                  ${sanitizeInput(cat)} (${list.length} New)
                </div>
                ${rows}
              </div>`;
          })
          .join("");

  return `
    <h1 style="margin:0 0 10px 0;font-size:22px;font-weight:800;color:#FFFFFF;">
      Daily Builder Digest &mdash; What&apos;s New Today
    </h1>
    <p style="margin:0 0 18px 0;font-size:14px;color:#94A3B8;line-height:1.6;">
      Here are the latest database updates published across Botmartz Community in the last ${windowHours} hours.
    </p>
    ${sectionsHtml}
    <div style="margin-top:28px;text-align:center;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://community.botmartz.com"}/arena" style="display:inline-block;background:#D9F83B;color:#020617;font-weight:800;font-size:13px;padding:12px 24px;border-radius:10px;text-decoration:none;">
        Open Botmartz Arena &rarr;
      </a>
    </div>
  `;
}

async function runDigest(options: { preview: boolean; hours: number; force: boolean; testEmail?: string }) {
  const cutoffMs = Date.now() - options.hours * 60 * 60 * 1000;
  const items = await collectRecentUpdates(cutoffMs);

  const updatesByCategory: Record<string, number> = {};
  for (const it of items) {
    updatesByCategory[it.category] = (updatesByCategory[it.category] || 0) + 1;
  }

  if (options.preview) {
    return NextResponse.json({
      success: true,
      preview: true,
      windowHours: options.hours,
      totalUpdates: items.length,
      updatesByCategory,
      items: items.slice(0, 25),
    });
  }

  if (items.length === 0 && !options.force) {
    return NextResponse.json({
      success: true,
      skipped: true,
      totalUpdates: 0,
      message: `No new database updates found in the last ${options.hours}h.`,
    });
  }

  if (!adminDb) {
    return NextResponse.json({ success: false, error: "Database unavailable." }, { status: 500 });
  }

  let recipients: string[] = [];
  if (options.testEmail && options.testEmail.includes("@")) {
    recipients = [options.testEmail.trim().toLowerCase()];
  } else {
    const subSnap = await adminDb
      .collection("newsletter_subscribers")
      .where("status", "==", "ACTIVE")
      .get();

    const prefSnap = await adminDb.collection("email_preferences").get();
    const optedOut = new Set<string>();
    prefSnap.forEach((doc) => {
      const p = doc.data();
      if (p?.newsletter === false) {
        optedOut.add((p.email || doc.id).toLowerCase());
      }
    });

    const uniqueEmails = new Set<string>();
    subSnap.forEach((doc) => {
      const email = String(doc.data()?.email || doc.id).trim().toLowerCase();
      if (email.includes("@") && !optedOut.has(email)) {
        uniqueEmails.add(email);
      }
    });
    recipients = Array.from(uniqueEmails);
  }

  if (recipients.length === 0) {
    return NextResponse.json({
      success: true,
      skipped: true,
      totalUpdates: items.length,
      message: "No active subscribers to dispatch.",
    });
  }

  const subject =
    items.length > 0
      ? `Botmartz Daily Digest: ${items.length} New Update${items.length > 1 ? "s" : ""} Live Today`
      : "Botmartz Daily Digest: New Engineering Tracks & Rituals";

  const contentHtml = buildDigestContentHtml(items, options.hours);
  let sentCount = 0;
  let failedCount = 0;

  for (const recipient of recipients) {
    const html = wrapInBaseLayout({
      title: subject,
      badge: "DAILY DB DIGEST",
      contentHtml,
      unsubscribeUrl: buildUnsubscribeUrl(recipient),
      recipientEmail: recipient,
    });

    const res = await emailProvider.sendEmail({
      to: recipient,
      subject,
      html,
      text: `${subject}\n\n${items.map((i) => `- [${i.category}] ${i.title}: ${i.href}`).join("\n")}`,
    });

    if (res.success) sentCount++;
    else failedCount++;
  }

  await adminDb.collection("newsletter_broadcasts").add({
    type: options.testEmail ? "TEST_DIGEST" : "DAILY_DIGEST",
    subject,
    targetAudience: options.testEmail ? `Test (${options.testEmail})` : `Active Subscribers (${recipients.length})`,
    recipientCount: recipients.length,
    sentCount,
    failedCount,
    totalUpdates: items.length,
    updatesByCategory,
    sentAt: Date.now(),
    status: "Sent",
  });

  return NextResponse.json({
    success: true,
    totalUpdates: items.length,
    updatesByCategory,
    recipientCount: recipients.length,
    sentCount,
    failedCount,
    message: `Daily digest dispatched to ${sentCount}/${recipients.length} recipient(s).`,
  });
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const preview = url.searchParams.get("preview") === "true";
    const hours = Math.min(168, Math.max(1, Number(url.searchParams.get("hours") || 24)));
    const force = url.searchParams.get("force") === "true";

    // Optional cron secret guard when invoked externally without preview
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = req.headers.get("authorization");
    if (!preview && cronSecret && authHeader && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    return await runDigest({ preview, hours, force });
  } catch (err: any) {
    console.error("[DailyDigest GET] Error:", err);
    return NextResponse.json({ success: false, error: err.message || "Failed to run daily digest." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const preview = Boolean(body?.preview);
    const hours = Math.min(168, Math.max(1, Number(body?.hours || 24)));
    const force = Boolean(body?.force);
    const testEmail = typeof body?.testEmail === "string" ? body.testEmail.trim() : undefined;

    return await runDigest({ preview, hours, force, testEmail });
  } catch (err: any) {
    console.error("[DailyDigest POST] Error:", err);
    return NextResponse.json({ success: false, error: err.message || "Failed to dispatch daily digest." }, { status: 500 });
  }
}
