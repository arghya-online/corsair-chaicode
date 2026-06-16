"use client";

import React, { useState, useEffect } from "react";
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
  CheckCircle,
  CloudLightning,
  Sparkles,
} from "lucide-react";

interface SidebarProps {
  user: {
    name?: string | null;
    email: string;
  };
}

// ─── Custom Double-Tone SVG Icons ───────────────────────────────────────────

const OverviewIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5" className="opacity-80" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" fill="currentColor" className="opacity-25" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" className="opacity-80" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" fill="currentColor" className="opacity-25" />
  </svg>
);

const MailIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 13V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12c0 1.1.9 2 2 2h9" />
    <path d="M22 6l-10 7L2 6" className="opacity-75" />
    <circle cx="18" cy="18" r="3" fill="currentColor" className="opacity-25" />
  </svg>
);

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="16" rx="3" />
    <line x1="16" y1="2" x2="16" y2="6" className="opacity-85" />
    <line x1="8" y1="2" x2="8" y2="6" className="opacity-85" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <circle cx="12" cy="15" r="1.5" fill="currentColor" className="opacity-30" />
  </svg>
);

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4" className="opacity-50" />
    <path d="M12 7l1.5 3.5L17 12l-3.5 1.5L12 17l-1.5-3.5L7 12l3.5-1.5z" fill="currentColor" className="opacity-25" />
    <circle cx="12" cy="12" r="9" className="opacity-20" />
  </svg>
);

const ActivityIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    <circle cx="12" cy="12" r="3" fill="currentColor" className="opacity-25" />
  </svg>
);

const SettingsIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" fill="currentColor" className="opacity-25" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 008 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 8a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);

const navItems = [
  { label: "Overview", icon: OverviewIcon, href: "/dashboard" },
  { label: "Communications", icon: MailIcon, href: "/dashboard/communications" },
  { label: "Calendar", icon: CalendarIcon, href: "/dashboard/calendar" },
  { label: "Assistant", icon: SparklesIcon, href: "/dashboard/assistant" },
  { label: "Activity", icon: ActivityIcon, href: "/dashboard/activity" },
];

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { signOut } = useClerk();
  const initials = getInitials(user.name || user.email);

  // Live integration status
  const [gmailConnected, setGmailConnected] = useState(false);
  const [calendarConnected, setCalendarConnected] = useState(false);

  useEffect(() => {
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
  }, []);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === href || pathname === "/dashboard/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <aside
        className="w-[280px] fixed top-0 bottom-0 left-0 flex flex-col z-40 select-none bg-[#FBF8F2] border-r"
        style={{ borderColor: "rgba(17,24,39,0.07)" }}
      >
        {/* Logo + Brand */}
        <div className="px-7 pt-7 pb-5 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <LogoMark className="w-6.5 h-6.5 flex-shrink-0 transition-transform duration-300 group-hover:scale-105" />
            <span className="font-serif text-[20px] text-espresso font-normal tracking-[-0.010em] leading-none mt-0.5">
              Zentra
            </span>
          </Link>
        </div>

        {/* Global Search Bar */}
        <div className="px-5 mb-4">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white/70 border border-espresso-100 hover:bg-white hover:border-accent/20 transition-all duration-200 shadow-xs group"
          >
            <Search className="w-4 h-4 text-espresso-300 group-hover:text-espresso-400 transition-colors" />
            <span className="font-sans text-[13px] text-espresso-300 group-hover:text-espresso-400 flex-1 text-left transition-colors">
              Search workspace...
            </span>
            <kbd className="font-sans text-[11px] text-espresso-300 bg-cream-200 rounded-lg px-2 py-0.5 border border-espresso-100/50">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-4 flex flex-col gap-1 overflow-y-auto">
          <p className="font-sans text-[10px] font-bold text-espresso-300 uppercase tracking-widest px-3 mb-3 mt-2">
            Workspace
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`relative flex items-center gap-3.5 px-4.5 py-3.5 rounded-2xl text-[14.5px] font-medium font-sans transition-all duration-200 group ${
                  active
                    ? "bg-gradient-to-r from-accent-soft to-accent-glow text-espresso shadow-xs border border-accent-light/30 translate-x-1"
                    : "text-espresso-400 hover:text-espresso hover:bg-white/40 hover:-translate-y-0.5"
                }`}
              >
                <Icon
                  className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${
                    active ? "text-accent" : "text-espresso-300 group-hover:text-espresso-400"
                  }`}
                />
                <span className={active ? "font-semibold" : ""}>{item.label}</span>
                {active && (
                  <span className="absolute right-4 w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                )}
              </Link>
            );
          })}

          <div className="mt-5 border-t border-espresso-100/50 pt-5">
            <p className="font-sans text-[10px] font-bold text-espresso-300 uppercase tracking-widest px-3 mb-3">
              System
            </p>
            <Link
              href="/dashboard/settings"
              className={`relative flex items-center gap-3.5 px-4.5 py-3.5 rounded-2xl text-[14.5px] font-medium font-sans transition-all duration-200 group ${
                pathname.startsWith("/dashboard/settings")
                  ? "bg-gradient-to-r from-accent-soft to-accent-glow text-espresso shadow-xs border border-accent-light/30 translate-x-1"
                  : "text-espresso-400 hover:text-espresso hover:bg-white/40 hover:-translate-y-0.5"
              }`}
            >
              <SettingsIcon
                className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${
                  pathname.startsWith("/dashboard/settings") ? "text-accent" : "text-espresso-300 group-hover:text-espresso-400"
                }`}
              />
              <span className={pathname.startsWith("/dashboard/settings") ? "font-semibold" : ""}>Settings</span>
            </Link>
          </div>
        </nav>

        {/* Bottom Area */}
        <div className="p-4 border-t border-espresso-100/60 bg-[#FBF8F2] space-y-2 select-none">
          {/* Connection Status Indicator */}
          <div className="px-3 py-2.5 rounded-2xl bg-white/40 border border-espresso-100 flex items-center justify-between text-[11px] font-sans text-espresso-400">
            <span className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${gmailConnected ? "bg-sage animate-pulse" : "bg-espresso-300"}`} />
              {gmailConnected ? "Gmail Linked" : "No Gmail"}
            </span>
            <span className="w-px h-3 bg-espresso-100" />
            <span className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${calendarConnected ? "bg-sage animate-pulse" : "bg-espresso-300"}`} />
              {calendarConnected ? "Cal Sync" : "No Cal"}
            </span>
          </div>

          {/* Upgrade waitlist / Pro card */}
          <button
            onClick={() => setUpgradeOpen(true)}
            className="w-full flex items-center gap-3 px-4.5 py-3 rounded-2xl text-[13px] font-medium font-sans text-espresso-400 hover:text-espresso hover:bg-white/50 transition-all duration-200"
          >
            <Crown className="w-[16px] h-[16px] text-accent flex-shrink-0" />
            <span>Plan: Early Access</span>
            <span className="ml-auto text-[10px] bg-accent-soft text-accent px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
              Free
            </span>
          </button>

          {/* User Profile widget */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border border-espresso-100 shadow-xs relative group">
            <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center flex-shrink-0 text-white font-sans text-[12px] font-bold">
              {initials || "U"}
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="font-sans text-[12.5px] font-bold text-espresso leading-tight truncate">
                {user.name || "User"}
              </p>
              <p className="font-sans text-[11px] text-espresso-300 truncate">
                {user.email}
              </p>
            </div>
            
            {/* Sign Out Button integrated directly in profile hover */}
            <button
              onClick={() => signOut({ redirectUrl: "/" })}
              className="p-1.5 rounded-lg hover:bg-red-50 text-espresso-300 hover:text-red-500 transition-all cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      <UpgradeModal open={upgradeOpen} onOpenChange={setUpgradeOpen} />
      <CommandPalette open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}

export default Sidebar;
