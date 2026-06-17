import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/src/actions/auth";
import GoogleCalendar from "@/src/components/GoogleCalendar";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export default async function CalendarPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const plan = user.plan || "free";
  if (plan === "free") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#F7F2EA] min-h-[600px]">
        <div className="bg-[#FBF8F2] border border-[rgba(17,24,39,0.06)] rounded-3xl p-8 max-w-md w-full text-center shadow-[0_12px_40px_rgba(0,0,0,0.03)] space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#C67B3D]/10 flex items-center justify-center text-[#C67B3D] mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-[24px] text-[#111827] font-normal">Calendar restricted</h2>
            <p className="font-sans text-[13px] text-[#64748B] leading-relaxed">
              Google Calendar integration, schedules synchronizations, and smart briefings are restricted on the Base Plan.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/pricing"
              className="block w-full text-center rounded-xl bg-[#C67B3D] hover:bg-[#b0672e] text-white text-[13px] font-bold py-3.5 transition-all active:scale-[0.98] shadow-[0_4px_14px_rgba(198,123,61,0.25)] cursor-pointer"
            >
              Upgrade to Alpha or Gama
            </Link>
            <Link
              href="/dashboard"
              className="block w-full text-center rounded-xl bg-white hover:bg-cream-100 border border-[rgba(198,123,61,0.2)] text-[#111827] text-[13px] font-bold py-3.5 transition-all active:scale-[0.98] cursor-pointer"
            >
              Back to Overview
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <GoogleCalendar />;
}

export const dynamic = "force-dynamic";
