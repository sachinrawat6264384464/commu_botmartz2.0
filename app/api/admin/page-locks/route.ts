import { NextRequest, NextResponse } from "next/server";
import { getActivePageLockConfigServer, updateActivePageLockConfigServer } from "@/lib/page-locks-server";
import { DEFAULT_PAGE_LOCK_CONFIG } from "@/lib/page-locks";

export async function GET(req: NextRequest) {
  try {
    const config = await getActivePageLockConfigServer();
    return NextResponse.json({
      success: true,
      config
    });
  } catch (err: any) {
    return NextResponse.json({
      success: true,
      config: DEFAULT_PAGE_LOCK_CONFIG
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mode, scheduledUnlockTime, announcementTitle, announcementMessage, lockedRoutes } = body;

    const updated = await updateActivePageLockConfigServer({
      ...(mode ? { mode } : {}),
      ...(scheduledUnlockTime ? { scheduledUnlockTime } : {}),
      ...(announcementTitle ? { announcementTitle } : {}),
      ...(announcementMessage ? { announcementMessage } : {}),
      ...(lockedRoutes ? { lockedRoutes } : {})
    });

    return NextResponse.json({
      success: true,
      config: updated,
      message: "Page lock configuration updated successfully."
    });
  } catch (err: any) {
    console.error("Page lock update error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update page lock configuration." },
      { status: 500 }
    );
  }
}
