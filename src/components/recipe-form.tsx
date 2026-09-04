"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ScanBarcode } from "lucide-react";
import { Input, FieldError } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/image-uploader";
import { BarcodeScanner } from "@/components/barcode-scanner";
import { recipeSchema } from "@/lib/validations";

interface Category {
  id: string;
  name: string;
}

interface IngredientRow {
  name: string;
  quantity: string;
}

interface InitialRecipe {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  cookingTime: number;
  difficulty: string;
  instructions: string;
  categoryId: string;
  ingredients: { ingredient: { name: string }; quantity: string | null }[];
}

const DIFFICULTY_OPTIONS = [
  { value: "VERY_EASY", label: "Very Easy" },
  { value: "EASY", label: "Easy" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HARD", label: "Hard" },
];

export function RecipeForm({
  categories,
  initialRecipe,
}: {
  categories: Category[];
  initialRecipe?: InitialRecipe;
}) {
  const router = useRouter();
  const isEditing = Boolean(initialRecipe);

  const [form, setForm] = useState({
    title: initialRecipe?.title ?? "",
    description: initialRecipe?.description ?? "",
    imageUrl: initialRecipe?.imageUrl ?? "",
    cookingTime: initialRecipe?.cookingTime ?? 30,
    difficulty: initialRecipe?.difficulty ?? "EASY",
    instructions: initialRecipe?.instructions ?? "",
    categoryId: initialRecipe?.categoryId ?? categories[0]?.id ?? "",
  });
  const [ingredients, setIngredients] = useState<IngredientRow[]>(
    initialRecipe?.ingredients.map((ri) => ({
      name: ri.ingredient.name,
      quantity: ri.quantity ?? "",
    })) ?? [{ name: "", quantity: "" }]
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);

  function updateIngredient(index: number, key: keyof IngredientRow, value: string) {
    setIngredients((prev) => prev.map((ing, i) => (i === index ? { ...ing, [key]: value } : ing)));
  }

  function addIngredient() {
    setIngredients((prev) => [...prev, { name: "", quantity: "" }]);
  }

  function removeIngredient(index: number) {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError("");
    setFieldErrors({});

    const payload = {
      ...form,
      cookingTime: Number(form.cookingTime),
      ingredients: ingredients.filter((ing) => ing.name.trim().length > 0),
    };

    const parsed = recipeSchema.safeParse(payload);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        errors[issue.path[0] as string] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const url = isEditing ? `/api/recipes/${initialRecipe!.id}` : "/api/recipes";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      router.push("/my-recipes");
      router.refresh();
    } catch {
      setFormError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl bg-white p-6 shadow-card">
      {formError && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
        <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <FieldError message={fieldErrors.title} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={2}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Photo</label>
        <ImageUploader
          value={form.imageUrl}
          onChange={(url) => setForm({ ...form, imageUrl: url })}
        />
        <p className="mt-2 text-xs text-gray-400">Or paste an image URL:</p>
        <Input
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          placeholder="https://images.unsplash.com/..."
          className="mt-1"
        />
        <FieldError message={fieldErrors.imageUrl} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Cooking time (min)</label>
          <Input
            type="number"
            min={1}
            value={form.cookingTime}
            onChange={(e) => setForm({ ...form, cookingTime: Number(e.target.value) })}
          />
          <FieldError message={fieldErrors.cookingTime} />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Difficulty</label>
          <select
            value={form.difficulty}
            onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          >
            {DIFFICULTY_OPTIONS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <FieldError message={fieldErrors.categoryId} />
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">Ingredients</label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setScannerOpen(true)}
              className="flex items-center gap-1 text-sm font-semibold text-primary-700 hover:underline"
            >
              <ScanBarcode className="h-4 w-4" /> Scan barcode
            </button>
            <button
              type="button"
              onClick={addIngredient}
              className="flex items-center gap-1 text-sm font-semibold text-primary-700 hover:underline"
            >
              <Plus className="h-4 w-4" /> Add ingredient
            </button>
          </div>
        </div>
        <div className="space-y-2">
          {ingredients.map((ing, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={ing.name}
                onChange={(e) => updateIngredient(i, "name", e.target.value)}
                placeholder="e.g. chicken"
                className="flex-1"
              />
              <Input
                value={ing.quantity}
                onChange={(e) => updateIngredient(i, "quantity", e.target.value)}
                placeholder="e.g. 2 units"
                className="w-32"
              />
              <button
                type="button"
                onClick={() => removeIngredient(i)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <FieldError message={fieldErrors.ingredients} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Instructions (one step per line)
        </label>
        <textarea
          value={form.instructions}
          onChange={(e) => setForm({ ...form, instructions: e.target.value })}
          rows={6}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
        <FieldError message={fieldErrors.instructions} />
      </div>

      <Button type="submit" size="lg" disabled={loading}>
        {loading ? "Saving..." : isEditing ? "Save changes" : "Create recipe"}
      </Button>

      {scannerOpen && (
        <BarcodeScanner
          onDetected={(name) => {
            setIngredients((prev) => {
              const emptyIndex = prev.findIndex((ing) => ing.name.trim().length === 0);
              if (emptyIndex >= 0) {
                return prev.map((ing, i) => (i === emptyIndex ? { ...ing, name } : ing));
              }
              return [...prev, { name, quantity: "" }];
            });
            setScannerOpen(false);
          }}
          onClose={() => setScannerOpen(false)}
        />
      )}
    </form>
  );
}
