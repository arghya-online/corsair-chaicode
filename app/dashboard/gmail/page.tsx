import { redirect } from "next/navigation";

// Redirect old /dashboard/gmail to new /dashboard/communications
export default function GmailRedirect() {
  redirect("/dashboard/communications");
}

export const dynamic = "force-dynamic";
