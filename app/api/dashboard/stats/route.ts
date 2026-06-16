import { NextRequest, NextResponse } from "next/server";
import { getTenant } from "@/src/server/lib/tenant";
import { getCurrentUser } from "@/src/actions/auth";
import prisma from "@/src/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let unreadCount = 0;
    let sentCount = 0;
    let nextEvent = null;
    let eventsTodayCount = 0;

    // Check integration & account config in a single consolidated query
    const connectedAccounts = await prisma.corsairAccount.findMany({
      where: {
        tenantId: user.id,
        integration: {
          name: { in: ["gmail", "googlecalendar"] }
        }
      },
      include: {
        integration: true
      }
    });

    const gmailAcc = connectedAccounts.find(acc => acc.integration.name === "gmail");
    const calAcc = connectedAccounts.find(acc => acc.integration.name === "googlecalendar");

    const tenant = await getTenant().catch(() => null);

    if (tenant) {
      const promises: Promise<any>[] = [];

      // Fetch Gmail messages if connected
      if (gmailAcc) {
        promises.push(
          tenant.gmail.db.messages.search({ limit: 150 } as any)
            .then((res: any[]) => {
              // Deduplicate by entity_id
              const seen = new Map<string, any>();
              for (const msg of res) {
                const key = msg.entity_id ?? msg.id;
                if (!key) continue;
                const existing = seen.get(key);
                if (!existing || new Date(msg.updatedAt) > new Date(existing.updatedAt)) {
                  seen.set(key, msg);
                }
              }

              const deduped = Array.from(seen.values());
              unreadCount = deduped.filter((m: any) => {
                const labels = m.data?.labelIds ?? m.labelIds ?? [];
                return labels.includes("UNREAD");
              }).length;

              const startOfToday = new Date();
              startOfToday.setHours(0, 0, 0, 0);

              sentCount = deduped.filter((m: any) => {
                const labels = m.data?.labelIds ?? m.labelIds ?? [];
                if (!labels.includes("SENT")) return false;
                const date = new Date(m.updatedAt ?? m.createdAt);
                return date >= startOfToday;
              }).length;
            })
            .catch((e) => console.error("Dashboard stats Gmail fetch error:", e))
        );
      }

      // Fetch Calendar events if connected
      if (calAcc) {
        promises.push(
          tenant.googlecalendar.db.events.search({ data: {}, limit: 150 })
            .then((res: any[]) => {
              const seen = new Map<string, any>();
              for (const ev of res) {
                const key = ev.entity_id ?? ev.id;
                if (!key) continue;
                const existing = seen.get(key);
                if (!existing || new Date(ev.updatedAt) > new Date(existing.updatedAt)) {
                  seen.set(key, ev);
                }
              }

              const events = Array.from(seen.values()).map((ev) => {
                const d = ev.data ?? {};
                return {
                  summary: d.summary ?? ev.summary ?? "(no title)",
                  start: d.start ?? ev.start ?? null,
                  end: d.end ?? ev.end ?? null,
                };
              });

              // Filter for events scheduled today
              const startOfToday = new Date();
              startOfToday.setHours(0, 0, 0, 0);
              const endOfToday = new Date();
              endOfToday.setHours(23, 59, 59, 999);

              eventsTodayCount = events.filter((ev) => {
                const startTimeStr = ev.start?.dateTime ?? ev.start?.date;
                if (!startTimeStr) return false;
                const startTime = new Date(startTimeStr).getTime();
                return startTime >= startOfToday.getTime() && startTime <= endOfToday.getTime();
              }).length;

              // Find next upcoming future event
              const now = new Date().getTime();
              const futureEvents = events
                .filter((ev) => {
                  const startTimeStr = ev.start?.dateTime ?? ev.start?.date;
                  if (!startTimeStr) return false;
                  return new Date(startTimeStr).getTime() > now;
                })
                .sort((a, b) => {
                  const aTime = new Date(a.start?.dateTime ?? a.start?.date ?? "").getTime();
                  const bTime = new Date(b.start?.dateTime ?? b.start?.date ?? "").getTime();
                  return aTime - bTime;
                });

              if (futureEvents.length > 0) {
                nextEvent = futureEvents[0] as any;
              }
            })
            .catch((e) => console.error("Dashboard stats Calendar fetch error:", e))
        );
      }

      await Promise.all(promises);
    }

    return NextResponse.json({
      unreadCount,
      sentCount,
      eventsTodayCount,
      nextEvent,
      gmailConnected: !!gmailAcc,
      calendarConnected: !!calAcc,
    });
  } catch (err: any) {
    console.error("[/api/dashboard/stats GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
