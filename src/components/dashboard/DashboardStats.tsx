"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Mail,
  Calendar,
  MessageCircle,
  RefreshCw,
  Bell,
  ShieldCheck,
  Plus,
  ExternalLink,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface NextEventData {
  summary: string;
  start: {
    dateTime?: string;
    date?: string;
  } | null;
  end: {
    dateTime?: string;
    date?: string;
  } | null;
}

interface StatsData {
  unreadCount: number;
  sentCount: number;
  eventsTodayCount: number;
  nextEvent: NextEventData | null;
  gmailConnected: boolean;
  calendarConnected: boolean;
}

interface DashboardStatsProps {
  children: React.ReactNode;
  firstName: string;
}

export function DashboardStats({ children, firstName }: DashboardStatsProps) {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/dashboard/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to load dashboard stats client-side:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch("/api/gmail/refresh", { method: "POST" });
      if (!res.ok) throw new Error("Failed to sync new messages");
      toast.success("Workspace synced successfully.");
      await fetchStats();
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? (err as Error).message : undefined;
      toast.error(message ?? "Failed to sync inbox.");
    } finally {
      setSyncing(false);
    }
  };

  const getEventTimeText = (event: NextEventData) => {
    const startStr = event.start?.dateTime ?? event.start?.date;
    if (!startStr) return "soon";
    const startDate = new Date(startStr);
    const timeStr = startDate.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
    const diff = startDate.getTime() - new Date().getTime();
    if (diff <= 0) return "starting now";
    const mins = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(mins / 60);
    if (hours > 0) {
      return `at ${timeStr} (in ${hours}h ${mins % 60}m)`;
    }
    return `at ${timeStr} (in ${mins}m)`;
  };

  // Construct a calm status description
  const getCalmContext = () => {
    if (loading) return "Checking your communication and schedule status...";
    if (!data) return "Zentra is holding space for your focus today.";

    const unread = data.unreadCount;
    const events = data.eventsTodayCount;

    if (unread === 0 && events === 0) {
      return "All systems are quiet. Your inbox is completely organized, and your schedule is peacefully clear.";
    }

    let emailStatus = unread === 1 ? "1 unread item" : `${unread} unread items`;
    if (unread === 0) emailStatus = "no unread items";

    let calendarStatus =
      events === 1 ? "1 event today" : `${events} events today`;
    if (events === 0) calendarStatus = "no events today";

    return `Zentra is quietly managing your workspace. Your inbox has ${emailStatus}, and you have ${calendarStatus}.`;
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 select-none">
      {/* ── Top Area: Greeting & Context ── */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 select-none">
        <div className="space-y-2 max-w-2xl">
          <h1 className="font-serif text-[36px] sm:text-[42px] font-normal tracking-tight text-espresso leading-tight">
            Good morning, {firstName}.
          </h1>
          <p className="font-sans text-[16px] text-espresso-400 leading-relaxed font-normal">
            {getCalmContext()}
          </p>
        </div>

        {/* Dynamic Context Date */}
        <div className="bg-cream-200 border border-border/30 rounded-xl px-4 py-2 flex items-center gap-2 flex-shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse" />
          <span className="font-sans text-[15px] font-medium text-espresso-400">
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              day: "numeric",
              month: "short",
            })}
          </span>
        </div>
      </div>

      {/* ── Quick Actions Row ── */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleSync}
          disabled={syncing}
          className="inline-flex items-center gap-2 bg-white hover:bg-cream-200 text-espresso text-[15px] font-medium px-4 py-2.5 rounded-xl border border-border/30 shadow-card hover:shadow-card-hover transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 text-peach ${syncing ? "animate-spin" : ""}`}
          />
          Sync Workspace
        </button>

        <Link
          href="/dashboard/gmail"
          className="inline-flex items-center gap-2 bg-white hover:bg-cream-200 text-espresso text-[15px] font-medium px-4 py-2.5 rounded-xl border border-border/30 shadow-card hover:shadow-card-hover transition-all"
        >
          <Mail className="w-4 h-4 text-peach" />
          Write Draft
        </Link>

        <Link
          href="/dashboard/calendar"
          className="inline-flex items-center gap-2 bg-white hover:bg-cream-200 text-espresso text-[15px] font-medium px-4 py-2.5 rounded-xl border border-border/30 shadow-card hover:shadow-card-hover transition-all"
        >
          <Calendar className="w-4 h-4 text-peach" />
          Calendar
        </Link>
      </div>

      {/* ── Center Area: Workspace Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Side: Primary AI Workspace (ChatPanel) */}
        <div className="lg:col-span-8 bg-white border border-border/30 rounded-[28px] overflow-hidden shadow-card flex flex-col h-[600px] hover:shadow-card-hover transition-shadow duration-300">
          {children}
        </div>

        {/* Right Side: Calm Focus / Attention Panel */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-cream-200/40 rounded-[28px] p-6 border border-border/20 flex flex-col justify-between h-full space-y-6">
            <div>
              <h2 className="font-serif text-[24px] font-normal text-espresso leading-none mb-6">
                Attention
              </h2>

              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full bg-cream-300 rounded-2xl" />
                  <Skeleton className="h-20 w-full bg-cream-300 rounded-2xl" />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Item 1: Upcoming Event */}
                  {data?.nextEvent ? (
                    <div className="p-5 bg-white border border-border/10 rounded-2xl shadow-[0_2px_12px_rgba(28,36,49,0.01)] space-y-2 text-left">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-peach" />
                        <span className="font-sans text-[15px] font-medium text-espresso-300 uppercase tracking-wider">
                          Next Connection
                        </span>
                      </div>
                      <h3 className="font-serif text-[18px] text-espresso font-normal leading-snug">
                        {data.nextEvent.summary}
                      </h3>
                      <p className="font-sans text-[15px] text-peach-text">
                        {getEventTimeText(data.nextEvent)}
                      </p>
                    </div>
                  ) : null}

                  {/* Item 2: Inbox Status */}
                  <div className="p-5 bg-white border border-border/10 rounded-2xl shadow-[0_2px_12px_rgba(28,36,49,0.01)] space-y-2 text-left">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${data?.unreadCount && data.unreadCount > 0 ? "bg-peach" : "bg-sage"}`}
                      />
                      <span className="font-sans text-[15px] font-medium text-espresso-300 uppercase tracking-wider">
                        Workspace Status
                      </span>
                    </div>
                    <h3 className="font-serif text-[18px] text-espresso font-normal leading-snug">
                      {data?.unreadCount && data.unreadCount > 0
                        ? `${data.unreadCount} unread email${data.unreadCount === 1 ? "" : "s"}`
                        : "Inbox is fully organized"}
                    </h3>
                    <p className="font-sans text-[15px] text-espresso-400">
                      {data?.unreadCount && data.unreadCount > 0
                        ? "Zentra is tracking conversations and preparing smart drafts in the background."
                        : "No action needed. Zentra is holding drafts for your review."}
                    </p>
                  </div>

                  {/* Item 3: Peace of mind card if all clear */}
                  {!data?.nextEvent &&
                  (!data?.unreadCount || data.unreadCount === 0) ? (
                    <div className="p-5 bg-white border border-border/10 rounded-2xl shadow-[0_2px_12px_rgba(28,36,49,0.01)] flex items-start gap-3 text-left">
                      <ShieldCheck className="w-5 h-5 text-sage flex-shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <h3 className="font-serif text-[18px] text-espresso font-normal">
                          Quiet Focus
                        </h3>
                        <p className="font-sans text-[15px] text-espresso-400 leading-normal">
                          No urgent connection conflicts or outstanding emails.
                          Zentra is silently maintaining order.
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {/* Subdued Chief-of-Staff Note */}
            <div className="border-t border-border/30 pt-4 text-center">
              <p className="font-sans text-[15px] text-espresso-300 italic">
                “Zentra quietly manages communication and schedules for you.”
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
