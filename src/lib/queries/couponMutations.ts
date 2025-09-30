import { Coupon } from "@/types/Coupon";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCoupon } from "../api/coupons";

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
      const response = await fetch(`/api/coupons/${param.code}/void`, {
        method: "PUT",
      });
      const data = await response.json();
      return data;
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
  });
}

export function useClaimCouponMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (param: { code: string }) => {
      const response = await fetch(`/api/coupons/${param.code}/claim`, {
        method: "PUT",
      });
      const data = await response.json();
      return data;
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
