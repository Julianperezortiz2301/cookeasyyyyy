import { prisma } from "@/lib/prisma";
import { normalizeIngredient } from "@/lib/ingredients";
import type { RecipeCardData } from "@/lib/types";

const recipeWithRelations = {
  category: { select: { name: true, slug: true } },
  ingredients: { include: { ingredient: true } },
  ratings: { select: { value: true } },
} as const;

function ratingStats(ratings: { value: number }[]) {
  if (ratings.length === 0) return { avgRating: undefined, ratingCount: 0 };
  const sum = ratings.reduce((acc, r) => acc + r.value, 0);
  return { avgRating: Math.round((sum / ratings.length) * 10) / 10, ratingCount: ratings.length };
}

export interface RecipeFilters {
  categorySlug?: string;
  difficulty?: string;
  maxTime?: number;
}

export async function getPopularRecipes(limit = 4): Promise<RecipeCardData[]> {
  const recipes = await prisma.recipe.findMany({
    take: limit,
    orderBy: { createdAt: "asc" },
    include: recipeWithRelations,
  });

  return recipes.map((r) => ({
    id: r.id,
    title: r.title,
    imageUrl: r.imageUrl,
    cookingTime: r.cookingTime,
    difficulty: r.difficulty,
    category: r.category,
    ...ratingStats(r.ratings),
  }));
}

export async function searchRecipesByIngredients(
  ingredients: string[],
  filters: RecipeFilters = {}
): Promise<RecipeCardData[]> {
  const normalized = ingredients.map(normalizeIngredient).filter(Boolean);

  const recipes = await prisma.recipe.findMany({
    where: {
      ...(filters.categorySlug ? { category: { slug: filters.categorySlug } } : {}),
      ...(filters.difficulty ? { difficulty: filters.difficulty as never } : {}),
      ...(filters.maxTime ? { cookingTime: { lte: filters.maxTime } } : {}),
    },
    include: recipeWithRelations,
  });

  const scored = recipes.map((recipe) => {
    const recipeIngredientNames = recipe.ingredients.map((ri) =>
      normalizeIngredient(ri.ingredient.name)
    );

    const matches = normalized.filter((needle) =>
      recipeIngredientNames.some((name) => name.includes(needle) || needle.includes(name))
    );

    const matchPercent =
      recipeIngredientNames.length > 0
        ? Math.round((matches.length / recipeIngredientNames.length) * 100)
        : 0;

    return {
      recipe,
      matchCount: matches.length,
      matchPercent,
    };
  });

  const filtered =
    normalized.length > 0 ? scored.filter((s) => s.matchCount > 0) : scored;

  filtered.sort((a, b) => b.matchCount - a.matchCount || b.matchPercent - a.matchPercent);

  return filtered.map(({ recipe, matchPercent }) => ({
    id: recipe.id,
    title: recipe.title,
    imageUrl: recipe.imageUrl,
    cookingTime: recipe.cookingTime,
    difficulty: recipe.difficulty,
    category: recipe.category,
    matchPercent: normalized.length > 0 ? matchPercent : undefined,
    ...ratingStats(recipe.ratings),
  }));
}

export interface PantrySuggestion {
  recipe: RecipeCardData;
  missingIngredients: string[];
}

export async function getRecipeSuggestionsFromPantry(
  pantryIngredientNames: string[]
): Promise<PantrySuggestion[]> {
  const normalizedPantry = pantryIngredientNames.map(normalizeIngredient).filter(Boolean);
  if (normalizedPantry.length === 0) return [];

  const recipes = await prisma.recipe.findMany({ include: recipeWithRelations });

  const scored = recipes
    .map((recipe) => {
      const recipeIngredients = recipe.ingredients.map((ri) => ({
        original: ri.ingredient.name,
        normalized: normalizeIngredient(ri.ingredient.name),
      }));

      const missing = recipeIngredients.filter(
        (ing) => !normalizedPantry.some((have) => ing.normalized.includes(have) || have.includes(ing.normalized))
      );

      const matchCount = recipeIngredients.length - missing.length;

      return { recipe, matchCount, missing: missing.map((m) => m.original) };
    })
    .filter((s) => s.matchCount > 0)
    .sort((a, b) => b.matchCount - a.matchCount || a.missing.length - b.missing.length);

  return scored.map(({ recipe, missing }) => ({
    recipe: {
      id: recipe.id,
      title: recipe.title,
      imageUrl: recipe.imageUrl,
      cookingTime: recipe.cookingTime,
      difficulty: recipe.difficulty,
      category: recipe.category,
      ...ratingStats(recipe.ratings),
    },
    missingIngredients: missing,
  }));
}

export async function getFavoriteRecipeIds(userId: string): Promise<Set<string>> {
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    select: { recipeId: true },
  });
  return new Set(favorites.map((f) => f.recipeId));
}
