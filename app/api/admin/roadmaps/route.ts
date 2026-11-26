import { NextRequest, NextResponse } from "next/server";
import { adminDb, hasAdminCredentials } from "@/lib/firebase-admin";
import {
  DEFAULT_EXTEND_DAYS,
  DEFAULT_EXTEND_PRICE,
  DEFAULT_ROADMAP_PRICE,
  DEFAULT_ROADMAP_VALIDITY_DAYS,
  ensureManagedRoadmaps,
} from "@/lib/roadmaps-server";

export async function GET() {
  try {
    const roadmaps = await ensureManagedRoadmaps();
    let purchases: any[] = [];

    if (adminDb && hasAdminCredentials) {
      const snap = await adminDb.collection("roadmap_purchases").get();
      purchases = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      purchases.sort(
        (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
    }

    return NextResponse.json({ success: true, roadmaps, purchases });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to load admin roadmaps." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!adminDb || !hasAdminCredentials) {
      return NextResponse.json({ success: false, error: "Database unavailable." }, { status: 503 });
    }

    const body = await req.json();
    const {
      roleName,
      category,
      tagline,
      disciplines,
      targetCompanies,
      stages,
      isPaid,
      price,
      validityDays,
      extendPrice,
      extendDays,
      isActive,
    } = body;

    if (!roleName || !category || !tagline) {
      return NextResponse.json(
        { success: false, error: "Role name, domain category, and tagline are required." },
        { status: 400 }
      );
    }

    const slug = String(roleName)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const id = `${slug}-${Date.now().toString().slice(-4)}`;
    const now = new Date().toISOString();

    const parsedDisciplines = Array.isArray(disciplines)
      ? disciplines
      : String(disciplines || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

    const parsedCompanies = Array.isArray(targetCompanies)
      ? targetCompanies
      : String(targetCompanies || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

    const newRoadmap = {
      id,
      roleName: String(roleName).trim(),
      category,
      disciplines: parsedDisciplines.length ? parsedDisciplines : [category],
      tagline: String(tagline).trim(),
      badgeColor: "text-[#1D3189] bg-indigo-50 border-indigo-200",
      targetCompanies: parsedCompanies.length ? parsedCompanies : ["Google", "Microsoft", "Razorpay"],
      stages: Array.isArray(stages) && stages.length > 0
        ? stages
        : [
            {
              stageNumber: 1,
              stageName: "Core Foundations & Tooling",
              duration: "Week 1 - 2",
              focus: "Master core fundamentals, architecture patterns, and clean implementation.",
              coreSkills: ["TypeScript", "System Design", "Testing"],
              deliverables: ["Build production-ready module with automated tests."],
              recommendedProjectIds: [],
            },
          ],
      isPaid: Boolean(isPaid),
      price: Number(price || DEFAULT_ROADMAP_PRICE),
      validityDays: Number(validityDays || DEFAULT_ROADMAP_VALIDITY_DAYS),
      extendPrice: Number(extendPrice || DEFAULT_EXTEND_PRICE),
      extendDays: Number(extendDays || DEFAULT_EXTEND_DAYS),
      isActive: isActive !== false,
      createdAt: now,
      updatedAt: now,
    };

    await adminDb.collection("career_roadmaps").doc(id).set(newRoadmap);
    return NextResponse.json({ success: true, roadmap: newRoadmap });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create roadmap." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    if (!adminDb || !hasAdminCredentials) {
      return NextResponse.json({ success: false, error: "Database unavailable." }, { status: 503 });
    }

    const body = await req.json();
    const { id } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: "Roadmap ID is required." }, { status: 400 });
    }

    const updatePayload: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };

    if (body.roleName !== undefined) updatePayload.roleName = String(body.roleName).trim();
    if (body.category !== undefined) updatePayload.category = body.category;
    if (body.tagline !== undefined) updatePayload.tagline = String(body.tagline).trim();
    if (body.isPaid !== undefined) updatePayload.isPaid = Boolean(body.isPaid);
    if (body.price !== undefined) updatePayload.price = Number(body.price);
    if (body.validityDays !== undefined) updatePayload.validityDays = Number(body.validityDays);
    if (body.extendPrice !== undefined) updatePayload.extendPrice = Number(body.extendPrice);
    if (body.extendDays !== undefined) updatePayload.extendDays = Number(body.extendDays);
    if (body.isActive !== undefined) updatePayload.isActive = Boolean(body.isActive);
    if (body.stages !== undefined && Array.isArray(body.stages)) updatePayload.stages = body.stages;
    if (body.targetCompanies !== undefined) {
      updatePayload.targetCompanies = Array.isArray(body.targetCompanies)
        ? body.targetCompanies
        : String(body.targetCompanies).split(",").map((s: string) => s.trim()).filter(Boolean);
    }

    await adminDb.collection("career_roadmaps").doc(id).update(updatePayload);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update roadmap." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!adminDb || !hasAdminCredentials) {
      return NextResponse.json({ success: false, error: "Database unavailable." }, { status: 503 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type") || "roadmap";

    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required." }, { status: 400 });
    }

    if (type === "purchase") {
      await adminDb.collection("roadmap_purchases").doc(id).delete();
      return NextResponse.json({ success: true });
    }

    await adminDb.collection("career_roadmaps").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete record." },
      { status: 500 }
    );
  }
}
