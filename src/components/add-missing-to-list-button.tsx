"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Check } from "lucide-react";

export function AddMissingToListButton({ missingIngredients }: { missingIngredients: string[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      await Promise.all(
        missingIngredients.map((name) =>
          fetch("/api/shopping-list", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
          })
        )
      );
      setDone(true);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (missingIngredients.length === 0) return null;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading || done}
      className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 disabled:opacity-60"
    >
      {done ? (
        <>
          <Check className="h-3.5 w-3.5" /> Added to list
        </>
      ) : (
        <>
          <ShoppingCart className="h-3.5 w-3.5" /> Add missing to shopping list
        </>
      )}
    </button>
  );
}
