import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/src/actions/auth";
import { Badge } from "@/components/ui/badge";
import { DashboardStats } from "@/src/components/dashboard/DashboardStats";
import { ChatPanel } from "@/src/components/chat/ChatPanel";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const firstName = user.name ? user.name.split(" ")[0] : "User";

  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const dateString = today.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const compactDate = today.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" });

  return (
    <div className="p-7 max-w-5xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center select-none">
        <div>
          <h1 className="font-serif text-[28px] font-normal tracking-tight text-espresso">
            Good morning, {firstName}.
          </h1>
          <p className="font-sans text-[12px] text-espresso-300 mt-1">
            {dayName}, {dateString}
          </p>
        </div>
        <Badge variant="outline" className="text-[11px] text-espresso-300 rounded-pill border-border px-3 py-1 font-sans font-medium bg-white">
          {compactDate}
        </Badge>
      </div>

      {/* Stats and Live Chat panel loaded via Client-side fetch */}
      <DashboardStats>
        <ChatPanel />
      </DashboardStats>
    </div>
  );
}
