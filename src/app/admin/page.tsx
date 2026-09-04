import Link from "next/link";
import { Users, BookOpen, Tag, Heart, Mail, Plus, ScanBarcode } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
  const [userCount, recipeCount, categoryCount, favoriteCount, subscriberCount] = await Promise.all([
    prisma.user.count(),
    prisma.recipe.count(),
    prisma.category.count(),
    prisma.favorite.count(),
    prisma.newsletterSubscriber.count(),
  ]);

  const stats = [
    { label: "Users", value: userCount, icon: Users, color: "bg-blue-100 text-blue-600" },
    { label: "Recipes", value: recipeCount, icon: BookOpen, color: "bg-orange-100 text-orange-600" },
    { label: "Categories", value: categoryCount, icon: Tag, color: "bg-purple-100 text-purple-600" },
    { label: "Favorites saved", value: favoriteCount, icon: Heart, color: "bg-pink-100 text-pink-600" },
    { label: "Newsletter subscribers", value: subscriberCount, icon: Mail, color: "bg-green-100 text-green-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 rounded-2xl bg-white p-5 shadow-card">
        <Link href="/my-recipes/new">
          <Button size="sm">
            <Plus className="h-4 w-4" /> New recipe
          </Button>
        </Link>
        <Link href="/admin/ingredients">
          <Button size="sm" variant="outline">
            <ScanBarcode className="h-4 w-4" /> Add a food by barcode
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-card">
            <span className={`flex h-11 w-11 items-center justify-center rounded-full ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
