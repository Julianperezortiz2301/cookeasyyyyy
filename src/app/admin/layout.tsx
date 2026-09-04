import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, BookOpen, Tag, Apple } from "lucide-react";
import { getAdminSession } from "@/lib/admin";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/recipes", label: "Recipes", icon: BookOpen },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/ingredients", label: "Foods", icon: Apple },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/login?callbackUrl=/admin");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <span className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">
          Admin panel
        </span>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">Manage CookEasy</h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[200px_1fr]">
        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-primary-700"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div>{children}</div>
      </div>
    </div>
  );
}
