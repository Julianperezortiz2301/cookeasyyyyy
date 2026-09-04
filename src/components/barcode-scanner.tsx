"use client";

import { useEffect, useRef, useState } from "react";
import { X, Loader2, ScanBarcode } from "lucide-react";

const SCANNER_ELEMENT_ID = "cookeasy-barcode-scanner";

export function BarcodeScanner({
  onDetected,
  onClose,
}: {
  onDetected: (ingredientName: string) => void;
  onClose: () => void;
}) {
  const scannerRef = useRef<import("html5-qrcode").Html5Qrcode | null>(null);
  const [status, setStatus] = useState<"starting" | "scanning" | "looking-up" | "error">("starting");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function start() {
      try {
        const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import("html5-qrcode");
        if (cancelled) return;

        const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID, {
          formatsToSupport: [
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.QR_CODE,
          ],
          verbose: false,
        });
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 150 } },
          async (decodedText) => {
            if (cancelled) return;
            cancelled = true;
            setStatus("looking-up");
            await scanner.stop().catch(() => {});
            await handleBarcode(decodedText);
          },
          () => {
            // ignore per-frame decode failures
          }
        );

        if (!cancelled) setStatus("scanning");
      } catch {
        if (!cancelled) {
          setStatus("error");
          setError("Could not access the camera. Check permissions and try again.");
        }
      }
    }

    async function handleBarcode(code: string) {
      try {
        const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${code}.json`);
        const data = await res.json();
        const productName: string | undefined =
          data?.product?.product_name || data?.product?.generic_name;

        if (data.status === 1 && productName) {
          onDetected(productName.split(",")[0].split(" - ")[0].trim().toLowerCase());
        } else {
          setStatus("error");
          setError(`No product found for code ${code}. Try typing the ingredient manually.`);
        }
      } catch {
        setStatus("error");
        setError("Couldn't look up that barcode. Check your connection and try again.");
      }
    }

    start();

    return () => {
      cancelled = true;
      scannerRef.current?.stop().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900">
            <ScanBarcode className="h-5 w-5 text-primary-600" /> Scan a barcode
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div id={SCANNER_ELEMENT_ID} className="overflow-hidden rounded-xl bg-gray-900" />

        {status === "starting" && (
          <p className="mt-3 flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Starting camera...
          </p>
        )}
        {status === "looking-up" && (
          <p className="mt-3 flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Looking up product...
          </p>
        )}
        {status === "scanning" && (
          <p className="mt-3 text-sm text-gray-500">Point your camera at a product barcode.</p>
        )}
        {status === "error" && (
          <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        )}
      </div>
    </div>
  );
}
