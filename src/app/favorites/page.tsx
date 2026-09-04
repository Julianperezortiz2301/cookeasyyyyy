import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RecipeCard } from "@/components/recipe-card";

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/favorites");
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      recipe: {
        include: { category: { select: { name: true, slug: true } } },
      },
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">My Favorites</h1>
      <p className="mt-1 text-sm text-gray-500">Recipes you&apos;ve saved for later.</p>

      {favorites.length === 0 ? (
        <div className="mt-10 rounded-2xl bg-gray-50 px-6 py-14 text-center">
          <p className="text-gray-600">You haven&apos;t saved any recipes yet.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {favorites.map((fav) => (
            <RecipeCard key={fav.id} recipe={fav.recipe} isFavorited />
          ))}
        </div>
      )}
    </div>
  );
}
