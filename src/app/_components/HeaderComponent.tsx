"use client";

import { useUserQuery } from "@/lib/queries/userQueries";
import { useAuthStore } from "@/stores/authStore";
import React from "react";

export const HeaderComponent = () => {
  const { user, token, authState, error, loginWithGoogle, logout } =
    useAuthStore();

  const { user: userData } = useUserQuery(user?.uid);

  return (
    <div className="w-full flex flex-col gap-2 shadow  bg-white p-6 rounded-2xl">
      {authState == "unauthenticated" && (
        <div
          className="w-fit px-4 py-2 rounded-full bg-blue-300"
          onClick={() => {
            loginWithGoogle();
          }}
        >
          Login with google
        </div>
      )}
      {authState == "authenticated" && (
        <>
          <div className="w-full flex flex-row gap-2">
            <div className="w-fit px-4 py-2 rounded-full ">
            Hello: {user?.displayName}
          </div>
          <div className="w-fit px-4 py-2 rounded-full ">
            Roles: {JSON.stringify(userData?.roles)}
          </div>
          <div
            className="w-fit px-4 py-2 rounded-full bg-blue-300"
            onClick={() => {
              logout();
            }}
          >
            Logout
          </div>
          </div>

          {userData && (
            <div className="w-full flex flex-row flex-wrap gap-2">
              {Object.entries(userData.individualPoints || {}).map(([k, v]) => (
                <>
                  <div className="py-2 px-4 w-fit text-xs bg-amber-200 rounded-full shadow">
                    {k}: {v}
                  </div>
                </>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
