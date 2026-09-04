"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  recipeId,
  initialFavorited,
  className,
}: {
  recipeId: string;
  initialFavorited: boolean;
  className?: string;
}) {
  const { status } = useSession();
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isPending, startTransition] = useTransition();

  async function toggleFavorite() {
    if (status !== "authenticated") {
      router.push("/login");
      return;
    }

    const next = !isFavorited;
    setIsFavorited(next);

    startTransition(async () => {
      try {
        if (next) {
          await fetch("/api/favorites", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ recipeId }),
          });
        } else {
          await fetch(`/api/favorites/${recipeId}`, { method: "DELETE" });
        }
        router.refresh();
      } catch {
        setIsFavorited(!next);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      disabled={isPending}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:scale-105 disabled:opacity-70",
        className
      )}
    >
      <Heart
        className={cn("h-[18px] w-[18px]", isFavorited ? "fill-red-500 text-red-500" : "text-gray-500")}
      />
    </button>
  );
}
