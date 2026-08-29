import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

const FALLBACK_COUPONS: Record<string, { discountPercent: number; flatDiscount?: number }> = {
  "EARLYBIRD50": { discountPercent: 50 },
  "STUDENTVIP": { discountPercent: 100 },
  "COMMUNITY20": { discountPercent: 20 },
  "BOTMARTZAI": { discountPercent: 30 }
};

export async function POST(request: Request) {
  try {
    const { code, amount } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "Coupon code is required." }, { status: 400 });
    }

    const upper = code.trim().toUpperCase();

    // 1. Check Firestore coupons
    try {
      const snap = await adminDb.collection("coupons").where("code", "==", upper).get();
      if (!snap.empty) {
        const cData = snap.docs[0].data();
        let discount = 0;
        if (cData.discountPercent) {
          discount = (Number(amount) * cData.discountPercent) / 100;
        } else if (cData.flatDiscount) {
          discount = Math.min(Number(amount), cData.flatDiscount);
        }
        return NextResponse.json({
          valid: true,
          discountAmount: Math.round(discount),
          finalAmount: Math.max(0, Math.round(Number(amount) - discount)),
          code: upper
        });
      }
    } catch (e) {}

    // 2. Check Static Fallback
    if (FALLBACK_COUPONS[upper]) {
      const c = FALLBACK_COUPONS[upper];
      const discount = (Number(amount) * c.discountPercent) / 100;
      return NextResponse.json({
        valid: true,
        discountAmount: Math.round(discount),
        finalAmount: Math.max(0, Math.round(Number(amount) - discount)),
        code: upper
      });
    }

    return NextResponse.json({ valid: false, error: "Invalid or expired promo code." }, { status: 400 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Coupon verification failed." }, { status: 500 });
  }
}
