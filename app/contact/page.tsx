import React from "react";
import { getCurrentUser } from "@/src/actions/auth";
import { ContactClient } from "@/src/components/contact/ContactClient";

export default async function ContactPage() {
  const user = await getCurrentUser();

  return <ContactClient user={user} />;
}
