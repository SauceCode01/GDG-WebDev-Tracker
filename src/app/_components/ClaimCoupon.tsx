"use client";

import { useClaimCouponMutation } from "@/lib/queries/couponMutations";
import { useCouponQuery } from "@/lib/queries/couponQueries";
import { useAuthStore } from "@/stores/authStore";
import { Coupon } from "@/types/Coupon";
import { useRef, useState } from "react";
import { CouponCard } from "./CouponCard";
import { Block } from "./atoms/Block";
import { Popup } from "./Popup";
import { CouponClaimed } from "./CouponClaimed";

export default function ClaimCoupon() {
  const [showValue, setShowValue] = useState(false);
  const [code, setCode] = useState<undefined | string>(undefined);
  const { authState } = useAuthStore();

  const [popupOpen, setPopupOpen] = useState(false);

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

      claimCouponMutation.mutate(
        { code },
        { onSuccess: () => setPopupOpen(true) }
      );
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
    <>
      <Block>
        <h2 className="text-base font-bold mb-4">Redeem Coupon</h2>
        {/* Search Form */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            ref={codeRef}
            placeholder="Enter coupon code"
            className="flex-2 border rounded-lg p-2"
          />

          <div className="w-full flex flex-2 flex-row gap-4">
            <button
              onClick={handleClaim}
              disabled={claimCouponMutation.isPending}
              className="bg-[#facc15] flex-1 text-black font-bold cursor-pointer px-4 py-2 rounded-lg hover:shadow-sm hover:bg-amber-200"
            >
              {claimCouponMutation.isPending ? "Redeeming..." : "Redeem"}
            </button>

            <button
              onClick={handleCheck}
              disabled={couponLoading}
              className="bg-none border-2 flex-1 border-black text-black cursor-pointer font-bold px-4 py-2 rounded-lg hover:shadow-sm hover:bg-amber-200"
            >
              {couponLoading ? "Checking..." : "Check value"}
            </button>
          </div>
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
        {showValue && couponValue && (
          <>
            <CouponCard coupon={couponValue} />
          </>
        )}
      </Block>
      <Popup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        width="w-1/2"
        height="h-[400px]"
      >
        <CouponClaimed couponData={claimCouponMutation.data} />
      </Popup>
    </>
  );
}
