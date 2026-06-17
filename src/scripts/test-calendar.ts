// Quick diagnostic — run with: npx tsx src/scripts/test-calendar.ts
import "dotenv/config";
import { createCorsair } from "corsair";
import { googlecalendar } from "@corsair-dev/googlecalendar";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const corsair = createCorsair({
  plugins: [googlecalendar()],
  database: pool,
  kek: process.env.CORSAIR_KEK!,
  multiTenancy: true,
});

async function main() {
  console.log("\n=== Google Calendar Diagnostic ===\n");

  // ── Step 1: Find the first user with a googlecalendar account ──────────────
  const client = await pool.connect();
  let tenantId: string | null = null;

  try {
    const intRes = await client.query(
      `SELECT id FROM corsair_integrations WHERE name = 'googlecalendar' LIMIT 1`,
    );
    if (intRes.rows.length === 0) {
      console.error(
        "❌ No 'googlecalendar' integration found in corsair_integrations table.",
      );
      console.log(
        "   → Run: pnpm corsair setup --plugin=googlecalendar client_id=... client_secret=...",
      );
      return;
    }
    const integrationId = intRes.rows[0].id;
    console.log(`✅ googlecalendar integration found: ${integrationId}`);

    const accRes = await client.query(
      `SELECT tenant_id FROM corsair_accounts WHERE integration_id = $1 LIMIT 5`,
      [integrationId],
    );
    if (accRes.rows.length === 0) {
      console.error(
        "❌ No accounts found for googlecalendar. OAuth not completed.",
      );
      console.log("   → Run: pnpm corsair auth --plugin=googlecalendar");
      console.log(
        "   → OR: go to the Calendar tab in the app and click 'Authorize Google Calendar'",
      );
      return;
    }
    tenantId = accRes.rows[0].tenant_id;
    console.log(
      `✅ Found ${accRes.rows.length} authorized account(s). Testing tenant: ${tenantId}`,
    );
  } finally {
    client.release();
  }

  if (!tenantId) return;

  const tenant = corsair.withTenant(tenantId);

  // ── Step 2: Try listing events ─────────────────────────────────────────────
  console.log("\n--- Test 1: List upcoming events ---");
  try {
    const now = new Date();
    const future = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const result = await tenant.googlecalendar.api.events.getMany({
      calendarId: "primary",
      timeMin: now.toISOString(),
      timeMax: future.toISOString(),
      singleEvents: true,
      maxResults: 5,
    });
    const items = (result as any)?.items ?? [];
    console.log(`✅ getMany succeeded — ${items.length} events found`);
    if (items.length > 0) {
      console.log(
        `   First event: "${items[0].summary}" at ${items[0].start?.dateTime ?? items[0].start?.date}`,
      );
    }
  } catch (err: unknown) {
    console.error("❌ getMany failed:", err.message);
    console.error("   Full error:", JSON.stringify(err, null, 2));
  }

  // ── Step 3: Try creating a test event ─────────────────────────────────────
  console.log("\n--- Test 2: Create test event ---");
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);
  const end = new Date(tomorrow.getTime() + 60 * 60 * 1000);

  try {
    const startIso = "2026-06-17T09:00:00+05:30";
    const endIso = new Date(
      new Date(startIso).getTime() + 60 * 60 * 1000,
    ).toISOString();
    console.log(`   Simulating tool input: start=${startIso}, end=${endIso}`);
    const result = await tenant.googlecalendar.api.events.create({
      calendarId: "primary",
      event: {
        summary: "🧪 Zentra Test Event Fixed Offset",
        description: "Diagnostic test event — safe to delete",
        start: { dateTime: startIso },
        end: { dateTime: endIso },
      },
    });
    const created = result as any;
    console.log(`✅ Event created successfully!`);
    console.log(`   ID: ${created.id}`);
    console.log(`   Link: ${created.htmlLink}`);

    // ── Step 4: Clean up — delete the test event ───────────────────────────
    if (created.id) {
      console.log("\n--- Test 3: Delete test event ---");
      try {
        await tenant.googlecalendar.api.events.delete({
          id: created.id,
          calendarId: "primary",
        });
        console.log("✅ Test event deleted successfully");
      } catch (delErr: any) {
        console.error("❌ Delete failed:", delErr.message);
      }
    }
  } catch (err: unknown) {
    console.error(
      "❌ CREATE FAILED — this is the root cause of the agent error:",
    );
    console.error("   Message:", err.message);
    console.error("   Full error:", JSON.stringify(err, null, 2));
  }

  await pool.end();
  console.log("\n=== Diagnostic complete ===");
}

main().catch(console.error);
