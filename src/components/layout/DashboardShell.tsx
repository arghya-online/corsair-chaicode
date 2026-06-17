"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { LogoMark } from "@/src/components/shared/LogoMark";
import { CommandPalette } from "@/src/components/shared/CommandPalette";
import { UpgradeModal } from "@/src/components/shared/UpgradeModal";
import { getInitials } from "@/src/lib/avatar-color";
import {
  Search,
  Crown,
  LogOut,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Mail,
  Calendar,
  Activity,
  Settings,
  ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DashboardShellProps {
  user: {
    name?: string | null;
    email: string;
    plan?: string | null;
  };
  children: React.ReactNode;
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const initials = getInitials(user.name || user.email);

  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [gmailConnected, setGmailConnected] = useState(false);
  const [calendarConnected, setCalendarConnected] = useState(false);

  const resizeRef = useRef<HTMLDivElement>(null);

  // Load saved width & collapse state from localStorage on mount
  useEffect(() => {
    const savedWidth = localStorage.getItem("zentra_sidebar_width");
    if (savedWidth) setSidebarWidth(Number(savedWidth));

    const savedCollapse = localStorage.getItem("zentra_sidebar_collapsed");
    if (savedCollapse) setIsCollapsed(savedCollapse === "true");

    const handleOpenCommand = () => setSearchOpen(true);
    window.addEventListener("open-zentra-command", handleOpenCommand);

    // Fetch integration stats
    async function checkConnections() {
      try {
        const res = await fetch("/api/dashboard/stats");
        if (res.ok) {
          const stats = await res.json();
          setGmailConnected(!!stats.gmailConnected);
          setCalendarConnected(!!stats.calendarConnected);
        }
      } catch (e) {
        /* silent */
      }
    }
    checkConnections();

    return () => {
      window.removeEventListener("open-zentra-command", handleOpenCommand);
    };
  }, []);

  // Handlers for mouse resizing
  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      let newWidth = e.clientX;
      if (newWidth < 180) newWidth = 180;
      if (newWidth > 400) newWidth = 400;
      setSidebarWidth(newWidth);
      localStorage.setItem("zentra_sidebar_width", String(newWidth));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const toggleCollapse = () => {
    const nextCollapsed = !isCollapsed;
    setIsCollapsed(nextCollapsed);
    localStorage.setItem("zentra_sidebar_collapsed", String(nextCollapsed));
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === href || pathname === "/dashboard/";
    return pathname.startsWith(href);
  };

  const navItems = [
    { label: "Home", icon: LayoutGrid, href: "/dashboard" },
    { label: "Inbox", icon: Mail, href: "/dashboard/communications", badge: true },
    { label: "Calendar", icon: Calendar, href: "/dashboard/calendar" },
    { label: "Activity", icon: Activity, href: "/dashboard/activity" },
    { label: "AI Assistant", icon: Sparkles, href: "/dashboard/assistant" },
    { label: "Settings", icon: Settings, href: "/dashboard/settings" },
  ];

  const currentWidth = isCollapsed ? 72 : sidebarWidth;

  return (
    <div className="flex min-h-screen text-[#111827] relative overflow-hidden" style={{ background: "#F7F2EA" }}>
      
      {/* ─── Sidebar Panel ─── */}
      <aside
        style={{ width: `${currentWidth}px` }}
        className="flex-shrink-0 flex flex-col bg-white border-r relative z-30 select-none transition-all duration-300 ease-out border-[rgba(17,24,39,0.06)]"
      >
        {/* Top Header Row (Logo + Collapse Button) */}
        <div className={`px-5 pt-6 pb-4 flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
          {!isCollapsed && (
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <LogoMark className="w-6.5 h-6.5 flex-shrink-0 transition-transform duration-300 group-hover:scale-105" />
              <span className="font-serif text-[20px] text-[#111827] font-semibold tracking-tight mt-0.5">
                Zentra
              </span>
            </Link>
          )}
          <button
            onClick={toggleCollapse}
            className="p-1.5 rounded-lg hover:bg-[#F7F2EA]/70 text-[#64748B] hover:text-[#111827] transition-colors cursor-pointer"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Global Search Button */}
        <div className="px-3 mb-4">
          {isCollapsed ? (
            <button
              onClick={() => setSearchOpen(true)}
              className="w-10 h-10 mx-auto flex items-center justify-center rounded-xl bg-[#F7F2EA]/50 border border-[rgba(17,24,39,0.08)] hover:bg-[#F7F2EA] transition-colors"
              title="Search workspace (⌘K)"
            >
              <Search className="w-4 h-4 text-[#64748B]" />
            </button>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#F7F2EA]/30 border border-[rgba(17,24,39,0.08)] hover:bg-[#F7F2EA]/60 hover:border-[#C67B3D]/30 transition-all duration-200 group text-left"
            >
              <Search className="w-4 h-4 text-[#64748B] group-hover:text-[#111827] transition-colors" />
              <span className="font-sans text-[12.5px] text-[#64748B] group-hover:text-[#111827] flex-1 transition-colors">
                Search...
              </span>
              <kbd className="font-sans text-[10px] text-[#64748B] bg-white rounded-md px-1.5 py-0.5 border border-[rgba(17,24,39,0.08)]">
                ⌘K
              </kbd>
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-2.5 overflow-y-auto space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`relative flex items-center ${
                  isCollapsed ? "justify-center px-0 py-3" : "px-3.5 py-3 gap-3"
                } rounded-xl text-[13px] font-medium font-sans transition-all duration-200 group ${
                  active
                    ? "bg-[#C67B3D]/8 text-[#C67B3D]"
                    : "text-[#64748B] hover:text-[#111827] hover:bg-[#F7F2EA]/50"
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-[17px] h-[17px] flex-shrink-0 transition-colors ${
                    active ? "text-[#C67B3D]" : "text-[#64748B] group-hover:text-[#111827]"
                  }`}
                />
                
                {!isCollapsed && (
                  <>
                    <span className={active ? "font-semibold text-[#111827]" : ""}>
                      {item.label}
                    </span>
                    
                    {active && (
                      <span className="absolute right-3.5 w-1.5 h-1.5 rounded-full bg-[#C67B3D] animate-pulse" />
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Profile / Sync Widget */}
        <div className="p-3 border-t border-[rgba(17,24,39,0.06)] bg-white space-y-2">
          
          {/* Uptime Status dots */}
          {!isCollapsed ? (
            <div className="px-3 py-2 rounded-xl bg-[#F7F2EA]/40 border border-[rgba(17,24,39,0.05)] flex items-center justify-between text-[10.5px] font-sans text-[#64748B]">
              <span className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${gmailConnected ? "bg-[#6D8A68] animate-pulse" : "bg-[#64748B]"}`} />
                Gmail
              </span>
              <span className="w-px h-2 bg-[rgba(17,24,39,0.08)]" />
              <span className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${calendarConnected ? "bg-[#6D8A68] animate-pulse" : "bg-[#64748B]"}`} />
                Calendar
              </span>
            </div>
          ) : (
            <div className="flex justify-center py-1">
              <span className={`w-2 h-2 rounded-full ${gmailConnected && calendarConnected ? "bg-[#6D8A68] animate-pulse" : "bg-[#64748B]"}`} title="Sync Status" />
            </div>
          )}

          {/* Plan badge / upgrade trigger */}
          {!isCollapsed ? (
            <button
              onClick={() => setUpgradeOpen(true)}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-[12.5px] font-medium font-sans text-[#64748B] hover:text-[#111827] hover:bg-[#F7F2EA]/60 border border-transparent hover:border-[rgba(17,24,39,0.05)] transition-all duration-200"
            >
              <Crown className="w-4 h-4 text-[#C67B3D] flex-shrink-0" />
              <span className="capitalize">Plan: {user.plan || "Base"}</span>
              <span className="ml-auto text-[9px] bg-[#C67B3D]/10 text-[#C67B3D] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                {user.plan === "alpha" || user.plan === "gama" ? user.plan : "Free"}
              </span>
            </button>
          ) : (
            <button
              onClick={() => setUpgradeOpen(true)}
              className="w-10 h-10 mx-auto flex items-center justify-center rounded-xl hover:bg-[#F7F2EA]/70 text-[#C67B3D] transition-colors"
              title={`Active Plan: ${user.plan ? user.plan.toUpperCase() : "BASE"}`}
            >
              <Crown className="w-4 h-4" />
            </button>
          )}

          {/* User Profile avatar bar */}
          <div className={`flex items-center ${isCollapsed ? "justify-center p-1" : "p-2 gap-2.5"} rounded-xl bg-[#F7F2EA]/30 border border-[rgba(17,24,39,0.05)] relative group`}>
            <div className="w-7.5 h-7.5 rounded-lg bg-[#C67B3D] flex items-center justify-center flex-shrink-0 text-white font-sans text-[11px] font-bold shadow-xs">
              {initials || "U"}
            </div>
            
            {!isCollapsed && (
              <>
                <div className="min-w-0 flex-1 text-left">
                  <p className="font-sans text-[12px] font-bold text-[#111827] leading-tight truncate">
                    {user.name || "User"}
                  </p>
                  <p className="font-sans text-[10.5px] text-[#64748B] truncate">
                    {user.email}
                  </p>
                </div>
                
                <button
                  onClick={() => signOut({ redirectUrl: "/" })}
                  className="p-1 rounded-lg hover:bg-red-50 text-[#64748B] hover:text-red-500 transition-colors cursor-pointer flex-shrink-0"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Drag Resizing Handle (only if not collapsed) */}
        {!isCollapsed && (
          <div
            onMouseDown={startResizing}
            className={`absolute top-0 bottom-0 right-0 w-1 cursor-col-resize hover:bg-[#C67B3D]/30 transition-colors z-50 ${isResizing ? "bg-[#C67B3D]/50" : "bg-transparent"}`}
          />
        )}
      </aside>

      {/* ─── Main Content Wrapper ─── */}
      <main className="flex-1 min-h-screen relative overflow-x-hidden flex flex-col bg-[#F7F2EA] z-10">
        {children}
      </main>

      <UpgradeModal open={upgradeOpen} onOpenChange={setUpgradeOpen} />
      <CommandPalette open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}
