/**
 * Encodes an email as a base64url-encoded RFC 2822 MIME message,
 * suitable for passing directly to `gmail.api.messages.send({ raw })`.
 */
export function encodeRawEmail({
  to,
  subject,
  body,
  from,
}: {
  to: string;
  subject: string;
  body: string;
  from?: string;
}): string {
  const lines = [
    `To: ${to}`,
    from ? `From: ${from}` : undefined,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    "",
    body,
  ].filter((l): l is string => l !== undefined);

  const message = lines.join("\r\n");

  return Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Recursively walks a Gmail message payload's `parts` to extract text/plain body.
 */
export function extractPlainBody(payload: any): string {
  if (!payload) return "";

  // Direct body data on the payload
  if (payload.mimeType === "text/plain" && payload.body?.data) {
    return Buffer.from(payload.body.data, "base64").toString("utf-8");
  }

  // Walk parts recursively
  if (Array.isArray(payload.parts)) {
    for (const part of payload.parts) {
      const text = extractPlainBody(part);
      if (text) return text;
    }
  }

  return "";
}

/** Extracts a named header value from a Gmail message payload. */
export function getHeader(
  headers: { name?: string; value?: string }[] | undefined,
  name: string
): string {
  if (!headers) return "";
  const lower = name.toLowerCase();
  return headers.find((h) => h.name?.toLowerCase() === lower)?.value ?? "";
}
