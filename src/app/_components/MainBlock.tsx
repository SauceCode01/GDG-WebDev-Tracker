"use client"

import { useUserQuery } from "@/lib/queries/userQueries";
import { useAuthStore } from "@/stores/authStore";
import React, { useState } from "react";
import Leaderboards from "./Leaderboards";
import CouponGenerator from "./CouponGenerator";
import CouponManager from "./CouponManager";

export const MainBlock = () => {
  const [currentTab, setCurrentTab] = useState("leaderboards");

  const { user, token, authState, error, loginWithGoogle, logout } =
    useAuthStore();

  const { user: userData } = useUserQuery(user?.uid);

  const isAdmin = userData?.roles.includes("admin");
  return (
    <>
      <div className="w-full bg-white p-6 rounded-2xl flex flex-col md:flex-row gap-6">
        <div
          className={`cursor-pointer hover:text-gray-600 ${
            currentTab == "leaderboards" && "font-bold underline"
          }`}
          onClick={() => setCurrentTab("leaderboards")}
        >
          Leaderboards
        </div>
        <div
          className={`cursor-pointer hover:text-gray-600 ${
            currentTab == "activities" && "font-bold underline"
          }`}
          onClick={() => setCurrentTab("activities")}
        >
          Activities
        </div>
        <div
          className={`cursor-pointer hover:text-gray-600 ${
            currentTab == "awards" && "font-bold underline"
          }`}
          onClick={() => setCurrentTab("awards")}
        >
          Awards
        </div>

        {isAdmin && (
          <>
            <div
              className={`cursor-pointer hover:text-gray-600 ${
                currentTab == "generator" && "font-bold underline"
              }`}
              onClick={() => setCurrentTab("generator")}
            >
              Generator
            </div>
            <div
              className={`cursor-pointer hover:text-gray-600 ${
                currentTab == "coupons" && "font-bold underline"
              }`}
              onClick={() => setCurrentTab("coupons")}
            >
              Coupons
            </div>
          </>
        )}
      </div>

      {currentTab == "leaderboards" && <Leaderboards />}

      {currentTab == "generator" && <CouponGenerator />}

      {currentTab == "coupons" && <CouponManager />}
    </>
  );
};
