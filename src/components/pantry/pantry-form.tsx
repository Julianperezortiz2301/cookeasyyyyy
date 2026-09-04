"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ScanBarcode, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BarcodeScanner } from "@/components/barcode-scanner";

export function PantryForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);

  async function addToPantry(itemName: string) {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/pantry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: itemName,
          quantity: quantity || undefined,
          expiresAt: expiresAt || undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      setName("");
      setQuantity("");
      setExpiresAt("");
      setLoading(false);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (name.trim()) addToPantry(name);
  }

  return (
    <div className="space-y-4 rounded-2xl bg-white p-6 shadow-card">
      <h2 className="font-semibold text-gray-900">Add to my pantry</h2>
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

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. milk" />
        <div className="grid grid-cols-2 gap-3">
          <Input
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Quantity (optional)"
          />
          <Input
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            aria-label="Expiration date (optional)"
          />
        </div>
        {name && !expiresAt && (
          <p className="text-xs text-orange-600">
            Tip: set an expiration date above so CookEasy can warn you before it goes bad.
          </p>
        )}
        <Button type="submit" disabled={loading || !name.trim()} className="w-full">
          <Plus className="h-4 w-4" /> Add to pantry
        </Button>
      </form>

      {scannerOpen && (
        <BarcodeScanner
          onDetected={(detectedName) => {
            setScannerOpen(false);
            setName(detectedName);
          }}
          onClose={() => setScannerOpen(false)}
        />
      )}
    </div>
  );
}
