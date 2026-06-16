import { redirect } from "next/navigation";

// Redirect old /dashboard/chat to the new /dashboard/assistant
export default function ChatRedirect() {
  redirect("/dashboard/assistant");
}

export const dynamic = "force-dynamic";
