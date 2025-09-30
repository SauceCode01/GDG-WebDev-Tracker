import { getAuth } from "firebase/auth";
import { customAlphabet } from "nanoid";
import { auth } from "./firebase/firebase";

export const generateId = (): string => customAlphabet("1234567890", 6)();

export const generateCouponCode = (): string =>
  customAlphabet("23456789abcdefghjkmnpqrstxyz", 6)(); // 1,l,i, & 0, o & u, v, w are excluded to avoid confusion

/**
 * Automatically inserts the authorization token into the headers
 */
export const wrappedFetch = async (
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> => {
  const token = await auth.currentUser?.getIdToken();

  return fetch(input, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
};


export const isAuthenticated = async () => await getAuth().currentUser !== null;