"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Send,
  MessageCircle,
  ArrowUp,
  RefreshCw,
  Trash2,
  Mail,
  Calendar,
  Edit3,
  CheckCircle2,
  PanelLeft,
  PanelRight
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TypingIndicator } from "./TypingIndicator";
import { SuggestionPills } from "./SuggestionPills";
import { toast } from "sonner";
import { EventModal } from "@/src/components/shared/EventModal";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatPanelProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  conversationId: string | null;
  setConversationId: React.Dispatch<React.SetStateAction<string | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  historyLoading: boolean;
  setHistoryLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isHistoryCollapsed: boolean;
  setIsHistoryCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isContextCollapsed: boolean;
  setIsContextCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  toggleHistory: () => void;
  toggleContext: () => void;
  handleSend: (text: string) => Promise<void>;
  handleClear: () => Promise<void>;
  clearing: boolean;
}

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "Hello! I'm Zentra, your AI assistant. I can manage your Gmail inbox and Google Calendar — schedule meetings, add reminders, read emails, draft replies, and more. What should we work on today?",
};

// Clean helper to strip leading/trailing asterisks
const cleanStr = (str: string) => str.replace(/^\*\*|\*\*$/g, "").trim();

// Time parsing fallback helper for calendar modals
function parseTimeToIso(timeStr: string, hourOffset = 0): Date {
  try {
    const d = new Date(timeStr);
    if (!isNaN(d.getTime())) {
      d.setHours(d.getHours() + hourOffset);
      return d;
    }
  } catch {}
  const d = new Date();
  d.setHours(d.getHours() + hourOffset);
  return d;
}

// ─── Structured Reply Parser ─────────────────
function parseStructuredContent(text: string) {
  if (!text) return null;

  // 1. Check for Email Draft
  const subjectMatch = text.match(/(?:\*\*Subject\*\*|Subject):\s*([^\n]+)/i);
  const bodyMatch = text.match(/(?:\*\*Body\*\*|Body):\s*([\s\S]+)/i);
  const toMatch = text.match(/(?:\*\*To\*\*|To):\s*([^\n]+)/i);

  if (subjectMatch && bodyMatch) {
    const subject = cleanStr(subjectMatch[1]);
    const body = cleanStr(bodyMatch[1]);
    const to = toMatch ? cleanStr(toMatch[1]) : "";

    const draftIndex = text.search(/(?:\*\*Subject\*\*|Subject|(?:\*\*To\*\*|To)):\s*/i);
    const messageText = draftIndex !== -1 ? text.substring(0, draftIndex).trim() : text;

    return {
      type: "email-draft" as const,
      messageText: messageText || "Here is your email draft:",
      draft: { to, subject, body }
    };
  }

  // 2. Check for Calendar Event
  const eventMatch = text.match(/(?:\*\*Event\*\*|\*\*Title\*\*|Event|Title):\s*([^\n]+)/i);
  const startMatch = text.match(/(?:\*\*Date\*\*|\*\*Start\*\*|\*\*Time\*\*|Date|Start|Time):\s*([^\n]+)/i);

  if (eventMatch && startMatch) {
    const title = cleanStr(eventMatch[1]);
    const timeInfo = cleanStr(startMatch[1]);
    
    const locationMatch = text.match(/(?:\*\*Location\*\*|Location):\s*([^\n]+)/i);
    const location = locationMatch ? cleanStr(locationMatch[1]) : "";

    const idMatch = text.match(/(?:\*\*ID\*\*|\*\*Event ID\*\*|ID|Event ID|Event_ID|id):\s*([a-zA-Z0-9_]+)/i);
    const eventId = idMatch ? cleanStr(idMatch[1]) : "";

    const eventIndex = text.search(/(?:\*\*Event\*\*|\*\*Title\*\*|Event|Title):\s*/i);
    const messageText = eventIndex !== -1 ? text.substring(0, eventIndex).trim() : text;

    return {
      type: "calendar-event" as const,
      messageText: messageText || "Here is the scheduled calendar event:",
      event: { title, timeInfo, location, eventId }
    };
  }

  return null;
}

// ─── Inline Markdown-lite renderer ─────────────────
function renderContent(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (/^[-•*]\s/.test(line) || /^\d+\.\s/.test(line)) {
      const listItems: string[] = [];
      while (i < lines.length && (/^[-•*]\s/.test(lines[i]) || /^\d+\.\s/.test(lines[i]))) {
        listItems.push(lines[i].replace(/^[-•*\d.]\s+/, ""));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="space-y-1 my-1.5 pl-3">
          {listItems.map((item, j) => (
            <li key={j} className="flex gap-1.5 items-start">
              <span className="text-[#C67B3D] flex-shrink-0 mt-0.5">•</span>
              <span dangerouslySetInnerHTML={{ __html: inlineBold(item) }} />
            </li>
          ))}
        </ul>
      );
      continue;
    }

    if (!line.trim()) {
      elements.push(<div key={`br-${i}`} className="h-2" />);
      i++;
      continue;
    }

    elements.push(
      <p key={`p-${i}`} className="leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: inlineBold(line) }} />
    );
    i++;
  }

  return <div className="space-y-0.5">{elements}</div>;
}

function inlineBold(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`(.+?)`/g, '<code class="bg-[#F7F2EA] px-1 py-0.5 rounded text-[10px] font-mono text-[#C67B3D]">$1</code>');
}

// ─── Email Draft Card Component ─────────────────
interface EmailDraftCardProps {
  draft: { to: string; subject: string; body: string };
  onRegenerate: (prompt: string) => void;
}

function EmailDraftCard({ draft, onRegenerate }: EmailDraftCardProps) {
  const [to, setTo] = useState(draft.to || "");
  const [subject, setSubject] = useState(draft.subject);
  const [body, setBody] = useState(draft.body);
  const [isEditing, setIsEditing] = useState(false);
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  // Backup edit state
  const [backupTo, setBackupTo] = useState(draft.to);
  const [backupSubject, setBackupSubject] = useState(draft.subject);
  const [backupBody, setBackupBody] = useState(draft.body);

  const handleEdit = () => {
    setBackupTo(to);
    setBackupSubject(subject);
    setBackupBody(body);
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Draft edits saved locally.");
  };

  const handleCancel = () => {
    setTo(backupTo);
    setSubject(backupSubject);
    setBody(backupBody);
    setIsEditing(false);
  };

  const handleSend = async () => {
    if (!to.trim()) {
      toast.error("Please enter a recipient address.");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/gmail/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, body }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error ?? "Failed to send email");
      }
      setSentSuccess(true);
      toast.success("Email sent successfully via Gmail API!");
    } catch (err: any) {
      toast.error(err.message ?? "Email send failed");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white border border-[rgba(198,123,61,0.15)] rounded-2xl p-4.5 mt-3 space-y-4 shadow-sm max-w-full relative select-none">
      <div className="flex items-center justify-between border-b border-[rgba(17,24,39,0.05)] pb-3">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-[#C67B3D]" />
          <span className="text-[11px] font-bold text-[#111827] uppercase tracking-wider">Gmail Draft</span>
        </div>
        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${sentSuccess ? "bg-[#6D8A68]/15 text-[#6D8A68]" : "bg-[#C67B3D]/10 text-[#C67B3D]"}`}>
          {sentSuccess ? "Sent" : "Ready"}
        </span>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wide">To</label>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@domain.com"
              className="w-full mt-1 px-3 py-2 bg-[#F7F2EA]/20 border border-[rgba(17,24,39,0.08)] rounded-xl text-[12.5px] text-[#111827] focus:outline-none focus:border-[#C67B3D]"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wide">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-[#F7F2EA]/20 border border-[rgba(17,24,39,0.08)] rounded-xl text-[12.5px] text-[#111827] focus:outline-none focus:border-[#C67B3D]"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wide">Body</label>
            <textarea
              value={body}
              rows={4}
              onChange={(e) => setBody(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-[#F7F2EA]/20 border border-[rgba(17,24,39,0.08)] rounded-xl text-[12.5px] text-[#111827] focus:outline-none focus:border-[#C67B3D] resize-none leading-relaxed"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-[rgba(17,24,39,0.05)]">
            <button
              onClick={handleCancel}
              className="px-3 py-1.5 rounded-lg border border-[rgba(17,24,39,0.08)] hover:bg-[#F7F2EA]/50 text-[11.5px] font-semibold text-[#64748B] cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1.5 rounded-lg bg-[#111827] hover:bg-[#C67B3D] text-white text-[11.5px] font-semibold cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3.5 text-[13px] leading-relaxed">
          <div className="grid grid-cols-[50px_1fr] border-b border-[rgba(17,24,39,0.03)] pb-2">
            <span className="text-[#64748B] font-medium">To:</span>
            <span className="text-[#111827] font-semibold truncate">{to || "(No recipient)"}</span>
          </div>
          <div className="grid grid-cols-[50px_1fr] border-b border-[rgba(17,24,39,0.03)] pb-2">
            <span className="text-[#64748B] font-medium">Subject:</span>
            <span className="text-[#111827] font-semibold truncate">{subject || "(No subject)"}</span>
          </div>
          <div className="bg-[#F7F2EA]/30 rounded-xl p-3 text-[12px] text-[#64748B] whitespace-pre-wrap leading-relaxed border border-[rgba(17,24,39,0.04)] font-medium">
            {body}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[rgba(17,24,39,0.05)]">
            <div className="flex gap-1.5">
              <button
                onClick={handleEdit}
                disabled={sentSuccess}
                className="px-3 py-1.5 rounded-lg border border-[rgba(17,24,39,0.08)] hover:bg-[#F7F2EA]/50 text-[11px] font-semibold text-[#64748B] hover:text-[#111827] transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                onClick={() => onRegenerate(`Rewrite the email draft: "${subject}". Make it more enthusiastic.`)}
                disabled={sentSuccess}
                className="px-3 py-1.5 rounded-lg border border-[rgba(17,24,39,0.08)] hover:bg-[#F7F2EA]/50 text-[11px] font-semibold text-[#64748B] hover:text-[#111827] transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Regenerate
              </button>
            </div>
            
            <button
              onClick={handleSend}
              disabled={sending || sentSuccess}
              className={`px-4 py-1.5 rounded-lg text-[11.5px] font-bold text-white transition-all flex items-center gap-1.5 cursor-pointer ${sentSuccess ? "bg-[#6D8A68]" : "bg-[#111827] hover:bg-[#C67B3D]"}`}
            >
              {sending ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : sentSuccess ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              {sentSuccess ? "Sent" : "Execute (Send)"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Calendar Event Card Component ─────────────────
interface CalendarEventCardProps {
  event: { title: string; timeInfo: string; location: string; eventId: string };
  onOpenEditModal: (data: any) => void;
}

function CalendarEventCard({ event, onOpenEditModal }: CalendarEventCardProps) {
  const [deleted, setDeleted] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Cancel and delete event "${event.title}"?`)) return;
    if (!event.eventId) {
      toast.info("No Event ID found. Removing locally.");
      setDeleted(true);
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch(`/api/calendar/events/${encodeURIComponent(event.eventId)}?calendarId=primary`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? "Failed to delete");
      setDeleted(true);
      toast.success("Event cancelled successfully.");
    } catch (err: any) {
      toast.error(err.message ?? "Cancel event failed");
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = () => {
    onOpenEditModal({
      id: event.eventId,
      summary: event.title,
      location: event.location,
      description: "Scheduled via Zentra Assistant",
      start: { dateTime: parseTimeToIso(event.timeInfo).toISOString() },
      end: { dateTime: parseTimeToIso(event.timeInfo, 1).toISOString() }
    });
  };

  return (
    <div className="bg-white border border-[rgba(198,123,61,0.15)] rounded-2xl p-4.5 mt-3 space-y-4 shadow-sm max-w-full select-none">
      <div className="flex items-center justify-between border-b border-[rgba(17,24,39,0.05)] pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#C67B3D]" />
          <span className="text-[11px] font-bold text-[#111827] uppercase tracking-wider">Calendar Event</span>
        </div>
        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${deleted ? "bg-red-50 text-red-600" : "bg-[#6D8A68]/15 text-[#6D8A68]"}`}>
          {deleted ? "Cancelled" : "Scheduled"}
        </span>
      </div>

      <div className="space-y-3 text-[13px] leading-relaxed">
        <div className="grid grid-cols-[70px_1fr] border-b border-[rgba(17,24,39,0.03)] pb-2">
          <span className="text-[#64748B] font-medium">Event:</span>
          <span className="text-[#111827] font-semibold truncate">{event.title}</span>
        </div>
        <div className="grid grid-cols-[70px_1fr] border-b border-[rgba(17,24,39,0.03)] pb-2">
          <span className="text-[#64748B] font-medium">Schedule:</span>
          <span className="text-[#111827] font-semibold truncate">{event.timeInfo}</span>
        </div>
        {event.location && (
          <div className="grid grid-cols-[70px_1fr] border-b border-[rgba(17,24,39,0.03)] pb-2">
            <span className="text-[#64748B] font-medium">Location:</span>
            <span className="text-[#111827] truncate">{event.location}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-[rgba(17,24,39,0.05)]">
          <button
            onClick={handleEdit}
            disabled={deleted}
            className="px-3 py-1.5 rounded-lg border border-[rgba(17,24,39,0.08)] hover:bg-[#F7F2EA]/50 text-[11px] font-semibold text-[#64748B] hover:text-[#111827] transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-40"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Reschedule
          </button>
          
          <button
            onClick={handleDelete}
            disabled={deleting || deleted}
            className="px-3 py-1.5 rounded-lg text-[11px] font-bold border border-red-200 hover:bg-red-50 text-red-600 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-40"
          >
            {deleting ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
            {deleted ? "Deleted" : "Execute (Cancel)"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Chat Panel Component ─────────────────
export function ChatPanel({
  messages,
  loading,
  historyLoading,
  isHistoryCollapsed,
  isContextCollapsed,
  toggleHistory,
  toggleContext,
  handleSend,
  handleClear,
  clearing
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // EventModal support inside the assistant view
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [eventModalInitial, setEventModalInitial] = useState<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      triggerSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const triggerSend = () => {
    if (!input.trim() || loading) return;
    handleSend(input);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const isInitialState = messages.length === 1 && messages[0] === WELCOME_MESSAGE && !loading;

  return (
    <div className="flex flex-col h-full bg-[#F7F2EA] w-full overflow-hidden">
      
      {/* ── Toolbar Header Row ── */}
      <div className="px-6 py-4.5 border-b border-[rgba(17,24,39,0.06)] bg-white flex items-center justify-between flex-shrink-0 select-none z-10">
        <div className="flex items-center gap-3">
          {/* History Collapsible trigger button */}
          <button
            onClick={toggleHistory}
            className={`p-2 hover:bg-[#F7F2EA] rounded-xl text-[#64748B] hover:text-[#111827] transition-all cursor-pointer ${
              !isHistoryCollapsed ? "bg-[#F7F2EA] text-[#C67B3D]" : ""
            }`}
            title={isHistoryCollapsed ? "Expand logs sidebar" : "Collapse logs sidebar"}
          >
            <PanelLeft className="w-4.5 h-4.5" />
          </button>
          
          <div className="flex items-center gap-2">
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-[#6D8A68] inline-block"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div>
              <h1 className="font-display text-[18px] font-semibold text-[#111827] tracking-tight">
                AI Assistant Console
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isInitialState && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={clearing}
              className="text-[12px] text-[#64748B] hover:text-red-500 rounded-pill hover:bg-red-50 h-8.5 px-3"
            >
              {clearing ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1.5" />
              ) : (
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              )}
              Clear Memory
            </Button>
          )}

          {/* Context Collapsible trigger button */}
          <button
            onClick={toggleContext}
            className={`p-2 hover:bg-[#F7F2EA] rounded-xl text-[#64748B] hover:text-[#111827] transition-all cursor-pointer ${
              !isContextCollapsed ? "bg-[#F7F2EA] text-[#C67B3D]" : ""
            }`}
            title={isContextCollapsed ? "Expand context sidebar" : "Collapse context sidebar"}
          >
            <PanelRight className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* ── Messages Canvas Thread ── */}
      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-4 bg-[#F7F2EA]">
        {historyLoading ? (
          <div className="flex-1 flex items-center justify-center text-[13px] text-[#64748B] font-semibold font-sans">
            <RefreshCw className="w-4.5 h-4.5 animate-spin mr-2 text-[#C67B3D]" />
            Initializing active session log...
          </div>
        ) : (
          <>
            {isInitialState ? (
              /* Suggestion Pills Empty State */
              <div className="flex-1 flex flex-col items-center justify-center gap-4 py-8">
                <div className="w-13 h-13 bg-white border border-[rgba(198,123,61,0.15)] rounded-2xl flex items-center justify-center shadow-xs">
                  <MessageCircle className="w-6 h-6 text-[#C67B3D]" />
                </div>
                <h2 className="font-serif text-[24px] font-normal text-[#111827] text-center">
                  Chat with Zentra AI
                </h2>
                <p className="font-sans text-[13px] text-[#64748B] text-center max-w-[340px] leading-relaxed">
                  Compose drafts, find mail logs, check availability, schedule meetings, or query the assistant directly:
                </p>
                <SuggestionPills onSelect={handleSend} />
              </div>
            ) : (
              /* Conversation bubbles thread */
              <div className="space-y-4">
                {messages.map((msg, idx) => {
                  const isUser = msg.role === "user";
                  const parsed = !isUser ? parseStructuredContent(msg.content) : null;

                  return (
                    <div
                      key={idx}
                      id={`chat-msg-${idx}`}
                      className={`flex ${isUser ? "justify-end" : "justify-start"} items-start`}
                    >
                      <div
                        className={`max-w-[80%] px-4.5 py-3.5 text-[13.5px] leading-relaxed shadow-xs ${
                          isUser
                            ? "bg-[#111827] text-[#F7F2EA] rounded-[18px_18px_2px_18px]"
                            : "bg-white border border-[rgba(17,24,39,0.06)] text-[#111827] rounded-[18px_18px_18px_2px]"
                        }`}
                      >
                        {isUser ? (
                          <p className="font-medium">{msg.content}</p>
                        ) : parsed ? (
                          <>
                            {renderContent(parsed.messageText)}
                            {parsed.type === "email-draft" && (
                              <EmailDraftCard
                                draft={parsed.draft}
                                onRegenerate={handleSend}
                              />
                            )}
                            {parsed.type === "calendar-event" && (
                              <CalendarEventCard
                                event={parsed.event}
                                onOpenEditModal={(evData) => {
                                  setEventModalInitial(evData);
                                  setEventModalOpen(true);
                                }}
                              />
                            )}
                          </>
                        ) : (
                          renderContent(msg.content)
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Loading typing response */}
                {loading && (
                  <div className="flex justify-start">
                    <div className="max-w-[75%] bg-white border border-[rgba(17,24,39,0.06)] rounded-[18px_18px_18px_2px] px-4.5 py-3.5 shadow-xs">
                      <TypingIndicator />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Input panel area ── */}
      <div className="border-t border-[rgba(17,24,39,0.06)] px-6 py-4.5 bg-white flex-shrink-0 z-10">
        <div className="flex gap-3 items-end max-w-4xl mx-auto">
          <Textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={loading || historyLoading}
            placeholder="Ask about your inbox or calendar availability..."
            className="auto-grow bg-[#F7F2EA]/30 border border-[rgba(17,24,39,0.08)] rounded-2xl flex-1 px-4 py-3 text-[14px] text-[#111827] resize-none leading-relaxed focus:border-[#C67B3D] outline-none min-h-[46px] max-h-[120px] placeholder-[#64748B]/40 focus-visible:ring-0"
          />
          <button
            onClick={triggerSend}
            disabled={loading || !input.trim() || historyLoading}
            className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
              input.trim() && !loading
                ? "bg-[#111827] text-white hover:bg-[#C67B3D] cursor-pointer hover:scale-105"
                : "bg-[#F7F2EA] text-[#64748B]/30 cursor-not-allowed"
            }`}
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
        <p className="font-sans text-[11px] text-[#64748B] text-center mt-2.5 select-none">
          Zentra AI is synced dynamically with Gmail and Google Calendar via secure workspace integrations.
        </p>
      </div>

      {/* Embedded EventModal to support Rescheduling overlay from calendar event cards */}
      <EventModal
        open={eventModalOpen}
        onOpenChange={setEventModalOpen}
        mode="edit"
        initial={eventModalInitial}
        onSaved={() => {
          toast.success("Calendar event rescheduled successfully.");
        }}
      />

    </div>
  );
}
export default ChatPanel;
