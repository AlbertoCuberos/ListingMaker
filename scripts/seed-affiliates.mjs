import admin from "firebase-admin";
import fs from "fs";
import path from "path";

// Function to load .env.local manually
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, "utf-8");
    envFile.split("\n").forEach(line => {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        process.env[key] = value;
      }
    });
  }
}

loadEnv();

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!serviceAccountKey) {
  console.error("❌ FIREBASE_SERVICE_ACCOUNT_KEY not found in .env.local");
  process.exit(1);
}

const serviceAccount = JSON.parse(serviceAccountKey);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

const DEFAULT_AFFILIATES = [
  {
    code: "VIVIENDODEAMAZON",
    name: "Viviendo de Amazon",
    email: "hola@viviendodeamazon.com",
    commissionPct: 20,
  },
  {
    code: "ROICOS",
    name: "Roicos Agency",
    email: "info@roicos.com",
    commissionPct: 20,
  }
];

async function seed() {
  console.log("🚀 Seeding affiliates...");
  
  for (const aff of DEFAULT_AFFILIATES) {
    const affiliateRef = db.collection("affiliates").doc(aff.code);
    
    const data = {
      id: aff.code,
      name: aff.name,
      email: aff.email,
      commissionPct: aff.commissionPct,
      earningsTotal: 0,
      recentSales: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    try {
      await affiliateRef.set(data, { merge: true });
      console.log(`✅ Affiliate ${aff.code} initialized.`);
    } catch (error) {
      console.error(`❌ Error for ${aff.code}:`, error);
    }
  }
}

seed().then(() => {
  console.log("⭐ Seeding complete!");
  process.exit();
});
