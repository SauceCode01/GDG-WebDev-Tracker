import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/firebaseAdmin"; 
 
/**
 * Gets a paginated list of users
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Read query params
    const limit = parseInt(searchParams.get("limit") || "10");
    const last = searchParams.get("last"); // last doc ID for pagination

    let query: FirebaseFirestore.Query = adminDb.collection("users");

    // Apply limit
    query = query.orderBy("totalPoints", "desc").limit(limit);

    // Apply pagination (if last doc provided)
    if (last) {
      const lastDoc = await adminDb.collection("users").doc(last).get();
      if (lastDoc.exists) {
        query = query.startAfter(lastDoc);
      }
    }

    const snapshot = await query.get();

    // Map documents
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Return data + lastDoc for next page
    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json(
      { error:  "Internal Server Error" },
      { status: 500 }
    );
  }
}
