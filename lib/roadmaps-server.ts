import { adminDb, hasAdminCredentials } from "@/lib/firebase-admin";
import { ROLE_ROADMAPS, RoleRoadmap } from "@/lib/roadmaps";

export interface ManagedRoadmap extends RoleRoadmap {
  isPaid: boolean;
  price: number;
  validityDays: number;
  extendPrice: number;
  extendDays: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RoadmapPurchase {
  id: string;
  uniqueCode: string;
  roadmapId: string;
  roadmapTitle: string;
  domain: string;
  userName: string;
  userEmail: string;
  amountPaid: number;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  createdAt: string;
  expiresAt: string;
  extensionCount: number;
}

export const DEFAULT_ROADMAP_PRICE = 200;
export const DEFAULT_ROADMAP_VALIDITY_DAYS = 3;
export const DEFAULT_EXTEND_PRICE = 100;
export const DEFAULT_EXTEND_DAYS = 2;

export function generateRoadmapUniqueCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `BM-ROAD-${code}`;
}

export async function ensureManagedRoadmaps(): Promise<ManagedRoadmap[]> {
  const now = new Date().toISOString();
  const defaults: ManagedRoadmap[] = ROLE_ROADMAPS.map((r, idx) => ({
    ...r,
    // First 2 roadmaps are free & accessible publicly; remaining are paid (₹200 for 3 days)
    isPaid: idx >= 2,
    price: DEFAULT_ROADMAP_PRICE,
    validityDays: DEFAULT_ROADMAP_VALIDITY_DAYS,
    extendPrice: DEFAULT_EXTEND_PRICE,
    extendDays: DEFAULT_EXTEND_DAYS,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  }));

  if (!adminDb || !hasAdminCredentials) {
    return defaults;
  }

  try {
    const snap = await adminDb.collection("career_roadmaps").get();
    if (snap.empty) {
      const batch = adminDb.batch();
      for (const rm of defaults) {
        const ref = adminDb.collection("career_roadmaps").doc(rm.id);
        batch.set(ref, rm);
      }
      await batch.commit();
      return defaults;
    }

    const list = snap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<ManagedRoadmap, "id">),
    }));

    // Keep free ones first or preserve stable order
    list.sort((a, b) => {
      if (a.isPaid !== b.isPaid) return a.isPaid ? 1 : -1;
      return (a.roleName || "").localeCompare(b.roleName || "");
    });

    return list;
  } catch (err) {
    console.warn("ensureManagedRoadmaps warning:", err);
    return defaults;
  }
}
