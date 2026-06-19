"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

interface HeroSectionProps {
  user: {
    id: string;
    email: string;
    name: string | null;
  } | null;
}

export function HeroSection({ user }: HeroSectionProps) {
  const { isSignedIn } = useAuth();

  return (
    <section className="relative h-screen min-h-[750px] w-full flex items-center justify-center px-6 overflow-hidden select-none bg-[#111827]">
      {/* Immersive Background Image (hero_bharat.png) */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/hero_bharat.png')" }}
      />

      {/* Subtle Dark Overlay for premium look & readability */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Central Content */}
      <div className="w-full max-w-5xl text-center z-20 flex flex-col items-center justify-center h-full pt-20">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          className="space-y-6 md:space-y-8 flex flex-col items-center"
        >
          {/* Eyebrow Label (Badge) */}
          <div className="font-sans text-[11px] sm:text-[12px] font-bold tracking-[0.2em] text-[#FCFAF7] bg-white/10 backdrop-blur-md px-4.5 py-2 rounded-full border border-white/15 uppercase shadow-sm">
            AI Workspace for Gmail & Google Calendar
          </div>

          {/* Balanced Serif Headline */}
          <h1 className="text-[38px] sm:text-[56px] md:text-[72px] lg:text-[84px] xl:text-[92px] leading-[1.08] font-serif font-normal text-[#FCFAF7] tracking-tight max-w-4xl whitespace-pre-line">
            The fastest way to <span className="font-serif font-normal text-amber-600">understand </span>your work.
          </h1>

          {/* Supporting Text */}
          <p className="text-[14px] sm:text-[16px] md:text-[18px] leading-relaxed text-[#FCFAF7]/80 max-w-2xl font-sans font-light px-4">
            Ask questions, find decisions, track commitments, and get instant answers across Gmail and Google Calendar.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2 w-full sm:w-auto px-6 z-30">
            {!isSignedIn && (
              <>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-xl bg-[#FCFAF7] hover:bg-[#F7F3EC] text-[#111827] px-8 h-13 text-[14px] font-bold transition-all active:scale-[0.98] shadow-lg font-sans cursor-pointer hover:shadow-[0_8px_25px_rgba(252,250,247,0.15)]"
                >
                  Start Free
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-xl bg-white/10 border border-white/15 hover:bg-white/20 text-[#FCFAF7] px-8 h-13 text-[14px] font-bold transition-all active:scale-[0.98] font-sans backdrop-blur-md cursor-pointer"
                >
                  Sign In
                </Link>
              </>
            )}
            {isSignedIn && (
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-xl bg-[#FCFAF7] hover:bg-[#F7F3EC] text-[#111827] px-8 h-13 text-[14px] font-bold transition-all active:scale-[0.98] shadow-lg font-sans cursor-pointer hover:shadow-[0_8px_25px_rgba(252,250,247,0.15)]"
              >
                Open Dashboard
              </Link>
            )}
          </div>

          {/* Trust Row */}
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 pt-10 max-w-3xl text-white/55 font-sans text-[11px] sm:text-[12px] uppercase tracking-wider font-bold">
            {[
              "Gmail Native",
              "AI Search",
              "Smart Drafts",
              "Calendar Sync"
            ].map((indicator, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#C1783F]/15 flex items-center justify-center text-[#C1783F] flex-shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
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
