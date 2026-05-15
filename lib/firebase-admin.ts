// firebase-admin is loaded lazily inside functions to avoid module-level
// initialization errors during Next.js build (Turbopack evaluates all server chunks)

async function getAdmin() {
  const mod = await import("firebase-admin");
  // CJS interop: default may be the namespace or it may be the module itself
  return (mod.default ?? mod) as typeof import("firebase-admin");
}

export async function getServerFirestore() {
  const admin = await getAdmin();
  if (admin.apps.length === 0) {
    try {
      if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      } else {
        admin.initializeApp({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        });
      }
    } catch (error) {
      console.error("Firebase admin initialization error:", error);
    }
  }
  return admin.firestore();
}

export async function getServerAuth() {
  const admin = await getAdmin();
  if (admin.apps.length === 0) {
    await getServerFirestore();
  }
  return admin.auth();
}

export async function getAdminInstance() {
  return getAdmin();
}
