"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Sparkles, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { UpgradeModal } from "@/src/components/shared/UpgradeModal";

export function PricingSection() {
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const baseFeatures = [
    "1 integration connected (Gmail)",
    "Limit of 4 chat messages in memory",
    "Email search & draft reply cards",
    "Google Calendar features blocked"
  ];

  const alphaFeatures = [
    "2 integrations (Gmail + Calendar)",
    "Limit of 20 chat messages in memory",
    "Check schedules & free slots",
    "Create and delete calendar events",
    "Draft and send reply emails",
    "Standard developer support"
  ];

  const gamaFeatures = [
    "Everything included in Alpha",
    "Unlimited chat messages",
    "Full access to all AI tools",
    "Isolated sandbox partitions",
    "PostgreSQL token encryption",
    "Priority developer support"
  ];

  return (
    <section id="pricing" className="relative py-36 px-4 sm:px-6 md:px-8 bg-[#F9F6F0] select-none border-t border-[rgba(30,20,12,0.06)] overflow-hidden">
      
      {/* ── 1. Barely Visible Indian Geometric Jaali Pattern (3.5% Opacity) ── */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] select-none z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="jaali-lattice" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 30,0 L 60,30 L 30,60 L 0,30 Z M 0,0 L 30,30 L 0,60 M 60,0 L 30,30 L 60,60" stroke="#CB7E3E" strokeWidth="1" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#jaali-lattice)" />
        </svg>
      </div>

      {/* ── Subtle Warm Paper Noise overlay ── */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.018] bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')] z-0" />

      {/* ── 2. Giant Blurred Amber Radial Light & Cream Glow (Behind Cards) ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[550px] rounded-full bg-[#CB7E3E]/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[30%] right-[10%] w-[450px] h-[450px] rounded-full bg-[#CB7E3E]/7 blur-[100px] pointer-events-none z-0" />

      {/* ── 3. Subtle Floating Ambient Particles ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 hidden lg:block">
        {[
          { left: "15%", top: "20%", delay: 0, size: 4 },
          { left: "80%", top: "30%", delay: 2.5, size: 3 },
          { left: "25%", top: "70%", delay: 1.2, size: 5 },
          { left: "70%", top: "75%", delay: 3.8, size: 4 }
        ].map((particle, idx) => (
          <motion.div
            key={idx}
            animate={{
              y: [0, -18, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 5 + idx,
              repeat: Infinity,
              ease: "easeInOut",
              delay: particle.delay,
            }}
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
            }}
            className="absolute rounded-full bg-[#C67B3D]/20"
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-5xl z-10">
        
        {/* ── Pricing Header (From Spec) ── */}
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/60 border border-[rgba(198,123,61,0.1)] shadow-xs">
            <Sparkles className="w-3 h-3 text-[#C67B3D]" />
            <span className="text-[10px] font-bold text-[#64748B] tracking-wider uppercase font-sans">Pricing</span>
          </div>
          
          <h2 className="text-[38px] md:text-[56px] font-serif font-normal text-[#111827] leading-tight tracking-tight">
            One workspace. Simple plans.
          </h2>
          
          <p className="text-[16px] text-[#64748B] font-sans leading-relaxed font-normal pt-1 max-w-lg mx-auto">
            Choose the right tier for your focus flow. Integrate Gmail and Google Calendar seamlessly.
          </p>
        </div>

        {/* ── Pricing Cards Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto px-4">
          
          {/* Plan 1: BASE (Free) */}
          <motion.div
            whileHover={{
              y: -6,
              boxShadow: "0 30px 60px rgba(0,0,0,0.06), 0 10px 25px rgba(198,123,61,0.05)",
            }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{
              background: "rgba(255, 255, 255, 0.75)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(198, 123, 61, 0.15)",
            }}
            className="rounded-[28px] p-8 sm:p-10 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.05),0_5px_20px_rgba(198,123,61,0.08)] text-left transition-all duration-300"
          >
            <div className="space-y-6">
              <div>
                <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-widest block mb-1">
                  BASE
                </span>
                <div className="flex items-baseline mt-2 font-serif text-[42px] font-normal text-[#111827]">
                  ₹0
                </div>
                <p className="text-[13px] text-[#64748B] font-sans mt-2">
                  For individuals organizing personal projects.
                </p>
              </div>

              <div className="border-t border-[rgba(198,123,61,0.12)] pt-6">
                <ul className="space-y-3.5 text-[13.5px] leading-tight text-[#111827]">
                  {baseFeatures.map((feat, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[rgba(198,123,61,0.06)] text-[#64748B] flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/pricing"
                className="block w-full text-center rounded-xl bg-white hover:bg-cream-100 border border-[rgba(198,123,61,0.2)] text-[#111827] text-[13px] font-bold py-3.5 transition-all active:scale-[0.98] shadow-xs font-sans cursor-pointer"
              >
                Get Started Free
              </Link>
            </div>
          </motion.div>

          {/* Plan 2: ALPHA (₹399) */}
          <motion.div
            whileHover={{
              y: -8,
              boxShadow: "0 30px 60px rgba(0,0,0,0.08), 0 10px 30px rgba(198,123,61,0.12)",
            }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{
              background: "rgba(255, 255, 255, 0.75)",
              backdropFilter: "blur(20px)",
              border: "1.5px solid rgba(198,123,61,0.3)",
            }}
            className="relative rounded-[28px] p-8 sm:p-10 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.05),0_5px_20px_rgba(198,123,61,0.08)] text-left transition-all duration-300 md:scale-[1.03] z-10"
          >
            <div className="absolute inset-0 -m-[1px] rounded-[28px] border-2 border-transparent bg-gradient-to-br from-[#D9A15B] to-[#C67B3D] opacity-10 pointer-events-none" />

            <div className="absolute -top-3.5 right-8 bg-gradient-to-r from-[#C67B3D] to-[#D9A15B] text-white px-4 py-1.5 rounded-full text-[9.5px] font-bold uppercase tracking-widest border border-[#C67B3D]/10 shadow-[0_4px_12px_rgba(198,123,61,0.2)]">
              Most Popular
            </div>

            <div className="space-y-6">
              <div>
                <span className="text-[11px] font-bold text-[#C67B3D] uppercase tracking-widest block mb-1">
                  ALPHA
                </span>
                <div className="flex items-baseline mt-2">
                  <h3 className="font-serif text-[42px] font-normal text-[#111827]">
                    ₹399
                  </h3>
                  <span className="text-[13px] text-[#64748B] font-sans ml-1">/ month</span>
                </div>
                <p className="text-[13px] text-[#64748B] font-sans mt-2">
                  For power users seeking unlimited capabilities and automation.
                </p>
              </div>

              <div className="border-t border-[rgba(198,123,61,0.12)] pt-6">
                <ul className="space-y-3.5 text-[13.5px] leading-tight text-[#111827]">
                  {alphaFeatures.map((feat, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#C67B3D]/10 text-[#C67B3D] flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/pricing"
                className="block w-full text-center rounded-xl bg-[#C67B3D] hover:bg-[#b0672e] text-white text-[13px] font-bold py-3.5 transition-all cursor-pointer active:scale-[0.98] shadow-[0_4px_14px_rgba(198,123,61,0.25)]"
              >
                Get Alpha
              </Link>
            </div>
          </motion.div>

          {/* Plan 3: GAMA (₹999) */}
          <motion.div
            whileHover={{
              y: -6,
              boxShadow: "0 30px 60px rgba(0,0,0,0.06), 0 10px 25px rgba(198,123,61,0.05)",
            }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{
              background: "rgba(255, 255, 255, 0.75)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(198, 123, 61, 0.15)",
            }}
            className="rounded-[28px] p-8 sm:p-10 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.05),0_5px_20px_rgba(198,123,61,0.08)] text-left transition-all duration-300"
          >
            <div className="space-y-6">
              <div>
                <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-widest block mb-1">
                  GAMA
                </span>
                <div className="flex items-baseline mt-2">
                  <h3 className="font-serif text-[42px] font-normal text-[#111827]">
                    ₹999
                  </h3>
                  <span className="text-[13px] text-[#64748B] font-sans ml-1">/ month</span>
                </div>
                <p className="text-[13px] text-[#64748B] font-sans mt-2">
                  For teams and professionals requiring dedicated resources.
                </p>
              </div>

              <div className="border-t border-[rgba(198,123,61,0.12)] pt-6">
                <ul className="space-y-3.5 text-[13.5px] leading-tight text-[#111827]">
                  {gamaFeatures.map((feat, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[rgba(198,123,61,0.06)] text-[#64748B] flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/pricing"
                className="block w-full text-center rounded-xl bg-white hover:bg-cream-100 border border-[rgba(198,123,61,0.2)] text-[#111827] text-[13px] font-bold py-3.5 transition-all active:scale-[0.98] shadow-xs font-sans cursor-pointer"
              >
                Get Gama
              </Link>
            </div>
          </motion.div>

        </div>
      </div>

      <UpgradeModal open={upgradeOpen} onOpenChange={setUpgradeOpen} />
    </section>
  );
}

export default PricingSection;
