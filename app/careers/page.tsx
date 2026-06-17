import React from "react";
import { getCurrentUser } from "@/src/actions/auth";
import { Nav } from "@/src/components/landing/Nav";
import { Footer } from "@/src/components/landing/Footer";
import { Mail, Compass, Coffee } from "lucide-react";

export default async function CareersPage() {
  const user = await getCurrentUser();

  const values = [
    {
      icon: Compass,
      title: "Solo Project Development",
      desc: "Zentra is currently a focused, independent laboratory project designed and built to create a calm email and calendar experience.",
    },
    {
      icon: Coffee,
      title: "No Active Openings",
      desc: "Since Zentra is operated as an independent product experiment, there are no active engineering, design, or business roles available at this time.",
    },
    {
      icon: Mail,
      title: "Get In Touch",
      desc: "If you are a developer, designer, or user interested in pairing up, providing feedback, or sharing ideas, feel free to reach out to the creator directly.",
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
          <span className="text-[12px] font-bold tracking-[0.2em] text-[#C67B3D] uppercase">PROJECT STATUS</span>
          <h1 className="text-[48px] sm:text-[60px] font-serif font-normal text-[#111827] leading-tight tracking-tight">
            Independent Workspace
          </h1>
          <p className="text-[16px] sm:text-[18px] text-[#64748B] max-w-2xl leading-relaxed">
            Zentra is currently crafted by a solo builder. We do not have active hiring pipelines, but we are always open to feedback and discussions.
          </p>
        </div>

        {/* Info Blocks */}
        <div className="space-y-6">
          {values.map((v, idx) => {
            const Icon = v.icon;
            return (
              <div
                key={idx}
                style={{
                  background: "rgba(255, 255, 255, 0.7)",
                  backdropFilter: "blur(20px)",
                }}
                className="p-6 sm:p-8 rounded-[24px] border border-[rgba(198,123,61,0.12)] space-y-4 text-left flex flex-col sm:flex-row gap-6 items-start justify-between"
              >
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-[#C67B3D]/10 flex items-center justify-center text-[#C67B3D] flex-shrink-0">
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <h3 className="text-[20px] font-serif font-bold text-[#111827]">{v.title}</h3>
                    <p className="text-[13.5px] text-[#64748B] leading-relaxed max-w-2xl mt-1">{v.desc}</p>
                  </div>
                </div>

                {idx === 2 && (
                  <div className="pt-2 sm:pt-0">
                    <a
                      href="mailto:arghyamajumdar.contact555@gmail.com"
                      className="inline-flex items-center justify-center bg-[#111827] text-white text-[12.5px] font-bold px-5 py-2.5 rounded-xl hover:bg-[#C67B3D] transition-colors whitespace-nowrap"
                    >
                      Send Message
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </section>

      <Footer />
    </main>
  );
}
