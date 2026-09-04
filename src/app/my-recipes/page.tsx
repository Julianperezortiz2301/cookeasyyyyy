import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Plus } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { DifficultyBadge } from "@/components/ui/difficulty-badge";
import { DeleteRecipeButton } from "@/components/delete-recipe-button";

export default async function MyRecipesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/my-recipes");
  }

  const recipes = await prisma.recipe.findMany({
    where: { authorId: session.user.id },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Recipes</h1>
          <p className="mt-1 text-sm text-gray-500">Recipes you&apos;ve created.</p>
        </div>
        <Link href="/my-recipes/new">
          <Button>
            <Plus className="h-4 w-4" /> New recipe
          </Button>
        </Link>
      </div>

      {recipes.length === 0 ? (
        <div className="mt-10 rounded-2xl bg-gray-50 px-6 py-14 text-center">
          <p className="text-gray-600">You haven&apos;t created any recipes yet.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-card"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                <Image src={recipe.imageUrl} alt={recipe.title} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <Link href={`/recipes/${recipe.id}`} className="font-semibold text-gray-900 hover:text-primary-700">
                  {recipe.title}
                </Link>
                <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                  <span>{recipe.category.name}</span>
                  <span>&middot;</span>
                  <span>{recipe.cookingTime} min</span>
                  <DifficultyBadge difficulty={recipe.difficulty} />
                </div>
              </div>
              <Link href={`/my-recipes/${recipe.id}/edit`}>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </Link>
              <DeleteRecipeButton recipeId={recipe.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
