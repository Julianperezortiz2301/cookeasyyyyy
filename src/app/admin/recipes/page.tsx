import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DifficultyBadge } from "@/components/ui/difficulty-badge";
import { DeleteRecipeButton } from "@/components/delete-recipe-button";
import { Button } from "@/components/ui/button";

export default async function AdminRecipesPage() {
  const recipes = await prisma.recipe.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, author: { select: { name: true, email: true } } },
  });

  return (
    <div className="rounded-2xl bg-white shadow-card">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <h2 className="font-semibold text-gray-900">All recipes ({recipes.length})</h2>
        <Link href="/my-recipes/new">
          <Button size="sm">
            <Plus className="h-4 w-4" /> New recipe
          </Button>
        </Link>
      </div>
      <div className="divide-y divide-gray-50">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="flex items-center gap-4 px-6 py-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
              <Image src={recipe.imageUrl} alt={recipe.title} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <Link href={`/recipes/${recipe.id}`} className="font-medium text-gray-900 hover:text-primary-700">
                {recipe.title}
              </Link>
              <p className="text-xs text-gray-500">
                {recipe.category.name} &middot; by {recipe.author?.name ?? "CookEasy"}
              </p>
            </div>
            <DifficultyBadge difficulty={recipe.difficulty} />
            <DeleteRecipeButton recipeId={recipe.id} />
          </div>
        ))}
      </div>
    </div>
  );
}
