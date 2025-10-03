"use client";
import { IoClose } from "react-icons/io5";
import React, { useEffect } from "react";

type PopupProps = {
  isOpen: boolean;
  onClose: () => void;
  width?: string;  // Tailwind width classes like w-[400px] or w-1/2
  height?: string; // Tailwind height classes
  children: React.ReactNode;
};

export const Popup: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  width = "w-[400px]",
  height = "h-[300px]",
  children,
}) => {
  // close on Esc key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/20 flex items-center justify-center z-50"
      onClick={onClose} // clicking backdrop closes
    >
      <div
        className={`relative bg-white rounded-lg shadow-lg p-4 m-4`}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        {/* Close button */}
        <button
          className="absolute cursor-pointer top-4 right-4 text-xl text-black  hover:text-gray-800 hover:scale-105"
          onClick={onClose}
        >
          <IoClose />
        </button>

        {/* Popup content */}
        <div className="w-full h-full overflow-auto">{children}</div>
      </div>
    </div>
  );
};
