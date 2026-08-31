import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getStudentWallet, adjustStudentWallet } from "@/lib/wallet";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")?.toLowerCase().trim();

    if (!adminDb) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
    }

    if (email) {
      const wallet = await getStudentWallet(email);
      const txSnap = await adminDb
        .collection("wallet_transactions")
        .where("email", "==", email)
        .orderBy("createdAt", "desc")
        .limit(50)
        .get();

      const transactions = txSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

      return NextResponse.json({
        success: true,
        wallet,
        transactions
      });
    }

    // List recent 30 wallet transactions across system
    const recentTxSnap = await adminDb
      .collection("wallet_transactions")
      .orderBy("createdAt", "desc")
      .limit(30)
      .get();

    const recentTransactions = recentTxSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // List recent wallets
    const walletsSnap = await adminDb
      .collection("student_wallets")
      .orderBy("updatedAt", "desc")
      .limit(30)
      .get();

    const wallets = walletsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    return NextResponse.json({
      success: true,
      recentTransactions,
      wallets
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, amount, action, reason, paymentRef, adminEmail } = body;

    if (!email || !amount || !action) {
      return NextResponse.json({ error: "Missing required fields (email, amount, action)" }, { status: 400 });
    }

    const numAmount = parseInt(amount, 10);
    if (isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json({ error: "Amount must be a positive integer" }, { status: 400 });
    }

    const type = action === "CREDIT" ? "EARN" : "SPEND";
    const finalReason = `[Admin ${adminEmail || "Admin"}] ${reason || (action === "CREDIT" ? "Manual Karma Coin Grant" : "Manual Deduction")}${
      paymentRef ? ` (Ref: ${paymentRef})` : ""
    }`;

    const updatedWallet = await adjustStudentWallet(
      email,
      numAmount,
      type,
      finalReason,
      paymentRef || `ADM-${Date.now()}`
    );

    // Record admin audit log
    if (adminDb) {
      await adminDb.collection("admin_audit_logs").add({
        action: "WALLET_ADJUSTMENT",
        targetEmail: email.toLowerCase().trim(),
        adminEmail: adminEmail || "system-admin",
        amount: numAmount,
        type,
        reason: finalReason,
        paymentRef: paymentRef || null,
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json({
      success: true,
      wallet: updatedWallet,
      message: `Successfully ${action === "CREDIT" ? "credited" : "debited"} ${numAmount} Karma Coins for ${email}.`
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
