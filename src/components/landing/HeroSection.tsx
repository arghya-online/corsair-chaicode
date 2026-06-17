"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { SignedIn, SignedOut } from "@clerk/nextjs";

interface HeroSectionProps {
  user: {
    id: string;
    email: string;
    name: string | null;
  } | null;
}

export function HeroSection({ user }: HeroSectionProps) {
  return (
    <section className="relative h-screen min-h-[800px] w-full flex items-center justify-center px-6 overflow-hidden select-none bg-[#111827]">
      {/* Immersive Background Image (hero_bharat.png) */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/hero_bharat.png')" }}
      />

      {/* Subtle Dark Overlay for premium look & readability */}
      <div
        className="absolute inset-0 bg-black/55 z-10"
      />

      <div className="w-full max-w-6xl text-center z-20 flex flex-col items-center justify-center h-full pt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="space-y-8 md:space-y-10 flex flex-col items-center"
        >
          {/* Eyebrow Label */}
          <div className="font-sans text-[15px] font-bold tracking-[0.25em] text-[#FCFAF7] bg-white/10 backdrop-blur-sm px-5 py-2 rounded-full border border-white/10 mt-4">
            Zentra AI
          </div>

          {/* Massive Serif Headline */}
          <h1 className="text-[54px] sm:text-[76px] md:text-[96px] lg:text-[112px] xl:text-[120px] leading-[1.02] font-serif font-normal text-[#FCFAF7] tracking-tight max-w-5xl whitespace-pre-line">
            Built for {"\n"}Focused Minds.
          </h1>

          {/* Supporting Text */}
          <p className="text-[18px] sm:text-[21px] leading-relaxed text-[#FCFAF7]/85 max-w-2xl font-sans font-light px-4">
            Email. Calendar. Meetings. AI assistance. All within one beautifully crafted workspace.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto px-6">
            <SignedOut>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full bg-[#FCFAF7] hover:bg-[#F7F3EC] text-[#111827] px-10 py-4 text-[16px] sm:text-[17px] font-medium transition-all active:scale-[0.98] shadow-md font-sans"
              >
                Start Free
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full bg-white/10 border border-white/20 hover:bg-white/20 text-[#FCFAF7] px-10 py-4 text-[16px] sm:text-[17px] font-medium transition-all active:scale-[0.98] font-sans backdrop-blur-sm"
              >
                Sign In
              </Link>
            </SignedOut>
            <SignedIn>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-full bg-[#FCFAF7] hover:bg-[#F7F3EC] text-[#111827] px-10 py-4 text-[16px] sm:text-[17px] font-medium transition-all active:scale-[0.98] shadow-md font-sans"
              >
                Open Dashboard
              </Link>
            </SignedIn>
          </div>

          {/* Trust Row */}
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 pt-12 max-w-3xl text-white/70 font-sans text-[15px]">
            {[
              "Gmail Native",
              "AI Search",
              "Smart Drafts",
              "Calendar Sync"
            ].map((indicator, idx) => (
              <div key={idx} className="flex items-center gap-2.5 font-medium">
                <span className="w-5 h-5 rounded-full bg-[#C1783F]/20 flex items-center justify-center text-[#C1783F]">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </span>
                <span>{indicator}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
