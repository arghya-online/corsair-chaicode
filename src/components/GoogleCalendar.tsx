"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
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
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

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
  attendees: Array<{ email: string; displayName?: string; responseStatus?: string }>;
  organizer: { email: string; displayName?: string } | null;
  calendarId: string;
  recurringEventId: string | null;
  allDay: boolean;
  updatedAt: string;
  created: string | null;
}

type ViewType = "month" | "week" | "day";

// ─── Color palette for Google Calendar color IDs ─────────────────────────────

const EVENT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "1": { bg: "bg-sky-soft", text: "text-sky-text", border: "border-sky/30" }, // Monsoon Slate
  "2": { bg: "bg-sage-soft", text: "text-sage-text", border: "border-sage/30" }, // Sage Green
  "3": { bg: "bg-blush-soft", text: "text-blush-text", border: "border-blush/30" }, // Terracotta Warm
  "4": { bg: "bg-peach-soft", text: "text-peach-text", border: "border-peach/30" }, // Sandstone Gold
  "5": { bg: "bg-sage-soft", text: "text-sage-text", border: "border-sage/30" },
  "6": { bg: "bg-blush-soft", text: "text-blush-text", border: "border-blush/30" },
  "7": { bg: "bg-sky-soft", text: "text-sky-text", border: "border-sky/30" },
  "8": { bg: "bg-espresso-100", text: "text-espresso-400", border: "border-espresso-300/30" },
  "9": { bg: "bg-sage-soft", text: "text-sage-text", border: "border-sage/30" },
  "10": { bg: "bg-peach-soft", text: "text-peach-text", border: "border-peach/30" },
  "11": { bg: "bg-blush-soft", text: "text-blush-text", border: "border-blush/30" },
};

function getEventColor(colorId: string | null) {
  return EVENT_COLORS[colorId ?? ""] ?? {
    bg: "bg-peach-soft",
    text: "text-peach-text",
    border: "border-peach/30",
  };
}

// ─── Utility helpers ─────────────────────────────────────────────────────────

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
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function formatDateTime(dt: string | undefined | null): string {
  if (!dt) return "";
  const d = new Date(dt);
  return d.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
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

function isNotConnectedError(msg: string): boolean {
  const lower = msg.toLowerCase();
  return (
    lower.includes("not found") ||
    lower.includes("no account") ||
    lower.includes("not connected") ||
    lower.includes("oauth") ||
    lower.includes("unauthorized") ||
    lower.includes("token") ||
    lower.includes("connect your google account")
  );
}

// ─── Toast ───────────────────────────────────────────────────────────────────

function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <div
      role="alert"
      className={`fixed bottom-6 right-6 z-[9999] p-4 rounded-2xl border flex items-center gap-3 shadow-[0_8px_30px_rgba(13,13,13,0.06)] text-xs font-medium animate-fade-in ${type === "success"
        ? "border-emerald-100 bg-emerald-50 text-emerald-800"
        : "border-red-100 bg-red-50 text-red-800"
        }`}
    >
      {type === "success" ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
      ) : (
        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
      )}
      {message}
    </div>
  );
}

// ─── Event Detail Panel ───────────────────────────────────────────────────────

interface EventDetailProps {
  event: CalendarEvent;
  onClose: () => void;
  onDelete: (ev: CalendarEvent) => void;
  onEdit: (ev: CalendarEvent) => void;
}

function EventDetailPanel({ event, onClose, onDelete, onEdit }: EventDetailProps) {
  const color = getEventColor(event.colorId);
  const startDt = event.start?.dateTime ?? event.start?.date;
  const endDt = event.end?.dateTime ?? event.end?.date;

  return (
    <div
      className="fixed inset-0 z-[8000] flex justify-end bg-black/30 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-label="Event details"
    >
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-[480px] h-full bg-white border-l border-[#E8E8EC] flex flex-col shadow-[-16px_0_48px_rgba(13,13,13,0.05)] overflow-hidden">
        {/* Header strip */}
        <div className={`h-1.5 w-full ${color.bg} border-b ${color.border}`} />

        {/* Title bar */}
        <div className="flex items-start gap-3 px-6 pt-5 pb-4 border-b border-[#E8E8EC] flex-shrink-0">
          <div className="flex-1 text-left">
            <h2 className="text-base font-medium text-[#0D0D0D] font-display leading-tight">
              {event.summary}
            </h2>
            {event.status === "cancelled" && (
              <span className="mt-1 inline-block text-[10px] px-2 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded font-medium uppercase tracking-wider">
                Cancelled
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => onEdit(event)}
              className="p-2 hover:bg-cream-300 rounded-lg text-espresso-400 hover:text-peach transition-colors cursor-pointer"
              aria-label="Edit event"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(event)}
              className="p-2 hover:bg-red-50 rounded-lg text-[#6B7280] hover:text-red-500 transition-colors cursor-pointer"
              aria-label="Delete event"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#F2F2F5] rounded-lg text-[#6B7280] hover:text-[#0D0D0D] transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-left">
          {/* Date/Time */}
          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 text-[#6B7280] flex-shrink-0 mt-0.5" />
            <div className="text-xs text-[#0D0D0D] space-y-0.5">
              {event.allDay ? (
                <p className="font-medium">{event.start?.date} · All day</p>
              ) : (
                <>
                  <p className="font-medium">{formatDateTime(startDt)}</p>
                  {endDt && (
                    <p className="text-[#6B7280]">→ {formatDateTime(endDt)}</p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Location */}
          {event.location && (
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#6B7280] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[#0D0D0D]">{event.location}</p>
            </div>
          )}

          {/* Google Meet */}
          {event.hangoutLink && (
            <div className="flex items-start gap-3">
              <Video className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <a
                href={event.hangoutLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-emerald-700 font-medium hover:underline flex items-center gap-1"
              >
                Join Google Meet
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* Description */}
          {event.description && (
            <div className="bg-[#F2F2F5] rounded-xl p-4 text-xs text-[#0D0D0D] leading-relaxed whitespace-pre-wrap border border-[#E8E8EC]">
              {event.description}
            </div>
          )}

          {/* Organizer */}
          {event.organizer && (
            <div className="space-y-1.5">
              <p className="text-[10px] font-medium uppercase tracking-wider text-[#6B7280]">Organizer</p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-peach-soft flex items-center justify-center text-peach-text text-[11px] font-medium flex-shrink-0">
                  {(event.organizer.displayName ?? event.organizer.email)[0].toUpperCase()}
                </div>
                <span className="text-xs text-[#0D0D0D]">
                  {event.organizer.displayName ?? event.organizer.email}
                </span>
              </div>
            </div>
          )}

          {/* Attendees */}
          {event.attendees?.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-[#6B7280]" />
                <p className="text-[10px] font-medium uppercase tracking-wider text-[#6B7280]">
                  Attendees ({event.attendees.length})
                </p>
              </div>
              <div className="space-y-1.5">
                {event.attendees.slice(0, 10).map((att, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#F2F2F5] border border-[#E8E8EC] flex items-center justify-center text-[10px] font-medium text-[#6B7280] flex-shrink-0">
                      {(att.displayName ?? att.email)[0].toUpperCase()}
                    </div>
                    <span className="text-xs text-[#0D0D0D] flex-1 truncate">
                      {att.displayName ?? att.email}
                    </span>
                    {att.responseStatus && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-medium uppercase ${att.responseStatus === "accepted"
                          ? "bg-emerald-50 text-emerald-700"
                          : att.responseStatus === "declined"
                            ? "bg-red-50 text-red-600"
                            : "bg-amber-50 text-amber-700"
                          }`}
                      >
                        {att.responseStatus === "accepted"
                          ? "✓"
                          : att.responseStatus === "declined"
                            ? "✗"
                            : "?"}
                      </span>
                    )}
                  </div>
                ))}
                {event.attendees.length > 10 && (
                  <p className="text-[11px] text-[#6B7280] pl-8">
                    +{event.attendees.length - 10} more
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Open in Google Calendar */}
          {event.htmlLink && (
            <a
              href={event.htmlLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-peach font-medium hover:underline mt-2"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open in Google Calendar
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Create / Edit Event Modal ────────────────────────────────────────────────

interface EventFormData {
  summary: string;
  description: string;
  location: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  allDay: boolean;
  colorId: string;
  attendees: string; // comma-separated emails
}

interface EventModalProps {
  mode: "create" | "edit";
  initial?: Partial<CalendarEvent>;
  defaultDate?: Date;
  onClose: () => void;
  onSaved: () => void;
  onToast: (msg: string, type: "success" | "error") => void;
}

const COLOR_OPTIONS = [
  { id: "", label: "Default", dot: "bg-peach" },
  { id: "1", label: "Lavender", dot: "bg-[#7986CB]" },
  { id: "2", label: "Sage", dot: "bg-[#33B679]" },
  { id: "3", label: "Grape", dot: "bg-[#8E24AA]" },
  { id: "4", label: "Flamingo", dot: "bg-[#E67C73]" },
  { id: "5", label: "Banana", dot: "bg-[#F6BF26]" },
  { id: "6", label: "Tangerine", dot: "bg-[#F4511E]" },
  { id: "7", label: "Peacock", dot: "bg-[#039BE5]" },
  { id: "11", label: "Tomato", dot: "bg-[#D50000]" },
];

function toLocalDateStr(dt: string | undefined): string {
  if (!dt) return new Date().toISOString().slice(0, 10);
  return new Date(dt).toISOString().slice(0, 10);
}

function toLocalTimeStr(dt: string | undefined): string {
  if (!dt) return "09:00";
  const d = new Date(dt);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function EventModal({ mode, initial, defaultDate, onClose, onSaved, onToast }: EventModalProps) {
  const defaultDateStr = defaultDate
    ? defaultDate.toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState<EventFormData>({
    summary: initial?.summary ?? "",
    description: initial?.description ?? "",
    location: initial?.location ?? "",
    startDate: toLocalDateStr(initial?.start?.dateTime ?? initial?.start?.date ?? defaultDateStr),
    startTime: toLocalTimeStr(initial?.start?.dateTime),
    endDate: toLocalDateStr(initial?.end?.dateTime ?? initial?.end?.date ?? defaultDateStr),
    endTime: toLocalTimeStr(initial?.end?.dateTime) || "10:00",
    allDay: initial?.allDay ?? false,
    colorId: initial?.colorId ?? "",
    attendees: initial?.attendees?.map((a) => a.email).join(", ") ?? "",
  });
  const [saving, setSaving] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const set = (field: keyof EventFormData, value: any) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async () => {
    if (!form.summary.trim()) {
      onToast("Event title is required.", "error");
      return;
    }

    setSaving(true);
    try {
      const buildDateTime = (date: string, time: string) =>
        new Date(`${date}T${time}:00`).toISOString();

      const startPayload = form.allDay
        ? { date: form.startDate }
        : { dateTime: buildDateTime(form.startDate, form.startTime) };
      const endPayload = form.allDay
        ? { date: form.endDate }
        : { dateTime: buildDateTime(form.endDate, form.endTime) };

      const attendeeList = form.attendees
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean);

      const payload = {
        summary: form.summary.trim(),
        description: form.description.trim(),
        location: form.location.trim(),
        start: startPayload,
        end: endPayload,
        colorId: form.colorId || undefined,
        attendees: attendeeList,
        calendarId: initial?.calendarId ?? "primary",
      };

      let url = "/api/calendar/events/create";
      let method = "POST";
      if (mode === "edit" && initial?.id) {
        url = `/api/calendar/events/${encodeURIComponent(initial.id)}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? "Failed to save event");

      onToast(
        mode === "create" ? "Event created successfully." : "Event updated successfully.",
        "success"
      );
      onSaved();
      onClose();
    } catch (err: any) {
      onToast(err.message ?? "Failed to save event.", "error");
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-border/50 bg-cream-50 py-2.5 px-4 text-xs text-espresso outline-none transition focus:border-peach focus:bg-white focus:ring-1 focus:ring-peach";
  const labelCls = "text-[10px] font-medium text-[#6B7280] uppercase tracking-wider block mb-1";

  return (
    <div
      className="fixed inset-0 z-[9000] flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={mode === "create" ? "Create event" : "Edit event"}
    >
      <div className="w-full max-w-lg bg-white border border-[#E8E8EC] rounded-[24px] shadow-[0_24px_64px_rgba(13,13,13,0.1)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E8EC]">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-peach" />
            <span className="text-xs font-medium text-peach uppercase tracking-wider">
              {mode === "create" ? "New Event" : "Edit Event"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#F2F2F5] rounded-full text-[#6B7280] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[70vh]">
          {/* Title */}
          <div>
            <label className={labelCls}>Title *</label>
            <input
              ref={titleRef}
              id="event-title"
              type="text"
              value={form.summary}
              onChange={(e) => set("summary", e.target.value)}
              placeholder="Add a title"
              className={inputCls}
            />
          </div>

          {/* All Day toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => set("allDay", !form.allDay)}
              className={`w-9 h-5 rounded-full border-2 transition-colors flex items-center ${form.allDay
                ? "bg-peach border-peach"
                : "bg-[#E8E8EC] border-[#E8E8EC]"
                }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white shadow transition-transform ${form.allDay ? "translate-x-[18px]" : "translate-x-[2px]"
                  }`}
              />
            </div>
            <span className="text-xs text-[#0D0D0D] font-medium">All-day event</span>
          </label>

          {/* Start / End */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Start Date</label>
              <input
                id="event-start-date"
                type="date"
                value={form.startDate}
                onChange={(e) => set("startDate", e.target.value)}
                className={inputCls}
              />
            </div>
            {!form.allDay && (
              <div>
                <label className={labelCls}>Start Time</label>
                <input
                  id="event-start-time"
                  type="time"
                  value={form.startTime}
                  onChange={(e) => set("startTime", e.target.value)}
                  className={inputCls}
                />
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>End Date</label>
              <input
                id="event-end-date"
                type="date"
                value={form.endDate}
                onChange={(e) => set("endDate", e.target.value)}
                className={inputCls}
              />
            </div>
            {!form.allDay && (
              <div>
                <label className={labelCls}>End Time</label>
                <input
                  id="event-end-time"
                  type="time"
                  value={form.endTime}
                  onChange={(e) => set("endTime", e.target.value)}
                  className={inputCls}
                />
              </div>
            )}
          </div>

          {/* Location */}
          <div>
            <label className={labelCls}>Location</label>
            <input
              id="event-location"
              type="text"
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="Add a location"
              className={inputCls}
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description</label>
            <textarea
              id="event-description"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Add notes or agenda..."
              rows={3}
              className={`${inputCls} resize-none leading-relaxed`}
            />
          </div>

          {/* Attendees */}
          <div>
            <label className={labelCls}>Invite Guests</label>
            <input
              id="event-attendees"
              type="text"
              value={form.attendees}
              onChange={(e) => set("attendees", e.target.value)}
              placeholder="email@example.com, another@example.com"
              className={inputCls}
            />
          </div>

          {/* Color */}
          <div>
            <label className={labelCls}>Event Color</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => set("colorId", c.id)}
                  title={c.label}
                  className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-transform hover:scale-110 cursor-pointer ${c.dot} ${form.colorId === c.id
                    ? "border-[#0D0D0D] scale-110"
                    : "border-transparent"
                    }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#E8E8EC] bg-[#FAFAFA]">
          <button
            onClick={onClose}
            disabled={saving}
            className="border border-[#E8E8EC] bg-white rounded-full text-[#6B7280] hover:text-[#0D0D0D] px-5 py-2 text-xs font-medium hover:bg-[#F2F2F5] transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            id="event-save-btn"
            className="bg-peach text-white hover:bg-peach-dark rounded-full px-5 py-2 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Calendar className="w-3.5 h-3.5" />}
            {mode === "create" ? "Create Event" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Month Grid ───────────────────────────────────────────────────────────────

interface MonthGridProps {
  year: number;
  month: number; // 0-indexed
  events: CalendarEvent[];
  today: Date;
  onDayClick: (date: Date) => void;
  onEventClick: (ev: CalendarEvent) => void;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function MonthGrid({ year, month, events, today, onDayClick, onEventClick }: MonthGridProps) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const cells: Array<{ date: Date; isCurrentMonth: boolean }> = [];

  // Previous month overflow
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({
      date: new Date(year, month - 1, prevMonthDays - i),
      isCurrentMonth: false,
    });
  }
  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), isCurrentMonth: true });
  }
  // Next month fill
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ date: new Date(year, month + 1, d), isCurrentMonth: false });
  }

  return (
    <div className="flex flex-col h-full">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-border/40">
        {DAYS.map((d) => (
          <div
            key={d}
            className="py-3 text-center text-[14px] font-medium uppercase tracking-wider text-espresso-400"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Grid cells */}
      <div className="grid grid-cols-7 flex-1 divide-x divide-y divide-border/40">
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
              className={`min-h-[100px] p-2 flex flex-col gap-1 cursor-pointer transition-colors ${cell.isCurrentMonth
                ? "bg-white hover:bg-cream-200/20"
                : "bg-cream-100/30 hover:bg-cream-200/30"
                }`}
            >
              {/* Day number */}
              <div className="flex justify-end mb-1">
                <span
                  className={`text-[15px] font-semibold w-7 h-7 flex items-center justify-center rounded-full transition-all duration-200 ${isToday
                    ? "bg-peach text-white shadow-sm"
                    : cell.isCurrentMonth
                      ? "text-espresso"
                      : "text-espresso-300/40"
                    }`}
                >
                  {cell.date.getDate()}
                </span>
              </div>

              {/* Events */}
              {cellEvents.map((ev) => {
                const color = getEventColor(ev.colorId);
                return (
                  <button
                    key={ev.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(ev);
                    }}
                    className={`w-full text-left text-[12px] font-medium px-2 py-1 rounded-lg truncate border-l-2 cursor-pointer hover:brightness-95 transition-all shadow-[0_1px_3px_rgba(28,36,49,0.01)] ${color.bg} ${color.text} ${color.border}`}
                    title={ev.summary}
                  >
                    {!ev.allDay && ev.start?.dateTime && (
                      <span className="opacity-70 mr-1.5 text-[11px]">
                        {formatTime(ev.start.dateTime)}
                      </span>
                    )}
                    {ev.summary}
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

// ─── Week View ────────────────────────────────────────────────────────────────

interface WeekViewProps {
  weekStart: Date;
  events: CalendarEvent[];
  today: Date;
  onEventClick: (ev: CalendarEvent) => void;
  onDayClick: (date: Date) => void;
}

function WeekView({ weekStart, events, today, onEventClick, onDayClick }: WeekViewProps) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* Header */}
      <div className="grid grid-cols-8 border-b border-[#E8E8EC] bg-white flex-shrink-0">
        <div className="border-r border-[#E8E8EC]" /> {/* time gutter */}
        {days.map((day, i) => {
          const isToday = isSameDay(day, today);
          return (
            <div
              key={i}
              onClick={() => onDayClick(day)}
              className="py-2 flex flex-col items-center cursor-pointer hover:bg-[#FAFAFA] transition-colors"
            >
              <span className="text-[10px] font-medium uppercase tracking-wider text-[#6B7280]">
                {DAYS[day.getDay()]}
              </span>
              <span
                className={`mt-0.5 w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium ${isToday ? "bg-peach text-white" : "text-[#0D0D0D]"
                  }`}
              >
                {day.getDate()}
              </span>
            </div>
          );
        })}
      </div>

      {/* Day columns */}
      <div className="grid grid-cols-8 flex-1 divide-x divide-[#E8E8EC] overflow-y-auto">
        {/* Time gutter */}
        <div className="flex flex-col divide-y divide-[#E8E8EC]/50 border-r border-[#E8E8EC]">
          {Array.from({ length: 24 }, (_, h) => (
            <div key={h} className="h-14 flex items-start px-2 pt-1">
              <span className="text-[9px] text-[#6B7280] font-mono">
                {h === 0 ? "" : `${h < 10 ? "0" + h : h}:00`}
              </span>
            </div>
          ))}
        </div>

        {/* Day columns */}
        {days.map((day, di) => {
          const dayEvents = events.filter((ev) => {
            const s = getEventStart(ev);
            return s && isSameDay(s, day);
          });

          return (
            <div
              key={di}
              className="relative flex flex-col divide-y divide-[#E8E8EC]/30"
              onClick={() => onDayClick(day)}
            >
              {Array.from({ length: 24 }, (_, h) => (
                <div key={h} className="h-14 hover:bg-[#F2F2F5]/30 transition-colors" />
              ))}

              {/* Events positioned absolutely */}
              {dayEvents.map((ev) => {
                const s = getEventStart(ev);
                const e = getEventEnd(ev);
                if (!s) return null;
                const color = getEventColor(ev.colorId);

                if (ev.allDay) {
                  return (
                    <button
                      key={ev.id}
                      onClick={(evt) => { evt.stopPropagation(); onEventClick(ev); }}
                      className={`absolute left-0.5 right-0.5 top-0 z-10 text-[10px] font-medium px-1.5 py-1 rounded-md truncate border-l-2 cursor-pointer hover:brightness-95 ${color.bg} ${color.text} ${color.border}`}
                    >
                      {ev.summary}
                    </button>
                  );
                }

                const startH = s.getHours() + s.getMinutes() / 60;
                const endH = e ? e.getHours() + e.getMinutes() / 60 : startH + 1;
                const top = startH * 56; // 14rem per hour (h-14 = 3.5rem = 56px)
                const height = Math.max((endH - startH) * 56, 20);

                return (
                  <button
                    key={ev.id}
                    onClick={(evt) => { evt.stopPropagation(); onEventClick(ev); }}
                    style={{ top, height, minHeight: 20 }}
                    className={`absolute left-0.5 right-0.5 z-10 text-[10px] font-medium px-1.5 py-0.5 rounded-md overflow-hidden border-l-2 cursor-pointer hover:brightness-95 transition-all text-left ${color.bg} ${color.text} ${color.border}`}
                  >
                    <span className="block truncate">{ev.summary}</span>
                    {height > 30 && (
                      <span className="block opacity-70 truncate">
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

// ─── Day View ─────────────────────────────────────────────────────────────────

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
    .sort((a, b) => {
      const as = getEventStart(a)?.getTime() ?? 0;
      const bs = getEventStart(b)?.getTime() ?? 0;
      return as - bs;
    });

  return (
    <div className="h-full overflow-y-auto">
      {/* Day Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[#E8E8EC] bg-white sticky top-0 z-10">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium ${isToday ? "bg-peach text-white" : "bg-[#F2F2F5] text-[#0D0D0D]"
            }`}
        >
          {date.getDate()}
        </div>
        <div>
          <p className="text-sm font-medium text-[#0D0D0D]">
            {date.toLocaleDateString("en-US", { weekday: "long" })}
          </p>
          <p className="text-xs text-[#6B7280]">
            {date.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      {/* Events list for the day */}
      {dayEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
          <Calendar className="w-8 h-8 text-[#6B7280]/30" />
          <p className="text-xs text-[#6B7280]">No events scheduled for this day.</p>
        </div>
      ) : (
        <div className="p-6 space-y-3">
          {dayEvents.map((ev) => {
            const color = getEventColor(ev.colorId);
            const start = getEventStart(ev);
            const end = getEventEnd(ev);

            return (
              <button
                key={ev.id}
                onClick={() => onEventClick(ev)}
                className={`w-full text-left p-4 rounded-2xl border-l-4 cursor-pointer hover:shadow-md transition-all ${color.bg} ${color.border}`}
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${color.text}`}>{ev.summary}</p>
                    {ev.description && (
                      <p className="text-xs text-[#6B7280] mt-0.5 line-clamp-1">{ev.description}</p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    {ev.allDay ? (
                      <span className="text-[10px] text-[#6B7280] font-medium">All day</span>
                    ) : (
                      <div>
                        <p className={`text-xs font-medium ${color.text}`}>
                          {start && formatTime(start.toISOString())}
                        </p>
                        {end && (
                          <p className="text-[10px] text-[#6B7280]">
                            {formatTime(end.toISOString())}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {(ev.location || ev.hangoutLink) && (
                  <div className="mt-2 flex items-center gap-3 text-[10px] text-[#6B7280]">
                    {ev.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {ev.location}
                      </span>
                    )}
                    {ev.hangoutLink && (
                      <span className="flex items-center gap-1 text-emerald-600 font-medium">
                        <Video className="w-3 h-3" />
                        Meet
                      </span>
                    )}
                  </div>
                )}
                {ev.attendees?.length > 0 && (
                  <div className="mt-2 flex items-center gap-1">
                    <Users className="w-3 h-3 text-[#6B7280]" />
                    <span className="text-[10px] text-[#6B7280]">
                      {ev.attendees.length} guest{ev.attendees.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function GoogleCalendar() {
  const today = new Date();
  const [view, setView] = useState<ViewType>("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | undefined>(undefined);
  const [defaultModalDate, setDefaultModalDate] = useState<Date | undefined>(undefined);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Handle OAuth success/error query params
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const oauthSuccess = params.get("oauth_success");
    const oauthError = params.get("oauth_error");
    if (oauthSuccess) {
      showToast(`${oauthSuccess} connected! Click Sync to load your events.`, "success");
      window.history.replaceState({}, "", window.location.pathname);
    } else if (oauthError) {
      showToast(`OAuth error: ${oauthError}`, "error");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/calendar/events");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to load events");
      setEvents(data.events ?? []);
    } catch (err: any) {
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
      showToast(data.message ?? `Synced ${data.count} events.`, "success");
      await fetchEvents();
    } catch (err: any) {
      showToast(err.message ?? "Sync failed.", "error");
    } finally {
      setSyncing(false);
    }
  };

  const handleDeleteEvent = async (ev: CalendarEvent) => {
    if (!confirm(`Delete "${ev.summary}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(
        `/api/calendar/events/${encodeURIComponent(ev.id)}?calendarId=${ev.calendarId ?? "primary"}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Delete failed");
      showToast("Event deleted.", "success");
      setSelectedEvent(null);
      setEvents((evs) => evs.filter((e) => e.id !== ev.id));
    } catch (err: any) {
      showToast(err.message ?? "Failed to delete event.", "error");
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

  // Navigation
  const navigate = (dir: -1 | 1) => {
    const d = new Date(currentDate);
    if (view === "month") {
      d.setMonth(d.getMonth() + dir);
    } else if (view === "week") {
      d.setDate(d.getDate() + dir * 7);
    } else {
      d.setDate(d.getDate() + dir);
    }
    setCurrentDate(d);
  };

  const goToday = () => setCurrentDate(new Date());

  // Week start = Sunday of the current week
  const getWeekStart = (d: Date) => {
    const s = new Date(d);
    s.setDate(s.getDate() - s.getDay());
    return s;
  };

  const getHeaderLabel = () => {
    if (view === "month") {
      return currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
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
        year: "numeric",
      });
    }
  };

  const isConnectError = error && isNotConnectedError(error);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* ── Top Toolbar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-[#E8E8EC] flex-shrink-0">
        {/* Left: Brand + Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-peach-soft flex items-center justify-center text-peach flex-shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="text-left">
            <h2 className="text-sm font-medium text-[#0D0D0D] font-display">Google calendar</h2>
            <p className="text-[10px] text-[#6B7280] font-sans">Live sync · Powered by CorsAir integration</p>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* View Toggle */}
          <div className="flex items-center bg-[#F2F2F5] border border-[#E8E8EC] rounded-xl p-0.5 text-xs font-medium">
            {(["month", "week", "day"] as ViewType[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${view === v
                  ? "bg-white text-[#0D0D0D] shadow-sm border border-[#E8E8EC]"
                  : "text-[#6B7280] hover:text-[#0D0D0D]"
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
            id="calendar-sync-btn"
            className="border border-[#E8E8EC] bg-white hover:bg-[#F2F2F5] rounded-xl p-2.5 text-[#6B7280] hover:text-[#0D0D0D] transition-colors cursor-pointer flex items-center gap-1.5"
            title="Sync with Google Calendar"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin text-peach" : ""}`} />
            <span className="text-[10px] font-medium uppercase tracking-wider hidden sm:inline">Sync</span>
          </button>

          {/* New Event */}
          <button
            id="create-event-btn"
            onClick={() => {
              setModalMode("create");
              setEditingEvent(undefined);
              setDefaultModalDate(undefined);
              setShowModal(true);
            }}
            className="bg-peach hover:bg-peach-dark text-white rounded-xl py-2.5 px-4 text-xs font-medium transition-all shadow-[0_2px_8px_rgba(201,138,84,0.15)] flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New event</span>
          </button>
        </div>
      </div>

      {/* ── Navigation Bar ── */}
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-[#E8E8EC] bg-[#FAFAFA] flex-shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 hover:bg-[#E8E8EC] rounded-lg transition-colors cursor-pointer text-[#6B7280] hover:text-[#0D0D0D]"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate(1)}
            className="p-1.5 hover:bg-[#E8E8EC] rounded-lg transition-colors cursor-pointer text-[#6B7280] hover:text-[#0D0D0D]"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={goToday}
            className="text-xs font-medium text-peach hover:underline px-2 py-1 cursor-pointer"
          >
            Today
          </button>
        </div>
        <h3 className="text-sm font-medium text-[#0D0D0D] font-display">{getHeaderLabel()}</h3>
        {/* Event count */}
        <span className="text-[10px] text-[#6B7280] font-mono hidden sm:inline">
          {events.length} event{events.length !== 1 ? "s" : ""} synced
        </span>
      </div>

      {/* ── Main Canvas ── */}
      <div className="flex-1 overflow-hidden relative">
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-xs font-medium text-[#6B7280]">
              <Loader2 className="w-5 h-5 animate-spin text-peach" />
              Loading calendar...
            </div>
          </div>
        )}

        {/* Not connected CTA */}
        {!loading && error && isConnectError && (
          <div className="flex items-center justify-center h-full p-8">
            <div className="border border-[#E8E8EC] rounded-[24px] p-10 bg-[#FAFAFA] text-center max-w-md space-y-5 shadow-sm">
              <div className="w-14 h-14 rounded-full bg-peach-soft flex items-center justify-center mx-auto text-peach">
                <Calendar className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h4 className="text-base font-medium text-[#0D0D0D] font-display">
                  Connect Google calendar
                </h4>
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  Authorize Zentra to sync and manage your Google calendar events, meetings, and schedules through the secure CorsAir integration engine.
                </p>
              </div>
              <a
                href="/api/connect?plugin=googlecalendar"
                id="connect-calendar-btn"
                className="inline-flex items-center gap-2 bg-peach hover:bg-peach-dark text-white rounded-full px-6 py-3 text-xs font-medium transition hover:shadow-[0_4px_12px_rgba(201,138,84,0.15)]"
              >
                <Calendar className="w-4 h-4" />
                Authorize Google calendar
              </a>
              <p className="text-[10px] text-[#6B7280]">
                You'll be redirected to Google's secure OAuth consent screen.
              </p>
            </div>
          </div>
        )}

        {/* General error */}
        {!loading && error && !isConnectError && (
          <div className="p-6">
            <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-xs font-semibold text-red-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span><strong>Error:</strong> {error}</span>
            </div>
          </div>
        )}

        {/* Calendar Views */}
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

      {/* ── Modals & Overlays ── */}
      {selectedEvent && (
        <EventDetailPanel
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onDelete={handleDeleteEvent}
          onEdit={handleEditEvent}
        />
      )}

      {showModal && (
        <EventModal
          mode={modalMode}
          initial={editingEvent}
          defaultDate={defaultModalDate}
          onClose={() => {
            setShowModal(false);
            setEditingEvent(undefined);
          }}
          onSaved={fetchEvents}
          onToast={showToast}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
