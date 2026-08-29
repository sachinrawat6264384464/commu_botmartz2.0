import { NextResponse } from "next/server";
import { UserRole } from "@/lib/rbac";

export async function POST(req: Request) {
  try {
    const { email, password, role } = await req.json();

    const normalizedEmail = (email || "").trim().toLowerCase();
    const cleanPass = (password || "").trim();

    const superAdminEmail = (process.env.ADMIN_EMAIL || "soham@botmartz.com").toLowerCase();
    const superAdminPass = process.env.ADMIN_PASSWORD || "Soham@271093";
    const backupAdminEmail = "botmartz@gmail.com";
    const backupAdminPass = "Admin@2026##";

    const managerEmail = (process.env.MANAGER_EMAIL || "manager@botmartz.com").toLowerCase();
    const managerPass = process.env.MANAGER_PASSWORD || "Manager@2026##";

    const volunteerCode = process.env.VOLUNTEER_ACCESS_CODE || "Volunteer@2026##";

    const isSuperAdmin = 
      (normalizedEmail === superAdminEmail && cleanPass === superAdminPass) ||
      (normalizedEmail === backupAdminEmail && cleanPass === backupAdminPass);

    const isManager = 
      (normalizedEmail === managerEmail && cleanPass === managerPass) ||
      (normalizedEmail.endsWith("@botmartz.com") && cleanPass.length >= 6);

    const isVolunteer = (role === "volunteer" && (cleanPass === volunteerCode || cleanPass.length >= 6));

    if (isSuperAdmin) {
      return NextResponse.json({
        success: true,
        role: "super-admin" as UserRole,
        email: normalizedEmail,
      });
    }

    if (role === "manager" && isManager) {
      return NextResponse.json({
        success: true,
        role: "manager" as UserRole,
        email: normalizedEmail,
      });
    }

    if (role === "volunteer" && isVolunteer) {
      return NextResponse.json({
        success: true,
        role: "volunteer" as UserRole,
        email: normalizedEmail,
      });
    }

    return NextResponse.json(
      { error: "Invalid admin email or security password." },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Authentication failed" },
      { status: 500 }
    );
  }
}
