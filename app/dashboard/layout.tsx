import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/src/actions/auth";
import Sidebar from "@/src/components/layout/Sidebar";
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
    <div className="flex min-h-screen" style={{ background: "#F7F3EC" }}>
      {/* Sidebar Navigation */}
      <Sidebar user={user} />

      {/* Main Content Area */}
      <main className="ml-[240px] flex-1 min-h-screen relative overflow-x-hidden dashboard-surface">
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  );
}
