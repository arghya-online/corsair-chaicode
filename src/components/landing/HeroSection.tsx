"use client";
 
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface HeroSectionProps {
  user: {
    id: string;
    email: string;
    name: string | null;
  } | null;
}

export function HeroSection({ user }: HeroSectionProps) {
  const petals = Array.from({ length: 12 });
  const leafColors = ["#C98A54", "#A85A3A", "#50684E", "#D7A23B"];

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-6 overflow-hidden select-none">
      {/* Fallback Background Color */}
      <div className="absolute inset-0 bg-[#FAF7F2] z-0" />
      {/* Full-screen Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-10"
        style={{ backgroundImage: "url('/background.png')" }}
      />
      {/* Sandstone-tinted Overlay for Readability */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2]/50 via-[#FAF7F2]/30 to-[#FAF7F2]/65 z-20"
      />

      {/* Gentle Floating Organic Leaf Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
        {petals.map((_, i) => {
          const leafColor = leafColors[i % leafColors.length];
          return (
            <motion.svg
              key={i}
              custom={i}
              variants={{
                animate: (idx: number) => ({
                  x: ['-5vw', '105vw'],
                  y: ['-5vh', '105vh'],
                  rotate: [0, 180 + idx * 45],
                  transition: {
                    duration: 25 + idx * 4,
                    repeat: Infinity,
                    ease: "linear",
                    delay: idx * -4,
                  }
                })
              }}
              animate="animate"
              className="absolute w-4.5 h-6"
              viewBox="0 0 24 24"
              style={{
                color: leafColor,
                opacity: 0.3 + (i % 3) * 0.15,
                transform: `scale(${0.5 + (i % 4) * 0.18})`,
              }}
            >
              <path 
                d="M12,21 C10,21 6,17 6,13 C6,9 10,4 12,2 C14,4 18,9 18,13 C18,17 14,21 12,21 Z" 
                fill="currentColor" 
              />
            </motion.svg>
          );
        })}
      </div>

      <div className="w-full max-w-2xl text-center z-40 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="space-y-6 flex flex-col items-center"
        >
          {/* Default Badge Styling */}
          <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(201,138,84,0.12)] px-4 py-1.5 text-[12px] font-medium tracking-wide text-[#A85A3A] border border-[rgba(201,138,84,0.18)] shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D7A23B] animate-pulse" />
            Introducing Zentra AI
          </div>

          {/* Headline */}
          <h1 className="text-[44px] sm:text-[60px] leading-[1.12] font-serif font-normal text-[#1C2431] tracking-tight max-w-xl animate-fade-in">
            Your inbox, beautifully organized.
          </h1>

          {/* Description */}
          <p className="text-[15px] sm:text-[16px] leading-relaxed text-[#566170] max-w-lg font-sans font-normal">
            Connect Gmail, search conversations, draft replies, and stay organized through a calm AI-powered workspace.
          </p>

          {/* CTA Row */}
          <div className="flex flex-col sm:flex-row gap-4 pt-3 w-full sm:w-auto">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-full bg-[#1C2431] hover:bg-[#101827] px-8 py-3.5 text-[13px] font-medium text-white transition-all hover:-translate-y-0.5 active:scale-[0.98] shadow-sm"
            >
              Start Free
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-full bg-white/65 backdrop-blur-[12px] border border-[rgba(28,36,49,0.12)] px-8 py-3.5 text-[13px] font-medium text-[#1C2431] transition-all hover:bg-white/85 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Watch Demo
            </a>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 pt-6 max-w-lg">
            {[
              "Gmail Sync",
              "AI Search",
              "Smart Drafts",
              "Priority Inbox"
            ].map((feature, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/50 backdrop-blur-sm px-3.5 py-1 text-[11px] font-medium text-[#566170] border border-[rgba(28,36,49,0.08)]"
              >
                <span className="text-[#50684E] text-[10px] font-medium">✓</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
