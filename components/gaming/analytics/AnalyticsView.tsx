"use client";

import type { Game } from "@/lib/generated/prisma/client";
import { PlatformSplitChart } from "@/components/gaming/analytics/PlatformSplitChart";
import { GenreBreakdownChart } from "@/components/gaming/analytics/GenreBreakdownChart";
import { ScoreDistributionChart } from "@/components/gaming/analytics/ScoreDistributionChart";
import { SteamSentimentChart } from "@/components/gaming/analytics/SteamSentimentChart";
import { Top15MetacriticChart } from "@/components/gaming/analytics/Top15MetacriticChart";
import { GamesByYearChart } from "@/components/gaming/analytics/GamesByYearChart";
import { LauncherSplitChart } from "@/components/gaming/analytics/LauncherSplitChart";
import { AvgMetacriticPerGenreChart } from "@/components/gaming/analytics/AvgMetacriticPerGenreChart";

export function AnalyticsView({ games }: { games: Game[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <PlatformSplitChart games={games} />
      <GenreBreakdownChart games={games} />
      <ScoreDistributionChart games={games} />
      <SteamSentimentChart games={games} />
      <Top15MetacriticChart games={games} />
      <GamesByYearChart games={games} />
      <LauncherSplitChart games={games} />
      <AvgMetacriticPerGenreChart games={games} />
    </div>
  );
}
