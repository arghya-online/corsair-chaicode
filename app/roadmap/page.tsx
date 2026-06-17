import React from "react";
import { getCurrentUser } from "@/src/actions/auth";
import { Nav } from "@/src/components/landing/Nav";
import { Footer } from "@/src/components/landing/Footer";

export default async function RoadmapPage() {
  const user = await getCurrentUser();

  const phases = [
    {
      quarter: "Q3 2026",
      status: "In Progress",
      color: "#C67B3D",
      title: "Active Briefing Composer Engines",
      desc: "Develop deep NLP contextual summary cards for email lists, auto-index Google Calendar attachments, and surface conflict reschedulers natively in the command line.",
    },
    {
      quarter: "Q4 2026",
      status: "Planning",
      color: "#6D8A68",
      title: "Offline Sync SQLite Directories & SDK",
      desc: "Implement fully local sqlite databases using Clerk tokens. Introduce the Zentra CLI developers SDK to compose custom action nodes and third-party application triggers.",
    },
    {
      quarter: "Q1 2027",
      status: "Proposed",
      color: "#5B7A8C",
      title: "CalDav Integrations & Slack Channels",
      desc: "Add standard CalDav endpoints for Apple/Microsoft accounts, and integrate Slack and Notion channels into the workspace search timeline.",
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
      <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] rounded-full bg-[#C67B3D]/5 blur-[100px] pointer-events-none z-0" />

      {/* Hero Header */}
      <section className="pt-32 pb-20 px-6 max-w-4xl mx-auto w-full z-10 text-left">
        <div className="max-w-3xl space-y-4 mb-16">
          <span className="text-[12px] font-bold tracking-[0.2em] text-[#C67B3D] uppercase">ROADMAP</span>
          <h1 className="text-[48px] sm:text-[60px] font-serif font-normal text-[#111827] leading-tight tracking-tight">
            Our upcoming milestones
          </h1>
          <p className="text-[16px] sm:text-[18px] text-[#64748B] max-w-2xl leading-relaxed">
            Follow Zentra's feature evolution. We prioritize attention-respecting designs, isolated local performance, and developer flexibility.
          </p>
        </div>

        {/* Roadmap Cards */}
        <div className="space-y-8">
          {phases.map((p, idx) => (
            <div
              key={idx}
              style={{
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(20px)",
              }}
              className="p-6 sm:p-8 rounded-[24px] border border-[rgba(198,123,61,0.12)] space-y-4 text-left"
            >
              <div className="flex justify-between items-center pb-2">
                <span className="text-[13px] font-bold uppercase tracking-wider text-[#C67B3D]">
                  {p.quarter}
                </span>
                
                <span
                  style={{
                    backgroundColor: `${p.color}12`,
                    color: p.color,
                    borderColor: `${p.color}25`,
                  }}
                  className="text-[11px] font-bold uppercase tracking-wider border px-2.5 py-0.5 rounded-full"
                >
                  {p.status}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-[20px] font-serif font-bold text-[#111827]">{p.title}</h3>
                <p className="text-[13.5px] text-[#64748B] leading-relaxed max-w-2xl">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </section>

      <Footer />
    </main>
  );
}
