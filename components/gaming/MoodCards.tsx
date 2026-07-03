"use client";

import type { Game } from "@/lib/generated/prisma/client";
import { MOODS } from "@/lib/moods";
import { scoreColor } from "@/lib/utils";

export function MoodCards({
  games,
  onSelect,
}: {
  games: Game[];
  onSelect?: (game: Game) => void;
}) {
  return (
    <section className="mb-8">
      <h3 className="mb-4 font-display text-xl font-bold text-white">Mood Recommendations</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MOODS.map((mood) => {
          const picks = games
            .filter((g) => mood.genres.includes(g.genre) && (g.metacritic ?? 0) >= mood.minScore)
            .sort((a, b) => (b.metacritic ?? 0) - (a.metacritic ?? 0))
            .slice(0, 6);

          return (
            <div key={mood.key} className="card overflow-hidden">
              <div className="p-4" style={{ background: mood.gradient }}>
                <div className="text-2xl">{mood.emoji}</div>
                <div className="font-display text-lg font-bold text-white">{mood.label}</div>
                <div className="text-xs text-white/80">{mood.description}</div>
              </div>
              <div className="divide-y divide-border/60">
                {picks.length === 0 && (
                  <div className="px-3 py-3 font-mono text-xs text-text-dim">
                    {"// no matches yet"}
                  </div>
                )}
                {picks.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => onSelect?.(g)}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-left transition-colors hover:bg-violet/5"
                  >
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
