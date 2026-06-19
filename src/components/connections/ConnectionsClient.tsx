"use client";

import React, { useState, useEffect } from "react";
import { Mail, Calendar, RefreshCw, Link2, ShieldCheck, ShieldAlert, Power } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { disconnectIntegrationAction } from "@/src/actions/integrations";

// Custom Github icon component since this version of lucide-react does not export Github
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface UserProps {
  id: string;
  name?: string | null;
  email: string;
}

interface Props {
  user: UserProps;
}

interface IntegrationCard {
  id: string;
  name: string;
  desc: string;
  icon: React.ElementType;
  colorClass: string;
  bgClass: string;
}

export function ConnectionsClient({ user }: Props) {
  const [connections, setConnections] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  const fetchConnectionStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/corsair/connection-status?tenantId=${encodeURIComponent(user.id)}`);
      if (res.ok) {
        const data = await res.json();
        setConnections(data);
      } else {
        toast.error("Failed to retrieve integration status.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Connection check failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnectionStatus();
  }, []);

  const handleDisconnect = async (integrationId: string) => {
    if (!confirm(`Are you sure you want to disconnect ${integrationId}? This will remove all local cached items and authorization credentials.`)) {
      return;
    }

    setActionLoading((prev) => ({ ...prev, [integrationId]: true }));
    try {
      const res = await disconnectIntegrationAction(integrationId);
      if (res.success) {
        toast.success(`${integrationId} disconnected successfully.`);
        // Reload statuses
        await fetchConnectionStatus();
      } else {
        toast.error(res.error || `Failed to disconnect ${integrationId}.`);
      }
    } catch (e: any) {
      toast.error(e.message || "An unexpected error occurred.");
    } finally {
      setActionLoading((prev) => ({ ...prev, [integrationId]: false }));
    }
  };

  const integrations: IntegrationCard[] = [
    {
      id: "gmail",
      name: "Gmail Integration",
      desc: "Retrieve, index priority inboxes, and compose replies using Zentra AI.",
      icon: Mail,
      colorClass: "text-[#EA4335]",
      bgClass: "rgba(234, 67, 53, 0.08)",
    },
    {
      id: "googlecalendar",
      name: "Google Calendar",
      desc: "Synchronize meeting blocks, create invitations, and manage daily schedule slots.",
      icon: Calendar,
      colorClass: "text-[#F97316]",
      bgClass: "rgba(249, 115, 22, 0.08)",
    },
    {
      id: "github",
      name: "GitHub Developer",
      desc: "Link repository context, retrieve issues, and track active commits.",
      icon: GithubIcon,
      colorClass: "text-[#111827]",
      bgClass: "rgba(17, 24, 39, 0.08)",
    },
  ];

  return (
    <div className="min-h-screen px-6 sm:px-8 py-10 max-w-[1000px] mx-auto w-full space-y-8 select-none text-left">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[11px] font-bold text-[#C67B3D] tracking-[0.15em] uppercase block mb-1">
            Setup Integrations
          </span>
          <h1 className="text-[32px] sm:text-[40px] font-serif font-normal tracking-tight text-[#111827] leading-tight">
            Connections Manager
          </h1>
          <p className="text-[13.5px] text-[#64748B] mt-1">
            Authorize and manage the connections between Zentra and your external applications.
          </p>
        </div>

        <button
          onClick={fetchConnectionStatus}
          disabled={loading}
          className="p-2.5 rounded-xl bg-white border border-[rgba(17,24,39,0.08)] hover:bg-[#F7F2EA] text-[#64748B] hover:text-[#111827] transition-all cursor-pointer disabled:opacity-50"
          title="Refresh connection states"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Connection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((item) => {
          const status = connections[item.id] || "not_connected";
          const isConnected = status === "connected";
          const isBusy = !!actionLoading[item.id];
          const Icon = item.icon;

          return (
            <motion.div
              key={item.id}
              className="bg-white border border-[rgba(17,24,39,0.06)] rounded-[24px] p-6 shadow-xs flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-all duration-300"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-4">
                {/* Title & Icon Header */}
                <div className="flex justify-between items-start">
                  <div
                    style={{ backgroundColor: item.bgClass }}
                    className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  >
                    <Icon className={`w-5.5 h-5.5 ${item.colorClass}`} />
                  </div>

                  {loading ? (
                    <span className="h-6 w-16 bg-[#F7F2EA] rounded animate-pulse" />
                  ) : isConnected ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-sans">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Connected
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-[#F7F2EA] text-[#64748B] border border-[rgba(17,24,39,0.06)] font-sans">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Not Connected
                    </span>
                  )}
                </div>

                {/* Details */}
                <div>
                  <h3 className="font-sans text-[16px] font-bold text-[#111827]">
                    {item.name}
                  </h3>
                  <p className="font-sans text-[12px] text-[#64748B] mt-1.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>

              {/* Action Trigger */}
              <div className="pt-6 border-t border-[rgba(17,24,39,0.05)] mt-6 flex justify-end gap-2.5">
                {loading ? (
                  <span className="h-9 w-24 bg-[#F7F2EA] rounded animate-pulse" />
                ) : isConnected ? (
                  <>
                    <a
                      href={`/api/connect?plugin=${item.id}`}
                      className="px-4 py-2 text-[12px] font-bold font-sans rounded-xl bg-[#F7F2EA] hover:bg-[#ebdcc3] text-[#111827] border border-[rgba(17,24,39,0.05)] transition-all cursor-pointer text-center"
                    >
                      Reconnect
                    </a>
                    <button
                      onClick={() => handleDisconnect(item.id)}
                      disabled={isBusy}
                      className="px-4 py-2 text-[12px] font-bold font-sans rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 hover:border-red-200 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1"
                    >
                      <Power className="w-3.5 h-3.5" />
                      {isBusy ? "Disconnecting..." : "Disconnect"}
                    </button>
                  </>
                ) : (
                  <a
                    href={`/api/connect?plugin=${item.id}`}
                    className="px-5 py-2 text-[12px] font-bold font-sans rounded-xl bg-[#C67B3D] hover:bg-[#A35F2B] text-white transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    Connect Account
                  </a>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
