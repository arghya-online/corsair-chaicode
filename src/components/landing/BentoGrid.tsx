"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Mail, Calendar, MessageSquare, Sparkles } from "lucide-react";

export function BentoGrid() {
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 16,
      },
    },
  };

  return (
    <section id="features" className="py-32 px-6 bg-[#FAF7F2] text-[#1C2431]">
      <div className="mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="max-w-2xl mb-24 space-y-4">
          <div className="text-[11px] font-medium tracking-widest text-[#C98A54] uppercase font-mono">
            capabilities
          </div>
          <h2 className="text-[36px] sm:text-[44px] font-serif font-normal text-[#1C2431] leading-tight">
            Designed for quiet efficiency.
          </h2>
          <p className="text-[15px] text-[#566170] font-sans leading-relaxed max-w-lg font-normal">
            Zentra runs silently in the background, keeping your inbox clean and your schedule clear without the clutter of traditional dashboards.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Card 1: Conversational control console */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="md:col-span-8 bg-white/72 backdrop-blur-[16px] border border-[rgba(28,36,49,0.08)] rounded-[32px] p-8 sm:p-10 flex flex-col justify-between min-h-[300px] hover:shadow-[0_8px_30px_rgba(28,36,49,0.03)] hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="w-9 h-9 rounded-full bg-[rgba(201,138,84,0.12)] flex items-center justify-center">
                <MessageSquare className="w-4.5 h-4.5 text-[#A85A3A]" />
              </div>
              <h3 className="text-[22px] font-serif font-normal text-[#1C2431]">
                Conversational control console
              </h3>
              <p className="text-[14px] text-[#566170] font-sans leading-relaxed max-w-md font-normal">
                Chat with Zentra about your inbox and schedule. Instruct Zentra to summarize threads, list conflicts, and run operations via natural language.
              </p>
            </div>
            
            <div className="pt-8 border-t border-[rgba(28,36,49,0.08)] flex flex-wrap gap-x-8 gap-y-3 text-[12px] text-[#566170] font-sans">
              <div className="flex items-center gap-1.5">
                <span className="text-[#50684E]">✓</span> Thread summaries
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#50684E]">✓</span> Conflict detection
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#50684E]">✓</span> Contextual drafts
              </div>
            </div>
          </motion.div>

          {/* Card 2: Live inbox assist */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="md:col-span-4 bg-white/72 backdrop-blur-[16px] border border-[rgba(28,36,49,0.08)] rounded-[32px] p-8 flex flex-col justify-between min-h-[300px] hover:shadow-[0_8px_30px_rgba(28,36,49,0.03)] hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="w-9 h-9 rounded-full bg-[rgba(201,138,84,0.12)] flex items-center justify-center">
                <Mail className="w-4.5 h-4.5 text-[#C98A54]" />
              </div>
              <h3 className="text-[22px] font-serif font-normal text-[#1C2431]">
                Live inbox assist
              </h3>
              <p className="text-[14px] text-[#566170] font-sans leading-relaxed font-normal">
                Connects directly to your Gmail account. Real-time thread synthesis, priority sorting, and inline draft composition.
              </p>
            </div>

            <div className="pt-8 border-t border-[rgba(28,36,49,0.08)] flex flex-col gap-2 text-[12px] text-[#566170] font-sans">
              <div className="flex items-center gap-1.5">
                <span className="text-[#5B7B7C]">✓</span> Gmail Integration
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#5B7B7C]">✓</span> Priority Filtering
              </div>
            </div>
          </motion.div>

          {/* Card 3: Smart scheduler */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="md:col-span-4 bg-white/72 backdrop-blur-[16px] border border-[rgba(28,36,49,0.08)] rounded-[32px] p-8 flex flex-col justify-between min-h-[300px] hover:shadow-[0_8px_30px_rgba(28,36,49,0.03)] hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="w-9 h-9 rounded-full bg-[rgba(201,138,84,0.12)] flex items-center justify-center">
                <Calendar className="w-4.5 h-4.5 text-[#C98A54]" />
              </div>
              <h3 className="text-[22px] font-serif font-normal text-[#1C2431]">
                Smart scheduler
              </h3>
              <p className="text-[14px] text-[#566170] font-sans leading-relaxed font-normal">
                Tracks Google Calendar schedules, flags conflicts, and offers quick-block shortcuts for suggested slots.
              </p>
            </div>

            <div className="pt-8 border-t border-[rgba(28,36,49,0.08)] flex flex-col gap-2 text-[12px] text-[#566170] font-sans">
              <div className="flex items-center gap-1.5">
                <span className="text-[#5B7B7C]">✓</span> Calendar Sync
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#5B7B7C]">✓</span> Auto-block Time
              </div>
            </div>
          </motion.div>

          {/* Card 4: Autonomous status sync */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="md:col-span-8 bg-white/72 backdrop-blur-[16px] border border-[rgba(28,36,49,0.08)] rounded-[32px] p-8 sm:p-10 flex flex-col justify-between min-h-[300px] hover:shadow-[0_8px_30px_rgba(28,36,49,0.03)] hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="w-9 h-9 rounded-full bg-[rgba(201,138,84,0.12)] flex items-center justify-center">
                <Sparkles className="w-4.5 h-4.5 text-[#A85A3A]" />
              </div>
              <h3 className="text-[22px] font-serif font-normal text-[#1C2431]">
                Autonomous status sync
              </h3>
              <p className="text-[14px] text-[#566170] font-sans leading-relaxed max-w-md font-normal">
                Connect your core apps once. Zentra acts as a continuous background executor, handling updates, keeping logs clean, and triggering alerts when needed.
              </p>
            </div>

            <div className="pt-8 border-t border-[rgba(28,36,49,0.08)] flex flex-wrap gap-x-8 gap-y-3 text-[12px] text-[#566170] font-sans">
              <div className="flex items-center gap-1.5">
                <span className="text-[#50684E]">✓</span> Background runs
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#50684E]">✓</span> Low-latency sync
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#50684E]">✓</span> Zero training data policy
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default BentoGrid;
