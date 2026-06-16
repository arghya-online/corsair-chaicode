"use client";
 
import React, { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { UpgradeModal } from "@/src/components/shared/UpgradeModal";

export function PricingSection() {
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const starterFeatures = [
    "Connect 1 Gmail account",
    "Basic thread summarization",
    "Manual refresh synchronizations",
    "Standard response latency",
  ];

  const proFeatures = [
    "Connect unlimited Gmail accounts",
    "Continuous background synchronization",
    "Automated response generation",
    "Calendar coordination & block scheduling",
    "Priority custom filter logic",
    "Early access to new integrations",
  ];

  return (
    <section id="pricing" className="py-28 px-6 bg-[#FAF7F2] border-t border-[rgba(28,36,49,0.08)] select-none">
      <div className="mx-auto max-w-4xl">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <div className="text-[11px] font-medium tracking-widest text-[#C98A54] uppercase font-mono">
            Pricing plans
          </div>
          <h2 className="text-[36px] sm:text-[44px] font-serif font-normal text-[#1C2431] leading-tight">
            Fair options for early adopters.
          </h2>
          <p className="text-[15px] text-[#566170] font-sans leading-relaxed font-normal">
            Start with our free tier today or join our waitlist for premium background automation.
          </p>
        </div>

        {/* Pricing Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Plan 1: Starter */}
          <div className="bg-white/72 backdrop-blur-[16px] border border-[rgba(28,36,49,0.08)] rounded-3xl p-8 flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(28,36,49,0.03)] transition-all duration-300">
            <div className="space-y-6">
              <div>
                <span className="text-[11px] font-medium text-[#8A918F] uppercase tracking-widest font-mono">
                  Starter
                </span>
                <h3 className="text-[28px] font-serif font-normal text-[#1C2431] mt-2">
                  Free
                </h3>
                <p className="text-[13px] text-[#566170] font-sans mt-2 leading-relaxed">
                  For individuals managing standard emails and daily schedules manually.
                </p>
              </div>

              <div className="border-t border-[rgba(28,36,49,0.08)] pt-6">
                <ul className="space-y-3">
                  {starterFeatures.map((feat, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-[rgba(91,123,124,0.12)] flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-[#5B7B7C]" />
                      </div>
                      <span className="text-[13px] text-[#566170] font-sans">
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/register"
                className="block w-full text-center rounded-full border border-[#1C2431] hover:bg-[#101827] hover:text-white text-[13px] font-medium text-[#1C2431] py-3.5 transition-all active:scale-[0.98] hover:-translate-y-0.5"
              >
                Get started
              </Link>
            </div>
          </div>

          {/* Plan 2: Pro (Waitlist) */}
          <div className="bg-white/72 backdrop-blur-[16px] border border-[rgba(201,138,84,0.35)] rounded-3xl p-8 flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(28,36,49,0.03)] relative transition-all duration-300">
            {/* Waitlist Badge */}
            <div className="absolute -top-3 right-6 bg-[rgba(201,138,84,0.12)] text-[#A85A3A] px-3 py-1 rounded-full text-[10px] font-medium tracking-wide uppercase border border-[rgba(201,138,84,0.18)]">
              Waitlist open
            </div>

            <div className="space-y-6">
              <div>
                <span className="text-[11px] font-medium text-[#A85A3A] uppercase tracking-widest font-mono">
                  Pro
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <h3 className="text-[28px] font-serif font-normal text-[#1C2431]">
                    $19
                  </h3>
                  <span className="text-[13px] text-[#8A918F] font-sans">/ month</span>
                </div>
                <p className="text-[13px] text-[#566170] font-sans mt-2 leading-relaxed">
                  For power users looking for fully automated, continuous background execution.
                </p>
              </div>

              <div className="border-t border-[rgba(28,36,49,0.08)] pt-6">
                <ul className="space-y-3">
                  {proFeatures.map((feat, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-[rgba(215,162,59,0.12)] flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-[#D7A23B]" />
                      </div>
                      <span className="text-[13px] text-[#1C2431] font-sans font-normal">
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={() => setUpgradeOpen(true)}
                className="block w-full text-center rounded-full bg-[#1C2431] text-white hover:bg-[#101827] text-[13px] font-medium py-3.5 transition-all cursor-pointer active:scale-[0.98] hover:-translate-y-0.5 shadow-sm"
              >
                Join waitlist
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
