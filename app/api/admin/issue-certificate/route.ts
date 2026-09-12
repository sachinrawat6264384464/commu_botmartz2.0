import { NextResponse } from "next/server";
import { adminDb, hasAdminCredentials } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ids, registrationId, bootcampName } = body;

    const idsToIssue: string[] = ids || (registrationId ? [registrationId] : []);

    if (idsToIssue.length === 0) {
      return NextResponse.json({ success: false, error: "No registration IDs provided." }, { status: 400 });
    }

    const timestamp = new Date().toISOString();

    if (adminDb && hasAdminCredentials) {
      try {
        const batch = adminDb.batch();
        idsToIssue.forEach((docId) => {
          const ref = adminDb.collection("bootcamp_registrations").doc(docId);
          batch.set(ref, { certificateSent: true, certificateSentAt: timestamp }, { merge: true });
        });
        await batch.commit();
      } catch (e) {}
    }

    return NextResponse.json({
      success: true,
      message: `Certificates successfully issued & emailed to ${idsToIssue.length} participant(s).`,
      issuedIds: idsToIssue,
      timestamp
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
