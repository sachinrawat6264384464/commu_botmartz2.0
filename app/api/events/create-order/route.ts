import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(request: Request) {
  try {
    const { amount, eventId, ticketType, attendeeName, attendeeEmail } = await request.json();

    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder";
    const key_secret = process.env.RAZORPAY_KEY_SECRET || "placeholder_secret";

    // If live keys exist, create official Razorpay order
    if (process.env.RAZORPAY_KEY_SECRET && process.env.RAZORPAY_KEY_SECRET !== "placeholder_secret") {
      const razorpay = new Razorpay({
        key_id,
        key_secret,
      });

      const options = {
        amount: Math.round(Number(amount) * 100), // in paise
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
        notes: {
          eventId: eventId || "ai-frontier-2026",
          ticketType: ticketType || "Standard",
          attendeeName: attendeeName || "",
          attendeeEmail: attendeeEmail || "",
        },
      };

      const order = await razorpay.orders.create(options);
      return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId: key_id });
    }

    // Mock order response for testing & preview
    return NextResponse.json({
      orderId: `order_mock_${Date.now()}`,
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      keyId: key_id
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Failed to initialize checkout order" }, { status: 500 });
  }
}
