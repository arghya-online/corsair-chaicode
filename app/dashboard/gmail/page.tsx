"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Mail,
  Star,
  Send,
  FileText,
  Trash2,
  Pencil,
  Search,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { EmailList } from "@/src/components/gmail/EmailList";
import { EmailDetail } from "@/src/components/gmail/EmailDetail";
import { ComposeModal } from "@/src/components/gmail/ComposeModal";
import { toast } from "sonner";

interface Email {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  updatedAt: string | Date;
  labelIds: string[];
}

export default function GmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeFolder = searchParams.get("folder") || "inbox";
  const activeFilter = searchParams.get("filter") || "";

  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);

  // Compose Modal State
  const [composeOpen, setComposeOpen] = useState(false);
  const [replyTo, setReplyTo] = useState("");
  const [replySubject, setReplySubject] = useState("");

  // Debounced search query
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load emails
  const fetchEmails = useCallback(async (query = "") => {
    setLoading(true);
    try {
      const url = query
        ? `/api/gmail/inbox?query=${encodeURIComponent(query)}`
        : "/api/gmail/inbox";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to load inbox");
      const data = await res.json();
      
      let filtered = data.messages ?? [];
      
      // Perform client-side filter based on selected folders/labels
      if (activeFolder === "starred") {
        filtered = filtered.filter((m: Email) => m.labelIds.includes("STARRED"));
      } else if (activeFolder === "sent") {
        filtered = filtered.filter((m: Email) => m.labelIds.includes("SENT"));
      } else if (activeFolder === "drafts") {
        filtered = filtered.filter((m: Email) => m.labelIds.includes("DRAFT"));
      } else if (activeFolder === "trash") {
        filtered = filtered.filter((m: Email) => m.labelIds.includes("TRASH"));
      }

      setEmails(filtered);
    } catch (err: any) {
      console.error(err);
      toast.error("Error loading emails.");
    } finally {
      setLoading(false);
    }
  }, [activeFolder]);

  useEffect(() => {
    fetchEmails(debouncedQuery);
  }, [debouncedQuery, fetchEmails, activeFolder, activeFilter]);

  // Handle manual sync refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/gmail/refresh", { method: "POST" });
      if (!res.ok) throw new Error("Failed to sync new messages");
      toast.success("Inbox synced successfully.");
      await fetchEmails(debouncedQuery);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message ?? "Failed to sync inbox.");
    } finally {
      setRefreshing(false);
    }
  };

  const handleFolderChange = (folder: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("folder", folder);
    params.delete("filter"); // Clear filters when changing folder
    router.push(`/dashboard/gmail?${params.toString()}`);
    setSelectedEmailId(null);
  };

  const handleFilterChange = (filter: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (filter) {
      params.set("filter", filter);
    } else {
      params.delete("filter");
    }
    router.push(`/dashboard/gmail?${params.toString()}`);
    setSelectedEmailId(null);
  };

  const handleReply = (to: string, subject: string) => {
    setReplyTo(to);
    setReplySubject(subject);
    setComposeOpen(true);
  };

  const unreadCount = emails.filter((m) => m.labelIds.includes("UNREAD")).length;

  const folders = [
    { id: "inbox", label: "Inbox", icon: Mail, badge: unreadCount },
    { id: "starred", label: "Starred", icon: Star },
    { id: "sent", label: "Sent", icon: Send },
    { id: "drafts", label: "Drafts", icon: FileText },
    { id: "trash", label: "Trash", icon: Trash2 },
  ];

  const filters = [
    { id: "urgent", label: "Urgent", color: "bg-red-400" },
    { id: "action", label: "Action needed", color: "bg-butter" },
    { id: "fyi", label: "FYI only", color: "bg-sage" },
  ];

  return (
    <div className="flex h-screen bg-cream-DEFAULT overflow-hidden">
      {/* 1. Left Email Sidebar */}
      <aside className="w-[200px] border-r border-border p-3 flex flex-col bg-cream-DEFAULT flex-shrink-0 select-none">
        {/* Compose Button */}
        <Button
          variant="secondary"
          onClick={() => {
            setReplyTo("");
            setReplySubject("");
            setComposeOpen(true);
          }}
          className="w-full rounded-pill justify-start gap-2 text-[12px] mb-4 font-sans font-medium"
        >
          <Pencil className="w-4 h-4 text-peach-text" /> Compose
        </Button>

        {/* Folders List */}
        <nav className="flex flex-col gap-0.5">
          {folders.map((folder) => {
            const Icon = folder.icon;
            const active = activeFolder === folder.id;
            return (
              <Button
                key={folder.id}
                variant="ghost"
                onClick={() => handleFolderChange(folder.id)}
                className={`w-full justify-start gap-2 text-[12px] rounded-xl px-3 font-sans font-medium ${
                  active
                    ? "bg-peach-soft text-peach-text hover:bg-peach-soft"
                    : "text-espresso-400 hover:bg-cream-200"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 text-left truncate">{folder.label}</span>
                {folder.badge && folder.badge > 0 ? (
                  <Badge className="bg-blush-soft text-blush-text border-transparent text-[10px] rounded-pill font-sans font-medium px-1.5 ml-1">
                    {folder.badge}
                  </Badge>
                ) : null}
              </Button>
            );
          })}
        </nav>

        <Separator className="my-3 bg-border" />

        {/* AI Filters */}
        <p className="font-sans text-[10px] text-espresso-300 uppercase tracking-wide px-3 mb-1 font-medium">
          AI Filters
        </p>
        <nav className="flex flex-col gap-0.5">
          {filters.map((filter) => {
            const active = activeFilter === filter.id;
            return (
              <Button
                key={filter.id}
                variant="ghost"
                onClick={() => handleFilterChange(active ? "" : filter.id)}
                className={`w-full justify-start gap-2 text-[12px] rounded-xl px-3 font-sans font-medium ${
                  active
                    ? "bg-peach-soft text-peach-text hover:bg-peach-soft"
                    : "text-espresso-400 hover:bg-cream-200"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${filter.color} flex-shrink-0`} />
                <span className="flex-1 text-left truncate">{filter.label}</span>
              </Button>
            );
          })}
        </nav>
      </aside>

      {/* 2. Main Inbox Area & Details Panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Email list pane */}
        <div className="flex-1 flex flex-col min-w-0 bg-cream-DEFAULT overflow-hidden">
          {/* Toolbar */}
          <div className="px-4 py-3 border-b border-border flex gap-2 items-center bg-cream-DEFAULT flex-shrink-0 select-none">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-espresso-300" />
              <Input
                type="text"
                placeholder="Search emails"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-cream-200 border-border rounded-xl text-[12px] h-9 w-full placeholder-espresso-300/40"
              />
            </div>

            {/* Refresh Sync Button */}
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="rounded-xl text-espresso-400"
                  >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                    <span className="sr-only">Refresh</span>
                  </Button>
                }
              />
              <TooltipContent side="bottom" className="bg-espresso text-cream-50 text-[11px] font-sans">
                Refresh inbox
              </TooltipContent>
            </Tooltip>

            {/* Filter Toggle Stub */}
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button variant="ghost" size="icon" className="rounded-xl text-espresso-300 cursor-not-allowed">
                    <SlidersHorizontal className="w-4 h-4" />
                    <span className="sr-only">Filters</span>
                  </Button>
                }
              />
              <TooltipContent side="bottom" className="bg-espresso text-cream-50 text-[11px] font-sans">
                Filters (coming soon)
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Messages Grid List */}
          <EmailList
            emails={emails}
            selectedId={selectedEmailId}
            onSelect={setSelectedEmailId}
            loading={loading}
          />
        </div>

        {/* Desktop inline details panel */}
        <AnimatePresence mode="wait">
          {selectedEmailId && (
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="hidden md:block w-[480px] h-full flex-shrink-0"
            >
              <EmailDetail
                emailId={selectedEmailId}
                onClose={() => setSelectedEmailId(null)}
                onReply={handleReply}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Drawer details panel */}
      <div className="md:hidden">
        <Sheet open={!!selectedEmailId} onOpenChange={(open) => !open && setSelectedEmailId(null)}>
          <SheetContent side="right" className="w-full sm:w-[520px] bg-cream-100 p-0 border-l border-border">
            <EmailDetail
              emailId={selectedEmailId}
              onClose={() => setSelectedEmailId(null)}
              onReply={handleReply}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Compose Email Modal */}
      <ComposeModal
        open={composeOpen}
        onOpenChange={setComposeOpen}
        replyTo={replyTo}
        replySubject={replySubject}
      />
    </div>
  );
}
export const dynamic = "force-dynamic";
