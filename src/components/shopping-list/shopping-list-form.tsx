"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ScanBarcode, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BarcodeScanner } from "@/components/barcode-scanner";

export function ShoppingListForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);

  async function addItem(itemName: string) {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/shopping-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: itemName }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      setName("");
      setLoading(false);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (name.trim()) addItem(name);
  }

  return (
    <div className="space-y-4 rounded-2xl bg-white p-6 shadow-card">
      <h2 className="font-semibold text-gray-900">Add to shopping list</h2>
      {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <button
        type="button"
        onClick={() => setScannerOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-primary-300 bg-primary-50 px-4 py-3 text-sm font-semibold text-primary-700 hover:bg-primary-100"
      >
        <ScanBarcode className="h-4 w-4" /> Scan a product barcode
      </button>

      <div className="flex items-center gap-3 text-xs text-gray-400">
        <div className="h-px flex-1 bg-gray-200" /> or add manually <div className="h-px flex-1 bg-gray-200" />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. flour" className="flex-1" />
        <Button type="submit" disabled={loading || !name.trim()}>
          <Plus className="h-4 w-4" />
        </Button>
      </form>

      {scannerOpen && (
        <BarcodeScanner
          onDetected={(detectedName) => {
            setScannerOpen(false);
            addItem(detectedName);
          }}
          onClose={() => setScannerOpen(false)}
        />
      )}
    </div>
  );
}
