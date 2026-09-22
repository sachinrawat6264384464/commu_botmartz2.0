import { adminDb, hasAdminCredentials } from "@/lib/firebase-admin";
import { fetchCollectionDocs } from "@/lib/firebase-admin-helper";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, limit } from "firebase/firestore";

export interface CouponItem {
  id: string;
  code: string;
  type: "free-pass" | "custom";
  discountType: "percentage" | "fixed" | "flat";
  discountValue: number;
  isActive: boolean;
  maxUses: number;
  currentUses: number;
  createdAt: string;
}

export const SEED_COUPONS: CouponItem[] = [
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

declare global {
  var __BOTMARTZ_GLOBAL_COUPONS_CACHE__: Map<string, CouponItem> | undefined;
}

const globalCache = globalThis.__BOTMARTZ_GLOBAL_COUPONS_CACHE__ || new Map<string, CouponItem>();

if (!globalThis.__BOTMARTZ_GLOBAL_COUPONS_CACHE__) {
  globalThis.__BOTMARTZ_GLOBAL_COUPONS_CACHE__ = globalCache;
  SEED_COUPONS.forEach((c) => globalCache.set(c.code.toUpperCase(), c));
}

export const RUNTIME_COUPONS_CACHE = globalCache;

export function saveCouponToMemory(item: CouponItem) {
  RUNTIME_COUPONS_CACHE.set(item.code.toUpperCase(), item);
}


export async function getAllCouponsMerged(): Promise<CouponItem[]> {
  let dbCoupons: any[] = [];
  try {
    const timeoutPromise = new Promise<any[]>((resolve) => setTimeout(() => resolve([]), 1500));
    dbCoupons = await Promise.race([fetchCollectionDocs("coupons"), timeoutPromise]);
  } catch (e) {
    dbCoupons = [];
  }

  const map = new Map<string, CouponItem>();

  // Add Memory Cache & Seeds
  RUNTIME_COUPONS_CACHE.forEach((val, key) => map.set(key, val));

  // Add DB Coupons (take precedence)
  if (dbCoupons && dbCoupons.length > 0) {
    dbCoupons.forEach((c) => {
      const codeUpper = (c.code || "").trim().toUpperCase();
      if (codeUpper) {
        const item: CouponItem = {
          id: c.id || `cp_${Date.now()}`,
          code: codeUpper,
          type: c.type || "custom",
          discountType: c.discountType || "percentage",
          discountValue: Number(c.discountValue) || 10,
          isActive: c.isActive !== false,
          maxUses: Number(c.maxUses) || 50,
          currentUses: Number(c.currentUses) || 0,
          createdAt: c.createdAt || new Date().toISOString()
        };
        map.set(codeUpper, item);
        RUNTIME_COUPONS_CACHE.set(codeUpper, item);
      }
    });
  }

  return Array.from(map.values());
}

export async function findCouponByCode(code: string): Promise<CouponItem | null> {
  const cleanCode = code.trim().toUpperCase();
  if (!cleanCode) return null;

  // 1. Check memory cache first
  if (RUNTIME_COUPONS_CACHE.has(cleanCode)) {
    return RUNTIME_COUPONS_CACHE.get(cleanCode)!;
  }

  // 2. Check Firestore DB directly via Admin SDK if connected
  if (adminDb && hasAdminCredentials) {
    try {
      const snap = await adminDb.collection("coupons").where("code", "==", cleanCode).limit(1).get();
      if (!snap.empty) {
        const docData = snap.docs[0].data();
        const foundItem: CouponItem = {
          id: snap.docs[0].id,
          code: cleanCode,
          type: docData.type || "custom",
          discountType: docData.discountType || "percentage",
          discountValue: Number(docData.discountValue) || 10,
          isActive: docData.isActive !== false,
          maxUses: Number(docData.maxUses) || 50,
          currentUses: Number(docData.currentUses) || 0,
          createdAt: docData.createdAt || new Date().toISOString()
        };
        RUNTIME_COUPONS_CACHE.set(cleanCode, foundItem);
        return foundItem;
      }
    } catch (e) {
      console.warn("Firestore admin find coupon error:", e);
    }
  }

  // 3. Fallback check: Client Firestore SDK
  try {
    const q = query(collection(db, "coupons"), where("code", "==", cleanCode), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const docData = snap.docs[0].data();
      const foundItem: CouponItem = {
        id: snap.docs[0].id,
        code: cleanCode,
        type: docData.type || "custom",
        discountType: docData.discountType || "percentage",
        discountValue: Number(docData.discountValue) || 10,
        isActive: docData.isActive !== false,
        maxUses: Number(docData.maxUses) || 50,
        currentUses: Number(docData.currentUses) || 0,
        createdAt: docData.createdAt || new Date().toISOString()
      };
      RUNTIME_COUPONS_CACHE.set(cleanCode, foundItem);
      return foundItem;
    }
  } catch (e) {
    console.warn("Firestore client find coupon error:", e);
  }

  // 4. Fallback check: fetchCollectionDocs merged list
  try {
    const all = await getAllCouponsMerged();
    const match = all.find((c) => c.code.toUpperCase() === cleanCode);
    if (match) {
      RUNTIME_COUPONS_CACHE.set(cleanCode, match);
      return match;
    }
  } catch (e) {}

  // 5. Fallback check for SEED_COUPONS
  const seedMatch = SEED_COUPONS.find((c) => c.code.toUpperCase() === cleanCode);
  if (seedMatch) return seedMatch;

  // 6. Dynamic fallback rule for BMFREE prefix
  if (cleanCode.startsWith("BMFREE")) {
    const dynamicFreePass: CouponItem = {
      id: `cp_${cleanCode}`,
      code: cleanCode,
      type: "free-pass",
      discountType: "percentage",
      discountValue: 100,
      isActive: true,
      maxUses: 1,
      currentUses: 0,
      createdAt: new Date().toISOString()
    };
    RUNTIME_COUPONS_CACHE.set(cleanCode, dynamicFreePass);
    return dynamicFreePass;
  }

  return null;
}
