"use client";

import React from "react";
import { motion } from "framer-motion";

export function WorkflowSection() {
  const steps = [
    {
      num: "01",
      title: "Connect",
      desc: "Securely connect Gmail and Calendar.",
    },
    {
      num: "02",
      title: "Understand",
      desc: "Build context from conversations and commitments.",
    },
    {
      num: "03",
      title: "Organize",
      desc: "Surface priorities and prepare actions automatically.",
    },
  ];

  return (
    <section id="workflow" className="relative py-36 px-4 sm:px-6 md:px-8 overflow-hidden select-none bg-[#111827]">
      {/* Immersive Background Image (banyan_workflow.png) */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 opacity-40"
        style={{ backgroundImage: "url('/banyan_workflow.png')" }}
      />
      
      {/* Dark tint overlay for visual contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black/75 z-0" />

      {/* Large Glass Panel Container */}
      <div className="relative mx-auto max-w-5xl z-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[36px] p-8 sm:p-12 md:p-16 shadow-[0_24px_80px_rgba(0,0,0,0.3)]">
        
        {/* Headings */}
        <div className="text-center space-y-4 mb-16 max-w-3xl mx-auto">
          <div className="text-[13px] font-semibold tracking-[0.2em] text-[#C1783F] uppercase">
            WORKFLOW
          </div>
          <h2 className="text-[38px] sm:text-[50px] font-serif font-normal text-white leading-[1.15] tracking-tight">
            Like having a chief of staff.
          </h2>
          <p className="text-[18px] md:text-[20px] leading-relaxed text-white/80 font-sans font-light max-w-2xl mx-auto pt-2">
            Zentra understands context across conversations and schedules, helping work move forward before it becomes a distraction.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.15, duration: 0.8 }}
              className="flex flex-col text-left space-y-4 border-t border-white/10 pt-6"
            >
              {/* Elegant Accent Number */}
              <div className="text-[44px] font-serif font-normal text-[#C1783F] leading-none select-none">
                {step.num}
              </div>
              
              {/* Step Title & Description */}
              <div className="space-y-2">
                <h3 className="text-[20px] font-serif font-normal text-white">
                  {step.title}
                </h3>
                <p className="text-[16px] text-white/70 font-sans leading-relaxed font-normal">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default WorkflowSection;
