"use client";

import React from "react";
import { Mail, Calendar, Shield } from "lucide-react";

export function TrustSection() {
  const integrations = [
    {
      name: "Gmail",
      desc: "Authorized message indexing via standard Google OAuth 2.0 layers.",
      icon: Mail,
      color: "text-[#EA4335]",
      bg: "bg-red-50",
    },
    {
      name: "Google Calendar",
      desc: "Bidirectional sync mapping meeting blocks and conflict alerts.",
      icon: Calendar,
      color: "text-[#F97316]",
      bg: "bg-orange-50",
    },
    {
      name: "Google Workspace",
      desc: "Enterprise context processing built directly on Google SDK guidelines.",
      icon: Shield,
      color: "text-[#4285F4]",
      bg: "bg-blue-50",
    },
  ];

  return (
    <section className="relative py-24 bg-[#F7F3EC] select-none overflow-hidden border-t border-[rgba(17,24,39,0.03)]">
      <div className="max-w-5xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-[11px] font-bold text-[#C67B3D] tracking-[0.2em] uppercase block">
            INTEGRATED CORE
          </span>
          <h2 className="text-[28px] sm:text-[36px] font-serif font-normal text-[#111827]">
            Built on tools you already use
          </h2>
          <p className="text-[13px] text-[#64748B] max-w-lg mx-auto leading-relaxed">
            Zentra links directly to your existing Google account. No new logins to manage, no scattered datasets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {integrations.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                className="bg-white border border-[rgba(17,24,39,0.05)] rounded-2xl p-6 flex flex-col items-center text-center space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)]"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.bg}`}>
                  <Icon className={`w-5.5 h-5.5 ${item.color}`} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-sans text-[14px] font-bold text-[#111827]">
                    {item.name}
                  </h3>
                  <p className="font-sans text-[11.5px] text-[#64748B] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
