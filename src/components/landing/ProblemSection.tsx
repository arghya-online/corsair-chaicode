"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, Calendar, MessageSquare, AlertCircle, FileText, CheckCircle2 } from "lucide-react";

export function ProblemSection() {
  const floatingPills = [
    { text: "Urgent Thread", icon: Mail, x: -160, y: -80, delay: 0.1 },
    { text: "Event Conflict", icon: Calendar, x: 180, y: -70, delay: 0.2 },
    { text: "Commitment Alert", icon: AlertCircle, x: -190, y: 50, delay: 0.3 },
    { text: "Meeting Invite", icon: MessageSquare, x: 160, y: 70, delay: 0.4 },
    { text: "Action Item", icon: FileText, x: 20, y: -130, delay: 0.5 },
  ];

  return (
    <section className="relative py-28 bg-gradient-to-b from-[#F7F3EC] to-white select-none overflow-hidden border-t border-[rgba(17,24,39,0.03)]">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Editorial Left Side */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <span className="text-[11px] font-bold text-[#C67B3D] tracking-[0.2em] uppercase block">
            THE PROBLEM
          </span>
          <h2 className="text-[36px] sm:text-[46px] font-serif font-normal text-[#111827] tracking-tight leading-tight">
            Work is scattered.
          </h2>
          <div className="space-y-4 text-[14.5px] text-[#64748B] font-sans leading-relaxed">
            <p>
              Important decisions live in email. Deadlines live in calendars. Context lives across conversations.
            </p>
            <p>
              Every day is spent searching back and forth between messages, drafts, and calendar tabs just to figure out what was agreed on.
            </p>
            <p className="font-semibold text-[#111827]">
              Zentra brings everything together into one intelligent workspace.
            </p>
          </div>
        </div>

        {/* Animated Merge Visual Right Side */}
        <div className="lg:col-span-6 flex items-center justify-center relative min-h-[380px]">
          {/* Glowing central hub */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0.8 }}
            animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.9, 1, 0.9] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="w-48 h-48 rounded-[36px] bg-gradient-to-tr from-[#C67B3D]/10 to-[#F4622A]/10 border border-[#C67B3D]/20 shadow-[0_20px_50px_rgba(198,123,97,0.08)] flex flex-col items-center justify-center relative z-20"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F4622A] to-[#FF8C5A] flex items-center justify-center shadow-[0_4px_16px_rgba(244,98,42,0.25)] mb-3">
              <span className="text-white text-xl font-bold font-display">Z</span>
            </div>
            <span className="text-[12px] font-bold uppercase tracking-widest text-[#111827] font-mono">
              Unified Context
            </span>
          </motion.div>

          {/* Fragmented pills floating and drifting in */}
          {floatingPills.map((pill) => {
            const Icon = pill.icon;
            return (
              <motion.div
                key={pill.text}
                initial={{ x: pill.x * 1.3, y: pill.y * 1.3, opacity: 0 }}
                whileInView={{
                  x: pill.x,
                  y: pill.y,
                  opacity: 1,
                  transition: { duration: 1.2, delay: pill.delay, ease: "easeOut" },
                }}
                animate={{
                  y: [pill.y, pill.y - 6, pill.y],
                  transition: {
                    repeat: Infinity,
                    duration: 3 + pill.delay * 5,
                    ease: "easeInOut",
                  },
                }}
                viewport={{ once: true }}
                className="absolute bg-white/70 backdrop-blur-xs border border-[rgba(17,24,39,0.08)] p-2.5 px-4 rounded-xl flex items-center gap-2 shadow-xs cursor-default select-none hover:border-[#C67B3D]/40 transition-colors"
              >
                <Icon className="w-4 h-4 text-[#C67B3D]" />
                <span className="text-[11px] font-bold text-[#111827] font-sans">
                  {pill.text}
                </span>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
