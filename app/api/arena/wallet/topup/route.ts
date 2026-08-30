import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, packId, amountPaid, coinsAmount, paymentReference } = body;

    if (!email || !coinsAmount) {
      return NextResponse.json({ error: "Email and coinsAmount are required." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const coins = Number(coinsAmount);

    let updatedBalance = coins;

    if (adminDb) {
      // 1. Record in wallet_transactions
      const txRef = await adminDb.collection("wallet_transactions").add({
        studentEmail: cleanEmail,
        type: "CREDIT_PURCHASE",
        amount: coins,
        description: `Purchased ${packId || "Karma Credit Pack"} (${coins} Coins for ₹${amountPaid || 99})`,
        paymentReference: paymentReference || `tx_credit_${Date.now()}`,
        status: "Completed",
        timestamp: new Date().toISOString(),
      });

      // 2. Update user profile karma balance
      const userQuery = await adminDb.collection("student_profiles").where("email", "==", cleanEmail).limit(1).get();
      if (!userQuery.empty) {
        const userDoc = userQuery.docs[0];
        const currentKarma = Number(userDoc.data().karmaCoins || 0);
        updatedBalance = currentKarma + coins;
        await userDoc.ref.set(
          {
            karmaCoins: updatedBalance,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } else {
        // Create student profile record
        await adminDb.collection("student_profiles").add({
          email: cleanEmail,
          karmaCoins: coins,
          createdAt: new Date().toISOString(),
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully added ${coins} Karma Coins to your balance!`,
      newBalance: updatedBalance,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to process topup." }, { status: 500 });
  }
}
