"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Mail,
  Calendar,
  Sparkles,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Plug,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

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

function getGreeting(firstName: string) {
  const h = new Date().getHours();
  const time = h < 12 ? "morning" : h < 17 ? "afternoon" : "evening";
  return `Good ${time}, ${firstName}.`;
}

function getEventTimeText(event: NextEventData) {
  const startStr = event.start?.dateTime ?? event.start?.date;
  if (!startStr) return "soon";
  const startDate = new Date(startStr);
  const timeStr = startDate.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const diff = startDate.getTime() - Date.now();
  if (diff <= 0) return "starting now";
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  return hours > 0
    ? `${timeStr} · in ${hours}h ${mins % 60}m`
    : `${timeStr} · in ${mins}m`;
}


export function OverviewClient({ firstName }: OverviewClientProps) {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/dashboard/stats");
      if (res.ok) setData(await res.json());
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStats(); }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch("/api/gmail/refresh", { method: "POST" });
      if (!res.ok) throw new Error("Sync failed");
      toast.success("Workspace synced.");
      await fetchStats();
    } catch (err: any) {
      toast.error(err.message ?? "Sync failed.");
    } finally {
      setSyncing(false);
    }
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  const gmailConnected = data?.gmailConnected ?? false;
  const calConnected = data?.calendarConnected ?? false;
  const bothConnected = gmailConnected && calConnected;
  const noneConnected = !gmailConnected && !calConnected;

  return (
    <div className="min-h-screen p-8 max-w-[960px] mx-auto">

      {/* ── Greeting ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="mb-8 flex items-start justify-between"
      >
        <div>
          <p className="font-sans text-[13px] text-espresso-300 mb-1 tabular-nums">{today}</p>
          <h1 className="font-display text-[42px] font-normal text-espresso leading-[1.1] tracking-[-0.02em]">
            {getGreeting(firstName)}
          </h1>
          <p className="font-sans text-[14px] text-espresso-400 mt-1.5">
            {loading
              ? "Loading your workspace..."
              : noneConnected
              ? "Connect Gmail and Calendar to get started."
              : `${!gmailConnected ? "Gmail not connected. " : ""}${!calConnected ? "Calendar not connected." : "Zentra is watching over your workspace."}`}
          </p>
        </div>

        {gmailConnected && (
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-espresso-100 font-sans text-[13px] font-medium text-espresso hover:bg-cream-200 transition-all shadow-sm disabled:opacity-50 flex-shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-peach ${syncing ? "animate-spin" : ""}`} />
            Sync
          </button>
        )}
      </motion.div>

      {/* ── Integration Status Banner ─────────────────────────────── */}
      <AnimatePresence>
        {!loading && !bothConnected && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            {/* Full setup prompt when nothing is connected */}
            {noneConnected ? (
              <div className="bg-white border border-espresso-100 rounded-2xl p-7 text-center shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-peach-soft flex items-center justify-center mx-auto mb-4">
                  <Plug className="w-5 h-5 text-peach" />
                </div>
                <h2 className="font-display text-[24px] text-espresso font-normal mb-1.5">
                  Connect your accounts
                </h2>
                <p className="font-sans text-[14px] text-espresso-400 max-w-sm mx-auto mb-6 leading-relaxed">
                  Zentra needs access to Gmail and Google Calendar to manage your workspace.
                </p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <a
                    href="/api/connect?plugin=gmail"
                    className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-espresso text-white font-sans text-[13px] font-medium hover:bg-espresso/90 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Connect Gmail
                  </a>
                  <a
                    href="/api/connect?plugin=googlecalendar"
                    className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl border border-espresso-100 bg-white text-espresso font-sans text-[13px] font-medium hover:bg-cream-200 transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    Connect Calendar
                  </a>
                </div>
              </div>
            ) : (
              /* Partial connection — show individual banners */
              <div className="space-y-3">
                {!gmailConnected && (
                  <div className="flex items-center justify-between gap-4 bg-white border border-espresso-100 rounded-2xl px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-peach-soft flex items-center justify-center flex-shrink-0">
                        <Mail className="w-4 h-4 text-peach" />
                      </div>
                      <div>
                        <p className="font-sans text-[13px] font-semibold text-espresso">Gmail not connected</p>
                        <p className="font-sans text-[12px] text-espresso-300">Connect to read, draft, and organize emails.</p>
                      </div>
                    </div>
                    <a
                      href="/api/connect?plugin=gmail"
                      className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-espresso text-white font-sans text-[12px] font-medium hover:bg-espresso/90 transition-colors"
                    >
                      Connect Gmail
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
                {!calConnected && (
                  <div className="flex items-center justify-between gap-4 bg-white border border-espresso-100 rounded-2xl px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-sky-soft flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-4 h-4 text-sky" />
                      </div>
                      <div>
                        <p className="font-sans text-[13px] font-semibold text-espresso">Calendar not connected</p>
                        <p className="font-sans text-[12px] text-espresso-300">Connect to see events and schedule meetings.</p>
                      </div>
                    </div>
                    <a
                      href="/api/connect?plugin=googlecalendar"
                      className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-espresso-100 bg-white text-espresso font-sans text-[12px] font-medium hover:bg-cream-200 transition-colors"
                    >
                      Connect Calendar
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Content ──────────────────────────────────────────── */}
      <div className="grid grid-cols-12 gap-5">

        {/* Left: Nav Cards ─────────────────────────────────────── */}
        <div className="col-span-7 space-y-4">

          {/* Live Stats Row — only shown when connected */}
          {(gmailConnected || calConnected) && (
            <div className="grid grid-cols-2 gap-3 mb-2">
              {/* Unread */}
              <Link href="/dashboard/communications" className="group">
                <div className="card-premium p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-xl bg-peach-soft flex items-center justify-center">
                      <Mail className="w-4 h-4 text-peach" />
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-espresso-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  {loading ? (
                    <Skeleton className="h-8 w-10 bg-cream-300 mb-1 rounded" />
                  ) : gmailConnected ? (
                    <p className="font-display text-[30px] text-espresso leading-none mb-0.5">
                      {data?.unreadCount ?? 0}
                    </p>
                  ) : (
                    <p className="font-display text-[16px] text-espresso-300 leading-none mb-0.5">—</p>
                  )}
                  <p className="font-sans text-[11px] text-espresso-400">Unread emails</p>
                </div>
              </Link>

              {/* Events */}
              <Link href="/dashboard/calendar" className="group">
                <div className="card-premium p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-xl bg-sky-soft flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-sky" />
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-espresso-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  {loading ? (
                    <Skeleton className="h-8 w-10 bg-cream-300 mb-1 rounded" />
                  ) : calConnected ? (
                    <p className="font-display text-[30px] text-espresso leading-none mb-0.5">
                      {data?.eventsTodayCount ?? 0}
                    </p>
                  ) : (
                    <p className="font-display text-[16px] text-espresso-300 leading-none mb-0.5">—</p>
                  )}
                  <p className="font-sans text-[11px] text-espresso-400">Events today</p>
                </div>
              </Link>
            </div>
          )}

          {/* Primary Navigation Cards */}
          <h2 className="font-display text-[20px] text-espresso font-normal">
            Your workspace
          </h2>

          <div className="space-y-2.5">
            {/* Communications */}
            <Link href="/dashboard/communications" className="group block">
              <div className="card-premium p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-peach-soft flex items-center justify-center flex-shrink-0">
                  <Mail className="w-[18px] h-[18px] text-peach" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-sans text-[14px] font-semibold text-espresso">Communications</p>
                    {!loading && !gmailConnected && (
                      <span className="font-sans text-[10px] bg-cream-300 text-espresso-400 rounded-full px-2 py-0.5 border border-espresso-100">
                        Not connected
                      </span>
                    )}
                    {!loading && gmailConnected && data && data.unreadCount > 0 && (
                      <span className="font-sans text-[10px] font-semibold bg-peach text-white rounded-full px-2 py-0.5">
                        {data.unreadCount} unread
                      </span>
                    )}
                  </div>
                  <p className="font-sans text-[12px] text-espresso-400">
                    Read emails, draft replies, and manage your inbox
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-espresso-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </div>
            </Link>

            {/* Calendar */}
            <Link href="/dashboard/calendar" className="group block">
              <div className="card-premium p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-sky-soft flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-[18px] h-[18px] text-sky" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-sans text-[14px] font-semibold text-espresso">Calendar</p>
                    {!loading && !calConnected && (
                      <span className="font-sans text-[10px] bg-cream-300 text-espresso-400 rounded-full px-2 py-0.5 border border-espresso-100">
                        Not connected
                      </span>
                    )}
                    {!loading && calConnected && data && data.eventsTodayCount > 0 && (
                      <span className="font-sans text-[10px] font-semibold bg-sky text-white rounded-full px-2 py-0.5">
                        {data.eventsTodayCount} today
                      </span>
                    )}
                  </div>
                  <p className="font-sans text-[12px] text-espresso-400">
                    View events, schedule meetings, and plan your week
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-espresso-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </div>
            </Link>

            {/* Assistant */}
            <Link href="/dashboard/assistant" className="group block">
              <div className="card-premium p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-peach-soft flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-[18px] h-[18px] text-peach" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-[14px] font-semibold text-espresso mb-0.5">
                    Zentra AI
                  </p>
                  <p className="font-sans text-[12px] text-espresso-400">
                    Ask about your inbox, draft emails, summarize threads, schedule meetings
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-espresso-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </div>
            </Link>
          </div>
        </div>

        {/* Right: Status + Upcoming ────────────────────────────── */}
        <div className="col-span-5 space-y-4">

          {/* Integration Status */}
          <div>
            <h2 className="font-display text-[20px] text-espresso font-normal mb-3">
              Integrations
            </h2>
            <div className="card-premium overflow-hidden hover:transform-none hover:shadow-card hover:border-border/50">
              {/* Gmail Row */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-espresso-100">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-espresso-400 flex-shrink-0" />
                  <div>
                    <p className="font-sans text-[13px] font-medium text-espresso">Gmail</p>
                    <p className="font-sans text-[11px] text-espresso-300">
                      {loading ? "Checking..." : gmailConnected ? "Connected and syncing" : "Not connected"}
                    </p>
                  </div>
                </div>
                {loading ? (
                  <Skeleton className="w-16 h-6 rounded-lg bg-cream-300" />
                ) : gmailConnected ? (
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-sage" />
                    <span className="font-sans text-[11px] font-medium text-sage">Active</span>
                  </div>
                ) : (
                  <a
                    href="/api/connect?plugin=gmail"
                    className="font-sans text-[11px] font-semibold text-peach hover:text-peach-dark transition-colors flex items-center gap-1"
                  >
                    Connect
                    <ArrowRight className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Calendar Row */}
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-espresso-400 flex-shrink-0" />
                  <div>
                    <p className="font-sans text-[13px] font-medium text-espresso">Google Calendar</p>
                    <p className="font-sans text-[11px] text-espresso-300">
                      {loading ? "Checking..." : calConnected ? "Connected and syncing" : "Not connected"}
                    </p>
                  </div>
                </div>
                {loading ? (
                  <Skeleton className="w-16 h-6 rounded-lg bg-cream-300" />
                ) : calConnected ? (
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-sage" />
                    <span className="font-sans text-[11px] font-medium text-sage">Active</span>
                  </div>
                ) : (
                  <a
                    href="/api/connect?plugin=googlecalendar"
                    className="font-sans text-[11px] font-semibold text-peach hover:text-peach-dark transition-colors flex items-center gap-1"
                  >
                    Connect
                    <ArrowRight className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Upcoming Event — only if calendar connected */}
          {(loading || calConnected) && (
            <div>
              <h2 className="font-display text-[20px] text-espresso font-normal mb-3">
                Upcoming
              </h2>
              {loading ? (
                <Skeleton className="h-28 w-full rounded-2xl bg-cream-300" />
              ) : data?.nextEvent ? (
                <Link href="/dashboard/calendar" className="block">
                  <div className="card-premium p-5 group">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-peach animate-pulse" />
                      <span className="font-sans text-[10px] font-medium text-espresso-300 uppercase tracking-widest">
                        Next event
                      </span>
                    </div>
                    <h3 className="font-display text-[18px] text-espresso font-normal leading-snug mb-1">
                      {data.nextEvent.summary}
                    </h3>
                    <p className="font-sans text-[12px] text-peach font-medium">
                      {getEventTimeText(data.nextEvent)}
                    </p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-espresso-100">
                      <p className="font-sans text-[11px] text-espresso-300">Open in Calendar</p>
                      <ChevronRight className="w-3.5 h-3.5 text-espresso-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="card-premium p-5 hover:transform-none hover:shadow-card hover:border-border/50">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-sage flex-shrink-0" />
                    <div>
                      <p className="font-sans text-[13px] font-medium text-espresso">No upcoming events</p>
                      <p className="font-sans text-[12px] text-espresso-300">Your schedule is clear.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Ask AI Shortcut */}
          <Link href="/dashboard/assistant" className="block group">
            <div className="border border-dashed border-espresso-100/60 rounded-2xl p-5 bg-[#FFFDF9] hover:border-peach/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-peach-soft flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-peach" />
                </div>
                <div className="flex-1">
                  <p className="font-sans text-[13px] font-semibold text-espresso">Ask Zentra AI</p>
                  <p className="font-sans text-[11px] text-espresso-300">
                    Summarize, draft, or schedule — just ask.
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-espresso-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
