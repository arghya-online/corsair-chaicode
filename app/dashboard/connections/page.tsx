import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/src/actions/auth";
import { ConnectionsClient } from "@/src/components/connections/ConnectionsClient";

export default async function ConnectionsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return <ConnectionsClient user={user} />;
}

export const dynamic = "force-dynamic";
