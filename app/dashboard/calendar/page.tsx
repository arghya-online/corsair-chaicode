import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/src/actions/auth";
import GoogleCalendar from "@/src/components/GoogleCalendar";

export default async function CalendarPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return <GoogleCalendar />;
}

export const dynamic = "force-dynamic";
