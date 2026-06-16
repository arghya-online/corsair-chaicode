import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/src/actions/auth";
import SettingsPanel from "@/src/components/settings/SettingsPanel";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return <SettingsPanel user={user} />;
}
export const dynamic = "force-dynamic";
