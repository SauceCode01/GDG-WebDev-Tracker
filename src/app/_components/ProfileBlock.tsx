"use client";

import { useUserQuery } from "@/lib/queries/userQueries";
import { useAuthStore } from "@/stores/authStore";
import React from "react";

export const ProfileBlock = () => {
  const { user, token, authState, error, loginWithGoogle, logout } =
    useAuthStore();

  const { user: userData } = useUserQuery(user?.uid);

  return (
    <>
      <div className="w-full relative shadow flex overflow-hidden flex-row md:rounded-2xl bg-white p-2 md:p-4 z-0">
        {/* banner */}
        <div className="w-full h-[50%] absolute top-0 left-0 bg-violet-800 rounded-br-2xl rounded-bl-2xl z-[-1] overflow-clip">

          <img src={"/banner.png"} className="object-cover object-center w-full" />

        </div>

{/* avatar */}
        <div className="w-[8em] md:w-[12em] m-2 rounded-full aspect-square bg-orange-200 overflow-clip relative">
          <img src={"/sparky.png"} className="object-cover object-center" />
        </div>

{/* name & email */}
        <div className="flex flex-col justify-center items-start gap-4">
          <div className="text-4xl font-bold opacity-0">
            <div className="text-2xl md:text-4xl font-bold">
              Sparky Batumbakal
            </div>
            <div className="text-sm md:text-lg ">
              gdg.pupmnl@gmail.com
            </div>
          </div>
          <div className=" flex flex-col gap-0">
            <div className="text-2xl md:text-4xl font-bold">
              Sparky Batumbakal
            </div>
            <div className="text-sm md:text-lg ">
              gdg.pupmnl@gmail.com
            </div>
          </div>
        </div>
      </div>
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
