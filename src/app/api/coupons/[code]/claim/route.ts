import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/firebaseAdmin"; 
import { 
  getCouponFromCode,
  getUser,
  getUserWithEmail, 
} from "@/lib/serverUtils";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ code: string }> }
) { 
  try {
    /**
     * getting the user
     */
    let user = await getUser(req);

    if (!user) {
      const { searchParams } = new URL(req.url);
      const email = searchParams.get("email") || null;
      if (email) {
        user = await getUserWithEmail(email);
      }
    }

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    /**
     * getting the coupon
     */
    const { code } = await context.params;
    let coupon = null;
    if (code) {
      coupon = await getCouponFromCode(code);
    }

    if (!coupon) {
      return NextResponse.json({ message: "Coupon not found" }, { status: 404 });
    }

    /**
     * Checking if coupon can be claimed
     */
    // check if coupon is single use and is already claimed
    if (!coupon.multiuse) {
      if (coupon.claimedBy && coupon.claimedBy.length > 0) {
        return NextResponse.json(
          { message: "Coupon already claimed" },
          { status: 400 }
        );
      }
    }

    // check if coupon is multiuse and user already on claimed list
    if (coupon.multiuse) {
      if (coupon.claimedBy?.includes(user.uid)) {
        return NextResponse.json(
          { message: "Coupon already claimed" },
          { status: 400 }
        );
      }
    }

    // check if coupon is already expired
    if (coupon.expirationDate && coupon.expirationDate < Date.now()) {
      return NextResponse.json(
        { message: "Coupon already expired" },
        { status: 400 }
      );
    }

    /**
     * finally claim the coupon
     */

    // update the coupon by adding the user on the claimed by list
    coupon = {
      ...coupon,
      claimedBy: [user.uid, ...(coupon.claimedBy || [])],
    };

    // update the individual points of the user
    for (let pointType in coupon.points) {
      user = {
        ...user,
        individualPoints: {
          ...user.individualPoints,
          [pointType]:
            (user.individualPoints[pointType] || 0) + coupon.points[pointType],
        },
      };
    }

    // update the total points of the user
    user.totalPoints = Object.values(user.individualPoints).reduce(
      (a, b) => a + b,
      0
    );

    // commit the changes to the database
    await adminDb.collection("users").doc(user.uid).set(user);
    await adminDb.collection("coupons").doc(code).set(coupon);

    // returning a response
    return NextResponse.json({ message: "Coupon claimed" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
