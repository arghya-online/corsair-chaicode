"use client";

import React from "react";
import EmailRow from "./EmailRow";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail } from "lucide-react";

interface Email {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  updatedAt: string | Date;
  labelIds: string[];
}

interface EmailListProps {
  emails: Email[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  loading: boolean;
}

export function EmailList({ emails, selectedId, onSelect, loading }: EmailListProps) {
  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto">
        {[1, 2, 3, 4, 5].map((idx) => (
          <div key={idx} className="flex gap-3 px-4 py-3 items-start border-b border-border">
            <Skeleton className="w-7 h-7 rounded-full bg-cream-300 flex-shrink-0" />
            <div className="flex-1 min-w-0 space-y-2">
              <Skeleton className="h-3 w-1/3 bg-cream-300 rounded" />
              <Skeleton className="h-3 w-full bg-cream-200 rounded" />
              <Skeleton className="h-2.5 w-3/4 bg-cream-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-12 text-center bg-cream-DEFAULT">
        <Mail className="w-8 h-8 text-espresso-300 mb-3" />
        <p className="font-sans text-[13px] text-espresso-400 font-medium">No messages found</p>
        <p className="font-sans text-[11px] text-espresso-300 max-w-[200px] mt-1">
          Your inbox is currently empty or no search results match.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {emails.map((email) => (
        <EmailRow
          key={email.id}
          email={email}
          isSelected={selectedId === email.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
export default EmailList;
