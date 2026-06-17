import React from "react";
import { getCurrentUser } from "@/src/actions/auth";
import { Nav } from "@/src/components/landing/Nav";
import { Footer } from "@/src/components/landing/Footer";

export default async function TermsPage() {
  const user = await getCurrentUser();

  const rules = [
    {
      num: "01",
      title: "Authorized Account Scope",
      desc: "By linking Google accounts, you grant Zentra the permission to view email threads, compose draft replies, and send replies under your direction, as well as manage calendar events (on paid plans).",
    },
    {
      num: "02",
      title: "Service Availabilities",
      desc: "Zentra is an AI productivity workspace. We strive to maintain continuous service availability; however, synchronization speeds and AI response generation depend directly on Google API and Gemini API services.",
    },
    {
      num: "03",
      title: "Prohibited Usages",
      desc: "You may not attempt to reverse-engineer Zentra's core systems, execute unauthorized bulk email spamming through the interface, or abuse the Gemini AI tokens beyond personal usage limits.",
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
      <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] rounded-full bg-[#C67B3D]/4 blur-[100px] pointer-events-none z-0" />

      {/* Hero Header */}
      <section className="pt-32 pb-20 px-6 max-w-4xl mx-auto w-full z-10 text-left">
        <div className="max-w-3xl space-y-4 mb-16">
          <span className="text-[12px] font-bold tracking-[0.2em] text-[#C67B3D] uppercase">LEGAL TERMS</span>
          <h1 className="text-[48px] sm:text-[60px] font-serif font-normal text-[#111827] leading-tight tracking-tight">
            Terms of Service
          </h1>
          <p className="text-[16px] sm:text-[18px] text-[#64748B] max-w-2xl leading-relaxed">
            Please read these guidelines carefully before using Zentra's integration portals and command modules.
          </p>
        </div>

        {/* Content list */}
        <div className="space-y-12">
          {rules.map((r, idx) => (
            <div
              key={idx}
              className="flex items-start gap-6 pt-8 border-t border-[rgba(17,24,39,0.06)] text-left"
            >
              <span className="text-[24px] font-serif font-normal text-[#C67B3D] leading-none">
                {r.num}
              </span>
              <div className="space-y-2">
                <h3 className="text-[19px] font-serif font-bold text-[#111827]">{r.title}</h3>
                <p className="text-[14px] text-[#64748B] leading-relaxed max-w-2xl">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </section>

      <Footer />
    </main>
  );
}
