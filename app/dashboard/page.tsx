import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/src/actions/auth";
import { OverviewClient } from "@/src/components/dashboard/OverviewClient";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const firstName = user.name ? user.name.split(" ")[0] : "there";

  return <OverviewClient firstName={firstName} />;
}

export const dynamic = "force-dynamic";
