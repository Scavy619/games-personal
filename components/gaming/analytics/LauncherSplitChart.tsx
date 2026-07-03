"use client";

import "@/lib/charts/chartConfig";
import { Doughnut } from "react-chartjs-2";
import type { Game } from "@/lib/generated/prisma/client";
import { launcherSplit } from "@/lib/charts/gameStats";
import { PALETTE, darkTooltip } from "@/lib/charts/chartConfig";
import { ChartCard } from "@/components/gaming/analytics/ChartCard";

export function LauncherSplitChart({ games }: { games: Game[] }) {
  const pcGames = games.filter((g) => g.platform === "pc");
  const { labels, data } = launcherSplit(pcGames);
  return (
    <ChartCard title="PC Launcher Split">
      <Doughnut
        data={{
          labels,
          datasets: [{ data, backgroundColor: PALETTE, borderWidth: 0 }],
        }}
        options={{
          plugins: {
            legend: { position: "bottom", labels: { color: "#6B68A0", font: { size: 9 } } },
            tooltip: darkTooltip,
          },
        }}
      />
    </ChartCard>
  );
}
