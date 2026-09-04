import { formatDifficulty } from "@/lib/utils";

export function DifficultyBadge({ difficulty }: { difficulty: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-primary-100 px-2.5 py-1 text-xs font-semibold text-primary-700">
      {formatDifficulty(difficulty)}
    </span>
  );
}
