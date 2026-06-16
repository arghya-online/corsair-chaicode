"use client";
 
import React, { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { UpgradeModal } from "@/src/components/shared/UpgradeModal";

export function PricingSection() {
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const freeFeatures = [
    "Gmail Integration",
    "Calendar Integration",
    "AI Search",
    "Inbox Summaries",
    "Smart Drafts"
  ];

  const proFeatures = [
    "Everything in Free",
    "Priority Inbox",
    "Advanced Drafting",
    "Unlimited Search",
    "Continuous Sync",
    "Early Access Features"
  ];

  return (
    <section id="pricing" className="py-36 px-4 sm:px-6 md:px-8 bg-[#F7F3EC] select-none border-t border-[rgba(17,24,39,0.06)]">
      <div className="mx-auto max-w-4xl">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <div className="text-[13px] font-semibold tracking-[0.2em] text-[#C1783F] uppercase">
            PRICING
          </div>
          <h2 className="text-[38px] md:text-[56px] font-serif font-normal text-[#111827] leading-tight tracking-tight">
            Simple pricing.
          </h2>
          <p className="text-[18px] text-[#5F6B7A] font-sans leading-relaxed font-normal pt-2">
            Start free and upgrade when you need deeper automation.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-3xl mx-auto">
          
          {/* Plan 1: FREE */}
          <div className="bg-[#FCFAF7] border border-[rgba(17,24,39,0.08)] rounded-[28px] p-8 sm:p-10 flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(17,24,39,0.02)] transition-all duration-300 shadow-sm text-left">
            <div className="space-y-8">
              <div>
                <span className="text-[12px] font-semibold text-[#5F6B7A] uppercase tracking-[0.15em] font-sans block mb-1">
                  FREE
                </span>
                <div className="flex items-baseline mt-2">
                  <h3 className="text-[40px] font-serif font-normal text-[#111827]">
                    ₹0
                  </h3>
                </div>
                <p className="text-[15px] text-[#5F6B7A] font-sans mt-2">
                  For individuals.
                </p>
              </div>

              <div className="border-t border-[rgba(17,24,39,0.06)] pt-6">
                <ul className="space-y-4">
                  {freeFeatures.map((feat, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#5A6D56]/10 flex items-center justify-center flex-shrink-0 text-[#5A6D56]">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      </div>
                      <span className="text-[15px] text-[#5F6B7A] font-sans">
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-10">
              <Link
                href="/register"
                className="block w-full text-center rounded-full bg-[#111827] text-white hover:bg-[#111827]/90 text-[15px] font-medium py-3.5 transition-all active:scale-[0.98] shadow-sm font-sans"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Plan 2: PRO */}
          <div className="bg-[#FCFAF7] border-2 border-[#C1783F]/35 rounded-[28px] p-8 sm:p-10 flex flex-col justify-between hover:shadow-[0_12px_40px_rgba(193,120,63,0.02)] relative transition-all duration-300 shadow-sm text-left">
            
            {/* Highlighted Badge */}
            <div className="absolute -top-3.5 right-8 bg-[#C1783F]/10 text-[#C1783F] px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-wide uppercase border border-[#C1783F]/25 shadow-sm font-sans">
              Pro Access
            </div>

            <div className="space-y-8">
              <div>
                <span className="text-[12px] font-semibold text-[#C1783F] uppercase tracking-[0.15em] font-sans block mb-1">
                  PRO
                </span>
                <div className="flex items-baseline mt-2">
                  <h3 className="text-[40px] font-serif font-normal text-[#111827]">
                    ₹799
                  </h3>
                  <span className="text-[15px] text-[#5F6B7A] font-sans ml-1">/ month</span>
                </div>
                <p className="text-[15px] text-[#5F6B7A] font-sans mt-2">
                  For professionals.
                </p>
              </div>

              <div className="border-t border-[rgba(17,24,39,0.06)] pt-6">
                <ul className="space-y-4">
                  {proFeatures.map((feat, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#C1783F]/10 flex items-center justify-center flex-shrink-0 text-[#C1783F]">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      </div>
                      <span className="text-[15px] text-[#111827] font-sans font-medium">
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-10">
              <button
                onClick={() => setUpgradeOpen(true)}
                className="block w-full text-center rounded-full bg-[#111827] hover:bg-[#111827]/90 text-white text-[15px] font-medium py-3.5 transition-all cursor-pointer active:scale-[0.98] shadow-sm font-sans"
              >
                Start Pro
              </button>
            </div>
          </div>

        </div>
      </div>

      <UpgradeModal open={upgradeOpen} onOpenChange={setUpgradeOpen} />
    </section>
  );
}

export default PricingSection;
