"use client";

import { useUserQuery } from "@/lib/queries/userQueries";
import { useAuthStore } from "@/stores/authStore";
import React, { useEffect, useRef, useState } from "react";
import { FaBars } from "react-icons/fa";
import { Block } from "./atoms/Block";

export const ProfileBlock = () => {
  const { user, token, authState, error, loginWithGoogle, logout } =
    useAuthStore();

  const { user: userData } = useUserQuery(user?.uid);

  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <>
      <Block>
        {/* banner */}
        <div className="w-full h-[50%] absolute top-0 left-0 bg-violet-800 rounded-br-2xl rounded-bl-2xl z-[-1] overflow-clip">
          <img
            src={"/banner.png"}
            className="object-cover object-center w-full"
          />
        </div>

        {/* avatar and infos */}
        <div className="w-full flex-row flex">
          {/* avatar */}
          <div className="w-[6em] sm:w-[8em] md:w-[12em] m-2  relative flex justify-center items-center">
            <div className="w-full rounded-full aspect-square bg-orange-200 overflow-clip relative ">
              <img
                src={userData?.displayImgUrl ?? "/sparky.png"}
                className="object-cover object-center w-full h-full"
              />
            </div>
          </div>
          {/* name & email */}
          <div className="flex flex-col justify-center items-start gap-4">
            <div className="text-4xl font-bold opacity-0">
              <div className="text-2xl md:text-4xl font-bold">
                {userData?.displayName ?? "Sparky Batumbakal"}
              </div>
              <div className="text-sm md:text-lg ">
                {userData?.email ?? "gdg.pupmnl@gmail.com"}
              </div>
            </div>
            <div className=" flex flex-col gap-0">
              <div className="text-2xl md:text-4xl font-bold">
                {userData?.displayName ?? "Sparky Batumbakal"}
              </div>
              <div className="text-sm md:text-lg ">
                {userData?.email ?? "gdg.pupmnl@gmail.com"}
              </div>
            </div>
          </div>
        </div>

        {/* Burger Menu */}
        <div className=" absolute top-5 right-5" ref={menuRef}>
          <button
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <FaBars size={20} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-60 rounded-md bg-white shadow-lg border border-gray-200 z-10">
              {authState === "unauthenticated" && (
                <div
                  onClick={() => {
                    loginWithGoogle();
                    setMenuOpen(false);
                  }}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                >
                  Login with Google
                </div>
              )}
              {authState === "authenticated" && (
                <div
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                >
                  Logout
                </div>
              )}
            </div>
          )}
        </div>
      </Block>
    </>
  );

  // return (
  //   <div className="w-full flex flex-col gap-2 shadow  bg-white p-6 rounded-2xl">
  //     {authState == "unauthenticated" && (
  //       <div
  //         className="w-fit px-4 py-2 rounded-full bg-blue-300"
  //         onClick={() => {
  //           loginWithGoogle();
  //         }}
  //       >
  //         Login with google
  //       </div>
  //     )}
  //     {authState == "authenticated" && (
  //       <>
  //         <div className="w-full flex flex-col md:flex-row gap-2">
  //           <div className="w-fit px-4 py-2 rounded-full ">
  //             Hello: {user?.displayName}
  //           </div>
  //           <div className="w-fit px-4 py-2 rounded-full ">
  //             Roles: {JSON.stringify(userData?.roles)}
  //           </div>
  //           <div
  //             className="w-fit px-4 py-2 rounded-full bg-blue-300"
  //             onClick={() => {
  //               logout();
  //             }}
  //           >
  //             Logout
  //           </div>
  //         </div>

  //         {userData && (
  //           <>
  //             <div className="w-full text-2xl font-bol">Your points</div> <hr />{" "}
  //             <div className="w-full flex flex-row flex-wrap gap-2">
  //               {Object.entries(userData.individualPoints || {}).map(
  //                 ([k, v]) => (
  //                   <>
  //                     <div className="py-2 px-4 w-fit text-xs bg-amber-200 rounded-full shadow">
  //                       {k}: {v}
  //                     </div>
  //                   </>
  //                 )
  //               )}
  //             </div>
  //           </>
  //         )}
  //       </>
  //     )}
  //   </div>
  // );
};
