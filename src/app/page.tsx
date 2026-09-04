import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import {
  Wallet,
  Clock,
  Smile,
  ListPlus,
  Search as SearchIcon,
  ChefHat,
  UtensilsCrossed,
  ArrowRight,
} from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPopularRecipes, getFavoriteRecipeIds } from "@/lib/recipes";
import { RecipeCard } from "@/components/recipe-card";
import { CategoryCard } from "@/components/category-card";
import { SearchBar } from "@/components/search-bar";
import { NewsletterForm } from "@/components/newsletter-form";

const BENEFITS = [
  {
    title: "Save Money",
    description: "Use what you already have instead of buying more groceries.",
    icon: Wallet,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    title: "Save Time",
    description: "Skip the endless scrolling and get recipe ideas in seconds.",
    icon: Clock,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Cook without stress",
    description: "Clear, simple instructions that anyone can follow.",
    icon: Smile,
    color: "bg-pink-100 text-pink-600",
  },
];

const STEPS = [
  { title: "Add ingredients", description: "Tell us what you have in your kitchen.", icon: ListPlus },
  { title: "We search", description: "CookEasy matches your ingredients with recipes.", icon: SearchIcon },
  { title: "Choose a recipe", description: "Pick the one that looks best to you.", icon: ChefHat },
  { title: "Start cooking!", description: "Follow the steps and enjoy your meal.", icon: UtensilsCrossed },
];

export default async function HomePage() {
  const [session, popularRecipes, categories] = await Promise.all([
    getServerSession(authOptions),
    getPopularRecipes(4),
    prisma.category.findMany({ take: 6 }),
  ]);

  const favoriteIds = session?.user?.id
    ? await getFavoriteRecipeIds(session.user.id)
    : new Set<string>();

  return (
    <div>
      {/* Hero */}
      <section className="bg-cream">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
              Cook anything with what you have at home.
            </h1>
            <p className="mt-4 max-w-lg text-lg text-gray-600">
              Enter the ingredients in your kitchen and CookEasy will suggest delicious recipes you
              can make right now.
            </p>
            <div className="mt-8">
              <SearchBar />
            </div>
          </div>

          <div className="relative">
            <div className="relative h-72 w-full overflow-hidden rounded-3xl sm:h-96">
              <Image
                src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1200&auto=format&fit=crop"
                alt="Fresh ingredients ready to cook"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-6 left-1/2 w-[90%] -translate-x-1/2 rounded-2xl bg-white p-4 shadow-card sm:left-6 sm:w-72 sm:translate-x-0">
              <p className="text-sm font-semibold text-gray-900">
                Quick, easy and delicious recipes
              </p>
              <p className="mt-1 text-xs text-gray-500">Ready in less than 30 minutes!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular recipes */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Popular recipes for you</h2>
          <Link href="/recipes" className="flex items-center gap-1 text-sm font-semibold text-primary-700 hover:underline">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {popularRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} isFavorited={favoriteIds.has(recipe.id)} />
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            Why CookEasy helps you
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {BENEFITS.map((benefit) => (
              <div key={benefit.title} className="rounded-2xl bg-white p-6 shadow-card">
                <span className={`flex h-12 w-12 items-center justify-center rounded-full ${benefit.color}`}>
                  <benefit.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-semibold text-gray-900">{benefit.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Explore by category</h2>
          <Link href="/categories" className="flex items-center gap-1 text-sm font-semibold text-primary-700 hover:underline">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} {...category} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            How it works
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-600 text-white">
                  <step.icon className="h-7 w-7" />
                  <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-primary-700 shadow">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-primary-700">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Stay in the loop</h2>
          <p className="mx-auto mt-2 max-w-xl text-primary-100">
            Get new recipes and cooking tips straight to your inbox.
          </p>
          <div className="mx-auto mt-6 max-w-md">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  );
}
