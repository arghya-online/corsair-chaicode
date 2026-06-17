"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Sparkles,
  Mail,
  Calendar,
  Zap,
  BookOpen,
  Clock,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Cpu,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Plus
} from "lucide-react";
import { ChatPanel } from "./ChatPanel";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "Hello! I'm Zentra, your AI assistant. I can manage your Gmail inbox and Google Calendar — schedule meetings, add reminders, read emails, draft replies, and more. What should we work on today?",
};

const capabilities = [
  {
    icon: Mail,
    title: "Inbox Intelligence",
    description: "Summarize threads, draft replies, search by context.",
  },
  {
    icon: Calendar,
    title: "Calendar Context",
    description: "Schedule meetings, prep briefings, resolve conflicts.",
  },
  {
    icon: Zap,
    title: "Smart Drafts",
    description: "Generate professional replies with custom tones.",
  },
  {
    icon: BookOpen,
    title: "Thread Memory",
    description: "Surface relevant past conversations automatically.",
  },
];

function AssistantClientInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const promptParam = searchParams.get("prompt");
  const promptCheckedRef = useRef(false);

  // Core Chat State
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  // UI Sidebar states
  const [isHistoryCollapsed, setIsHistoryCollapsed] = useState(false);
  const [isContextCollapsed, setIsContextCollapsed] = useState(false);

  // Stats State
  const [stats, setStats] = useState<any>({
    gmailConnected: false,
    calendarConnected: false,
    unreadCount: 0,
    sentCount: 0,
    eventsTodayCount: 0,
    nextEvent: null,
  });

  // Load sidebar settings from localStorage
  useEffect(() => {
    const savedHist = localStorage.getItem("zentra_assistant_history_collapsed");
    if (savedHist) setIsHistoryCollapsed(savedHist === "true");

    const savedCtx = localStorage.getItem("zentra_assistant_context_collapsed");
    if (savedCtx) setIsContextCollapsed(savedCtx === "true");
  }, []);

  const toggleHistory = () => {
    const newVal = !isHistoryCollapsed;
    setIsHistoryCollapsed(newVal);
    localStorage.setItem("zentra_assistant_history_collapsed", String(newVal));
  };

  const toggleContext = () => {
    const newVal = !isContextCollapsed;
    setIsContextCollapsed(newVal);
    localStorage.setItem("zentra_assistant_context_collapsed", String(newVal));
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const res = await fetch("/api/dashboard/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      /* silent */
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Load chat history on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetch("/api/chat/history");
        if (!res.ok) return;
        const data = await res.json();
        if (data.messages && data.messages.length > 0) {
          setMessages([WELCOME_MESSAGE, ...data.messages]);
          setConversationId(data.id ?? null);
        }
      } catch {
        // fallback
      } finally {
        setHistoryLoading(false);
      }
    };
    loadHistory();
  }, []);

  // Save history helper
  const saveHistory = async (msgs: Message[], convId: string | null) => {
    try {
      const toSave = msgs.filter((m) => m !== WELCOME_MESSAGE);
      const res = await fetch("/api/chat/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: toSave, conversationId: convId }),
      });
      const data = await res.json();
      if (data.id && !convId) {
        setConversationId(data.id);
      }
    } catch {
      // silent
    }
  };

  // Clear history / New Session
  const handleClear = async () => {
    if (messages.length === 1 && messages[0] === WELCOME_MESSAGE) return;
    if (!confirm("Start a new chat session? This clears active memory.")) return;
    setClearing(true);
    try {
      await fetch("/api/chat/history", { method: "DELETE" });
      setMessages([WELCOME_MESSAGE]);
      setConversationId(null);
      toast.success("New conversation started.");
    } catch {
      toast.error("Failed to reset session.");
    } finally {
      setClearing(false);
    }
  };

  // Send message
  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = { role: "user", content: textToSend };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const apiMessages = updatedMessages
        .filter((m) => m !== WELCOME_MESSAGE)
        .map(({ role, content }) => ({ role, content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Failed to parse response from server.");
      }

      if (!res.ok || data.error) {
        throw new Error(data.error ?? "Failed to send message to assistant");
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.reply || "No response generated.",
      };
      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);

      await saveHistory(finalMessages, conversationId);
      // Refresh stats on successful tool executions
      fetchStats();
    } catch (err: any) {
      console.error(err);
      const errMessage: Message = {
        role: "assistant",
        content: `⚠️ ${err.message ?? "Something went wrong. Please check your system configuration."}`,
      };
      const withError = [...updatedMessages, errMessage];
      setMessages(withError);
      await saveHistory(withError, conversationId);
    } finally {
      setLoading(false);
    }
  };

  // Handle overview prompt redirection
  useEffect(() => {
    if (!historyLoading && promptParam && !promptCheckedRef.current) {
      promptCheckedRef.current = true;
      handleSend(promptParam);
      // Strip param from query URL
      const params = new URLSearchParams(searchParams.toString());
      params.delete("prompt");
      const newQuery = params.toString();
      router.replace(`/dashboard/assistant${newQuery ? `?${newQuery}` : ""}`);
    }
  }, [historyLoading, promptParam, router, searchParams]);

  // Extract clickable prompts from active chat history
  const userPrompts = messages.filter((m) => m.role === "user");

  const handlePromptClick = (text: string) => {
    // Try to scroll to message bubble if it exists
    const idx = messages.findIndex((m) => m.role === "user" && m.content === text);
    if (idx !== -1) {
      const element = document.getElementById(`chat-msg-${idx}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
    }
    // If not found in thread or deleted, populate input
    handleSend(text);
  };

  return (
    <div className="flex h-screen bg-[#F7F2EA] overflow-hidden w-full text-left">

      {/* ─── Column 1: History Log (Left) ─── */}
      <aside
        style={{ width: isHistoryCollapsed ? "0px" : "280px" }}
        className={`bg-white border-r border-[rgba(17,24,39,0.06)] flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out relative select-none overflow-hidden`}
      >
        <div className="p-5 flex-1 flex flex-col min-w-[280px] h-full overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between mb-5 flex-shrink-0">
            <h3 className="font-serif text-[18px] text-[#111827]">Active Session</h3>
            <button
              onClick={handleClear}
              disabled={clearing || historyLoading}
              className="p-1.5 hover:bg-[#F7F2EA] rounded-xl text-[#C67B3D] transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50"
              title="New Conversation"
            >
              <Plus className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* New Chat CTA */}
          <button
            onClick={handleClear}
            disabled={clearing || historyLoading}
            className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl border border-[rgba(17,24,39,0.08)] bg-[#F7F2EA]/20 hover:bg-[#F7F2EA]/60 hover:border-[#C67B3D]/30 text-left transition-all text-[#111827] font-semibold text-[12.5px] cursor-pointer mb-5 flex-shrink-0 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-[#C67B3D]" />
            New conversation
          </button>

          {/* List of user prompt items */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            <p className="font-sans text-[10px] font-bold text-[#64748B]/70 uppercase tracking-widest">
              Interaction Log
            </p>

            {historyLoading ? (
              <div className="py-8 text-center text-[12px] text-[#64748B]">
                <Loader2 className="w-4 h-4 animate-spin text-[#C67B3D] mx-auto mb-2" />
                Retrieving logs...
              </div>
            ) : userPrompts.length === 0 ? (
              <div className="py-12 text-center text-[12.5px] text-[#64748B] space-y-2 border border-dashed border-[rgba(17,24,39,0.06)] rounded-2xl p-4 bg-[#F7F2EA]/20">
                <Clock className="w-5 h-5 text-[#64748B]/30 mx-auto" />
                <p>No queries logged in this session yet.</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {userPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePromptClick(p.content)}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#F7F2EA]/50 text-[12.5px] text-[#64748B] hover:text-[#111827] transition-all truncate font-medium flex items-center gap-2.5 cursor-pointer border border-transparent hover:border-[rgba(17,24,39,0.05)]"
                    title={p.content}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C67B3D]/60 flex-shrink-0" />
                    <span className="truncate">{p.content}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Connected indicators & guidelines footer inside sidebar */}
          <div className="mt-auto pt-4 border-t border-[rgba(17,24,39,0.06)] flex items-center gap-2 flex-shrink-0">
            <ShieldCheck className="w-4 h-4 text-[#6D8A68]" />
            <span className="text-[11px] text-[#64748B]">Secure Sandbox Shield</span>
          </div>
        </div>
      </aside>

      {/* ─── Column 2: Chat Canvas (Center) ─── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0 bg-[#F7F2EA]">
        <ChatPanel
          messages={messages}
          setMessages={setMessages}
          conversationId={conversationId}
          setConversationId={setConversationId}
          loading={loading}
          setLoading={setLoading}
          historyLoading={historyLoading}
          setHistoryLoading={setHistoryLoading}
          isHistoryCollapsed={isHistoryCollapsed}
          setIsHistoryCollapsed={setIsHistoryCollapsed}
          isContextCollapsed={isContextCollapsed}
          setIsContextCollapsed={setIsContextCollapsed}
          toggleHistory={toggleHistory}
          toggleContext={toggleContext}
          handleSend={handleSend}
          handleClear={handleClear}
          clearing={clearing}
        />
      </div>
    </div>
  );
}

export function AssistantClient() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen bg-[#F7F2EA] items-center justify-center w-full">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B]">
            <Loader2 className="w-4.5 h-4.5 animate-spin text-[#C67B3D]" />
            Initializing AI Assistant console...
          </div>
        </div>
      }
    >
      <AssistantClientInner />
    </Suspense>
  );
}
