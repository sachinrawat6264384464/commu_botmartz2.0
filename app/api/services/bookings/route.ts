import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { emailProvider } from "@/lib/email/provider";

export interface ServiceBooking {
  id: string;
  receiptId: string;
  serviceId: string;
  serviceTitle: string;
  category: string;
  amount: number;
  userName: string;
  userEmail: string;
  phone: string;
  organizationOrCollege: string;
  preferredSlot: string;
  notes: string;
  paymentId: string;
  paymentStatus: "Paid" | "Pending" | "Free";
  status: "Pending" | "Scheduled" | "Completed" | "Cancelled";
  adminNotes: string;
  createdAt: string;
  updatedAt: string;
}

const COLLECTION = "service_bookings";

declare global {
  var __serviceBookingsStore: ServiceBooking[] | undefined;
}

function getMemoryStore(): ServiceBooking[] {
  if (!globalThis.__serviceBookingsStore) {
    globalThis.__serviceBookingsStore = [];
  }
  return globalThis.__serviceBookingsStore;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const emailFilter = searchParams.get("email")?.trim().toLowerCase();
    const statusFilter = searchParams.get("status");

    let items: ServiceBooking[] = [];

    if (adminDb) {
      try {
        const snap = await adminDb.collection(COLLECTION).orderBy("createdAt", "desc").limit(250).get();
        items = snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<ServiceBooking, "id">),
        }));
      } catch (fsErr) {
        console.warn("service_bookings Firestore GET fallback:", fsErr);
        items = [...getMemoryStore()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      }
    } else {
      items = [...getMemoryStore()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }

    if (emailFilter) {
      items = items.filter((item) => item.userEmail.toLowerCase() === emailFilter);
    }
    if (statusFilter && statusFilter !== "All") {
      items = items.filter((item) => item.status === statusFilter);
    }

    return NextResponse.json({ success: true, bookings: items });
  } catch (err: any) {
    console.error("GET /api/services/bookings error:", err);
    return NextResponse.json({ success: false, error: err.message || "Failed to load bookings", bookings: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      serviceId,
      serviceTitle,
      category,
      amount,
      userName,
      userEmail,
      phone,
      organizationOrCollege,
      preferredSlot,
      notes,
      paymentId,
      paymentStatus,
      status,
      adminNotes,
      skipEmails,
    } = body;

    if (!serviceTitle || !String(serviceTitle).trim()) {
      return NextResponse.json({ success: false, error: "Service title is required." }, { status: 400 });
    }
    if (!userName || !String(userName).trim()) {
      return NextResponse.json({ success: false, error: "Full name is required." }, { status: 400 });
    }
    if (!userEmail || !String(userEmail).includes("@")) {
      return NextResponse.json({ success: false, error: "Valid email address is required." }, { status: 400 });
    }

    const now = new Date().toISOString();
    const id = `srv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const receiptId = `BM-REC-${Date.now().toString().slice(-6)}`;
    const cleanAmount = Number(amount || 0);

    const record: ServiceBooking = {
      id,
      receiptId,
      serviceId: String(serviceId || "custom").trim(),
      serviceTitle: String(serviceTitle).trim(),
      category: String(category || "Service").trim(),
      amount: isNaN(cleanAmount) ? 0 : cleanAmount,
      userName: String(userName).trim(),
      userEmail: String(userEmail).trim().toLowerCase(),
      phone: String(phone || "").trim(),
      organizationOrCollege: String(organizationOrCollege || "").trim(),
      preferredSlot: String(preferredSlot || "").trim(),
      notes: String(notes || "").trim(),
      paymentId: String(paymentId || `pay_${Date.now()}`).trim(),
      paymentStatus: paymentStatus || (cleanAmount > 0 ? "Paid" : "Free"),
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
        console.warn("service_bookings Firestore POST fallback:", fsErr);
        getMemoryStore().unshift(record);
      }
    } else {
      getMemoryStore().unshift(record);
    }

    // Send User Confirmation + Receipt Email AND Admin Alert Email (non-blocking fail-safe)
    if (!skipEmails) {
      const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER || "team@botmartz.com";
      const formattedDate = new Date(now).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

      const userHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
          <div style="background: #162774; color: #ffffff; padding: 24px 28px;">
            <div style="display: inline-block; background: #D9F83B; color: #162774; font-weight: 800; font-size: 11px; padding: 4px 12px; border-radius: 999px; text-transform: uppercase;">
              Booking Confirmed &amp; Payment Receipt
            </div>
            <h1 style="margin: 12px 0 4px; font-size: 22px;">Thank you, ${record.userName}!</h1>
            <p style="margin: 0; color: #dbeafe; font-size: 14px;">Your registration for <strong>${record.serviceTitle}</strong> is confirmed.</p>
          </div>
          <div style="padding: 24px 28px; color: #1e293b; font-size: 14px; line-height: 1.6;">
            <div style="background: #FEF08A; border-left: 4px solid #162774; padding: 14px 16px; border-radius: 8px; margin-bottom: 20px; color: #162774;">
              <strong>Important Notice:</strong> Our team will connect with you within <strong>24 hours</strong>.<br/>
              <strong>Please note:</strong> We are active only <strong>two times (2 follow-up attempts)</strong> — after 2 attempts without a response, the slot will be closed.
            </div>
            <h3 style="margin: 0 0 12px; color: #162774; font-size: 16px;">Official Payment Receipt</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Receipt ID</td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-weight: 700; text-align: right;">${record.receiptId}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Service / Program</td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-weight: 700; text-align: right;">${record.serviceTitle}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Amount Paid</td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-weight: 700; text-align: right;">₹${record.amount} (${record.paymentStatus})</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Payment Reference</td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-weight: 700; text-align: right;">${record.paymentId}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;">Date (IST)</td><td style="padding: 8px 0; font-weight: 700; text-align: right;">${formattedDate}</td></tr>
            </table>
          </div>
        </div>
      `;

      const adminHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px;">
          <h2 style="color: #162774; margin-top: 0;">New Service Registration &amp; Payment</h2>
          <p><strong>Service:</strong> ${record.serviceTitle} (${record.category})</p>
          <p><strong>User:</strong> ${record.userName} (${record.userEmail})</p>
          <p><strong>Phone:</strong> ${record.phone || "N/A"}</p>
          <p><strong>College / Org:</strong> ${record.organizationOrCollege || "N/A"}</p>
          <p><strong>Preferred Slot:</strong> ${record.preferredSlot || "Flexible"}</p>
          <p><strong>Notes:</strong> ${record.notes || "None"}</p>
          <p><strong>Amount:</strong> ₹${record.amount} (${record.paymentStatus}) | <strong>Receipt:</strong> ${record.receiptId} | <strong>Payment ID:</strong> ${record.paymentId}</p>
        </div>
      `;

      await Promise.allSettled([
        emailProvider.sendEmail({
          to: record.userEmail,
          subject: `[Botmartz Receipt ${record.receiptId}] ${record.serviceTitle} Confirmed`,
          html: userHtml,
        }),
        emailProvider.sendEmail({
          to: adminEmail,
          subject: `[Admin Alert] New Booking: ${record.serviceTitle} by ${record.userName}`,
          html: adminHtml,
        }),
      ]);
    }

    return NextResponse.json({ success: true, booking: record }, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/services/bookings error:", err);
    return NextResponse.json({ success: false, error: err.message || "Failed to save booking." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { id, ...updates } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ success: false, error: "Booking ID is required." }, { status: 400 });
    }

    const allowed: Array<keyof Omit<ServiceBooking, "id" | "createdAt">> = [
      "serviceTitle",
      "category",
      "amount",
      "userName",
      "userEmail",
      "phone",
      "organizationOrCollege",
      "preferredSlot",
      "notes",
      "paymentStatus",
      "status",
      "adminNotes",
    ];

    const sanitized: Partial<ServiceBooking> = {
      updatedAt: new Date().toISOString(),
    };

    for (const key of allowed) {
      if (updates[key] !== undefined) {
        (sanitized as any)[key] = typeof updates[key] === "string" ? updates[key].trim() : updates[key];
      }
    }

    if (adminDb) {
      try {
        await adminDb.collection(COLLECTION).doc(id).update(sanitized);
      } catch (fsErr) {
        console.warn("service_bookings Firestore PATCH fallback:", fsErr);
        const store = getMemoryStore();
        const idx = store.findIndex((b) => b.id === id);
        if (idx === -1) {
          return NextResponse.json({ success: false, error: "Booking not found." }, { status: 404 });
        }
        store[idx] = { ...store[idx], ...sanitized };
      }
    } else {
      const store = getMemoryStore();
      const idx = store.findIndex((b) => b.id === id);
      if (idx === -1) {
        return NextResponse.json({ success: false, error: "Booking not found." }, { status: 404 });
      }
      store[idx] = { ...store[idx], ...sanitized };
    }

    return NextResponse.json({ success: true, id, updates: sanitized });
  } catch (err: any) {
    console.error("PATCH /api/services/bookings error:", err);
    return NextResponse.json({ success: false, error: err.message || "Failed to update booking." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Booking ID is required." }, { status: 400 });
    }

    if (adminDb) {
      try {
        await adminDb.collection(COLLECTION).doc(id).delete();
      } catch (fsErr) {
        console.warn("service_bookings Firestore DELETE fallback:", fsErr);
        globalThis.__serviceBookingsStore = getMemoryStore().filter((b) => b.id !== id);
      }
    } else {
      globalThis.__serviceBookingsStore = getMemoryStore().filter((b) => b.id !== id);
    }

    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    console.error("DELETE /api/services/bookings error:", err);
    return NextResponse.json({ success: false, error: err.message || "Failed to delete booking." }, { status: 500 });
  }
}
