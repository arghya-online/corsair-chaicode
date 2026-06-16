"use client";
 
import React, { useState } from "react";
import Link from "next/link";
import { LogoMark } from "@/src/components/shared/LogoMark";
import { Menu, X } from "lucide-react";
import { SignInButton, SignUpButton, UserButton, Show } from "@clerk/nextjs";

interface NavProps {
  user?: any;
}

export function Nav({ user }: NavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-5 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 select-none">
      <div className="w-full max-w-5xl bg-white/75 backdrop-blur-md border border-[rgba(17,24,39,0.08)] rounded-full px-6 sm:px-8 py-3 flex items-center justify-between shadow-[0_8px_32px_rgba(17,24,39,0.03)]">
        
        {/* Left: Logo */}
        <Link href="/" id="brand-logo" className="flex items-center group">
          <LogoMark className="h-6 w-auto transition-transform duration-300 group-hover:scale-105" />
        </Link>
 
        {/* Center: Links */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          <a
            href="#features"
            className="text-[15px] font-sans text-[#5F6B7A] hover:text-[#C1783F] transition-colors font-medium tracking-wide"
          >
            Features
          </a>
          <a
            href="#workflow"
            className="text-[15px] font-sans text-[#5F6B7A] hover:text-[#C1783F] transition-colors font-medium tracking-wide"
          >
            How It Works
          </a>
          <a
            href="#pricing"
            className="text-[15px] font-sans text-[#5F6B7A] hover:text-[#C1783F] transition-colors font-medium tracking-wide"
          >
            Pricing
          </a>
          <a
            href="#about"
            className="text-[15px] font-sans text-[#5F6B7A] hover:text-[#C1783F] transition-colors font-medium tracking-wide"
          >
            About
          </a>
        </nav>
 
        {/* Right: Actions (Clerk Auth Controls integrated) */}
        <div className="hidden md:flex items-center gap-6">
          <Show when="signed-out">
            <Link
              href="/login"
              className="text-[15px] font-sans text-[#5F6B7A] hover:text-[#111827] transition-colors font-medium tracking-wide"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-[#111827] hover:bg-[#111827]/90 text-white px-5 py-2.5 text-[15px] font-medium tracking-wide transition-all active:scale-[0.98] inline-block shadow-sm"
            >
              Sign Up
            </Link>
          </Show>
          <Show when="signed-in">
            <Link
              href="/dashboard"
              className="text-[15px] font-sans text-[#5F6B7A] hover:text-[#111827] transition-colors font-medium tracking-wide"
            >
              Go to Dashboard
            </Link>
            <div className="flex items-center justify-center border-l border-[rgba(17,24,39,0.12)] pl-4">
              <UserButton />
            </div>
          </Show>
        </div>

        {/* Mobile menu trigger */}
        <div className="md:hidden flex items-center gap-4">
          <Show when="signed-out">
            <Link
              href="/login"
              className="text-[13px] font-sans font-medium bg-[#111827] text-white px-4 py-1.5 rounded-full"
            >
              Sign In
            </Link>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-[#111827] hover:text-[#C1783F] transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-20 left-4 right-4 bg-white/95 backdrop-blur-lg border border-[rgba(17,24,39,0.08)] rounded-3xl p-6 shadow-xl flex flex-col gap-4 md:hidden">
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="text-[16px] font-sans text-[#5F6B7A] hover:text-[#C1783F] transition-colors font-medium"
          >
            Features
          </a>
          <a
            href="#workflow"
            onClick={() => setMobileMenuOpen(false)}
            className="text-[16px] font-sans text-[#5F6B7A] hover:text-[#C1783F] transition-colors font-medium"
          >
            How It Works
          </a>
          <a
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="text-[16px] font-sans text-[#5F6B7A] hover:text-[#C1783F] transition-colors font-medium"
          >
            Pricing
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="text-[16px] font-sans text-[#5F6B7A] hover:text-[#C1783F] transition-colors font-medium"
          >
            About
          </a>
          <hr className="border-[rgba(17,24,39,0.08)] my-2" />
          <div className="flex flex-col gap-3">
            <Show when="signed-out">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 text-[16px] font-sans text-[#5F6B7A] hover:text-[#111827] transition-colors font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center rounded-full bg-[#111827] text-white py-3 text-[16px] font-medium transition-all active:scale-[0.98]"
              >
                Sign Up
              </Link>
            </Show>
            <Show when="signed-in">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 text-[16px] font-sans text-[#5F6B7A] hover:text-[#111827] transition-colors font-medium"
              >
                Go to Dashboard
              </Link>
            </Show>
          </div>
        </div>
      )}
    </header>
  );
}
 
export default Nav;
