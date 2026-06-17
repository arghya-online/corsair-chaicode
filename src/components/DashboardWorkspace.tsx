"use client";

import React, { useState } from "react";
import {
  Home,
  Sparkles,
  Mail,
  Plug,
  Settings,
  LogOut,
  User,
  Menu,
  Calendar
} from "lucide-react";
import { signOutAction } from "@/src/actions/auth";
import DashboardTodos from "./DashboardTodos";
import { AssistantClient } from "./chat/AssistantClient";
import GmailInbox from "./GmailInbox";
import GoogleCalendar from "./GoogleCalendar";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date | string;
}

interface UserProps {
  id: string;
  name: string | null;
  email: string;
}

interface Props {
  user: UserProps;
  initialTodos: Todo[];
  defaultTab?: TabType;
}

type TabType = "home" | "chat" | "gmail" | "calendar" | "integrations" | "settings";

export default function DashboardWorkspace({ user, initialTodos, defaultTab = "home" }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [activeEmailId, setActiveEmailId] = useState<string | null>(null);

  const handleSignOut = async () => {
    await signOutAction();
  };

  const menuItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "chat", label: "AI Chat", icon: Sparkles, colorClass: "text-[#F4622A]" },
    { id: "gmail", label: "Gmail", icon: Mail },
    { id: "calendar", label: "Calendar", icon: Calendar, colorClass: "text-[#F97316]" },
    { id: "integrations", label: "Integrations", icon: Plug },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#FAFAFA] text-[#0D0D0D] font-sans overflow-hidden">

      {/* 1. Desktop Left Sidebar (Hidden on mobile) */}
      <aside
        className="hidden md:flex bg-[#F2F2F5] border-r border-[#E8E8EC] h-full flex-col justify-between transition-all duration-300 z-30 select-none relative"
        style={{ width: sidebarExpanded ? "240px" : "64px" }}
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
      >
        <div className="flex flex-col">
          {/* Logo Brand */}
          <div className="h-16 flex items-center px-4 border-b border-[#E8E8EC] overflow-hidden whitespace-nowrap">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#F4622A] to-[#FF8C5A] flex items-center justify-center flex-shrink-0 shadow-[0_2px_8px_rgba(244,98,42,0.2)]">
              <span className="text-white text-xs font-bold font-display">Z</span>
            </div>
            {sidebarExpanded && (
              <span className="ml-3 text-sm font-bold tracking-widest text-[#0D0D0D] uppercase font-display">
                Zentra
              </span>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-2 space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TabType)}
                  className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 cursor-pointer ${isActive
                    ? "bg-[#F97316]/[0.08] text-[#F97316] font-semibold"
                    : "text-[#6B7280] hover:bg-black/[0.03] hover:text-[#0D0D0D]"
                    }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive && !item.colorClass ? "text-[#F97316]" : item.colorClass || ""}`} />
                  {sidebarExpanded && (
                    <span className="ml-3 text-xs tracking-wide font-medium">
                      {item.label}
                    </span>
                  )}
                  {isActive && (
                    <div className="absolute left-0 w-[3px] h-6 bg-[#F97316] rounded-r-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile / Logout */}
        <div className="p-2 border-t border-[#E8E8EC] overflow-hidden">
          <div className="flex items-center p-2 rounded-xl bg-white/40 border border-[#E8E8EC] mb-2 whitespace-nowrap">
            <div className="w-7 h-7 rounded-full bg-[#F97316]/10 flex items-center justify-center text-[#F97316] flex-shrink-0">
              <User className="w-4 h-4" />
            </div>
            {sidebarExpanded && (
              <div className="ml-2 overflow-hidden text-left">
                <p className="text-xs font-bold text-[#0D0D0D] truncate capitalize">{user.name || "Console User"}</p>
                <p className="text-[9px] text-[#6B7280] truncate">{user.email}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center p-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarExpanded && (
              <span className="ml-3 text-xs font-medium">
                Sign Out
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* 2. Responsive Mobile Bottom Navigation Bar (Hidden on desktop) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[#E8E8EC] z-40 flex items-center justify-around px-2 shadow-[0_-4px_20px_rgba(13,13,13,0.03)]">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={`flex flex-col items-center justify-center py-1 flex-1 transition-all duration-200 cursor-pointer ${isActive ? "text-[#F97316]" : "text-[#6B7280]"
                }`}
            >
              <Icon className={`w-5 h-5 ${isActive && item.colorClass ? item.colorClass : ""}`} />
              <span className="text-[9px] font-medium mt-1 uppercase tracking-wider scale-90">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#FAFAFA] pb-16 md:pb-0">

        {/* Top Header Bar */}
        <header className="h-16 border-b border-[#E8E8EC] px-6 md:px-8 flex items-center justify-between bg-white flex-shrink-0 z-20">
          <div className="flex items-center gap-3">
            {/* Mobile Brand indicator */}
            <div className="md:hidden w-6 h-6 rounded bg-gradient-to-br from-[#F4622A] to-[#FF8C5A] flex items-center justify-center flex-shrink-0 mr-1 shadow-sm">
              <span className="text-white text-[10px] font-bold font-display">Z</span>
            </div>
            <h1 className="text-xs font-bold uppercase tracking-wider font-mono text-[#6B7280]">
              {activeTab === "home" && "Home Console"}
              {activeTab === "chat" && "Zentra AI Core"}
              {activeTab === "gmail" && "Gmail Context"}
              {activeTab === "calendar" && "Google Calendar"}
              {activeTab === "integrations" && "Core Integrations"}
              {activeTab === "settings" && "System Settings"}
            </h1>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-[#6B7280]">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active
            </span>
            {/* Mobile Logout trigger */}
            <button
              onClick={handleSignOut}
              className="md:hidden p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Dynamic Tab Canvas */}
        <div className="flex-1 overflow-hidden relative">

          {/* TAB 1: HOME */}
          {activeTab === "home" && (
            <div className="h-full overflow-y-auto p-4 md:p-8 space-y-6 animate-fade-in max-w-7xl mx-auto w-full">
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-[#F97316]/[0.03] to-[#F4622A]/[0.02] border border-[#E8E8EC] rounded-[24px] p-6 md:p-8 shadow-[0_4px_20px_rgba(13,13,13,0.01)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#0D0D0D] font-display">
                    Welcome back, {user.name || "User"}
                  </h2>
                  <p className="text-xs text-[#6B7280]">
                    Your AI workspace is synced. All systems are operational.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("chat")}
                  className="rounded-full bg-[#F97316] px-5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-[#C2410C] hover:shadow-[0_4px_12px_rgba(249,115,22,0.15)] flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Talk to AI Assistant</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Task Manager Column */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white border border-[#E8E8EC] rounded-[24px] p-6 shadow-[0_4px_20px_rgba(13,13,13,0.02)]">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] font-sans border-b border-[#E8E8EC] pb-3 mb-6">
                      Task Scheduler
                    </h2>
                    <DashboardTodos initialTodos={initialTodos} />
                  </div>
                </div>

                {/* Status Column */}
                <div className="space-y-6 lg:col-span-1">
                  <div className="bg-white border border-[#E8E8EC] rounded-[24px] p-6 shadow-[0_4px_20px_rgba(13,13,13,0.02)]">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] font-sans border-b border-[#E8E8EC] pb-3 mb-4">
                      Workspace Insights
                    </h2>
                    <div className="space-y-3 font-sans text-xs">
                      <div className="flex justify-between items-center bg-[#F2F2F5] border border-[#E8E8EC] p-3.5 rounded-xl">
                        <span className="text-[#6B7280]">AI Assistant Status</span>
                        <span className="font-semibold text-emerald-600">Online & Ready</span>
                      </div>
                      <div className="flex justify-between items-center bg-[#F2F2F5] border border-[#E8E8EC] p-3.5 rounded-xl">
                        <span className="text-[#6B7280]">Pending Tasks</span>
                        <span className="font-semibold text-[#F97316]">
                          {initialTodos.filter(t => !t.completed).length} active
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-[#E8E8EC] rounded-[24px] p-6 shadow-[0_4px_20px_rgba(13,13,13,0.02)]">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] font-sans border-b border-[#E8E8EC] pb-3 mb-4">
                      Connected Apps
                    </h2>
                    <div className="space-y-3 font-sans text-xs">
                      <div className="flex justify-between items-center bg-[#F2F2F5] border border-[#E8E8EC] p-3.5 rounded-xl">
                        <span>Gmail Service</span>
                        <span className="text-[9px] bg-emerald-100 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-bold">CONNECTED</span>
                      </div>
                      <div className="flex justify-between items-center bg-[#F2F2F5] border border-[#E8E8EC] p-3.5 rounded-xl">
                        <span>Google Calendar</span>
                        <button
                          onClick={() => setActiveTab("calendar")}
                          className="text-[9px] bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20 px-2 py-0.5 rounded font-bold hover:bg-[#F97316]/20 transition cursor-pointer"
                        >
                          VIEW
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AI CHAT */}
          {activeTab === "chat" && (
            <div className="h-full flex flex-col items-center justify-center p-4 md:p-8 animate-fade-in relative">
              <div className="w-full max-w-4xl h-full flex flex-col justify-between">
                <AssistantClient />
              </div>
            </div>
          )}

          {/* TAB 3: GMAIL */}
          {activeTab === "gmail" && (
            <div className="h-full flex animate-fade-in flex-col lg:flex-row">
              {/* Inbox layout container */}
              <div className="flex-1 h-full overflow-hidden border-r border-[#E8E8EC]">
                <GmailInbox onSelectEmail={(id) => setActiveEmailId(id)} />
              </div>

              {/* Right persistent AI side panel (Hidden on small viewports if not selected or shown below) */}
              <aside className="hidden lg:flex w-[340px] h-full border-l border-[#E8E8EC] bg-white p-6 overflow-y-auto flex-col gap-6 flex-shrink-0">
                <div className="border-b border-[#E8E8EC] pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-[#F4622A]" />
                    <span className="text-xs font-bold uppercase tracking-wider font-sans text-[#F4622A]">
                      ZENTRA ANALYZER
                    </span>
                  </div>
                  <h3 className="text-sm font-bold font-display">Context Briefing</h3>
                </div>

                {activeEmailId ? (
                  <div className="space-y-6 text-xs leading-relaxed">
                    <div className="bg-[#F2F2F5] p-4 rounded-2xl border border-[#E8E8EC] text-[#0D0D0D]">
                      <span className="font-bold text-[10px] uppercase text-[#6B7280] block mb-1 font-sans">
                        Instant Core Summary
                      </span>
                      "Meghna Das requests rescheduling your upcoming interview. They proposed July 4, 2026. Zentra parsed the context and pre-drafted replies."
                    </div>

                    <div className="space-y-2.5">
                      <span className="font-bold text-[10px] uppercase text-[#6B7280] block font-sans">
                        Generated Smart Replies
                      </span>
                      <div className="space-y-2">
                        <button className="w-full text-left p-3 border border-[#E8E8EC] rounded-xl hover:border-[#F97316] hover:bg-[#F97316]/[0.02] transition-all cursor-pointer">
                          <span className="font-bold text-[#F97316] block mb-0.5">Professional</span>
                          "Dear Meghna, Rescheduling to July 4, 2026 works perfectly. Looking forward..."
                        </button>
                        <button className="w-full text-left p-3 border border-[#E8E8EC] rounded-xl hover:border-[#F97316] hover:bg-[#F97316]/[0.02] transition-all cursor-pointer">
                          <span className="font-bold text-[#F4622A] block mb-0.5">Friendly</span>
                          "Hi Meghna! Rescheduling our session to July 4th works for me. Speak soon!"
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <span className="font-bold text-[10px] uppercase text-[#6B7280] block font-sans">
                        Action Metadata Extracted
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded font-sans text-[9px] font-bold">
                          DUE: July 4, 2026
                        </span>
                        <span className="px-2 py-0.5 bg-[#F97316]/5 text-[#F97316] border border-[#F97316]/20 rounded font-sans text-[9px] font-bold">
                          Meghna Das
                        </span>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-sans text-[9px] font-bold">
                          Interview Request
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-xs text-[#6B7280] py-12 flex flex-col items-center gap-3">
                    <Mail className="w-8 h-8 text-[#6B7280]/40" />
                    <span>Select an email thread from the inbox to trigger AI Context Analysis.</span>
                  </div>
                )}
              </aside>
            </div>
          )}

          {/* TAB 4: GOOGLE CALENDAR */}
          {activeTab === "calendar" && (
            <div className="h-full flex animate-fade-in">
              <GoogleCalendar />
            </div>
          )}

          {/* TAB 5: INTEGRATIONS */}
          {activeTab === "integrations" && (
            <div className="h-full overflow-y-auto p-4 md:p-8 space-y-8 animate-fade-in max-w-4xl mx-auto w-full">
              <div className="bg-white border border-[#E8E8EC] rounded-[24px] p-6 shadow-[0_4px_20px_rgba(13,13,13,0.02)] space-y-6">
                <div>
                  <h2 className="text-base font-bold font-display">Configure Connected Accounts</h2>
                  <p className="text-xs text-[#6B7280]">Link Zentra directly to third-party services using CorsAir security layers.</p>
                </div>

                <div className="space-y-4">
                  {[
                    { name: "Gmail Integration", status: "Connected", desc: "Read, parse priority indexes, and send response emails.", icon: Mail, color: "text-[#EA4335]", plugin: "gmail" },
                    { name: "Google Calendar", status: "Connected", desc: "View, create, edit and delete calendar events and meetings.", icon: Calendar, color: "text-[#F97316]", plugin: "googlecalendar" },
                  ].map((integration) => (
                    <div key={integration.name} className="flex flex-col sm:flex-row justify-between sm:items-center p-4 bg-[#FAFAFA] border border-[#E8E8EC] rounded-2xl gap-4">
                      <div className="flex gap-3">
                        <integration.icon className={`w-5 h-5 ${integration.color}`} />
                        <div>
                          <span className="text-xs font-bold text-[#0D0D0D] block">{integration.name}</span>
                          <span className="text-[10px] text-[#6B7280]">{integration.desc}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={`/api/connect?plugin=${integration.plugin}`}
                          className="rounded-full px-4 py-1.5 text-xs font-semibold border border-[#F97316]/30 bg-[#F97316]/5 text-[#F97316] hover:bg-[#F97316]/10 transition cursor-pointer"
                        >
                          Reconnect
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === "settings" && (
            <div className="h-full overflow-y-auto p-4 md:p-8 space-y-8 animate-fade-in max-w-4xl mx-auto w-full">
              <div className="bg-white border border-[#E8E8EC] rounded-[24px] p-6 shadow-[0_4px_20px_rgba(13,13,13,0.02)] space-y-6">
                <div>
                  <h2 className="text-base font-bold font-display">System Configuration</h2>
                  <p className="text-xs text-[#6B7280]">Manage model keys, guardrail thresholds, and profile details.</p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="space-y-2">
                    <label className="font-bold text-[#0D0D0D] block">Token Windows Threshold (Guardrails)</label>
                    <select className="w-full bg-[#FAFAFA] border border-[#E8E8EC] p-3 rounded-xl outline-none">
                      <option>Cap at 1200 Characters (Recommended)</option>
                      <option>Cap at 2000 Characters</option>
                      <option>Unlimited (Token Intensive)</option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => alert("Settings saved successfully.")}
                      className="bg-[#F97316] hover:bg-[#C2410C] text-white px-6 py-3 rounded-full font-semibold transition cursor-pointer"
                    >
                      Save Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
