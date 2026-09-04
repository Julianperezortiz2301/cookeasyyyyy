import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  value,
  count,
  size = "sm",
}: {
  value: number;
  count?: number;
  size?: "sm" | "md";
}) {
  const starSize = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5";

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => {
          const fillPercent = Math.max(0, Math.min(1, value - (star - 1))) * 100;
          return (
            <span key={star} className="relative">
              <Star className={cn(starSize, "text-gray-200")} fill="currentColor" />
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fillPercent}%` }}
              >
                <Star className={cn(starSize, "text-yellow-400")} fill="currentColor" />
              </span>
            </span>
          );
        })}
      </div>
      {typeof count === "number" && (
        <span className="text-xs text-gray-500">
          {value.toFixed(1)} ({count})
        </span>
      )}
    </div>
  );
}
