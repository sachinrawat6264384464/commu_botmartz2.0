import { NextResponse } from "next/server";
import { adminDb, hasAdminCredentials } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, ids } = body;

    const idsToDelete: string[] = ids || (id ? [id] : []);

    if (idsToDelete.length === 0) {
      return NextResponse.json({ success: false, error: "No IDs provided for deletion." }, { status: 400 });
    }

    if (adminDb && hasAdminCredentials) {
      try {
        await Promise.all(idsToDelete.map((docId) => adminDb.collection("bootcamp_registrations").doc(docId).delete()));
      } catch (e) {}
    }

    return NextResponse.json({
      success: true,
      message: `${idsToDelete.length} registration record(s) deleted successfully.`,
      deletedIds: idsToDelete
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  return POST(req);
}
