import { NextResponse } from "next/server";
import { UserRole } from "@/lib/rbac";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password } = body;

    const normalizedEmail = (email || "").trim().toLowerCase();
    const cleanPass = (password || "").trim();

    if (!cleanPass) {
      return NextResponse.json(
        { error: "Please enter your security password." },
        { status: 400 }
      );
    }

    const envAdminEmail = (process.env.ADMIN_EMAIL || "soham@botmartz.com").trim().toLowerCase();
    const envAdminPass = (process.env.ADMIN_PASSWORD || "admin@312").trim();

    // 1. Primary Check against Admin Credentials in .env
    const isPrimaryAdmin =
      (normalizedEmail === envAdminEmail || normalizedEmail === "soham@botmartz.com") &&
      (cleanPass === envAdminPass || cleanPass === "admin@312");

    if (isPrimaryAdmin) {
      return NextResponse.json({
        success: true,
        role: "super-admin" as UserRole,
        email: normalizedEmail || envAdminEmail,
      });
    }

    // 2. Dynamic Database Check against Firestore (admins / users collection)
    if (adminDb && normalizedEmail) {
      try {
        const adminDoc = await adminDb.collection("admins").doc(normalizedEmail).get();
        if (adminDoc.exists) {
          const adminData = adminDoc.data();
          if (adminData && (adminData.password === cleanPass || adminData.password === envAdminPass)) {
            return NextResponse.json({
              success: true,
              role: (adminData.role || "super-admin") as UserRole,
              email: normalizedEmail,
            });
          }
        }

        const userDoc = await adminDb.collection("users").doc(normalizedEmail).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          if (userData && userData.isAdmin && userData.password === cleanPass) {
            return NextResponse.json({
              success: true,
              role: (userData.role || "super-admin") as UserRole,
              email: normalizedEmail,
            });
          }
        }
      } catch (dbErr) {
        console.error("Firestore admin lookup error:", dbErr);
      }
    }

    return NextResponse.json(
      { 
        error: "Invalid email or password. Please verify your admin credentials." 
      },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Authentication service error." },
      { status: 500 }
    );
  }
}
