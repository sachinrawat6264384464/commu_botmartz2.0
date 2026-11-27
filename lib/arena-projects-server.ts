import { adminDb, hasAdminCredentials } from "@/lib/firebase-admin";
import { ARENA_PROJECTS, ArenaProject } from "@/lib/arena-projects";
import { getDefaultArenaProjectImage } from "@/lib/arena-project-images";

const COLLECTION_NAME = "arena_projects";
const LEGACY_CUSTOM_COLLECTION = "custom_arena_projects";

export type ManagedArenaProject = ArenaProject & {
  imageUrl: string;
  isCustom?: boolean;
  orderIndex?: number;
  createdAt?: string;
  updatedAt?: string;
};

function withDefaultImage(project: ArenaProject, orderIndex?: number): ManagedArenaProject {
  return {
    ...project,
    imageUrl: project.imageUrl || getDefaultArenaProjectImage(project.domain),
    orderIndex,
  };
}

export async function ensureArenaProjectsSeeded(): Promise<void> {
  if (!adminDb || !hasAdminCredentials) return;

  const colRef = adminDb.collection(COLLECTION_NAME);
  const existingSnap = await colRef.limit(1).get();
  if (!existingSnap.empty) return;

  const now = new Date().toISOString();
  const batch = adminDb.batch();

  ARENA_PROJECTS.forEach((project, idx) => {
    const docRef = colRef.doc(project.id);
    batch.set(docRef, {
      ...project,
      imageUrl: getDefaultArenaProjectImage(project.domain),
      isCustom: false,
      orderIndex: idx,
      createdAt: now,
      updatedAt: now,
    });
  });

  // Also migrate any previously added custom_arena_projects
  try {
    const legacySnap = await adminDb.collection(LEGACY_CUSTOM_COLLECTION).get();
    legacySnap.docs.forEach((doc) => {
      const data = doc.data() as Partial<ManagedArenaProject>;
      batch.set(colRef.doc(doc.id), {
        ...data,
        id: doc.id,
        imageUrl: data.imageUrl || getDefaultArenaProjectImage(data.domain),
        isCustom: true,
        orderIndex: -1,
        createdAt: data.createdAt || now,
        updatedAt: data.updatedAt || now,
      });
    });
  } catch (err) {
    console.warn("Legacy custom_arena_projects migration warning:", err);
  }

  await batch.commit();
}

export async function getAllArenaProjectsFromDb(): Promise<ManagedArenaProject[]> {
  if (!adminDb || !hasAdminCredentials) {
    return ARENA_PROJECTS.map((p, idx) => withDefaultImage(p, idx));
  }

  try {
    await ensureArenaProjectsSeeded();
    const colRef = adminDb.collection(COLLECTION_NAME);
    const snap = await Promise.race([
      colRef.get(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Firestore arena_projects timeout")), 4500)
      ),
    ]);

    const projects: ManagedArenaProject[] = [];
    const backfillBatch = adminDb.batch();
    let needsBackfill = false;

    for (const doc of snap.docs) {
      const data = doc.data() as ManagedArenaProject;
      const imageUrl = data.imageUrl || getDefaultArenaProjectImage(data.domain);
      if (!data.imageUrl) {
        backfillBatch.set(colRef.doc(doc.id), { imageUrl }, { merge: true });
        needsBackfill = true;
      }
      projects.push({
        ...data,
        id: data.id || doc.id,
        imageUrl,
      });
    }

    if (needsBackfill) {
      await backfillBatch.commit().catch((e) => console.warn("Image backfill warning:", e));
    }

    projects.sort((a, b) => {
      if (a.isCustom && !b.isCustom) return -1;
      if (!a.isCustom && b.isCustom) return 1;
      if (a.isCustom && b.isCustom) {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
      return (a.orderIndex ?? 9999) - (b.orderIndex ?? 9999);
    });

    return projects;
  } catch (err) {
    console.warn("getAllArenaProjectsFromDb fallback:", err);
    return ARENA_PROJECTS.map((p, idx) => withDefaultImage(p, idx));
  }
}

export async function getArenaProjectByIdOrSlugFromDb(
  projectIdOrSlug: string
): Promise<ManagedArenaProject | null> {
  if (adminDb && hasAdminCredentials) {
    try {
      await ensureArenaProjectsSeeded();
      const colRef = adminDb.collection(COLLECTION_NAME);

      const byId = await colRef.doc(projectIdOrSlug).get();
      if (byId.exists) {
        const d = byId.data() as ManagedArenaProject;
        return {
          ...d,
          id: d.id || byId.id,
          imageUrl: d.imageUrl || getDefaultArenaProjectImage(d.domain),
        };
      }

      const bySlug = await colRef.where("slug", "==", projectIdOrSlug).limit(1).get();
      if (!bySlug.empty) {
        const doc = bySlug.docs[0];
        const d = doc.data() as ManagedArenaProject;
        return {
          ...d,
          id: d.id || doc.id,
          imageUrl: d.imageUrl || getDefaultArenaProjectImage(d.domain),
        };
      }
    } catch (err) {
      console.warn("getArenaProjectByIdOrSlugFromDb warning:", err);
    }
  }

  const staticMatch = ARENA_PROJECTS.find(
    (p) => p.slug === projectIdOrSlug || p.id === projectIdOrSlug
  );
  return staticMatch ? withDefaultImage(staticMatch) : null;
}
