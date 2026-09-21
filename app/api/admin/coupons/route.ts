import { NextResponse } from "next/server";
import { adminDb, hasAdminCredentials } from "@/lib/firebase-admin";
import { fetchCollectionDocs } from "@/lib/firebase-admin-helper";
import { db } from "@/lib/firebase";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import {
  getAllCouponsMerged,
  saveCouponToMemory,
  RUNTIME_COUPONS_CACHE,
  CouponItem
} from "@/lib/coupons-store";

export async function GET(req: Request) {
  try {
    let registrations: any[] = [];

    try {
      const timeoutPromise = new Promise<any[]>((resolve) => setTimeout(() => resolve([]), 1200));
      registrations = await Promise.race([fetchCollectionDocs("bootcamp_registrations"), timeoutPromise]);
    } catch (e) {
      registrations = [];
    }

    const allCoupons = await getAllCouponsMerged();

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

    // Merge document fields with dynamic usage map
    const mergedCoupons = allCoupons.map((c: any) => {
      const codeUpper = (c.code || "").trim().toUpperCase();
      const regUses = usageMap[codeUpper] || 0;
      const dbUses = Number(c.currentUses) || 0;
      const currentUses = Math.max(dbUses, regUses);
      return {
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

      batchCodes.forEach((code: string, idx: number) => {
        const docId = `cp_free_${Date.now()}_${idx}`;
        const item: CouponItem = {
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
        saveCouponToMemory(item);
        createdDocs.push(item);
      });

      if (adminDb && hasAdminCredentials) {
        try {
          const batch = adminDb.batch();
          createdDocs.forEach((item) => {
            const ref = adminDb.collection("coupons").doc(item.id);
            batch.set(ref, item, { merge: true });
          });
          await batch.commit();
        } catch (e) {
          console.warn("Firestore batch commit warning:", e);
        }
      }

      // Dual-mode write using Client SDK fallback
      try {
        await Promise.all(
          createdDocs.map((item) => setDoc(doc(db, "coupons", item.id), item, { merge: true }))
        );
      } catch (e) {
        console.warn("Firestore client batch set warning:", e);
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
      const newItem: CouponItem = {
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

      saveCouponToMemory(newItem);

      if (adminDb && hasAdminCredentials) {
        try {
          await adminDb.collection("coupons").doc(docId).set(newItem, { merge: true });
        } catch (e) {
          console.warn("Firestore set custom coupon warning:", e);
        }
      }

      // Dual-mode write using Client SDK fallback
      try {
        await setDoc(doc(db, "coupons", docId), newItem, { merge: true });
      } catch (e) {
        console.warn("Firestore client set custom coupon warning:", e);
      }

      return NextResponse.json({ success: true, coupon: newItem });
    }

    // 3. Edit max limit
    if (action === "edit_limit" && id && maxUses !== undefined) {
      RUNTIME_COUPONS_CACHE.forEach((c) => {
        if (c.id === id) c.maxUses = Number(maxUses);
      });

      if (adminDb && hasAdminCredentials) {
        try {
          await adminDb.collection("coupons").doc(id).set({ maxUses: Number(maxUses) }, { merge: true });
        } catch (e) {}
      }

      try {
        await setDoc(doc(db, "coupons", id), { maxUses: Number(maxUses) }, { merge: true });
      } catch (e) {}

      return NextResponse.json({ success: true, id, maxUses: Number(maxUses) });
    }

    // 4. Toggle active status
    if (action === "toggle_active" && id) {
      RUNTIME_COUPONS_CACHE.forEach((c) => {
        if (c.id === id) c.isActive = Boolean(isActive);
      });

      if (adminDb && hasAdminCredentials) {
        try {
          await adminDb.collection("coupons").doc(id).set({ isActive: Boolean(isActive) }, { merge: true });
        } catch (e) {}
      }

      try {
        await setDoc(doc(db, "coupons", id), { isActive: Boolean(isActive) }, { merge: true });
      } catch (e) {}

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

    RUNTIME_COUPONS_CACHE.forEach((c, key) => {
      if (idsToDelete.includes(c.id)) {
        RUNTIME_COUPONS_CACHE.delete(key);
      }
    });

    if (adminDb && hasAdminCredentials) {
      try {
        await Promise.all(idsToDelete.map((docId) => adminDb.collection("coupons").doc(docId).delete()));
      } catch (e) {}
    }

    try {
      await Promise.all(idsToDelete.map((docId) => deleteDoc(doc(db, "coupons", docId))));
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: `${idsToDelete.length} coupon(s) deleted successfully.`,
      deletedIds: idsToDelete
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}


