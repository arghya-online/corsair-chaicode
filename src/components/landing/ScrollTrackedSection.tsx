"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Search, Mail, Calendar } from "lucide-react";

interface ScrollTrackedSectionProps {
  children: React.ReactNode;
}

// Cubic Bezier curve formula calculations
function getBezierPoint(s: number) {
  // Clamp progress to [0, 1] to keep the orb locked to the path bounds
  const t = Math.max(0, Math.min(1, s));
  
  let p0, p1, p2, p3, u;
  if (t < 0.5) {
    u = t * 2; // Normalize to [0, 1] for first segment
    p0 = { x: 500, y: 200 };
    p1 = { x: 500, y: 600 };
    p2 = { x: 200, y: 800 };
    p3 = { x: 250, y: 1300 };
  } else {
    u = (t - 0.5) * 2; // Normalize to [0, 1] for second segment
    p0 = { x: 250, y: 1300 };
    p1 = { x: 300, y: 1800 };
    p2 = { x: 800, y: 1900 };
    p3 = { x: 750, y: 2500 };
  }
  
  const mt = 1 - u;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;
  const u2 = u * u;
  const u3 = u2 * u;
  
  const x = mt3 * p0.x + 3 * mt2 * u * p1.x + 3 * mt * u2 * p2.x + u3 * p3.x;
  const y = mt3 * p0.y + 3 * mt2 * u * p1.y + 3 * mt * u2 * p2.y + u3 * p3.y;
  
  return { x, y };
}

export function ScrollTrackedSection({ children }: ScrollTrackedSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track the scroll progress of the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Highly responsive, damped spring animation to keep the tracer smooth and organic
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 24,
    mass: 0.15,
    stiffness: 70,
  });

  // Map container scroll to active tracing interval [0.12, 0.78]
  const pathProgress = useTransform(smoothProgress, [0.12, 0.78], [0, 1]);

  // Translate curve viewBox coordinates (1000x3000) to percentage locations
  const posX = useTransform(pathProgress, (s) => `${(getBezierPoint(s).x / 1000) * 100}%`);
  const posY = useTransform(pathProgress, (s) => `${(getBezierPoint(s).y / 3000) * 100}%`);

  // Dynamically fade the floating tracer orb in/out at container thresholds
  const orbOpacity = useTransform(smoothProgress, [0.08, 0.15, 0.78, 0.88], [0, 1, 1, 0]);

  // Cross-fade the icons relative to path progress [0 -> 1]
  const searchOpacity = useTransform(pathProgress, [0, 0.25, 0.35], [1, 1, 0]);
  const mailOpacity = useTransform(pathProgress, [0.25, 0.38, 0.62, 0.72], [0, 1, 1, 0]);
  const calendarOpacity = useTransform(pathProgress, [0.62, 0.72, 1], [0, 1, 1]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden bg-gradient-to-b from-[#F9F6F0] via-[#FCF9F3] to-[#F9F6F0] w-full"
    >
      {/* ── Rich Warm Gradient Mesh ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#CB7E3E]/10 blur-[130px] opacity-75" />
        <div className="absolute top-[35%] right-[-10%] w-[850px] h-[850px] rounded-full bg-[#CB7E3E]/7 blur-[150px] opacity-85" />
        <div className="absolute top-[60%] left-[5%] w-[750px] h-[750px] rounded-full bg-[#5A6D56]/9 blur-[140px] opacity-60" />
        <div className="absolute bottom-[10%] right-[5%] w-[650px] h-[650px] rounded-full bg-[#CB7E3E]/9 blur-[120px] opacity-75" />
      </div>

      {/* ── Barely Visible Indian Geometric Jaali Lattice (3.5% Opacity) ── */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] select-none z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="scroll-jaali" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 30,0 L 60,30 L 30,60 L 0,30 Z M 0,0 L 30,30 L 0,60 M 60,0 L 30,30 L 60,60" stroke="#CB7E3E" strokeWidth="1" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#scroll-jaali)" />
        </svg>
      </div>

      {/* ── Subtle Warm Paper Noise overlay ── */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.018] bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')] z-0" />

      {/* ── SVG Tracking Path ── */}
      <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none z-10 hidden lg:block select-none">
        <svg
          className="w-full h-full"
          viewBox="0 0 1000 3000"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Defs for gradients & filters */}
          <defs>
            <linearGradient id="trace-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C1783F" stopOpacity="0.05" />
              <stop offset="50%" stopColor="#5A6D56" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#C1783F" stopOpacity="0.6" />
            </linearGradient>

            <linearGradient id="glow-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C1783F" />
              <stop offset="100%" stopColor="#5A6D56" />
            </linearGradient>

            <filter id="glow-effect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>



          {/* Animated Glowing Path Segment (Draws with Scroll) */}
          <motion.path
            d="M 500,200 C 500,600 200,800 250,1300 C 300,1800 800,1900 750,2500"
            stroke="url(#glow-gradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            style={{ pathLength: pathProgress }}
          />
        </svg>
      </div>

      {/* ── Floating Tracer Orb (Glices Down SVG Curve with Scroll) ── */}
      <motion.div
        style={{
          left: posX,
          top: posY,
          opacity: orbOpacity,
          x: "-50%",
          y: "-50%",
        }}
        className="absolute z-20 pointer-events-none hidden lg:flex items-center justify-center bg-white border-2 border-[#C1783F]/35 shadow-[0_10px_25px_rgba(193,120,63,0.18)] rounded-full w-14 h-14 text-[#C1783F] select-none"
      >
        {/* Glow Ring Behind */}
        <div className="absolute inset-0 rounded-full animate-ping bg-[#C1783F]/10 opacity-30 pointer-events-none" />

        {/* Cross-fading icons inside the orb */}
        <div className="relative w-6 h-6 flex items-center justify-center">
          {/* Search Icon */}
          <motion.div
            style={{ opacity: searchOpacity }}
            className="absolute inset-0 flex items-center justify-center text-[#C1783F]"
          >
            <Search className="w-5 h-5" />
          </motion.div>

          {/* Mail Icon */}
          <motion.div
            style={{ opacity: mailOpacity }}
            className="absolute inset-0 flex items-center justify-center text-[#5A6D56]"
          >
            <Mail className="w-5 h-5" />
          </motion.div>

          {/* Calendar Icon */}
          <motion.div
            style={{ opacity: calendarOpacity }}
            className="absolute inset-0 flex items-center justify-center text-[#C1783F]"
          >
            <Calendar className="w-5 h-5" />
          </motion.div>
        </div>
      </motion.div>

      {children}
    </div>
  );
}

export default ScrollTrackedSection;
