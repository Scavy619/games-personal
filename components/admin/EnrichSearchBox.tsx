"use client";

import { useEffect, useRef, useState } from "react";
import type { EnrichmentResult } from "@/lib/enrich/types";

export function EnrichSearchBox({
  kind,
  onApply,
}: {
  kind: "game" | "movie";
  onApply: (formFields: Record<string, unknown>) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<EnrichmentResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/enrich/${kind === "game" ? "games" : "movies"}?q=${encodeURIComponent(query)}`,
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Search failed");
        setResults(data.candidates ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Search failed");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);
  }, [query, kind]);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="mb-2 flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-wider text-cyan2"
      >
        {open ? "▾" : "▸"} Search &amp; Auto-fill from {kind === "game" ? "RAWG" : "TMDb"}
      </button>
      {open && (
        <div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Type a ${kind} title...`}
            className="w-full rounded-r8 border border-border bg-surface2 px-3 py-2 text-sm text-text outline-none focus:border-cyan"
          />
          {loading && (
            <div className="mt-2 font-mono text-xs text-text-muted">Searching...</div>
          )}
          {error && <div className="mt-2 text-xs text-red">{error}</div>}
          {results.length > 0 && (
            <div className="mt-2 max-h-72 space-y-1 overflow-y-auto rounded-r8 border border-border bg-surface2 p-1.5">
              {results.map((r) => (
                <button
                  key={r.candidate.externalId}
                  type="button"
                  onClick={() => {
                    onApply(r.formFields);
                    setOpen(false);
                    setResults([]);
                    setQuery("");
                  }}
                  className="flex w-full items-center gap-2 rounded-r8 px-2 py-1.5 text-left transition-colors hover:bg-violet/10"
                >
                  {r.candidate.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={r.candidate.thumbnailUrl}
                      alt=""
                      className="h-10 w-10 rounded object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded bg-surface3" />
                  )}
                  <div>
                    <div className="text-xs font-medium text-text">{r.candidate.title}</div>
                    <div className="font-mono text-[0.6rem] text-text-dim">
                      {r.candidate.subtitle}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
