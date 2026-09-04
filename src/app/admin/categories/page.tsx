import { prisma } from "@/lib/prisma";
import { CategoryIcon } from "@/components/category-icon";
import { CategoryForm } from "@/components/admin/category-form";
import { DeleteCategoryButton } from "@/components/admin/delete-category-button";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { recipes: true } } },
  });

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <div className="rounded-2xl bg-white shadow-card">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="font-semibold text-gray-900">Categories ({categories.length})</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center gap-4 px-6 py-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
                <CategoryIcon icon={category.icon} className="h-4 w-4 text-gray-700" />
              </span>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{category.name}</p>
                <p className="text-xs text-gray-500">{category._count.recipes} recipes</p>
              </div>
              <DeleteCategoryButton categoryId={category.id} />
            </div>
          ))}
        </div>
      </div>

      <CategoryForm />
    </div>
  );
}
