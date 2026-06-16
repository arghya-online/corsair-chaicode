"use client";

import React, { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import UpgradeModal from "@/src/components/shared/UpgradeModal";

export function CalendarStub() {
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  return (
    <div className="p-7 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-serif text-[22px] text-espresso font-normal">Calendar</h1>
        <Badge className="bg-lavender-soft text-lavender-text border-transparent text-[11px] rounded-pill font-sans font-medium px-2.5 py-0.5">
          Coming soon
        </Badge>
      </div>

      {/* Main Stub Content Card */}
      <Card className="max-w-[480px] mx-auto mt-12 p-10 text-center bg-cream-100 border-border shadow-card select-none">
        <CalendarIcon className="w-7 h-7 text-espresso-300 mx-auto mb-3" />
        <h2 className="font-sans text-[15px] font-medium text-espresso mb-2">
          Google Calendar integration
        </h2>
        <p className="font-sans text-[13px] text-espresso-400 leading-relaxed mb-5">
          Calendar sync is in progress. Once connected, you will be able to view your schedule,
          create events, and send invites from here.
        </p>
        <Button
          variant="ghost"
          onClick={() => setUpgradeOpen(true)}
          className="rounded-pill border border-border text-[12px] font-sans font-medium px-4"
        >
          Notify me when ready
        </Button>
      </Card>

      <UpgradeModal open={upgradeOpen} onOpenChange={setUpgradeOpen} />
    </div>
  );
}
export default CalendarStub;
