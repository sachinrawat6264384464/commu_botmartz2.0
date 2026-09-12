import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { fetchCollectionDocs } from "@/lib/firebase-admin-helper";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json({ success: false, error: "Coupon code is required." }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();

    // 1. Fetch coupons & registrations
    let coupons: any[] = [];
    let registrations: any[] = [];

    try {
      coupons = await fetchCollectionDocs("coupons");
      registrations = await fetchCollectionDocs("bootcamp_registrations");
    } catch (e) {}

    // Find requested coupon
    const match = coupons.find((c: any) => (c.code || "").trim().toUpperCase() === cleanCode);

    if (!match) {
      // Hardcoded fallback check for default BOTMARTZ10 or BMFREE codes
      if (cleanCode === "BOTMARTZ10") {
        return NextResponse.json({
          success: true,
          code: "BOTMARTZ10",
          discountType: "percentage",
          discountValue: 10,
          maxUses: 50,
          remainingUses: 23
        });
      }
      return NextResponse.json({ success: false, error: "Invalid coupon code." }, { status: 404 });
    }

    if (match.isActive === false) {
      return NextResponse.json({ success: false, error: "This coupon code is currently inactive." }, { status: 400 });
    }

    // Calculate actual usages from registrations
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
      discountValue: Number(match.discountValue) || 100,
      maxUses,
      remainingUses
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
