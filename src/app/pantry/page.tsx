import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { ChefHat } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPantryStatus } from "@/lib/pantry";
import { getRecipeSuggestionsFromPantry, getFavoriteRecipeIds } from "@/lib/recipes";
import { PantryForm } from "@/components/pantry/pantry-form";
import { PantryItemRow } from "@/components/pantry/pantry-item-row";
import { RecipeCard } from "@/components/recipe-card";
import { AddMissingToListButton } from "@/components/add-missing-to-list-button";

const STATUS_ORDER = { expired: 0, "expiring-soon": 1, fresh: 2, "no-date": 3 };

export default async function PantryPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/pantry");
  }

  const [pantryItems, favoriteIds] = await Promise.all([
    prisma.pantryItem.findMany({
      where: { userId: session.user.id },
      include: { ingredient: true },
    }),
    getFavoriteRecipeIds(session.user.id),
  ]);

  const sortedItems = [...pantryItems].sort((a, b) => {
    const statusA = STATUS_ORDER[getPantryStatus(a.expiresAt)];
    const statusB = STATUS_ORDER[getPantryStatus(b.expiresAt)];
    return statusA - statusB || a.ingredient.name.localeCompare(b.ingredient.name);
  });

  const expiringNames = pantryItems
    .filter((item) => {
      const status = getPantryStatus(item.expiresAt);
      return status === "expired" || status === "expiring-soon";
    })
    .map((item) => item.ingredient.name);

  const allNames = pantryItems.map((item) => item.ingredient.name);

  const [expiringSuggestions, allSuggestions] = await Promise.all([
    expiringNames.length > 0 ? getRecipeSuggestionsFromPantry(expiringNames) : Promise.resolve([]),
    allNames.length > 0 ? getRecipeSuggestionsFromPantry(allNames) : Promise.resolve([]),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">My Pantry</h1>
      <p className="mt-1 text-sm text-gray-500">
        Track what you have at home and never let food go to waste.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl bg-white shadow-card">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="font-semibold text-gray-900">Items ({pantryItems.length})</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {sortedItems.map((item) => (
              <PantryItemRow
                key={item.id}
                id={item.id}
                name={item.ingredient.name}
                quantity={item.quantity}
                expiresAt={item.expiresAt ? item.expiresAt.toISOString() : null}
              />
            ))}
            {pantryItems.length === 0 && (
              <p className="px-6 py-10 text-center text-sm text-gray-400">
                Your pantry is empty. Scan or add your first item.
              </p>
            )}
          </div>
        </div>

        <PantryForm />
      </div>

      {expiringSuggestions.length > 0 && (
        <section className="mt-12">
          <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <ChefHat className="h-5 w-5 text-orange-500" /> Cook these before they expire
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Recipes that use the ingredients you&apos;re about to lose.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {expiringSuggestions.slice(0, 4).map(({ recipe, missingIngredients }) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isFavorited={favoriteIds.has(recipe.id)}
                footer={
                  missingIngredients.length > 0 ? (
                    <div>
                      <p className="mt-1 text-xs text-gray-400">
                        Missing: {missingIngredients.join(", ")}
                      </p>
                      <AddMissingToListButton missingIngredients={missingIngredients} />
                    </div>
                  ) : (
                    <p className="mt-1 text-xs font-semibold text-primary-700">
                      You have everything!
                    </p>
                  )
                }
              />
            ))}
          </div>
        </section>
      )}

      {allSuggestions.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-gray-900">Recipes you can make</h2>
          <p className="mt-1 text-sm text-gray-500">
            Based on everything in your pantry — including what you&apos;re still missing.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {allSuggestions.slice(0, 8).map(({ recipe, missingIngredients }) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isFavorited={favoriteIds.has(recipe.id)}
                footer={
                  missingIngredients.length > 0 ? (
                    <div>
                      <p className="mt-1 text-xs text-gray-400">
                        Missing: {missingIngredients.join(", ")}
                      </p>
                      <AddMissingToListButton missingIngredients={missingIngredients} />
                    </div>
                  ) : (
                    <p className="mt-1 text-xs font-semibold text-primary-700">
                      You have everything!
                    </p>
                  )
                }
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
