"use client";

import type { Game } from "@/lib/generated/prisma/client";
import { GameCard } from "@/components/gaming/GameCard";

export function GameGrid({
  games,
  onSelect,
}: {
  games: Game[];
  onSelect?: (game: Game) => void;
}) {
  if (games.length === 0) {
    return (
      <div className="py-16 text-center font-mono text-sm text-text-muted">
        {"// No games match your filters"}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {games.map((game) => (
        <GameCard key={game.id} game={game} onClick={() => onSelect?.(game)} />
      ))}
    </div>
  );
}
