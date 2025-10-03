"use client";

import { useUserQuery } from "@/lib/queries/userQueries";
import { useAuthStore } from "@/stores/authStore";
import React, { useState } from "react";
import Leaderboards from "./Leaderboards";
import CouponGenerator from "./CouponGenerator";
import CouponManager from "./CouponManager";
import { arrayIntersecting } from "@/lib/utils";
import { Block } from "./atoms/Block";

const TabHeader = ({
  tabName,
  currentTab,
  label,
  setTab,
}: {
  tabName: string;
  currentTab: string;
  label: string;
  setTab: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div
      className={`cursor-pointer hover:text-gray-600 ${
        currentTab == "leaderboards" && "font-bold underline"
      }`}
      onClick={() => setTab("leaderboards")}
    >
      Leaderboards
    </div>
  );
};

export const MainBlock = () => {
  const [currentTab, setCurrentTab] = useState("leaderboards");

  const { user, token, authState, error, loginWithGoogle, logout } =
    useAuthStore();

  const { user: userData } = useUserQuery(user?.uid);

  const isAdmin = userData?.roles.includes("admin");
  return (
    <>
      <Block>
        <div className="flex flex-col w-full gap-2">
          <div className="flex flex-row flex-wrap justify-start items-center">
            {Object.keys(TABS).map((tabName) => {
              return (
                <>
                  {arrayIntersecting(
                    TABS[tabName].roles,
                    userData?.roles ?? ["user"]
                  ) && (
                    <div
                      className={`cursor-pointer px-4 py-2 rounded-2xl    hover:bg-gray-300 text-base ${
                        currentTab == tabName && "font-bold"
                      }`}
                      onClick={() => setCurrentTab(tabName)}
                    >
                      {TABS[tabName].label}
                    </div>
                  )}
                </>
              );
            })}
          </div>
          <hr />
          

            {
              TABS &&
              TABS[currentTab] &&
              TABS[currentTab].element
            } 
        </div>
      </Block>


    </>
  );
};

type TabType = {
  label: string;
  element: React.ReactNode;
  roles: string[];
};

const TABS: Record<string, TabType> = {
  leaderboards: {
    label: "Leaderboards",
    element: <Leaderboards />,
    roles: ["user"],
  },
  activities: {
    label: "Activities",
    element: <></>,
    roles: ["user"],
  },
  awards: {
    label: "Awards",
    element: <></>,
    roles: ["user"],
  },
  generator: {
    label: "Generator",
    element: <CouponGenerator />,
    roles: ["admin"],
  },
  coupons: {
    label: "Coupons",
    element: <CouponManager />,
    roles: ["admin"],
  },
};
