import { Coupon } from "@/types/Coupon";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getCoupon, getCoupons } from "../api/coupons";

export function useCouponQuery(code: string) {
  const { data: coupon, ...rest } = useQuery<Coupon>({
    queryKey: ["coupons", code],
    queryFn: async () => {
      if (!code) throw new Error("Project ID and Item ID are required");
      const response = await getCoupon(code);
      return response;
    },
    enabled: !!code,
  });

  return { coupon, ...rest };
}

export function useInfiniteCouponQuery() {
  const { data, ...rest } = useInfiniteQuery<Coupon[], Error>({
    queryKey: ["coupons"],
    queryFn: async ({ pageParam }) => {
      return getCoupons(10, pageParam as string | undefined);
    },
    initialPageParam: null,
    getNextPageParam: (lastPage): string | undefined => {
      if (!lastPage || lastPage.length === 0) return undefined;
      return lastPage[lastPage.length - 1].code;
    },
  });

  const coupons: Coupon[] = data?.pages.flatMap((page) => page) ?? [];

  return { coupons, ...rest };
}
