"use client";

import { useEffect, useState } from "react";
import type { Movie } from "@/lib/generated/prisma/client";

export function MoviesLog() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    fetch("/api/movies").then((r) => r.json()).then((d) => setMovies(d.movies ?? []));
  }, []);

  if (movies.length === 0) {
    return (
      <div className="py-16 text-center font-mono text-sm text-text-muted">
        {"// No movies logged yet"}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {movies.map((m) => (
        <div key={m.id} className="card overflow-hidden">
          <div className="flex aspect-[2/3] items-center justify-center bg-surface2">
            {m.posterUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={m.posterUrl} alt={m.title} className="h-full w-full object-cover" />
            ) : (
              <span className="p-2 text-center font-display text-sm text-white/30">{m.title}</span>
            )}
          </div>
          <div className="p-3">
            <div className="line-clamp-1 font-display text-sm font-bold text-text">{m.title}</div>
            <div className="font-mono text-[0.6rem] text-text-muted">
              {m.releaseYear ?? "—"} {m.genre ? `· ${m.genre}` : ""}
            </div>
            <div className="mt-1 flex gap-1.5">
              <span className="badge badge-violet">{m.status}</span>
              {m.rating != null && <span className="badge badge-gold">⭐ {m.rating}</span>}
            </div>
            {m.review && (
              <p className="mt-1.5 line-clamp-3 text-xs text-text-muted">{m.review}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
