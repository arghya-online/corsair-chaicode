import React from "react";
import { getCurrentUser } from "@/src/actions/auth";
import { Nav } from "@/src/components/landing/Nav";
import { Footer } from "@/src/components/landing/Footer";
import { Heart, Compass, ShieldCheck } from "lucide-react";

export default async function AboutPage() {
  const user = await getCurrentUser();

  const values = [
    {
      icon: Compass,
      title: "Mindful Space",
      desc: "Zentra was built out of frustration with constant software noise. We believe tools should wait quietly for you, not force notifications to pull your attention.",
    },
    {
      icon: ShieldCheck,
      title: "Isolated Security",
      desc: "Trust is the prerequisite of calm. We built Zentra to isolate and process credentials on-device, prioritizing user data ownership over database monetization.",
    },
    {
      icon: Heart,
      title: "Warm Aesthetics",
      desc: "We drew inspiration from classic Indian geometric crafts, terracottas, and courtyard light. Work software should be a place that feels welcoming and beautiful.",
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
      <div className="absolute top-[25%] left-[15%] w-[550px] h-[550px] rounded-full bg-[#C67B3D]/5 blur-[110px] pointer-events-none z-0" />

      {/* Hero Header */}
      <section className="pt-32 pb-20 px-6 max-w-6xl mx-auto w-full z-10 text-left">
        <div className="max-w-3xl space-y-4">
          <span className="text-[12px] font-bold tracking-[0.2em] text-[#C67B3D] uppercase">OUR MISSION</span>
          <h1 className="text-[48px] sm:text-[60px] font-serif font-normal text-[#111827] leading-tight tracking-tight">
            We build interfaces that respect your attention.
          </h1>
          <p className="text-[16px] sm:text-[18px] text-[#64748B] max-w-2xl leading-relaxed">
            Zentra is a software laboratory crafting mindful workspaces. We think the solution to overload is not more inbox filters, but a fundamental redesign of how we interact with schedules and email.
          </p>
        </div>

        {/* Content Section: Story */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mt-20 items-center">
          <div className="md:col-span-7 space-y-6">
            <h2 className="text-[28px] sm:text-[34px] font-serif font-normal text-[#111827] leading-snug">
              Simplifying the modern inbox overload.
            </h2>
            <p className="text-[14.5px] text-[#64748B] leading-relaxed">
              Every day, professional builders spend hours navigating fragmented browser tabs, managing context switches between their inbox and calendar, and checking for updates. This constant mental overhead drains cognitive energy.
            </p>
            <p className="text-[14.5px] text-[#64748B] leading-relaxed">
              Zentra solves this by creating a single, calm workspace powered by smart inbox vectors. We connect directly to your Google integrations and let you write drafts, coordinate calendars, and search records using conversational AI.
            </p>
          </div>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.65)",
              backdropFilter: "blur(15px)",
            }}
            className="md:col-span-5 p-8 rounded-[28px] border border-[rgba(198,123,61,0.12)] shadow-[0_12px_36px_rgba(0,0,0,0.03)] space-y-6"
          >
            <span className="text-[11px] font-bold text-[#C67B3D] tracking-widest uppercase block">The Workspace Philosophy</span>
            <div className="italic text-[16px] font-serif text-[#111827] leading-relaxed">
              "We shapes our spaces; thereafter, our spaces shape us. If our software interfaces are cluttered and frantic, our daily work becomes fractured. Quiet workspace designs promote calm, deep outcomes."
            </div>
            <div className="text-[12px] text-[#64748B] font-semibold uppercase tracking-wider">
              — Zentra Architecture Team
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          {values.map((v, index) => {
            const Icon = v.icon;
            return (
              <div
                key={index}
                className="space-y-4 text-left p-6 rounded-2xl bg-white/20 border border-[rgba(17,24,39,0.04)]"
              >
                <div className="w-9 h-9 rounded-lg bg-[#C67B3D]/8 flex items-center justify-center text-[#C67B3D]">
                  <Icon className="w-4.5 h-4.5 stroke-[2]" />
                </div>
                <h3 className="text-[17px] font-serif font-semibold text-[#111827]">{v.title}</h3>
                <p className="text-[13px] text-[#64748B] leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </main>
  );
}
