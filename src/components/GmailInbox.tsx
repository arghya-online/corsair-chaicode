"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { 
  Search, 
  RefreshCw, 
  Plus, 
  X, 
  Mail, 
  ArrowLeft, 
  Send, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  Trash2
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface EmailSummary {
  id: string;
  entityId: string;
  subject: string;
  from: string;
  snippet: string;
  internalDate: string | number | null;
  updatedAt: string;
  labelIds: string[];
  threadId: string | null;
}

interface EmailDetail {
  id: string;
  subject: string;
  from: string;
  to: string;
  snippet: string;
  body: string;
  internalDate: string | number | null;
  labelIds: string[];
  threadId: string | null;
}

// ─── Utilities ───────────────────────────────────────────────────────────────

function relativeTime(dateVal: string | number | null | undefined): string {
  if (!dateVal) return "";
  const d =
    typeof dateVal === "number"
      ? new Date(Number(dateVal))
      : new Date(dateVal);
  if (isNaN(d.getTime())) return "";
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function senderName(from: string): string {
  if (!from) return "Unknown";
  const match = from.match(/^"?([^"<]+)"?\s*</);
  if (match) return match[1].trim();
  const emailMatch = from.match(/([^@<\s]+)@/);
  if (emailMatch) return emailMatch[1];
  return from;
}

function isUnread(labelIds: string[]): boolean {
  return labelIds.includes("UNREAD");
}

function linkify(text: string): string {
  return text.replace(
    /(https?:\/\/[^\s<>"']+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-[#F97316] underline break-all hover:text-[#C2410C]">$1</a>'
  );
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function Spinner({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className="animate-spin"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}

function Toast({
  message,
  type,
}: {
  message: string;
  type: "success" | "error";
}) {
  return (
    <div
      role="alert"
      className={`fixed bottom-6 right-6 z-[9999] p-4 rounded-2xl border flex items-center gap-3 shadow-[0_8px_30px_rgba(13,13,13,0.06)] animate-fade-in text-xs font-semibold ${
        type === "success" 
          ? "border-emerald-100 bg-emerald-50 text-emerald-800" 
          : "border-red-100 bg-red-50 text-red-800"
      }`}
    >
      {type === "success" ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
      {message}
    </div>
  );
}

// ─── Compose Modal ───────────────────────────────────────────────────────────

interface ComposeModalProps {
  onClose: () => void;
  onSent: () => void;
  onToast: (msg: string, type: "success" | "error") => void;
  defaults?: Partial<{ to: string; subject: string }>;
}

function ComposeModal({ onClose, onSent, onToast, defaults = {} }: ComposeModalProps) {
  const [to, setTo] = useState(defaults.to ?? "");
  const [subject, setSubject] = useState(defaults.subject ?? "");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const toRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    toRef.current?.focus();
  }, []);

  const handleSend = async () => {
    if (!to.trim() || !subject.trim() || !body.trim()) {
      onToast("Please fill in all fields.", "error");
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
      if (!res.ok || data.error) throw new Error(data.error ?? "Send failed");
      onToast("Email sent successfully.", "success");
      onSent();
      onClose();
    } catch (err: any) {
      onToast(err.message ?? "Failed to send email.", "error");
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Compose email"
      className="fixed inset-0 z-[9000] flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg bg-white border border-[#E8E8EC] rounded-[24px] shadow-[0_24px_64px_rgba(13,13,13,0.08)] flex flex-col overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E8EC]">
          <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider font-sans">
            New Draft
          </span>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#F2F2F5] rounded-full text-[#6B7280] hover:text-[#0D0D0D] transition-colors cursor-pointer"
            aria-label="Close compose"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Fields */}
        <div className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 text-left">
            <label htmlFor="compose-to" className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider font-sans">
              To
            </label>
            <input
              id="compose-to"
              ref={toRef}
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@example.com"
              className="w-full rounded-xl border border-[#E8E8EC] bg-[#FAFAFA] py-2.5 px-4 text-xs text-[#0D0D0D] outline-none transition focus:border-[#F97316] focus:bg-white focus:ring-1 focus:ring-[#F97316]"
            />
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <label htmlFor="compose-subject" className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider font-sans">
              Subject
            </label>
            <input
              id="compose-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject line..."
              className="w-full rounded-xl border border-[#E8E8EC] bg-[#FAFAFA] py-2.5 px-4 text-xs text-[#0D0D0D] outline-none transition focus:border-[#F97316] focus:bg-white focus:ring-1 focus:ring-[#F97316]"
            />
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <label htmlFor="compose-body" className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider font-sans">
              Body
            </label>
            <textarea
              id="compose-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your message..."
              rows={8}
              className="w-full rounded-xl border border-[#E8E8EC] bg-[#FAFAFA] py-2.5 px-4 text-xs text-[#0D0D0D] outline-none transition focus:border-[#F97316] focus:bg-white focus:ring-1 focus:ring-[#F97316] resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#E8E8EC] bg-[#FAFAFA]">
          <button
            onClick={onClose}
            disabled={sending}
            className="border border-[#E8E8EC] bg-white rounded-full text-[#6B7280] hover:text-[#0D0D0D] px-5 py-2 text-xs font-semibold hover:bg-[#F2F2F5] transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={sending}
            className="bg-[#F97316] text-white hover:bg-[#C2410C] rounded-full px-5 py-2 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
          >
            {sending ? <Spinner size={12} /> : <Send className="w-3.5 h-3.5" />}
            Send Mail
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Detail Drawer ───────────────────────────────────────────────────────────

interface DetailDrawerProps {
  emailId: string;
  onClose: () => void;
  onReply: (detail: EmailDetail) => void;
}

function DetailDrawer({ emailId, onClose, onReply }: DetailDrawerProps) {
  const [detail, setDetail] = useState<EmailDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/gmail/message/${encodeURIComponent(emailId)}`)
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error ?? "Failed to load message");
        setDetail(d);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [emailId]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Email detail"
      className="fixed inset-0 z-[8000] flex justify-end bg-black/30 backdrop-blur-[1px]"
    >
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-[560px] h-full bg-white border-l border-[#E8E8EC] flex flex-col shadow-[-16px_0_48px_rgba(13,13,13,0.04)] animate-slide-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[#E8E8EC] flex-shrink-0">
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#F2F2F5] rounded-lg text-[#6B7280] hover:text-[#0D0D0D] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold font-sans text-[#6B7280] truncate flex-1 text-left">
            {loading ? "Loading thread..." : (detail?.subject ?? "Message Details")}
          </span>
          {detail && (
            <button
              onClick={() => onReply(detail)}
              className="bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20 hover:bg-[#F97316]/20 px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer"
            >
              Reply
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#FAFAFA] space-y-4">
          {loading && (
            <div className="flex items-center justify-center py-20 gap-2 text-xs font-semibold text-[#6B7280]">
              <Spinner size={16} /> Loading message content...
            </div>
          )}
          
          {error && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-xs font-semibold text-red-800 text-left">
              {error}
            </div>
          )}

          {detail && !loading && (
            <div className="space-y-4 text-left">
              {/* Metadata Box */}
              <div className="bg-white border border-[#E8E8EC] rounded-2xl p-5 space-y-2.5">
                <h2 className="text-sm font-bold text-[#0D0D0D] font-display">
                  {detail.subject}
                </h2>
                <div className="space-y-1 text-xs text-[#6B7280]">
                  <div><span className="font-semibold text-[#0D0D0D]">From:</span> {detail.from || "—"}</div>
                  {detail.to && <div><span className="font-semibold text-[#0D0D0D]">To:</span> {detail.to}</div>}
                  {detail.internalDate && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#6B7280]/60" />
                      <span>
                        {new Date(
                          typeof detail.internalDate === "number"
                            ? detail.internalDate
                            : Number(detail.internalDate)
                        ).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Email Content Body */}
              <div className="bg-white border border-[#E8E8EC] rounded-2xl p-6 text-xs text-[#0D0D0D] leading-relaxed shadow-sm">
                {detail.body ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: linkify(detail.body),
                    }}
                    className="margin-0 whitespace-pre-wrap font-sans break-words text-sm leading-relaxed text-[#2D2D30]"
                  />
                ) : (
                  <p className="margin-0 text-[#6B7280] italic">
                    {detail.snippet || "No preview content available."}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

function isNotConnectedError(msg: string): boolean {
  const lower = msg.toLowerCase();
  return (
    lower.includes("not found") ||
    lower.includes("no account") ||
    lower.includes("not connected") ||
    lower.includes("oauth") ||
    lower.includes("unauthorized") ||
    lower.includes("token") ||
    lower.includes("needs credentials")
  );
}

interface GmailInboxProps {
  onSelectEmail?: (id: string | null) => void;
}

export default function GmailInbox({ onSelectEmail }: GmailInboxProps) {
  const [messages, setMessages] = useState<EmailSummary[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [composeDefaults, setComposeDefaults] = useState<Partial<{ to: string; subject: string }>>({});
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const debouncedQuery = useDebounce(query, 400);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    onSelectEmail?.(selectedId);
  }, [selectedId, onSelectEmail]);

  // Handle OAuth Hooks
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const oauthSuccess = params.get("oauth_success");
    const oauthError = params.get("oauth_error");
    if (oauthSuccess) {
      showToast(`${oauthSuccess} connected successfully! Click Refresh to sync.`, "success");
      const clean = window.location.pathname;
      window.history.replaceState({}, "", clean);
    } else if (oauthError) {
      showToast(`OAuth error: ${oauthError}`, "error");
      const clean = window.location.pathname;
      window.history.replaceState({}, "", clean);
    }
  }, []);

  const fetchInbox = useCallback(async (q: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = q
        ? `/api/gmail/inbox?query=${encodeURIComponent(q)}`
        : "/api/gmail/inbox";
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to load inbox");
      setMessages(data.messages ?? []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInbox(debouncedQuery);
  }, [debouncedQuery, fetchInbox]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/gmail/refresh", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Refresh failed");
      showToast(`Synced ${data.count} thread${data.count !== 1 ? "s" : ""}.`, "success");
      await fetchInbox(debouncedQuery);
    } catch (err: any) {
      showToast(err.message ?? "Refresh failed.", "error");
    } finally {
      setRefreshing(false);
    }
  };

  const handleReply = (detail: EmailDetail) => {
    const replyTo = detail.from || "";
    const replySubject = detail.subject.startsWith("Re:")
      ? detail.subject
      : `Re: ${detail.subject}`;
    setSelectedId(null);
    setComposeDefaults({ to: replyTo, subject: replySubject });
    setShowCompose(true);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Search & Header panel */}
      <div className="p-5 border-b border-[#E8E8EC] flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#F97316]/10 flex items-center justify-center text-[#F97316]">
            <Mail className="w-4 h-4" />
          </div>
          <div className="text-left">
            <h2 className="text-sm font-bold text-[#0D0D0D] font-display">Inbox Messages</h2>
            <p className="text-[10px] text-[#6B7280] font-sans">
              SYNCED OVER GMAIL API
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Refresh / Sync */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="border border-[#E8E8EC] bg-white hover:bg-[#F2F2F5] hover:border-[#F97316]/30 rounded-xl p-2.5 text-[#6B7280] hover:text-[#0D0D0D] transition-colors cursor-pointer flex items-center gap-1.5"
            title="Refresh Inbox"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-[#F97316]" : ""}`} />
            <span className="text-[10px] font-bold uppercase tracking-wider font-sans">Sync</span>
          </button>

          {/* Compose */}
          <button
            onClick={() => {
              setComposeDefaults({});
              setShowCompose(true);
            }}
            className="bg-[#F97316] hover:bg-[#C2410C] text-white rounded-xl py-2.5 px-4 text-xs font-semibold transition-all hover:shadow-[0_4px_12px_rgba(249,115,22,0.2)] flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Compose</span>
          </button>
        </div>
      </div>

      {/* Search input field */}
      <div className="px-5 py-3.5 border-b border-[#E8E8EC]">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-[#6B7280]/60" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search emails by keywords, sender, or subjects..."
            className="w-full bg-[#FAFAFA] border border-[#E8E8EC] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#0D0D0D] placeholder-[#6B7280]/40 outline-none transition focus:border-[#F97316] focus:bg-white focus:ring-1 focus:ring-[#F97316]"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3.5 text-[#6B7280] hover:text-[#0D0D0D]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Inbox Thread rows list */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-xs font-semibold text-[#6B7280]">
            <Spinner size={20} />
            <span>Loading synced email threads...</span>
          </div>
        )}

        {error && !loading && (
          <div className="p-6">
            {isNotConnectedError(error) ? (
              /* Google OAuth Connection CTA */
              <div className="border border-[#E8E8EC] rounded-[24px] p-8 bg-[#FAFAFA] text-center max-w-md mx-auto my-8 space-y-5 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-sm font-bold text-[#0D0D0D]">Connect your Gmail account</h4>
                  <p className="text-xs text-[#6B7280]">
                    Authorize Zentra to sync and manage emails via Google API.
                  </p>
                </div>
                <a
                  href="/api/connect?plugin=gmail"
                  className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#C2410C] text-white rounded-full px-6 py-3 text-xs font-semibold transition hover:shadow-[0_4px_12px_rgba(249,115,22,0.2)]"
                >
                  Authorize Gmail
                </a>
              </div>
            ) : (
              /* General Error display */
              <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-xs font-semibold text-red-800 text-left">
                <strong>Error fetching messages:</strong> {error}
              </div>
            )}
          </div>
        )}

        {/* Empty state messages */}
        {!loading && !error && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 max-w-sm mx-auto text-center">
            <div className="w-10 h-10 rounded-full bg-[#F2F2F5] flex items-center justify-center text-[#6B7280]">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#0D0D0D]">No messages found</p>
              <p className="text-[11px] text-[#6B7280] mt-0.5">
                {query ? "No items match your search term." : "No emails synchronized yet. Press sync."}
              </p>
            </div>
          </div>
        )}

        {/* Mail threads lists */}
        {!loading && !error && messages.length > 0 && (
          <ul className="divide-y divide-[#E8E8EC] text-left">
            {messages.map((msg, idx) => {
              const unread = isUnread(msg.labelIds);
              const dateDisplay = relativeTime(msg.internalDate) || relativeTime(msg.updatedAt);
              const name = senderName(msg.from);
              const isSelected = selectedId === (msg.entityId || msg.id);

              return (
                <li key={msg.entityId || msg.id}>
                  <button
                    onClick={() => setSelectedId(msg.entityId || msg.id)}
                    className={`w-full flex items-start p-4 transition-colors relative text-left gap-3 cursor-pointer ${
                      isSelected ? "bg-[#F2F2F5]" : "bg-white hover:bg-[#F2F2F5]/50"
                    }`}
                  >
                    {/* Unread Left Border Stripe Indicator */}
                    {unread && (
                      <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#F4622A]" />
                    )}

                    {/* Content text */}
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <div className="flex justify-between items-center gap-4">
                        <span className={`text-xs truncate ${unread ? "font-bold text-[#0D0D0D]" : "font-medium text-[#6B7280]"}`}>
                          {name}
                        </span>
                        <span className="text-[10px] text-[#6B7280] font-sans flex-shrink-0">
                          {dateDisplay}
                        </span>
                      </div>
                      <span className={`text-xs truncate ${unread ? "font-bold text-[#0D0D0D]" : "font-medium text-[#6B7280]"}`}>
                        {msg.subject}
                      </span>
                      <p className="text-[11px] text-[#6B7280] truncate leading-normal">
                        {msg.snippet}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Modal overlays */}
      {selectedId && (
        <DetailDrawer
          emailId={selectedId}
          onClose={() => setSelectedId(null)}
          onReply={handleReply}
        />
      )}

      {showCompose && (
        <ComposeModal
          defaults={composeDefaults}
          onClose={() => {
            setShowCompose(false);
            setComposeDefaults({});
          }}
          onSent={() => fetchInbox(debouncedQuery)}
          onToast={showToast}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
