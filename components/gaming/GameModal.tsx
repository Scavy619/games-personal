"use client";

import type { Game } from "@/lib/generated/prisma/client";
import { ScoreCircle } from "@/components/ui/ScoreCircle";
import { Badge } from "@/components/ui/Badge";
import { platformLabel } from "@/lib/utils";

function extLink(url: string | null, fallback: string, label: string) {
  return (
    <a
      href={url ?? fallback}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-r8 border border-border2 bg-surface2 px-3 py-1.5 text-xs text-cyan2 transition-colors hover:border-cyan hover:bg-surface3"
    >
      {label} ↗
    </a>
  );
}

export function GameModal({ game, onClose }: { game: Game; onClose: () => void }) {
  const searchQuery = encodeURIComponent(game.name);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="card max-h-[88vh] w-full max-w-2xl overflow-y-auto p-0">
        <div className="relative aspect-[16/6] w-full overflow-hidden bg-surface2">
          {game.wallpaperUrl || game.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={game.wallpaperUrl ?? game.coverUrl ?? ""}
              alt={game.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-display text-2xl text-white/20">
              {game.name}
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <h3 className="mb-2 font-display text-2xl font-bold text-white">{game.name}</h3>
          <div className="mb-4 flex flex-wrap gap-1.5">
            <Badge variant="cyan">{platformLabel(game.platform)}</Badge>
            <Badge variant="violet">{game.genre}</Badge>
            {game.year && <Badge variant="gold">{game.year}</Badge>}
            {game.esrb && <Badge variant="green">{game.esrb}</Badge>}
          </div>

          <div className="mb-5 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <ScoreCircle score={game.metacritic} size={44} />
              <div>
                <div className="font-mono text-lg font-bold leading-none text-text">
                  {game.metacritic ?? "–"}
                </div>
                <div className="font-mono text-[0.55rem] uppercase tracking-wider text-text-dim">
                  Metacritic
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ScoreCircle score={game.steam} size={44} />
              <div>
                <div className="font-mono text-lg font-bold leading-none text-text">
                  {game.steam ? `${game.steam}%` : "–"}
                </div>
                <div className="font-mono text-[0.55rem] uppercase tracking-wider text-text-dim">
                  {game.steamLabel ?? "Steam"}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-5 grid grid-cols-3 gap-3 border-y border-border py-4">
            <div>
              <div className="font-mono text-[0.52rem] uppercase tracking-wider text-text-dim">
                Developer
              </div>
              <div className="text-sm text-text">{game.dev ?? "—"}</div>
            </div>
            <div>
              <div className="font-mono text-[0.52rem] uppercase tracking-wider text-text-dim">
                Publisher
              </div>
              <div className="text-sm text-text">{game.pub ?? "—"}</div>
            </div>
            <div>
              <div className="font-mono text-[0.52rem] uppercase tracking-wider text-text-dim">
                Launcher
              </div>
              <div className="text-sm text-text">{game.launcher}</div>
            </div>
          </div>

          <p className="mb-5 text-sm leading-relaxed text-text-muted">{game.synopsis}</p>

          <div className="flex flex-wrap gap-2">
            {extLink(
              game.metacriticUrl,
              `https://www.metacritic.com/search/${searchQuery}/`,
              "Metacritic",
            )}
            {extLink(
              game.steamUrl,
              `https://store.steampowered.com/search/?term=${searchQuery}`,
              "Steam",
            )}
            {extLink(
              game.youtubeUrl,
              `https://www.youtube.com/results?search_query=${searchQuery}+review`,
              "YouTube Review",
            )}
            {extLink(
              game.hltbUrl,
              `https://howlongtobeat.com/?q=${searchQuery}`,
              "HowLongToBeat",
            )}
            {extLink(
              game.opencriticUrl,
              `https://opencritic.com/search?criteria=${searchQuery}`,
              "OpenCritic",
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
