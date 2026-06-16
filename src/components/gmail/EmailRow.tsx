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
      className={`flex gap-3 items-start px-4 py-3 border-b border-border cursor-pointer transition-colors duration-100 select-none ${
        isSelected
          ? "bg-cream-200"
          : unread
          ? "bg-cream-100"
          : "bg-cream-DEFAULT"
      } hover:bg-cream-200`}
    >
      {/* Avatar initials */}
      <Avatar className="w-7 h-7 flex-shrink-0">
        <AvatarFallback className={`${color.bg} ${color.text} text-[11px] font-sans font-medium`}>
          {initials || "U"}
        </AvatarFallback>
      </Avatar>

      {/* Main Metadata */}
      <div className="flex-1 min-w-0">
        <p className={`font-sans text-[12px] text-espresso truncate ${unread ? "font-medium" : "font-normal"}`}>
          {senderName}
        </p>
        <p className="font-sans text-[12px] text-espresso truncate mt-0.5">
          {email.subject}
        </p>
        <p className="font-sans text-[11px] text-espresso-300 truncate mt-0.5">
          {email.snippet}
        </p>
      </div>

      {/* Side Status Indicators */}
      <div className="flex flex-col items-end justify-between self-stretch flex-shrink-0 gap-1 pl-1">
        <p className="font-sans text-[10px] text-espresso-300 whitespace-nowrap">
          {formatEmailDate(email.updatedAt)}
        </p>
        {unread && (
          <div className="w-1.5 h-1.5 bg-peach rounded-full" />
        )}
      </div>
    </div>
  );
}
export default EmailRow;
