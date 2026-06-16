"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail, Calendar, Sparkles, RefreshCw, Star,
  Send, FileText, Clock, CheckCircle2, Zap,
} from "lucide-react";

type EventType = "email_received" | "email_sent" | "email_starred" | "meeting" | "ai_action" | "draft_saved" | "sync";

interface ActivityEvent {
  id: string;
  type: EventType;
  title: string;
  meta: string;
  time: string;
  tag?: string;
}

const mockActivity: ActivityEvent[] = [
  { id: "1", type: "ai_action", title: "Zentra drafted a reply", meta: "To: Sarah Chen — Re: Q3 Budget Review", time: "Just now", tag: "AI Draft" },
  { id: "2", type: "email_received", title: "New email received", meta: "From: Marcus Webb — Weekly retrospective", time: "4 min ago" },
  { id: "3", type: "meeting", title: "Meeting started", meta: "Q3 Planning Session · Google Meet", time: "12 min ago", tag: "Calendar" },
  { id: "4", type: "ai_action", title: "Zentra surfaced 3 priorities", meta: "2 urgent, 1 action needed in your inbox", time: "24 min ago", tag: "AI Insight" },
  { id: "5", type: "email_sent", title: "Email sent", meta: "To: design@company.com — Brand refresh", time: "1h ago" },
  { id: "6", type: "sync", title: "Workspace synced", meta: "14 new messages indexed and organized", time: "1h 20m ago" },
  { id: "7", type: "email_starred", title: "Email starred", meta: "From: CEO — Company all-hands agenda", time: "2h ago" },
  { id: "8", type: "draft_saved", title: "Draft saved", meta: "Re: Partnership proposal — 340 words", time: "2h 45m ago" },
  { id: "9", type: "meeting", title: "Meeting ended", meta: "1:1 with Alex · 45 minutes", time: "3h ago", tag: "Calendar" },
  { id: "10", type: "email_received", title: "New email received", meta: "From: newsletter@product.io — Weekly digest", time: "3h 30m ago" },
  { id: "11", type: "ai_action", title: "Zentra generated meeting prep", meta: "For: Q3 Planning — 4 relevant threads found", time: "4h ago", tag: "AI Insight" },
  { id: "12", type: "sync", title: "Daily workspace sync", meta: "Zentra reviewed inbox and calendar overnight", time: "8h ago" },
];

const iconMap: Record<EventType, { Icon: React.ElementType; bg: string; color: string }> = {
  email_received: { Icon: Mail, bg: "bg-sky-soft", color: "text-sky" },
  email_sent: { Icon: Send, bg: "bg-sage-soft", color: "text-sage" },
  email_starred: { Icon: Star, bg: "bg-butter-soft", color: "text-butter" },
  meeting: { Icon: Calendar, bg: "bg-lavender-soft", color: "text-lavender" },
  ai_action: { Icon: Sparkles, bg: "bg-peach-soft", color: "text-peach" },
  draft_saved: { Icon: FileText, bg: "bg-cream-300", color: "text-espresso-400" },
  sync: { Icon: RefreshCw, bg: "bg-sage-soft", color: "text-sage" },
};

const tagColors: Record<string, string> = {
  "AI Draft": "bg-peach-soft text-peach border-peach/10",
  "AI Insight": "bg-peach-soft text-peach border-peach/10",
  "Calendar": "bg-sky-soft text-sky border-sky/10",
};

const stagger = {
  animate: { transition: { staggerChildren: 0.04 } },
} as const;

const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
} as const;

export function ActivityClient() {
  const [filter, setFilter] = useState<"all" | EventType>("all");

  const filters = [
    { id: "all", label: "All Activity" },
    { id: "email_received", label: "Received" },
    { id: "email_sent", label: "Sent" },
    { id: "meeting", label: "Meetings" },
    { id: "ai_action", label: "AI Actions" },
  ] as const;

  const filtered = filter === "all"
    ? mockActivity
    : mockActivity.filter((e) => e.type === filter);

  const todayEvents = filtered.slice(0, 8);
  const olderEvents = filtered.slice(8);

  return (
    <div className="min-h-screen p-8 max-w-[800px] mx-auto">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8"
      >
        <h1 className="font-display text-[40px] text-espresso font-normal leading-[1.1] tracking-[-0.02em] mb-2">
          Activity
        </h1>
        <p className="font-sans text-[15px] text-espresso-400">
          A unified timeline of everything Zentra has done for you today.
        </p>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.4, ease: "easeOut" }}
        className="grid grid-cols-4 gap-4 mb-8"
      >
        {[
          { label: "Emails organized", value: "14", icon: Mail },
          { label: "AI actions taken", value: "3", icon: Sparkles },
          { label: "Meetings attended", value: "2", icon: Calendar },
          { label: "Drafts created", value: "1", icon: FileText },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white border border-espresso-100 rounded-2xl p-4">
              <div className="w-7 h-7 rounded-lg bg-cream-200 flex items-center justify-center mb-3">
                <Icon className="w-3.5 h-3.5 text-espresso-400" />
              </div>
              <p className="font-display text-[28px] text-espresso leading-none mb-0.5">{stat.value}</p>
              <p className="font-sans text-[11px] text-espresso-300">{stat.label}</p>
            </div>
          );
        })}
      </motion.div>

      {/* Filter pills */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.12 }}
        className="flex items-center gap-2 mb-6 flex-wrap"
      >
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as any)}
            className={`font-sans text-[12px] font-medium px-3.5 py-1.5 rounded-full border transition-all duration-200 ${
              filter === f.id
                ? "bg-espresso text-white border-espresso"
                : "bg-white text-espresso-400 border-espresso-100 hover:text-espresso hover:border-espresso-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </motion.div>

      {/* Timeline */}
      <motion.div variants={stagger} initial="initial" animate="animate">
        {/* Today */}
        <div className="mb-2">
          <p className="font-sans text-[11px] font-medium text-espresso-300 uppercase tracking-widest mb-4">
            Today
          </p>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-espresso-100" />
            
            <div className="space-y-1">
              {todayEvents.map((event, i) => {
                const { Icon, bg, color } = iconMap[event.type];
                return (
                  <motion.div key={event.id} variants={fadeUp}>
                    <div className="flex items-start gap-4 pl-0">
                      {/* Icon dot */}
                      <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center flex-shrink-0 z-10 relative border-2 border-cream-DEFAULT`}>
                        <Icon className={`w-3.5 h-3.5 ${color}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 bg-white border border-espresso-100 rounded-2xl p-4 hover:shadow-sm transition-shadow duration-200 mb-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                              <p className="font-sans text-[13px] font-semibold text-espresso">
                                {event.title}
                              </p>
                              {event.tag && (
                                <span className={`font-sans text-[10px] font-medium px-2 py-0.5 rounded-full border ${tagColors[event.tag] || "bg-cream-200 text-espresso-400 border-espresso-100"}`}>
                                  {event.tag}
                                </span>
                              )}
                            </div>
                            <p className="font-sans text-[12px] text-espresso-400 truncate">
                              {event.meta}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Clock className="w-3 h-3 text-espresso-300" />
                            <span className="font-sans text-[11px] text-espresso-300">{event.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Older */}
        {olderEvents.length > 0 && (
          <div>
            <p className="font-sans text-[11px] font-medium text-espresso-300 uppercase tracking-widest mb-4 mt-6">
              Earlier
            </p>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-espresso-100" />
              <div className="space-y-1">
                {olderEvents.map((event) => {
                  const { Icon, bg, color } = iconMap[event.type];
                  return (
                    <motion.div key={event.id} variants={fadeUp}>
                      <div className="flex items-start gap-4">
                        <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center flex-shrink-0 z-10 relative border-2 border-cream-DEFAULT opacity-70`}>
                          <Icon className={`w-3.5 h-3.5 ${color}`} />
                        </div>
                        <div className="flex-1 bg-white/60 border border-espresso-100/60 rounded-2xl p-4 mb-2">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-sans text-[13px] font-medium text-espresso-400">{event.title}</p>
                              <p className="font-sans text-[12px] text-espresso-300 truncate">{event.meta}</p>
                            </div>
                            <span className="font-sans text-[11px] text-espresso-300 flex-shrink-0">{event.time}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* End of timeline */}
        <motion.div variants={fadeUp} className="flex items-center justify-center pt-6 pb-4">
          <div className="flex items-center gap-2 text-espresso-300">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-sans text-[12px]">You're all caught up</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
