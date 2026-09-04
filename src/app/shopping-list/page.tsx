import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ShoppingListForm } from "@/components/shopping-list/shopping-list-form";
import { ShoppingListItemRow } from "@/components/shopping-list/shopping-list-item-row";

export default async function ShoppingListPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/shopping-list");
  }

  const items = await prisma.shoppingListItem.findMany({
    where: { userId: session.user.id },
    include: { ingredient: true },
    orderBy: [{ checked: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Shopping List</h1>
      <p className="mt-1 text-sm text-gray-500">
        Add what you&apos;re missing, check items off as you shop.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl bg-white shadow-card">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="font-semibold text-gray-900">Items ({items.length})</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {items.map((item) => (
              <ShoppingListItemRow
                key={item.id}
                id={item.id}
                name={item.ingredient.name}
                checked={item.checked}
              />
            ))}
            {items.length === 0 && (
              <p className="px-6 py-10 text-center text-sm text-gray-400">
                Your shopping list is empty. Add missing ingredients from a recipe or your pantry.
              </p>
            )}
          </div>
        </div>

        <ShoppingListForm />
      </div>
    </div>
  );
}
