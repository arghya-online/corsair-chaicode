"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
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
  X,
  Sparkles,
  ChevronDown,
  Filter,
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

const aiLabels: Record<string, { label: string; color: string; dot: string }> =
  {
    urgent: {
      label: "Urgent",
      color: "bg-red-50 text-red-600 border-red-100",
      dot: "bg-red-400",
    },
    action: {
      label: "Action",
      color: "bg-[#C67B3D]/10 text-[#C67B3D] border-[#C67B3D]/20",
      dot: "bg-[#C67B3D]",
    },
    fyi: {
      label: "FYI",
      color: "bg-[#6D8A68]/10 text-[#6D8A68] border-[#6D8A68]/20",
      dot: "bg-[#6D8A68]",
    },
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

  // Compose modal states
  const [composeOpen, setComposeOpen] = useState(false);
  const [replyTo, setReplyTo] = useState("");
  const [replySubject, setReplySubject] = useState("");
  const [replyBody, setReplyBody] = useState("");

  // Resizable panel states (caching in localStorage)
  const [foldersWidth, setFoldersWidth] = useState(200);
  const [listWidth, setListWidth] = useState(340);
  const [resizingPanel, setResizingPanel] = useState<"folders" | "list" | null>(
    null,
  );

  useEffect(() => {
    const savedFolders = localStorage.getItem("zentra_comm_folders_width");
    if (savedFolders) setFoldersWidth(Number(savedFolders));

    const savedList = localStorage.getItem("zentra_comm_list_width");
    if (savedList) setListWidth(Number(savedList));
  }, []);

  // Listeners for panel dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (resizingPanel === "folders") {
        let w = e.clientX;
        if (w < 160) w = 160;
        if (w > 280) w = 280;
        setFoldersWidth(w);
        localStorage.setItem("zentra_comm_folders_width", String(w));
      } else if (resizingPanel === "list") {
        // Measure coordinate relative to Folders width
        let w = e.clientX - foldersWidth;
        if (w < 260) w = 260;
        if (w > 480) w = 480;
        setListWidth(w);
        localStorage.setItem("zentra_comm_list_width", String(w));
      }
    };

    const handleMouseUp = () => {
      setResizingPanel(null);
    };

    if (resizingPanel) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizingPanel, foldersWidth]);

  // Check if compose was triggered from search params
  useEffect(() => {
    if (searchParams.get("compose") === "true") {
      setComposeOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const fetchEmails = useCallback(
    async (query = "") => {
      setLoading(true);
      try {
        const url = query
          ? `/api/gmail/inbox?query=${encodeURIComponent(query)}`
          : "/api/gmail/inbox";
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        let filtered = data.messages ?? [];

        if (activeFolder === "starred")
          filtered = filtered.filter((m: Email) =>
            m.labelIds.includes("STARRED"),
          );
        else if (activeFolder === "sent")
          filtered = filtered.filter((m: Email) => m.labelIds.includes("SENT"));
        else if (activeFolder === "drafts")
          filtered = filtered.filter((m: Email) =>
            m.labelIds.includes("DRAFT"),
          );
        else if (activeFolder === "trash")
          filtered = filtered.filter((m: Email) =>
            m.labelIds.includes("TRASH"),
          );

        // Apply filters if set
        if (activeFilter === "urgent") {
          filtered = filtered.filter(
            (m: Email) =>
              m.subject.toLowerCase().includes("urgent") ||
              m.snippet.toLowerCase().includes("urgent"),
          );
        } else if (activeFilter === "action") {
          filtered = filtered.filter(
            (m: Email) =>
              m.subject.toLowerCase().includes("action") ||
              m.snippet.toLowerCase().includes("please"),
          );
        } else if (activeFilter === "fyi") {
          filtered = filtered.filter(
            (m: Email) =>
              !m.subject.toLowerCase().includes("urgent") &&
              !m.snippet.toLowerCase().includes("please"),
          );
        }

        setEmails(filtered);
      } catch {
        toast.error("Error loading emails.");
      } finally {
        setLoading(false);
      }
    },
    [activeFolder, activeFilter],
  );

  useEffect(() => {
    fetchEmails(debouncedQuery);
  }, [debouncedQuery, fetchEmails]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/gmail/refresh", { method: "POST" });
      if (!res.ok) throw new Error("Failed");
      toast.success("Inbox synced.");
      await fetchEmails(debouncedQuery);
    } catch (err: unknown) {
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

  const unreadCount = emails.filter((m) =>
    m.labelIds.includes("UNREAD"),
  ).length;

  const folders = [
    { id: "inbox", label: "Inbox", icon: Mail, badge: unreadCount },
    { id: "starred", label: "Starred", icon: Star },
    { id: "sent", label: "Sent", icon: Send },
    { id: "drafts", label: "Drafts", icon: FileText },
    { id: "trash", label: "Trash", icon: Trash2 },
  ];

  const filters = [
    { id: "urgent", label: "Urgent Priorities", dot: "bg-red-400" },
    { id: "action", label: "Action Needed", dot: "bg-[#C67B3D]" },
    { id: "fyi", label: "FYI Only", dot: "bg-[#6D8A68]" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F2EA] w-full">
      {/* ── Panel 1: Folders sidebar ── */}
      <aside
        style={{ width: `${foldersWidth}px` }}
        className="flex-shrink-0 flex flex-col bg-white/70 border-r relative border-[rgba(17,24,39,0.06)]"
      >
        <div className="px-5 pt-6 pb-4">
          <h1 className="font-serif text-[24px] text-[#111827] leading-none mb-4">
            Inbox
          </h1>
          <button
            onClick={() => {
              setReplyTo("");
              setReplySubject("");
              setReplyBody("");
              setComposeOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#111827] text-white font-sans text-[12.5px] font-bold hover:bg-[#C67B3D] transition-colors cursor-pointer shadow-sm hover:shadow-[0_4px_12px_rgba(198,123,61,0.15)]"
          >
            <Pencil className="w-3.5 h-3.5" />
            Compose
          </button>
        </div>

        {/* Folders navigation */}
        <nav className="px-3 flex flex-col gap-0.5 mt-2">
          {folders.map((folder) => {
            const Icon = folder.icon;
            const active = activeFolder === folder.id;
            return (
              <button
                key={folder.id}
                onClick={() => setFolder(folder.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[12.5px] font-sans font-medium transition-all duration-200 cursor-pointer ${
                  active
                    ? "bg-[#C67B3D]/8 text-[#C67B3D] font-bold"
                    : "text-[#64748B] hover:text-[#111827] hover:bg-[#F7F2EA]/50"
                }`}
              >
                <Icon
                  className={`w-[16px] h-[16px] flex-shrink-0 ${active ? "text-[#C67B3D]" : "text-[#64748B]"}`}
                />
                <span className="flex-1 text-left">{folder.label}</span>
                {folder.badge && folder.badge > 0 ? (
                  <span className="font-sans text-[10px] font-bold bg-[#C67B3D] text-white rounded-full px-2 py-0.5 text-center min-w-[18px]">
                    {folder.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* AI Filters */}
        <div className="px-5 mt-6 mb-2">
          <p className="font-sans text-[9px] font-bold text-[#64748B]/70 uppercase tracking-widest">
            AI Priority Channels
          </p>
        </div>
        <nav className="px-3 flex flex-col gap-0.5">
          {filters.map((f) => {
            const active = activeFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(active ? "" : f.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[12.5px] font-sans font-medium transition-all duration-200 cursor-pointer ${
                  active
                    ? "bg-[#C67B3D]/8 text-[#C67B3D] font-bold"
                    : "text-[#64748B] hover:text-[#111827] hover:bg-[#F7F2EA]/50"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${f.dot}`}
                />
                <span className="text-left flex-1">{f.label}</span>
              </button>
            );
          })}
        </nav>

        {/* AI summary badge */}
        <div className="mt-auto px-4 pb-6">
          <div className="bg-[#C67B3D]/5 border border-[#C67B3D]/15 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C67B3D]" />
              <span className="font-sans text-[11px] font-bold text-[#111827] uppercase tracking-wider">
                ZENTRA INSIGHT
              </span>
            </div>
            <p className="font-sans text-[11px] text-[#64748B] leading-relaxed">
              Inbox parsed. 3 emails require attention. 2 response drafts
              composed.
            </p>
          </div>
        </div>
      </aside>

      {/* Splitter 1 */}
      <div
        onMouseDown={() => setResizingPanel("folders")}
        className={`w-[4px] cursor-col-resize hover:bg-[#C67B3D]/30 transition-colors z-20 flex-shrink-0 ${resizingPanel === "folders" ? "bg-[#C67B3D]/50" : "bg-transparent"}`}
      />

      {/* ── Panel 2: Email List ── */}
      <div
        style={{ width: `${listWidth}px` }}
        className="flex-shrink-0 flex flex-col bg-white border-r relative border-[rgba(17,24,39,0.06)]"
      >
        {/* Toolbar */}
        <div className="px-4 py-3.5 border-b flex items-center gap-2 border-[rgba(17,24,39,0.06)]">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#F7F2EA]/40 border border-[rgba(17,24,39,0.08)] rounded-xl font-sans text-[12.5px] text-[#111827] placeholder:text-[#64748B]/50 outline-none focus:border-[#C67B3D]/40 transition-colors"
            />
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 rounded-xl text-[#64748B] hover:text-[#111827] hover:bg-[#F7F2EA] transition-colors disabled:opacity-50 cursor-pointer"
            title="Reload Gmail"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        {/* Email list container */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-3 space-y-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-3 p-3.5 rounded-xl">
                  <Skeleton className="w-8.5 h-8.5 rounded-xl bg-cream-300 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-1/3 bg-cream-300 rounded" />
                    <Skeleton className="h-3 w-full bg-cream-200 rounded" />
                    <Skeleton className="h-2.5 w-4/5 bg-cream-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : emails.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center px-6">
              <Mail className="w-8 h-8 text-[#64748B]/35 mb-3" />
              <p className="font-sans text-[13px] font-bold text-[#111827] mb-1">
                Clean Inbox
              </p>
              <p className="font-sans text-[12px] text-[#64748B]">
                All threads resolved. No messages in this view.
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
                  onClick={() =>
                    setSelectedEmailId(isSelected ? null : email.id)
                  }
                  className={`flex gap-3.5 items-start px-4.5 py-4 cursor-pointer transition-all duration-150 border-b border-[rgba(17,24,39,0.04)] select-none ${
                    isSelected
                      ? "bg-[#C67B3D]/8"
                      : unread
                        ? "bg-white"
                        : "bg-[#F7F2EA]/20 hover:bg-[#F7F2EA]/40"
                  }`}
                >
                  <Avatar className="w-8.5 h-8.5 flex-shrink-0 rounded-xl border border-white shadow-xs">
                    <AvatarFallback
                      className={`${color.bg} ${color.text} text-[11px] font-sans font-bold rounded-xl`}
                    >
                      {initials || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-1 mb-0.5">
                      <p
                        className={`font-sans text-[12.5px] truncate ${unread ? "font-bold text-[#111827]" : "font-medium text-[#64748B]"}`}
                      >
                        {senderName}
                      </p>
                      <p className="font-sans text-[10px] text-[#64748B] whitespace-nowrap flex-shrink-0">
                        {formatEmailDate(email.updatedAt)}
                      </p>
                    </div>
                    <p
                      className={`font-sans text-[12.5px] truncate mb-0.5 ${unread ? "font-semibold text-[#111827]" : "text-[#64748B]"}`}
                    >
                      {email.subject}
                    </p>
                    <p className="font-sans text-[11px] text-[#64748B] truncate">
                      {email.snippet}
                    </p>
                  </div>

                  {unread && !isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C67B3D] flex-shrink-0 self-center" />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Splitter 2 */}
      <div
        onMouseDown={() => setResizingPanel("list")}
        className={`w-[4px] cursor-col-resize hover:bg-[#C67B3D]/30 transition-colors z-20 flex-shrink-0 ${resizingPanel === "list" ? "bg-[#C67B3D]/50" : "bg-transparent"}`}
      />

      {/* ── Panel 3: Email Viewer ── */}
      <div className="flex-1 overflow-hidden flex flex-col bg-[#F7F2EA]/40">
        <AnimatePresence mode="wait">
          {selectedEmailId ? (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="flex-1 overflow-hidden h-full"
            >
              <EmailDetail
                emailId={selectedEmailId}
                onClose={() => setSelectedEmailId(null)}
                onReply={(to, subject, body = "") => {
                  setReplyTo(to);
                  setReplySubject(subject);
                  setReplyBody(body);
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
              <div className="w-16 h-16 rounded-[24px] bg-[#C67B3D]/8 flex items-center justify-center mb-5 border border-[#C67B3D]/12">
                <Mail className="w-7 h-7 text-[#C67B3D]" />
              </div>
              <h2 className="font-serif text-[28px] text-[#111827] font-normal mb-2">
                No message open
              </h2>
              <p className="font-sans text-[14px] text-[#64748B] max-w-xs leading-relaxed mb-6">
                Select an email from the priorities timeline list to display
                conversational thread analysis.
              </p>
              <button
                onClick={() => {
                  setReplyTo("");
                  setReplySubject("");
                  setReplyBody("");
                  setComposeOpen(true);
                }}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#111827] hover:bg-[#C67B3D] text-white font-sans text-[13px] font-bold transition-all cursor-pointer shadow-sm"
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
        replyBody={replyBody}
      />
    </div>
  );
}

export const dynamic = "force-dynamic";
