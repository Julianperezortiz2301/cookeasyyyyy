import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Clock } from "lucide-react";
import { DifficultyBadge } from "@/components/ui/difficulty-badge";
import { FavoriteButton } from "@/components/favorite-button";
import { StarRating } from "@/components/ui/star-rating";
import type { RecipeCardData } from "@/lib/types";

export function RecipeCard({
  recipe,
  isFavorited = false,
  footer,
}: {
  recipe: RecipeCardData;
  isFavorited?: boolean;
  footer?: ReactNode;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-lg">
      <Link href={`/recipes/${recipe.id}`} className="block">
        <div className="relative h-44 w-full bg-gray-100">
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover"
          />
        </div>
      </Link>
      <FavoriteButton
        recipeId={recipe.id}
        initialFavorited={isFavorited}
        className="absolute right-3 top-3"
      />
      {typeof recipe.matchPercent === "number" && (
        <span className="absolute left-3 top-3 rounded-full bg-primary-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
          {recipe.matchPercent}% match
        </span>
      )}
      <div className="space-y-2 p-4">
        <Link href={`/recipes/${recipe.id}`}>
          <h3 className="line-clamp-2 font-semibold text-gray-900 hover:text-primary-700">
            {recipe.title}
          </h3>
        </Link>
        {typeof recipe.avgRating === "number" && (
          <StarRating value={recipe.avgRating} count={recipe.ratingCount} />
        )}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {recipe.cookingTime} min
          </span>
          <DifficultyBadge difficulty={recipe.difficulty} />
        </div>
        {footer}
      </div>
    </div>
  );
}
