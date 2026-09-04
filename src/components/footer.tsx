import Link from "next/link";
import { Globe, Camera, MessageCircle } from "lucide-react";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-gray-500">
              Cook anything with what you already have at home. Simple, fast, and stress-free.
            </p>
            <div className="flex gap-3">
              <a href="#" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm hover:text-primary-600">
                <Globe className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm hover:text-primary-600">
                <Camera className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Twitter" className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm hover:text-primary-600">
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-900">Company</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/about" className="hover:text-primary-600">About Us</Link></li>
              <li><Link href="/about" className="hover:text-primary-600">Contact</Link></li>
              <li><Link href="/about" className="hover:text-primary-600">Careers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-900">Help</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/help" className="hover:text-primary-600">FAQ</Link></li>
              <li><Link href="/help" className="hover:text-primary-600">Help Center</Link></li>
              <li><Link href="/help" className="hover:text-primary-600">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-900">Get the app</h4>
            <div className="flex flex-col gap-2">
              <span className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-center text-xs font-medium text-gray-600">
                App Store
              </span>
              <span className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-center text-xs font-medium text-gray-600">
                Google Play
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} CookEasy. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
