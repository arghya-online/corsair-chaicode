"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Sparkles, Send, MessageCircle, ArrowUp, RefreshCw, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TypingIndicator } from "./TypingIndicator";
import { SuggestionPills } from "./SuggestionPills";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "Hello! I'm Zentra, your AI assistant. I can manage your Gmail inbox and Google Calendar — schedule meetings, add reminders, read emails, draft replies, and more. What should we work on today?",
};

// ─── Markdown-lite renderer (bold, bullet lists, line breaks) ─────────────────
function renderContent(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Bullet list items
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
              <span className="text-[#9A5C30] flex-shrink-0 mt-0.5">•</span>
              <span dangerouslySetInnerHTML={{ __html: inlineBold(item) }} />
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Empty line = paragraph break
    if (!line.trim()) {
      elements.push(<div key={`br-${i}`} className="h-2" />);
      i++;
      continue;
    }

    // Normal line with inline bold
    elements.push(
      <p key={`p-${i}`} dangerouslySetInnerHTML={{ __html: inlineBold(line) }} />
    );
    i++;
  }

  return <div className="space-y-0.5">{elements}</div>;
}

function inlineBold(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`(.+?)`/g, '<code class="bg-[#FAF3EA] px-1 py-0.5 rounded text-[10px] font-mono">$1</code>');
}

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Load history on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetch("/api/chat/history");
        if (!res.ok) return;
        const data = await res.json();
        if (data.messages && data.messages.length > 0) {
          // Prepend welcome message
          setMessages([WELCOME_MESSAGE, ...data.messages]);
          setConversationId(data.id ?? null);
        }
      } catch {
        // silent fall back
      } finally {
        setHistoryLoading(false);
      }
    };
    loadHistory();
  }, []);

  // Save history helper
  const saveHistory = useCallback(
    async (msgs: Message[], convId: string | null) => {
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
        // silent save failure
      }
    },
    []
  );

  // Clear history
  const handleClear = async () => {
    if (!confirm("Clear all chat history? This cannot be undone.")) return;
    setClearing(true);
    try {
      await fetch("/api/chat/history", { method: "DELETE" });
      setMessages([WELCOME_MESSAGE]);
      setConversationId(null);
      toast.success("Conversation history cleared.");
    } catch {
      toast.error("Failed to clear history.");
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
    setInput("");
    setLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  // Auto grow input textarea height dynamically
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const isInitialState = messages.length === 1 && messages[0] === WELCOME_MESSAGE && !loading;

  return (
    <div className="flex flex-col h-full bg-cream-DEFAULT w-full overflow-hidden">
      {/* ── Header ── */}
      <div className="px-6 py-4 border-b border-border bg-cream-100 flex items-center justify-between flex-shrink-0 select-none">
        <div className="flex items-center gap-3">
          <motion.span
            className="w-2 h-2 rounded-full bg-sage inline-block"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div>
            <h1 className="font-display text-[24px] font-normal text-espresso">
              Zentra AI
            </h1>
            <p className="font-sans text-[13px] text-espresso-300 mt-0.5">
              Connected to your Gmail inbox via CorsAir integration.
            </p>
          </div>
        </div>

        {!isInitialState && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            disabled={clearing}
            className="text-[14px] text-espresso-400 hover:text-red-500 rounded-pill hover:bg-red-50"
          >
            {clearing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1.5" />
            ) : (
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            )}
            Clear chat
          </Button>
        )}
      </div>

      {/* ── Messages Panel ── */}
      <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4 bg-cream-DEFAULT">
        {historyLoading ? (
          <div className="flex-1 flex items-center justify-center text-[14px] text-espresso-300">
            <RefreshCw className="w-4 h-4 animate-spin mr-2" />
            Loading chat history...
          </div>
        ) : (
          <>
            {isInitialState ? (
              /* Empty State suggestions */
              <div className="flex-1 flex flex-col items-center justify-center gap-4 py-8">
                <div className="w-12 h-12 bg-peach-soft text-peach-text rounded-2xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-peach-text" />
                </div>
                <h2 className="font-display text-[24px] font-normal text-espresso text-center">
                  Ask about your inbox
                </h2>
                <p className="font-sans text-[15px] text-espresso-300 text-center max-w-[320px]">
                  Try typing one of these shortcut prompts below to get started:
                </p>
                <SuggestionPills onSelect={handleSend} />
              </div>
            ) : (
              /* Thread */
              <div className="space-y-4">
                {messages.map((msg, idx) => {
                  const isUser = msg.role === "user";
                  return (
                    <div
                      key={idx}
                      className={`flex ${isUser ? "justify-end" : "justify-start"} items-start`}
                    >
                      <div
                        className={`max-w-[75%] px-4 py-3 text-[14.5px] leading-relaxed shadow-card ${isUser
                          ? "bg-espresso text-cream-50 rounded-[14px_14px_0_14px]"
                          : "bg-cream-100 border border-border text-espresso-400 rounded-[0_14px_14px_14px]"
                          }`}
                      >
                        {isUser ? msg.content : renderContent(msg.content)}
                      </div>
                    </div>
                  );
                })}

                {/* Loading indicator */}
                {loading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] bg-cream-100 border border-border rounded-[0_14px_14px_14px] px-4 py-3 shadow-card">
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

      {/* ── Input Area ── */}
      <div className="border-t border-border px-6 py-4 bg-cream-100/50 flex-shrink-0">
        <div className="flex gap-3 items-end">
          <Textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={loading || historyLoading}
            placeholder="Ask about your inbox..."
            className="auto-grow bg-cream-200 border border-border rounded-[14px] flex-1 px-4 py-3 text-[15px] text-espresso resize-none leading-relaxed focus:border-peach focus:shadow-focus outline-none min-h-[44px] max-h-[120px] placeholder-espresso-300/40"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={loading || !input.trim() || historyLoading}
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${input.trim() && !loading
              ? "bg-espresso text-cream-50 hover:bg-espresso-600 cursor-pointer"
              : "bg-espresso-100 text-espresso-300 cursor-not-allowed"
              }`}
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
        <p className="font-sans text-[12px] text-espresso-300 text-center mt-2.5 select-none">
          Zentra AI reads your synced Gmail data via CorsAir integration. Responses reflect real emails.
        </p>
      </div>
    </div>
  );
}
export default ChatPanel;
