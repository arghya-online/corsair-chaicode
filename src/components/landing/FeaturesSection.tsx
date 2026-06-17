"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Calendar, MessageSquare } from "lucide-react";

export function FeaturesSection() {
  const [inboxFailed, setInboxFailed] = useState(false);
  const [calendarFailed, setCalendarFailed] = useState(false);
  const [assistantFailed, setAssistantFailed] = useState(false);

  const stories = [
    {
      id: "search",
      headline: "Stop searching.\nStart finding.",
      copy: "Ask questions in plain English and instantly uncover conversations, decisions, and information hidden across your inbox.",
      image: "/dashboard_inbox.png",
      imgFailed: inboxFailed,
      setImgFailed: setInboxFailed,
      icon: Search,
      badge: "AI SEARCH",
      reverse: false,
      renderFallback: () => (
        <div className="w-full h-full bg-[#FCFAF7] p-6 sm:p-8 flex flex-col justify-between select-none">
          {/* Mock Browser Header */}
          <div className="flex items-center gap-3 bg-white border border-[rgba(17,24,39,0.06)] px-4 py-3 rounded-xl shadow-sm">
            <Search className="w-4 h-4 text-[#C1783F]" />
            <span className="text-[14px] text-[#111827] font-medium font-sans">
              Find Vikram's notes from last week
            </span>
          </div>

          {/* Detail card */}
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-xl border border-[#C1783F]/15 text-left shadow-sm space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[13px] font-bold text-[#111827]">Vikram Malhotra</span>
                <span className="text-[11px] text-[#5F6B7A]">June 10, 2026</span>
              </div>
              <p className="text-[13px] text-[#5F6B7A] leading-relaxed">
                "I've attached the final launch notes. We should focus on scheduling our courtyard presentation around noon for the best natural light..."
              </p>
            </div>
          </div>

          <div className="h-6" />
        </div>
      )
    },
    {
      id: "calendar",
      headline: "A schedule that works with you.",
      copy: "See commitments clearly, detect conflicts early, and stay ahead of what matters.",
      image: "/dashboard_calendar.png",
      imgFailed: calendarFailed,
      setImgFailed: setCalendarFailed,
      icon: Calendar,
      badge: "CALENDAR Sync",
      reverse: true,
      renderFallback: () => (
        <div className="w-full h-full bg-[#FCFAF7] p-6 sm:p-8 flex flex-col justify-between select-none text-left">
          <div className="space-y-4">
            <span className="text-[11px] font-bold text-[#C1783F] uppercase tracking-wider block">Conflict Resolution</span>

            <div className="bg-white p-4 rounded-xl border border-l-4 border-l-[#C1783F] border-[rgba(17,24,39,0.06)] shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-[13px] font-bold text-[#111827]">Product Sync with Vikram</span>
                <span className="text-[11px] text-[#C1783F] font-semibold">10:00 AM</span>
              </div>
              <p className="text-[12px] text-[#5F6B7A] mt-1">Conflicts with "Design Critique" at 10:15 AM</p>
            </div>

            <div className="bg-[#5A6D56]/8 p-4 rounded-xl border-l-4 border-l-[#5A6D56] border-[rgba(17,24,39,0.04)]">
              <p className="text-[12px] text-[#5A6D56] font-medium">
                Zentra Suggestion: Reschedule Sync to Wednesday at 2 PM (Both are free)
              </p>
            </div>
          </div>

          <div className="h-6" />
        </div>
      )
    },
  ];

  return (
    <section id="features" className="py-36 px-4 sm:px-6 md:px-8 bg-transparent select-none">
      <div className="mx-auto max-w-6xl space-y-48">

        {/* Section Header */}
        <div className="max-w-3xl text-left space-y-4">
          <div className="text-[13px] font-semibold tracking-[0.2em] text-[#C1783F] uppercase">
            CAPABILITIES
          </div>
          <h2 className="text-[38px] md:text-[56px] font-serif font-normal text-[#111827] leading-tight tracking-tight">
            Gmail and Calendar, designed for quiet efficiency.
          </h2>
        </div>

        {/* Alternating Premium Story Rows */}
        <div className="space-y-40">
          {stories.map((story, index) => {
            const Icon = story.icon;
            return (
              <div
                key={story.id}
                className={`flex flex-col lg:flex-row items-center gap-16 lg:gap-24 ${story.reverse ? "lg:flex-row-reverse" : ""
                  }`}
              >

                {/* Visual Pane (with fallback) */}
                <div className="w-full lg:w-1/2 flex-shrink-0 bg-[#FCFAF7]/40 backdrop-blur-md border border-[rgba(17,24,39,0.06)] p-3 rounded-[28px] shadow-[0_16px_40px_rgba(17,24,39,0.02)]">
                  <div className="relative overflow-hidden rounded-[20px] aspect-[16/10] bg-[#FCFAF7] border border-[rgba(17,24,39,0.08)] shadow-inner">
                    {!story.imgFailed && (
                      <img
                        src={story.image}
                        alt={`Zentra ${story.badge} Screenshot`}
                        className="absolute inset-0 w-full h-full object-cover z-20"
                        onError={() => story.setImgFailed(true)}
                      />
                    )}
                    {/* Render specific premium HTML/CSS Mockup Fallback */}
                    {story.renderFallback()}
                  </div>
                </div>

                {/* Editorial Content Pane */}
                <div className="w-full lg:w-1/2 space-y-6 text-left">
                  <div className="text-[13px] font-semibold tracking-[0.2em] text-[#C1783F] uppercase flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{story.badge}</span>
                  </div>

                  {/* Heading - 56px to 72px equivalent sizes */}
                  <h3 className="text-[36px] sm:text-[44px] md:text-[52px] font-serif font-normal text-[#111827] leading-[1.12] tracking-tight whitespace-pre-line">
                    {story.headline}
                  </h3>

                  {/* Body Copy - 18px to 20px size */}
                  <p className="text-[18px] md:text-[20px] leading-relaxed text-[#5F6B7A] font-sans font-normal pt-2">
                    {story.copy}
                  </p>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default FeaturesSection;
