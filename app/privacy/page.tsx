import React from "react";
import { getCurrentUser } from "@/src/actions/auth";
import { Nav } from "@/src/components/landing/Nav";
import { Footer } from "@/src/components/landing/Footer";
import { ShieldAlert, EyeOff, Lock, Server } from "lucide-react";

export default async function PrivacyPage() {
  const user = await getCurrentUser();

  const rules = [
    {
      icon: EyeOff,
      title: "Complete Data Isolation",
      desc: "Zentra cached values are written directly to isolated workspace databases. We never aggregate, read, package, or sell your inbox emails or calendar histories.",
    },
    {
      icon: Lock,
      title: "No Model Training",
      desc: "Zentra NEVER transmits your private draft contents, inbox communications, or meeting notes to train external generative models. Your contexts stay strictly local.",
    },
    {
      icon: Server,
      title: "OAuth Token Integrity",
      desc: "We connect to Google API endpoints using secure standard OAuth verification. We cache temporary access keys on secured local directories under your strict permissions.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#F7F3EC] text-[#111827] flex flex-col font-sans relative overflow-hidden">
      <Nav user={user} />

      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="url(#footer-jaali)" />
        </svg>
      </div>
      <div className="absolute top-[20%] left-[10%] w-[550px] h-[550px] rounded-full bg-[#C67B3D]/5 blur-[120px] pointer-events-none z-0" />

      {/* Hero Header */}
      <section className="pt-32 pb-20 px-6 max-w-4xl mx-auto w-full z-10 text-left">
        <div className="max-w-3xl space-y-4 mb-16">
          <span className="text-[12px] font-bold tracking-[0.2em] text-[#C67B3D] uppercase">TRUST & SAFETY</span>
          <h1 className="text-[48px] sm:text-[60px] font-serif font-normal text-[#111827] leading-tight tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-[16px] sm:text-[18px] text-[#64748B] max-w-2xl leading-relaxed">
            Data isolation and credential safety are our core design directives. We explain how we secure your data and credentials.
          </p>
        </div>

        {/* Content columns */}
        <div className="space-y-12">
          {rules.map((r, idx) => {
            const Icon = r.icon;
            return (
              <div
                key={idx}
                className="flex flex-col md:flex-row items-start gap-6 p-6 sm:p-8 rounded-2xl bg-white/50 border border-[rgba(198,123,61,0.08)] text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-[#C67B3D]/10 flex items-center justify-center text-[#C67B3D] flex-shrink-0">
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-[19px] font-serif font-bold text-[#111827]">{r.title}</h3>
                  <p className="text-[14px] text-[#64748B] leading-relaxed max-w-2xl">{r.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Extra text details */}
        <div className="mt-16 space-y-6 text-left max-w-3xl text-[14px] text-[#64748B] leading-relaxed">
          <h3 className="font-serif text-[22px] font-normal text-[#111827]">Compliance & Safety Questions</h3>
          <p>
            If you have questions regarding database caching structures, vector processing pipelines, or user credential deletions, you can send an inquiry directly to our compliance officers at <a href="mailto:support@zentra.ai" className="text-[#C67B3D] hover:underline">support@zentra.ai</a>.
          </p>
        </div>

      </section>

      <Footer />
    </main>
  );
}
