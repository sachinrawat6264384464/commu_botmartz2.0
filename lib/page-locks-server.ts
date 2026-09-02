import { adminDb } from "./firebase-admin";
import { PageLockConfig, DEFAULT_PAGE_LOCK_CONFIG } from "./page-locks";

// Fetch active lock configuration from Firestore (Server-only)
export async function getActivePageLockConfigServer(): Promise<PageLockConfig> {
  if (!adminDb) {
    return DEFAULT_PAGE_LOCK_CONFIG;
  }

  try {
    const docSnap = await adminDb.collection("site_settings").doc("page_locks").get();
    if (docSnap.exists) {
      const data = docSnap.data();
      return {
        ...DEFAULT_PAGE_LOCK_CONFIG,
        ...data
      } as PageLockConfig;
    }
  } catch (error) {
    console.warn("Failed to fetch page locks config from Firestore, using default:", error);
  }

  return DEFAULT_PAGE_LOCK_CONFIG;
}

// Update lock configuration in Firestore (Server-only)
export async function updateActivePageLockConfigServer(updates: Partial<PageLockConfig>): Promise<PageLockConfig> {
  if (!adminDb) {
    throw new Error("Firestore Admin is not initialized.");
  }

  const current = await getActivePageLockConfigServer();
  const updated: PageLockConfig = {
    ...current,
    ...updates
  };

  await adminDb.collection("site_settings").doc("page_locks").set(updated, { merge: true });
  return updated;
}
