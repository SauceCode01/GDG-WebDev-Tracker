"use client";

import { useInfiniteCouponQuery } from "@/lib/queries/couponQueries";
import { Coupon } from "@/types/Coupon";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

export default function CouponList() {
    const queryClient = useQueryClient();


  const getCoupons = async (limit: number, lastCode?: string) => {
    const res = await fetch(`/api/coupons?limit=${limit}&last=${lastCode}`, {
      method: "GET",
    });

    const data = await res.json();
    console.log(data);
    return data;
  };

  const {
    coupons,
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
    error,
    hasNextPage,
    ...rest
  } = useInfiniteCouponQuery()
 

  const handleVoidCoupon = async (code: string) => {
    const res = await fetch(`/api/coupons/${code}/void`, {
      method: "PUT",
    });

    const data = await res.json();
    console.log(data);
    queryClient.invalidateQueries({ queryKey: ["Coupon"] });
  };


  return (
    <div className="space-y-2">
      {coupons.map((coupon) => (
        <div
          key={coupon.code}
          className="border rounded-lg p-3 shadow-sm bg-white"
        >
          <p className="font-semibold">Code: {coupon.code}</p>
          <p>Multi-use: {coupon.multiuse ? "Yes" : "No"}</p>
          <p>
            Points:{" "}
            {Object.entries(coupon.points || {})
              .map(([k, v]) => `${k}: ${v}`)
              .join(", ")}
          </p>
          {coupon.expirationDate && (
            <p>
              Expires: {new Date(coupon.expirationDate).toLocaleDateString()}
            </p>
          )}

          {
            coupon.voided && (
              <p className="text-red-500">Coupon has been voided</p>
            )
          }

          {
            !coupon.voided && (
                <div className="w-fit px-4 py-2 rounded-2xl bg-red-500 text-white" onClick={() => handleVoidCoupon(coupon.code!)}>Void coupon</div>
            )
          }
        </div>
      ))}

      {hasNextPage && !isFetchingNextPage && (
        <div
          className="w-fit bg-gray-800 text-white rounded-2xl p-2 px-4"
          onClick={() => fetchNextPage()}
        >
          load more
        </div>
      )}

      {isFetchingNextPage && (
        <div className="w-fit bg-gray-800 text-white rounded-2xl">loading...</div>
      )}

      {error && <p className="text-red-500">{error.message}</p>}

      {!hasNextPage && <p className="text-gray-500">No more coupons</p>}

      <br />
      <br />
      <br />
      <br />
    </div>
  );
}
