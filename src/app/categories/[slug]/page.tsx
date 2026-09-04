import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getFavoriteRecipeIds } from "@/lib/recipes";
import { RecipeCard } from "@/components/recipe-card";
import { EmptySearchState } from "@/components/empty-search-state";

export default async function CategoryDetailPage({ params }: { params: { slug: string } }) {
  const category = await prisma.category.findUnique({ where: { slug: params.slug } });

  if (!category) {
    notFound();
  }

  const [session, recipes] = await Promise.all([
    getServerSession(authOptions),
    prisma.recipe.findMany({
      where: { categoryId: category.id },
      include: { category: { select: { name: true, slug: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const favoriteIds = session?.user?.id
    ? await getFavoriteRecipeIds(session.user.id)
    : new Set<string>();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{category.name}</h1>

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
