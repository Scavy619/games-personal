"use client";

import type { Game } from "@/lib/generated/prisma/client";
import { scoreColor } from "@/lib/utils";

const MEDALS = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];
const BAR_COLORS = [
  "#8B5CF6",
  "#06EFC9",
  "#F59E0B",
  "#10B981",
  "#EF4444",
  "#F97316",
  "#3b82f6",
  "#a78bfa",
  "#34d8b4",
  "#ec4899",
  "#facc15",
  "#22d3ee",
];

export function Top5Genre({
  games,
  onSelect,
}: {
  games: Game[];
  onSelect?: (game: Game) => void;
}) {
  const byGenre = new Map<string, Game[]>();
  for (const g of games) {
    const list = byGenre.get(g.genre) ?? [];
    list.push(g);
    byGenre.set(g.genre, list);
  }

  const genres = [...byGenre.entries()].sort((a, b) => b[1].length - a[1].length);

  return (
    <section className="mb-8">
      <h3 className="mb-4 font-display text-xl font-bold text-white">Top 5 Per Genre</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {genres.map(([genre, list], i) => {
          const top5 = [...list]
            .sort((a, b) => (b.metacritic ?? 0) - (a.metacritic ?? 0))
            .slice(0, 5);
          return (
            <div
              key={genre}
              className="card overflow-hidden"
              style={{ borderLeft: `3px solid ${BAR_COLORS[i % BAR_COLORS.length]}` }}
            >
              <div className="border-b border-border px-3 py-2">
                <div className="font-display text-sm font-bold text-white">{genre}</div>
                <div className="font-mono text-[0.55rem] text-text-dim">{list.length} games</div>
              </div>
              <div className="divide-y divide-border/60">
                {top5.map((g, rank) => (
                  <button
                    key={g.id}
                    onClick={() => onSelect?.(g)}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-left transition-colors hover:bg-violet/5"
                  >
                    <span className="w-5 text-xs">{MEDALS[rank]}</span>
                    <span className="line-clamp-1 flex-1 text-xs text-text">{g.name}</span>
                    <span
                      className="font-mono text-xs font-bold"
                      style={{ color: scoreColor(g.metacritic) }}
                    >
                      {g.metacritic ?? "–"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
