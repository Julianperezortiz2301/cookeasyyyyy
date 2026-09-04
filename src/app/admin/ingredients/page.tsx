import { Apple } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { IngredientForm } from "@/components/admin/ingredient-form";
import { DeleteIngredientButton } from "@/components/admin/delete-ingredient-button";

export default async function AdminIngredientsPage() {
  const ingredients = await prisma.ingredient.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { recipes: true } } },
  });

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
      <div className="rounded-2xl bg-white shadow-card">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="font-semibold text-gray-900">Foods / Ingredients ({ingredients.length})</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {ingredients.map((ingredient) => (
            <div key={ingredient.id} className="flex items-center gap-4 px-6 py-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
                <Apple className="h-4 w-4 text-gray-500" />
              </span>
              <div className="flex-1">
                <p className="font-medium capitalize text-gray-900">{ingredient.name}</p>
                <p className="text-xs text-gray-500">used in {ingredient._count.recipes} recipe(s)</p>
              </div>
              <DeleteIngredientButton ingredientId={ingredient.id} />
            </div>
          ))}
          {ingredients.length === 0 && (
            <p className="px-6 py-8 text-center text-sm text-gray-400">No foods yet. Add one on the right.</p>
          )}
        </div>
      </div>

      <IngredientForm />
    </div>
  );
}
