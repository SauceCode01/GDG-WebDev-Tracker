import { NextRequest, NextResponse } from "next/server"; 
import { getCouponFromCode } from "@/lib/serverUtils";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params;
    if (!code)
      return NextResponse.json({ message: "Missing code" }, { status: 400 });

    const coupon = await getCouponFromCode(code);
    if (!coupon)
      return NextResponse.json({ message: "Coupon not found" }, { status: 404 });

    return NextResponse.json(coupon, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
