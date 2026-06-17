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
      title: "The Calm Workspace Engine Launch",
      date: "June 17, 2026",
      badge: "Major Release",
      desc: "Zentra transitions from beta to full launch. Redesigned the entire landing layout with rich ambient gold backlights, custom geometric details, and structured route navigation.",
      features: [
        "Full 12-column footer layout containing status pulsing nodes.",
        "Interactive pricing plan cards with pro highlight badges and yearly discount toggles.",
        "Refined typographic hierarchy pairing Playfair Display and Inter sans-serif.",
        "Local SQLite vector indexing for zero-latency NLP semantic inbox search.",
      ],
    },
    {
      version: "v0.9.0",
      title: "Contextual Draft Composers & CalDav Buffers",
      date: "May 28, 2026",
      badge: "Beta Update",
      desc: "Introduced advanced drafts that compose custom replies on user credentials and calendar buffers to avoid back-to-back overlaps.",
      features: [
        "Background sync workers to pre-compute priority action briefs.",
        "Adaptive buffer suggestion models (suggests alternative time slots).",
        "OAuth security encryption layers isolating credentials.",
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
