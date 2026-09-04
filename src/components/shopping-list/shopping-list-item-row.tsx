"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ShoppingListItemRow({
  id,
  name,
  checked,
}: {
  id: string;
  name: string;
  checked: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    try {
      await fetch(`/api/shopping-list/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checked: !checked }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function remove() {
    setLoading(true);
    try {
      await fetch(`/api/shopping-list/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3 px-6 py-3">
      <button
        onClick={toggle}
        disabled={loading}
        aria-label={checked ? "Mark as not bought" : "Mark as bought"}
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
          checked ? "border-primary-600 bg-primary-600 text-white" : "border-gray-300"
        )}
      >
        {checked && "✓"}
      </button>
      <p className={cn("flex-1 text-sm capitalize", checked ? "text-gray-400 line-through" : "text-gray-900")}>
        {name}
      </p>
      <button
        onClick={remove}
        disabled={loading}
        aria-label="Remove item"
        className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
