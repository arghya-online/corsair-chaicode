"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, RotateCcw, Archive, Trash2, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { getAvatarColor, getInitials } from "@/src/lib/avatar-color";
import { toast } from "sonner";

interface EmailDetailProps {
  emailId: string | null;
  onClose: () => void;
  onReply?: (to: string, subject: string, body?: string) => void;
}

interface EmailData {
  id: string;
  subject: string;
  from: string;
  to: string;
  snippet: string;
  body: string;
  internalDate: string | null;
  labelIds: string[];
}

export function EmailDetail({ emailId, onClose, onReply }: EmailDetailProps) {
  const [data, setData] = useState<EmailData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!emailId) {
      setData(null);
      return;
    }

    const fetchEmail = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/gmail/message/${emailId}`);
        if (!res.ok) throw new Error("Failed to fetch email details");
        const json = await res.json();
        setData(json);
      } catch (err: unknown) {
        console.error(err);
        toast.error("Error loading email content.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmail();
  }, [emailId]);

  if (!emailId) {
    return (
      <div className="hidden md:flex flex-col items-center justify-center flex-1 h-full py-12 text-center bg-cream-DEFAULT">
        <Mail className="w-7 h-7 text-espresso-300 mb-3" />
        <p className="font-sans text-[13px] text-espresso-400 font-medium">
          Select an email to read
        </p>
        <p className="font-sans text-[11px] text-espresso-300 max-w-[200px] mt-1">
          Pick a conversation thread from the list to display details.
        </p>
      </div>
    );
  }

  const senderName = data?.from
    ? data.from.split("<")[0].replace(/"/g, "").trim() || "Unknown"
    : "Loading...";
  const senderEmail = data?.from
    ? data.from.includes("<")
      ? data.from.split("<")[1].replace(/>/g, "")
      : data.from
    : "";
  const initials = getInitials(senderName);
  const color = getAvatarColor(senderName);

  const displayDate = data?.internalDate
    ? new Date(Number(data.internalDate)).toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "";

  const handleReplyClick = () => {
    if (onReply && data) {
      onReply(senderEmail, `Re: ${data.subject}`);
    }
  };

  const handleArchive = () => {
    toast.success("Conversation archived successfully.");
  };

  const handleDelete = () => {
    toast.success("Conversation moved to Trash.");
  };

  return (
    <div className="flex flex-col h-full bg-cream-100 border-l border-border relative z-10 w-full overflow-hidden">
      {/* Detail Toolbar / Header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between flex-shrink-0 bg-cream-100">
        <div className="flex items-center min-w-0 flex-1 mr-3">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="rounded-xl flex-shrink-0"
                >
                  <ArrowLeft className="w-4 h-4 text-espresso-400" />
                  <span className="sr-only">Back</span>
                </Button>
              }
            />
            <TooltipContent
              side="bottom"
              className="bg-espresso text-cream-50 text-[11px] font-sans"
            >
              Back
            </TooltipContent>
          </Tooltip>

          <h2 className="font-serif text-[17px] text-espresso font-normal truncate flex-1 ml-3">
            {loading ? "Loading thread..." : data?.subject || "(no subject)"}
          </h2>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={loading || !data}
                  onClick={handleReplyClick}
                  className="rounded-xl text-espresso-400"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="sr-only">Reply</span>
                </Button>
              }
            />
            <TooltipContent
              side="bottom"
              className="bg-espresso text-cream-50 text-[11px] font-sans"
            >
              Reply
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={loading || !data}
                  onClick={handleArchive}
                  className="rounded-xl text-espresso-400"
                >
                  <Archive className="w-4 h-4" />
                  <span className="sr-only">Archive</span>
                </Button>
              }
            />
            <TooltipContent
              side="bottom"
              className="bg-espresso text-cream-50 text-[11px] font-sans"
            >
              Archive
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={loading || !data}
                  onClick={handleDelete}
                  className="rounded-xl text-espresso-400 hover:text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              }
            />
            <TooltipContent
              side="bottom"
              className="bg-espresso text-cream-50 text-[11px] font-sans"
            >
              Delete
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Loading Skeletons */}
      {loading ? (
        <div className="p-5 flex-1 flex flex-col gap-4 overflow-y-auto">
          <div className="flex gap-3 items-center">
            <Skeleton className="w-9 h-9 rounded-full bg-cream-300" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-1/3 bg-cream-300 rounded" />
              <Skeleton className="h-2.5 w-1/4 bg-cream-300 rounded" />
            </div>
          </div>
          <div className="space-y-2 mt-6">
            <Skeleton className="h-3 w-full bg-cream-200 rounded" />
            <Skeleton className="h-3 w-[82%] bg-cream-200 rounded" />
            <Skeleton className="h-3 w-[55%] bg-cream-200 rounded" />
          </div>
        </div>
      ) : (
        data && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Sender Metadata Row */}
            <div className="px-5 py-3 border-b border-border flex gap-3 items-center bg-cream-100/50 flex-shrink-0">
              <Avatar className="w-9 h-9">
                <AvatarFallback
                  className={`${color.bg} ${color.text} text-[12px] font-sans font-medium`}
                >
                  {initials || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-sans text-[13px] font-medium text-espresso truncate">
                  {senderName}
                </p>
                <p className="font-sans text-[11px] text-espresso-300 truncate mt-0.5">
                  {senderEmail}
                </p>
              </div>
              <p className="font-sans text-[11px] text-espresso-300 whitespace-nowrap">
                {displayDate}
              </p>
            </div>

            {/* Email Body Scroll Area */}
            <div className="p-5 flex-1 overflow-y-auto bg-white space-y-6">
              {/* Zentra AI Insights Card */}
              <div
                style={{
                  background:
                    "linear-gradient(135deg, rgba(198,123,61,0.06) 0%, rgba(217,161,91,0.03) 100%)",
                }}
                className="p-5 rounded-2xl border border-[#C67B3D]/15 space-y-4 text-left shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded bg-[#C67B3D]/10 text-[#C67B3D] flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-3.5 h-3.5 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M12 7l1.5 3.5L17 12l-3.5 1.5L12 17l-1.5-3.5L7 12l3.5-1.5z" />
                    </svg>
                  </span>
                  <span className="text-[10px] font-bold text-[#111827] uppercase tracking-wider">
                    Zentra AI Insight
                  </span>
                </div>

                {(() => {
                  const insights = (() => {
                    const text = (
                      (data.subject ?? "") +
                      " " +
                      (data.body ?? "")
                    ).toLowerCase();
                    let summary =
                      "Zentra parsed this message thread. Sender is requesting coordination on workspace launch metrics.";
                    let actionItems = [
                      "Review design draft files",
                      "Coordinate meeting slots",
                    ];
                    let replies = [
                      "Looks good to me, let's proceed.",
                      "Let me check my calendar.",
                      "Can we schedule for Wednesday?",
                    ];

                    if (
                      text.includes("meeting") ||
                      text.includes("schedule") ||
                      text.includes("calendar")
                    ) {
                      summary =
                        "Calendar coordination request. The sender wants to schedule a meeting slot.";
                      actionItems = [
                        "Verify calendar conflicts for proposed times",
                        "Confirm availability",
                      ];
                      replies = [
                        "Sure, send a calendar invite.",
                        "I am free Wednesday afternoon.",
                        "Let's postpone to next week.",
                      ];
                    } else if (
                      text.includes("launch") ||
                      text.includes("design") ||
                      text.includes("approv")
                    ) {
                      summary =
                        "Design assets launch review. Feedback or approval is requested.";
                      actionItems = [
                        "Inspect courtyard presentation draft",
                        "Provide layout approval",
                      ];
                      replies = [
                        "Approved. Design looks premium.",
                        "Let's update the visual contrast.",
                        "Ready to deploy.",
                      ];
                    } else if (
                      text.includes("invoice") ||
                      text.includes("price") ||
                      text.includes("billing")
                    ) {
                      summary =
                        "Billing inquiry. Inquiry relates to payment structure or tier changes.";
                      actionItems = [
                        "Verify billing records",
                        "Respond to support ticket",
                      ];
                      replies = [
                        "I have processed the transaction.",
                        "Let me check with finance.",
                        "Will follow up shortly.",
                      ];
                    }

                    return { summary, actionItems, replies };
                  })();

                  return (
                    <div className="space-y-3">
                      <p className="text-[13px] text-[#111827] leading-relaxed">
                        <strong className="text-[#C67B3D]">Summary:</strong>{" "}
                        {insights.summary}
                      </p>

                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                          Recommended Actions
                        </span>
                        <ul className="space-y-1 text-[12px] text-[#64748B]">
                          {insights.actionItems.map((act, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-[#C67B3D]" />
                              {act}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Quick Replies */}
                      <div className="pt-2">
                        <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block mb-2">
                          One-Click AI Reply
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {insights.replies.map((reply) => (
                            <button
                              key={reply}
                              type="button"
                              onClick={() => {
                                if (onReply && data) {
                                  onReply(
                                    senderEmail,
                                    `Re: ${data.subject}`,
                                    `\n\nOn ${displayDate}, ${senderName} wrote:\n> ${data.snippet}\n\n${reply}`,
                                  );
                                }
                              }}
                              className="text-[11.5px] text-[#C67B3D] hover:text-white bg-white hover:bg-[#C67B3D] border border-[#C67B3D]/25 rounded-lg px-2.5 py-1.5 transition-all duration-200 cursor-pointer shadow-2xs font-sans font-semibold"
                            >
                              {reply}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Separator */}
              <div className="w-full h-px bg-[rgba(17,24,39,0.06)]" />

              <pre className="font-mono text-[12px] text-espresso-400 leading-loose whitespace-pre-wrap break-words">
                {data.body}
              </pre>
            </div>
          </div>
        )
      )}
    </div>
  );
}
export default EmailDetail;
