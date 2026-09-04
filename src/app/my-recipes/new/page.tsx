import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RecipeForm } from "@/components/recipe-form";

export default async function NewRecipePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/my-recipes/new");
  }

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">Create a new recipe</h1>
      <p className="mt-1 text-sm text-gray-500">Share a recipe with the CookEasy community.</p>

      <div className="mt-6">
        <RecipeForm categories={categories} />
      </div>
    </div>
  );
}
