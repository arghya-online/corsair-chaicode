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
          <div key={idx} className="flex gap-4 px-6 py-5 items-start border-b border-border/40">
            <Skeleton className="w-9 h-9 rounded-full bg-cream-300 flex-shrink-0" />
            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4.5 w-1/3 bg-cream-300 rounded" />
                <Skeleton className="h-3.5 w-16 bg-cream-200 rounded" />
              </div>
              <Skeleton className="h-4.5 w-3/4 bg-cream-300 rounded" />
              <Skeleton className="h-4 w-5/6 bg-cream-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-16 text-center bg-transparent">
        <Mail className="w-10 h-10 text-espresso-300 mb-4" />
        <p className="font-sans text-[16px] text-espresso font-semibold">No messages found</p>
        <p className="font-sans text-[15px] text-espresso-400 max-w-[280px] mt-2 leading-relaxed">
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
