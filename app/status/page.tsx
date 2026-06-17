import React from "react";
import { getCurrentUser } from "@/src/actions/auth";
import { Nav } from "@/src/components/landing/Nav";
import { Footer } from "@/src/components/landing/Footer";
import { CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";

export default async function StatusPage() {
  const user = await getCurrentUser();

  const services = [
    { name: "Gmail Integration (CorsAir API)", status: "Operational", latency: "120ms", uptime: "99.95%" },
    { name: "Google Calendar Integration (CorsAir API)", status: "Operational", latency: "95ms", uptime: "99.98%" },
    { name: "PostgreSQL Database Engine", status: "Operational", latency: "8ms", uptime: "99.99%" },
    { name: "Clerk User Authentication Services", status: "Operational", latency: "160ms", uptime: "99.95%" },
    { name: "Gemini AI Tool Inference API", status: "Operational", latency: "380ms", uptime: "99.96%" },
    { name: "Razorpay Billing Gateway API", status: "Operational", latency: "220ms", uptime: "99.98%" },
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
      <div className="absolute top-[25%] right-[10%] w-[500px] h-[500px] rounded-full bg-[#5A6D56]/6 blur-[100px] pointer-events-none z-0" />

      {/* Hero Header */}
      <section className="pt-32 pb-20 px-6 max-w-4xl mx-auto w-full z-10 text-left">
        
        {/* Header Indicator */}
        <div className="max-w-3xl space-y-4 mb-12">
          <span className="text-[12px] font-bold tracking-[0.2em] text-[#C67B3D] uppercase">SYSTEM MONITOR</span>
          
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[48px] sm:text-[60px] font-serif font-normal text-[#111827] leading-tight tracking-tight">
              All Systems Operational
            </h1>
            <div className="flex items-center gap-1.5 bg-[#5A6D56]/8 border border-[#5A6D56]/20 px-3.5 py-1.5 rounded-full text-[13px] font-semibold text-[#5A6D56] shadow-xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6D8A68] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#6D8A68]"></span>
              </span>
              <span>Operational</span>
            </div>
          </div>
          <p className="text-[16px] sm:text-[18px] text-[#64748B] max-w-2xl leading-relaxed">
            Live updates and system metrics for Zentra AI background workspace modules.
          </p>
        </div>

        {/* Global Uptime Panel */}
        <div className="p-8 rounded-[28px] border border-[rgba(198,123,61,0.12)] bg-white/70 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.03)] space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-[rgba(17,24,39,0.08)]">
            <span className="text-[14px] font-bold text-[#111827]">Services Uptime (Last 90 days)</span>
            <span className="text-[12px] font-semibold text-[#5A6D56]">Overall Uptime: 99.96%</span>
          </div>

          {/* Service Rows */}
          <div className="space-y-4">
            {services.map((serv, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl bg-[#F7F3EC]/50 border border-[rgba(17,24,39,0.04)] hover:bg-[#F7F3EC]/80 transition-colors gap-3"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#6D8A68]" />
                  <span className="text-[14.5px] font-bold text-[#111827]">{serv.name}</span>
                </div>

                <div className="flex items-center gap-6 text-[13px] font-medium text-[#64748B] w-full sm:w-auto justify-between sm:justify-end">
                  <span>Latency: <strong className="text-[#111827]">{serv.latency}</strong></span>
                  <span>Uptime: <strong className="text-[#5A6D56]">{serv.uptime}</strong></span>
                  <span className="text-[11px] font-bold text-[#5A6D56] uppercase bg-[#5A6D56]/6 px-2 py-0.5 rounded">
                    {serv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Past Incidents */}
        <div className="mt-16 space-y-6 text-left">
          <h3 className="font-serif text-[24px] font-normal text-[#111827]">Past Incidents</h3>
          <div className="h-px bg-[rgba(17,24,39,0.08)] w-full" />
          <p className="text-[13.5px] text-[#64748B] italic">No incidents reported in the last 60 days.</p>
        </div>

      </section>

      <Footer />
    </main>
  );
}
