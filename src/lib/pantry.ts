export type PantryStatus = "expired" | "expiring-soon" | "fresh" | "no-date";

const EXPIRING_SOON_DAYS = 3;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

// Uses UTC day boundaries (not local time) so this returns the same result
// on the server and in any browser, regardless of time zone — otherwise a
// server render (UTC, on Vercel) and a client render (the visitor's local
// time zone) can disagree and React throws a hydration mismatch.
function utcDayStart(date: Date): number {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

export function getPantryStatus(expiresAt: Date | string | null): PantryStatus {
  if (!expiresAt) return "no-date";

  const expiryDay = utcDayStart(new Date(expiresAt));
  const today = utcDayStart(new Date());

  const diffDays = Math.round((expiryDay - today) / MS_PER_DAY);

  if (diffDays < 0) return "expired";
  if (diffDays <= EXPIRING_SOON_DAYS) return "expiring-soon";
  return "fresh";
}
