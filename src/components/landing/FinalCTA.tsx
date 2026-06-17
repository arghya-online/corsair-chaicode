"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Calendar, Check, Sparkles, AlertCircle } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="relative py-48 px-4 sm:px-6 md:px-8 overflow-hidden select-none bg-[#F7F3EC] flex flex-col items-center justify-center border-t border-[rgba(17,24,39,0.06)]">
      
      {/* ── 1. Giant Blurred Amber Radial Light & Cream Glow (Behind CTA Card) ── */}
      <motion.div
        animate={{
          opacity: [0.75, 0.9, 0.75],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: "radial-gradient(circle, rgba(198,123,61,0.12) 0%, rgba(217,161,91,0.06) 50%, rgba(247,243,236,0) 100%)",
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[600px] rounded-full blur-[100px] pointer-events-none z-0"
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] rounded-full bg-white/20 blur-[130px] pointer-events-none z-0" />

      {/* ── 2. CTA Container ── */}
      <div className="relative w-full max-w-6xl text-center z-10 flex flex-col items-center">
        
        {/* ── Floating Workspace Elements (Different depths and rotations) ── */}
        
        {/* Floating Card 1: Priority Email "Client approval needed" (Left-Top) */}
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [-4, -2, -4] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(198, 123, 61, 0.12)",
          }}
          className="absolute -left-12 -top-10 z-20 hidden lg:flex items-center gap-3.5 px-4.5 py-3.5 rounded-2xl max-w-[230px] text-left shadow-[0_8px_30px_rgba(0,0,0,0.03),0_4px_10px_rgba(198,123,61,0.04)]"
        >
          <div className="w-9 h-9 rounded-xl bg-peach-soft flex items-center justify-center flex-shrink-0">
            <Mail className="w-4.5 h-4.5 text-[#C67B3D]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[9px] font-bold text-[#C67B3D] uppercase tracking-wider">Priority Email</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C67B3D]" />
            </div>
            <p className="text-[12px] font-bold text-[#111827] truncate">Client approval needed</p>
            <p className="text-[10px] text-[#64748B] truncate">Vikram: Launch brief needs sign...</p>
          </div>
        </motion.div>

        {/* Floating Card 2: Meeting "Design Review · 2:00 PM" (Right-Top) */}
        <motion.div
          animate={{ y: [0, 8, 0], rotate: [3, 5, 3] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{
            background: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(15px)",
            border: "1px solid rgba(198, 123, 61, 0.15)",
          }}
          className="absolute -right-14 top-4 z-20 hidden lg:flex items-center gap-3.5 px-5 py-4 rounded-2xl max-w-[240px] text-left shadow-[0_12px_40px_rgba(0,0,0,0.04),0_6px_15px_rgba(198,123,61,0.05)]"
        >
          <div className="w-9.5 h-9.5 rounded-xl bg-sky-soft flex items-center justify-center flex-shrink-0">
            <Calendar className="w-4.5 h-4.5 text-sky" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[9px] font-bold text-[#5A6D56] uppercase tracking-wider">Meeting</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#5A6D56]" />
            </div>
            <p className="text-[12px] font-bold text-[#111827] truncate">Design Review</p>
            <p className="text-[10px] text-sky font-semibold truncate">2:00 PM · Boardroom</p>
          </div>
        </motion.div>

        {/* Floating Card 3: AI Draft "Response prepared" (Right-Bottom) */}
        <motion.div
          animate={{ y: [0, -7, 0], rotate: [-2, 0, -2] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(198, 123, 61, 0.1)",
          }}
          className="absolute -right-8 bottom-10 z-20 hidden lg:flex items-center gap-3.5 px-4.5 py-4 rounded-2xl max-w-[230px] text-left shadow-[0_8px_30px_rgba(0,0,0,0.03),0_4px_10px_rgba(198,123,61,0.04)]"
        >
          <div className="w-9 h-9 rounded-xl bg-[#C67B3D]/10 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4.5 h-4.5 text-[#C67B3D]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[9px] font-bold text-[#C67B3D] uppercase tracking-wider">AI Draft Ready</span>
            </div>
            <p className="text-[12px] font-bold text-[#111827] truncate">Response prepared</p>
            <p className="text-[10px] text-[#64748B] line-clamp-1 italic">"We can push to Wed..."</p>
          </div>
        </motion.div>

        {/* Floating Card 4: Task "Follow up with vendor" (Left-Bottom) */}
        <motion.div
          animate={{ y: [0, 9, 0], rotate: [4, 2, 4] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          style={{
            background: "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(198, 123, 61, 0.08)",
          }}
          className="absolute -left-10 bottom-6 z-20 hidden lg:flex items-center gap-3 px-4.5 py-3.5 rounded-2xl max-w-[210px] text-left shadow-[0_8px_30px_rgba(0,0,0,0.03),0_4px_10px_rgba(198,123,61,0.04)]"
        >
          <div className="w-5.5 h-5.5 rounded-lg bg-[#5A6D56] flex items-center justify-center text-white flex-shrink-0">
            <Check className="w-3.5 h-3.5 stroke-[3.5]" />
          </div>
          <div className="min-w-0">
            <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-widest block mb-0.5">Task</span>
            <p className="text-[12px] font-bold text-[#111827] truncate">Follow up with vendor</p>
          </div>
        </motion.div>

        {/* ── 3. Main Glassmorphic CTA Card (1200px limit) ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          whileHover={{
            y: -4,
            boxShadow: "0 40px 100px rgba(0, 0, 0, 0.12), 0 10px 40px rgba(198,123,61,0.05)",
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.75))",
            backdropFilter: "blur(30px)",
            border: "1px solid rgba(198, 123, 61, 0.15)",
          }}
          className="w-full max-w-[1200px] rounded-[36px] px-8 py-16 sm:py-20 md:py-24 shadow-[0_30px_80px_rgba(0,0,0,0.08)] flex flex-col items-center gap-8.5"
        >
          {/* Subtle Sparkle Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-[rgba(198,123,61,0.1)] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C67B3D]" />
            <span className="text-[10px] font-bold text-[#64748B] tracking-wider uppercase">Reclaim your workday</span>
          </div>

          {/* Headline from spec */}
          <h2 className="text-[42px] sm:text-[56px] font-serif font-normal text-[#111827] leading-[1.1] tracking-tight max-w-2xl">
            Focus on the work that matters.
          </h2>

          {/* Subtext from spec */}
          <p className="text-[15px] sm:text-[17px] text-[#64748B] font-sans leading-relaxed max-w-xl">
            Zentra quietly organizes conversations, schedules, and priorities so you can stay focused without switching between tools.
          </p>

          {/* Primary & Secondary Buttons (Height: 52-56px) */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-xl bg-[#111827] hover:bg-[#C67B3D] text-[14px] font-bold text-white transition-all active:scale-[0.98] shadow-md px-10 h-14 font-sans cursor-pointer"
            >
              Start Free
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-xl bg-white hover:bg-[#F7F3EC] border border-[rgba(198,123,61,0.2)] text-[14px] font-bold text-[#111827] transition-all active:scale-[0.98] shadow-sm px-10 h-14 font-sans cursor-pointer"
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
