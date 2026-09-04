import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { Clock, Check } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { normalizeIngredient } from "@/lib/ingredients";
import { DifficultyBadge } from "@/components/ui/difficulty-badge";
import { FavoriteButton } from "@/components/favorite-button";
import { RecipeCard } from "@/components/recipe-card";
import { StarRating } from "@/components/ui/star-rating";
import { RatingForm } from "@/components/rating-form";

export default async function RecipeDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { ingredients?: string };
}) {
  const recipe = await prisma.recipe.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      ingredients: { include: { ingredient: true } },
    },
  });

  if (!recipe) {
    notFound();
  }

  const session = await getServerSession(authOptions);

  const userIngredients = (searchParams.ingredients ?? "")
    .split(",")
    .map((s) => normalizeIngredient(s))
    .filter(Boolean);

  const isFavorited = session?.user?.id
    ? Boolean(
        await prisma.favorite.findUnique({
          where: { userId_recipeId: { userId: session.user.id, recipeId: recipe.id } },
        })
      )
    : false;

  const relatedRecipes = await prisma.recipe.findMany({
    where: { categoryId: recipe.categoryId, id: { not: recipe.id } },
    take: 4,
    include: { category: { select: { name: true, slug: true } } },
  });

  const ratings = await prisma.rating.findMany({
    where: { recipeId: recipe.id },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true } } },
  });
  const avgRating =
    ratings.length > 0 ? Math.round((ratings.reduce((a, r) => a + r.value, 0) / ratings.length) * 10) / 10 : 0;
  const myRating = session?.user?.id ? ratings.find((r) => r.userId === session.user.id) : undefined;
  const otherRatings = ratings.filter((r) => r.comment && r.userId !== session?.user?.id);

  const steps = recipe.instructions.split("\n").map((s) => s.trim()).filter(Boolean);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="relative h-72 w-full overflow-hidden rounded-3xl sm:h-96">
        <Image src={recipe.imageUrl} alt={recipe.title} fill className="object-cover" priority />
        <FavoriteButton
          recipeId={recipe.id}
          initialFavorited={isFavorited}
          className="absolute right-4 top-4"
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link
          href={`/categories/${recipe.category.slug}`}
          className="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700"
        >
          {recipe.category.name}
        </Link>
        <DifficultyBadge difficulty={recipe.difficulty} />
        <span className="flex items-center gap-1 text-sm text-gray-500">
          <Clock className="h-4 w-4" /> {recipe.cookingTime} min
        </span>
      </div>

      <h1 className="mt-3 text-3xl font-bold text-gray-900">{recipe.title}</h1>
      {ratings.length > 0 && (
        <div className="mt-2">
          <StarRating value={avgRating} count={ratings.length} size="md" />
        </div>
      )}
      {recipe.description && <p className="mt-2 text-gray-600">{recipe.description}</p>}

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Ingredients</h2>
          <ul className="mt-4 space-y-2">
            {recipe.ingredients.map((ri) => {
              const hasIt =
                userIngredients.length > 0 &&
                userIngredients.some((needle) => {
                  const name = normalizeIngredient(ri.ingredient.name);
                  return name.includes(needle) || needle.includes(name);
                });
              return (
                <li
                  key={ri.id}
                  className={`flex items-center gap-2 text-sm ${
                    hasIt ? "text-primary-700" : "text-gray-600"
                  }`}
                >
                  {hasIt ? (
                    <Check className="h-4 w-4 shrink-0 text-primary-600" />
                  ) : (
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300" />
                  )}
                  <span>
                    {ri.ingredient.name}
                    {ri.quantity ? ` — ${ri.quantity}` : ""}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900">Instructions</h2>
          <ol className="mt-4 space-y-4">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-gray-700">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {session?.user?.id ? (
          <RatingForm
            recipeId={recipe.id}
            initialValue={myRating?.value ?? 0}
            initialComment={myRating?.comment ?? ""}
          />
        ) : (
          <div className="rounded-2xl bg-gray-50 p-6 text-sm text-gray-600">
            <Link href="/login" className="font-semibold text-primary-700 hover:underline">
              Log in
            </Link>{" "}
            to rate this recipe.
          </div>
        )}

        {otherRatings.length > 0 && (
          <div className="space-y-4 lg:col-span-2">
            <h3 className="font-semibold text-gray-900">What people are saying</h3>
            {otherRatings.map((r) => (
              <div key={r.id} className="rounded-2xl bg-white p-4 shadow-card">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">{r.user.name}</span>
                  <StarRating value={r.value} />
                </div>
                {r.comment && <p className="mt-2 text-sm text-gray-600">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {relatedRecipes.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 text-xl font-bold text-gray-900">Related recipes</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedRecipes.map((r) => (
              <RecipeCard
                key={r.id}
                recipe={{
                  id: r.id,
                  title: r.title,
                  imageUrl: r.imageUrl,
                  cookingTime: r.cookingTime,
                  difficulty: r.difficulty,
                  category: r.category,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
