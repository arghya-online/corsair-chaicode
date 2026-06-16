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
    <div className="flex min-h-screen bg-cream-DEFAULT">
      {/* Sidebar Navigation */}
      <Sidebar user={user} />

      {/* Main Content Area */}
      <main className="ml-14 flex-1 min-h-screen relative bg-cream-DEFAULT overflow-x-hidden">
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  );
}
