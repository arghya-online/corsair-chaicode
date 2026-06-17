import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/src/actions/auth";
import { DashboardShell } from "@/src/components/layout/DashboardShell";
import PageTransition from "@/src/components/layout/PageTransition";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <DashboardShell user={user}>
      <PageTransition>{children}</PageTransition>
    </DashboardShell>
  );
}
