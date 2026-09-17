import { NextResponse } from "next/server";
import { adjustStudentWallet } from "@/lib/wallet";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { senderEmail, recipientEmail, amount, reason } = body;

    const cleanSender = senderEmail?.toLowerCase()?.trim();
    const cleanRecipient = recipientEmail?.toLowerCase()?.trim();
    const numAmount = Number(amount);

    if (!cleanSender || !cleanRecipient) {
      return NextResponse.json(
        { success: false, error: "Sender email and recipient email are required." },
        { status: 400 }
      );
    }

    if (cleanSender === cleanRecipient) {
      return NextResponse.json(
        { success: false, error: "You cannot transfer Karma Coins to yourself." },
        { status: 400 }
      );
    }

    if (!numAmount || numAmount <= 0) {
      return NextResponse.json(
        { success: false, error: "Valid positive amount is required for coin transfer." },
        { status: 400 }
      );
    }

    // 1. Deduct from Sender
    const deductResult = await adjustStudentWallet(
      cleanSender,
      numAmount,
      "SPEND",
      `Tipped ${cleanRecipient}: ${reason || "Peer collaboration tip"}`,
      `transfer_out_${Date.now()}`
    );

    if (!deductResult.success) {
      return NextResponse.json(
        { success: false, error: deductResult.error || "Transfer failed due to insufficient Karma Coins balance." },
        { status: 400 }
      );
    }

    // 2. Credit to Recipient
    await adjustStudentWallet(
      cleanRecipient,
      numAmount,
      "EARN",
      `Received Tip from ${cleanSender}: ${reason || "Peer collaboration tip"}`,
      `transfer_in_${Date.now()}`
    );

    return NextResponse.json({
      success: true,
      message: `Successfully transferred ${numAmount} Karma Coins to ${cleanRecipient}!`,
      newBalance: deductResult.newBalance,
    });
  } catch (err: any) {
    console.error("Peer wallet transfer API error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process transfer." },
      { status: 500 }
    );
  }
}
