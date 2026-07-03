"use client";

import "@/lib/charts/chartConfig";
import { Bar } from "react-chartjs-2";
import type { Game } from "@/lib/generated/prisma/client";
import { scoreDistribution } from "@/lib/charts/gameStats";
import { darkTooltip, baseGridOptions, baseTickOptions } from "@/lib/charts/chartConfig";
import { ChartCard } from "@/components/gaming/analytics/ChartCard";

export function ScoreDistributionChart({ games }: { games: Game[] }) {
  const { labels, data } = scoreDistribution(games);
  return (
    <ChartCard title="Metacritic Score Distribution">
      <Bar
        data={{
          labels,
          datasets: [{ data, backgroundColor: "#8B5CF6", borderRadius: 4 }],
        }}
        options={{
          plugins: { legend: { display: false }, tooltip: darkTooltip },
          scales: {
            x: { grid: { display: false }, ticks: baseTickOptions },
            y: { grid: baseGridOptions, ticks: baseTickOptions, beginAtZero: true },
          },
        }}
      />
    </ChartCard>
  );
}
