import React from "react";
import { getCurrentUser } from "@/src/actions/auth";
import { Nav } from "@/src/components/landing/Nav";
import { Footer } from "@/src/components/landing/Footer";
import { Sparkles, Calendar, Search, Activity } from "lucide-react";

export default async function ChangelogPage() {
  const user = await getCurrentUser();

  const updates = [
    {
      version: "v1.0.0",
      title: "Production Subscriptions & Plan Limits",
      date: "June 17, 2026",
      badge: "Major Release",
      desc: "Zentra integrates subscription billing and strict message caps. Re-architected data structures and pages to reflect honest product limits.",
      features: [
        "Razorpay subscription integration (Base, Alpha, Gama plans).",
        "Strict limits enforcement (Base: 4 message cap, Alpha: 20 message cap).",
        "Google Calendar integration restriction for Free tier users.",
        "Complete copy audit to eliminate placeholders and imaginary features.",
      ],
    },
    {
      version: "v0.9.0",
      title: "Gmail, Google Calendar & Gemini AI Integration",
      date: "May 28, 2026",
      badge: "Core Integration",
      desc: "Introduced secure integrations powered by Google OAuth and Corsair multi-tenancy sandboxing.",
      features: [
        "Gmail tool calling: search messages, view thread histories, write draft reply cards, and send emails.",
        "Google Calendar tool calling: inspect upcoming schedules, find empty slots, create events, and delete events.",
        "Clerk secure user authentication mapping.",
        "Corsair token encryption layers stored within PostgreSQL.",
      ],
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
      <div className="absolute top-[20%] left-[5%] w-[600px] h-[600px] rounded-full bg-[#C67B3D]/5 blur-[120px] pointer-events-none z-0" />

      {/* Hero Header */}
      <section className="pt-32 pb-20 px-6 max-w-4xl mx-auto w-full z-10 text-left">
        <div className="max-w-3xl space-y-4 mb-16">
          <span className="text-[12px] font-bold tracking-[0.2em] text-[#C67B3D] uppercase">UPDATES</span>
          <h1 className="text-[48px] sm:text-[60px] font-serif font-normal text-[#111827] leading-tight tracking-tight">
            Changelog
          </h1>
          <p className="text-[16px] sm:text-[18px] text-[#64748B] max-w-2xl leading-relaxed">
            Follow Zentra product updates, feature implementations, and API upgrades as they launch.
          </p>
        </div>

        {/* Updates Timeline */}
        <div className="space-y-16">
          {updates.map((up, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-12 border-t border-[rgba(17,24,39,0.08)]"
            >
              {/* Left sidebar: version & date */}
              <div className="md:col-span-3 space-y-2 text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-white px-2.5 py-1 bg-[#C67B3D] rounded-md inline-block">
                  {up.version}
                </span>
                <p className="text-[13px] text-[#64748B] font-medium pt-1">{up.date}</p>
                <span className="text-[11px] font-bold text-[#5A6D56] uppercase tracking-wider block">
                  {up.badge}
                </span>
              </div>

              {/* Right content: description and features */}
              <div className="md:col-span-9 space-y-6 text-left">
                <h3 className="text-[22px] font-serif font-normal text-[#111827] leading-snug">
                  {up.title}
                </h3>
                <p className="text-[14px] text-[#64748B] leading-relaxed">
                  {up.desc}
                </p>

                <div className="space-y-3">
                  <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#111827]">
                    Key Enhancements:
                  </h4>
                  <ul className="space-y-2 text-[13.5px] text-[#64748B]">
                    {up.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#C67B3D] flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
