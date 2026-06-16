"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Mail, Calendar, Sparkles, ArrowRight, X, Clock, Star } from "lucide-react";
import Link from "next/link";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const quickActions = [
  { id: "compose", label: "Compose new email", icon: Mail, href: "/dashboard/communications?compose=true", tag: "Action" },
  { id: "calendar", label: "View today's schedule", icon: Calendar, href: "/dashboard/calendar", tag: "Navigate" },
  { id: "assistant", label: "Ask Zentra AI", icon: Sparkles, href: "/dashboard/assistant", tag: "AI" },
];

const recentItems = [
  { id: "r1", label: "Project sync notes", icon: Mail, meta: "From: team@company.com", tag: "Email" },
  { id: "r2", label: "Q3 Planning Meeting", icon: Calendar, meta: "Tomorrow, 10:00 AM", tag: "Event" },
  { id: "r3", label: "Weekly retrospective draft", icon: Star, meta: "Draft saved", tag: "Draft" },
];

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Global keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 80);
      setQuery("");
    }
  }, [open]);

  const filteredActions = quickActions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );
  const filteredRecent = recentItems.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[80] bg-espresso/20 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-[18vh] left-1/2 -translate-x-1/2 z-[90] w-full max-w-[600px] mx-4"
          >
            <div className="bg-[#FCFAF7] rounded-2xl border border-espresso-100 shadow-[0_32px_80px_-8px_rgba(17,24,39,0.12),0_8px_24px_-4px_rgba(17,24,39,0.08)] overflow-hidden">
              
              {/* Search Input */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-espresso-100">
                <Search className="w-4 h-4 text-espresso-300 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search emails, events, drafts, or ask AI..."
                  className="flex-1 bg-transparent font-sans text-[15px] text-espresso placeholder:text-espresso-300 outline-none"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="p-1 rounded-lg text-espresso-300 hover:text-espresso hover:bg-cream-200 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <kbd className="font-sans text-[11px] text-espresso-300 bg-cream-200 border border-espresso-100 rounded px-1.5 py-0.5 flex-shrink-0">
                  Esc
                </kbd>
              </div>

              <div className="p-3 max-h-[380px] overflow-y-auto">
                {/* Quick Actions */}
                {filteredActions.length > 0 && (
                  <div className="mb-2">
                    <p className="font-sans text-[10px] font-medium text-espresso-300 uppercase tracking-widest px-3 py-2">
                      Quick Actions
                    </p>
                    {filteredActions.map((action) => {
                      const Icon = action.icon;
                      return (
                        <Link
                          key={action.id}
                          href={action.href}
                          onClick={() => onOpenChange(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-cream-200 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-xl bg-peach-soft flex items-center justify-center flex-shrink-0">
                            <Icon className="w-4 h-4 text-peach" />
                          </div>
                          <span className="font-sans text-[13px] font-medium text-espresso flex-1">
                            {action.label}
                          </span>
                          <span className="font-sans text-[10px] text-espresso-300 bg-cream-300 rounded-md px-2 py-0.5">
                            {action.tag}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-espresso-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      );
                    })}
                  </div>
                )}

                {/* Recent */}
                {filteredRecent.length > 0 && (
                  <div>
                    <p className="font-sans text-[10px] font-medium text-espresso-300 uppercase tracking-widest px-3 py-2">
                      Recent
                    </p>
                    {filteredRecent.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-cream-200 transition-colors cursor-pointer group"
                        >
                          <div className="w-8 h-8 rounded-xl bg-cream-300 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-4 h-4 text-espresso-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-sans text-[13px] font-medium text-espresso truncate">
                              {item.label}
                            </p>
                            <p className="font-sans text-[11px] text-espresso-300 truncate">
                              {item.meta}
                            </p>
                          </div>
                          <span className="font-sans text-[10px] text-espresso-300 bg-cream-300 rounded-md px-2 py-0.5 flex-shrink-0">
                            {item.tag}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Empty state */}
                {filteredActions.length === 0 && filteredRecent.length === 0 && (
                  <div className="py-12 text-center">
                    <Clock className="w-8 h-8 text-espresso-300 mx-auto mb-3" />
                    <p className="font-sans text-[14px] text-espresso-400">
                      No results for &ldquo;{query}&rdquo;
                    </p>
                    <p className="font-sans text-[12px] text-espresso-300 mt-1">
                      Try searching for emails, events, or people.
                    </p>
                  </div>
                )}
              </div>

              {/* Footer hint */}
              <div className="px-5 py-3 border-t border-espresso-100 flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <kbd className="font-sans text-[10px] text-espresso-300 bg-cream-200 border border-espresso-100 rounded px-1.5 py-0.5">↑↓</kbd>
                  <span className="font-sans text-[11px] text-espresso-300">Navigate</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <kbd className="font-sans text-[10px] text-espresso-300 bg-cream-200 border border-espresso-100 rounded px-1.5 py-0.5">↵</kbd>
                  <span className="font-sans text-[11px] text-espresso-300">Open</span>
                </div>
                <div className="flex items-center gap-1.5 ml-auto">
                  <Sparkles className="w-3 h-3 text-peach" />
                  <span className="font-sans text-[11px] text-peach font-medium">Zentra AI</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
