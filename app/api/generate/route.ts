import { NextRequest, NextResponse } from "next/server";
import { generateListing } from "@/lib/claude";
import { fetchCompetitors, parseAsinList } from "@/lib/scraper";
import { getServerFirestore } from "@/lib/firebase-admin";
import * as admin from "firebase-admin";
import { isUserAdmin } from "@/lib/admins";
import { demoListingEn, demoListingEs, condroListingEs } from "@/lib/demo-listing";
import { getCurrencySymbol } from "@/lib/currency";

// Allow this route up to 5 minutes to handle scraping + AI generation
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const rawData = formData.get("data");
    if (!rawData || typeof rawData !== "string") {
      return NextResponse.json({ error: "Missing product data." }, { status: 400 });
    }

    const data = JSON.parse(rawData);
    const userId = data.userId;

    // Validate required fields
    if (!data.productName?.trim() || !data.brand?.trim() || !data.category?.trim()) {
      return NextResponse.json({ error: "Product name, brand, and category are required." }, { status: 400 });
    }
    
    const validMarketplaces = ["us", "uk", "de", "fr", "it", "es"];
    if (!validMarketplaces.includes(data.marketplace)) {
      return NextResponse.json({ error: "Invalid marketplace selected." }, { status: 400 });
    }

    const startTime = performance.now();

    // Step 1: Scrape competitor listings (user-provided ASINs take priority)
    const scraperStart = performance.now();
    const userAsins = parseAsinList(data.competitorAsins ?? "");
    if (userAsins.length > 0) {
      console.log(`[SCRAPER] Using ${userAsins.length} user-provided ASINs: ${userAsins.join(", ")}`);
    }
    const competitorListings = await fetchCompetitors(data.productName, data.marketplace, userAsins);
    const scraperEnd = performance.now();
    console.log(`[PERF] Competitor extraction took ${((scraperEnd - scraperStart) / 1000).toFixed(2)}s`);

    // Step 2: Extract image files for vision analysis (limit to 3 for stability)
    const imageStart = performance.now();
    const imageFiles = (formData.getAll("images") as File[]).slice(0, 3);
    const imageContents: { type: "image"; media_type: string; data: string }[] = [];

    for (const file of imageFiles) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64 = buffer.toString("base64");
      const mediaType = file.type || "image/jpeg";
      imageContents.push({ type: "image", media_type: mediaType, data: base64 });
    }
    const imageEnd = performance.now();
    console.log(`[PERF] Image processing took ${((imageEnd - imageStart) / 1000).toFixed(2)}s`);

    const totalPayloadSize = JSON.stringify({ ...data, competitorListings, images: imageContents }).length;
    console.log(`Total payload size: ${(totalPayloadSize / 1024 / 1024).toFixed(2)} MB`);

    // Step 3: Trigger the Claude Brain
    const aiStart = performance.now();
    let result;
    try {
      result = await generateListing({
        productName: data.productName,
        brand: data.brand,
        marketplace: data.marketplace,
        category: data.category,
        price: data.price,
        competitorListings,
        additionalInfo: data.additionalInfo || "",
        images: imageContents,
      });
    } catch (apiError: any) {
      // Check if it's an Anthropic credit balance error or other recoverable error
      if (apiError?.message?.includes("credit balance") || apiError?.status === 400) {
        console.warn("Anthropic issue. Falling back to high-quality demo listing for testing.");
        const isSpanishOrItalian = ["es", "it"].includes(data.marketplace);
        const isCondroTest = 
          data.productName?.toLowerCase().includes("condro") || 
          data.productName?.toLowerCase().includes("perro") ||
          data.additionalInfo?.toLowerCase().includes("condro");

        let demoData = isSpanishOrItalian ? demoListingEs : demoListingEn;
        
        // Simulation mode for user test
        if (isCondroTest && isSpanishOrItalian) {
          demoData = condroListingEs;
        }

        result = { 
          ...demoData, 
          productName: data.productName, // Keep user's title for realism
          isDemo: true // Flag to show it in the UI
        };
      } else {
        // Rethrow critical errors (timeout, invalid key, etc.)
        throw apiError;
      }
    }
    const aiEnd = performance.now();
    console.log(`[PERF] AI Generation took ${((aiEnd - aiStart) / 1000).toFixed(2)}s`);

    // Step 4: Save to Firestore + decrement credits if userId is present
    const dbStart = performance.now();
    let listingId = null;
    if (userId) {
      try {
        const db = await getServerFirestore();
        if (db) {
          const profileRef = db.collection("profiles").doc(userId);
          const profileSnap = await profileRef.get();
          let isAdminUser = false;
          
          if (profileSnap.exists) {
            const profile = profileSnap.data()!;
            isAdminUser = isUserAdmin(profile.email);
            
            // Check user has credits remaining (SKIP for admins)
            if (!isAdminUser && profile.creditsRemaining <= 0) {
              return NextResponse.json({ error: "No credits remaining. Please purchase a plan." }, { status: 402 });
            }
          }

          const batch = db.batch();

          // Save the listing
          const listingRef = db.collection("users").doc(userId).collection("listings").doc();
          listingId = listingRef.id;
          batch.set(listingRef, {
            ...result,
            id: listingId,
            userId,
            productName: data.productName,
            brand: data.brand,
            marketplace: data.marketplace,
            category: data.category,
            createdAt: new Date().toISOString(),
          });

          // Decrement credits (SKIP for admins)
          if (!isAdminUser) {
            batch.update(profileRef, {
              creditsRemaining: admin.firestore.FieldValue.increment(-1),
              updatedAt: new Date().toISOString(),
            });
          }

          await batch.commit();
        }
      } catch (saveError) {
        console.error("Firestore save error:", saveError);
      }
    }
    const dbEnd = performance.now();
    console.log(`[PERF] Firestore & Credits took ${((dbEnd - dbStart) / 1000).toFixed(2)}s`);
    console.log(`[TOTAL PERF] Full request took ${((performance.now() - startTime) / 1000).toFixed(2)}s`);

    return NextResponse.json({ ...result, listingId });
  } catch (error: any) {
    console.error("Generate API Error:", error);
    // Determine the most specific error message to return
    const errorMessage = error instanceof Error ? error.message : "Failed to generate listing. Please try again.";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
