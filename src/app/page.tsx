"use client";

import React, { useState } from "react";
import ClaimCoupon from "./_components/ClaimCoupon";
import Leaderboards from "./_components/Leaderboards";
import { ProfileBlock } from "./_components/ProfileBlock";
import { useAuthStore } from "@/stores/authStore";
import { useUserQuery } from "@/lib/queries/userQueries";
import CouponGenerator from "./_components/CouponGenerator";
import CouponManager from "./_components/CouponManager";
import { LoginToRedeemBlock } from "./_components/LoginToRedeemBlock";
import { MainBlock } from "./_components/MainBlock";
import { Block } from "./_components/atoms/Block";
import { UserPoints } from "./_components/UserPoints";
import { Sidebar } from "./_components/Sidebar";

export const HomePage = () => {
  const [currentTab, setCurrentTab] = useState("leaderboards");

  const { user, token, authState, error, loginWithGoogle, logout } =
    useAuthStore();

  const { user: userData } = useUserQuery(user?.uid);

  const isAdmin = userData?.roles.includes("admin");

  return (
    <>
      <div className="w-full bg-gray-100 min-h-screen flex flex-row justify-center gap-4 px-0 lg:px-4">
        <div className="w-full flex flex-col gap-2 max-w-3xl p-0 md:py-4 ">
          <ProfileBlock />
          {authState === "unauthenticated" && <LoginToRedeemBlock />}

          {authState === "authenticated" && (
            <>
              <div className="w-full lg:hidden">
                <UserPoints />
              </div>
            </>
          )}

          {authState === "authenticated" && (
            <>
              <div className="w-full lg:hidden">
                <ClaimCoupon />
              </div>
            </>
          )}

          <MainBlock />

          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </div>

        {authState === "authenticated" && <Sidebar />}
      </div>
    </>
  );
};

export default HomePage;
