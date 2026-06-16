"use client";

import React, { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
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

interface ComposeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  replyTo?: string;
  replySubject?: string;
}

export function ComposeModal({
  open,
  onOpenChange,
  replyTo = "",
  replySubject = "",
}: ComposeModalProps) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  // Prefill reply fields if available when opening the modal
  useEffect(() => {
    if (open) {
      setTo(replyTo);
      setSubject(replySubject);
      setBody("");
    }
  }, [open, replyTo, replySubject]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!to.trim() || !to.includes("@")) {
      toast.error("Please enter a valid recipient email.");
      return;
    }
    if (!subject.trim()) {
      toast.error("Please enter a subject.");
      return;
    }
    if (!body.trim()) {
      toast.error("Please enter a message body.");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/gmail/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, body }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to send email");

      toast.success("Email sent successfully.");
      setTo("");
      setSubject("");
      setBody("");
      onOpenChange(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message ?? "Failed to send. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-cream-100 border-border rounded-2xl sm:max-w-[540px]">
        <DialogHeader className="border-b border-border pb-4">
          <DialogTitle className="font-serif text-[18px] font-normal text-espresso">
            New email
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSend} className="flex flex-col gap-3 pt-4">
          <div>
            <label className="font-sans text-[11px] text-espresso-300 uppercase tracking-wide mb-1.5 block">
              To
            </label>
            <Input
              type="email"
              placeholder="recipient@email.com"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              disabled={sending}
              required
              className="bg-cream-200 border-border rounded-xl text-[13px]"
            />
          </div>

          <div>
            <label className="font-sans text-[11px] text-espresso-300 uppercase tracking-wide mb-1.5 block">
              Subject
            </label>
            <Input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={sending}
              required
              className="bg-cream-200 border-border rounded-xl text-[13px]"
            />
          </div>

          <div>
            <label className="font-sans text-[11px] text-espresso-300 uppercase tracking-wide mb-1.5 block">
              Message
            </label>
            <Textarea
              placeholder="Write your message..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              disabled={sending}
              required
              rows={6}
              className="min-h-[160px] resize-none bg-cream-200 border-border rounded-xl text-[13px] leading-relaxed focus:border-peach focus:shadow-focus"
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-border pt-4 mt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={sending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={sending} className="rounded-pill">
              {sending ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : null}
              {sending ? "Sending..." : "Send email"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export default ComposeModal;
