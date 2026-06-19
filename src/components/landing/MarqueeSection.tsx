"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, Calendar, Search, Sparkles, MessageSquare, Zap, Clock, ShieldCheck } from "lucide-react";

export function MarqueeSection() {
  const items = [
    { text: "Gmail Integration", icon: Mail },
    { text: "Google Calendar", icon: Calendar },
    { text: "AI Search Core", icon: Search },
    { text: "Context Engine", icon: Sparkles },
    { text: "Meeting Intelligence", icon: Clock },
    { text: "Workflow Automation", icon: Zap },
    { text: "Priority Indexing", icon: ShieldCheck },
    { text: "Natural Language Queries", icon: MessageSquare },
  ];

  // Duplicate items to ensure a seamless rolling marquee loop
  const duplicatedItems = [...items, ...items, ...items];

  return (
    <section className="relative py-8 bg-[#111827] overflow-hidden select-none border-y border-white/5">
      <div className="flex whitespace-nowrap items-center w-full">
        <motion.div
          animate={{ x: [0, -1200] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 35,
            ease: "linear",
          }}
          className="flex gap-16 items-center"
        >
          {duplicatedItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-center gap-3 text-white/50 hover:text-white/80 transition-colors">
                <Icon className="w-4 h-4 stroke-[2]" />
                <span className="text-[12.5px] uppercase font-mono font-bold tracking-widest">
                  {item.text}
                </span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
