"use client";

import { useRef, useState, DragEvent } from "react";
import Image from "next/image";
import { Upload, Loader2, ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function ImageUploader({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [previewBroken, setPreviewBroken] = useState(false);

  async function uploadFile(file: File) {
    setError("");
    setUploading(true);
    setPreviewBroken(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setUploading(false);
        return;
      }

      onChange(data.url);
      setUploading(false);
    } catch {
      setError("Something went wrong. Please try again.");
      setUploading(false);
    }
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition",
          dragging ? "border-primary-500 bg-primary-50" : "border-gray-300 hover:border-primary-400"
        )}
      >
        {value && !previewBroken ? (
          <div className="relative h-32 w-full max-w-xs overflow-hidden rounded-lg">
            <Image
              src={value}
              alt="Recipe preview"
              fill
              className="object-cover"
              onError={() => setPreviewBroken(true)}
            />
          </div>
        ) : uploading ? (
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        ) : previewBroken ? (
          <ImageOff className="h-8 w-8 text-gray-400" />
        ) : (
          <Upload className="h-8 w-8 text-gray-400" />
        )}

        <p className="text-sm text-gray-600">
          {uploading ? "Uploading..." : "Click to upload or drag and drop a photo"}
        </p>
        <p className="text-xs text-gray-400">JPEG, PNG, WEBP or GIF, up to 5MB</p>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadFile(file);
            e.target.value = "";
          }}
        />
      </div>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
