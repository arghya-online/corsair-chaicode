"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Mail, Calendar, Sparkles, MessageSquare, ArrowRight } from "lucide-react";

export function SVGJourneySection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll tracking to animate moving dot/particles along the journey path
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const pathLength = useSpring(scrollYProgress, {
    damping: 20,
    stiffness: 80,
  });

  const steps = [
    {
      icon: Mail,
      title: "1. Connect Gmail",
      desc: "Zentra establishes a secure read-only context of your conversations, commitments, and threads.",
      color: "text-[#EA4335]",
      bg: "bg-red-50",
      delay: 0,
    },
    {
      icon: Calendar,
      title: "2. Connect Calendar",
      desc: "Import meeting details, events, and scheduling windows to map context against time.",
      color: "text-[#F97316]",
      bg: "bg-orange-50",
      delay: 0.1,
    },
    {
      icon: Sparkles,
      title: "3. AI Builds Context",
      desc: "Zentra automatically analyzes threads, extracts commitments, alerts conflicts, and structures indexes.",
      color: "text-[#CB7E3E]",
      bg: "bg-[#F7F2EA]",
      delay: 0.2,
    },
    {
      icon: MessageSquare,
      title: "4. Ask & Take Action",
      desc: "Query commitments in plain English. Draft smart context replies and resolve calendar overlays instantly.",
      color: "text-[#1E293B]",
      bg: "bg-slate-100",
      delay: 0.3,
    },
  ];

  return (
    <section
      ref={containerRef}
      className="relative py-28 bg-[#F7F3EC] select-none overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6 relative z-10 space-y-16">
        {/* Title */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[11px] font-bold text-[#C67B3D] tracking-[0.2em] uppercase block">
            INTELLIGENT PIPELINE
          </span>
          <h2 className="text-[34px] sm:text-[42px] font-serif font-normal text-[#111827] leading-tight">
            How your workspace connects
          </h2>
          <p className="text-[14px] text-[#64748B] font-sans">
            A real-time, encrypted flow uniting your communications and commitments.
          </p>
        </div>

        {/* Dynamic SVG Journey Map & Cards */}
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8 pt-8">
          {/* Background Dotted SVG Path running horizontally (visible on MD/LG screens) */}
          <div className="absolute inset-x-0 top-16 h-1 hidden md:block pointer-events-none select-none z-0">
            <svg className="w-full h-12 overflow-visible" fill="none">
              {/* Core Route Path */}
              <path
                id="journey-route-path"
                d="M 50,20 Q 250,-10 450,20 T 850,20"
                stroke="rgba(198, 123, 61, 0.12)"
                strokeWidth="3.5"
                strokeDasharray="6 6"
              />
              {/* Dynamic scroll indicator particle */}
              <motion.path
                d="M 50,20 Q 250,-10 450,20 T 850,20"
                stroke="#C67B3D"
                strokeWidth="4"
                strokeLinecap="round"
                style={{ pathLength }}
              />
            </svg>
          </div>

          {/* Steps Map */}
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: step.delay }}
                whileHover={{ y: -4 }}
                className="bg-white/60 backdrop-blur-xs border border-[rgba(17,24,39,0.06)] rounded-[24px] p-6 shadow-xs flex flex-col items-start gap-4 relative z-10 transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.02)]"
              >
                {/* Node icon marker */}
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center ${step.bg}`}
                >
                  <Icon className={`w-5 h-5 ${step.color}`} />
                </div>

                <div className="space-y-1.5 text-left">
                  <h3 className="font-sans text-[15px] font-bold text-[#111827]">
                    {step.title}
                  </h3>
                  <p className="font-sans text-[12.5px] text-[#64748B] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
