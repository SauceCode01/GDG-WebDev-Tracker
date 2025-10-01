import { Coupon } from "@/types/Coupon";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { claimCoupon, createCoupon, voidCoupon } from "../api/coupons";

export function useCreateCouponMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (param: { coupon: Coupon }) => {
      const response = await createCoupon(param.coupon);
      return response;
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
  });
}

export function useVoidCouponMutation()   {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (param: { code: string }) => {
      const response = voidCoupon(param.code);
      return response;
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
  });
}

export function useClaimCouponMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (param: { code: string, email?: string }) => {
      const response = claimCoupon(param.code, param.email);
      return response;
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
