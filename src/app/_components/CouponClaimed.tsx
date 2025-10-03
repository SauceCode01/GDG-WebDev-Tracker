import { useUserQuery } from "@/lib/queries/userQueries";
import { useAuthStore } from "@/stores/authStore";
import { Coupon } from "@/types/Coupon";
import React from "react";

export const CouponClaimed = ({ couponData }: { couponData: Coupon }) => {
  const { user, token, authState, error, loginWithGoogle, logout } =
    useAuthStore();

  const { user: userData } = useUserQuery(user?.uid);

  return (
    <>
      <div className="w-full h-full flex flex-col justify-center items-center gap-4 p-10">
        <h2 className="text-center text-4xl font-extrabold flex flex-row justify-between items-center text-amber-500">
          You Claimed A Coupon!
        </h2>

        <p  className="text-center text-2xl font-bold">
          <span>{`New Total Points: ${userData?.totalPoints}`}</span>
          
        </p>

        <div className="w-full flex flex-row flex-wrap justify-center gap-2">
          {Object.entries(couponData.points || {}).map(([k, v]) => (
            <>
              <div className="py-2 px-4 w-fit text-sm cursor-default     bg-blue-500 text-white rounded-full shadow hover:bg-blue-600 ">
                {v} {k}
              </div>
            </>
          ))}
        </div>
      </div>
    </>
  );
};
