"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaqItem {
  question: string;
  answer: string;
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-gray-100 rounded-2xl bg-white shadow-card">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
            >
              <span className="font-medium text-gray-900">{item.question}</span>
              <ChevronDown
                className={cn("h-5 w-5 shrink-0 text-gray-400 transition-transform", isOpen && "rotate-180")}
              />
            </button>
            {isOpen && <p className="px-6 pb-4 text-sm text-gray-600">{item.answer}</p>}
          </div>
        );
      })}
    </div>
  );
}
