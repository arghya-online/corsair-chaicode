"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export function FinalCTA() {
  return (
    <section className="relative py-48 px-4 sm:px-6 md:px-8 overflow-hidden select-none bg-gradient-to-b from-[#F7F3EC] to-[#EAE6DF] flex items-center justify-center border-t border-[rgba(17,24,39,0.06)]">
      
      <div className="relative w-full max-w-5xl text-center z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          className="space-y-8 md:space-y-10 flex flex-col items-center"
        >
          {/* Massive Serif Headline */}
          <h2 className="text-[48px] sm:text-[76px] md:text-[96px] font-serif font-normal text-[#111827] leading-[1.02] tracking-tight max-w-4xl">
            Less managing.<br />
            More doing.
          </h2>

          {/* Supporting Text */}
          <p className="text-[18px] md:text-[20px] text-[#5F6B7A] font-sans leading-relaxed max-w-2xl px-4">
            Let Zentra organize conversations, schedules, and priorities so you can focus on the work that matters.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto px-6">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-full bg-[#111827] hover:bg-[#111827]/95 px-10 py-4 text-[16px] sm:text-[17px] font-medium text-white transition-all active:scale-[0.98] shadow-sm font-sans"
            >
              Start Free
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-full bg-white/90 border border-[rgba(17,24,39,0.12)] hover:bg-white px-10 py-4 text-[16px] sm:text-[17px] font-medium text-[#111827] transition-all active:scale-[0.98] shadow-sm font-sans"
            >
              Open Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default FinalCTA;
