"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function RatingForm({
  recipeId,
  initialValue = 0,
  initialComment = "",
}: {
  recipeId: string;
  initialValue?: number;
  initialComment?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState(initialComment);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function handleSubmit() {
    if (value < 1) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId, value, comment: comment || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      setSaved(true);
      setLoading(false);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-card">
      <h3 className="font-semibold text-gray-900">
        {initialValue > 0 ? "Update your rating" : "Rate this recipe"}
      </h3>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {saved && <p className="mt-2 text-sm text-primary-700">Thanks for your feedback!</p>}

      <div className="mt-3 flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setValue(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
          >
            <Star
              className={cn(
                "h-7 w-7",
                (hovered || value) >= star ? "text-yellow-400" : "text-gray-200"
              )}
              fill="currentColor"
            />
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={2}
        placeholder="Share a tip or how it went (optional)"
        className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
      />

      <Button size="sm" className="mt-3" disabled={loading || value < 1} onClick={handleSubmit}>
        {loading ? "Saving..." : "Submit rating"}
      </Button>
    </div>
  );
}
