import React from "react";
import { getCurrentUser } from "@/src/actions/auth";
import { Nav } from "@/src/components/landing/Nav";
import { Footer } from "@/src/components/landing/Footer";
import { ArrowRight, Key, MessageSquareCode, Sparkles } from "lucide-react";

export default async function HowItWorksPage() {
  const user = await getCurrentUser();

  const steps = [
    {
      num: "01",
      icon: Key,
      title: "Connect Securely",
      desc: "Authenticate your Gmail and Google Calendar integrations using secure standard Google OAuth. Your tokens are encrypted and isolated on our server via the Corsair sandboxing system.",
    },
    {
      num: "02",
      icon: MessageSquareCode,
      title: "Query on Demand",
      desc: "Interact with the Zentra AI Assistant in natural language. Gemini AI invokes Gmail or Calendar tools in real-time to query your recent threads or analyze schedule slots.",
    },
    {
      num: "03",
      icon: Sparkles,
      title: "Draft & Schedule",
      desc: "Review compiled summaries, let Zentra compose drafts for your approval, send email replies directly, or create and delete calendar events effortlessly.",
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
      <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] rounded-full bg-[#D9A15B]/5 blur-[100px] pointer-events-none z-0" />

      {/* Hero Header */}
      <section className="pt-32 pb-20 px-6 max-w-6xl mx-auto w-full z-10 text-left">
        <div className="max-w-3xl space-y-4">
          <span className="text-[12px] font-bold tracking-[0.2em] text-[#C67B3D] uppercase">WORKFLOW</span>
          <h1 className="text-[48px] sm:text-[60px] font-serif font-normal text-[#111827] leading-tight tracking-tight">
            Transition to a calm inbox, step by step.
          </h1>
          <p className="text-[16px] sm:text-[18px] text-[#64748B] max-w-2xl leading-relaxed">
            Zentra works in the background to filter out constant interruptions. Here is how our engine secures access and automates your administrative work.
          </p>
        </div>

        {/* Timeline Steps layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-20 relative">
          {steps.map((s, index) => {
            const Icon = s.icon;
            return (
              <div
                key={index}
                style={{
                  background: "rgba(255, 255, 255, 0.75)",
                  backdropFilter: "blur(25px)",
                }}
                className="relative p-8 rounded-[28px] border border-[rgba(198,123,61,0.12)] shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:border-[#C67B3D]/30 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Arrow connector */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 -translate-y-1/2 z-20 text-[#C67B3D]">
                    <ArrowRight className="w-5 h-5 stroke-[2]" />
                  </div>
                )}

                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="w-10 h-10 rounded-xl bg-[#C67B3D]/10 flex items-center justify-center text-[#C67B3D]">
                      <Icon className="w-5 h-5 stroke-[2]" />
                    </div>
                    <span className="text-[36px] font-serif text-[#C67B3D]/25 font-normal leading-none">
                      {s.num}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <h3 className="text-[19px] font-serif font-semibold text-[#111827]">
                      {s.title}
                    </h3>
                    <p className="text-[13.5px] text-[#64748B] leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </main>
  );
}
