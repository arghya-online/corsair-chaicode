import React from "react";
import { getCurrentUser } from "@/src/actions/auth";
import { FeedbackClient } from "@/src/components/feedback/FeedbackClient";

export default async function FeedbackPage() {
  const user = await getCurrentUser();

  return <FeedbackClient user={user} />;
}
