"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CategoryIcon } from "@/components/category-icon";
import { CATEGORY_ICONS, CATEGORY_COLORS } from "@/lib/validations";

const SWATCH_CLASSES: Record<string, string> = {
  yellow: "bg-yellow-200",
  orange: "bg-orange-200",
  green: "bg-green-200",
  blue: "bg-blue-200",
  pink: "bg-pink-200",
  purple: "bg-purple-200",
};

export function CategoryForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState<string>(CATEGORY_ICONS[0]);
  const [color, setColor] = useState<string>(CATEGORY_COLORS[0]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, icon, color }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      setName("");
      setLoading(false);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-6 shadow-card">
      <h2 className="font-semibold text-gray-900">Add category</h2>
      {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Breakfast" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Icon</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_ICONS.map((iconName) => (
            <button
              key={iconName}
              type="button"
              onClick={() => setIcon(iconName)}
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                icon === iconName ? "border-primary-600 bg-primary-50" : "border-gray-200"
              }`}
            >
              <CategoryIcon icon={iconName} className="h-4 w-4 text-gray-700" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Color</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              aria-label={c}
              className={`h-8 w-8 rounded-full border-2 ${
                color === c ? "border-gray-900" : "border-transparent"
              } ${SWATCH_CLASSES[c]}`}
            />
          ))}
        </div>
      </div>

      <Button type="submit" disabled={loading || !name.trim()}>
        {loading ? "Adding..." : "Add category"}
      </Button>
    </form>
  );
}
