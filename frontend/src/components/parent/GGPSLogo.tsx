import React from "react";

interface GGPSLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showText?: boolean;
  textClassName?: string;
  subText?: string;
  variant?: "navy" | "primary" | "white";
}

export default function GGPSLogo({
  size = "md",
  className = "",
  showText = false,
  textClassName = "",
  subText = "School ERP",
  variant = "primary",
}: GGPSLogoProps) {
  const sizeMap = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
    xl: "w-14 h-14",
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* GGPS Luxury Academic Shield Emblem */}
      <div className={`relative flex items-center justify-center shrink-0 ${currentSize}`}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          <defs>
            <linearGradient id="ggpsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3157D5" />
              <stop offset="100%" stopColor="#153472" />
            </linearGradient>
            <linearGradient id="ggpsGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDB022" />
              <stop offset="100%" stopColor="#F79009" />
            </linearGradient>
          </defs>

          {/* Shield Outer Container */}
          <path
            d="M24 4L7 11V22C7 32.5 14.2 42.1 24 44.5C33.8 42.1 41 32.5 41 22V11L24 4Z"
            fill="url(#ggpsGrad)"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Inner Accent Ring */}
          <path
            d="M24 8L11 13.5V22C11 30.2 16.5 37.8 24 39.8C31.5 37.8 37 30.2 37 22V13.5L24 8Z"
            fill="#07142F"
            fillOpacity="0.4"
          />

          {/* Academic Laurel / Open Book */}
          <path
            d="M24 28V20C24 20 20 18 15 19V27C20 26 24 28 24 28Z"
            fill="#FFFFFF"
            fillOpacity="0.9"
          />
          <path
            d="M24 28V20C24 20 28 18 33 19V27C28 26 24 28 24 28Z"
            fill="#FFFFFF"
            fillOpacity="0.9"
          />

          {/* Gold Star Apex */}
          <polygon
            points="24,13 25.5,16.5 29,16.5 26,18.8 27.2,22.2 24,20 20.8,22.2 22,18.8 19,16.5 22.5,16.5"
            fill="url(#ggpsGold)"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`text-lg font-black tracking-tight ${
                variant === "white"
                  ? "text-white"
                  : variant === "navy"
                  ? "text-[#07142F]"
                  : "text-[#172033] dark:text-white"
              } ${textClassName}`}
            >
              GGPS
            </span>
            <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-[#3157D5]/15 text-[#3157D5] dark:text-blue-300">
              PORTAL
            </span>
          </div>
          {subText && (
            <span className="text-[10px] font-semibold text-slate-400 -mt-0.5 tracking-wide">
              {subText}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
