import React, { useRef, useState } from "react";
import { Block } from "./atoms/Block";
import ClaimCoupon from "./ClaimCoupon";
import { useAuthStore } from "@/stores/authStore";
import { useUserQuery } from "@/lib/queries/userQueries";
import { useClaimCouponMutation } from "@/lib/queries/couponMutations";
import { useCouponQuery } from "@/lib/queries/couponQueries";
import { CouponCard } from "./CouponCard";
import { Popup } from "./Popup";
import { CouponClaimed } from "./CouponClaimed";

export const Sidebar = () => {
  const [popupOpen, setPopupOpen] = useState(false);

  const { user, token, authState, error, loginWithGoogle, logout } =
    useAuthStore();

  const { user: userData } = useUserQuery(user?.uid);

  const [showValue, setShowValue] = useState(false);
  const [code, setCode] = useState<undefined | string>(undefined);

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
      <div className="hidden max-w-xs lg:flex flex-col gap-2 w-full  p-0 md:py-4 ">
        <Block>
          <h2 className="text-base font-bold mb-4">Your Points</h2>
          {userData && (
            <div className="w-full flex flex-row flex-wrap gap-2">
              {Object.entries(userData.individualPoints || {}).map(([k, v]) => (
                <>
                  <div className="py-2 px-4 w-fit text-sm cursor-default     bg-blue-500 text-white rounded-full shadow hover:bg-blue-600 ">
                    {v} {k}
                  </div>
                </>
              ))}
            </div>
          )}
        </Block>

        <Block>
          <h2 className="text-base font-bold mb-4">Redeem Coupon</h2>
          {/* Search Form */}
          <div className="flex flex-col gap-4 mb-4">
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
        </Block>

        {showValue && couponValue && (
          <Block>
            <CouponCard coupon={couponValue} />
          </Block>
        )}
      </div>

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
};
