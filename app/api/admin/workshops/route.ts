import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { emailProvider } from "@/lib/email/provider";
import { sanitizeInput, wrapInBaseLayout } from "@/lib/email/template-engine";
import { DEFAULT_WORKSHOPS, ManagedWorkshop, WorkshopRegistration } from "@/lib/workshops";

export async function GET() {
  try {
    if (!adminDb) {
      return NextResponse.json({
        success: true,
        fallback: true,
        workshops: DEFAULT_WORKSHOPS.map((ws) => ({
          ...ws,
          registrations: [],
          revenueCollected: 0,
        })),
      });
    }

    const colRef = adminDb.collection("managed_workshops");
    let snap = await colRef.get();

    if (snap.empty) {
      const batch = adminDb.batch();
      for (const ws of DEFAULT_WORKSHOPS) {
        batch.set(colRef.doc(ws.id), ws);
      }
      await batch.commit();
      snap = await colRef.get();
    }

    const workshops: Array<
      ManagedWorkshop & {
        registrations: WorkshopRegistration[];
        revenueCollected: number;
      }
    > = [];

    for (const doc of snap.docs) {
      const ws = doc.data() as ManagedWorkshop;
      const wsId = ws.id || doc.id;
      const def = DEFAULT_WORKSHOPS.find((w) => w.id === wsId);
      let imageUrl = ws.imageUrl;
      if (def && (!imageUrl || imageUrl.startsWith("/workshops/"))) {
        imageUrl = def.imageUrl;
        await colRef.doc(wsId).set({ imageUrl }, { merge: true });
      }
      const regSnap = await colRef
        .doc(wsId)
        .collection("registrations")
        .orderBy("registeredAt", "desc")
        .get()
        .catch(() => null);

      const registrations: WorkshopRegistration[] = [];
      let revenueCollected = 0;
      if (regSnap) {
        regSnap.forEach((rDoc) => {
          const r = rDoc.data() as WorkshopRegistration;
          registrations.push(r);
          revenueCollected += Number(r.amountPaid || 0);
        });
      }

      workshops.push({
        ...ws,
        id: wsId,
        imageUrl,
        registrationCount: registrations.length || ws.registrationCount || 0,
        registrations,
        revenueCollected,
      });
    }

    workshops.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));

    return NextResponse.json({
      success: true,
      workshops,
    });
  } catch (err: any) {
    console.error("[AdminWorkshops GET] Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to load workshops." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!adminDb) {
      return NextResponse.json({ success: false, error: "Database unavailable." }, { status: 500 });
    }

    const body = await req.json().catch(() => ({}));
    const title = String(body?.title || "").trim();
    if (!title) {
      return NextResponse.json({ success: false, error: "Workshop title is required." }, { status: 400 });
    }

    const now = Date.now();
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const id = `ws-${slug.slice(0, 24)}-${now.toString().slice(-4)}`;

    const newWorkshop: ManagedWorkshop = {
      id,
      slug,
      title,
      category: String(body?.category || "AI Engineering").trim(),
      tagline: String(body?.tagline || "Hands-on production engineering workshop.").trim(),
      description: String(body?.description || "").trim(),
      imageUrl: String(body?.imageUrl || "/workshops/ws-python.png").trim(),
      whatYouWillBuild: Array.isArray(body?.whatYouWillBuild)
        ? body.whatYouWillBuild.map((s: any) => String(s).trim()).filter(Boolean)
        : [],
      curriculum: Array.isArray(body?.curriculum)
        ? body.curriculum.map((s: any) => String(s).trim()).filter(Boolean)
        : [],
      instructor: String(body?.instructor || "Soham Sharma").trim(),
      scheduleDate: String(body?.scheduleDate || "Upcoming Weekend • 6:00 PM IST").trim(),
      duration: String(body?.duration || "3 Hours Live").trim(),
      mode: String(body?.mode || "Live Online").trim(),
      price: Number(body?.price ?? 699),
      isPaid: body?.isPaid !== undefined ? Boolean(body.isPaid) : true,
      seatsLimit: Number(body?.seatsLimit || 100),
      registrationCount: 0,
      joinLink: String(body?.joinLink || "").trim(),
      status: (body?.status as ManagedWorkshop["status"]) || "UPCOMING",
      createdAt: now,
      updatedAt: now,
    };

    await adminDb.collection("managed_workshops").doc(id).set(newWorkshop);

    return NextResponse.json({
      success: true,
      workshop: newWorkshop,
      message: "Workshop created successfully!",
    });
  } catch (err: any) {
    console.error("[AdminWorkshops POST] Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create workshop." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    if (!adminDb) {
      return NextResponse.json({ success: false, error: "Database unavailable." }, { status: 500 });
    }

    const body = await req.json().catch(() => ({}));
    const id = String(body?.id || "").trim();
    if (!id) {
      return NextResponse.json({ success: false, error: "Workshop ID is required." }, { status: 400 });
    }

    const docRef = adminDb.collection("managed_workshops").doc(id);
    const snap = await docRef.get();
    if (!snap.exists) {
      return NextResponse.json({ success: false, error: "Workshop not found." }, { status: 404 });
    }

    // Action: Send live joining link email to all attendees of this workshop
    if (body?.action === "send_join_email") {
      const ws = snap.data() as ManagedWorkshop;
      const joinLink = String(body?.joinLink || ws.joinLink || "").trim();
      if (!joinLink) {
        return NextResponse.json(
          { success: false, error: "Please enter a valid live joining link first." },
          { status: 400 }
        );
      }

      await docRef.set({ joinLink, updatedAt: Date.now() }, { merge: true });

      const regSnap = await docRef.collection("registrations").get();
      if (regSnap.empty) {
        return NextResponse.json({
          success: true,
          sentCount: 0,
          message: "Joining link saved. No attendees registered yet.",
        });
      }

      let sentCount = 0;
      for (const rDoc of regSnap.docs) {
        const reg = rDoc.data() as WorkshopRegistration;
        if (!reg.email) continue;
        const contentHtml = `
          <h1 style="margin:0 0 10px 0;font-size:22px;font-weight:800;color:#FFFFFF;">
            Your Workshop Is Starting Soon!
          </h1>
          <p style="margin:0 0 18px 0;font-size:14px;color:#CBD5E1;line-height:1.6;">
            Hi <strong style="color:#FFFFFF;">${sanitizeInput(reg.name)}</strong>, <strong style="color:#D9F83B;">${sanitizeInput(ws.title)}</strong> is ready. Use the link below to join live:
          </p>
          <div style="margin:20px 0;text-align:center;">
            <a href="${joinLink}" style="display:inline-block;background:#D9F83B;color:#020617;font-weight:800;font-size:14px;padding:12px 26px;border-radius:10px;text-decoration:none;">
              Join Live Workshop Now &rarr;
            </a>
          </div>
          <p style="font-size:12px;color:#94A3B8;">Ticket Code: <strong style="color:#FFFFFF;">${sanitizeInput(reg.ticketCode)}</strong></p>
        `;
        const html = wrapInBaseLayout({
          title: `Join Live: ${ws.title}`,
          badge: "LIVE JOIN LINK",
          contentHtml,
        });
        const res = await emailProvider.sendEmail({
          to: reg.email,
          subject: `Join Link: ${ws.title} (${reg.ticketCode})`,
          html,
          text: `Hi ${reg.name}, ${ws.title} is ready! Join live here: ${joinLink} (Ticket: ${reg.ticketCode})`,
        });
        if (res.success) sentCount++;
      }

      return NextResponse.json({
        success: true,
        sentCount,
        message: `Live joining link sent to ${sentCount} registered attendee(s)!`,
      });
    }

    const updatePayload: Partial<ManagedWorkshop> = {
      updatedAt: Date.now(),
    };
    const fields: Array<keyof ManagedWorkshop> = [
      "title",
      "category",
      "tagline",
      "description",
      "imageUrl",
      "whatYouWillBuild",
      "curriculum",
      "instructor",
      "scheduleDate",
      "duration",
      "mode",
      "price",
      "isPaid",
      "seatsLimit",
      "joinLink",
      "status",
    ];
    for (const f of fields) {
      if (body[f] !== undefined) {
        (updatePayload as any)[f] = body[f];
      }
    }

    await docRef.set(updatePayload, { merge: true });

    return NextResponse.json({
      success: true,
      message: "Workshop updated successfully!",
    });
  } catch (err: any) {
    console.error("[AdminWorkshops PATCH] Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update workshop." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!adminDb) {
      return NextResponse.json({ success: false, error: "Database unavailable." }, { status: 500 });
    }
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Workshop ID is required." }, { status: 400 });
    }

    await adminDb.collection("managed_workshops").doc(id).delete();
    return NextResponse.json({
      success: true,
      message: "Workshop deleted successfully.",
    });
  } catch (err: any) {
    console.error("[AdminWorkshops DELETE] Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete workshop." },
      { status: 500 }
    );
  }
}
