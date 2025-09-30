import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/firebaseAdmin";
import { Coupon } from "@/types/Coupon";
import {
  extractUid,
  getCouponFromCode,
  getUser,
  getUserWithUid,
  isRole,
} from "@/lib/serverUtils";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try { 

    const user = await getUser(req)
    if (!user)
      return NextResponse.json({ message: "Unauthenticated" }, { status: 404 });

    const isAdmin = isRole(user, "admin");
    if (!isAdmin)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { code } = await context.params;
    if (!code)
      return NextResponse.json({ message: "Missing code" }, { status: 400 });

    const coupon = await getCouponFromCode(code);
    if (!coupon)
      return NextResponse.json({ message: "Coupon not found" }, { status: 404 });

    // reference the coupon and void it
    const couponRef = adminDb.collection("coupons").doc(code);
    couponRef.update({ voided: true });

    // return a success message
    return NextResponse.json({ message: "Coupon voided" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
