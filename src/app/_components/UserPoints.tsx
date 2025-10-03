"use client";

import React from "react";
import { Block } from "./atoms/Block";
import { useAuthStore } from "@/stores/authStore";
import { useUserQuery } from "@/lib/queries/userQueries";

export const UserPoints = () => {
  const { user, token, authState, error, loginWithGoogle, logout } =
    useAuthStore();

  const { user: userData } = useUserQuery(user?.uid);
  return (
    <Block>
      <h2 className="text-base font-bold mb-4">Your Points</h2>
      {userData && (
        <div className="w-full flex flex-row flex-wrap gap-2">
          {Object.entries(userData.individualPoints || {}).map(([k, v]) => (
            <>
              <div className="py-2 px-4 w-fit text-sm cursor-default     bg-blue-500 text-white rounded-full shadow hover:bg-blue-600 ">
                {v} {k} 
              </div>
            </>
          ))}
        </div>
      )}
    </Block>
  );
};
