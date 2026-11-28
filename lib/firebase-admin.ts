import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

let adminApp: App;

function cleanPemKey(key: string | undefined): string | undefined {
  if (!key) return undefined;

  let formatted = key.trim();

  // Strip leading/trailing quotes
  if ((formatted.startsWith('"') && formatted.endsWith('"')) ||
      (formatted.startsWith("'") && formatted.endsWith("'"))) {
    formatted = formatted.slice(1, -1);
  }

  // Replace literal '\n' and carriage returns
  formatted = formatted.replace(/\\n/g, '\n').replace(/\\r/g, '').replace(/\r/g, '');

  // If PEM header is present, reformat lines to strict 64-char chunks
  if (formatted.includes('BEGIN PRIVATE KEY') || formatted.includes('BEGIN RSA PRIVATE KEY')) {
    const isRsa = formatted.includes('BEGIN RSA PRIVATE KEY');
    const header = isRsa ? '-----BEGIN RSA PRIVATE KEY-----' : '-----BEGIN PRIVATE KEY-----';
    const footer = isRsa ? '-----END RSA PRIVATE KEY-----' : '-----END PRIVATE KEY-----';

    let body = formatted
      .replace(/-----BEGIN [A-Z ]+-----/g, '')
      .replace(/-----END [A-Z ]+-----/g, '')
      .replace(/\s+/g, '');

    const chunks = body.match(/.{1,64}/g);
    if (chunks && chunks.length > 0) {
      return `${header}\n${chunks.join('\n')}\n${footer}\n`;
    }
  }

  return formatted;
}

export let hasAdminCredentials = false;

function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'community-4727e';

  // 1. Check if complete service account JSON is passed via ENV
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT || process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  if (serviceAccountJson) {
    try {
      const parsed = JSON.parse(serviceAccountJson);
      adminApp = initializeApp({
        credential: cert(parsed),
      });
      hasAdminCredentials = true;
      return adminApp;
    } catch (e) {}
  }

  // 2. Try local JSON files if present
  try {
    const fs = require('fs');
    const path = require('path');
    const possiblePaths = [
      path.resolve(process.cwd(), 'community-4727e-firebase-adminsdk-fbsvc-ec0cae0934.json'),
      path.resolve(process.cwd(), 'botmartz-community-firebase-adminsdk-fbsvc-9114364f40.json'),
      path.resolve(process.cwd(), '../botmartz-community-firebase-adminsdk-fbsvc-9114364f40.json'),
      '/mnt/d/HP Shared/All Freelance Projects/botmartz-community/botmartz-community-firebase-adminsdk-fbsvc-9114364f40.json',
      path.resolve(process.cwd(), '../botmartz-main-firebase-adminsdk-fbsvc-60e42d287e.json'),
      path.resolve(process.cwd(), 'botmartz-main-firebase-adminsdk-fbsvc-60e42d287e.json'),
    ];

    for (const jsonPath of possiblePaths) {
      if (fs.existsSync(jsonPath)) {
        const serviceAccount = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
        adminApp = initializeApp({
          credential: cert(serviceAccount),
        });
        hasAdminCredentials = true;
        return adminApp;
      }
    }
  } catch (e) {}

  // 3. Try ENV variables with robust PEM cleaning
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const rawKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  const privateKey = cleanPemKey(rawKey);

  if (clientEmail && privateKey) {
    try {
      adminApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      hasAdminCredentials = true;
      return adminApp;
    } catch (err: any) {
      console.warn('Firebase Admin cert initialization warning (falling back to projectId):', err?.message);
    }
  }

  // 4. Safe fallback to projectId
  try {
    adminApp = initializeApp({
      projectId,
    });
    hasAdminCredentials = false;
  } catch (fallbackErr) {
    if (getApps().length > 0) {
      adminApp = getApps()[0];
    }
  }

  return adminApp;
}

const initializedAdmin = getAdminApp();
export const adminDb = getFirestore(initializedAdmin);
export const adminAuth = getAuth(initializedAdmin);
export default initializedAdmin;
