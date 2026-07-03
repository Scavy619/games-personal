"use client";

import { useEffect, useMemo, useState } from "react";
import type { Game } from "@/lib/generated/prisma/client";
import { GameFilters } from "@/components/gaming/GameFilters";
import { GenrePills } from "@/components/gaming/GenrePills";
import { ViewSwitcher, type ViewMode } from "@/components/gaming/ViewSwitcher";
import { GameGrid } from "@/components/gaming/GameGrid";
import { GameTable } from "@/components/gaming/GameTable";
import { GameModal } from "@/components/gaming/GameModal";
import { AnalyticsView } from "@/components/gaming/analytics/AnalyticsView";
import { Top5Genre } from "@/components/gaming/Top5Genre";
import { MoodCards } from "@/components/gaming/MoodCards";

export function GamingTab() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("all");
  const [genre, setGenre] = useState("all");
  const [view, setView] = useState<ViewMode>("grid");
  const [selected, setSelected] = useState<Game | null>(null);

  useEffect(() => {
    fetch("/api/games")
      .then((r) => r.json())
      .then((data) => setGames(data.games ?? []))
      .finally(() => setLoading(false));
  }, []);

  const genreCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const g of games) counts.set(g.genre, (counts.get(g.genre) ?? 0) + 1);
    return [...counts.entries()]
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count);
  }, [games]);

  const filtered = useMemo(() => {
    let list = games;
    if (platform !== "all") list = list.filter((g) => g.platform === platform);
    if (genre !== "all") list = list.filter((g) => g.genre === genre);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.genre.toLowerCase().includes(q) ||
          (g.dev ?? "").toLowerCase().includes(q) ||
          g.synopsis.toLowerCase().includes(q),
      );
    }
    return list;
  }, [games, platform, genre, search]);

  return (
    <section>
      <div className="mb-6">
        <div className="font-mono text-[0.6rem] uppercase tracking-[4px] text-cyan">
          The Vault
        </div>
        <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
          <span className="gradient-text">Gaming</span> Library
        </h2>
        <div className="mt-2 font-mono text-xs text-text-muted">
          {games.length} games tracked
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <GameFilters
          search={search}
          onSearchChange={setSearch}
          platform={platform}
          onPlatformChange={setPlatform}
          count={filtered.length}
        />
        <ViewSwitcher view={view} onChange={setView} />
      </div>

      <GenrePills genres={genreCounts} active={genre} onChange={setGenre} />

      {loading ? (
        <div className="py-16 text-center font-mono text-sm text-text-muted">
          Loading library...
        </div>
      ) : (
        <>
          {view === "grid" && <GameGrid games={filtered} onSelect={setSelected} />}
          {view === "table" && <GameTable games={filtered} onSelect={setSelected} />}
          {view === "analytics" && (
            <>
              <AnalyticsView games={filtered} />
              <div className="mt-8">
                <Top5Genre games={filtered} onSelect={setSelected} />
                <MoodCards games={filtered} onSelect={setSelected} />
              </div>
            </>
          )}
        </>
      )}

      {selected && <GameModal game={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
