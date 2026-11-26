import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { adminDb, hasAdminCredentials } from "@/lib/firebase-admin";
import {
  DEFAULT_EXTEND_PRICE,
  DEFAULT_ROADMAP_PRICE,
  ensureManagedRoadmaps,
} from "@/lib/roadmaps-server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action = "unlock", roadmapId, uniqueCode, userName, userEmail } = body;

    let amountInInr = DEFAULT_ROADMAP_PRICE;
    let itemTitle = "Career Roadmap Access";

    if (action === "extend") {
      const cleanCode = String(uniqueCode || "").trim().toUpperCase();
      if (!cleanCode) {
        return NextResponse.json(
          { success: false, error: "Please enter your Unique Code to extend validity." },
          { status: 400 }
        );
      }

      if (adminDb && hasAdminCredentials) {
        const purchaseSnap = await adminDb.collection("roadmap_purchases").doc(cleanCode).get();
        if (!purchaseSnap.exists) {
          return NextResponse.json(
            { success: false, error: "Unique Code not found in database." },
            { status: 404 }
          );
        }
        const pData = purchaseSnap.data() as any;
        itemTitle = `Extend +2 Days: ${pData.roadmapTitle || cleanCode}`;

        const rmSnap = await adminDb.collection("career_roadmaps").doc(pData.roadmapId).get();
        const rmData = rmSnap.exists ? (rmSnap.data() as any) : null;
        amountInInr = Number(rmData?.extendPrice || DEFAULT_EXTEND_PRICE);
      } else {
        amountInInr = DEFAULT_EXTEND_PRICE;
      }
    } else {
      if (!roadmapId || !userName?.trim() || !userEmail?.trim()) {
        return NextResponse.json(
          { success: false, error: "Roadmap, Name, and Email are required." },
          { status: 400 }
        );
      }

      const roadmaps = await ensureManagedRoadmaps();
      const target = roadmaps.find((r) => r.id === roadmapId);
      if (!target) {
        return NextResponse.json(
          { success: false, error: "Selected roadmap not found." },
          { status: 404 }
        );
      }
      amountInInr = Number(target.price || DEFAULT_ROADMAP_PRICE);
      itemTitle = `${target.roleName} (${target.validityDays || 3} Days)`;
    }

    const amountInPaise = amountInInr * 100;
    const receiptId = `road_${action}_${Date.now().toString().slice(-8)}`;
    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      return NextResponse.json({
        success: true,
        orderId: `order_road_mock_${Date.now()}`,
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
        type: "CAREER_ROADMAP",
        action,
        roadmapId: roadmapId || "",
        uniqueCode: uniqueCode || "",
        userEmail: String(userEmail || "").toLowerCase().trim(),
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
      itemTitle,
    });
  } catch (err: any) {
    console.error("Roadmap create-order error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to initialize roadmap payment order." },
      { status: 500 }
    );
  }
}
