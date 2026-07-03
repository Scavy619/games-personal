"use client";

import "@/lib/charts/chartConfig";
import { Bar } from "react-chartjs-2";
import type { Game } from "@/lib/generated/prisma/client";
import { top15Metacritic } from "@/lib/charts/gameStats";
import { darkTooltip, baseGridOptions, baseTickOptions } from "@/lib/charts/chartConfig";
import { ChartCard } from "@/components/gaming/analytics/ChartCard";

export function Top15MetacriticChart({ games }: { games: Game[] }) {
  const { labels, data } = top15Metacritic(games);
  return (
    <ChartCard title="Top 15 by Metacritic" className="lg:row-span-2">
      <div style={{ height: 420 }}>
        <Bar
          data={{
            labels,
            datasets: [{ data, backgroundColor: "#F59E0B", borderRadius: 4 }],
          }}
          options={{
            indexAxis: "y" as const,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: darkTooltip },
            scales: {
              x: { grid: baseGridOptions, ticks: baseTickOptions, beginAtZero: true, max: 100 },
              y: { grid: { display: false }, ticks: { ...baseTickOptions, font: { size: 9 } } },
            },
          }}
        />
      </div>
    </ChartCard>
  );
}
