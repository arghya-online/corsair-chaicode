"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpgradeModal({ open, onOpenChange }: UpgradeModalProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    // Simulate API registration
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);
    toast.success("Successfully joined the waitlist! We will notify you.");
    setEmail("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-cream-100 border-border rounded-2xl max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-[20px] font-normal text-espresso">
            Coming soon
          </DialogTitle>
        </DialogHeader>
        <p className="font-sans text-[13px] leading-relaxed text-espresso-400 mt-2">
          Paid plans are not live yet. We are in early access. Leave your email to be
          notified when Pro launches.
        </p>
        <form onSubmit={handleJoin} className="mt-4 flex flex-col gap-3">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
            className="bg-cream-200 border-border rounded-xl text-[13px]"
          />
          <Button type="submit" disabled={loading} className="w-full rounded-pill">
            {loading ? "Joining..." : "Join waitlist"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export default UpgradeModal;
