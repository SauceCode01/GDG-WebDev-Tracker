import React from "react";

export const SkeletonBlock = ( ) => {
  return (
    <div className="w-full relative shadow overflow-hidden  md:rounded-2xl animate-pulse bg-gray-300 p-4 md:p-6 z-0">
            <div className="w-full h-[120px] "></div>
    </div>
  );
};
