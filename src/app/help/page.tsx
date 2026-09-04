import { FaqAccordion } from "@/components/faq-accordion";

const FAQS = [
  {
    question: "Is CookEasy free?",
    answer: "Yes, the application offers free access to basic features.",
  },
  {
    question: "Can I use the app offline?",
    answer: "No, an internet connection is required.",
  },
  {
    question: "Can I save recipes?",
    answer: "Yes, users can save recipes in the Favorites section.",
  },
  {
    question: "Does CookEasy work on iPhone and Android?",
    answer: "Yes, the app supports both.",
  },
  {
    question: "Can beginners use the app?",
    answer: "Yes, CookEasy is designed for beginners and experienced cooks alike.",
  },
];

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-center text-3xl font-bold text-gray-900 sm:text-4xl">Help Center</h1>
      <p className="mt-3 text-center text-gray-500">
        Frequently asked questions about CookEasy.
      </p>

      <div className="mt-10">
        <FaqAccordion items={FAQS} />
      </div>
    </div>
  );
}
