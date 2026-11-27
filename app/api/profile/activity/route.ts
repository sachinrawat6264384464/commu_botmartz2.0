import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rawEmail = searchParams.get("email")?.trim().toLowerCase();

    if (!rawEmail || !rawEmail.includes("@")) {
      return NextResponse.json({
        success: true,
        serviceBookings: [],
        hackathonRegistrations: [],
        workshopRegistrations: [],
      });
    }

    let serviceBookings: any[] = [];
    let hackathonRegistrations: any[] = [];
    let workshopRegistrations: any[] = [];

    if (adminDb) {
      const [srvResult, wsResult, hackOrdersResult, hackRegResult] = await Promise.allSettled([
        adminDb.collection("service_bookings").where("userEmail", "==", rawEmail).get(),
        adminDb.collection("workshop_registrations").where("email", "==", rawEmail).get(),
        adminDb.collection("orders").where("email", "==", rawEmail).get(),
        adminDb.collectionGroup("registrations").where("leader.email", "==", rawEmail).get(),
      ]);

      if (srvResult.status === "fulfilled") {
        serviceBookings = srvResult.value.docs.map((d) => ({ id: d.id, ...d.data() }));
      }

      if (wsResult.status === "fulfilled") {
        workshopRegistrations = wsResult.value.docs.map((d) => ({ id: d.id, ...d.data() }));
      }

      const hackMap = new Map<string, any>();
      if (hackRegResult.status === "fulfilled") {
        for (const d of hackRegResult.value.docs) {
          const data = d.data();
          const key = data.uniqueCode || d.id;
          hackMap.set(key, { id: d.id, ...data });
        }
      }
      if (hackOrdersResult.status === "fulfilled") {
        for (const d of hackOrdersResult.value.docs) {
          const data = d.data();
          if (data.itemCategory === "ONLINE_HACKATHON") {
            const key = data.metadata?.uniqueCode || data.orderId || d.id;
            if (!hackMap.has(key)) {
              hackMap.set(key, {
                id: d.id,
                uniqueCode: data.metadata?.uniqueCode || data.orderId,
                projectId: data.metadata?.projectId || "",
                projectTitle: data.itemName || "Online Hackathon",
                mode: data.metadata?.mode || "solo",
                teamName: data.metadata?.teamName || "",
                amountPaid: data.amount || 0,
                paymentStatus: data.status || "PAID",
                createdAt: data.createdAt,
              });
            }
          }
        }
      }
      hackathonRegistrations = Array.from(hackMap.values());
    }

    // Merge local dev memory store for service_bookings if present
    const memBookings: any[] = (globalThis as any).__serviceBookingsStore || [];
    if (memBookings.length > 0) {
      const existingIds = new Set(serviceBookings.map((b) => b.id));
      for (const mb of memBookings) {
        if (mb.userEmail?.toLowerCase() === rawEmail && !existingIds.has(mb.id)) {
          serviceBookings.push(mb);
        }
      }
    }

    const sortByDateDesc = (a: any, b: any) =>
      String(b.createdAt || "").localeCompare(String(a.createdAt || ""));

    serviceBookings.sort(sortByDateDesc);
    hackathonRegistrations.sort(sortByDateDesc);
    workshopRegistrations.sort(sortByDateDesc);

    return NextResponse.json({
      success: true,
      serviceBookings,
      hackathonRegistrations,
      workshopRegistrations,
    });
  } catch (err: any) {
    console.warn("GET /api/profile/activity fallback:", err?.message || err);
    return NextResponse.json({
      success: true,
      serviceBookings: [],
      hackathonRegistrations: [],
      workshopRegistrations: [],
    });
  }
}
