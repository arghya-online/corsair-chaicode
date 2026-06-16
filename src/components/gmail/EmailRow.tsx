"use client";

import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAvatarColor, getInitials } from "@/src/lib/avatar-color";
import { formatEmailDate } from "@/src/lib/email-utils";

interface EmailRowProps {
  email: {
    id: string;
    from: string;
    subject: string;
    snippet: string;
    updatedAt: string | Date;
    labelIds: string[];
  };
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function EmailRow({ email, isSelected, onSelect }: EmailRowProps) {
  const unread = email.labelIds.includes("UNREAD");
  const senderName = email.from.split("<")[0].replace(/"/g, "").trim() || "Unknown";
  const initials = getInitials(senderName);
  const color = getAvatarColor(senderName);

  return (
    <div
      onClick={() => onSelect(email.id)}
      className={`flex gap-4 items-start px-6 py-5 border-b border-border/40 cursor-pointer transition-colors duration-150 select-none ${
        isSelected
          ? "bg-cream-200"
          : unread
          ? "bg-cream-100/50"
          : "bg-transparent"
      } hover:bg-cream-200/50`}
    >
      {/* Avatar initials */}
      <Avatar className="w-9 h-9 flex-shrink-0 border border-white/60 shadow-sm">
        <AvatarFallback className={`${color.bg} ${color.text} text-[13px] font-sans font-medium`}>
          {initials || "U"}
        </AvatarFallback>
      </Avatar>
 
      {/* Main Metadata */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline gap-2">
          <p className={`font-sans text-[16px] text-espresso truncate ${unread ? "font-semibold text-espresso" : "font-normal text-espresso-400"}`}>
            {senderName}
          </p>
          <p className="font-sans text-[15px] text-espresso-300 whitespace-nowrap flex-shrink-0">
            {formatEmailDate(email.updatedAt)}
          </p>
        </div>
        <p className={`font-sans text-[16px] text-espresso truncate mt-1.5 ${unread ? "font-medium" : "font-normal"}`}>
          {email.subject}
        </p>
        <p className="font-sans text-[15px] text-espresso-400 truncate mt-1">
          {email.snippet}
        </p>
      </div>
 
      {/* Side Status Indicators */}
      {unread && (
        <div className="flex items-center self-center pl-1 flex-shrink-0">
          <div className="w-2 h-2 bg-sage rounded-full shadow-sm" />
        </div>
      )}
    </div>
  );
}
export default EmailRow;
