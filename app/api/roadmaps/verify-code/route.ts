import { NextRequest, NextResponse } from "next/server";
import { adminDb, hasAdminCredentials } from "@/lib/firebase-admin";
import { ensureManagedRoadmaps } from "@/lib/roadmaps-server";

export async function POST(req: NextRequest) {
  try {
    const { uniqueCode } = await req.json();
    const cleanCode = String(uniqueCode || "").trim().toUpperCase();

    if (!cleanCode) {
      return NextResponse.json(
        { success: false, valid: false, error: "Please enter a Unique Code." },
        { status: 400 }
      );
    }

    if (!adminDb || !hasAdminCredentials) {
      return NextResponse.json(
        { success: false, valid: false, error: "Database connection unavailable." },
        { status: 503 }
      );
    }

    const snap = await adminDb.collection("roadmap_purchases").doc(cleanCode).get();
    if (!snap.exists) {
      return NextResponse.json(
        { success: false, valid: false, error: "Invalid Unique Code. Please check your email or purchase access." },
        { status: 404 }
      );
    }

    const purchase = snap.data() as any;
    const expiresMs = new Date(purchase.expiresAt || 0).getTime();

    if (!Number.isFinite(expiresMs) || Date.now() > expiresMs) {
      return NextResponse.json(
        {
          success: false,
          valid: false,
          expired: true,
          roadmapId: purchase.roadmapId,
          roadmapTitle: purchase.roadmapTitle,
          error: "Invalid / Expired Code: Your 3-day validity has ended. Extend +2 days for ₹100 to unlock again.",
        },
        { status: 410 }
      );
    }

    const allRoadmaps = await ensureManagedRoadmaps();
    const roadmap = allRoadmaps.find((r) => r.id === purchase.roadmapId);
    if (!roadmap) {
      return NextResponse.json(
        { success: false, valid: false, error: "Associated roadmap was removed." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      valid: true,
      purchase,
      roadmap,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, valid: false, error: err.message || "Failed to verify code." },
      { status: 500 }
    );
  }
}
