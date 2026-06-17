import React from "react";
import { getCurrentUser } from "@/src/actions/auth";
import { PricingClient } from "@/src/components/pricing/PricingClient";

export default async function PricingPage() {
  const user = await getCurrentUser();

  return <PricingClient user={user} />;
}
