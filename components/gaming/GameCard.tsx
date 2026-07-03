"use client";

import type { Game } from "@/lib/generated/prisma/client";
import { ScoreCircle } from "@/components/ui/ScoreCircle";
import { PlatformDot } from "@/components/ui/PlatformDot";

export function GameCard({ game, onClick }: { game: Game; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="card card-hover group flex flex-col overflow-hidden text-left"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-surface2">
        {game.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={game.coverUrl}
            alt={game.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-2 text-center font-display text-sm text-white/30">
            {game.name}
          </div>
        )}
        <div className="absolute right-1.5 top-1.5">
          <ScoreCircle score={game.metacritic} size={30} />
        </div>
        <div className="absolute left-1.5 top-1.5">
          <PlatformDot platform={game.platform} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-2.5">
        <div className="line-clamp-1 font-display text-sm font-bold tracking-wide text-text">
          {game.name}
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[0.6rem] text-text-muted">
          <span>{game.genre}</span>
          {game.year && (
            <>
              <span>·</span>
              <span>{game.year}</span>
            </>
          )}
        </div>
        {game.dev && (
          <div className="line-clamp-1 font-mono text-[0.58rem] text-text-dim">{game.dev}</div>
        )}
      </div>
    </button>
  );
}
