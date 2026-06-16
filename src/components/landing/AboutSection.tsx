"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

export function AboutSection() {
  const stepVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        type: "spring",
        stiffness: 80,
        damping: 15,
      },
    }),
  };

  const steps = [
    {
      num: "01",
      title: "Connect securely",
      desc: "Link your Gmail and Google Calendar in a single click. Zentra integrates natively through secure OAuth, isolated safely on your local device.",
    },
    {
      num: "02",
      title: "Converse naturally",
      desc: "Ask questions or delegate tasks using natural language. Zentra reads inbox contexts, spots schedule conflicts, and drafts messages instantly.",
    },
    {
      num: "03",
      title: "Automate silently",
      desc: "Let Zentra manage repetitive chores. Our engine runs continuously in the background, preparing priority drafts and scheduling buffers.",
    },
  ];

  return (
    <section id="about" className="py-32 px-6 bg-[#F4EFE7] text-[#1C2431] border-t border-[rgba(28,36,49,0.05)]">
      <div className="mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="max-w-2xl mb-24 space-y-4">
          <div className="text-[11px] font-medium tracking-widest text-[#C98A54] uppercase font-mono">
            workflow
          </div>
          <h2 className="text-[36px] sm:text-[44px] font-serif font-normal text-[#1C2431] leading-tight">
            How Zentra works.
          </h2>
          <p className="text-[15px] text-[#566170] font-sans leading-relaxed max-w-lg font-normal">
            Three simple steps to transition your inbox from a source of constant noise into a calm, beautifully structured assistant workspace.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={stepVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-6 flex flex-col items-start"
            >
              {/* Step Number in Saffron Gold */}
              <div className="text-[64px] font-serif font-normal text-[#D7A23B] leading-none select-none">
                {step.num}
              </div>
              
              {/* Title & Description */}
              <div className="space-y-3">
                <h3 className="text-[20px] font-serif font-normal text-[#1C2431]">
                  {step.title}
                </h3>
                <p className="text-[14px] text-[#566170] font-sans leading-relaxed font-normal">
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

export default AboutSection;
