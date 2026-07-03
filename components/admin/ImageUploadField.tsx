"use client";

import { useRef, useState } from "react";

export function ImageUploadField({
  label,
  value,
  onChange,
  kind,
}: {
  label: string;
  value: string | null | undefined;
  onChange: (url: string) => void;
  kind: "avatars" | "gallery" | "covers";
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("kind", kind);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    setUploading(false);
    if (res.ok) {
      const data = await res.json();
      onChange(data.url);
    } else {
      setError("Upload failed");
    }
  }

  return (
    <div>
      {label && (
        <label className="mb-1 block font-mono text-[0.6rem] uppercase tracking-wider text-text-dim">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-r8 border border-dashed border-border2 bg-surface2 text-xs text-text-muted transition-colors hover:border-cyan"
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : uploading ? (
          "Uploading..."
        ) : (
          "+ Upload"
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      {error && <div className="mt-1 text-xs text-red">{error}</div>}
    </div>
  );
}
