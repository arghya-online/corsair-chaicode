"use client";

import React, { useState } from "react";
import { Search, Mail, Calendar, MessageSquare } from "lucide-react";

export function ProductShowcase() {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <section className="py-36 px-4 sm:px-6 md:px-8 bg-transparent select-none text-center">
      <div className="mx-auto max-w-[1400px] flex flex-col items-center">

        {/* Section Header */}
        <div className="max-w-4xl mb-16 space-y-6">
          <div className="text-[13px] font-semibold tracking-[0.2em] text-[#C1783F] uppercase">
            PRODUCT
          </div>
          <h2 className="text-[38px] md:text-[56px] lg:text-[72px] font-serif font-normal text-[#111827] leading-[1.08] tracking-tight">
            Your Gmail, Calendar, and Priorities.<br className="hidden md:inline" />
            All in one calm workspace.
          </h2>
          <p className="text-[18px] md:text-[20px] text-[#5F6B7A] font-sans leading-relaxed max-w-2xl mx-auto font-normal pt-2">
            Search emails, draft replies, coordinate schedules, and stay organized from a single workspace.
          </p>
        </div>

        {/* Device Frame - Massive & Nearly Edge-to-Edge */}
        <div className="w-full bg-[#FCFAF7]/50 backdrop-blur-md border border-[rgba(17,24,39,0.06)] p-3 sm:p-5 rounded-[28px] sm:rounded-[40px] shadow-[0_24px_70px_rgba(17,24,39,0.04)]">
          <div className="relative overflow-hidden rounded-[20px] sm:rounded-[32px] border border-[rgba(17,24,39,0.08)] bg-[#FCFAF7] aspect-[16/10] w-full">

            {/* The Image (attempts to load) */}
            {!imgFailed && (
              <img
                src="/dashboard_overview.png"
                alt="Zentra AI Workspace Overview Dashboard"
                className="absolute inset-0 w-full h-full object-cover z-20"
                onError={() => setImgFailed(true)}
              />
            )}

            {/* Handcrafted Premium CSS Mockup Fallback */}
            <div className="absolute inset-0 w-full h-full bg-[#FCFAF7] flex flex-col text-[#111827] font-sans">

              {/* Window Header */}
              <div className="h-14 border-b border-[rgba(17,24,39,0.06)] px-6 flex items-center justify-between bg-white/40">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#C1783F]/30" />
                  <div className="w-3 h-3 rounded-full bg-[#C1783F]/50" />
                  <div className="w-3 h-3 rounded-full bg-[#C1783F]" />
                  <span className="ml-4 text-[13px] font-medium text-[#5F6B7A] tracking-wide font-sans">zentra.ai / workspace</span>
                </div>
                <div className="flex items-center gap-4 bg-[#F7F3EC] px-4 py-1.5 rounded-full border border-[rgba(17,24,39,0.05)]">
                  <span className="w-2 h-2 rounded-full bg-[#5A6D56]" />
                  <span className="text-[12px] font-medium text-[#5F6B7A]">Sync active</span>
                </div>
              </div>

              {/* Main Content splits into Sidebar and Workspace */}
              <div className="flex-1 flex overflow-hidden">

                {/* Sidebar */}
                <div className="w-64 border-r border-[rgba(17,24,39,0.06)] bg-white/20 p-5 flex flex-col justify-between hidden md:flex">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 px-2">
                      <div className="w-8 h-8 rounded-full bg-[#C1783F] flex items-center justify-center text-white text-[14px] font-serif">
                        Z
                      </div>
                      <span className="font-serif text-[16px] font-normal tracking-wide text-[#111827]">Zentra</span>
                    </div>

                    <div className="space-y-1">
                      {[
                        { icon: Mail, label: "Priority Inbox", active: true, badge: "4" },
                        { icon: Search, label: "Context Search", active: false },
                        { icon: Calendar, label: "Calendar Co-pilot", active: false },
                        { icon: MessageSquare, label: "Draft Assistant", active: false }
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${item.active ? "bg-[#111827] text-white" : "text-[#5F6B7A] hover:bg-[rgba(17,24,39,0.03)]"
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className={`w-4 h-4 ${item.active ? "text-white" : "text-[#5F6B7A]"}`} />
                            <span className="text-[14px] font-medium">{item.label}</span>
                          </div>
                          {item.badge && (
                            <span className={`text-[11px] px-2 py-0.5 rounded-full ${item.active ? "bg-white/20 text-white" : "bg-[#F7F3EC] text-[#C1783F]"}`}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-[rgba(17,24,39,0.06)] pt-4 space-y-3">
                    <div className="flex items-center gap-3 px-3">
                      <div className="w-7 h-7 rounded-full bg-[#C1783F]/10 flex items-center justify-center text-[#C1783F] text-[11px] font-bold">
                        AH
                      </div>
                      <div className="text-left">
                        <p className="text-[12px] font-semibold text-[#111827]">Arghya Halder</p>
                        <p className="text-[10px] text-[#5F6B7A]">arghyamajumdar.contact555@gmail.com</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Workspace Area */}
                <div className="flex-1 flex flex-col bg-white/10 p-6 sm:p-8 overflow-y-auto">

                  {/* Workspace Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-1">

                    {/* Left Pane: Calm Inbox List */}
                    <div className="lg:col-span-7 bg-[#FCFAF7] border border-[rgba(17,24,39,0.06)] rounded-2xl p-5 flex flex-col justify-between shadow-sm">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-[rgba(17,24,39,0.05)] pb-3">
                          <span className="text-[13px] font-semibold tracking-wider text-[#C1783F] uppercase">PRIORITIES TODAY</span>
                          <span className="text-[12px] text-[#5F6B7A]">4 messages</span>
                        </div>

                        <div className="space-y-3">
                          {[
                            { sender: "Vikram Malhotra", title: "Review product launch notes", time: "10 mins ago", unread: true },
                            { sender: "Sarah Chen", title: "Calendar conflict on Tuesday", time: "2 hrs ago", unread: false },
                            { sender: "Google Calendar", title: "Schedule summary for tomorrow", time: "4 hrs ago", unread: false }
                          ].map((msg, i) => (
                            <div
                              key={i}
                              className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${msg.unread
                                ? "bg-white border-[#C1783F]/20 shadow-sm"
                                : "bg-white/40 border-[rgba(17,24,39,0.04)] hover:bg-white"
                                }`}
                            >
                              <div className="flex justify-between items-start">
                                <span className={`text-[14px] font-semibold ${msg.unread ? "text-[#111827]" : "text-[#5F6B7A]"}`}>
                                  {msg.sender}
                                </span>
                                <span className="text-[11px] text-[#5F6B7A]">{msg.time}</span>
                              </div>
                              <p className="text-[13px] text-[#5F6B7A] mt-1 line-clamp-1">{msg.title}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 flex justify-between items-center text-[12px] text-[#5F6B7A] border-t border-[rgba(17,24,39,0.05)] mt-4">
                        <span>Zentra connects directly to Gmail</span>
                        <span className="text-[#C1783F] font-medium cursor-pointer hover:underline">View Inbox →</span>
                      </div>
                    </div>

                    {/* Right Pane: Smart Draft Preview / Calendar */}
                    <div className="lg:col-span-5 flex flex-col gap-6">

                      {/* Copilot Action Draft */}
                      <div className="bg-[#111827] text-white rounded-2xl p-5 flex-1 flex flex-col justify-between shadow-md text-left">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-[#C1783F]">
                            <MessageSquare className="w-4 h-4" />
                            <span className="text-[12px] font-semibold uppercase tracking-wider">AI ASSISTANT</span>
                          </div>
                          <p className="text-[15px] font-serif font-light text-white/90 leading-relaxed">
                            "Zentra has drafted a reply to Vikram's notes. He proposed Tuesday at 10 AM, which conflicts with your sync."
                          </p>
                          <div className="bg-white/10 p-3 rounded-xl border border-white/5 space-y-1.5">
                            <span className="text-[10px] text-white/50 block font-semibold uppercase tracking-wider">DRAFT REPLY</span>
                            <p className="text-[12px] text-white/85 line-clamp-2">
                              Hi Vikram, Tuesday morning has a conflict. Could we push to Wednesday at 2 PM instead?
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-4">
                          <button className="flex-1 bg-[#C1783F] hover:bg-[#C1783F]/90 text-white rounded-xl py-2 text-[12px] font-medium transition-colors">
                            Approve & Send
                          </button>
                          <button className="bg-white/10 hover:bg-white/15 text-white rounded-xl px-3 py-2 text-[12px] font-medium transition-colors">
                            Edit
                          </button>
                        </div>
                      </div>

                      {/* Quiet Calendar Widget */}
                      <div className="bg-[#FCFAF7] border border-[rgba(17,24,39,0.06)] rounded-2xl p-5 flex flex-col justify-between shadow-sm text-left">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[12px] text-[#5F6B7A] border-b border-[rgba(17,24,39,0.05)] pb-2">
                            <span className="font-semibold uppercase tracking-wider text-[#C1783F]">UPCOMING</span>
                            <span>Tuesday, June 17</span>
                          </div>
                          <div className="space-y-2 pt-1">
                            <div className="flex gap-3 items-center">
                              <span className="text-[12px] font-semibold text-[#111827] w-14">10:00 AM</span>
                              <div className="flex-1 bg-[#C1783F]/10 border-l-2 border-[#C1783F] px-2 py-1 rounded">
                                <p className="text-[12px] font-medium text-[#111827] line-clamp-1">Product Sync (Conflict)</p>
                              </div>
                            </div>
                            <div className="flex gap-3 items-center">
                              <span className="text-[12px] font-semibold text-[#5F6B7A] w-14">2:00 PM</span>
                              <div className="flex-1 bg-[#5A6D56]/10 border-l-2 border-[#5A6D56] px-2 py-1 rounded">
                                <p className="text-[12px] font-medium text-[#111827] line-clamp-1">Design Review</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

export default ProductShowcase;
