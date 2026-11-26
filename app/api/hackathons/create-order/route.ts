import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { SOLO_HACKATHON_FEE, TEAM_HACKATHON_FEE } from "@/lib/hackathons";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectId, projectTitle, mode, teamName, leader, members } = body;

    if (!projectId || !mode || !leader?.name || !leader?.email || !leader?.phone) {
      return NextResponse.json(
        { success: false, error: "Project, mode, and leader details (name, email, phone) are required." },
        { status: 400 }
      );
    }

    if (mode !== "solo" && mode !== "team") {
      return NextResponse.json(
        { success: false, error: "Invalid participation mode." },
        { status: 400 }
      );
    }

    if (mode === "team") {
      if (!teamName || !teamName.trim()) {
        return NextResponse.json(
          { success: false, error: "Team name is required for team participation." },
          { status: 400 }
        );
      }
      const totalMembers = Array.isArray(members) ? members.filter((m: any) => m?.name?.trim() && m?.email?.trim()).length : 0;
      if (totalMembers < 2 || totalMembers > 3) {
        return NextResponse.json(
          { success: false, error: "Team must have a minimum of 2 and maximum of 3 members (including Team Leader)." },
          { status: 400 }
        );
      }
    }

    const amountInInr = mode === "team" ? TEAM_HACKATHON_FEE : SOLO_HACKATHON_FEE;
    const amountInPaise = amountInInr * 100;
    const receiptId = `hack_${mode}_${Date.now().toString().slice(-8)}`;

    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      return NextResponse.json({
        success: true,
        orderId: `order_hack_mock_${Date.now()}`,
        amount: amountInPaise,
        amountInInr,
        currency: "INR",
        keyId: "rzp_test_mock_key",
        receipt: receiptId,
        isDevMock: true,
      });
    }

    const razorpay = new Razorpay({ key_id, key_secret });
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: receiptId,
      notes: {
        type: "ONLINE_HACKATHON",
        projectId,
        projectTitle: projectTitle || "",
        mode,
        teamName: mode === "team" ? teamName.trim() : leader.name.trim(),
        leaderEmail: leader.email.trim().toLowerCase(),
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      amountInInr,
      currency: order.currency,
      keyId: key_id,
      receipt: order.receipt,
    });
  } catch (err: any) {
    console.error("Hackathon order creation error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to initialize hackathon payment order." },
      { status: 500 }
    );
  }
}
