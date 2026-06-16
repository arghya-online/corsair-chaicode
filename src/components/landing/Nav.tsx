"use client";
 
import React from "react";
import Link from "next/link";
import { LogoMark } from "@/src/components/shared/LogoMark";

interface NavProps {
  user: {
    id: string;
    email: string;
    name: string | null;
  } | null;
}

export function Nav({ user }: NavProps) {
  return (
    <header className="fixed top-5 left-0 right-0 z-50 flex justify-center px-6 select-none">
      <div className="w-full max-w-4xl bg-white/72 backdrop-blur-[18px] border border-[rgba(28,36,49,0.08)] rounded-full px-6 py-2.5 flex items-center justify-between shadow-[0_8px_32px_0_rgba(28,36,49,0.02)]">
        <Link href="/" id="brand-logo" className="flex items-center group">
          <LogoMark className="h-6 w-auto transition-transform duration-300 group-hover:scale-105" />
        </Link>
 
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-[13px] font-sans text-[#566170] hover:text-[#C98A54] transition-colors font-medium tracking-wide"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="text-[13px] font-sans text-[#566170] hover:text-[#C98A54] transition-colors font-medium tracking-wide"
          >
            Pricing
          </a>
          <a
            href="#about"
            className="text-[13px] font-sans text-[#566170] hover:text-[#C98A54] transition-colors font-medium tracking-wide"
          >
            About
          </a>
        </nav>
 
        <div>
          <Link
            href="/dashboard"
            id="nav-console-btn"
            className="rounded-full bg-[#1C2431] hover:bg-[#101827] text-white px-5 py-2 text-[12px] font-medium tracking-wide transition-all active:scale-[0.98] hover:-translate-y-0.5 inline-block"
          >
            Open Dashboard
          </Link>
        </div>
      </div>
    </header>
  );
}
 
export default Nav;
