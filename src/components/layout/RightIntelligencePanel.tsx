"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useWorkspace } from "@/src/context/WorkspaceContext";
import {
  Sparkles,
  Heart,
  Calendar,
  CheckCircle,
  Inbox,
  Clock,
  Send,
  Loader2,
  AlertCircle,
  Play,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ComposeModal } from "@/src/components/gmail/ComposeModal";

interface RightIntelligencePanelProps {
  user: any;
}

export function RightIntelligencePanel({ user }: RightIntelligencePanelProps) {
  const pathname = usePathname();
  const { selectedEmail, selectedEvent } = useWorkspace();
  const [emailAnalysis, setEmailAnalysis] = useState<any>(null);
  const [eventAnalysis, setEventAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Compose Modal integration for Suggested Replies
  const [composeOpen, setComposeOpen] = useState(false);
  const [replyTo, setReplyTo] = useState("");
  const [replySubject, setReplySubject] = useState("");
  const [replyBody, setReplyBody] = useState("");

  // Track finished next actions in checklists
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({});

  // 1. Reset analysis and fetch when email selection changes
  useEffect(() => {
    if (!selectedEmail) {
      setEmailAnalysis(null);
      return;
    }

    const analyzeEmail = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/gmail/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            emailId: selectedEmail.id,
            subject: selectedEmail.subject,
            from: selectedEmail.from,
            body: selectedEmail.body || selectedEmail.snippet || "",
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setEmailAnalysis(data);
        }
      } catch (err) {
        console.error("Gmail analyze fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    analyzeEmail();
  }, [selectedEmail]);

  // 2. Reset analysis and fetch when calendar event selection changes
  useEffect(() => {
    if (!selectedEvent) {
      setEventAnalysis(null);
      return;
    }

    const analyzeEvent = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/calendar/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventId: selectedEvent.id,
            summary: selectedEvent.summary,
            description: selectedEvent.description || "",
            location: selectedEvent.location || "",
            start: selectedEvent.start?.dateTime ?? selectedEvent.start?.date ?? "",
            end: selectedEvent.end?.dateTime ?? selectedEvent.end?.date ?? "",
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setEventAnalysis(data);
        }
      } catch (err) {
        console.error("Calendar analyze fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    analyzeEvent();
  }, [selectedEvent]);

  const toggleAction = (actionText: string) => {
    setCompletedActions((prev) => ({
      ...prev,
      [actionText]: !prev[actionText],
    }));
  };

  const handleSuggestedReplyClick = (replyText: string) => {
    // Determine target recipient and subject
    const rawFrom = selectedEmail?.from ?? "";
    const emailMatch = rawFrom.match(/<(.+?)>/);
    const targetEmail = emailMatch ? emailMatch[1] : rawFrom;
    
    const subjectPrefix = selectedEmail?.subject?.toLowerCase().startsWith("re:") ? "" : "Re: ";
    
    setReplyTo(targetEmail);
    setReplySubject(`${subjectPrefix}${selectedEmail?.subject}`);
    setReplyBody(replyText);
    setComposeOpen(true);
  };

  const isOverview = pathname === "/dashboard" || pathname === "/dashboard/";

  // Render context helper
  return (
    <>
      <aside
        className="w-[340px] fixed top-0 bottom-0 right-0 z-30 flex flex-col border-l overflow-y-auto pt-6 select-none bg-[#FBF8F2]"
        style={{ borderColor: "rgba(17,24,39,0.07)" }}
      >
        <div className="px-6 pb-6 flex-1 flex flex-col gap-6">
          {/* Header Accent block */}
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-lg bg-accent/10 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-accent" />
            </span>
            <span className="font-sans text-[10px] font-bold text-accent uppercase tracking-widest leading-none mt-0.5">
              Zentra Intelligence
            </span>
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center text-center py-20"
              >
                <Loader2 className="w-6 h-6 animate-spin text-accent mb-3" />
                <p className="font-sans text-[12px] text-espresso-300">
                  Zentra is reviewing details...
                </p>
              </motion.div>
            ) : selectedEmail && emailAnalysis ? (
              // EMAIL CONTEXT PANEL
              <motion.div
                key="email-context"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6 text-left"
              >
                {/* Section title */}
                <div>
                  <h2 className="font-serif text-[26px] text-espresso font-normal leading-tight">
                    Email Context
                  </h2>
                  <p className="font-sans text-[11px] text-espresso-300 mt-1 truncate">
                    Re: {selectedEmail.subject}
                  </p>
                </div>

                {/* AI Summary */}
                <div className="bg-[#FFFDF8] border border-border/80 rounded-2xl p-5 shadow-sm space-y-2.5">
                  <h3 className="font-sans text-[11px] font-bold text-accent uppercase tracking-wider">
                    Zentra Summary
                  </h3>
                  <p className="font-sans text-[13px] text-espresso-500 leading-relaxed">
                    {emailAnalysis.summary}
                  </p>
                </div>

                {/* Key People */}
                {emailAnalysis.keyPeople?.length > 0 && (
                  <div className="space-y-2.5">
                    <h3 className="font-sans text-[11px] font-bold text-espresso-300 uppercase tracking-wider">
                      Key People
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {emailAnalysis.keyPeople.map((person: string, i: number) => (
                        <span
                          key={i}
                          className="font-sans text-[12px] font-medium bg-[#FFFDF8] border border-border/50 text-espresso px-3 py-1.5 rounded-xl"
                        >
                          {person}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Replies */}
                {emailAnalysis.suggestedReplies?.length > 0 && (
                  <div className="space-y-2.5">
                    <h3 className="font-sans text-[11px] font-bold text-espresso-300 uppercase tracking-wider">
                      Suggested Replies
                    </h3>
                    <div className="flex flex-col gap-2">
                      {emailAnalysis.suggestedReplies.map((reply: string, i: number) => (
                        <button
                          key={i}
                          onClick={() => handleSuggestedReplyClick(reply)}
                          className="w-full text-left font-sans text-[12.5px] text-espresso-400 bg-[#FFFDF8] hover:bg-cream-200 border border-border/60 p-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                        >
                          "{reply}"
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Next Actions Checklist */}
                {emailAnalysis.nextActions?.length > 0 && (
                  <div className="space-y-2.5">
                    <h3 className="font-sans text-[11px] font-bold text-espresso-300 uppercase tracking-wider">
                      Suggested Actions
                    </h3>
                    <div className="space-y-2">
                      {emailAnalysis.nextActions.map((action: string, i: number) => {
                        const isDone = !!completedActions[action];
                        return (
                          <div
                            key={i}
                            onClick={() => toggleAction(action)}
                            className="flex items-start gap-3 bg-[#FFFDF8] border border-border/50 p-3.5 rounded-xl cursor-pointer select-none"
                          >
                            <span
                              className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                                isDone
                                  ? "bg-sage border-sage text-white"
                                  : "border-espresso-200 bg-white"
                              }`}
                            >
                              {isDone && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </span>
                            <span
                              className={`font-sans text-[12.5px] leading-tight transition-all ${
                                isDone ? "text-espresso-300 line-through" : "text-espresso-400"
                              }`}
                            >
                              {action}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : selectedEvent && eventAnalysis ? (
              // CALENDAR EVENT PANEL
              <motion.div
                key="event-context"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6 text-left"
              >
                <div>
                  <h2 className="font-serif text-[26px] text-espresso font-normal leading-tight">
                    Meeting Context
                  </h2>
                  <p className="font-sans text-[11px] text-espresso-300 mt-1 truncate">
                    {selectedEvent.summary}
                  </p>
                </div>

                {/* Prep Notes */}
                <div className="bg-[#FFFDF8] border border-border/80 rounded-2xl p-5 shadow-sm space-y-2.5">
                  <h3 className="font-sans text-[11px] font-bold text-accent uppercase tracking-wider">
                    Preparation Briefing
                  </h3>
                  <p className="font-sans text-[13px] text-espresso-500 leading-relaxed">
                    {eventAnalysis.prepNotes}
                  </p>
                </div>

                {/* Pre Actions */}
                {eventAnalysis.preActions?.length > 0 && (
                  <div className="space-y-2.5">
                    <h3 className="font-sans text-[11px] font-bold text-espresso-300 uppercase tracking-wider">
                      Before Meeting
                    </h3>
                    <div className="space-y-2">
                      {eventAnalysis.preActions.map((action: string, i: number) => {
                        const isDone = !!completedActions[action];
                        return (
                          <div
                            key={i}
                            onClick={() => toggleAction(action)}
                            className="flex items-start gap-3 bg-[#FFFDF8] border border-border/50 p-3.5 rounded-xl cursor-pointer select-none"
                          >
                            <span
                              className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                                isDone
                                  ? "bg-sage border-sage text-white"
                                  : "border-espresso-200 bg-white"
                              }`}
                            >
                              {isDone && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </span>
                            <span
                              className={`font-sans text-[12.5px] leading-tight transition-all ${
                                isDone ? "text-espresso-300 line-through" : "text-espresso-400"
                              }`}
                            >
                              {action}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Post Actions */}
                {eventAnalysis.postActions?.length > 0 && (
                  <div className="space-y-2.5">
                    <h3 className="font-sans text-[11px] font-bold text-espresso-300 uppercase tracking-wider">
                      Follow-ups
                    </h3>
                    <div className="space-y-2">
                      {eventAnalysis.postActions.map((action: string, i: number) => {
                        const isDone = !!completedActions[action];
                        return (
                          <div
                            key={i}
                            onClick={() => toggleAction(action)}
                            className="flex items-start gap-3 bg-[#FFFDF8] border border-border/50 p-3.5 rounded-xl cursor-pointer select-none"
                          >
                            <span
                              className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                                isDone
                                  ? "bg-sage border-sage text-white"
                                  : "border-espresso-200 bg-white"
                              }`}
                            >
                              {isDone && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </span>
                            <span
                              className={`font-sans text-[12.5px] leading-tight transition-all ${
                                isDone ? "text-espresso-300 line-through" : "text-espresso-400"
                              }`}
                            >
                              {action}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : isOverview ? (
              // DEFAULT OVERVIEW ASSISTANT STATS
              <motion.div
                key="default-overview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 text-left"
              >
                <div>
                  <h2 className="font-serif text-[26px] text-espresso font-normal leading-tight">
                    Inbox Health
                  </h2>
                  <p className="font-sans text-[11px] text-espresso-300 mt-1">
                    Real-time workspace overview
                  </p>
                </div>

                {/* Health Arc Card */}
                <div className="bg-[#FFFDF8] border border-border/80 rounded-2xl p-5 shadow-sm text-center relative overflow-hidden">
                  <div className="relative w-36 h-36 mx-auto flex items-center justify-center mt-2">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="72"
                        cy="72"
                        r="60"
                        className="stroke-espresso-100 fill-none"
                        strokeWidth="8"
                      />
                      <circle
                        cx="72"
                        cy="72"
                        r="60"
                        className="stroke-sage fill-none"
                        strokeWidth="8"
                        strokeDasharray={377}
                        strokeDashoffset={377 - 377 * 0.92}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <p className="font-serif text-[32px] leading-none text-espresso font-normal">
                        92%
                      </p>
                      <p className="font-sans text-[10px] uppercase text-espresso-300 tracking-wider mt-1">
                        Calm score
                      </p>
                    </div>
                  </div>
                  <p className="font-sans text-[12px] text-espresso-400 leading-normal mt-4 px-2">
                    Your focus is secured today. 14 items archived automatically.
                  </p>
                </div>

                {/* Schedule status */}
                <div className="bg-[#FFFDF8] border border-border/80 rounded-2xl p-5 shadow-sm space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-sky" />
                    <h3 className="font-sans text-[11px] font-bold text-espresso uppercase tracking-wider">
                      Schedule Status
                    </h3>
                  </div>
                  <p className="font-sans text-[12.5px] text-espresso-400 leading-relaxed">
                    Focus time blocks secured for today. No scheduling overlaps detected.
                  </p>
                </div>

                {/* AI Recommendations */}
                <div className="space-y-2.5">
                  <h3 className="font-sans text-[11px] font-bold text-espresso-300 uppercase tracking-wider">
                    Zentra Suggestions
                  </h3>
                  <div className="bg-[#FFFDF8] border border-border/50 rounded-2xl p-4.5 space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-accent" />
                      <p className="font-sans text-[13px] font-semibold text-espresso">
                        Pending budget approval
                      </p>
                    </div>
                    <p className="font-sans text-[12px] text-espresso-400 leading-relaxed">
                      Vikram Malhotra is waiting for budget details. Zentra prepared a draft reply.
                    </p>
                  </div>
                </div>

                {/* Draft queue status */}
                <div className="space-y-2.5">
                  <h3 className="font-sans text-[11px] font-bold text-espresso-300 uppercase tracking-wider">
                    Zentra Draft Queue
                  </h3>
                  <div className="bg-[#FFFDF8] border border-border/50 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <p className="font-sans text-[13px] font-semibold text-espresso">4 drafts ready</p>
                      <p className="font-sans text-[11px] text-espresso-300">Generated automatically</p>
                    </div>
                    <button
                      onClick={() => window.location.href = "/dashboard/communications?folder=drafts"}
                      className="w-8 h-8 rounded-full bg-accent-soft hover:bg-accent-glow text-accent flex items-center justify-center transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-accent stroke-none ml-0.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              // GENERAL FALLBACK STATS PANEL
              <motion.div
                key="general-status"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 text-left"
              >
                <div>
                  <h2 className="font-serif text-[26px] text-espresso font-normal leading-tight">
                    Assistant Live
                  </h2>
                  <p className="font-sans text-[11px] text-espresso-300 mt-1">
                    System active & synchronized
                  </p>
                </div>
                <div className="bg-[#FFFDF8] border border-border/80 rounded-2xl p-5 shadow-sm text-center">
                  <Inbox className="w-8 h-8 text-accent mx-auto mb-3" />
                  <p className="font-sans text-[13px] text-espresso-400 leading-relaxed">
                    Select any email conversation or meeting agenda to see real-time co-pilot intelligence.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>

      <ComposeModal
        open={composeOpen}
        onOpenChange={setComposeOpen}
        replyTo={replyTo}
        replySubject={replySubject}
        replyBody={replyBody}
      />
    </>
  );
}
