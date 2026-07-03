"use client";

import "@/lib/charts/chartConfig";
import { Bar } from "react-chartjs-2";
import type { Game } from "@/lib/generated/prisma/client";
import { avgMetacriticPerGenre } from "@/lib/charts/gameStats";
import { darkTooltip, baseGridOptions, baseTickOptions } from "@/lib/charts/chartConfig";
import { ChartCard } from "@/components/gaming/analytics/ChartCard";

export function AvgMetacriticPerGenreChart({ games }: { games: Game[] }) {
  const { labels, data } = avgMetacriticPerGenre(games);
  return (
    <ChartCard title="Avg Metacritic per Genre">
      <Bar
        data={{
          labels,
          datasets: [{ data, backgroundColor: "#10B981", borderRadius: 4 }],
        }}
        options={{
          indexAxis: "y" as const,
          plugins: { legend: { display: false }, tooltip: darkTooltip },
          scales: {
            x: { grid: baseGridOptions, ticks: baseTickOptions, beginAtZero: true, max: 100 },
            y: { grid: { display: false }, ticks: { ...baseTickOptions, font: { size: 9 } } },
          },
        }}
      />
    </ChartCard>
  );
}
