"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

const DIFFICULTIES = [
  { value: "", label: "Any difficulty" },
  { value: "VERY_EASY", label: "Very Easy" },
  { value: "EASY", label: "Easy" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HARD", label: "Hard" },
];

const MAX_TIMES = [
  { value: "", label: "Any time" },
  { value: "15", label: "Under 15 min" },
  { value: "30", label: "Under 30 min" },
  { value: "60", label: "Under 60 min" },
];

export function RecipeFilters({
  categories,
}: {
  categories: { id: string; name: string; slug: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={searchParams.get("category") ?? ""}
        onChange={(e) => updateParam("category", e.target.value)}
        className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700"
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>

      <select
        value={searchParams.get("difficulty") ?? ""}
        onChange={(e) => updateParam("difficulty", e.target.value)}
        className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700"
      >
        {DIFFICULTIES.map((d) => (
          <option key={d.value} value={d.value}>
            {d.label}
          </option>
        ))}
      </select>

      <select
        value={searchParams.get("maxTime") ?? ""}
        onChange={(e) => updateParam("maxTime", e.target.value)}
        className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700"
      >
        {MAX_TIMES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>
    </div>
  );
}
