import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!adminDb) {
      return NextResponse.json({ success: false, error: "Database unavailable" }, { status: 500 });
    }

    // 1. Fetch from workshop_registrations, orders, payments, attendees in parallel
    const [workshopSnap, ordersSnap, paymentsSnap, attendeesSnap] = await Promise.all([
      adminDb.collection("workshop_registrations").get().catch(() => ({ docs: [] })),
      adminDb.collection("orders").get().catch(() => ({ docs: [] })),
      adminDb.collection("payments").get().catch(() => ({ docs: [] })),
      adminDb.collection("attendees").get().catch(() => ({ docs: [] }))
    ]);

    const transactionsMap = new Map<string, any>();

    // Helper to safely format ISO dates
    const toIsoString = (val: any) => {
      if (!val) return new Date().toISOString();
      if (typeof val === "string") return val;
      if (val.toDate && typeof val.toDate === "function") return val.toDate().toISOString();
      if (val instanceof Date) return val.toISOString();
      return new Date(val).toISOString();
    };

    // Helper to normalize status
    const normalizeStatus = (status: any, amount: number) => {
      if (!status) return amount > 0 ? "PAID" : "FREE";
      const s = String(status).toUpperCase();
      if (s === "CAPTURED" || s === "PAID" || s === "COMPLETED" || s === "SUCCESS") return "PAID";
      if (s === "PENDING_REVIEW" || s === "PENDING") return "PENDING_UTR";
      if (s === "REJECTED" || s === "FAILED") return "REJECTED";
      if (s === "FREE_REGISTERED" || s === "FREE") return "FREE";
      return s;
    };

    // Process workshop_registrations
    workshopSnap.docs.forEach((doc: any) => {
      const data = doc.data();
      const txKey = data.paymentId || data.orderId || doc.id;
      const amt = Number(data.amount) || 0;
      transactionsMap.set(txKey, {
        id: doc.id,
        paymentId: data.paymentId || `REG_${doc.id.slice(-6)}`,
        orderId: data.orderId || "",
        invoiceNumber: data.invoiceNumber || `INV-${doc.id.slice(-6)}`,
        checkInCode: data.checkInCode || "",
        attendeeName: data.name || "Workshop Attendee",
        email: data.email || "",
        phone: data.phone || "",
        collegeOrCompany: data.collegeOrCompany || "",
        itemName: data.track || "Production AI Engineering Workshop",
        itemCategory: "WORKSHOP_PASS",
        amount: amt,
        currency: data.currency || "INR",
        method: data.paymentMethod || (amt > 0 ? "Razorpay (Online)" : "Free Registration"),
        status: normalizeStatus(data.status, amt),
        createdAt: toIsoString(data.createdAt),
        source: "workshop_registrations"
      });
    });

    // Process orders (enrich or add)
    ordersSnap.docs.forEach((doc: any) => {
      const data = doc.data();
      const txKey = data.paymentId || data.orderId || doc.id;
      const amt = Number(data.amount) || 0;
      const existing = transactionsMap.get(txKey);

      if (existing) {
        // Enrich existing
        existing.orderId = existing.orderId || data.orderId;
        existing.invoiceNumber = existing.invoiceNumber || data.invoiceNumber;
        existing.itemName = existing.itemName || data.itemName;
        existing.itemCategory = data.itemCategory || existing.itemCategory;
      } else {
        transactionsMap.set(txKey, {
          id: doc.id,
          paymentId: data.paymentId || doc.id,
          orderId: data.orderId || "",
          invoiceNumber: data.invoiceNumber || `INV-${doc.id.slice(-6)}`,
          checkInCode: "",
          attendeeName: data.name || "Customer",
          email: data.email || "",
          phone: data.phone || "",
          collegeOrCompany: "",
          itemName: data.itemName || "Botmartz Pass / Pack",
          itemCategory: data.itemCategory || "ORDER",
          amount: amt,
          currency: data.currency || "INR",
          method: data.paymentMethod || "Razorpay (Online)",
          status: normalizeStatus(data.status, amt),
          createdAt: toIsoString(data.createdAt),
          source: "orders"
        });
      }
    });

    // Process payments (enrich or add)
    paymentsSnap.docs.forEach((doc: any) => {
      const data = doc.data();
      const txKey = data.paymentId || data.orderId || doc.id;
      const amt = Number(data.amount) || 0;
      const existing = transactionsMap.get(txKey);

      if (existing) {
        existing.method = data.method || existing.method;
      } else {
        transactionsMap.set(txKey, {
          id: doc.id,
          paymentId: data.paymentId || doc.id,
          orderId: data.orderId || "",
          invoiceNumber: `INV-${doc.id.slice(-6)}`,
          checkInCode: "",
          attendeeName: data.name || "Customer",
          email: data.email || "",
          phone: "",
          collegeOrCompany: "",
          itemName: "Platform Payment",
          itemCategory: "DIRECT_PAYMENT",
          amount: amt,
          currency: data.currency || "INR",
          method: data.method || "Razorpay (Online)",
          status: normalizeStatus(data.status, amt),
          createdAt: toIsoString(data.createdAt),
          source: "payments"
        });
      }
    });

    // Process attendees (Event summit tickets & manual UTRs)
    attendeesSnap.docs.forEach((doc: any) => {
      const data = doc.data();
      const txKey = data.paymentId || data.utrNumber ? `UTR_${data.utrNumber}` : doc.id;
      const amt = Number(data.amount) || 0;
      const existing = transactionsMap.get(txKey);

      if (!existing) {
        transactionsMap.set(txKey, {
          id: doc.id,
          paymentId: data.utrNumber ? `UTR-${data.utrNumber}` : (data.paymentId || `TC-${doc.id.slice(-6)}`),
          orderId: data.orderId || "",
          invoiceNumber: `INV-SUMMIT-${doc.id.slice(-6)}`,
          checkInCode: data.checkInCode || "",
          attendeeName: data.name || "Attendee",
          email: data.email || "",
          phone: data.phone || "",
          collegeOrCompany: "",
          itemName: data.eventTitle || data.tier || "AI Frontier 2026 Pass",
          itemCategory: "EVENT_TICKET",
          amount: amt,
          currency: "INR",
          method: data.paymentMethod || (data.utrNumber ? `Manual UPI UTR (${data.utrNumber})` : "Razorpay"),
          status: normalizeStatus(data.status, amt),
          utrNumber: data.utrNumber || "",
          createdAt: toIsoString(data.createdAt || data.submittedAt),
          source: "attendees"
        });
      }
    });

    // Convert map to sorted array (newest first)
    const allPayments = Array.from(transactionsMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Compute metrics
    const totalRevenue = allPayments
      .filter((p) => p.status === "PAID")
      .reduce((sum, p) => sum + p.amount, 0);

    const paidCount = allPayments.filter((p) => p.status === "PAID").length;
    const pendingCount = allPayments.filter((p) => p.status === "PENDING_UTR").length;
    const freeCount = allPayments.filter((p) => p.status === "FREE").length;

    return NextResponse.json({
      success: true,
      payments: allPayments,
      summary: {
        totalRevenue,
        totalTransactions: allPayments.length,
        paidCount,
        pendingCount,
        freeCount
      }
    });
  } catch (error: any) {
    console.error("Failed to fetch admin payments:", error);
    return NextResponse.json({ success: false, error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!adminDb) {
      return NextResponse.json({ success: false, error: "Database unavailable" }, { status: 500 });
    }

    const body = await req.json();
    const { action, id, source, collectionName } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Record ID is required" }, { status: 400 });
    }

    const targetCollection = collectionName || source || "attendees";
    const docRef = adminDb.collection(targetCollection).doc(id);

    if (action === "APPROVE_UTR") {
      await docRef.set(
        {
          status: "PAID",
          approvedAt: new Date().toISOString()
        },
        { merge: true }
      );
      return NextResponse.json({ success: true, message: `Payment ${id} approved successfully.` });
    } else if (action === "REJECT_UTR") {
      await docRef.set(
        {
          status: "rejected",
          rejectedAt: new Date().toISOString()
        },
        { merge: true }
      );
      return NextResponse.json({ success: true, message: `Payment ${id} rejected.` });
    } else if (action === "DELETE" || action === "DELETE_PAYMENT") {
      const { paymentId, orderId, cascade = true } = body;
      const result = await purgePaymentRecords({ id, source: targetCollection, paymentId, orderId, cascade });
      return NextResponse.json({
        success: true,
        message: `Payment record and associated entries successfully removed (${result.deletedCount} items purged).`,
        deletedCount: result.deletedCount
      });
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (error: any) {
    console.error("Failed to update payment status:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to update payment" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!adminDb) {
      return NextResponse.json({ success: false, error: "Database unavailable" }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const source = searchParams.get("source") || searchParams.get("collectionName") || "attendees";
    const paymentId = searchParams.get("paymentId") || "";
    const orderId = searchParams.get("orderId") || "";
    const cascade = searchParams.get("cascade") !== "false";

    // Also support JSON body if passed
    let bodyData: any = {};
    try {
      bodyData = await req.json();
    } catch {
      // Body not provided or already read
    }

    const finalId = id || bodyData.id;
    const finalSource = source || bodyData.source || bodyData.collectionName || "attendees";
    const finalPaymentId = paymentId || bodyData.paymentId || "";
    const finalOrderId = orderId || bodyData.orderId || "";
    const finalCascade = cascade ?? (bodyData.cascade !== false);

    // Support batch delete
    if (bodyData.items && Array.isArray(bodyData.items) && bodyData.items.length > 0) {
      let totalPurged = 0;
      for (const item of bodyData.items) {
        const res = await purgePaymentRecords({
          id: item.id,
          source: item.source || "attendees",
          paymentId: item.paymentId,
          orderId: item.orderId,
          cascade: item.cascade !== false
        });
        totalPurged += res.deletedCount;
      }
      return NextResponse.json({
        success: true,
        message: `Successfully deleted ${bodyData.items.length} payment records (${totalPurged} database items purged).`,
        deletedCount: totalPurged
      });
    }

    if (!finalId && !finalPaymentId && !finalOrderId) {
      return NextResponse.json(
        { success: false, error: "Record ID, Payment ID, or Order ID is required for deletion." },
        { status: 400 }
      );
    }

    const result = await purgePaymentRecords({
      id: finalId,
      source: finalSource,
      paymentId: finalPaymentId,
      orderId: finalOrderId,
      cascade: finalCascade
    });

    return NextResponse.json({
      success: true,
      message: `Payment record successfully deleted (${result.deletedCount} entries purged).`,
      deletedCount: result.deletedCount
    });
  } catch (error: any) {
    console.error("Failed to delete payment:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to delete payment" }, { status: 500 });
  }
}

/**
 * Helper function to safely and completely purge wrong or erroneous payment records
 * from primary collection and associated ledger collections.
 */
async function purgePaymentRecords({
  id,
  source,
  paymentId,
  orderId,
  cascade = true
}: {
  id?: string;
  source?: string;
  paymentId?: string;
  orderId?: string;
  cascade?: boolean;
}) {
  if (!adminDb) return { deletedCount: 0 };
  let deletedCount = 0;
  const collections = ["workshop_registrations", "orders", "payments", "attendees"];

  // 1. Delete by direct document ID if specified
  if (id && source) {
    try {
      const docRef = adminDb.collection(source).doc(id);
      const docSnap = await docRef.get();
      if (docSnap.exists) {
        await docRef.delete();
        deletedCount++;
      }
    } catch (err) {
      console.warn(`[Payment Delete] Warning deleting doc ${id} from ${source}:`, err);
    }
  }

  // 2. If cascade is true, search and remove linked documents across all payment collections
  if (cascade) {
    // Purge by paymentId
    if (paymentId && paymentId.trim() && !paymentId.startsWith("FREE_")) {
      const pid = paymentId.trim();
      for (const coll of collections) {
        try {
          const snap = await adminDb.collection(coll).where("paymentId", "==", pid).get();
          for (const doc of snap.docs) {
            if (doc.id !== id || coll !== source) {
              await doc.ref.delete();
              deletedCount++;
            }
          }
        } catch (e) {
          // Continue with next collection
        }
      }
    }

    // Purge by orderId
    if (orderId && orderId.trim()) {
      const oid = orderId.trim();
      for (const coll of collections) {
        try {
          const snap = await adminDb.collection(coll).where("orderId", "==", oid).get();
          for (const doc of snap.docs) {
            if (doc.id !== id || coll !== source) {
              await doc.ref.delete();
              deletedCount++;
            }
          }
        } catch (e) {
          // Continue with next collection
        }
      }
    }
  }

  return { deletedCount };
}

