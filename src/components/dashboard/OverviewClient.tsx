"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Calendar,
  Sparkles,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Plus,
  Search,
  Zap,
  TrendingUp,
  Clock,
  MapPin,
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { ComposeModal } from "@/src/components/gmail/ComposeModal";
import { EventModal } from "@/src/components/shared/EventModal";

interface NextEventData {
  summary: string;
  start: { dateTime?: string; date?: string } | null;
  end: { dateTime?: string; date?: string } | null;
}

interface StatsData {
  unreadCount: number;
  sentCount: number;
  eventsTodayCount: number;
  nextEvent: NextEventData | null;
  gmailConnected: boolean;
  calendarConnected: boolean;
}

interface OverviewClientProps {
  firstName: string;
}

export function OverviewClient({ firstName }: OverviewClientProps) {
  const router = useRouter();
  const [data, setData] = useState<StatsData | null>(null);
  const [recentEmails, setRecentEmails] = useState<any[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");

  // Modals state
  const [composeOpen, setComposeOpen] = useState(false);
  const [eventOpen, setEventOpen] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/dashboard/stats");
      if (res.ok) setData(await res.json());
    } catch { /* silent */ }
  };

  const fetchRecentEmails = async () => {
    try {
      const res = await fetch("/api/gmail/inbox");
      if (res.ok) {
        const d = await res.json();
        setRecentEmails((d.messages ?? []).slice(0, 4));
      }
    } catch { /* silent */ }
  };

  const fetchCalendarEvents = async () => {
    try {
      const res = await fetch("/api/calendar/events");
      if (res.ok) {
        const d = await res.json();
        setCalendarEvents(d.slice(0, 4));
      }
    } catch { /* silent */ }
  };

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([fetchStats(), fetchRecentEmails(), fetchCalendarEvents()]);
    setLoading(false);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch("/api/gmail/refresh", { method: "POST" });
      if (!res.ok) throw new Error("Sync failed");
      toast.success("Workspace synced.");
      await loadAllData();
    } catch (err: any) {
      toast.error(err.message ?? "Sync failed.");
    } finally {
      setSyncing(false);
    }
  };

  const handleAiCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    router.push(`/dashboard/assistant?prompt=${encodeURIComponent(aiPrompt.trim())}`);
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric"
  });

  const getGreetingText = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return `Good morning, ${firstName}.`;
    if (hrs < 17) return `Good afternoon, ${firstName}.`;
    return `Good evening, ${firstName}.`;
  };

  const gmailConnected = data?.gmailConnected ?? false;
  const calConnected = data?.calendarConnected ?? false;

  const quickPrompts = [
    "Summarize urgent emails",
    "Show calendar conflicts",
    "Draft reply to Vikram",
    "Prepare workspace brief"
  ];

  return (
    <div className="min-h-screen px-6 sm:px-8 py-10 max-w-[1280px] mx-auto w-full space-y-10">

      {/* ─── 1. Greeting Header ─── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <span className="text-[11px] font-bold text-[#C67B3D] tracking-[0.15em] uppercase block mb-1">
            {today}
          </span>
          <h1 className="text-[36px] sm:text-[46px] font-serif font-normal tracking-tight text-[#111827] leading-tight">
            {getGreetingText()}
          </h1>
          <p className="text-[13.5px] text-[#64748B] mt-1">
            {loading
              ? "Configuring your workspace data..."
              : gmailConnected && calConnected
                ? "All channels synchronized. Zentra AI is watching over your inbox and schedule."
                : "Link your Google integrations to enable full AI assistance."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSync}
            disabled={syncing || loading}
            className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-white border border-[rgba(17,24,39,0.08)] hover:bg-[#F7F2EA] font-sans text-[12.5px] font-semibold text-[#111827] transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#C67B3D] ${syncing ? "animate-spin" : ""}`} />
            Sync Workspace
          </button>
        </div>
      </motion.div>

      {/* ─── 2. Floating Quick Actions ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            title: "New Email",
            desc: "Draft message",
            color: "rgba(198, 123, 61, 0.08)",
            icon: Mail,
            action: () => setComposeOpen(true)
          },
          {
            title: "New Event",
            desc: "Schedule slot",
            color: "rgba(91, 122, 140, 0.08)",
            icon: Calendar,
            action: () => setEventOpen(true)
          },
          {
            title: "Ask AI",
            desc: "Ask anything about your inbox or calendar",
            color: "rgba(109, 138, 104, 0.08)",
            icon: Sparkles,
            action: () => router.push("/dashboard/assistant")
          },
          {
            title: "Search",
            desc: "Command menu",
            color: "rgba(17, 24, 39, 0.04)",
            icon: Search,
            action: () => window.dispatchEvent(new CustomEvent("open-zentra-command"))
          }
        ].map((act, index) => {
          const Icon = act.icon;
          return (
            <motion.button
              key={act.title}
              onClick={act.action}
              whileHover={{ y: -3, boxShadow: "0 12px 30px rgba(0,0,0,0.04)" }}
              className="p-5 rounded-[20px] bg-white border border-[rgba(17,24,39,0.06)] flex items-start gap-4 text-left transition-all duration-300 shadow-xs cursor-pointer group"
            >
              <div
                style={{ backgroundColor: act.color }}
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              >
                <Icon className="w-4.5 h-4.5 text-[#111827] group-hover:text-[#C67B3D] transition-colors" />
              </div>
              <div>
                <p className="font-sans text-[13.5px] font-bold text-[#111827] leading-tight">
                  {act.title}
                </p>
                <p className="font-sans text-[11px] text-[#64748B] mt-0.5">
                  {act.desc}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* ─── 3. AI Centerpiece Command Center ─── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          background: "linear-gradient(135deg, rgba(17,24,39,0.95) 0%, rgba(30,41,59,0.98) 100%)",
        }}
        className="p-8 sm:p-10 rounded-[24px] shadow-[0_30px_70px_rgba(0,0,0,0.12)] border border-[#1e293b] text-white relative overflow-hidden"
      >
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-[400px] h-[300px] rounded-full bg-[#C67B3D]/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-[#C67B3D]" />
              <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">AI Assistant</span>
            </div>
            <h2 className="text-[24px] font-serif font-normal text-white">
              How can I help today?
            </h2>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleAiCommandSubmit} className="relative z-10 flex gap-3 max-w-4xl">
          <div className="relative flex-1">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Ask Zentra to draft an email, check calendar overlaps, or summarize recent notifications..."
              className="w-full bg-white/10 hover:bg-white/12 focus:bg-white/15 border border-white/10 focus:border-[#C67B3D] text-white rounded-xl py-3.5 pl-4 pr-12 text-[14px] placeholder-white/40 outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={!aiPrompt.trim()}
            className="px-6 rounded-xl bg-white hover:bg-[#F7F2EA] text-[#111827] hover:text-[#C67B3D] text-[13px] font-bold transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            <span>Ask AI</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Suggestion pills */}
        <div className="relative z-10 flex flex-wrap gap-2 mt-5">
          {quickPrompts.map((pill) => (
            <button
              key={pill}
              type="button"
              onClick={() => setAiPrompt(pill)}
              className="text-[11.5px] text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg px-3 py-1 transition-all cursor-pointer"
            >
              {pill}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ─── 4. Metrics Grid ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Metric 1: Unread */}
        <div className="p-6 rounded-[24px] bg-white border border-[rgba(17,24,39,0.06)] shadow-xs relative">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[11.5px] font-bold text-[#64748B] uppercase tracking-wider">Inbox</span>
            <Mail className="w-4.5 h-4.5 text-[#C67B3D]" />
          </div>
          {loading ? (
            <Skeleton className="h-9 w-12 bg-cream-200 rounded mb-1" />
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="text-[34px] font-serif text-[#111827] font-semibold leading-none">
                {gmailConnected ? data?.unreadCount ?? 0 : "—"}
              </span>
              <span className="text-[12px] text-[#64748B]">priorities unread</span>
            </div>
          )}
          <p className="text-[12px] text-[#64748B] mt-2">
            {gmailConnected ? "Connected to Gmail." : "Connect Gmail to index messages."}
          </p>
        </div>

        {/* Metric 2: Events */}
        <div className="p-6 rounded-[24px] bg-white border border-[rgba(17,24,39,0.06)] shadow-xs relative">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[11.5px] font-bold text-[#64748B] uppercase tracking-wider">Today's Schedule</span>
            <Calendar className="w-4.5 h-4.5 text-[#C67B3D]" />
          </div>
          {loading ? (
            <Skeleton className="h-9 w-12 bg-cream-200 rounded mb-1" />
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="text-[34px] font-serif text-[#111827] font-semibold leading-none">
                {calConnected ? data?.eventsTodayCount ?? 0 : "—"}
              </span>
              <span className="text-[12px] text-[#64748B]">Events today</span>
            </div>
          )}
          <p className="text-[12px] text-[#64748B] mt-2">
            {calConnected && data?.nextEvent ? `Next: "${data.nextEvent.summary}"` : "No upcoming conflicts."}
          </p>
        </div>

        {/* Metric 3: Integrations */}
        <div className="p-6 rounded-[24px] bg-white border border-[rgba(17,24,39,0.06)] shadow-xs relative">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[11.5px] font-bold text-[#64748B] uppercase tracking-wider">Connected Apps</span>
            <ShieldCheck className="w-4.5 h-4.5 text-[#6D8A68]" />
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-[#64748B]">Gmail</span>
              <span className={`px-2 py-0.5 rounded text-[10.5px] font-bold uppercase ${gmailConnected ? "bg-[#6D8A68]/10 text-[#6D8A68]" : "bg-red-50 text-red-500"}`}>
                {gmailConnected ? "Connected" : "Offline"}
              </span>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-[#64748B]">Google Calendar</span>
              <span className={`px-2 py-0.5 rounded text-[10.5px] font-bold uppercase ${calConnected ? "bg-[#6D8A68]/10 text-[#6D8A68]" : "bg-red-50 text-red-500"}`}>
                {calConnected ? "Connected" : "Offline"}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ─── 5. Dynamic Activity & Timeline ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left: Recent Activity Feed (Span 7) */}
        <div className="lg:col-span-7 space-y-4 text-left">
          <h3 className="font-serif text-[20px] font-normal text-[#111827]">
            Inbox priorities
          </h3>

          <div className="p-6 rounded-[24px] bg-white border border-[rgba(17,24,39,0.06)] shadow-xs space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full bg-cream-200 rounded" />
                ))}
              </div>
            ) : !gmailConnected ? (
              <div className="py-12 text-center text-[#64748B]">
                <Mail className="w-8 h-8 mx-auto mb-2 text-[#64748B]/40" />
                <p className="text-[13px] font-bold">Gmail not connected</p>
                <p className="text-[12px] text-[#64748B] mt-1">Connect your Gmail integration to view recent threads.</p>
                <a href="/api/connect?plugin=gmail" className="inline-block mt-4 px-4 py-2 bg-[#111827] text-white rounded-xl text-[12px] font-bold">
                  Connect Gmail
                </a>
              </div>
            ) : recentEmails.length === 0 ? (
              <p className="text-[13px] text-[#64748B] italic py-8 text-center">No recent priorities detected.</p>
            ) : (
              <div className="divide-y divide-[rgba(17,24,39,0.06)]">
                {recentEmails.map((email) => {
                  const unread = email.labelIds.includes("UNREAD");
                  const sender = email.from.split("<")[0].replace(/"/g, "").trim() || "Unknown";
                  return (
                    <Link
                      href={`/dashboard/communications?folder=inbox`}
                      key={email.id}
                      className="flex justify-between items-start py-3.5 group hover:bg-[#F7F2EA]/20 px-2 rounded-xl transition-all"
                    >
                      <div className="min-w-0 flex-1 pr-4">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-[12.5px] ${unread ? "font-bold text-[#111827]" : "text-[#64748B]"}`}>
                            {sender}
                          </span>
                          {unread && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C67B3D]" />
                          )}
                        </div>
                        <p className={`text-[12px] truncate ${unread ? "font-semibold text-[#111827]" : "text-[#64748B]"}`}>
                          {email.subject}
                        </p>
                        <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                          {email.snippet}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#64748B]/30 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 self-center" />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Schedule Timeline (Span 5) */}
        <div className="lg:col-span-5 space-y-4 text-left">
          <h3 className="font-serif text-[20px] font-normal text-[#111827]">
            Today's schedule
          </h3>

          <div className="p-6 rounded-[24px] bg-white border border-[rgba(17,24,39,0.06)] shadow-xs space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full bg-cream-200 rounded" />
                ))}
              </div>
            ) : !calConnected ? (
              <div className="py-12 text-center text-[#64748B]">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-[#64748B]/40" />
                <p className="text-[13px] font-bold">Calendar not connected</p>
                <p className="text-[12px] text-[#64748B] mt-1">Connect your Google Calendar integration to view schedules.</p>
                <a href="/api/connect?plugin=googlecalendar" className="inline-block mt-4 px-4 py-2 bg-[#111827] text-white rounded-xl text-[12px] font-bold">
                  Connect Calendar
                </a>
              </div>
            ) : calendarEvents.length === 0 ? (
              <div className="py-8 text-center text-[#64748B] text-[13px] italic">
                No events scheduled for today.
              </div>
            ) : (
              <div className="space-y-3.5 relative pl-4 border-l border-[rgba(198,123,61,0.2)]">
                {calendarEvents.map((ev, idx) => {
                  const startStr = ev.start?.dateTime ?? ev.start?.date;
                  const timeLabel = startStr
                    ? new Date(startStr).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
                    : "All Day";
                  return (
                    <div key={ev.id} className="relative space-y-1">
                      {/* Timeline dot */}
                      <span className="absolute -left-[20.5px] top-1.5 w-2 h-2 rounded-full bg-[#C67B3D] border border-white" />

                      <div className="text-[11.5px] text-[#C67B3D] font-bold">{timeLabel}</div>
                      <p className="text-[13px] font-bold text-[#111827] leading-snug">
                        {ev.summary}
                      </p>
                      {ev.location && (
                        <p className="text-[11px] text-[#64748B] flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {ev.location}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ─── Shared Modals ─── */}
      <ComposeModal open={composeOpen} onOpenChange={setComposeOpen} />

      <EventModal
        open={eventOpen}
        onOpenChange={setEventOpen}
        mode="create"
        onSaved={loadAllData}
      />

    </div>
  );
}
