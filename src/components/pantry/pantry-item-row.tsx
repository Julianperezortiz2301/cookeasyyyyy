"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, AlertTriangle, Clock } from "lucide-react";
import { getPantryStatus } from "@/lib/pantry";

const STATUS_STYLES: Record<string, string> = {
  expired: "bg-red-100 text-red-700",
  "expiring-soon": "bg-orange-100 text-orange-700",
  fresh: "bg-primary-100 text-primary-700",
  "no-date": "bg-gray-100 text-gray-500",
};

const STATUS_LABELS: Record<string, string> = {
  expired: "Expired",
  "expiring-soon": "Expiring soon",
  fresh: "Fresh",
  "no-date": "No date set",
};

export function PantryItemRow({
  id,
  name,
  quantity,
  expiresAt,
}: {
  id: string;
  name: string;
  quantity: string | null;
  expiresAt: string | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dateValue, setDateValue] = useState(expiresAt ? expiresAt.slice(0, 10) : "");
  const status = getPantryStatus(dateValue ? new Date(dateValue) : null);

  async function updateExpiration(value: string) {
    setDateValue(value);
    setLoading(true);
    try {
      await fetch(`/api/pantry/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity, expiresAt: value || undefined }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setLoading(true);
    try {
      await fetch(`/api/pantry/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3 px-6 py-3">
      <div className="min-w-[140px] flex-1">
        <p className="font-medium capitalize text-gray-900">{name}</p>
        {quantity && <p className="text-xs text-gray-500">{quantity}</p>}
      </div>

      <span
        className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[status]}`}
      >
        {status === "expired" && <AlertTriangle className="h-3 w-3" />}
        {status === "expiring-soon" && <Clock className="h-3 w-3" />}
        {STATUS_LABELS[status]}
      </span>

      <input
        type="date"
        value={dateValue}
        onChange={(e) => updateExpiration(e.target.value)}
        disabled={loading}
        aria-label="Expiration date"
        className="rounded-lg border border-gray-300 px-2 py-1.5 text-xs text-gray-700 outline-none focus:border-primary-500"
      />

      <button
        onClick={handleDelete}
        disabled={loading}
        aria-label="Remove from pantry"
        className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
