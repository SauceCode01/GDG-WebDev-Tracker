"use client";

import { Coupon } from "@/types/Coupon";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import CouponForm from "./_components/CouponForm";
import CouponViewer from "./_components/CouponViewer";
import CouponList from "./_components/CouponList";
import { db } from "@/lib/firebase/firebase";
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  doc,
} from "firebase/firestore";
import { useAuthStore } from "@/stores/authStore";
import { wrappedFetch } from "@/lib/utils";

export const HomePage = () => {
  const {user, token, authState, error,loginWithGoogle, logout} = useAuthStore();


  const queryClient = useQueryClient();

  const handleClaimCoupon = async () => {
    const code = "ABC123";
    const uid = "erwin";

    const res = await fetch(`/api/coupons/${code}/claim?uid=${uid}`, {
      method: "PUT",
    });

    const data = await res.json();
    console.log(data);

    queryClient.invalidateQueries({ queryKey: ["Coupon"] });
  };

  const handleClientPost = async () => {
    await setDoc(doc(db, "coupons", "ABC123"), {
      code: "ABC123",
      multiuse: true,
      createdAt: Date.now(),
    });
  };


  const testFetch = async () => { 
    const res = await wrappedFetch(`/api/test`, {
      method: "POST"
    });
  }

  return (
    <>
      <div className="w-full flex flex-col gap-2">


        {authState=="checking" && <p>Loading...</p>}

        {error && <p>{error}</p>}
        {user && <p>{user.displayName}</p>}
        {token && <p>{token}</p>}
        {authState && <p>{authState}</p>}

        {!user && (
          <button
            onClick={() => {
              loginWithGoogle();
            }}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Login with Google
          </button>
        )}

        {authState == "authenticated" && (
          <button
            onClick={() => {
              logout()
            }}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        )}

        <div className="w-full flex flex-row gap-8 justify-start">
          <CouponViewer />
          <CouponForm />
        </div>

        <button onClick={handleClaimCoupon}>Claim</button>
        <button onClick={handleClientPost}>Client post </button>
        <button onClick={testFetch}>test fetch </button>

        <br />

        <CouponList />
      </div>
    </>
  );
};

export default HomePage;
