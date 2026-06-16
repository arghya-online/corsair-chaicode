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

  const particles = Array.from({ length: 6 });

  return (
    <section id="about" className="relative py-32 px-6 overflow-hidden select-none text-white border-t border-white/10">
      {/* Fallback Background Color */}
      <div className="absolute inset-0 bg-[#F4EFE7] z-0" />
      {/* Section Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-10"
        style={{ backgroundImage: "url('/bharat_workflow.png')" }}
      />
      <div className="absolute inset-0 bg-black/45 z-20" />

      {/* Gentle Floating Sandstone Mist Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
        {particles.map((_, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={{
              animate: (idx: number) => ({
                x: ['-10%', '110%'],
                y: [`${idx * 15}%`, `${idx * 15 + (idx % 2 === 0 ? 8 : -8)}%`],
                transition: {
                  duration: 40 + idx * 6,
                  repeat: Infinity,
                  ease: "linear",
                  delay: idx * -4,
                }
              })
            }}
            animate="animate"
            className="absolute w-2 h-2 rounded-full bg-[#C98A54]/15"
            style={{
              top: `${i * 15}%`,
              left: `-20px`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-5xl z-40">
        {/* Section Header */}
        <div className="max-w-2xl mb-24 space-y-4">
          <div className="text-[11px] font-medium tracking-widest text-[#F5C77A] uppercase font-mono">
            workflow
          </div>
          <h2 className="text-[36px] sm:text-[44px] font-serif font-normal text-white leading-tight">
            How Zentra works.
          </h2>
          <p className="text-[15px] text-white/90 font-sans leading-relaxed max-w-lg font-normal">
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
              {/* Step Number in Brighter Saffron Gold */}
              <div className="text-[64px] font-serif font-normal text-[#F5C77A] leading-none select-none">
                {step.num}
              </div>

              {/* Title & Description */}
              <div className="space-y-3">
                <h3 className="text-[20px] font-serif font-normal text-white">
                  {step.title}
                </h3>
                <p className="text-[14px] text-white/85 font-sans leading-relaxed font-normal">
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
