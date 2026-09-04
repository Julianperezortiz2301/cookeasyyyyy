import Link from "next/link";
import { ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 shrink-0", className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-white">
        <ChefHat className="h-5 w-5" />
      </span>
      <span className="text-xl font-bold text-gray-900">CookEasy</span>
    </Link>
  );
}
