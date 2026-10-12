const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const indian = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

/** ₹38,00,000 — Indian digit grouping. */
export function inr(amount: number): string {
  return `₹${indian.format(amount)}`;
}

/** ₹38 lakh, ₹4.2 crore — how amounts are said aloud. */
export function inrWords(amount: number): string {
  const trim = (n: number) => String(Math.round(n * 100) / 100);
  if (amount >= 1e7) return `₹${trim(amount / 1e7)} crore`;
  if (amount >= 1e5) return `₹${trim(amount / 1e5)} lakh`;
  return inr(amount);
}

/** "2026-09-22" → "22 Sep 2026". Parsed by hand so server and browser agree. */
export function day(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${String(d).padStart(2, "0")} ${MONTHS[m - 1]} ${y}`;
}

/** "22 Sep" — for dates in the current year. */
export function dayShort(iso: string): string {
  const [, m, d] = iso.split("-").map(Number);
  return `${String(d).padStart(2, "0")} ${MONTHS[m - 1]}`;
}

/** Today in India, as YYYY-MM-DD. Call from the browser only. */
export function today(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
}

export function daysSince(iso: string, now: string): number {
  const ms = Date.parse(`${now}T00:00:00Z`) - Date.parse(`${iso}T00:00:00Z`);
  return Math.max(0, Math.round(ms / 86_400_000));
}

export function fileSize(kb: number): string {
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
}
