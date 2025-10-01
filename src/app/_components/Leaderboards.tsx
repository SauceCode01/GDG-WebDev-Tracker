"use client";

import { useVoidCouponMutation } from "@/lib/queries/couponMutations";
import { useInfiniteCouponQuery } from "@/lib/queries/couponQueries";
import { useInfiniteUserQuery } from "@/lib/queries/userQueries";
import { Coupon } from "@/types/Coupon";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

export default function Leaderboards() {
  const queryClient = useQueryClient();

  const voidCouponMutation = useVoidCouponMutation();

  const {
    users,
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
    error,
    hasNextPage,
    ...rest
  } = useInfiniteUserQuery();

  const handleVoidCoupon = async (code: string) => {
    voidCouponMutation.mutate({ code });
  };

  return (
    <div className=" w-full bg-white rounded-2xl shadow p-6 overflow-x-auto text-xs">
      <table className="w-full min-w-3xl">
        <tr>
          <th className="text-center p-2 ">Developer</th>
          <th className="text-center p-2 ">Email</th>
          <th className="text-center p-2">Badges</th>
          <th className="text-center p-2">Points</th>
        </tr>

        {users.map((user) => (
          <tr key={user.uid} className="  ">
            <td className="">
              <div className=" flex flex-row gap-2 items-center justify-start  p-2 w-full h-full">
                <img
                  src={user.displayImgUrl}
                  alt=""
                  className="w-12 h-12 rounded-full"
                />
                <p className="  "> {user.displayName}</p>
              </div>
            </td>
            <td className="">
              <div className="text-center    p-2">
                {" "}
                {user.email}
              </div>
            </td>
            <td className="">
              <div className=" p-2 flex flex-row flex-wrap justify-start items-center gap-1">
                {Object.entries(user.individualPoints || {}).map(([k, v]) => (
                  <>
                    <div className="py-2 px-4 w-fit text-xs bg-amber-200 rounded-full shadow">
                      {k}: {v}
                    </div>
                  </>
                ))}
              </div>
            </td>
            <td className="">
              <div className="text-center  p-2 w-full">{user.totalPoints}</div>
            </td>
          </tr>
        ))}
      </table>
      <div className="w-full p-4 flex flex-row justify-center">
        {hasNextPage && !isFetchingNextPage && (
          <div
            className="w-fit bg-gray-800 text-white rounded-2xl p-2 px-4"
            onClick={() => fetchNextPage()}
          >
            load more
          </div>
        )}

        {(isLoading || isFetchingNextPage) && (
          <div className="text-gray-500">loading...</div>
        )}

        {error && <p className="text-red-500">{error.message}</p>}

        {!hasNextPage && !isFetchingNextPage && !isLoading && (
          <p className="text-gray-500">No more coupons</p>
        )}
      </div>
    </div>
  );
}
