import { corsair } from "@/src/server/corsair";
import { encodeRawEmail, extractPlainBody } from "@/src/server/lib/email";

type Tenant = ReturnType<typeof corsair.withTenant>;

function simplifyMessage(m: any) {
  const d = m.data ?? {};
  // Truncate snippet to 80 characters to save context window tokens
  const snippet = d.snippet ?? m.snippet ?? "";
  const cleanSnippet = snippet.length > 80 ? snippet.slice(0, 80) + "..." : snippet;
  return {
    id: m.entity_id ?? m.entityId ?? m.id ?? d.id,
    from: d.from ?? m.from ?? "",
    subject: d.subject ?? m.subject ?? "(no subject)",
    snippet: cleanSnippet,
    date: d.internalDate ?? d.date ?? m.internalDate ?? m.date ?? null,
    unread: Array.isArray(d.labelIds) && d.labelIds.includes("UNREAD"),
  };
}

export const toolDefinitions = [
  {
    type: "function" as const,
    function: {
      name: "list_recent_emails",
      description: "Get the most recent emails, optionally filtered to unread only.",
      parameters: {
        type: "object",
        properties: {
          limit: { type: "number", description: "Max emails to return (default 10)" },
          unread_only: { type: "boolean", description: "Only return unread emails" },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "search_emails",
      description: "Search emails by sender, subject, or snippet keywords.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Search term, e.g. 'Amazon' or 'invoice'" },
          limit: { type: "number" },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "get_email_body",
      description: "Get the full plain-text body of a specific email by id.",
      parameters: {
        type: "object",
        properties: { id: { type: "string" } },
        required: ["id"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "send_email",
      description: "Send a new email. Only call after the user has confirmed the draft.",
      parameters: {
        type: "object",
        properties: {
          to: { type: "string" },
          subject: { type: "string" },
          body: { type: "string" },
        },
        required: ["to", "subject", "body"],
      },
    },
  },
];

export const toolImplementations: Record<
  string,
  (tenant: Tenant, args: any) => Promise<any>
> = {
  list_recent_emails: async (tenant, { limit = 5, unread_only = false }) => {
    // List returns all cached messages from DB
    const result = await tenant.gmail.db.messages.list({ limit: unread_only ? 200 : limit });
    let items = result as any[];
    if (unread_only) {
      items = items.filter((m) => {
        const d = m.data ?? {};
        return d.labelIds?.includes("UNREAD") || m.labelIds?.includes("UNREAD");
      });
    }
    const cap = Math.min(limit, 8);
    return items.slice(0, cap).map(simplifyMessage);
  },

  search_emails: async (tenant, { query, limit = 5 }) => {
    const result = await tenant.gmail.db.messages.list({ limit: 200 });
    const items = result as any[];
    const q = String(query).toLowerCase();
    const filtered = items.filter((m) => {
      const d = m.data ?? {};
      const haystack = `${d.from ?? m.from ?? ""} ${d.subject ?? m.subject ?? ""} ${d.snippet ?? m.snippet ?? ""}`.toLowerCase();
      return haystack.includes(q);
    });
    const cap = Math.min(limit, 8);
    return filtered.slice(0, cap).map(simplifyMessage);
  },

  get_email_body: async (tenant, { id }) => {
    let msg: any = await tenant.gmail.db.messages.findByEntityId(id).catch(() => null);
    if (!msg?.data?.payload) {
      const liveData = await tenant.gmail.api.messages.get({ id, format: "full" });
      msg = { data: liveData };
    }
    const fullBody = extractPlainBody(msg.data);
    // Truncate email body to 1200 characters to prevent token limit exhaustion
    const truncatedBody = fullBody.length > 1200 
      ? fullBody.slice(0, 1200) + "\n... [body truncated to save tokens] ..."
      : fullBody;
    return { id, body: truncatedBody };
  },

  send_email: async (tenant, { to, subject, body }) => {
    const raw = encodeRawEmail({ to, subject, body });
    await tenant.gmail.api.messages.send({ raw });
    return { success: true, to, subject };
  },
};
