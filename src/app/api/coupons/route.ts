import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/firebaseAdmin";
import { generateCouponCode, getUser, isRole } from "@/lib/serverUtils";
import { Coupon } from "@/types/Coupon";

export async function POST(req: NextRequest) {
  try {
    const user = await getUser(req);
    if (!user)
      return NextResponse.json({ error: "Unauthenticated" }, { status: 404 });

    const isAdmin = isRole(user, "admin");
    if (!isAdmin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const coupon = (await req.json()) as Coupon;
    if (!coupon) {
      return NextResponse.json(
        { error: "Missing coupon data" },
        { status: 400 }
      );
    }

    const code = await generateCouponCode();

    // building complete data
    const data = {
      ...coupon,
      code,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // posting the coupon
    await adminDb.collection("coupons").doc(code).set(data);

    // returning code
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Read query params
    const limit = parseInt(searchParams.get("limit") || "10") || 10;
    const last = searchParams.get("last") || null;

    let query: FirebaseFirestore.Query = adminDb.collection("coupons");

    // Apply limit
    query = query.orderBy("createdAt", "desc").limit(limit);

    // Apply pagination (if last doc provided)
    if (last) {
      const lastDoc = await adminDb.collection("coupons").doc(last).get();
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

    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
