import { User } from "@/types/User";
import { getAuth } from "firebase-admin/auth";
import { NextRequest } from "next/server";
import { adminAuth, adminDb } from "./firebase/firebaseAdmin";
import { Coupon } from "@/types/Coupon";
import { customAlphabet } from "nanoid";

/**
 * Checks if a user has a specific role
 */
export function isRole(user: User, role: string): boolean {
  console.log(user, role);
  return user.roles.includes(role);
}

/**
 * Extracts the uid from the auth header
 */
export async function extractUid(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return null;
  }

  const decoded = await getAuth().verifyIdToken(token);
  return decoded.uid;
}

/**
 * Fetches a user with a specific uid
 */
export async function getUserWithUid(uid: string): Promise<User | null> {
  const userRef = adminDb.collection("users").doc(uid);
  const userSnap = await userRef.get();

  let user = null;

  if (!userSnap.exists) {
    user = await initializeUser(uid);
  } else {
    user = userSnap.data() as User;
  }

  return user;
}

/** 
 * Gets the user data directly from the header token
 */
export async function getUser(req: NextRequest): Promise<User | null> {
  const uid = await extractUid(req);
  if (!uid) return null;

  const userRef = adminDb.collection("users").doc(uid);
  const userSnap = await userRef.get();

  let user = null;

  if (!userSnap.exists) {
    user = await initializeUser(uid);
  } else {
    user = userSnap.data() as User;
  }

  return user;
}

/**
 * Fetches a user with a specific email
 */
export async function getUserWithEmail(email: string): Promise<User | null> {
  const userRef = adminDb.collection("users").where("email", "==", email);
  const userSnap = await userRef.get();

  if (!userSnap.empty) {
    return userSnap.docs[0].data() as User;
  }

  return null;
}

/**
 * Fetches a coupon with a specific code
 */
export async function getCouponFromCode(code: string): Promise<Coupon | null> {
  const couponRef = adminDb.collection("coupons").doc(code);
  const couponSnap = await couponRef.get();

  if (!couponSnap.exists) {
    return null;
  }

  const couponData = couponSnap.data() as Coupon;

  return couponData;
}

export const generateCouponCode = async (): Promise<string> => {
  let code = "";
  let good = false;

  // checking if code already exists
  // length of code can increase by 1 every 2 tries to avoid collisions
  for (let i = 0; i < 10; i++) {
    const codeLength = 6 + Math.floor(i / 2);
    code = customAlphabet("23456789abcdefghjkmnpqrstxyz", codeLength)();
    const res = await adminDb.collection("coupons").doc(code).get();
    if (!res.exists) {
      good = true;
      break;
    }
  }

  return code;
};

export const initializeUser = async (uid: string) => {
  try {
    const userProfile = await adminAuth.getUser(uid);

    const user = {
      displayName: userProfile.displayName,
      displayImgUrl: userProfile.photoURL,
      email: userProfile.email,

      uid: uid,
      totalPoints: 0,
      individualPoints: {},
      roles: ["user"],
    } as User;

    await adminDb.collection("users").doc(uid).set(user);

    return user;
  } catch (err) {
    throw err;
  }
};
