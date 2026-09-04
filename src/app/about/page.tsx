import { ChefHat, Wallet, Clock, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white">
          <ChefHat className="h-7 w-7" />
        </span>
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">About CookEasy</h1>
      </div>

      <p className="mt-8 text-lg leading-relaxed text-gray-600">
        CookEasy is a mobile-first web application designed to help users cook easy and delicious
        meals using the ingredients they already have at home. It was created to solve common
        cooking problems such as lack of ideas, limited ingredients, and lack of time. Users simply
        enter the ingredients available in their kitchen, and CookEasy automatically suggests
        recipes they can prepare immediately. The app helps reduce food waste, save money, and make
        cooking less stressful — built for students, busy professionals, families, and beginners
        alike.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 text-center shadow-card">
          <Wallet className="mx-auto h-8 w-8 text-primary-600" />
          <h3 className="mt-3 font-semibold text-gray-900">Less waste</h3>
          <p className="mt-1 text-sm text-gray-500">Use what you already have.</p>
        </div>
        <div className="rounded-2xl bg-white p-6 text-center shadow-card">
          <Clock className="mx-auto h-8 w-8 text-primary-600" />
          <h3 className="mt-3 font-semibold text-gray-900">Less time</h3>
          <p className="mt-1 text-sm text-gray-500">Get recipe ideas in seconds.</p>
        </div>
        <div className="rounded-2xl bg-white p-6 text-center shadow-card">
          <Users className="mx-auto h-8 w-8 text-primary-600" />
          <h3 className="mt-3 font-semibold text-gray-900">For everyone</h3>
          <p className="mt-1 text-sm text-gray-500">Students, families, and beginners alike.</p>
        </div>
      </div>
    </div>
  );
}
