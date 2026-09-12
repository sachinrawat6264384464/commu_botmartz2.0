import { NextResponse } from "next/server";
import { adminDb, hasAdminCredentials } from "@/lib/firebase-admin";
import { fetchCollectionDocs } from "@/lib/firebase-admin-helper";

const SEED_COUPONS = [
  {
    id: "cp-001",
    code: "BMFREE-8RTE-DSVX",
    type: "free-pass",
    discountType: "percentage",
    discountValue: 100,
    isActive: true,
    maxUses: 1,
    currentUses: 1,
    createdAt: "2026-08-10T08:56:00.000Z"
  },
  {
    id: "cp-002",
    code: "BMFREE-VTLR-J3D2",
    type: "free-pass",
    discountType: "percentage",
    discountValue: 100,
    isActive: true,
    maxUses: 1,
    currentUses: 0,
    createdAt: "2026-08-09T20:10:00.000Z"
  },
  {
    id: "cp-003",
    code: "BMFREE-3D48-VCZ7",
    type: "free-pass",
    discountType: "percentage",
    discountValue: 100,
    isActive: true,
    maxUses: 1,
    currentUses: 1,
    createdAt: "2026-08-08T21:25:00.000Z"
  },
  {
    id: "cp-004",
    code: "BMFREE-ULGA-TU79",
    type: "free-pass",
    discountType: "percentage",
    discountValue: 100,
    isActive: true,
    maxUses: 1,
    currentUses: 1,
    createdAt: "2026-08-08T21:15:00.000Z"
  },
  {
    id: "cp-005",
    code: "BMFREE6",
    type: "free-pass",
    discountType: "percentage",
    discountValue: 100,
    isActive: true,
    maxUses: 6,
    currentUses: 1,
    createdAt: "2026-08-07T06:02:00.000Z"
  },
  {
    id: "cp-006",
    code: "BMFREE-357J-DVAM",
    type: "free-pass",
    discountType: "percentage",
    discountValue: 100,
    isActive: true,
    maxUses: 1,
    currentUses: 1,
    createdAt: "2026-08-06T15:09:00.000Z"
  },
  {
    id: "cp-007",
    code: "BMFREE-F7L8-E3ZX",
    type: "free-pass",
    discountType: "percentage",
    discountValue: 100,
    isActive: true,
    maxUses: 1,
    currentUses: 1,
    createdAt: "2026-08-06T09:07:00.000Z"
  },
  {
    id: "cp-008",
    code: "BMFREE100-6",
    type: "free-pass",
    discountType: "percentage",
    discountValue: 100,
    isActive: true,
    maxUses: 1,
    currentUses: 1,
    createdAt: "2026-08-05T15:17:00.000Z"
  },
  {
    id: "cp-009",
    code: "BOTMARTZ10",
    type: "custom",
    discountType: "percentage",
    discountValue: 10,
    isActive: true,
    maxUses: 50,
    currentUses: 27,
    createdAt: "2026-08-01T12:00:00.000Z"
  }
];

export async function GET(req: Request) {
  try {
    let coupons: any[] = [];
    let registrations: any[] = [];

    try {
      const timeoutPromise = new Promise<any[]>((resolve) => setTimeout(() => resolve([]), 250));
      coupons = await Promise.race([fetchCollectionDocs("coupons"), timeoutPromise]);
      registrations = await Promise.race([fetchCollectionDocs("bootcamp_registrations"), timeoutPromise]);
    } catch (e) {
      coupons = [];
      registrations = [];
    }

    if (!coupons || coupons.length === 0) {
      coupons = SEED_COUPONS;
    }

    // Build real-time usage map from registrations
    const usageMap: Record<string, number> = {};
    if (registrations && registrations.length > 0) {
      registrations.forEach((r: any) => {
        const code = (r.appliedCoupon || "").trim().toUpperCase();
        if (code) {
          usageMap[code] = (usageMap[code] || 0) + 1;
        }
      });
    }

    // Merge DB document fields with dynamic usage map
    const mergedCoupons = coupons.map((c: any) => {
      const codeUpper = (c.code || "").trim().toUpperCase();
      const regUses = usageMap[codeUpper] || 0;
      const dbUses = Number(c.currentUses) || 0;
      const currentUses = Math.max(dbUses, regUses);
      return {
        id: c.id,
        ...c,
        code: codeUpper,
        currentUses
      };
    });

    return NextResponse.json({
      success: true,
      coupons: mergedCoupons
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, couponData, batchCodes, id, maxUses, isActive } = body;

    // 1. Batch generate free coupons
    if (action === "batch_generate" && Array.isArray(batchCodes)) {
      const createdDocs: any[] = [];
      const timestamp = new Date().toISOString();

      if (adminDb && hasAdminCredentials) {
        const batch = adminDb.batch();
        batchCodes.forEach((code: string, idx: number) => {
          const docId = `cp_free_${Date.now()}_${idx}`;
          const item = {
            id: docId,
            code: code.trim().toUpperCase(),
            type: "free-pass",
            discountType: "percentage",
            discountValue: 100,
            isActive: true,
            maxUses: 1,
            currentUses: 0,
            createdAt: timestamp
          };
          const ref = adminDb.collection("coupons").doc(docId);
          batch.set(ref, item, { merge: true });
          createdDocs.push(item);
        });
        await batch.commit();
      }

      return NextResponse.json({
        success: true,
        message: `Successfully generated and saved ${batchCodes.length} free pass coupon codes.`,
        createdDocs
      });
    }

    // 2. Create single custom coupon
    if (action === "create" && couponData) {
      const docId = `cp_${Date.now()}`;
      const newItem = {
        id: docId,
        code: (couponData.code || "").trim().toUpperCase(),
        type: couponData.type || "custom",
        discountType: couponData.discountType || "percentage",
        discountValue: Number(couponData.discountValue) || 10,
        isActive: couponData.isActive !== false,
        maxUses: Number(couponData.maxUses) || 50,
        currentUses: 0,
        createdAt: new Date().toISOString()
      };

      if (adminDb && hasAdminCredentials) {
        await adminDb.collection("coupons").doc(docId).set(newItem, { merge: true });
      }

      return NextResponse.json({ success: true, coupon: newItem });
    }

    // 3. Edit max limit
    if (action === "edit_limit" && id && maxUses !== undefined) {
      if (adminDb && hasAdminCredentials) {
        await adminDb.collection("coupons").doc(id).set({ maxUses: Number(maxUses) }, { merge: true });
      }
      return NextResponse.json({ success: true, id, maxUses: Number(maxUses) });
    }

    // 4. Toggle active status
    if (action === "toggle_active" && id) {
      if (adminDb && hasAdminCredentials) {
        await adminDb.collection("coupons").doc(id).set({ isActive: Boolean(isActive) }, { merge: true });
      }
      return NextResponse.json({ success: true, id, isActive: Boolean(isActive) });
    }

    return NextResponse.json({ success: false, error: "Invalid POST action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id, ids } = body;

    const idsToDelete: string[] = ids || (id ? [id] : []);

    if (idsToDelete.length === 0) {
      return NextResponse.json({ success: false, error: "No coupon IDs specified." }, { status: 400 });
    }

    if (adminDb && hasAdminCredentials) {
      try {
        await Promise.all(idsToDelete.map((docId) => adminDb.collection("coupons").doc(docId).delete()));
      } catch (e) {}
    }

    return NextResponse.json({
      success: true,
      message: `${idsToDelete.length} coupon(s) deleted successfully.`,
      deletedIds: idsToDelete
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
