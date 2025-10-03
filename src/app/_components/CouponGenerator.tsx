"use client";

import React, { useState } from "react";
import { useCreateCouponMutation } from "@/lib/queries/couponMutations";
import { CouponCard } from "./CouponCard";
import type { Coupon } from "@/types/Coupon";

export default function CouponGenerator()  {
  // the mutation hook may expose different status props depending on your implementation
  // we coerce it to `any` to remain compatible with a variety of hook shapes.
  const mutation = useCreateCouponMutation() as any;
  const { mutateAsync } = mutation;

  const [multiuse, setMultiuse] = useState<boolean>(false);
  const [frontendPoints, setFrontendPoints] = useState<string>("");
  const [backendPoints, setBackendPoints] = useState<string>("");
  const [expirationDate, setExpirationDate] = useState<string>(""); // yyyy-mm-dd from <input type="date" />
  const [result, setResult] = useState<string | null>(null);
  const [createdCoupon, setCreatedCoupon] = useState<Coupon | null>(null);

  // support both `isPending` (custom hooks) and `isLoading` (react-query)
  const isMutating = Boolean(mutation?.isPending || mutation?.isLoading);
  const isError = Boolean(mutation?.isError);
  const errorMessage = mutation?.error?.message ?? null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);

    // build points object only for fields that were filled in
    const points: Record<string, number> = {};
    if (frontendPoints !== "") points["Frontend Points"] = Number(frontendPoints) || 0;
    if (backendPoints !== "") points["Backend Points"] = Number(backendPoints) || 0;

    const payload = {
      coupon: {
        multiuse,
        points,
        // only include expirationDate if the user chose one
        expirationDate: expirationDate ? new Date(expirationDate).getTime() : undefined,
      },
    };

    try {
      const coupon = await mutateAsync(payload);
      setCreatedCoupon(coupon ?? null);
      setResult(coupon?.code ? `Coupon created: ${coupon.code}` : "Coupon created");
    } catch (err: any) {
      console.error(err);
      setResult(err?.message ?? "Error creating coupon");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full p-6 bg-white rounded-2xl shadow">
      <h2 className="text-xl font-bold mb-4">Create a Coupon</h2>

      <label className="flex items-center space-x-2 mb-4">
        <input
          type="checkbox"
          checked={multiuse}
          onChange={(e) => setMultiuse(e.target.checked)}
          className="w-4 h-4"
        />
        <span>Multi-use Coupon</span>
      </label>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Frontend Points</label>
        <input
          type="number"
          inputMode="numeric"
          value={frontendPoints}
          onChange={(e) => setFrontendPoints(e.target.value)}
          placeholder="e.g. 50"
          className="w-full border rounded-lg p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Backend Points</label>
        <input
          type="number"
          inputMode="numeric"
          value={backendPoints}
          onChange={(e) => setBackendPoints(e.target.value)}
          placeholder="e.g. 100"
          className="w-full border rounded-lg p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Expiration Date</label>
        <input
          type="date"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
          className="w-full border rounded-lg p-2"
        />
        <p className="mt-2 text-xs text-gray-500">
          {expirationDate ? `Expires: ${new Date(expirationDate).toLocaleDateString()}` : "No expiration set"}
        </p>
      </div>

      <button
        type="submit"
        disabled={isMutating}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {isMutating ? "Creating..." : "Create Coupon"}
      </button>

      {result && <p className="mt-4 text-center text-sm">{result}</p>}

      {isError && errorMessage && (
        <p className="mt-2 text-center text-sm text-red-500">{errorMessage}</p>
      )}

      {createdCoupon && (
        <div className="mt-4">
          <CouponCard coupon={createdCoupon} />
        </div>
      )}
    </form>
  );
}
