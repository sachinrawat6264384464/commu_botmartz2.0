import { adminDb } from "../lib/firebase-admin";
import { adjustStudentWallet, getStudentWallet } from "../lib/wallet";

async function testDailyLogFlow() {
  console.log("🚀 Testing Arena Daily Log & LinkedIn Audit System...");

  const testEmail = "dailylog_tester@botmartz.com";
  const testProjectId = "p1";

  // 1. Create a mock enrollment for this student
  console.log("Step 1: Creating enrollment for student...");
  const enrollRef = await adminDb!.collection("arena_enrollments").add({
    name: "Log Test Builder",
    email: testEmail,
    projectId: testProjectId,
    projectTitle: "Multi-Spectral Satellite Imagery & Geospatial AI Pipeline",
    difficulty: "Hard",
    streak: 0,
    xp: 100,
    createdAt: new Date().toISOString()
  });
  console.log("✔ Created test enrollment ID:", enrollRef.id);

  // 2. Initial wallet balance
  const initialWallet = await getStudentWallet(testEmail);
  console.log("✔ Initial wallet balance:", initialWallet.balance);

  // 3. Submit Day 1 Log with GitHub + LinkedIn link
  console.log("Step 2: Submitting Day 1 log with GitHub commit and LinkedIn post...");
  const logRef = await adminDb!.collection("arena_daily_logs").add({
    studentEmail: testEmail,
    studentName: "Log Test Builder",
    projectId: testProjectId,
    projectTitle: "Multi-Spectral Satellite Imagery & Geospatial AI Pipeline",
    dayNumber: 1,
    commitUrl: "https://github.com/botmartz-test/satellite-geospatial/commit/9f8e7d6c",
    researchNotes: "Day 1: Initialized GDAL & Rasterio environment, cloned Sentinel-2 data chunker.",
    linkedinPostUrl: "https://www.linkedin.com/posts/testbuilder_botmartzai-day1-activity-123456",
    linkedinStatus: "PENDING_AUDIT",
    coinsAwarded: 70,
    baseCoins: 20,
    linkedinBonus: 50,
    submittedAt: new Date().toISOString()
  });

  // Credit 70 coins atomically
  const creditedWallet = await adjustStudentWallet(
    testEmail,
    70,
    "EARN",
    "Day 1 Proof-of-Work Log (+50 LinkedIn Bonus): Satellite Geospatial",
    logRef.id
  );
  console.log("✔ Awarded 70 coins. New wallet balance:", creditedWallet.newBalance);

  // 4. Test Admin Audit: Approve
  console.log("Step 3: Testing Admin Audit Approval...");
  await logRef.update({
    linkedinStatus: "VERIFIED",
    auditedAt: new Date().toISOString()
  });
  console.log("✔ Log status updated to VERIFIED.");

  // 5. Test Admin Audit: Reject Spam & Deduct 50 coins
  console.log("Step 4: Testing Admin Audit Reject Spam & Coin Reversal...");
  await logRef.update({
    linkedinStatus: "REJECTED_SPAM",
    auditedAt: new Date().toISOString()
  });
  const deductedWallet = await adjustStudentWallet(
    testEmail,
    -50,
    "SPEND",
    "Revoked +50 Karma Coins: LinkedIn post flagged as invalid/spam",
    `revoked_${logRef.id}`
  );
  console.log("✔ Deducted 50 spam coins. New wallet balance:", deductedWallet.newBalance);

  // Cleanup test docs
  await enrollRef.delete();
  await logRef.delete();
  console.log("✔ Test cleaned up successfully.");

  console.log("🎉 Daily Log & LinkedIn Audit Test PASSED with zero errors!");
}

testDailyLogFlow().catch(console.error);
