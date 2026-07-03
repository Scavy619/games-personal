"use client";

import "@/lib/charts/chartConfig";
import { Doughnut } from "react-chartjs-2";
import type { Game } from "@/lib/generated/prisma/client";
import { platformSplit } from "@/lib/charts/gameStats";
import { PALETTE, darkTooltip } from "@/lib/charts/chartConfig";
import { ChartCard } from "@/components/gaming/analytics/ChartCard";

export function PlatformSplitChart({ games }: { games: Game[] }) {
  const { labels, data } = platformSplit(games);
  return (
    <ChartCard title="Platform Split">
      <Doughnut
        data={{
          labels,
          datasets: [{ data, backgroundColor: PALETTE, borderWidth: 0 }],
        }}
        options={{
          plugins: {
            legend: { position: "bottom", labels: { color: "#6B68A0", font: { size: 10 } } },
            tooltip: darkTooltip,
          },
        }}
      />
    </ChartCard>
  );
}
