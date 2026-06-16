"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Mail, Calendar, MessageCircle, Crown, Settings } from "lucide-react";
import { LogoMark } from "@/src/components/shared/LogoMark";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { UpgradeModal } from "@/src/components/shared/UpgradeModal";
import { getInitials } from "@/src/lib/avatar-color";

interface SidebarProps {
  user: {
    name?: string | null;
    email: string;
  };
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const initials = getInitials(user.name || user.email);

  const navItems = [
    { label: "Home", icon: Home, href: "/dashboard" },
    { label: "Gmail", icon: Mail, href: "/dashboard/gmail" },
    { label: "Calendar", icon: Calendar, href: "/dashboard/calendar" },
    { label: "Chat", icon: MessageCircle, href: "/dashboard/chat" },
  ];

  return (
    <aside className="w-14 fixed top-0 bottom-0 left-0 bg-cream-100 border-r border-border flex flex-col items-center py-4 z-40 select-none">
      {/* Top Logo */}
      <Link href="/dashboard" className="mb-4">
        <LogoMark />
      </Link>

      {/* Nav Icons */}
      <nav className="mt-2 flex flex-col gap-1 w-full items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Tooltip key={item.label}>
              <TooltipTrigger
                render={
                  <Link href={item.href}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`w-9 h-9 rounded-xl transition-colors ${
                        active ? "bg-peach-soft text-peach-text hover:bg-peach-soft" : "text-espresso-300 hover:bg-cream-200"
                      }`}
                    >
                      <Icon className="w-[18px] h-[18px]" />
                      <span className="sr-only">{item.label}</span>
                    </Button>
                  </Link>
                }
              />
              <TooltipContent side="right" className="bg-espresso text-cream-50 text-[11px] font-sans">
                {item.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="mt-auto flex flex-col gap-1 items-center w-full">
        {/* Upgrade Crown */}
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setUpgradeOpen(true)}
                className="w-9 h-9 rounded-xl text-espresso-300 hover:bg-cream-200"
              >
                <Crown className="w-[18px] h-[18px]" />
                <span className="sr-only">Upgrade</span>
              </Button>
            }
          />
          <TooltipContent side="right" className="bg-espresso text-cream-50 text-[11px] font-sans">
            Upgrade to Pro
          </TooltipContent>
        </Tooltip>

        {/* Settings */}
        <Tooltip>
          <TooltipTrigger
            render={
              <Link href="/dashboard/settings">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`w-9 h-9 rounded-xl transition-colors ${
                    pathname === "/dashboard/settings" ? "bg-peach-soft text-peach-text hover:bg-peach-soft" : "text-espresso-300 hover:bg-cream-200"
                  }`}
                >
                  <Settings className="w-[18px] h-[18px]" />
                  <span className="sr-only">Settings</span>
                </Button>
              </Link>
            }
          />
          <TooltipContent side="right" className="bg-espresso text-cream-50 text-[11px] font-sans">
            Settings
          </TooltipContent>
        </Tooltip>

        {/* User Profile Avatar */}
        <div className="mt-2">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-peach-soft text-peach-text text-[10px] font-sans font-medium">
              {initials || "U"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <UpgradeModal open={upgradeOpen} onOpenChange={setUpgradeOpen} />
    </aside>
  );
}
export default Sidebar;
