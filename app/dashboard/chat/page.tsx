import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/src/actions/auth";
import ChatPanel from "@/src/components/chat/ChatPanel";

export default async function ChatPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="h-screen flex flex-col">
      <ChatPanel />
    </div>
  );
}
export const dynamic = "force-dynamic";
