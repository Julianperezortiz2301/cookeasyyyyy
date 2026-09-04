export type PantryStatus = "expired" | "expiring-soon" | "fresh" | "no-date";

const EXPIRING_SOON_DAYS = 3;

export function getPantryStatus(expiresAt: Date | string | null): PantryStatus {
  if (!expiresAt) return "no-date";

  const expiryDate = new Date(expiresAt);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  expiryDate.setHours(0, 0, 0, 0);

  const diffDays = Math.round((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "expired";
  if (diffDays <= EXPIRING_SOON_DAYS) return "expiring-soon";
  return "fresh";
}
