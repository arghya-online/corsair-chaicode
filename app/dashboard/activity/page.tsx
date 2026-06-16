import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/src/actions/auth";
import { ActivityClient } from "@/src/components/activity/ActivityClient";

export default async function ActivityPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return <ActivityClient />;
}

export const dynamic = "force-dynamic";
