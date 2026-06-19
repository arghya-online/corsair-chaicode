"use client";

import React from "react";
import { motion } from "framer-motion";

export function TestimonialsSection() {
  const reviews = [
    {
      quote: "Zentra completely changed how I prepare for my day. I no longer dig through five email threads before a client sync. It just builds the briefing note for me automatically.",
      author: "Vikram Malhotra",
      role: "Lead Architect, Courtyard Studio",
    },
    {
      quote: "The calendar intelligence is like magic. It found a deadline promise I made in a thread three days ago and warned me to block off time before the calendar slot arrived.",
      author: "Sarah Chen",
      role: "Operations Chief, Vanguard Projects",
    },
    {
      quote: "I've tried every AI email assistant out there. Most are just wrappers writing robotic templates. Zentra is different — it actually understands the context of commitments.",
      author: "Marcus Webb",
      role: "Managing Partner, Webb & Co.",
    },
  ];

  return (
    <section className="relative py-28 bg-white select-none overflow-hidden border-t border-[rgba(17,24,39,0.03)]">
      <div className="max-w-6xl mx-auto px-6 space-y-16">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[11px] font-bold text-[#C67B3D] tracking-[0.2em] uppercase block">
            SOCIAL PROOF
          </span>
          <h2 className="text-[34px] sm:text-[42px] font-serif font-normal text-[#111827] leading-tight">
            Designed for focused professionals
          </h2>
          <p className="text-[14px] text-[#64748B]">
            See how Zentra is bringing quiet efficiency back to daily schedules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <motion.div
              key={rev.author}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ y: -3 }}
              className="bg-[#FAFAFA] border border-[rgba(17,24,39,0.05)] rounded-[24px] p-8 shadow-xs flex flex-col justify-between text-left transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.02)] hover:border-[#C67B3D]/30"
            >
              <p className="font-serif italic text-[14.5px] text-[#111827] leading-relaxed">
                "{rev.quote}"
              </p>
              <div className="pt-6 border-t border-[rgba(17,24,39,0.05)] mt-6 font-sans">
                <span className="text-[13px] font-bold text-[#111827] block">
                  {rev.author}
                </span>
                <span className="text-[11px] text-[#64748B]">
                  {rev.role}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
