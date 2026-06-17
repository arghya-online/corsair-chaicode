"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Zap, Sparkles, HelpCircle } from "lucide-react";
import { Nav } from "@/src/components/landing/Nav";
import { Footer } from "@/src/components/landing/Footer";

interface PricingClientProps {
  user: any;
}

export function PricingClient({ user }: PricingClientProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const plans = [
    {
      name: "Free",
      priceMonthly: 0,
      priceYearly: 0,
      badge: "Outcome Basis",
      desc: "For builders organizing personal projects.",
      cta: "Start Free",
      ctaHref: "/register",
      popular: false,
      features: [
        "Up to 3 integrations linked",
        "50 AI pilot actions / month",
        "Standard database tasks list",
        "Community forum support"
      ]
    },
    {
      name: "Pro",
      priceMonthly: 24,
      priceYearly: 19,
      badge: "Most Popular",
      desc: "For professionals who move fast.",
      cta: "Get Started Now",
      ctaHref: "/register",
      popular: true,
      features: [
        "Unlimited active integrations",
        "Unlimited AI actions & drafting",
        "Priority processing (0.2s latency)",
        "Automated inbox briefing summaries",
        "Custom workspace prompt control",
        "Priority email co-pilot support"
      ]
    },
    {
      name: "Team",
      priceMonthly: 79,
      priceYearly: 64,
      badge: "Collaborative Context",
      desc: "For small teams operating synchronously.",
      cta: "Contact Sales",
      ctaHref: "/register",
      popular: false,
      features: [
        "Everything included in Pro",
        "Shared organizational AI context",
        "Custom API access integrations",
        "Audit logs & compliance trials",
        "Dedicated account manager",
        "99.9% guaranteed uptime SLA"
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-[#F7F3EC] text-[#111827] flex flex-col font-sans selection:bg-[#C67B3D] selection:text-white relative overflow-hidden">

      {/* ── 1. Barely Visible Indian Geometric Jaali Pattern (3% Opacity) ── */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="jaali-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 30,0 L 60,30 L 30,60 L 0,30 Z M 0,0 L 30,30 L 0,60 M 60,0 L 30,30 L 60,60" stroke="#C67B3D" strokeWidth="1" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#jaali-grid)" />
        </svg>
      </div>

      {/* ── 2. Giant Blurred Amber Radial Gradients (Atmosphere) ── */}
      <div className="absolute top-[12%] left-[10%] w-[600px] h-[600px] rounded-full bg-[#C67B3D]/8 blur-[130px] pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0" />
      <div className="absolute top-[45%] right-[5%] w-[700px] h-[700px] rounded-full bg-[#D9A15B]/6 blur-[150px] pointer-events-none translate-x-1/3 z-0" />
      <div className="absolute bottom-[10%] left-[15%] w-[500px] h-[500px] rounded-full bg-[#C67B3D]/5 blur-[120px] pointer-events-none z-0" />

      {/* ── 3. Subtle Floating Ambient Particles ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 hidden lg:block">
        {[
          { left: "12%", top: "25%", delay: 0, size: 4 },
          { left: "85%", top: "18%", delay: 3, size: 3 },
          { left: "20%", top: "65%", delay: 1.5, size: 5 },
          { left: "78%", top: "72%", delay: 4, size: 4 },
          { left: "45%", top: "85%", delay: 2, size: 3 }
        ].map((particle, idx) => (
          <motion.div
            key={idx}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 6 + idx,
              repeat: Infinity,
              ease: "easeInOut",
              delay: particle.delay,
            }}
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
            }}
            className="absolute rounded-full bg-[#C67B3D]/25"
          />
        ))}
      </div>

      <Nav user={user} />

      {/* ── Pricing Hero Section ── */}
      <section className="flex-1 flex flex-col items-center py-20 px-6 max-w-6xl mx-auto w-full z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/60 border border-[rgba(198,123,61,0.1)] shadow-xs">
            <Sparkles className="w-3 h-3 text-[#C67B3D]" />
            <span className="text-[10px] font-bold text-[#64748B] tracking-wider uppercase">Simple pricing</span>
          </div>

          {/* Header text from spec */}
          <h1 className="font-serif text-[42px] sm:text-[56px] font-normal leading-tight tracking-tight text-[#111827]">
            One workspace. One price.
          </h1>
          <p className="text-[14px] sm:text-[15px] text-[#64748B] max-w-lg mx-auto leading-relaxed">
            Everything you need to manage email, calendar, and AI assistance in one place.
          </p>

          {/* Monthly / Yearly Billing Cycle Toggle */}
          <div className="pt-4 flex items-center justify-center">
            <div className="relative flex items-center bg-white/50 border border-[rgba(198,123,61,0.12)] p-1 rounded-xl shadow-xs">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`relative px-4 py-1.5 rounded-lg text-[12px] font-semibold transition-all cursor-pointer ${billingCycle === "monthly" ? "bg-[#111827] text-white shadow-sm" : "text-[#64748B] hover:text-[#111827]"
                  }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`relative px-4 py-1.5 rounded-lg text-[12px] font-semibold transition-all cursor-pointer ${billingCycle === "yearly" ? "bg-[#111827] text-white shadow-sm" : "text-[#64748B] hover:text-[#111827]"
                  }`}
              >
                Yearly
                <span className="absolute -top-3.5 -right-3 px-1.5 py-0.5 rounded-md bg-[#5A6D56] text-[8px] font-bold text-white uppercase tracking-wider scale-90">
                  -20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Pricing Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch w-full max-w-5xl px-4">
          {plans.map((plan) => {
            const isPro = plan.popular;
            const price = billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly;

            return (
              <motion.div
                key={plan.name}
                whileHover={{
                  y: -8,
                  boxShadow: "0 30px 60px rgba(0,0,0,0.08), 0 10px 30px rgba(198,123,61,0.12)"
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{
                  background: "rgba(255,255,255,0.75)",
                  backdropFilter: "blur(20px)",
                  border: isPro ? "1.5px solid rgba(198,123,61,0.3)" : "1px solid rgba(198,123,61,0.15)",
                }}
                className={`relative rounded-[28px] p-9 sm:p-10 flex flex-col justify-between transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.05),0_5px_20px_rgba(198,123,61,0.08)] ${isPro ? "md:scale-[1.03] z-10" : "z-0"
                  }`}
              >
                {/* Gold Glow for Pro Card */}
                {isPro && (
                  <div className="absolute inset-0 -m-[1px] rounded-[28px] border-2 border-transparent bg-gradient-to-br from-[#D9A15B] to-[#C67B3D] opacity-10 pointer-events-none" />
                )}

                {/* Popular Glow Badge */}
                {isPro && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#C67B3D] to-[#D9A15B] shadow-[0_4px_12px_rgba(198,123,61,0.25)]">
                    <Zap className="w-2.5 h-2.5 text-white" />
                    <span className="text-[9.5px] font-bold uppercase tracking-widest text-white">Most Popular</span>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#64748B]">
                      {plan.name}
                    </span>

                    {/* Price with slide animation */}
                    <div className="mt-3 flex items-baseline gap-1 font-serif text-[48px] font-normal leading-none text-[#111827]">
                      <span>$</span>
                      <motion.span
                        key={price}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        {price}
                      </motion.span>
                      <span className="text-[12px] font-sans font-medium text-[#64748B] tracking-normal ml-0.5">
                        /mo
                      </span>
                    </div>

                    <p className="mt-3 text-[12px] text-[#64748B] leading-relaxed">
                      {plan.desc}
                    </p>
                  </div>

                  <div className="h-px bg-[rgba(198,123,61,0.12)]" />

                  {/* Features List */}
                  <ul className="space-y-3.5 text-[13px] leading-tight text-[#111827] text-left">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className={`mt-0.5 w-4.5 h-4.5 rounded-full flex items-center justify-center flex-shrink-0 ${isPro ? "bg-[#C67B3D]/10 text-[#C67B3D]" : "bg-[rgba(198,123,61,0.06)] text-[#64748B]"
                          }`}>
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Compact CTA Buttons */}
                <Link
                  href={plan.ctaHref}
                  style={{
                    backgroundColor: isPro ? "#C67B3D" : "rgba(255,255,255,0.9)",
                    borderColor: isPro ? "transparent" : "rgba(198,123,61,0.2)"
                  }}
                  className={`mt-10 block w-full rounded-xl border py-3.5 text-[13px] font-bold text-center transition-all cursor-pointer ${isPro
                      ? "hover:bg-[#b0672e] text-white shadow-[0_4px_14px_rgba(198,123,61,0.25)] active:scale-[0.98]"
                      : "hover:bg-white text-[#111827] active:scale-[0.98] shadow-xs"
                    }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="border-t border-[rgba(198,123,61,0.1)] py-20 px-6 max-w-4xl mx-auto w-full z-10">
        <h3 className="font-serif text-[24px] font-normal text-center mb-10 text-[#111827]">Frequently Asked Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {[
            { q: "Can I cancel my plan at any time?", a: "Yes. Zentra operates outcome-based schedules. If you cancel, your access continues until the end of your billing cycle." },
            { q: "What counts as an AI Action?", a: "An AI action includes inbox classification, drafting contextual replies, or resolving meeting calendar conflicts autonomously." },
            { q: "Do you offer custom integrations?", a: "Yes. Enterprise/Team plans support custom API integrations with other private services through our developer SDK." },
            { q: "Is my email secure with Zentra?", a: "100%. Zentra sits behind Corsair OAuth verification. We never store credentials or share your training context." }
          ].map((faq, idx) => (
            <div key={idx} className="space-y-2 p-5 rounded-2xl bg-white/40 border border-[rgba(198,123,61,0.08)] backdrop-blur-xs">
              <span className="text-[13.5px] font-bold text-[#111827] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#C67B3D]" />
                {faq.q}
              </span>
              <p className="text-[12.5px] text-[#64748B] leading-relaxed pl-6">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default PricingClient;
