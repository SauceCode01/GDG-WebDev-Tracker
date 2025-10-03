"use client";

import { useVoidCouponMutation } from "@/lib/queries/couponMutations";
import { useInfiniteCouponQuery } from "@/lib/queries/couponQueries";
import { useInfiniteUserQuery } from "@/lib/queries/userQueries";
import { Coupon } from "@/types/Coupon";
import { User } from "@/types/User";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

//  ${
//           rank == 1
//             ? "bg-violet-800 text-white"
//             : rank == 2
//             ? "bg-violet-700 text-white"
//             : rank == 3
//             ? "bg-violet-600 text-white"
//             : ""
//         }

const RankingRow = ({ rank, user }: { rank: number; user?: User }) => {
  return (
    <div className="flex flex-row items-center group">
      {/* Rank */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold `}
      >
        {rank}
      </div>

      {/* User strip */}
      <div className="ml-6 flex flex-row items-center flex-1 rounded-full border-2 border-gray-300 shadow-sm shadow-gray-300 relative px-4 py-2 bg-white hover:bg-amber-100   transition-all duration-200 group-hover:border-black">
        {/* Avatar (overlaps to the left) */}
        <div className="w-12 sm:w-16 aspect-square rounded-full overflow-hidden absolute -left-4 top-1/2 -translate-y-1/2 shadow-sm shadow-gray-300">
          <img
            src={user?.displayImgUrl ?? "/sparky.png"}
            alt="user avatar"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Name */}
        <div className="ml-8 sm:ml-12 text-xs sm:text-base font-bold">
          {user?.displayName ?? "Sparky Batumbakal"}
        </div>

        {/* Points (right aligned) */}
        <div className="ml-auto text-xs sm:text-base font-semibold text-violet-700">
          {`${user?.totalPoints ?? 0}`}
        </div>
      </div>
    </div>
  );
};

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
    <>
      <div className="flex flex-col gap-6 py-6">
        {/* ranking row */}
        {users.map((user, index) => (
          <RankingRow key={user.uid} rank={index + 1} user={user} />
        ))}

        <div className="w-full flex flex-row justify-center">
          {hasNextPage && !isFetchingNextPage && (
            <div
              className="w-fit bg-gray-800 cursor-pointer text-white rounded-full p-2 px-6"
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
            <p className="text-gray-500">-- no more users --</p>
          )}
        </div>
      </div>
    </>
  );
}
