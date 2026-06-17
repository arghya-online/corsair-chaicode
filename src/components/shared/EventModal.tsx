"use client";

import React, { useState, useEffect, useRef } from "react";
import { Calendar, X, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
  attendees: string;
}

interface EventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  initial?: any;
  defaultDate?: Date;
  onSaved: () => void;
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

export function EventModal({
  open,
  onOpenChange,
  mode,
  initial,
  defaultDate,
  onSaved,
}: EventModalProps) {
  const defaultDateStr = defaultDate
    ? defaultDate.toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState<EventFormData>({
    summary: "",
    description: "",
    location: "",
    startDate: defaultDateStr,
    startTime: "09:00",
    endDate: defaultDateStr,
    endTime: "10:00",
    allDay: false,
    colorId: "",
    attendees: "",
  });

  const [saving, setSaving] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  // Initialize fields when opening
  useEffect(() => {
    if (open) {
      setForm({
        summary: initial?.summary ?? "",
        description: initial?.description ?? "",
        location: initial?.location ?? "",
        startDate: toLocalDateStr(initial?.start?.dateTime ?? initial?.start?.date ?? defaultDateStr),
        startTime: toLocalTimeStr(initial?.start?.dateTime),
        endDate: toLocalDateStr(initial?.end?.dateTime ?? initial?.end?.date ?? defaultDateStr),
        endTime: toLocalTimeStr(initial?.end?.dateTime) || "10:00",
        allDay: initial?.allDay ?? false,
        colorId: initial?.colorId ?? "",
        attendees: initial?.attendees?.map((a: any) => a.email).join(", ") ?? "",
      });
      setTimeout(() => titleRef.current?.focus(), 150);
    }
  }, [open, initial, defaultDateStr]);

  const set = (field: keyof EventFormData, value: any) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.summary.trim()) {
      toast.error("Event title is required.");
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

      toast.success(mode === "create" ? "Event created successfully." : "Event updated successfully.");
      onSaved();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message ?? "Failed to save event.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-cream-100 border-border rounded-2xl sm:max-w-[500px]">
        <DialogHeader className="border-b border-border pb-4">
          <DialogTitle className="font-serif text-[18px] font-normal text-espresso flex items-center gap-2">
            <Calendar className="w-5 h-5 text-peach" />
            {mode === "create" ? "New Event" : "Edit Event"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 pt-4">
          
          <div>
            <label className="font-sans text-[11px] text-espresso-300 uppercase tracking-wide mb-1 block">Title *</label>
            <Input
              ref={titleRef}
              type="text"
              value={form.summary}
              onChange={(e) => set("summary", e.target.value)}
              placeholder="Event Title"
              required
              className="bg-cream-200 border-border rounded-xl text-[13px]"
            />
          </div>

          <div className="flex items-center gap-2.5 py-1">
            <input
              type="checkbox"
              id="allDay"
              checked={form.allDay}
              onChange={(e) => set("allDay", e.target.checked)}
              className="w-4 h-4 text-peach focus:ring-peach border-border rounded"
            />
            <label htmlFor="allDay" className="text-xs text-espresso font-medium cursor-pointer">All-day event</label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-sans text-[11px] text-espresso-300 uppercase tracking-wide mb-1 block">Start Date</label>
              <Input
                type="date"
                value={form.startDate}
                onChange={(e) => set("startDate", e.target.value)}
                className="bg-cream-200 border-border rounded-xl text-[13px]"
              />
            </div>
            {!form.allDay && (
              <div>
                <label className="font-sans text-[11px] text-espresso-300 uppercase tracking-wide mb-1 block">Start Time</label>
                <Input
                  type="time"
                  value={form.startTime}
                  onChange={(e) => set("startTime", e.target.value)}
                  className="bg-cream-200 border-border rounded-xl text-[13px]"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-sans text-[11px] text-espresso-300 uppercase tracking-wide mb-1 block">End Date</label>
              <Input
                type="date"
                value={form.endDate}
                onChange={(e) => set("endDate", e.target.value)}
                className="bg-cream-200 border-border rounded-xl text-[13px]"
              />
            </div>
            {!form.allDay && (
              <div>
                <label className="font-sans text-[11px] text-espresso-300 uppercase tracking-wide mb-1 block">End Time</label>
                <Input
                  type="time"
                  value={form.endTime}
                  onChange={(e) => set("endTime", e.target.value)}
                  className="bg-cream-200 border-border rounded-xl text-[13px]"
                />
              </div>
            )}
          </div>

          <div>
            <label className="font-sans text-[11px] text-espresso-300 uppercase tracking-wide mb-1 block">Location</label>
            <Input
              type="text"
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="Meeting room or Location"
              className="bg-cream-200 border-border rounded-xl text-[13px]"
            />
          </div>

          <div>
            <label className="font-sans text-[11px] text-espresso-300 uppercase tracking-wide mb-1 block">Description</label>
            <Textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Add description or meeting link..."
              rows={3}
              className="min-h-[80px] resize-none bg-cream-200 border-border rounded-xl text-[13px] leading-relaxed"
            />
          </div>

          <div>
            <label className="font-sans text-[11px] text-espresso-300 uppercase tracking-wide mb-1 block">Guests</label>
            <Input
              type="text"
              value={form.attendees}
              onChange={(e) => set("attendees", e.target.value)}
              placeholder="guest@email.com, colleague@email.com"
              className="bg-cream-200 border-border rounded-xl text-[13px]"
            />
          </div>

          <div>
            <label className="font-sans text-[11px] text-espresso-300 uppercase tracking-wide mb-1 block">Event Color</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => set("colorId", c.id)}
                  title={c.label}
                  className={`w-6.5 h-6.5 rounded-full flex items-center justify-center border-2 transition-transform hover:scale-110 cursor-pointer ${c.dot} ${form.colorId === c.id
                    ? "border-espresso scale-110"
                    : "border-transparent"
                    }`}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-border pt-4 mt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="rounded-pill">
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {mode === "create" ? "Create Event" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
