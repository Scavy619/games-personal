"use client";

import "@/lib/charts/chartConfig";
import { Bar } from "react-chartjs-2";
import type { Game } from "@/lib/generated/prisma/client";
import { gamesByYear } from "@/lib/charts/gameStats";
import { darkTooltip, baseGridOptions, baseTickOptions } from "@/lib/charts/chartConfig";
import { ChartCard } from "@/components/gaming/analytics/ChartCard";

export function GamesByYearChart({ games }: { games: Game[] }) {
  const { labels, data } = gamesByYear(games);
  return (
    <ChartCard title="Games by Release Year">
      <Bar
        data={{
          labels,
          datasets: [{ data, backgroundColor: "#3b82f6", borderRadius: 4 }],
        }}
        options={{
          plugins: { legend: { display: false }, tooltip: darkTooltip },
          scales: {
            x: { grid: { display: false }, ticks: { ...baseTickOptions, font: { size: 8 } } },
            y: { grid: baseGridOptions, ticks: baseTickOptions, beginAtZero: true },
          },
        }}
      />
    </ChartCard>
  );
}
