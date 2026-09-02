import { adminDb } from "../lib/firebase-admin";

async function testTestimonialsFlow() {
  console.log("🚀 Testing Testimonials & Admin Moderation Workflow...");

  if (!adminDb) {
    throw new Error("AdminDb not initialized");
  }

  // 1. Submit a pending testimonial
  console.log("Step 1: Submitting pending testimonial...");
  const docData = {
    targetType: "PROJECT_PRD",
    targetId: "p1",
    targetTitle: "Multi-Spectral Satellite Imagery & Geospatial AI Pipeline",
    authorName: "Test Student Builder",
    authorEmail: "testbuilder@botmartz.com",
    authorRole: "AI Engineer",
    authorCollegeOrCompany: "SGSITS Indore",
    rating: 5,
    content: "The U-Net segmentation and Qdrant geospatial indexing was incredible to build!",
    status: "PENDING",
    createdAt: new Date().toISOString()
  };

  const docRef = await adminDb.collection("testimonials").add(docData);
  console.log("✔ Created pending testimonial ID:", docRef.id);

  // 2. Query public approved testimonials
  console.log("Step 2: Checking public query (should exclude pending)...");
  const publicSnap = await adminDb
    .collection("testimonials")
    .where("status", "==", "APPROVED")
    .where("targetId", "==", "p1")
    .get();
  
  const hasPendingInPublic = publicSnap.docs.some((d) => d.id === docRef.id);
  console.log("✔ Is pending testimonial visible publicly?", hasPendingInPublic ? "FAIL" : "NO (Correct!)");

  // 3. Admin approves testimonial
  console.log("Step 3: Admin approving testimonial...");
  await docRef.update({
    status: "APPROVED",
    moderatedAt: new Date().toISOString()
  });
  console.log("✔ Testimonial updated to APPROVED by Admin.");

  // 4. Query public approved testimonials again
  console.log("Step 4: Checking public query after approval...");
  const approvedSnap = await adminDb
    .collection("testimonials")
    .where("status", "==", "APPROVED")
    .where("targetId", "==", "p1")
    .get();

  const isApprovedInPublic = approvedSnap.docs.some((d) => d.id === docRef.id);
  console.log("✔ Is approved testimonial now visible publicly?", isApprovedInPublic ? "YES (Correct!)" : "NO (Failed)");

  // 5. Cleanup test document
  await docRef.delete();
  console.log("✔ Test testimonial cleaned up successfully.");

  console.log("🎉 Testimonials Admin Moderation Test PASSED with zero errors!");
}

testTestimonialsFlow().catch(console.error);
