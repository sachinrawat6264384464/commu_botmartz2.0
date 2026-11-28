const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "community-4727e";
const FIRESTORE_BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

/**
 * Converts a JS Object into Firestore REST API field format.
 */
export function jsToFirestoreFields(obj: Record<string, any>): Record<string, any> {
  const fields: Record<string, any> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val === undefined || val === null) continue;
    if (typeof val === "string") {
      fields[key] = { stringValue: val };
    } else if (typeof val === "number") {
      fields[key] = Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
    } else if (typeof val === "boolean") {
      fields[key] = { booleanValue: val };
    } else if (Array.isArray(val)) {
      fields[key] = {
        arrayValue: {
          values: val.map((item) => {
            if (typeof item === "string") return { stringValue: item };
            if (typeof item === "number") return { integerValue: String(item) };
            if (typeof item === "boolean") return { booleanValue: item };
            return { stringValue: String(item) };
          })
        }
      };
    } else if (typeof val === "object") {
      fields[key] = { mapValue: { fields: jsToFirestoreFields(val) } };
    }
  }
  return fields;
}

/**
 * Converts Firestore REST API field format back into a clean JS Object.
 */
export function firestoreFieldsToJs(fields: Record<string, any>): Record<string, any> {
  const obj: Record<string, any> = {};
  if (!fields) return obj;
  for (const [key, val] of Object.entries(fields)) {
    if (val.stringValue !== undefined) obj[key] = val.stringValue;
    else if (val.integerValue !== undefined) obj[key] = parseInt(val.integerValue, 10);
    else if (val.doubleValue !== undefined) obj[key] = parseFloat(val.doubleValue);
    else if (val.booleanValue !== undefined) obj[key] = val.booleanValue;
    else if (val.arrayValue !== undefined) {
      obj[key] = (val.arrayValue.values || []).map((item: any) => {
        if (item.stringValue !== undefined) return item.stringValue;
        if (item.integerValue !== undefined) return parseInt(item.integerValue, 10);
        if (item.booleanValue !== undefined) return item.booleanValue;
        return null;
      }).filter((v: any) => v !== null);
    } else if (val.mapValue !== undefined) {
      obj[key] = firestoreFieldsToJs(val.mapValue.fields || {});
    }
  }
  return obj;
}

/**
 * Save document to Firebase Firestore database via REST API.
 */
export async function saveDocToFirestoreRest(collectionName: string, docId: string, data: Record<string, any>): Promise<boolean> {
  try {
    const url = `${FIRESTORE_BASE_URL}/${collectionName}/${docId}`;
    const fields = jsToFirestoreFields(data);
    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields })
    });
    return res.ok;
  } catch (err) {
    console.warn(`Firestore REST write warning (${collectionName}/${docId}):`, err);
    return false;
  }
}

/**
 * Create document with auto-generated ID in Firebase Firestore database via REST API.
 */
export async function addDocToFirestoreRest(collectionName: string, data: Record<string, any>): Promise<string | null> {
  try {
    const url = `${FIRESTORE_BASE_URL}/${collectionName}`;
    const fields = jsToFirestoreFields(data);
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields })
    });
    if (!res.ok) return null;
    const json = await res.json();
    // Path format: projects/.../documents/collection/docId
    const nameParts = json.name ? json.name.split("/") : [];
    return nameParts[nameParts.length - 1] || null;
  } catch (err) {
    console.warn(`Firestore REST add warning (${collectionName}):`, err);
    return null;
  }
}

/**
 * Fetch documents from Firebase Firestore collection via REST API.
 */
export async function fetchDocsFromFirestoreRest(collectionName: string, filterField?: string, filterValue?: string): Promise<any[]> {
  try {
    const url = `${FIRESTORE_BASE_URL}/${collectionName}?pageSize=100`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    const documents = json.documents || [];
    
    let results = documents.map((doc: any) => {
      const nameParts = doc.name ? doc.name.split("/") : [];
      const id = nameParts[nameParts.length - 1];
      const data = firestoreFieldsToJs(doc.fields || {});
      return { id, ...data };
    });

    if (filterField && filterValue) {
      results = results.filter((item: any) => item[filterField] === filterValue);
    }

    return results;
  } catch (err) {
    console.warn(`Firestore REST fetch warning (${collectionName}):`, err);
    return [];
  }
}
