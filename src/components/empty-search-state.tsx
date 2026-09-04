import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptySearchState() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl bg-gray-50 px-6 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-primary-600">
        <SearchX className="h-7 w-7" />
      </span>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">No recipes found</h3>
      <p className="mt-2 text-sm text-gray-500">
        Try removing brand names or complex adjectives and search using simple words (like
        &ldquo;eggs&rdquo; or &ldquo;rice&rdquo;).
      </p>
      <Link href="/recipes" className="mt-6">
        <Button variant="outline">Clear search</Button>
      </Link>
    </div>
  );
}
