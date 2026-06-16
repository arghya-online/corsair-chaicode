"use client";

import React from "react";
import { Sparkles, Mail, Calendar, Zap, BookOpen, Clock } from "lucide-react";
import { ChatPanel } from "./ChatPanel";

const capabilities = [
  {
    icon: Mail,
    title: "Inbox Intelligence",
    description: "Summarize threads, draft replies, find emails by context.",
  },
  {
    icon: Calendar,
    title: "Calendar Context",
    description: "Schedule meetings, prep briefings, resolve conflicts.",
  },
  {
    icon: Zap,
    title: "Smart Drafts",
    description: "Generate professional replies with the right tone.",
  },
  {
    icon: BookOpen,
    title: "Thread Memory",
    description: "Surface relevant past conversations automatically.",
  },
];

export function AssistantClient() {
  return (
    <div className="flex h-screen bg-cream-DEFAULT overflow-hidden">

      {/* Left: Context Panel */}
      <aside
        className="w-[260px] flex-shrink-0 flex flex-col border-r p-5 space-y-6"
        style={{ borderColor: "rgba(17,24,39,0.07)", background: "#F7F3EC" }}
      >
        {/* Header */}
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-xl bg-peach-soft flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-peach" />
            </div>
            <h1 className="font-display text-[22px] text-espresso font-normal">
              Assistant
            </h1>
          </div>
          <p className="font-sans text-[12px] text-espresso-400 leading-relaxed">
            Your AI command center for communication and scheduling.
          </p>
        </div>

        {/* Live status */}
        <div className="bg-white border border-espresso-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-sage animate-pulse" />
            <span className="font-sans text-[11px] font-medium text-espresso-400 uppercase tracking-widest">
              Connected
            </span>
          </div>
          <p className="font-sans text-[12px] text-espresso-400 leading-relaxed">
            Reading synced Gmail and Calendar data. Responses reflect your real workspace.
          </p>
        </div>

        {/* Capabilities */}
        <div>
          <p className="font-sans text-[10px] font-medium text-espresso-300 uppercase tracking-widest mb-3">
            Capabilities
          </p>
          <div className="space-y-3">
            {capabilities.map((cap) => {
              const Icon = cap.icon;
              return (
                <div key={cap.title} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-cream-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-3.5 h-3.5 text-espresso-400" />
                  </div>
                  <div>
                    <p className="font-sans text-[12px] font-medium text-espresso">{cap.title}</p>
                    <p className="font-sans text-[11px] text-espresso-300 leading-relaxed">{cap.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* History note */}
        <div className="mt-auto pt-4 border-t border-espresso-100">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-espresso-300" />
            <p className="font-sans text-[11px] text-espresso-300">
              Conversation history is saved automatically.
            </p>
          </div>
        </div>
      </aside>

      {/* Right: Chat Interface */}
      <div className="flex-1 overflow-hidden">
        <ChatPanel />
      </div>
    </div>
  );
}
