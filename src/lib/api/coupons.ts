import { Coupon } from "@/types/Coupon";
import { wrappedFetch } from "../utils";

/**
 * QUERIES
 */

export const getCoupon = async (code: string) => {
  const res = await wrappedFetch(`/api/coupons/${code}`, {
    method: "GET",
  });

  const data = await res.json();
  console.log(data);
  return data;
}


export const getCoupons = async (limit: number, lastCode?: string) => {
  const res = await wrappedFetch(`/api/coupons?limit=${limit}&last=${lastCode}`, {
    method: "GET",
  });

  const data = await res.json();
  console.log(data);
  return data;
}


/**
 * MUTATIONS
 */

export const claimCoupon = async (code: string, email?: string) => {
  const url = email
    ? `/api/coupons/${code}/claim?email=${encodeURIComponent(email)}`
    : `/api/coupons/${code}/claim`;

  const res = await wrappedFetch(url, {
    method: "PUT",
  });

  const data = await res.json();
  console.log(data);
};


export const voidCoupon = async (code: string) => {
  const res = await wrappedFetch(`/api/coupons/${code}/void`, {
    method: "PUT",
  });

  const data = await res.json();
  console.log(data);
}

export const createCoupon = async (coupon: Coupon)    => {
  const res = await wrappedFetch(`/api/coupons`, {
    method: "POST",
    body: JSON.stringify(coupon),
  });

  const data = await res.json();
  console.log(data);
  return data;
}

