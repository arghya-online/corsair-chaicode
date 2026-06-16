"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Mail, Star, Send, FileText, Trash2, Pencil,
  Search, RefreshCw, X, Sparkles, ChevronDown,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmailDetail } from "@/src/components/gmail/EmailDetail";
import { ComposeModal } from "@/src/components/gmail/ComposeModal";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAvatarColor, getInitials } from "@/src/lib/avatar-color";
import { formatEmailDate } from "@/src/lib/email-utils";

interface Email {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  updatedAt: string | Date;
  labelIds: string[];
}

const aiLabels: Record<string, { label: string; color: string; dot: string }> = {
  urgent: { label: "Urgent", color: "bg-red-50 text-red-600 border-red-100", dot: "bg-red-400" },
  action: { label: "Action", color: "bg-peach-soft text-peach border-peach/10", dot: "bg-peach" },
  fyi: { label: "FYI", color: "bg-sage-soft text-sage border-sage/10", dot: "bg-sage" },
};

function getSenderName(from: string) {
  return from.split("<")[0].replace(/"/g, "").trim() || "Unknown";
}

export default function CommunicationsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeFolder = searchParams.get("folder") || "inbox";
  const activeFilter = searchParams.get("filter") || "";

  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [replyTo, setReplyTo] = useState("");
  const [replySubject, setReplySubject] = useState("");

  // Check if compose was triggered from another page
  useEffect(() => {
    if (searchParams.get("compose") === "true") {
      setComposeOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const fetchEmails = useCallback(async (query = "") => {
    setLoading(true);
    try {
      const url = query
        ? `/api/gmail/inbox?query=${encodeURIComponent(query)}`
        : "/api/gmail/inbox";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      let filtered = data.messages ?? [];
      if (activeFolder === "starred") filtered = filtered.filter((m: Email) => m.labelIds.includes("STARRED"));
      else if (activeFolder === "sent") filtered = filtered.filter((m: Email) => m.labelIds.includes("SENT"));
      else if (activeFolder === "drafts") filtered = filtered.filter((m: Email) => m.labelIds.includes("DRAFT"));
      else if (activeFolder === "trash") filtered = filtered.filter((m: Email) => m.labelIds.includes("TRASH"));
      setEmails(filtered);
    } catch {
      toast.error("Error loading emails.");
    } finally {
      setLoading(false);
    }
  }, [activeFolder]);

  useEffect(() => { fetchEmails(debouncedQuery); }, [debouncedQuery, fetchEmails]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/gmail/refresh", { method: "POST" });
      if (!res.ok) throw new Error("Failed");
      toast.success("Inbox synced.");
      await fetchEmails(debouncedQuery);
    } catch (err: any) {
      toast.error(err.message ?? "Sync failed.");
    } finally {
      setRefreshing(false);
    }
  };

  const setFolder = (folder: string) => {
    const p = new URLSearchParams();
    p.set("folder", folder);
    router.push(`/dashboard/communications?${p.toString()}`);
    setSelectedEmailId(null);
  };

  const setFilter = (filter: string) => {
    const p = new URLSearchParams(searchParams.toString());
    filter ? p.set("filter", filter) : p.delete("filter");
    router.push(`/dashboard/communications?${p.toString()}`);
    setSelectedEmailId(null);
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
    { id: "urgent", label: "Urgent", dot: "bg-red-400" },
    { id: "action", label: "Action needed", dot: "bg-peach" },
    { id: "fyi", label: "FYI only", dot: "bg-sage" },
  ];

  return (
    <div className="flex h-screen bg-cream-DEFAULT overflow-hidden">

      {/* ── Column 1: Folders & Filters sidebar ────────────────────── */}
      <aside
        className="w-[190px] flex-shrink-0 flex flex-col border-r"
        style={{ borderColor: "rgba(17,24,39,0.07)", background: "#F7F3EC" }}
      >
        {/* Header */}
        <div className="px-4 pt-6 pb-4">
          <h1 className="font-display text-[20px] text-espresso leading-none mb-4">
            Communications
          </h1>
          <button
            onClick={() => { setReplyTo(""); setReplySubject(""); setComposeOpen(true); }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-espresso text-white font-sans text-[12px] font-medium hover:bg-espresso/90 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
            Compose
          </button>
        </div>

        {/* Folders */}
        <nav className="px-2 flex flex-col gap-0.5">
          {folders.map((folder) => {
            const Icon = folder.icon;
            const active = activeFolder === folder.id;
            return (
              <button
                key={folder.id}
                onClick={() => setFolder(folder.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[12px] font-sans font-medium transition-all duration-200 ${
                  active
                    ? "bg-white text-espresso shadow-sm"
                    : "text-espresso-400 hover:text-espresso hover:bg-white/60"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${active ? "text-peach" : "text-espresso-300"}`} />
                <span className="flex-1 text-left">{folder.label}</span>
                {folder.badge && folder.badge > 0 ? (
                  <span className="font-sans text-[10px] font-semibold bg-peach text-white rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                    {folder.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* AI Filters */}
        <div className="px-4 mt-4 mb-2">
          <p className="font-sans text-[10px] font-medium text-espresso-300 uppercase tracking-widest mb-2">
            AI Filters
          </p>
        </div>
        <nav className="px-2 flex flex-col gap-0.5">
          {filters.map((f) => {
            const active = activeFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(active ? "" : f.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[12px] font-sans font-medium transition-all duration-200 ${
                  active
                    ? "bg-white text-espresso shadow-sm"
                    : "text-espresso-400 hover:text-espresso hover:bg-white/60"
                }`}
              >
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${f.dot}`} />
                {f.label}
              </button>
            );
          })}
        </nav>

        {/* AI Summary */}
        <div className="mt-auto px-4 pb-6">
          <div className="bg-white border border-espresso-100 rounded-xl p-3 space-y-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-peach" />
              <span className="font-sans text-[11px] font-medium text-espresso">Zentra AI</span>
            </div>
            <p className="font-sans text-[11px] text-espresso-400 leading-relaxed">
              3 threads need replies. Drafts ready to review.
            </p>
          </div>
        </div>
      </aside>

      {/* ── Column 2: Email List ─────────────────────────────────────── */}
      <div
        className="flex flex-col border-r"
        style={{
          width: selectedEmailId ? "300px" : "380px",
          flexShrink: 0,
          borderColor: "rgba(17,24,39,0.07)",
          background: "#FCFAF7",
          transition: "width 0.25s ease",
        }}
      >
        {/* Toolbar */}
        <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: "rgba(17,24,39,0.07)" }}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-espresso-300" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-cream-200 border border-espresso-100 rounded-xl font-sans text-[12px] text-espresso placeholder:text-espresso-300 outline-none focus:border-peach/40 transition-colors"
            />
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 rounded-xl text-espresso-300 hover:text-espresso hover:bg-cream-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Email list */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-3 space-y-1">
              {[1,2,3,4,5].map((i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl">
                  <Skeleton className="w-8 h-8 rounded-full bg-cream-300 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-2/3 bg-cream-300 rounded" />
                    <Skeleton className="h-3 w-full bg-cream-200 rounded" />
                    <Skeleton className="h-3 w-4/5 bg-cream-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : emails.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center px-6">
              <Mail className="w-8 h-8 text-espresso-300 mb-3" />
              <p className="font-sans text-[13px] font-medium text-espresso mb-1">No messages</p>
              <p className="font-sans text-[12px] text-espresso-300">
                Your inbox is empty or no results match.
              </p>
            </div>
          ) : (
            emails.map((email) => {
              const unread = email.labelIds.includes("UNREAD");
              const senderName = getSenderName(email.from);
              const initials = getInitials(senderName);
              const color = getAvatarColor(senderName);
              const isSelected = selectedEmailId === email.id;

              return (
                <div
                  key={email.id}
                  onClick={() => setSelectedEmailId(isSelected ? null : email.id)}
                  className={`flex gap-3 items-start px-4 py-3.5 cursor-pointer transition-all duration-150 border-b select-none ${
                    isSelected
                      ? "bg-peach-soft border-peach/10"
                      : unread
                      ? "bg-white/70 border-espresso-100/50"
                      : "bg-transparent border-espresso-100/30"
                  } hover:bg-peach-soft/50`}
                >
                  <Avatar className="w-8 h-8 flex-shrink-0 border border-white/60 shadow-sm">
                    <AvatarFallback className={`${color.bg} ${color.text} text-[11px] font-sans font-medium`}>
                      {initials || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-1 mb-0.5">
                      <p className={`font-sans text-[12px] truncate ${unread ? "font-semibold text-espresso" : "font-medium text-espresso-400"}`}>
                        {senderName}
                      </p>
                      <p className="font-sans text-[10px] text-espresso-300 whitespace-nowrap flex-shrink-0">
                        {formatEmailDate(email.updatedAt)}
                      </p>
                    </div>
                    <p className={`font-sans text-[12px] truncate mb-0.5 ${unread ? "font-medium text-espresso" : "text-espresso-400"}`}>
                      {email.subject}
                    </p>
                    <p className="font-sans text-[11px] text-espresso-300 truncate">
                      {email.snippet}
                    </p>
                  </div>

                  {unread && !isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-peach flex-shrink-0 self-center" />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Column 3: Email Detail / Workspace ──────────────────────── */}
      <div className="flex-1 overflow-hidden flex flex-col bg-[#FCFAF7]">
        <AnimatePresence mode="wait">
          {selectedEmailId ? (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex-1 overflow-hidden h-full"
            >
              <EmailDetail
                emailId={selectedEmailId}
                onClose={() => setSelectedEmailId(null)}
                onReply={(to, subject) => {
                  setReplyTo(to);
                  setReplySubject(subject);
                  setComposeOpen(true);
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center text-center px-8"
            >
              <div className="w-16 h-16 rounded-2xl bg-peach-soft flex items-center justify-center mb-5">
                <Mail className="w-7 h-7 text-peach" />
              </div>
              <h2 className="font-display text-[26px] text-espresso font-normal mb-2">
                Select a conversation
              </h2>
              <p className="font-sans text-[14px] text-espresso-400 max-w-xs leading-relaxed mb-6">
                Zentra will surface context, prepare smart drafts, and help you respond faster.
              </p>
              <button
                onClick={() => { setReplyTo(""); setReplySubject(""); setComposeOpen(true); }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-espresso text-white font-sans text-[13px] font-medium hover:bg-espresso/90 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                Compose New
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Compose Modal */}
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
