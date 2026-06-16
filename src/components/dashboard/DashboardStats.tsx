"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, Calendar, MessageCircle, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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
}

export function DashboardStats({ children }: DashboardStatsProps) {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchStats();
  }, []);

  const formatEventTime = (event: NextEventData) => {
    const startStr = event.start?.dateTime ?? event.start?.date;
    if (!startStr) return "";
    const startDate = new Date(startStr);
    return startDate.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };

  const getEventTimeLeft = (event: NextEventData) => {
    const startStr = event.start?.dateTime ?? event.start?.date;
    if (!startStr) return "";
    const diff = new Date(startStr).getTime() - new Date().getTime();
    if (diff <= 0) return "starting now";
    
    const mins = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(mins / 60);
    
    if (hours > 0) {
      return `at ${formatEventTime(event)} (${hours}h ${mins % 60}m remaining)`;
    }
    return `at ${formatEventTime(event)} (${mins}m remaining)`;
  };

  return (
    <div className="space-y-6">
      {/* Quick Access Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Gmail Card */}
        <Link href="/dashboard/gmail" className="block select-none">
          <div className="bg-white border border-border/80 border-t-4 border-t-peach rounded-2xl px-5 py-3.5 flex items-center justify-between cursor-pointer shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-9.5 h-9.5 rounded-xl flex items-center justify-center bg-peach-soft text-peach-text flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="font-sans text-[10.5px] font-medium text-espresso uppercase tracking-wider opacity-85">gmail</p>
                {loading ? (
                  <Skeleton className="h-4 w-18 bg-cream-300 mt-1" />
                ) : (
                  <p className="font-serif text-[16px] text-espresso mt-0.5">
                    {data?.unreadCount ?? 0} unread
                  </p>
                )}
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-espresso-300 flex-shrink-0" />
          </div>
        </Link>

        {/* Calendar Card */}
        <Link href="/dashboard/calendar" className="block select-none">
          <div className="bg-white border border-border/80 border-t-4 border-t-sky rounded-2xl px-5 py-3.5 flex items-center justify-between cursor-pointer shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-9.5 h-9.5 rounded-xl flex items-center justify-center bg-sky-soft text-sky-text flex-shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="font-sans text-[10.5px] font-medium text-espresso uppercase tracking-wider opacity-85">calendar</p>
                {loading ? (
                  <Skeleton className="h-4 w-18 bg-cream-300 mt-1" />
                ) : (
                  <p className="font-serif text-[16px] text-espresso mt-0.5">
                    {data?.eventsTodayCount ?? 0} events today
                  </p>
                )}
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-espresso-300 flex-shrink-0" />
          </div>
        </Link>

        {/* Chat Card */}
        <Link href="/dashboard/chat" className="block select-none">
          <div className="bg-white border border-border/80 border-t-4 border-t-lavender rounded-2xl px-5 py-3.5 flex items-center justify-between cursor-pointer shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-9.5 h-9.5 rounded-xl flex items-center justify-center bg-lavender-soft text-lavender-text flex-shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="font-sans text-[10.5px] font-medium text-espresso uppercase tracking-wider opacity-85">ai assistant</p>
                <p className="font-serif text-[16px] text-espresso mt-0.5">ask anything</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-espresso-300 flex-shrink-0" />
          </div>
        </Link>
      </div>

      {/* Stats Cards and Chat row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Left Side: Real ChatPanel */}
        <div className="md:col-span-8 bg-white border border-border/80 rounded-3xl overflow-hidden shadow-card md:h-[580px] flex flex-col hover:shadow-card-hover transition-shadow duration-300">
          {children}
        </div>

        {/* Right Side: Stats Panel */}
        <div className="md:col-span-4 flex flex-col gap-4 md:h-[580px]">
          {/* Card 1: Unread Emails */}
          <Card className="p-6 bg-white border border-border/80 border-l-4 border-l-peach rounded-2xl shadow-card hover:shadow-card-hover transition-shadow duration-300 flex flex-col justify-between flex-1 min-h-[145px]">
            <div>
              <span className="font-sans text-[12px] text-espresso-300 uppercase tracking-wider font-medium">
                unread emails
              </span>
              {loading ? (
                <div className="mt-4 space-y-2">
                  <Skeleton className="h-9 w-28 bg-cream-300 rounded" />
                  <Skeleton className="h-4 w-36 bg-cream-200 rounded" />
                </div>
              ) : (
                <>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-serif text-[42px] font-normal text-espresso leading-none">
                      {data?.unreadCount ?? 0}
                    </span>
                    <span className="font-sans text-[15px] text-espresso-300">emails</span>
                  </div>
                  <p className="font-sans text-[13px] text-espresso-300 mt-2">
                    synced and categorized
                  </p>
                </>
              )}
            </div>
          </Card>

          {/* Card 2: Sent Today */}
          <Card className="p-6 bg-white border border-border/80 border-l-4 border-l-blush rounded-2xl shadow-card hover:shadow-card-hover transition-shadow duration-300 flex flex-col justify-between flex-1 min-h-[145px]">
            <div>
              <span className="font-sans text-[12px] text-espresso-300 uppercase tracking-wider font-medium">
                sent today
              </span>
              {loading ? (
                <div className="mt-4 space-y-2">
                  <Skeleton className="h-9 w-20 bg-cream-300 rounded" />
                  <Skeleton className="h-4 w-40 bg-cream-200 rounded" />
                </div>
              ) : (
                <>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-serif text-[42px] font-normal text-espresso leading-none">
                      {data?.sentCount ?? 0}
                    </span>
                    <span className="font-sans text-[15px] text-espresso-300">replies</span>
                  </div>
                  <p className="font-sans text-[13px] text-espresso-300 mt-2">
                    sent through Zentra assist
                  </p>
                </>
              )}
            </div>
          </Card>

          {/* Card 3: Next Event */}
          <Card className="p-6 bg-white border border-border/80 border-l-4 border-l-sky rounded-2xl shadow-card hover:shadow-card-hover transition-shadow duration-300 flex flex-col justify-between flex-1 min-h-[145px]">
            <div>
              <span className="font-sans text-[12px] text-espresso-300 uppercase tracking-wider font-medium">
                next event
              </span>
              {loading ? (
                <div className="mt-4 space-y-2">
                  <Skeleton className="h-6 w-44 bg-cream-300 rounded" />
                  <Skeleton className="h-4.5 w-36 bg-cream-200 rounded" />
                </div>
              ) : data?.nextEvent ? (
                <>
                  <div className="mt-2 flex flex-col gap-0.5">
                    <span className="font-serif text-[20px] font-normal text-espresso truncate">
                      {data.nextEvent.summary}
                    </span>
                    <span className="font-sans text-[13px] text-peach-text mt-0.5">
                      {getEventTimeLeft(data.nextEvent)}
                    </span>
                  </div>
                  <p className="font-sans text-[13px] text-espresso-300 mt-2.5">
                    synced from Google Calendar
                  </p>
                </>
              ) : (
                <>
                  <div className="mt-3 text-[14px] text-espresso-400 font-sans">
                    No upcoming events
                  </div>
                  <p className="font-sans text-[13px] text-espresso-300 mt-4">
                    schedule is fully clear
                  </p>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
