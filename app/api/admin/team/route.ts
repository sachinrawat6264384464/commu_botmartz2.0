import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { BOTMARTZ_TEAM } from "@/lib/team";

const SUPER_ADMIN_EMAIL = "soham@botmartz.com";

export async function GET(req: NextRequest) {
  try {
    const baseAdmins = BOTMARTZ_TEAM.map((t) => ({
      id: t.id,
      name: t.name,
      email: t.email,
      role: t.role,
      department: t.department,
      status: "active",
      kpis: t.kpis,
      specialties: t.specialties
    }));

    if (!adminDb) {
      return NextResponse.json({
        superAdmin: SUPER_ADMIN_EMAIL,
        admins: baseAdmins
      });
    }

    const snap = await adminDb.collection("community_admins").get();
    let dbAdmins: any[] = [];
    if (!snap.empty) {
      dbAdmins = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    }

    // Merge base team with any dynamically added admins
    const combined = [...baseAdmins];
    for (const d of dbAdmins) {
      if (!combined.some(a => a.email.toLowerCase() === d.email.toLowerCase())) {
        combined.push(d);
      }
    }

    return NextResponse.json({
      superAdmin: SUPER_ADMIN_EMAIL,
      admins: combined
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
