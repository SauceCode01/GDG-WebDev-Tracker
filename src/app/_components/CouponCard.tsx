"use client";

import { Coupon } from "@/types/Coupon";
import React from "react";

export const CouponCard = ({ coupon }: { coupon: Coupon }) => {
  if (!coupon) return null;

  return (
    <>
      <h2 className="text-base font-bold mb-4 flex flex-row justify-between items-center">
        <span>Coupon Details:</span> <span>{coupon.code?.toUpperCase()}</span>
      </h2>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="font-medium">Code:</dt>
          <dd>{coupon.code ?? "N/A"}</dd>
        </div>

        <div className="flex justify-between">
          <dt className="font-medium">Multi-use:</dt>
          <dd>{coupon.multiuse ? "Yes" : "No"}</dd>
        </div>

        <div className="flex justify-between">
          <dt className="font-medium">Voided:</dt>
          <dd>{coupon.voided ? "Yes" : "No"}</dd>
        </div>

        {coupon.expirationDate && (
          <div className="flex justify-between">
            <dt className="font-medium">Expires:</dt>
            <dd>{new Date(coupon.expirationDate).toLocaleDateString()}</dd>
          </div>
        )}

        {coupon.createdAt && (
          <div className="flex justify-between">
            <dt className="font-medium">Created:</dt>
            <dd>{new Date(coupon.createdAt).toLocaleString()}</dd>
          </div>
        )}

        {coupon.claimedAt && (
          <div className="flex justify-between">
            <dt className="font-medium">Claimed At:</dt>
            <dd>{new Date(coupon.claimedAt).toLocaleString()}</dd>
          </div>
        )}
        <div>
          <dt className="font-medium">Points:</dt>
          <dd>
            <ul className="list-disc list-inside">
              {Object.entries(coupon.points).map(([k, v]) => (
                <li key={k}>
                  {k}: {v}
                </li>
              ))}
            </ul>
          </dd>
        </div>
        {coupon.claimedBy && coupon.claimedBy.length > 0 && (
          <div>
            <dt className="font-medium">Claimed By:</dt>
            <dd>
              <ul className="list-disc list-inside">
                {coupon.claimedBy.map((uid, i) => (
                  <li key={i}>{uid}</li>
                ))}
              </ul>
            </dd>
          </div>
        )}
      </dl>
    </>
  );
};
