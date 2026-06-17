import React from "react";
import { getCurrentUser } from "@/src/actions/auth";
import { Nav } from "@/src/components/landing/Nav";
import { Footer } from "@/src/components/landing/Footer";
import { Briefcase, MapPin, Clock } from "lucide-react";

export default async function CareersPage() {
  const user = await getCurrentUser();

  const roles = [
    {
      title: "Senior AI Inference Engineer",
      dept: "AI Core & Models",
      location: "San Francisco, CA or Remote (US/India)",
      type: "Full-Time",
      desc: "Optimize LLM routing paths, construct vector storage embeddings, and lower context retrieval times below 200ms.",
    },
    {
      title: "Lead Product Designer",
      dept: "Design & UX",
      location: "Bengaluru, India or SF/Remote",
      type: "Full-Time",
      desc: "Lead Zentra design system development, craft premium micro-interactions, and blend editorial structures with calm aesthetics.",
    },
    {
      title: "Fullstack Systems Developer",
      dept: "Product Operations",
      location: "Remote (Global)",
      type: "Full-Time",
      desc: "Implement Next.js routes, scale Clerk auth databases, connect OAuth integrations, and polish background queue loaders.",
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
          <span className="text-[12px] font-bold tracking-[0.2em] text-[#C67B3D] uppercase">CAREERS</span>
          <h1 className="text-[48px] sm:text-[60px] font-serif font-normal text-[#111827] leading-tight tracking-tight">
            Build the future of mindful work.
          </h1>
          <p className="text-[16px] sm:text-[18px] text-[#64748B] max-w-2xl leading-relaxed">
            We are looking for builders who appreciate minimalism, visual excellence, and isolated safety to build Zentra AI.
          </p>
        </div>

        {/* Roles List */}
        <div className="space-y-6">
          {roles.map((r, idx) => (
            <div
              key={idx}
              style={{
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(20px)",
              }}
              className="p-6 sm:p-8 rounded-[24px] border border-[rgba(198,123,61,0.12)] hover:border-[#C67B3D]/30 transition-all duration-300 space-y-4 text-left flex flex-col justify-between"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[rgba(17,24,39,0.06)] pb-4">
                <div>
                  <h3 className="text-[20px] font-serif font-bold text-[#111827]">{r.title}</h3>
                  <span className="text-[12px] font-bold text-[#C67B3D] uppercase tracking-wider">{r.dept}</span>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-[12.5px] text-[#64748B] font-medium">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{r.location}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{r.type}</span>
                </div>
              </div>

              <p className="text-[13.5px] text-[#64748B] leading-relaxed max-w-2xl">{r.desc}</p>

              <div className="pt-2">
                <a
                  href="mailto:careers@zentra.ai"
                  className="inline-flex items-center justify-center bg-[#111827] text-white text-[12.5px] font-bold px-5 py-2.5 rounded-xl hover:bg-[#C67B3D] transition-colors"
                >
                  Apply to Role
                </a>
              </div>
            </div>
          ))}
        </div>

      </section>

      <Footer />
    </main>
  );
}
