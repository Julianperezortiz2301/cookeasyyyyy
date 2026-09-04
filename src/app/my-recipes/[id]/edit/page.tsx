import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RecipeForm } from "@/components/recipe-form";

export default async function EditRecipePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/my-recipes/${params.id}/edit`);
  }

  const [categories, recipe] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.recipe.findUnique({
      where: { id: params.id },
      include: { ingredients: { include: { ingredient: true } } },
    }),
  ]);

  if (!recipe) {
    notFound();
  }
  if (recipe.authorId !== session.user.id) {
    redirect("/my-recipes");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">Edit recipe</h1>

      <div className="mt-6">
        <RecipeForm categories={categories} initialRecipe={recipe} />
      </div>
    </div>
  );
}
