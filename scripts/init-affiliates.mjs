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

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

if (!projectId) {
  console.error("❌ NEXT_PUBLIC_FIREBASE_PROJECT_ID not found in .env.local");
  process.exit(1);
}

// Initialize Admin SDK
// Note: If you have a service account key, better use it. 
// For local dev, sometimes ADC works.
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: projectId,
  });
}

const db = admin.firestore();

async function initAffiliate() {
  const code = "VIVIENDODEAMAZON";
  const affiliateRef = db.collection("affiliates").doc(code);
  
  const data = {
    id: code,
    name: "Alberto Cuberos",
    email: "ecommercekcv@gmail.com", // From the robot_facturas.py context
    commissionPct: 20,
    earningsTotal: 0,
    recentSales: [],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  try {
    await affiliateRef.set(data, { merge: true });
    console.log(`✅ Affiliate ${code} initialized successfully!`);
  } catch (error) {
    console.error(`❌ Error initializing affiliate:`, error);
  }
}

initAffiliate().then(() => process.exit());
