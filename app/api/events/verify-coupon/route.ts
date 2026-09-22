import { NextResponse } from "next/server";
import { fetchCollectionDocs } from "@/lib/firebase-admin-helper";
import { findCouponByCode } from "@/lib/coupons-store";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const code = body.code || body.couponCode;

    if (!code || typeof code !== "string") {
      return NextResponse.json({ success: false, error: "Coupon code is required." }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();

    // Find coupon using shared helper (Memory Cache + DB + Seed list)
    const match = await findCouponByCode(cleanCode);

    if (!match) {
      return NextResponse.json({ success: false, error: "Invalid coupon code. Please check and try again." }, { status: 404 });
    }

    if (match.isActive === false) {
      return NextResponse.json({ success: false, error: "This coupon code is currently inactive." }, { status: 400 });
    }

    // Fetch bootcamp registrations for usage count
    let registrations: any[] = [];
    try {
      const timeoutPromise = new Promise<any[]>((resolve) => setTimeout(() => resolve([]), 1200));
      registrations = await Promise.race([fetchCollectionDocs("bootcamp_registrations"), timeoutPromise]);
    } catch (e) {
      registrations = [];
    }

    // Calculate actual usages from DB registrations
    const realUses = registrations.filter(
      (r: any) => (r.appliedCoupon || "").trim().toUpperCase() === cleanCode
    ).length;

    const currentUses = Math.max(Number(match.currentUses) || 0, realUses);
    const maxUses = Number(match.maxUses) || 1;

    if (currentUses >= maxUses) {
      return NextResponse.json({
        success: false,
        error: `Coupon limit reached (${currentUses}/${maxUses} used).`
      }, { status: 400 });
    }

    const remainingUses = Math.max(0, maxUses - currentUses);

    return NextResponse.json({
      success: true,
      code: match.code,
      discountType: match.discountType || "percentage",
      discountValue: Number(match.discountValue) || 10,
      maxUses,
      remainingUses,
      message: match.discountValue === 100 ? "100% OFF Free Pass Coupon Applied!" : `${match.discountValue}% Discount Applied!`
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}


