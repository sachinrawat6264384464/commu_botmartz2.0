import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export interface PartnerInquiry {
  id: string;
  organizationName: string;
  contactName: string;
  email: string;
  phone: string;
  organizationType: string;
  partnershipTrack: string;
  cohortOrBudget: string;
  proposal: string;
  websiteOrLinkedin: string;
  status: "Pending" | "In Review" | "Approved" | "Active Partner" | "Archived";
  adminNotes: string;
  createdAt: string;
  updatedAt: string;
}

const COLLECTION = "partner_inquiries";

declare global {
  var __partnerInquiriesStore: PartnerInquiry[] | undefined;
}

function getMemoryStore(): PartnerInquiry[] {
  if (!globalThis.__partnerInquiriesStore) {
    globalThis.__partnerInquiriesStore = [];
  }
  return globalThis.__partnerInquiriesStore;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status");

    let items: PartnerInquiry[] = [];

    if (adminDb) {
      try {
        const snap = await adminDb.collection(COLLECTION).orderBy("createdAt", "desc").limit(200).get();
        items = snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<PartnerInquiry, "id">),
        }));
      } catch (fsErr) {
        console.warn("partner_inquiries Firestore GET fallback:", fsErr);
        items = [...getMemoryStore()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      }
    } else {
      items = [...getMemoryStore()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }

    if (statusFilter && statusFilter !== "All") {
      items = items.filter((item) => item.status === statusFilter);
    }

    return NextResponse.json({ success: true, partners: items });
  } catch (err: any) {
    console.error("GET /api/partners error:", err);
    return NextResponse.json({ success: false, error: err.message || "Failed to load partners", partners: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      organizationName,
      contactName,
      email,
      phone,
      organizationType,
      partnershipTrack,
      cohortOrBudget,
      proposal,
      websiteOrLinkedin,
      status,
      adminNotes,
    } = body;

    if (!organizationName || !String(organizationName).trim()) {
      return NextResponse.json({ success: false, error: "Organization or Company name is required." }, { status: 400 });
    }
    if (!contactName || !String(contactName).trim()) {
      return NextResponse.json({ success: false, error: "Contact person name is required." }, { status: 400 });
    }
    if (!email || !String(email).includes("@")) {
      return NextResponse.json({ success: false, error: "Valid work email is required." }, { status: 400 });
    }
    if (!proposal || !String(proposal).trim()) {
      return NextResponse.json({ success: false, error: "Collaboration proposal details are required." }, { status: 400 });
    }

    const now = new Date().toISOString();
    const id = `prt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    const record: PartnerInquiry = {
      id,
      organizationName: String(organizationName).trim(),
      contactName: String(contactName).trim(),
      email: String(email).trim().toLowerCase(),
      phone: String(phone || "").trim(),
      organizationType: String(organizationType || "Startup / Tech Company").trim(),
      partnershipTrack: String(partnershipTrack || "Campus Tie-Up").trim(),
      cohortOrBudget: String(cohortOrBudget || "").trim(),
      proposal: String(proposal).trim(),
      websiteOrLinkedin: String(websiteOrLinkedin || "").trim(),
      status: status || "Pending",
      adminNotes: String(adminNotes || "").trim(),
      createdAt: now,
      updatedAt: now,
    };

    if (adminDb) {
      try {
        const { id: docId, ...data } = record;
        await adminDb.collection(COLLECTION).doc(docId).set(data);
      } catch (fsErr) {
        console.warn("partner_inquiries Firestore POST fallback:", fsErr);
        getMemoryStore().unshift(record);
      }
    } else {
      getMemoryStore().unshift(record);
    }

    return NextResponse.json({ success: true, partner: record }, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/partners error:", err);
    return NextResponse.json({ success: false, error: err.message || "Failed to submit partnership inquiry." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { id, ...updates } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ success: false, error: "Partner ID is required." }, { status: 400 });
    }

    const allowedFields: Array<keyof Omit<PartnerInquiry, "id" | "createdAt">> = [
      "organizationName",
      "contactName",
      "email",
      "phone",
      "organizationType",
      "partnershipTrack",
      "cohortOrBudget",
      "proposal",
      "websiteOrLinkedin",
      "status",
      "adminNotes",
    ];

    const sanitized: Partial<PartnerInquiry> = {
      updatedAt: new Date().toISOString(),
    };

    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        (sanitized as any)[key] = typeof updates[key] === "string" ? updates[key].trim() : updates[key];
      }
    }

    if (adminDb) {
      try {
        await adminDb.collection(COLLECTION).doc(id).update(sanitized);
      } catch (fsErr) {
        console.warn("partner_inquiries Firestore PATCH fallback:", fsErr);
        const store = getMemoryStore();
        const idx = store.findIndex((p) => p.id === id);
        if (idx === -1) {
          return NextResponse.json({ success: false, error: "Partner record not found." }, { status: 404 });
        }
        store[idx] = { ...store[idx], ...sanitized };
      }
    } else {
      const store = getMemoryStore();
      const idx = store.findIndex((p) => p.id === id);
      if (idx === -1) {
        return NextResponse.json({ success: false, error: "Partner record not found." }, { status: 404 });
      }
      store[idx] = { ...store[idx], ...sanitized };
    }

    return NextResponse.json({ success: true, id, updates: sanitized });
  } catch (err: any) {
    console.error("PATCH /api/partners error:", err);
    return NextResponse.json({ success: false, error: err.message || "Failed to update partner record." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Partner ID is required." }, { status: 400 });
    }

    if (adminDb) {
      try {
        await adminDb.collection(COLLECTION).doc(id).delete();
      } catch (fsErr) {
        console.warn("partner_inquiries Firestore DELETE fallback:", fsErr);
        const store = getMemoryStore();
        globalThis.__partnerInquiriesStore = store.filter((p) => p.id !== id);
      }
    } else {
      const store = getMemoryStore();
      globalThis.__partnerInquiriesStore = store.filter((p) => p.id !== id);
    }

    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    console.error("DELETE /api/partners error:", err);
    return NextResponse.json({ success: false, error: err.message || "Failed to delete partner record." }, { status: 500 });
  }
}
