"use client";

import { useState } from "react";

export default function CouponViewer() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setCoupon(null);
    setError(null);

    try {
      const res = await fetch(`/api/coupons/${code}`);
      if (!res.ok) throw new Error("Coupon not found");

      const data = await res.json();
      setCoupon(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md p-6 bg-white rounded-2xl shadow">
      <h2 className="text-xl font-bold mb-4">Find a Coupon</h2>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter coupon code"
          className="flex-1 border rounded-lg p-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Error */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Coupon Details */}
      {coupon && (
        <div className="mt-4 border rounded-lg p-4 bg-gray-50">
          <p><span className="font-semibold">Code:</span> {coupon.code}</p>
          <p><span className="font-semibold">Multi-use:</span> {coupon.multiuse ? "Yes" : "No"}</p>
          <p>
            <span className="font-semibold">Points:</span>{" "}
            {Object.entries(coupon.points || {}).map(([k, v]) => `${k}: ${v}`).join(", ")}
          </p>
          {coupon.expirationDate && (
            <p>
              <span className="font-semibold">Expires:</span>{" "}
              {new Date(coupon.expirationDate).toLocaleDateString()}
            </p>
          )}
          {coupon.claimedBy?.length > 0 && (
            <p>
              <span className="font-semibold">Claimed by:</span>{" "}
              {coupon.claimedBy.join(", ")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
