/** Dodaje https:// ako URL već nema http:// ili https:// */
export function ensureHttpsUrl(url: string): string {
  const t = url.trim();
  if (!t) return t;
  if (/^https?:\/\//i.test(t)) return t;
  return `https://${t}`;
}
