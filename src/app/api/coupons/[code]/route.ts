import { NextRequest, NextResponse } from "next/server"; 
import { getCouponFromCode } from "@/lib/serverUtils";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params;
    if (!code)
      return NextResponse.json({ error: "Missing code" }, { status: 400 });

    const coupon = await getCouponFromCode(code);
    if (!coupon)
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });

    return NextResponse.json(coupon, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
