import React from "react";
import { getCurrentUser } from "@/src/actions/auth";
import { Nav } from "@/src/components/landing/Nav";
import { Footer } from "@/src/components/landing/Footer";
import { Search, Calendar, MessageSquare, Sparkles, Shield, Cpu } from "lucide-react";

export default async function FeaturesPage() {
  const user = await getCurrentUser();

  const featuresList = [
    {
      icon: Search,
      title: "AI Inbox Search",
      desc: "Search across your Gmail threads, locate key conversations, and retrieve email summaries using simple natural language.",
      id: "search",
    },
    {
      icon: Calendar,
      title: "Smart Calendar Coordination",
      desc: "Inspect daily schedules, view free/busy slots, create new events, and delete events seamlessly (on Alpha/Gama plans).",
      id: "calendar",
    },
    {
      icon: MessageSquare,
      title: "Contextual Smart Drafting",
      desc: "Ask the Zentra co-pilot to compose reply drafts for your active email threads and send them directly when approved.",
      id: "drafting",
    },
    {
      icon: Cpu,
      title: "Inbox Summarization",
      desc: "Get instant, straight-to-the-point summaries of recent email threads, helping you understand context quickly.",
      id: "assistant",
    },
    {
      icon: Shield,
      title: "Privacy First Isolation",
      desc: "Your synced data is isolated securely using the Corsair sandboxing system on our PostgreSQL server. We never train models on your data.",
      id: "privacy",
    },
    {
      icon: Sparkles,
      title: "Unified Calmer Workspaces",
      desc: "A singular interface that lets you search messages and coordinate schedules without switching tabs.",
      id: "integrations",
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
      <div className="absolute top-[15%] left-[20%] w-[600px] h-[600px] rounded-full bg-[#C67B3D]/6 blur-[120px] pointer-events-none z-0" />

      {/* Hero Header */}
      <section className="pt-32 pb-20 px-6 max-w-6xl mx-auto w-full z-10 text-left">
        <div className="max-w-3xl space-y-4">
          <span className="text-[12px] font-bold tracking-[0.2em] text-[#C67B3D] uppercase">CAPABILITIES</span>
          <h1 className="text-[48px] sm:text-[60px] font-serif font-normal text-[#111827] leading-tight tracking-tight">
            Designed for quiet, seamless efficiency.
          </h1>
          <p className="text-[16px] sm:text-[18px] text-[#64748B] max-w-2xl leading-relaxed">
            Discover a comprehensive ecosystem that combines Gmail synchronization, Google Calendar intelligence, and native AI workflows to reclaim your focus.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          {featuresList.map((f, index) => {
            const Icon = f.icon;
            return (
              <div
                key={index}
                id={f.id}
                style={{
                  background: "rgba(255, 255, 255, 0.7)",
                  backdropFilter: "blur(20px)",
                }}
                className="p-8 rounded-[24px] border border-[rgba(198,123,61,0.12)] shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-6 hover:border-[#C67B3D]/30 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-[#C67B3D]/10 flex items-center justify-center text-[#C67B3D]">
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-[18px] font-serif font-semibold text-[#111827]">{f.title}</h3>
                  <p className="text-[13.5px] text-[#64748B] leading-relaxed">{f.desc}</p>
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
