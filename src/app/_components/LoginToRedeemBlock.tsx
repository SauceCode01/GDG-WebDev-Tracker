import React from "react";
import { Block } from "./atoms/Block";
import { FcGoogle } from "react-icons/fc"; // Google logo icon
import { useAuthStore } from "@/stores/authStore";

export const LoginToRedeemBlock = ( ) => {
    
      const { user, token, authState, error, loginWithGoogle, logout } =
        useAuthStore();
  return (
    <Block>
      <div className="text-xl md:text-2xl font-bold flex w-full flex-row justify-between items-center">
        <p>Login to redeem coupons</p>

        <button
          onClick={loginWithGoogle}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow hover:bg-gray-50 transition"
        >
          <FcGoogle size={20} />
          <span className="text-sm md:text-base font-medium text-gray-700">
            Login with Google
          </span>
        </button>
      </div>
    </Block>
  );
};
