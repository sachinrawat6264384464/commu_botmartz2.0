import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: "Database not connected" }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("status") || "ALL"; // "ALL" | "PENDING" | "APPROVED" | "REJECTED"

    let query: any = adminDb.collection("testimonials").orderBy("createdAt", "desc").limit(100);
    if (filter !== "ALL") {
      query = query.where("status", "==", filter);
    }

    const snap = await query.get();
    const testimonials = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));

    return NextResponse.json({ success: true, testimonials });
  } catch (err: any) {
    console.error("Admin testimonials fetch error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch testimonials" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: "Database not connected" }, { status: 500 });
    }

    const body = await req.json();
    const { id, action } = body; // action: "APPROVE" | "REJECT" | "DELETE"

    if (!id || !action) {
      return NextResponse.json({ error: "Testimonial ID and action are required." }, { status: 400 });
    }

    const docRef = adminDb.collection("testimonials").doc(id);
    const snap = await docRef.get();

    if (!snap.exists) {
      return NextResponse.json({ error: "Testimonial not found." }, { status: 404 });
    }

    if (action === "DELETE") {
      await docRef.delete();
      return NextResponse.json({ success: true, message: "Testimonial deleted permanently." });
    }

    const newStatus = action === "APPROVE" ? "APPROVED" : "REJECTED";
    await docRef.update({
      status: newStatus,
      moderatedAt: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      status: newStatus,
      message: `Testimonial successfully marked as ${newStatus}.`
    });
  } catch (err: any) {
    console.error("Admin testimonial moderation error:", err);
    return NextResponse.json({ error: err.message || "Failed to moderate testimonial" }, { status: 500 });
  }
}
