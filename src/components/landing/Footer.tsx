"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  // Social link definitions with custom color glows and tooltips
  const socials = [
    {
      name: "GitHub",
      href: "https://github.com/zentra",
      glowColor: "rgba(17, 24, 39, 0.15)",
      renderIcon: () => (
        <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com",
      glowColor: "rgba(10, 102, 194, 0.15)",
      renderIcon: () => (
        <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
    },
    {
      name: "X",
      href: "https://twitter.com/zentra_ai",
      glowColor: "rgba(17, 24, 39, 0.15)",
      renderIcon: () => (
        <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-current" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "Product Hunt",
      href: "https://www.producthunt.com",
      glowColor: "rgba(218, 85, 47, 0.2)",
      renderIcon: () => (
        <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-current" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1.008 11.579H10.14v2.793H8.384V7.636h4.632c1.782 0 2.684.843 2.684 2.182 0 1.353-.889 2.174-2.692 2.174zm-.008-3.036H10.14v1.518h2.008c.594 0 .914-.301.914-.766 0-.465-.32-.752-.914-.752z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="relative w-full overflow-hidden select-none bg-[#F7F3EC] border-t border-[rgba(17,24,39,0.06)] text-[#111827] font-sans">

      {/* ── 1. Subtle Warm Radial Gradient Atmosphere ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Soft amber lights */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[#C67B3D]/5 blur-[120px] opacity-70" />
        <div className="absolute bottom-0 right-[10%] w-[500px] h-[300px] rounded-full bg-[#D9A15B]/4 blur-[100px]" />
      </div>

      {/* ── 2. Indian Geometric Jaali Pattern (2% Opacity) ── */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="footer-jaali" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 30,0 L 60,30 L 30,60 L 0,30 Z M 0,0 L 30,30 L 0,60 M 60,0 L 30,30 L 60,60" stroke="#C67B3D" strokeWidth="1" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-jaali)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 sm:px-8 md:px-12 z-10">

        {/* ── 3. TOP CTA AREA (Centered, Spaced Luxuriously) ── */}
        <div className="pt-[120px] pb-16 flex flex-col items-center text-center">

          {/* Centered Small Label */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/60 border border-[rgba(198,123,61,0.12)] shadow-xs mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C67B3D]" />
            <span className="text-[10px] font-bold text-[#64748B] tracking-[0.2em] uppercase">ZENTRA AI</span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[44px] sm:text-[54px] font-serif font-normal text-[#111827] leading-[1.1] tracking-tight max-w-2xl mb-5"
          >
            Focus on work. Not your inbox.
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[15px] sm:text-[16px] text-[#64748B] leading-relaxed max-w-2xl mb-9 font-normal px-4"
          >
            Zentra quietly organizes email, schedules meetings, drafts replies, and surfaces what matters so you can spend more time doing meaningful work.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center"
          >
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-xl bg-[#111827] hover:bg-[#C67B3D] text-[14px] font-bold text-white transition-all active:scale-[0.98] shadow-md px-9 h-13 cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(17,24,39,0.15)]"
            >
              Open Dashboard
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-xl bg-white hover:bg-[#F7F3EC] border border-[rgba(198,123,61,0.2)] text-[14px] font-bold text-[#111827] transition-all active:scale-[0.98] shadow-xs px-9 h-13 cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(198,123,61,0.06)]"
            >
              Get Started Free
            </Link>
          </motion.div>
        </div>

        {/* Large Divider */}
        <div className="w-full h-px bg-[rgba(17,24,39,0.08)] mb-20" />

        {/* ── 4. FOUR-COLUMN SITE GRID (12 Columns) ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-x-8 pb-16">

          {/* Column 1: Brand (Span 4) */}
          <div className="md:col-span-4 space-y-6 text-left">
            <Link href="/" className="font-serif text-[24px] text-[#111827] font-semibold tracking-[-0.02em] hover:opacity-80 transition-opacity">
              Zentra
            </Link>
            <p className="text-[14px] text-[#64748B] leading-relaxed max-w-sm">
              The calm workspace for Gmail, Google Calendar, and AI-powered productivity.
            </p>

            {/* Feature Chips */}
            <div className="flex flex-wrap gap-2 pt-2">
              {["Gmail Integration", "Calendar Sync", "AI Search", "Smart Drafts"].map((chip) => (
                <span
                  key={chip}
                  className="px-2.5 py-1 text-[11px] font-medium text-[#C67B3D] bg-[#C67B3D]/6 border border-[#C67B3D]/12 rounded-lg"
                >
                  {chip}
                </span>
              ))}
            </div>

            {/* Contact Info */}
            <div className="space-y-1 pt-2 text-[13.5px] text-[#64748B]">
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-[#111827]">Email:</span>
                <a href="mailto:arghyamajumdar.contact555@gmail.com" className="hover:text-[#C67B3D] hover:underline underline-offset-4 transition-colors">
                  arghyamajumdar.contact555@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-[#111827]">Support:</span>
                <a href="mailto:arghyamajumdar.contact555@gmail.com" className="hover:text-[#C67B3D] hover:underline underline-offset-4 transition-colors">
                  arghyamajumdar.contact555@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Product (Span 2 / offset-1) */}
          <div className="md:col-span-2 md:col-start-6 space-y-4 text-left">
            <h4 className="text-[12px] font-bold text-[#111827] uppercase tracking-[0.15em]">Product</h4>
            <ul className="space-y-3 text-[14px]">
              {[
                { name: "Features", href: "/features" },
                { name: "AI Assistant", href: "/features#assistant" },
                { name: "Smart Drafting", href: "/features#drafting" },
                { name: "Inbox Search", href: "/features#search" },
                { name: "Calendar Coordination", href: "/features#calendar" },
                { name: "Integrations", href: "/features#integrations" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="inline-block text-[#64748B] hover:text-[#C67B3D] transition-all duration-300 hover:translate-x-0.5 hover:underline underline-offset-4"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources (Span 2) */}
          <div className="md:col-span-2 md:col-start-9 space-y-4 text-left">
            <h4 className="text-[12px] font-bold text-[#111827] uppercase tracking-[0.15em]">Resources</h4>
            <ul className="space-y-3 text-[14px]">
              {[
                { name: "Documentation", href: "/docs" },
                { name: "API Reference", href: "/docs#api" },
                { name: "Changelog", href: "/changelog" },
                { name: "Status", href: "/status" },
                { name: "Privacy", href: "/privacy" },
                { name: "Terms", href: "/terms" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="inline-block text-[#64748B] hover:text-[#C67B3D] transition-all duration-300 hover:translate-x-0.5 hover:underline underline-offset-4"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Company (Span 2) */}
          <div className="md:col-span-2 md:col-start-11 space-y-4 text-left">
            <h4 className="text-[12px] font-bold text-[#111827] uppercase tracking-[0.15em]">Company</h4>
            <ul className="space-y-3 text-[14px]">
              {[
                { name: "About", href: "/about" },
                { name: "Contact", href: "/contact" },
                { name: "Careers", href: "/careers" },
                { name: "Roadmap", href: "/roadmap" },
                { name: "Blog", href: "/blog" },
                { name: "Feedback", href: "/feedback" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="inline-block text-[#64748B] hover:text-[#C67B3D] transition-all duration-300 hover:translate-x-0.5 hover:underline underline-offset-4"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[rgba(17,24,39,0.06)]" />

        {/* ── 5. SOCIAL LINKS ROW ── */}
        <div className="py-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-[13px] text-[#64748B]">
            Follow our journey towards a calmer workspace.
          </div>

          <div className="flex gap-4">
            {socials.map((social) => {
              return (
                <div key={social.name} className="group relative">
                  {/* Custom Tooltip */}
                  <span className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 bg-[#111827] text-white text-[10px] font-bold px-2 py-1 rounded shadow-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                    {social.name}
                  </span>

                  <motion.a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    style={{
                      boxShadow: `0 0 0 transparent`,
                    }}
                    className="w-10 h-10 rounded-xl bg-white border border-[rgba(17,24,39,0.08)] flex items-center justify-center text-[#5F6B7A] hover:text-[#C67B3D] hover:border-[#C67B3D]/30 transition-all duration-300 shadow-sm relative overflow-hidden"
                  >
                    {/* Hover Glow */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `radial-gradient(circle, ${social.glowColor} 0%, transparent 80%)`,
                      }}
                    />

                    <span className="relative z-10 flex items-center justify-center">
                      {social.renderIcon()}
                    </span>
                  </motion.a>
                </div>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[rgba(17,24,39,0.06)]" />

        {/* ── 6. BOTTOM BAR (Luxurious whitespace & alignment) ── */}
        <div className="pt-8 pb-[80px] flex flex-col sm:flex-row justify-between items-center gap-6 text-[13.5px] text-[#64748B]">

          {/* Left copyright */}
          <div>
            &copy; {currentYear} Zentra. All rights reserved.
          </div>

          {/* Center brand statement */}
          <div className="font-serif italic text-[15.5px] text-[#111827]">
            Built for calm, focused work.
          </div>

          {/* Right version & operational status */}
          <div className="flex items-center gap-5">
            <span>v1.0.0</span>

            {/* Pulsing Status Dot */}
            <div className="flex items-center gap-1.5 bg-[#5A6D56]/8 border border-[#5A6D56]/20 px-2.5 py-1 rounded-full text-[11px] font-semibold text-[#5A6D56]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6D8A68] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#6D8A68]"></span>
              </span>
              <span>Status: Operational</span>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
}

export default Footer;
