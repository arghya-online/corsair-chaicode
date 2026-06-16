export function formatEmailDate(dateMs: number | string | Date): string {
  const date = dateMs instanceof Date 
    ? dateMs 
    : new Date(typeof dateMs === 'string' ? (isNaN(Number(dateMs)) ? Date.parse(dateMs) : Number(dateMs)) : dateMs);
  if (isNaN(date.getTime())) return "";
  const now = new Date();
  
  // Calculate difference in calendar days
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const startOfNow = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const diffDays = Math.floor((startOfNow - startOfDate) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }
  if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: 'short' });
  }
  return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
}

export function extractPlainText(messageData: any): string {
  const parts = messageData?.payload?.parts ?? (messageData?.payload ? [messageData.payload] : []);
  for (const part of parts) {
    if (part.mimeType === 'text/plain' && part.body?.data) {
      return Buffer.from(part.body.data, 'base64').toString('utf-8');
    }
    if (part.parts) {
      const nested = extractPlainText({ payload: { parts: part.parts } });
      if (nested) return nested;
    }
  }
  return messageData?.snippet ?? messageData?.body ?? '';
}
