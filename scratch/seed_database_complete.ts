import { adminDb } from "../lib/firebase-admin";
import { UNIVERSITIES_DIRECTORY } from "../lib/universities-directory";
import { COMPANIES_DIRECTORY } from "../lib/companies-directory";
import { ARENA_PROJECTS } from "../lib/arena-projects";

async function seedCompleteDatabase() {
  if (!adminDb) {
    console.error("Firebase Admin is not initialized.");
    process.exit(1);
  }

  console.log("🚀 Starting complete Firestore database seeding for botmartz-community...");

  // 1. Global Settings
  console.log("Setting up settings/global...");
  await adminDb.collection("settings").doc("global").set({
    communityName: "Botmartz Builders Community",
    brandTagline: "The Deterministic Engineering & Virtual AI Internship Arena",
    supportEmail: "team@botmartz.com",
    founderEmail: "soham@botmartz.com",
    activeCohort: "Cohort 1 - Fall 2026",
    fellowshipPriceSolo: 299,
    fellowshipPriceSquad: 1999,
    rewardPerDailyLog: 50,
    rewardPerProfileCompletion: 100,
    rewardPerLinkedInUGC: 50,
    updatedAt: new Date().toISOString()
  }, { merge: true });

  // 2. Universities Reference Directory
  console.log(`Seeding ${UNIVERSITIES_DIRECTORY.length} universities into colleges_directory...`);
  const uniBatch = adminDb.batch();
  UNIVERSITIES_DIRECTORY.slice(0, 50).forEach((uni) => {
    const docId = uni.name.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 40);
    const docRef = adminDb.collection("colleges_directory").doc(docId);
    uniBatch.set(docRef, { ...uni, updatedAt: new Date().toISOString() }, { merge: true });
  });
  await uniBatch.commit();
  console.log("✔ Seeded colleges directory.");

  // 3. Companies Reference Directory
  console.log(`Seeding ${COMPANIES_DIRECTORY.length} companies into companies_directory...`);
  const compBatch = adminDb.batch();
  COMPANIES_DIRECTORY.slice(0, 50).forEach((comp) => {
    const docId = comp.name.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 40);
    const docRef = adminDb.collection("companies_directory").doc(docId);
    compBatch.set(docRef, { ...comp, updatedAt: new Date().toISOString() }, { merge: true });
  });
  await compBatch.commit();
  console.log("✔ Seeded companies directory.");

  // 4. Seeding Initial Community Discussions
  console.log("Seeding initial community discussion threads...");
  const initialDiscussions = [
    {
      id: "welcome-cohort-2026",
      title: "Welcome to Botmartz Builders Cohort 1 (India & Global)",
      author: "Soham Sharma",
      authorEmail: "soham@botmartz.com",
      authorHandle: "soham_founder",
      category: "Announcements",
      tags: ["Onboarding", "Internship", "Guidelines"],
      content: "Welcome to all builders from Indore, across India, and our international shippers. Review the 50 production PRDs in the Arena, set up your daily GitHub commit streaks, and complete your builder profile to claim +100 Karma Coins.",
      upvotes: 42,
      isPinned: true,
      commentsCount: 3,
      createdAt: new Date().toISOString()
    },
    {
      id: "anti-vibe-coding-manifesto",
      title: "The Anti-Vibe Coding Manifesto: Determinism over Hallucination",
      author: "Botmartz Architecture Team",
      authorEmail: "team@botmartz.com",
      authorHandle: "botmartz_team",
      category: "System Design",
      tags: ["AI Agents", "Architecture", "Best Practices"],
      content: "Building real AI systems requires understanding database indexes (B-Tree vs BRIN), deterministic state machines, retry policies, and zero flaky Playwright CI gates. Avoid copy-pasting code without internal benchmarks.",
      upvotes: 38,
      isPinned: true,
      commentsCount: 5,
      createdAt: new Date().toISOString()
    }
  ];

  for (const disc of initialDiscussions) {
    await adminDb.collection("discussions").doc(disc.id).set(disc, { merge: true });
  }
  console.log("✔ Seeded community discussion threads.");

  console.log("🎉 Firestore database seeding complete and verified!");
}

seedCompleteDatabase().catch((e) => {
  console.error("Seeding error:", e);
  process.exit(1);
});
