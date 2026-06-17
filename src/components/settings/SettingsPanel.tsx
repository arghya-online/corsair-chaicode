"use client";

import React, { useState, useEffect } from "react";
import { Mail, Calendar, Loader2, Link2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import UpgradeModal from "@/src/components/shared/UpgradeModal";
import { useClerk } from "@clerk/nextjs";
import { toast } from "sonner";

interface SettingsPanelProps {
  user: {
    name?: string | null;
    email: string;
  };
}

export function SettingsPanel({ user }: SettingsPanelProps) {
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [connections, setConnections] = useState<{
    gmail: boolean;
    calendar: boolean;
  } | null>(null);
  const [loadingConnections, setLoadingConnections] = useState(true);
  const { signOut } = useClerk();

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch("/api/dashboard/stats");
        if (res.ok) {
          const data = await res.json();
          setConnections({
            gmail: !!data.gmailConnected,
            calendar: !!data.calendarConnected,
          });
        }
      } catch (err) {
        console.error("Failed to fetch connection statuses", err);
      } finally {
        setLoadingConnections(false);
      }
    }
    fetchStatus();
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut({ redirectUrl: "/" });
      toast.success("Signed out successfully.");
    } catch {
      toast.error("Failed to sign out.");
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className="p-7 max-w-5xl mx-auto space-y-6">
      <h1 className="font-display text-[22px] text-espresso font-normal mb-7">Settings</h1>

      <div className="flex flex-col gap-4 max-w-[560px]">
        {/* Card 1: Account */}
        <Card className="bg-cream-100 border-border shadow-card select-none">
          <CardHeader className="pb-2">
            <CardTitle className="font-sans text-[13px] font-medium text-espresso">Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center border-b border-border/50 py-3">
              <span className="font-sans text-[11px] text-espresso-300 uppercase tracking-wide">
                Name
              </span>
              <span className="font-sans text-[13px] text-espresso font-medium">
                {user.name || "Console User"}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-border/50 py-3">
              <span className="font-sans text-[11px] text-espresso-300 uppercase tracking-wide">
                Email
              </span>
              <span className="font-sans text-[13px] text-espresso font-medium">
                {user.email}
              </span>
            </div>
            <div className="pt-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleSignOut}
                disabled={signingOut}
                className="rounded-pill font-sans font-medium px-4"
              >
                {signingOut ? "Signing out..." : "Sign out"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Connected Integrations */}
        <Card className="bg-cream-100 border-border shadow-card select-none">
          <CardHeader className="pb-2">
            <CardTitle className="font-sans text-[13px] font-medium text-espresso">Connected integrations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingConnections ? (
              <div className="flex items-center gap-2 py-3 text-xs text-espresso-300 font-sans">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Checking connectivity status...</span>
              </div>
            ) : (
              <div className="space-y-3 divide-y divide-border/30">
                {/* Gmail integration */}
                <div className="flex justify-between items-center py-2">
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-espresso-400" />
                    <div>
                      <span className="font-sans text-[13px] text-espresso font-medium block">Gmail</span>
                      <span className="font-sans text-[10px] text-espresso-300">Sync priority messages and compose responses</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {connections?.gmail ? (
                      <>
                        <Badge className="bg-sage-soft text-sage-text border-transparent text-[11px] rounded-pill font-sans font-medium px-2.5 py-0.5">
                          Connected
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.location.href = "/api/connect?plugin=gmail"}
                          className="text-[11px] text-espresso-300 hover:text-espresso font-sans font-medium h-7 px-2.5"
                        >
                          Reconnect
                        </Button>
                      </>
                    ) : (
                      <>
                        <Badge className="bg-lavender-soft text-lavender-text border-transparent text-[11px] rounded-pill font-sans font-medium px-2.5 py-0.5">
                          Disconnected
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.location.href = "/api/connect?plugin=gmail"}
                          className="text-[11px] text-peach-text border-peach hover:bg-peach-soft font-sans font-medium h-7 px-3 rounded-pill"
                        >
                          Connect
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Google Calendar integration */}
                <div className="flex justify-between items-center pt-3">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-[#F97316]" />
                    <div>
                      <span className="font-sans text-[13px] text-espresso font-medium block">Google calendar</span>
                      <span className="font-sans text-[10px] text-espresso-300">Synchronize events, schedules, and invitations</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {connections?.calendar ? (
                      <>
                        <Badge className="bg-sage-soft text-sage-text border-transparent text-[11px] rounded-pill font-sans font-medium px-2.5 py-0.5">
                          Connected
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.location.href = "/api/connect?plugin=googlecalendar"}
                          className="text-[11px] text-espresso-300 hover:text-espresso font-sans font-medium h-7 px-2.5"
                        >
                          Reconnect
                        </Button>
                      </>
                    ) : (
                      <>
                        <Badge className="bg-lavender-soft text-lavender-text border-transparent text-[11px] rounded-pill font-sans font-medium px-2.5 py-0.5">
                          Disconnected
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.location.href = "/api/connect?plugin=googlecalendar"}
                          className="text-[11px] text-peach-text border-peach hover:bg-peach-soft font-sans font-medium h-7 px-3 rounded-pill"
                        >
                          Connect
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-border/50 flex items-center justify-between">
              <span className="font-sans text-[10px] text-espresso-300 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-peach-text" />
                Active synchronization powered by CorsAir integration.
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Plan */}
        <Card className="bg-cream-100 border-border shadow-card select-none">
          <CardHeader className="pb-2">
            <CardTitle className="font-sans text-[13px] font-medium text-espresso">Your plan</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between items-center py-2 gap-4">
            <div className="flex-1">
              <p className="font-sans text-[13px] text-espresso font-medium">Free plan</p>
              <p className="font-sans text-[11px] text-espresso-300 leading-normal mt-0.5">
                Upgrade to unlock unlimited AI and Calendar sync.
              </p>
            </div>
            <Button
              onClick={() => setUpgradeOpen(true)}
              className="rounded-pill font-sans font-medium text-[12px] px-4 flex-shrink-0"
            >
              Upgrade to Pro
            </Button>
          </CardContent>
        </Card>
      </div>

      <UpgradeModal open={upgradeOpen} onOpenChange={setUpgradeOpen} />
    </div>
  );
}
export default SettingsPanel;
