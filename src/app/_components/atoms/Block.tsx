import React from "react";

export const Block = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full relative shadow overflow-hidden  md:rounded-2xl bg-white p-4 md:p-6 z-0">
      {children}
    </div>
  );
};
