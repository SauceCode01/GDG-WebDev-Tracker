"use client";

import { useVoidCouponMutation } from "@/lib/queries/couponMutations";
import { useInfiniteCouponQuery } from "@/lib/queries/couponQueries";

export default function CouponManager() {
  const voidCouponMutation = useVoidCouponMutation();
  const {
    coupons,
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
    error,
    hasNextPage,
  } = useInfiniteCouponQuery();

  const handleVoidCoupon = async (code: string) => {
    voidCouponMutation.mutate({ code });
  };

  return (
    <div className="space-y-4 p-6 w-full rounded-2xl bg-white">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-3 py-2 border">Code</th>
            <th className="px-3 py-2 border">Multi-use</th>
            <th className="px-3 py-2 border">Points</th>
            <th className="px-3 py-2 border">Expires</th>
            <th className="px-3 py-2 border">Status</th>
            <th className="px-3 py-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((coupon) => (
            <tr key={coupon.code} className="border-b hover:bg-gray-50">
              <td className="px-3 py-2">{coupon.code}</td>
              <td className="px-3 py-2">{coupon.multiuse ? "Yes" : "No"}</td>
              <td className="px-3 py-2">
                {Object.entries(coupon.points || {})
                  .map(([k, v]) => `${k}: ${v}`)
                  .join(", ")}
              </td>
              <td className="px-3 py-2">
                {coupon.expirationDate
                  ? new Date(coupon.expirationDate).toLocaleDateString()
                  : "—"}
              </td>
              <td className="px-3 py-2">
                {coupon.voided ? (
                  <span className="text-red-500 font-medium">Voided</span>
                ) : (
                  <span className="text-green-600">Active</span>
                )}
              </td>
              <td className="px-3 py-2">
                {!coupon.voided && (
                  <button
                    onClick={() => handleVoidCoupon(coupon.code!)}
                    disabled={voidCouponMutation.isPending}
                    className="px-2 py-1 rounded bg-red-500 text-white text-xs disabled:opacity-50"
                  >
                    {voidCouponMutation.isPending ? "Voiding..." : "Void"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {hasNextPage && !isFetchingNextPage && (
        <button
          className="mt-2 px-4 py-2 bg-gray-800 text-white rounded"
          onClick={() => fetchNextPage()}
        >
          Load more
        </button>
      )}

      {isFetchingNextPage && <p className="text-sm">Loading...</p>}

      {error && <p className="text-red-500">{error.message}</p>}

      {!hasNextPage && coupons.length > 0 && (
        <p className="text-gray-500 text-sm">No more coupons</p>
      )}
    </div>
  );
}
