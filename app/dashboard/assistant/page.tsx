import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/src/actions/auth";
import { AssistantClient } from "@/src/components/chat/AssistantClient";

export default async function AssistantPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return <AssistantClient />;
}

export const dynamic = "force-dynamic";
