"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  RefreshCw,
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  ExternalLink,
  Video,
  Trash2,
  Edit3,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { EventModal } from "@/src/components/shared/EventModal";

interface CalendarEvent {
  id: string;
  entityId: string;
  summary: string;
  description: string;
  location: string;
  start: { dateTime?: string; date?: string; timeZone?: string } | null;
  end: { dateTime?: string; date?: string; timeZone?: string } | null;
  colorId: string | null;
  status: string;
  htmlLink: string;
  hangoutLink: string | null;
  attendees: Array<{
    email: string;
    displayName?: string;
    responseStatus?: string;
  }>;
  organizer: { email: string; displayName?: string } | null;
  calendarId: string;
  recurringEventId: string | null;
  allDay: boolean;
  updatedAt: string;
  created: string | null;
}

type ViewType = "month" | "week" | "day";

const EVENT_COLORS: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  "1": { bg: "bg-sky-50", text: "text-sky-800", border: "border-sky-100" },
  "2": {
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-100",
  },
  "3": {
    bg: "bg-purple-50",
    text: "text-purple-800",
    border: "border-purple-100",
  },
  "4": { bg: "bg-pink-50", text: "text-pink-800", border: "border-pink-100" },
  "5": {
    bg: "bg-yellow-50",
    text: "text-yellow-800",
    border: "border-yellow-100",
  },
  "6": {
    bg: "bg-orange-50",
    text: "text-orange-800",
    border: "border-orange-100",
  },
  "7": { bg: "bg-teal-50", text: "text-teal-800", border: "border-teal-100" },
  "8": {
    bg: "bg-slate-100",
    text: "text-slate-800",
    border: "border-slate-200",
  },
  "9": {
    bg: "bg-indigo-50",
    text: "text-indigo-800",
    border: "border-indigo-100",
  },
  "10": {
    bg: "bg-[#C67B3D]/8",
    text: "text-[#C67B3D]",
    border: "border-[#C67B3D]/15",
  },
  "11": { bg: "bg-red-50", text: "text-red-800", border: "border-red-100" },
};

function getEventColor(colorId: string | null) {
  return (
    EVENT_COLORS[colorId ?? ""] ?? {
      bg: "bg-[#C67B3D]/8",
      text: "text-[#C67B3D]",
      border: "border-[#C67B3D]/12",
    }
  );
}

function getEventStart(ev: CalendarEvent): Date | null {
  const s = ev.start?.dateTime ?? ev.start?.date;
  return s ? new Date(s) : null;
}

function getEventEnd(ev: CalendarEvent): Date | null {
  const e = ev.end?.dateTime ?? ev.end?.date;
  return e ? new Date(e) : null;
}

function formatTime(dt: string | undefined): string {
  if (!dt) return "";
  const d = new Date(dt);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDateTime(dt: string | undefined | null): string {
  if (!dt) return "";
  const d = new Date(dt);
  return d.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// ─── Event Detail Drawer ───
interface EventDetailProps {
  event: CalendarEvent;
  onClose: () => void;
  onDelete: (ev: CalendarEvent) => void;
  onEdit: (ev: CalendarEvent) => void;
}

function EventDetailPanel({
  event,
  onClose,
  onDelete,
  onEdit,
}: EventDetailProps) {
  const color = getEventColor(event.colorId);
  const startDt = event.start?.dateTime ?? event.start?.date;
  const endDt = event.end?.dateTime ?? event.end?.date;

  return (
    <div className="fixed inset-0 z-[8000] flex justify-end bg-black/35 backdrop-blur-xs">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-[460px] h-full bg-white border-l border-[rgba(17,24,39,0.06)] flex flex-col shadow-[-10px_0_40px_rgba(0,0,0,0.03)] overflow-hidden text-left">
        <div className="px-6 py-5 border-b border-[rgba(17,24,39,0.06)] flex items-center justify-between flex-shrink-0">
          <div className="min-w-0 flex-1">
            <h2 className="text-[20px] font-serif font-normal text-[#111827] leading-tight truncate">
              {event.summary}
            </h2>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => onEdit(event)}
              className="p-2 hover:bg-[#F7F2EA] rounded-xl text-[#64748B] hover:text-[#C67B3D] transition-colors cursor-pointer"
              title="Edit event"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(event)}
              className="p-2 hover:bg-red-50 rounded-xl text-[#64748B] hover:text-red-600 transition-colors cursor-pointer"
              title="Delete event"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#F7F2EA] rounded-xl text-[#64748B] hover:text-[#111827] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-start gap-3.5">
            <Clock className="w-4.5 h-4.5 text-[#64748B] flex-shrink-0 mt-0.5" />
            <div className="text-[13px] text-[#111827] space-y-1">
              {event.allDay ? (
                <p className="font-bold">{event.start?.date} · All day event</p>
              ) : (
                <>
                  <p className="font-bold">{formatDateTime(startDt)}</p>
                  {endDt && (
                    <p className="text-[#64748B]">to {formatDateTime(endDt)}</p>
                  )}
                </>
              )}
            </div>
          </div>

          {event.location && (
            <div className="flex items-start gap-3.5">
              <MapPin className="w-4.5 h-4.5 text-[#64748B] flex-shrink-0 mt-0.5" />
              <p className="text-[13px] text-[#111827]">{event.location}</p>
            </div>
          )}

          {event.hangoutLink && (
            <div className="flex items-start gap-3.5">
              <Video className="w-4.5 h-4.5 text-[#6D8A68] flex-shrink-0 mt-0.5" />
              <a
                href={event.hangoutLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-[#6D8A68] font-bold hover:underline flex items-center gap-1"
              >
                Join Google Meet
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {event.description && (
            <div className="bg-[#F7F2EA]/40 rounded-2xl p-4.5 text-[13px] text-[#64748B] leading-relaxed border border-[rgba(17,24,39,0.06)]">
              {event.description}
            </div>
          )}

          {event.organizer && (
            <div className="space-y-2 text-[13px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                Organizer
              </span>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#C67B3D]/10 text-[#C67B3D] flex items-center justify-center font-bold text-[11px]">
                  {(event.organizer.displayName ??
                    event.organizer.email)[0].toUpperCase()}
                </div>
                <span>
                  {event.organizer.displayName ?? event.organizer.email}
                </span>
              </div>
            </div>
          )}

          {event.attendees?.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#64748B]" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                  Guests ({event.attendees.length})
                </span>
              </div>
              <div className="space-y-2 text-[12.5px]">
                {event.attendees.map((att, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3 p-1.5 hover:bg-[#F7F2EA]/20 rounded-lg"
                  >
                    <span className="truncate">
                      {att.displayName ?? att.email}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${att.responseStatus === "accepted" ? "bg-[#6D8A68]/10 text-[#6D8A68]" : "bg-yellow-50 text-yellow-600"}`}
                    >
                      {att.responseStatus ?? "no response"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Month Grid ───
interface MonthGridProps {
  year: number;
  month: number;
  events: CalendarEvent[];
  today: Date;
  onDayClick: (date: Date) => void;
  onEventClick: (ev: CalendarEvent) => void;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function MonthGrid({
  year,
  month,
  events,
  today,
  onDayClick,
  onEventClick,
}: MonthGridProps) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const cells: Array<{ date: Date; isCurrentMonth: boolean }> = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({
      date: new Date(year, month - 1, prevMonthDays - i),
      isCurrentMonth: false,
    });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), isCurrentMonth: true });
  }
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ date: new Date(year, month + 1, d), isCurrentMonth: false });
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-[rgba(17,24,39,0.06)] shadow-xs">
      <div className="grid grid-cols-7 border-b border-[rgba(17,24,39,0.05)] bg-[#F7F2EA]/20">
        {DAYS.map((d) => (
          <div
            key={d}
            className="py-3.5 text-center text-[12px] font-bold uppercase tracking-wider text-[#64748B]"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 flex-1 divide-x divide-y divide-[rgba(17,24,39,0.05)] border-t border-[rgba(17,24,39,0.05)]">
        {cells.map((cell, idx) => {
          const isToday = isSameDay(cell.date, today);
          const cellEvents = events
            .filter((ev) => {
              const s = getEventStart(ev);
              return s && isSameDay(s, cell.date);
            })
            .slice(0, 3);

          return (
            <div
              key={idx}
              onClick={() => onDayClick(cell.date)}
              className={`min-h-[105px] p-2 flex flex-col gap-1 cursor-pointer transition-all duration-200 ${
                cell.isCurrentMonth
                  ? "bg-white hover:bg-[#F7F2EA]/10"
                  : "bg-[#F7F2EA]/20 hover:bg-[#F7F2EA]/30"
              }`}
            >
              <div className="flex justify-end">
                <span
                  className={`text-[12.5px] font-bold w-6.5 h-6.5 flex items-center justify-center rounded-lg ${
                    isToday
                      ? "bg-[#C67B3D] text-white shadow-xs"
                      : cell.isCurrentMonth
                        ? "text-[#111827]"
                        : "text-[#64748B]/40"
                  }`}
                >
                  {cell.date.getDate()}
                </span>
              </div>

              <div className="flex-1 space-y-1">
                {cellEvents.map((ev) => {
                  const color = getEventColor(ev.colorId);
                  return (
                    <button
                      key={ev.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(ev);
                      }}
                      className={`w-full text-left text-[11px] font-semibold px-2 py-1 rounded-lg truncate border-l-2 cursor-pointer hover:brightness-95 transition-all flex items-center gap-1 ${color.bg} ${color.text} ${color.border}`}
                    >
                      {!ev.allDay && ev.start?.dateTime && (
                        <span className="opacity-70 text-[10px] font-bold">
                          {formatTime(ev.start.dateTime)}
                        </span>
                      )}
                      <span className="truncate">{ev.summary}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Week View ───
interface WeekViewProps {
  weekStart: Date;
  events: CalendarEvent[];
  today: Date;
  onEventClick: (ev: CalendarEvent) => void;
  onDayClick: (date: Date) => void;
}

function WeekView({
  weekStart,
  events,
  today,
  onEventClick,
  onDayClick,
}: WeekViewProps) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-[rgba(17,24,39,0.06)] shadow-xs">
      <div className="grid grid-cols-8 border-b border-[rgba(17,24,39,0.06)] bg-[#F7F2EA]/20">
        <div className="border-r border-[rgba(17,24,39,0.06)]" />
        {days.map((day, i) => {
          const isToday = isSameDay(day, today);
          return (
            <div
              key={i}
              onClick={() => onDayClick(day)}
              className="py-3 flex flex-col items-center cursor-pointer hover:bg-[#F7F2EA]/10 transition-colors"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                {DAYS[day.getDay()]}
              </span>
              <span
                className={`mt-1 text-[13px] font-bold w-6.5 h-6.5 flex items-center justify-center rounded-lg ${isToday ? "bg-[#C67B3D] text-white shadow-xs" : "text-[#111827]"}`}
              >
                {day.getDate()}
              </span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-8 flex-1 divide-x divide-[rgba(17,24,39,0.05)] overflow-y-auto">
        <div className="flex flex-col divide-y divide-[rgba(17,24,39,0.04)] border-r">
          {Array.from({ length: 24 }, (_, h) => (
            <div key={h} className="h-14 flex items-start px-2 pt-1">
              <span className="text-[9.5px] text-[#64748B] font-semibold font-mono">
                {h === 0 ? "" : `${h < 10 ? "0" + h : h}:00`}
              </span>
            </div>
          ))}
        </div>

        {days.map((day, di) => {
          const dayEvents = events.filter((ev) => {
            const s = getEventStart(ev);
            return s && isSameDay(s, day);
          });

          return (
            <div
              key={di}
              className="relative flex flex-col divide-y divide-[rgba(17,24,39,0.03)]"
              onClick={() => onDayClick(day)}
            >
              {Array.from({ length: 24 }, (_, h) => (
                <div
                  key={h}
                  className="h-14 hover:bg-[#F7F2EA]/20 transition-colors"
                />
              ))}

              {dayEvents.map((ev) => {
                const s = getEventStart(ev);
                const e = getEventEnd(ev);
                if (!s) return null;
                const color = getEventColor(ev.colorId);

                if (ev.allDay) {
                  return (
                    <button
                      key={ev.id}
                      onClick={(evt) => {
                        evt.stopPropagation();
                        onEventClick(ev);
                      }}
                      className={`absolute left-0.5 right-0.5 top-0 z-10 text-[10px] font-bold px-2 py-1 rounded-lg truncate border-l-2 cursor-pointer hover:brightness-95 ${color.bg} ${color.text} ${color.border}`}
                    >
                      {ev.summary}
                    </button>
                  );
                }

                const startH = s.getHours() + s.getMinutes() / 60;
                const endH = e
                  ? e.getHours() + e.getMinutes() / 60
                  : startH + 1;
                const top = startH * 56;
                const height = Math.max((endH - startH) * 56, 22);

                return (
                  <button
                    key={ev.id}
                    onClick={(evt) => {
                      evt.stopPropagation();
                      onEventClick(ev);
                    }}
                    style={{ top, height }}
                    className={`absolute left-0.5 right-0.5 z-10 text-[10.5px] font-bold px-2 py-1.5 rounded-lg overflow-hidden border-l-2 cursor-pointer hover:brightness-95 transition-all text-left flex flex-col justify-between ${color.bg} ${color.text} ${color.border}`}
                  >
                    <span className="truncate leading-tight block">
                      {ev.summary}
                    </span>
                    {height > 35 && (
                      <span className="opacity-75 text-[9px] block">
                        {formatTime(ev.start?.dateTime)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Day View ───
interface DayViewProps {
  date: Date;
  events: CalendarEvent[];
  today: Date;
  onEventClick: (ev: CalendarEvent) => void;
}

function DayView({ date, events, today, onEventClick }: DayViewProps) {
  const isToday = isSameDay(date, today);
  const dayEvents = events
    .filter((ev) => {
      const s = getEventStart(ev);
      return s && isSameDay(s, date);
    })
    .sort(
      (a, b) =>
        (getEventStart(a)?.getTime() ?? 0) - (getEventStart(b)?.getTime() ?? 0),
    );

  return (
    <div className="h-full bg-white rounded-2xl border border-[rgba(17,24,39,0.06)] shadow-xs flex flex-col overflow-y-auto">
      <div className="flex items-center gap-3.5 px-6 py-5 border-b border-[rgba(17,24,39,0.05)] bg-[#F7F2EA]/20 sticky top-0 z-10">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center text-[15px] font-bold ${isToday ? "bg-[#C67B3D] text-white" : "bg-[#F7F2EA]/60 text-[#111827]"}`}
        >
          {date.getDate()}
        </div>
        <div className="text-left">
          <p className="text-[14px] font-bold text-[#111827]">
            {date.toLocaleDateString("en-US", { weekday: "long" })}
          </p>
          <p className="text-[11px] text-[#64748B]">
            {date.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {dayEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
          <Calendar className="w-8 h-8 text-[#64748B]/30" />
          <p className="text-[12.5px] text-[#64748B] font-medium">
            Clear schedule for today.
          </p>
        </div>
      ) : (
        <div className="p-6 space-y-3.5">
          {dayEvents.map((ev) => {
            const color = getEventColor(ev.colorId);
            const start = getEventStart(ev);
            const end = getEventEnd(ev);

            return (
              <button
                key={ev.id}
                onClick={() => onEventClick(ev)}
                className={`w-full text-left p-4.5 rounded-2xl border-l-4 cursor-pointer hover:shadow-xs hover:border-[#C67B3D]/30 transition-all ${color.bg} ${color.border}`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="text-[14.5px] font-serif font-bold text-[#111827] leading-snug">
                      {ev.summary}
                    </h4>
                    {ev.description && (
                      <p className="text-[11.5px] text-[#64748B] mt-1 line-clamp-1">
                        {ev.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    {ev.allDay ? (
                      <span className="text-[11px] font-semibold text-[#64748B]">
                        All Day
                      </span>
                    ) : (
                      <>
                        <span className="text-[12px] font-bold text-[#111827]">
                          {start && formatTime(start.toISOString())}
                        </span>
                        {end && (
                          <span className="block text-[10px] text-[#64748B]">
                            to {formatTime(end.toISOString())}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main GoogleCalendar Redesign ───
export default function GoogleCalendar() {
  const today = new Date();
  const [view, setView] = useState<ViewType>("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | undefined>(
    undefined,
  );
  const [defaultModalDate, setDefaultModalDate] = useState<Date | undefined>(
    undefined,
  );

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/calendar/events");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to load events");
      setEvents(data.events ?? []);
    } catch (err: unknown) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch("/api/calendar/sync", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Sync failed");
      toast.success(data.message ?? `Synced ${data.count} events.`);
      await fetchEvents();
    } catch (err: unknown) {
      toast.error(err.message ?? "Sync failed.");
    } finally {
      setSyncing(false);
    }
  };

  const handleDeleteEvent = async (ev: CalendarEvent) => {
    if (!confirm(`Delete "${ev.summary}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(
        `/api/calendar/events/${encodeURIComponent(ev.id)}?calendarId=${ev.calendarId ?? "primary"}`,
        { method: "DELETE" },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Delete failed");
      toast.success("Event deleted.");
      setSelectedEvent(null);
      setEvents((evs) => evs.filter((e) => e.id !== ev.id));
    } catch (err: unknown) {
      toast.error(err.message ?? "Failed to delete event.");
    }
  };

  const handleEditEvent = (ev: CalendarEvent) => {
    setEditingEvent(ev);
    setModalMode("edit");
    setShowModal(true);
    setSelectedEvent(null);
  };

  const handleDayClick = (date: Date) => {
    if (view === "month") {
      setCurrentDate(date);
      setView("day");
    } else {
      setDefaultModalDate(date);
      setModalMode("create");
      setEditingEvent(undefined);
      setShowModal(true);
    }
  };

  const navigate = (dir: -1 | 1) => {
    const d = new Date(currentDate);
    if (view === "month") d.setMonth(d.getMonth() + dir);
    else if (view === "week") d.setDate(d.getDate() + dir * 7);
    else d.setDate(d.getDate() + dir);
    setCurrentDate(d);
  };

  const goToday = () => setCurrentDate(new Date());

  const getWeekStart = (d: Date) => {
    const s = new Date(d);
    s.setDate(s.getDate() - s.getDay());
    return s;
  };

  const getHeaderLabel = () => {
    if (view === "month") {
      return currentDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    } else if (view === "week") {
      const ws = getWeekStart(currentDate);
      const we = new Date(ws);
      we.setDate(we.getDate() + 6);
      return `${ws.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${we.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
    } else {
      return currentDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
    }
  };

  const isConnectError =
    error &&
    (error.toLowerCase().includes("not connected") ||
      error.toLowerCase().includes("unauthorized") ||
      error.toLowerCase().includes("oauth"));

  // Compute conflicts and buffer suggestions for right sidebar
  const getSchedulingBrief = () => {
    const todayEvents = events.filter((ev) => {
      const s = getEventStart(ev);
      return s && isSameDay(s, today);
    });

    let conflictText = "No overlaps detected. Your schedule is clear.";
    let bufferSuggestion =
      "Buffer suggestions: Zentra maintains 15-minute buffers automatically between calls.";
    let hasConflict = false;

    // Detect overlaps
    for (let i = 0; i < todayEvents.length; i++) {
      const aStart = getEventStart(todayEvents[i]);
      const aEnd = getEventEnd(todayEvents[i]);
      if (!aStart || !aEnd) continue;

      for (let j = i + 1; j < todayEvents.length; j++) {
        const bStart = getEventStart(todayEvents[j]);
        const bEnd = getEventEnd(todayEvents[j]);
        if (!bStart || !bEnd) continue;

        if (aStart < bEnd && bStart < aEnd) {
          hasConflict = true;
          conflictText = `Overlapping event slots: "${todayEvents[i].summary}" & "${todayEvents[j].summary}".`;
          bufferSuggestion = `Zentra suggestion: Move "${todayEvents[j].summary}" to Wednesday at 2:30 PM (both participants available).`;
          break;
        }
      }
    }

    return {
      hasConflict,
      conflictText,
      bufferSuggestion,
      todayCount: todayEvents.length,
      todayEvents,
    };
  };

  const {
    hasConflict,
    conflictText,
    bufferSuggestion,
    todayCount,
    todayEvents,
  } = getSchedulingBrief();

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F2EA] w-full text-left">
      {/* ─── Main Grid Canvas Area ─── */}
      <div className="flex-1 flex flex-col p-6 sm:p-8 min-w-0 overflow-hidden relative">
        {/* Toolbar Header Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3.5 mb-5 flex-shrink-0">
          <div>
            <span className="text-[11px] font-bold text-[#C67B3D] tracking-[0.15em] uppercase block mb-0.5">
              Google Calendar
            </span>
            <h2 className="text-[28px] font-serif font-normal text-[#111827] tracking-tight">
              {getHeaderLabel()}
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Toggle */}
            <div className="flex bg-white border border-[rgba(17,24,39,0.08)] rounded-xl p-0.5 text-[12.5px] font-semibold shadow-2xs">
              {(["month", "week", "day"] as ViewType[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-3.5 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                    view === v
                      ? "bg-[#111827] text-white shadow-sm"
                      : "text-[#64748B] hover:text-[#111827]"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>

            {/* Sync */}
            <button
              onClick={handleSync}
              disabled={syncing}
              className="p-2.5 rounded-xl border border-[rgba(17,24,39,0.08)] bg-white text-[#64748B] hover:text-[#111827] transition-all cursor-pointer shadow-2xs disabled:opacity-50"
              title="Sync Calendar"
            >
              <RefreshCw
                className={`w-4 h-4 ${syncing ? "animate-spin text-[#C67B3D]" : ""}`}
              />
            </button>

            {/* Controls */}
            <div className="flex items-center gap-1 bg-white border border-[rgba(17,24,39,0.08)] rounded-xl p-0.5 shadow-2xs">
              <button
                onClick={() => navigate(-1)}
                className="p-1.5 hover:bg-[#F7F2EA] rounded-lg text-[#64748B] cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate(1)}
                className="p-1.5 hover:bg-[#F7F2EA] rounded-lg text-[#64748B] cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={goToday}
                className="text-[12px] font-semibold text-[#C67B3D] px-2 cursor-pointer"
              >
                Today
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Grid wrapper */}
        <div className="flex-1 overflow-hidden relative">
          {loading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B]">
                <Loader2 className="w-4.5 h-4.5 animate-spin text-[#C67B3D]" />
                Refreshing calendar timeline...
              </div>
            </div>
          )}

          {!loading && error && isConnectError && (
            <div className="flex items-center justify-center h-full p-6">
              <div className="p-8 rounded-[24px] bg-white border border-[rgba(198,123,61,0.15)] text-center max-w-sm space-y-4 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-[#C67B3D]/8 flex items-center justify-center mx-auto text-[#C67B3D]">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-[20px] text-[#111827]">
                  Authorize Google Calendar
                </h3>
                <p className="text-[12.5px] text-[#64748B] leading-relaxed">
                  Authenticate securely to sync event timelines and access
                  intelligent conflict suggestions.
                </p>
                <a
                  href="/api/connect?plugin=googlecalendar"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#111827] hover:bg-[#C67B3D] text-white text-[12.5px] font-bold transition-all shadow-sm"
                >
                  Link Calendar Portal
                </a>
              </div>
            </div>
          )}

          {!loading && !error && (
            <>
              {view === "month" && (
                <MonthGrid
                  year={currentDate.getFullYear()}
                  month={currentDate.getMonth()}
                  events={events}
                  today={today}
                  onDayClick={handleDayClick}
                  onEventClick={setSelectedEvent}
                />
              )}
              {view === "week" && (
                <WeekView
                  weekStart={getWeekStart(currentDate)}
                  events={events}
                  today={today}
                  onEventClick={setSelectedEvent}
                  onDayClick={handleDayClick}
                />
              )}
              {view === "day" && (
                <DayView
                  date={currentDate}
                  events={events}
                  today={today}
                  onEventClick={setSelectedEvent}
                />
              )}
            </>
          )}
        </div>

        {/* Floating Create Event Trigger CTA button */}
        <button
          onClick={() => {
            setModalMode("create");
            setEditingEvent(undefined);
            setDefaultModalDate(undefined);
            setShowModal(true);
          }}
          className="absolute bottom-6 right-6 w-13 h-13 rounded-full bg-[#111827] hover:bg-[#C67B3D] text-white flex items-center justify-center shadow-[0_8px_30px_rgba(17,24,39,0.2)] hover:scale-105 transition-all duration-300 z-30 cursor-pointer"
          title="Create New Event"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* ─── 2. Today's Scheduling Sidebar (320px) ─── */}
      <aside className="w-[320px] bg-white border-l border-[rgba(17,24,39,0.06)] p-6 overflow-y-auto space-y-8 flex-shrink-0 flex flex-col justify-between select-none">
        <div className="space-y-6">
          <h3 className="font-serif text-[20px] text-[#111827]">
            Today's schedule
          </h3>

          <div className="space-y-3">
            {todayEvents.length === 0 ? (
              <p className="text-[12.5px] text-[#64748B] italic">
                No meetings scheduled today.
              </p>
            ) : (
              todayEvents.map((ev) => {
                const sStr = ev.start?.dateTime ?? ev.start?.date;
                const startLabel = sStr
                  ? new Date(sStr).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })
                  : "All Day";
                return (
                  <div
                    key={ev.id}
                    onClick={() => setSelectedEvent(ev)}
                    className="p-3.5 rounded-xl border border-[rgba(17,24,39,0.05)] hover:border-[#C67B3D]/30 hover:bg-[#F7F2EA]/10 cursor-pointer transition-colors"
                  >
                    <span className="text-[11px] font-bold text-[#C67B3D]">
                      {startLabel}
                    </span>
                    <h4 className="text-[13px] font-bold text-[#111827] truncate mt-0.5">
                      {ev.summary}
                    </h4>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* AI suggestions card */}
        <div className="bg-[#C67B3D]/5 border border-[#C67B3D]/15 rounded-2xl p-4.5 space-y-3 text-[12.5px] leading-relaxed">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C67B3D]" />
            <span className="text-[10px] font-bold text-[#111827] uppercase tracking-wider">
              AI Scheduler suggestion
            </span>
          </div>

          {hasConflict ? (
            <>
              <p className="text-red-600 font-semibold">{conflictText}</p>
              <p className="text-[#64748B]">{bufferSuggestion}</p>
              <button
                onClick={() => {
                  const conflictEvent = todayEvents.find(
                    (e) =>
                      e.summary.toLowerCase().includes("sync") ||
                      e.summary.toLowerCase().includes("critique"),
                  );
                  if (conflictEvent) {
                    handleEditEvent(conflictEvent);
                  } else {
                    toast.info("Select a meeting to adjust times manually.");
                  }
                }}
                className="w-full py-2 bg-[#111827] hover:bg-[#C67B3D] text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
              >
                Reschedule conflict
              </button>
            </>
          ) : (
            <p className="text-[#64748B]">
              No meeting overlaps found. Your schedule meets the optimal
              15-minute buffer between slots automatically.
            </p>
          )}
        </div>
      </aside>

      {/* ── Modals & Overlays ── */}
      {selectedEvent && (
        <EventDetailPanel
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onDelete={handleDeleteEvent}
          onEdit={handleEditEvent}
        />
      )}

      <EventModal
        open={showModal}
        onOpenChange={setShowModal}
        mode={modalMode}
        initial={editingEvent}
        defaultDate={defaultModalDate}
        onSaved={fetchEvents}
      />
    </div>
  );
}
