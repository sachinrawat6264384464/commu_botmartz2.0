import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { DEFAULT_WORKSHOPS, ManagedWorkshop } from "@/lib/workshops";

export async function GET() {
  try {
    if (!adminDb) {
      return NextResponse.json({
        success: true,
        workshops: DEFAULT_WORKSHOPS,
      });
    }

    const colRef = adminDb.collection("managed_workshops");
    let snap = await colRef.get();

    // Auto-seed the 6 default workshops if Firestore collection is empty
    if (snap.empty) {
      const batch = adminDb.batch();
      for (const ws of DEFAULT_WORKSHOPS) {
        batch.set(colRef.doc(ws.id), ws);
      }
      await batch.commit();
      snap = await colRef.get();
    }

    const workshops: ManagedWorkshop[] = [];
    snap.forEach((doc) => {
      const d = doc.data() as ManagedWorkshop;
      workshops.push({
        ...d,
        id: d.id || doc.id,
      });
    });

    workshops.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));

    return NextResponse.json({
      success: true,
      workshops,
    });
  } catch (err: any) {
    console.error("[Workshops GET] Error:", err);
    return NextResponse.json({
      success: true,
      workshops: DEFAULT_WORKSHOPS,
      fallback: true,
    });
  }
}
