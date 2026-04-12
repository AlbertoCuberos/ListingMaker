import * as admin from "firebase-admin";

// Server-side functions (for API routes only)
export async function getServerFirestore() {
  if (admin.apps.length === 0) {
    try {
      if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      } else {
        // Fallback for development if no service account is provided
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
  if (admin.apps.length === 0) {
    await getServerFirestore();
  }
  return admin.auth();
}
