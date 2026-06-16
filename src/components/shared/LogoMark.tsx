import React from "react";

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <img
      src="/logo.png"
      alt="acts logo"
      className={`h-8 w-auto object-contain select-none ${className}`}
    />
  );
}
export default LogoMark;
