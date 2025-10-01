"use client";

import React, { useState } from "react";
import ClaimCoupon from "./_components/ClaimCoupon";
import Leaderboards from "./_components/Leaderboards";
import { HeaderComponent } from "./_components/HeaderComponent";
import { useAuthStore } from "@/stores/authStore";
import { useUserQuery } from "@/lib/queries/userQueries";
import CouponGenerator from "./_components/CouponGenerator";
import CouponManager from "./_components/CouponManager";

export const HomePage = () => {
  const [currentTab, setCurrentTab] = useState("leaderboards");

  const { user, token, authState, error, loginWithGoogle, logout } =
    useAuthStore();

  const { user: userData } = useUserQuery(user?.uid);

  const isAdmin = userData?.roles.includes("admin");

  return (
    <>
      <div className="w-full bg-gray-100 min-h-screen">
        <div className="w-full flex flex-col gap-2 max-w-5xl mx-auto py-8">
          <div className="w-full sticky top-0 flex flex-col gap-2">
            <HeaderComponent />
            <ClaimCoupon />
          </div>
          <div className="w-full bg-white p-6 rounded-2xl flex flex-row gap-6">
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

          {/* <div className="w-full flex flex-row gap-8 justify-start">
            <CouponForm />
            <CouponList />
          </div> */}
        </div>
      </div>
    </>
  );
};

export default HomePage;
