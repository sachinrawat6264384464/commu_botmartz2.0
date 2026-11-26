import { adminDb, hasAdminCredentials } from "@/lib/firebase-admin";
import { DEFAULT_HACKATHON_PROJECTS, HackathonProject } from "@/lib/hackathons";

export async function ensureDefaultHackathonProjects(): Promise<HackathonProject[]> {
  const now = new Date().toISOString();
  const fallbackList: HackathonProject[] = DEFAULT_HACKATHON_PROJECTS.map((p) => ({
    ...p,
    createdAt: now,
    updatedAt: now,
  }));

  if (!adminDb || !hasAdminCredentials) {
    return fallbackList;
  }

  try {
    const snap = await adminDb.collection("hackathon_projects").get();
    if (snap.empty) {
      const batch = adminDb.batch();
      for (const proj of fallbackList) {
        const ref = adminDb.collection("hackathon_projects").doc(proj.id);
        batch.set(ref, proj);
      }
      await batch.commit();
      return fallbackList;
    }

    const projects = snap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<HackathonProject, "id">),
    }));

    projects.sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );

    return projects;
  } catch (err) {
    console.warn("ensureDefaultHackathonProjects warning:", err);
    return fallbackList;
  }
}

export async function findRegistrationByCode(cleanCode: string) {
  if (!adminDb || !hasAdminCredentials) return null;

  const projectsSnap = await adminDb.collection("hackathon_projects").get();
  for (const projDoc of projectsSnap.docs) {
    const regRef = projDoc.ref.collection("registrations").doc(cleanCode);
    const regSnap = await regRef.get();
    if (regSnap.exists) {
      return { ref: regRef, data: regSnap.data() as any };
    }
  }
  return null;
}
