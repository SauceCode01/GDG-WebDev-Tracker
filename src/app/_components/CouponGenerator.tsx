"use client";

import { createCoupon } from "@/lib/api/coupons";
import { useCreateCouponMutation } from "@/lib/queries/couponMutations";
import { Coupon } from "@/types/Coupon";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { CouponCard } from "./CouponCard";

export default function CouponGenerator() {
  const [multiuse, setMultiuse] = useState(false);
  const [points, setPoints] = useState<Record<string, number>>({});
  const [expirationDate, setExpirationDate] = useState<number>(0);
  const [result, setResult] = useState<string | null>(null);

  const [createdCoupon, setCreatedCoupon] = useState<Coupon | null>(null);

  const createCouponMutation = useCreateCouponMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const coupon = await createCouponMutation.mutateAsync({
        coupon: {
          multiuse,
          points,
          expirationDate: expirationDate || undefined,
        },
      });

      setResult(
        coupon?.code
          ? `Coupon created: ${coupon.code}`
          : "Failed to create coupon"
      );
      setCreatedCoupon(coupon);
    } catch (err) {
      console.error(err);
      setResult("Error creating coupon");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full p-6 bg-white rounded-2xl shadow"
    >
      <h2 className="text-xl font-bold mb-4">Create a Coupon</h2>

      {/* Multiuse */}
      <label className="flex items-center space-x-2 mb-4">
        <input
          type="checkbox"
          checked={multiuse}
          onChange={(e) => setMultiuse(e.target.checked)}
          className="w-4 h-4"
        />
        <span>Multi-use Coupon</span>
      </label>

      {/* Points (simple for demo: one field for "default" points) */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Frontend Points
        </label>
        <input
          type="number"
          placeholder="Enter points"
          onChange={(e) =>
            setPoints((p) => ({
              ...p,
              "Frontend Points": Number(e.target.value),
            }))
          }
          className="w-full border rounded-lg p-2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Backend Points</label>
        <input
          type="number"
          placeholder="Enter points"
          onChange={(e) =>
            setPoints((p) => ({
              ...p,
              "Backend Points": Number(e.target.value),
            }))
          }
          className="w-full border rounded-lg p-2"
        />
      </div>

      {/* Expiration date */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Expiration Date
        </label>
        <input
          type="date"
          value={expirationDate}
          onChange={(e) =>
            setExpirationDate(new Date(e.target.value).getTime())
          }
          className="w-full border rounded-lg p-2"
        />
      </div>

      <button
        type="submit"
        disabled={createCouponMutation.isPending}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
      >
        {createCouponMutation.isPending ? "Creating..." : "Create Coupon"}
      </button>

      {result && (
        <>
          <p className="mt-4 text-center text-sm">{result}</p>

{createdCoupon && 
          <CouponCard coupon={createdCoupon} /> 
       }
        </>
      )}
      {createCouponMutation.isError && (
        <p className="mt-4 text-center text-sm text-red-500">
          {createCouponMutation.error.message}
        </p>
      )}
    </form>
  );
}
