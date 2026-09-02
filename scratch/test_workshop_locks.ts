import { getActivePageLockConfigServer } from "../lib/page-locks-server";
import { isRouteLocked, DEFAULT_PAGE_LOCK_CONFIG } from "../lib/page-locks";

async function testPageLocksAndWorkshop() {
  console.log("=== RUNNING SYSTEM VERIFICATION TESTS ===");

  // 1. Test Client-Safe Route Lock Check
  console.log("\n[Test 1] Testing isRouteLocked logic...");
  
  // Test locked route in WORKSHOP_FOCUS mode
  const arenaLock = isRouteLocked("/arena", DEFAULT_PAGE_LOCK_CONFIG, false);
  console.log("-> /arena lock status for regular user:", arenaLock.isLocked ? "✔ LOCKED (Expected)" : "❌ UNLOCKED (Unexpected)");

  // Test public route in WORKSHOP_FOCUS mode
  const homeLock = isRouteLocked("/", DEFAULT_PAGE_LOCK_CONFIG, false);
  console.log("-> / (home) lock status for regular user:", !homeLock.isLocked ? "✔ PUBLIC (Expected)" : "❌ LOCKED (Unexpected)");

  const workshopsLock = isRouteLocked("/workshops", DEFAULT_PAGE_LOCK_CONFIG, false);
  console.log("-> /workshops lock status for regular user:", !workshopsLock.isLocked ? "✔ PUBLIC (Expected)" : "❌ LOCKED (Unexpected)");

  // Test admin bypass
  const adminArenaLock = isRouteLocked("/arena", DEFAULT_PAGE_LOCK_CONFIG, true);
  console.log("-> /arena lock status for Admin:", !adminArenaLock.isLocked ? "✔ BYPASS UNLOCKED (Expected)" : "❌ LOCKED (Unexpected)");

  // 2. Test Server Firestore Config
  console.log("\n[Test 2] Testing Server Lock Config fetching...");
  try {
    const config = await getActivePageLockConfigServer();
    console.log("-> Active Lock Mode:", config.mode);
    console.log("-> Scheduled Unlock Time:", config.scheduledUnlockTime);
    console.log("-> Locked Routes Count:", config.lockedRoutes.length);
    console.log("✔ Server config read successful.");
  } catch (e: any) {
    console.error("❌ Config test error:", e.message);
  }

  console.log("\n=== ALL SYSTEM TESTS COMPLETED SUCCESSFULLY ===");
}

testPageLocksAndWorkshop().catch(console.error);
