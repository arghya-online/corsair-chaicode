import React from "react";
import { getCurrentUser } from "@/src/actions/auth";
import { Nav } from "@/src/components/landing/Nav";
import { Footer } from "@/src/components/landing/Footer";
import { BookOpen, Terminal, Code, Settings, Link2, Key } from "lucide-react";

export default async function DocsPage() {
  const user = await getCurrentUser();

  const sections = [
    {
      icon: Settings,
      title: "Setting Up Integrations",
      desc: "Go to settings, click 'Integrations', authorize Gmail/Google Calendar OAuth scopes. Zentra immediately indexes inbox metadata into an offline SQLite cache.",
    },
    {
      icon: Terminal,
      title: "Workspace Command Engine",
      desc: "Press CMD+K to open the Command bar. Type '/summarize' or '/schedule meeting' to access our NLP workflow parser directly.",
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
      <div className="absolute top-[30%] right-[5%] w-[600px] h-[600px] rounded-full bg-[#C67B3D]/5 blur-[120px] pointer-events-none z-0" />

      {/* Hero Header */}
      <section className="pt-32 pb-20 px-6 max-w-6xl mx-auto w-full z-10 text-left">
        <div className="max-w-3xl space-y-4">
          <span className="text-[12px] font-bold tracking-[0.2em] text-[#C67B3D] uppercase">DOCUMENTATION</span>
          <h1 className="text-[48px] sm:text-[60px] font-serif font-normal text-[#111827] leading-tight tracking-tight">
            Developer Guides and Reference
          </h1>
          <p className="text-[16px] sm:text-[18px] text-[#64748B] max-w-2xl leading-relaxed">
            Integrate Zentra AI commands into your workflows, sync external apps, or inspect our schema parameters.
          </p>
        </div>

        {/* Documentation Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mt-16">
          
          {/* Left Navigation Menu (Span 3) */}
          <div className="md:col-span-3 space-y-8">
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Getting Started</span>
              <ul className="space-y-2.5 text-[13.5px]">
                <li><a href="#intro" className="text-[#C67B3D] font-semibold hover:underline">Introduction</a></li>
                <li><a href="#quickstart" className="text-[#64748B] hover:text-[#111827] transition-colors">Quickstart Guide</a></li>
                <li><a href="#sync" className="text-[#64748B] hover:text-[#111827] transition-colors">Gmail Sync Cycles</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">API Reference</span>
              <ul className="space-y-2.5 text-[13.5px]">
                <li><a href="#endpoints" className="text-[#64748B] hover:text-[#111827] transition-colors">HTTP Endpoints</a></li>
                <li><a href="#authentication" className="text-[#64748B] hover:text-[#111827] transition-colors">Bearer Authentication</a></li>
                <li><a href="#webhooks" className="text-[#64748B] hover:text-[#111827] transition-colors">Webhook Triggers</a></li>
              </ul>
            </div>
          </div>

          {/* Right Docs Material (Span 9) */}
          <div className="md:col-span-9 space-y-12 text-left">
            
            {/* Guide Section */}
            <div id="intro" className="space-y-4">
              <h2 className="text-[26px] font-serif font-normal text-[#111827] border-b border-[rgba(17,24,39,0.06)] pb-3">
                Introduction to Zentra Engine
              </h2>
              <p className="text-[14px] text-[#64748B] leading-relaxed">
                Zentra connects with Google Workspace API accounts to run local vector stores. You can issue prompts to summarize active email threads, generate draft cards, and reschedule calendars instantly.
              </p>
            </div>

            {/* Quickstart Features list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {sections.map((s, idx) => {
                const Icon = s.icon;
                return (
                  <div key={idx} className="p-6 rounded-2xl bg-white/50 border border-[rgba(198,123,61,0.08)] space-y-3">
                    <div className="w-8 h-8 rounded-lg bg-[#C67B3D]/10 flex items-center justify-center text-[#C67B3D]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-[15px] font-serif font-bold text-[#111827]">{s.title}</h3>
                    <p className="text-[13px] text-[#64748B] leading-relaxed">{s.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Code Reference block (API Spec) */}
            <div id="endpoints" className="space-y-4 pt-6">
              <h2 className="text-[26px] font-serif font-normal text-[#111827] border-b border-[rgba(17,24,39,0.06)] pb-3">
                API Reference: Fetch Briefings
              </h2>
              <p className="text-[14px] text-[#64748B] leading-relaxed">
                Issue a token-based authentication request to retrieve daily summarized briefings:
              </p>

              {/* Code block */}
              <div className="p-5 rounded-2xl bg-[#1E293B] text-[#F8FAFC] font-mono text-[12.5px] overflow-x-auto shadow-md border border-slate-700">
                <div className="flex items-center justify-between pb-3 border-b border-slate-700/60 mb-3 text-slate-400">
                  <span>GET /api/v1/briefings</span>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-emerald-400 font-semibold">HTTPS</span>
                </div>
                <pre>{`curl -X GET "https://api.zentra.ai/v1/briefings" \\
  -H "Authorization: Bearer znt_live_7x89ab..." \\
  -H "Content-Type: application/json"`}</pre>
              </div>

              {/* JSON response mockup */}
              <div className="p-5 rounded-2xl bg-[#1E293B] text-[#F8FAFC] font-mono text-[12.5px] overflow-x-auto shadow-md border border-slate-700">
                <div className="flex items-center justify-between pb-3 border-b border-slate-700/60 mb-3 text-slate-400">
                  <span>RESPONSE 200 OK</span>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-indigo-400 font-semibold">JSON</span>
                </div>
                <pre>{`{
  "status": "success",
  "data": {
    "date": "2026-06-17",
    "unread_priorities": 3,
    "briefing_summary": "Vikram Malhotra requested design approval for courtyard noon presentation. Calender Sync overlaps with Critique session at 10:15 AM."
  }
}`}</pre>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
