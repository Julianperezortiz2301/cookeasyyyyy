"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search, ScanBarcode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarcodeScanner } from "@/components/barcode-scanner";

const SUGGESTIONS = ["Chicken", "Rice", "Eggs", "Tomato", "Potatoes"];

export function SearchBar() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [scannerOpen, setScannerOpen] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (value.trim()) params.set("ingredients", value.trim());
    router.push(`/recipes?${params.toString()}`);
  }

  function addWord(word: string) {
    setValue((prev) => {
      if (!prev.trim()) return word;
      const parts = prev.split(",").map((p) => p.trim()).filter(Boolean);
      if (parts.map((p) => p.toLowerCase()).includes(word.toLowerCase())) return prev;
      return [...parts, word].join(", ");
    });
  }

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-2 rounded-2xl bg-white p-2 shadow-card sm:flex-row sm:items-center"
      >
        <div className="flex flex-1 items-center gap-2 px-3 py-2">
          <Search className="h-5 w-5 shrink-0 text-gray-400" />
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter ingredients (e.g. chicken, rice, tomato...)"
            className="w-full border-none bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
          />
        </div>
        <button
          type="button"
          onClick={() => setScannerOpen(true)}
          aria-label="Scan a barcode"
          className="flex h-11 w-11 shrink-0 items-center justify-center self-center rounded-full text-gray-500 hover:bg-gray-100 sm:self-auto"
        >
          <ScanBarcode className="h-5 w-5" />
        </button>
        <Button type="submit" size="lg" className="w-full sm:w-auto">
          Search
        </Button>
      </form>
      <div className="mt-4 flex flex-wrap gap-2">
        {SUGGESTIONS.map((word) => (
          <button
            key={word}
            type="button"
            onClick={() => addWord(word)}
            className="rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-600 transition hover:border-primary-300 hover:text-primary-700"
          >
            {word}
          </button>
        ))}
      </div>

      {scannerOpen && (
        <BarcodeScanner
          onDetected={(name) => {
            addWord(name);
            setScannerOpen(false);
          }}
          onClose={() => setScannerOpen(false)}
        />
      )}
    </div>
  );
}
