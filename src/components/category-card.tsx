import Link from "next/link";
import { CategoryIcon } from "@/components/category-icon";

const PASTEL_COLORS: Record<string, string> = {
  yellow: "bg-yellow-100 text-yellow-600",
  orange: "bg-orange-100 text-orange-600",
  green: "bg-green-100 text-green-600",
  blue: "bg-blue-100 text-blue-600",
  pink: "bg-pink-100 text-pink-600",
  purple: "bg-purple-100 text-purple-600",
};

export function CategoryCard({
  name,
  slug,
  icon,
  color,
}: {
  name: string;
  slug: string;
  icon: string;
  color: string;
}) {
  const colorClasses = PASTEL_COLORS[color] ?? PASTEL_COLORS.green;

  return (
    <Link
      href={`/categories/${slug}`}
      className="flex flex-col items-center gap-3 rounded-2xl bg-white p-5 text-center shadow-card transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <span className={`flex h-14 w-14 items-center justify-center rounded-full ${colorClasses}`}>
        <CategoryIcon icon={icon} className="h-6 w-6" />
      </span>
      <span className="text-sm font-semibold text-gray-800">{name}</span>
    </Link>
  );
}
