import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(req: Request) {
  try {
    let customEvents: any[] = [];
    if (adminDb) {
      const snap = await adminDb.collection("cohort_calendar_events").orderBy("createdAt", "desc").get();
      customEvents = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }
    return NextResponse.json({ success: true, events: customEvents });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch calendar." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { title, dayTime, type, location, desc, lumaLink, badge } = body;

    if (!title || !dayTime || !desc) {
      return NextResponse.json({ error: "Title, date/time, and description are required." }, { status: 400 });
    }

    const eventData = {
      title: title.trim(),
      dayTime: dayTime.trim(),
      type: type || "Hybrid: Indore In-Person + Discord",
      location: location || "Indore AI Hub & Discord",
      desc: desc.trim(),
      badge: badge || "Community Ritual",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
      lumaLink: lumaLink || "https://lu.ma",
      createdAt: new Date().toISOString(),
    };

    let id = `evt_${Date.now()}`;
    if (adminDb) {
      const docRef = await adminDb.collection("cohort_calendar_events").add(eventData);
      id = docRef.id;
    }

    return NextResponse.json({ success: true, message: "Calendar event published!", event: { id, ...eventData } });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to add calendar event." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");
    if (!eventId) {
      return NextResponse.json({ error: "eventId is required." }, { status: 400 });
    }
    if (adminDb) {
      await adminDb.collection("cohort_calendar_events").doc(eventId).delete();
    }
    return NextResponse.json({ success: true, message: "Calendar event deleted." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete event." }, { status: 500 });
  }
}
