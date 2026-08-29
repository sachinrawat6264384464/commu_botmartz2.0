import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

const SUPER_ADMIN_EMAIL = "soham@botmartz.com";

export async function GET(req: NextRequest) {
  try {
    if (!adminDb) {
      return NextResponse.json({
        superAdmin: SUPER_ADMIN_EMAIL,
        admins: [
          {
            id: "adm_1",
            name: "Soham Sharma",
            email: "soham@botmartz.com",
            role: "Super Admin & Founder",
            status: "active",
            kpis: {
              reviewsCompleted: 48,
              avgReviewTimeHours: 4.2,
              bugsVerified: 12,
              officeHoursAttended: 8
            }
          }
        ]
      });
    }

    const snap = await adminDb.collection("community_admins").get();
    let admins: any[] = [];
    if (!snap.empty) {
      admins = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    }

    if (!admins.some((a) => a.email === SUPER_ADMIN_EMAIL)) {
      admins.unshift({
        id: "super_admin",
        name: "Soham Sharma",
        email: SUPER_ADMIN_EMAIL,
        role: "Super Admin & Founder",
        status: "active",
        kpis: {
          reviewsCompleted: 48,
          avgReviewTimeHours: 4.2,
          bugsVerified: 12,
          officeHoursAttended: 8
        }
      });
    }

    return NextResponse.json({
      superAdmin: SUPER_ADMIN_EMAIL,
      admins
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, role } = body;

    if (!email || !name) {
      return NextResponse.json({ error: "Name and email required." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (!adminDb) {
      return NextResponse.json({
        success: true,
        message: "Admin invite recorded in simulation mode."
      });
    }

    // Check count limit (Max 5 Admins)
    const existingSnap = await adminDb.collection("community_admins").get();
    if (existingSnap.size >= 5) {
      return NextResponse.json(
        { error: "Maximum capacity of 5 Community Admins reached. Revoke an existing admin first." },
        { status: 400 }
      );
    }

    const docRef = await adminDb.collection("community_admins").add({
      name: name.trim(),
      email: cleanEmail,
      role: role || "Community Admin",
      status: "approved_by_founder",
      approvedBy: SUPER_ADMIN_EMAIL,
      approvedAt: new Date(),
      kpis: {
        reviewsCompleted: 0,
        avgReviewTimeHours: 0,
        bugsVerified: 0,
        officeHoursAttended: 0
      }
    });

    return NextResponse.json({
      success: true,
      message: `Admin ${cleanEmail} approved by Founder Soham Sharma.`,
      adminId: docRef.id
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
