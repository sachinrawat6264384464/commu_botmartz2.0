import { NextResponse } from "next/server";
import { adminDb, hasAdminCredentials } from "@/lib/firebase-admin";
import { adjustStudentWallet } from "@/lib/wallet";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { studentEmail, perkId, perkTitle, perkCost } = body;

    if (!studentEmail || typeof studentEmail !== "string" || !studentEmail.trim()) {
      return NextResponse.json(
        { success: false, error: "Student email is required for redemption." },
        { status: 400 }
      );
    }

    if (!perkId || !perkTitle || !perkCost || Number(perkCost) <= 0) {
      return NextResponse.json(
        { success: false, error: "Valid perk details and cost are required." },
        { status: 400 }
      );
    }

    const cleanEmail = studentEmail.trim().toLowerCase();
    const cost = Number(perkCost);

    // 1. Atomically deduct coins from wallet
    const walletResult = await adjustStudentWallet(
      cleanEmail,
      cost,
      "SPEND",
      `Redeemed Perk: ${perkTitle}`,
      perkId
    );

    if (!walletResult.success) {
      return NextResponse.json(
        { success: false, error: walletResult.error || "Redemption failed due to insufficient Karma Coins balance." },
        { status: 400 }
      );
    }

    // 2. Persist perk redemption record in Firestore
    const fulfillmentCode = `PERK-${Math.floor(100000 + Math.random() * 900000)}`;
    const redemptionData = {
      studentEmail: cleanEmail,
      perkId,
      perkTitle,
      perkCost: cost,
      fulfillmentCode,
      status: "PENDING_FULFILLMENT",
      redeemedAt: new Date().toISOString(),
    };

    let redemptionId = `rdm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    if (adminDb && hasAdminCredentials) {
      try {
        const docRef = await adminDb.collection("perk_redemptions").add(redemptionData);
        redemptionId = docRef.id;
      } catch (dbErr) {
        console.warn("Firestore perk_redemptions write warning:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully redeemed "${perkTitle}"! Voucher/Ref code: ${fulfillmentCode}. Check your email for fulfillment updates.`,
      redemptionId,
      fulfillmentCode,
      newBalance: walletResult.newBalance,
    });
  } catch (err: any) {
    console.error("Perk redemption API error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process perk redemption." },
      { status: 500 }
    );
  }
}
