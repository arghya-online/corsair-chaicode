"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface SuggestionPillsProps {
  onSelect: (text: string) => void;
}

export function SuggestionPills({ onSelect }: SuggestionPillsProps) {
  const suggestions = [
    "Show my latest emails",
    "Find emails from Amazon",
    "Summarize unread messages",
    "Send an email to john@example.com",
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-2 select-none">
      {suggestions.map((text) => (
        <Button
          key={text}
          variant="ghost"
          onClick={() => onSelect(text)}
          className="rounded-pill border border-border text-[12px] text-espresso-400 hover:bg-cream-200 py-1 h-8 px-3 font-sans font-medium"
        >
          {text}
        </Button>
      ))}
    </div>
  );
}
export default SuggestionPills;
