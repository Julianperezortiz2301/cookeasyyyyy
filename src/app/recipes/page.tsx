import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { searchRecipesByIngredients, getFavoriteRecipeIds } from "@/lib/recipes";
import { RecipeCard } from "@/components/recipe-card";
import { RecipeFilters } from "@/components/recipe-filters";
import { EmptySearchState } from "@/components/empty-search-state";

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: { ingredients?: string; category?: string; difficulty?: string; maxTime?: string };
}) {
  const ingredientsQuery = searchParams.ingredients ?? "";
  const ingredients = ingredientsQuery
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const [session, categories, recipes] = await Promise.all([
    getServerSession(authOptions),
    prisma.category.findMany(),
    searchRecipesByIngredients(ingredients, {
      categorySlug: searchParams.category,
      difficulty: searchParams.difficulty,
      maxTime: searchParams.maxTime ? Number(searchParams.maxTime) : undefined,
    }),
  ]);

  const favoriteIds = session?.user?.id
    ? await getFavoriteRecipeIds(session.user.id)
    : new Set<string>();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
        {ingredients.length > 0 ? "Recipes matching your ingredients" : "All recipes"}
      </h1>
      {ingredients.length > 0 && (
        <p className="mt-1 text-sm text-gray-500">
          Searching for: {ingredients.join(", ")}
        </p>
      )}

      <div className="mt-6">
        <RecipeFilters categories={categories} />
      </div>

      <div className="mt-8">
        {recipes.length === 0 ? (
          <EmptySearchState />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} isFavorited={favoriteIds.has(recipe.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
