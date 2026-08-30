import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      amount, // In INR (e.g. 299 or 1999)
      itemName,
      itemCategory, // "FELLOWSHIP_PASS" | "EVENT_TICKET" | "WALLET_TOPUP"
      customerName,
      customerEmail,
      customerPhone,
      metadata
    } = body;

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json(
        { success: false, error: "Valid payment amount is required." },
        { status: 400 }
      );
    }

    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      return NextResponse.json(
        { success: false, error: "Payment gateway credentials are not configured." },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

    const amountInPaise = Math.round(Number(amount) * 100);
    const receiptId = `rcpt_${itemCategory ? itemCategory.toLowerCase().slice(0, 4) : "bot"}_${Date.now().toString().slice(-8)}`;

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: receiptId,
      notes: {
        itemName: itemName || "Botmartz Service",
        itemCategory: itemCategory || "FELLOWSHIP_PASS",
        customerName: customerName || "",
        customerEmail: customerEmail || "",
        customerPhone: customerPhone || "",
        ...(metadata || {})
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: key_id,
      receipt: order.receipt
    });
  } catch (err: any) {
    console.error("Razorpay order creation error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to initialize Razorpay checkout order." },
      { status: 500 }
    );
  }
}
