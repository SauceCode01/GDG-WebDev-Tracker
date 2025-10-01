"use client";

import { useClaimCouponMutation } from "@/lib/queries/couponMutations";
import { useCouponQuery } from "@/lib/queries/couponQueries";
import { useAuthStore } from "@/stores/authStore";
import { Coupon } from "@/types/Coupon";
import { useRef, useState } from "react";
import { CouponCard } from "./CouponCard";

export default function ClaimCoupon() {
  const [showValue, setShowValue] = useState(false);
  const [code, setCode] = useState<undefined | string>(undefined);
  const { authState } = useAuthStore();

  const claimCouponMutation = useClaimCouponMutation();
  const {
    coupon: couponValue,
    isLoading: couponLoading,
    error: couponError,
  } = useCouponQuery(code);

  const codeRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowValue(false);

    if (codeRef.current) {
      const code = codeRef.current.value;

      if (authState === "unauthenticated") {
        if (emailRef.current) {
          const email = emailRef.current.value;
          claimCouponMutation.mutate({ code, email });
        }
      } else {
        claimCouponMutation.mutate({ code });
      }
    }
  };

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowValue(true);

    if (codeRef.current) {
      console.log("checking");
      const code = codeRef.current.value;
      console.log("handleCheck", code);
      setCode(code);
    }
  };

  return (
    <div className="w-full p-6 bg-white rounded-2xl shadow">
      <h2 className="text-xl font-bold mb-4">Redeem Coupon</h2>

      {/* Search Form */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          ref={codeRef}
          placeholder="Enter coupon code"
          className="flex-1 border rounded-lg p-2"
        />

        {authState === "unauthenticated" && (
          <input
            type="email"
            ref={emailRef}
            placeholder="Enter email"
            className="flex-1 border rounded-lg p-2"
          />
        )}

        <button
          onClick={handleClaim}
          disabled={claimCouponMutation.isPending}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {claimCouponMutation.isPending ? "Redeeming..." : "Redeem"}
        </button>

        <button
          onClick={handleCheck}
          disabled={couponLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {couponLoading ? "Checking..." : "Check value"}
        </button>
      </div>

      {/* Pending claim */}
      {!showValue && claimCouponMutation.isPending && (
        <p className="text-blue-500 text-sm">Claiming...</p>
      )}

      {/* Error */}
      {!showValue && claimCouponMutation.isError && (
        <p className="text-red-500 text-sm">
          {claimCouponMutation.error.message}
        </p>
      )}

      {/* Coupon Details */}
      {!showValue && claimCouponMutation.data && (
        <div className="mt-4 border rounded-lg p-4 bg-gray-50">
          <h1>You Claim The following Coupon</h1>
          <p>
            <span className="font-semibold">Code:</span>{" "}
            {claimCouponMutation.data.code}
          </p>
          <p>
            <span className="font-semibold">Multi-use:</span>{" "}
            {claimCouponMutation.data.multiuse ? "Yes" : "No"}
          </p>
          <p>
            <span className="font-semibold">Points:</span>{" "}
            {Object.entries(claimCouponMutation.data.points || {})
              .map(([k, v]) => `${k}: ${v}`)
              .join(", ")}
          </p>
          {claimCouponMutation.data.expirationDate && (
            <p>
              <span className="font-semibold">Expires:</span>{" "}
              {new Date(
                claimCouponMutation.data.expirationDate
              ).toLocaleDateString()}
            </p>
          )}
          {claimCouponMutation.data.claimedBy &&
            claimCouponMutation.data.claimedBy.length > 0 && (
              <p>
                <span className="font-semibold">Claimed by:</span>{" "}
                {claimCouponMutation.data.claimedBy.join(", ")}
              </p>
            )}
        </div>
      )}

      {/* Coupon Details */}
      {showValue && couponValue && 
      <><CouponCard coupon={couponValue} /></>}
    </div>
  );
}
