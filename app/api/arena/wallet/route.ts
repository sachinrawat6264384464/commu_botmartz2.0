import { NextRequest, NextResponse } from "next/server";
import { getStudentWallet } from "@/lib/wallet";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email");
    if (!email) {
      return NextResponse.json({ error: "Email query param required." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const wallet = await getStudentWallet(cleanEmail);

    let transactions: any[] = [];
    if (adminDb) {
      const snap = await adminDb
        .collection("wallet_transactions")
        .where("studentEmail", "==", cleanEmail)
        .orderBy("timestamp", "desc")
        .limit(20)
        .get();

      if (!snap.empty) {
        transactions = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          timestamp: d.data().timestamp?.toDate?.() ? d.data().timestamp.toDate().toISOString() : new Date().toISOString()
        }));
      }
    }

    return NextResponse.json({
      success: true,
      wallet,
      transactions
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
