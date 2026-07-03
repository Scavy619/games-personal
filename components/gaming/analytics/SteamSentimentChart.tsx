"use client";

import "@/lib/charts/chartConfig";
import { Bar } from "react-chartjs-2";
import type { Game } from "@/lib/generated/prisma/client";
import { steamSentiment } from "@/lib/charts/gameStats";
import { darkTooltip, baseGridOptions, baseTickOptions } from "@/lib/charts/chartConfig";
import { ChartCard } from "@/components/gaming/analytics/ChartCard";

export function SteamSentimentChart({ games }: { games: Game[] }) {
  const { labels, data } = steamSentiment(games);
  return (
    <ChartCard title="Steam Sentiment">
      <Bar
        data={{
          labels,
          datasets: [{ data, backgroundColor: "#06EFC9", borderRadius: 4 }],
        }}
        options={{
          indexAxis: "y" as const,
          plugins: { legend: { display: false }, tooltip: darkTooltip },
          scales: {
            x: { grid: baseGridOptions, ticks: baseTickOptions, beginAtZero: true },
            y: { grid: { display: false }, ticks: baseTickOptions },
          },
        }}
      />
    </ChartCard>
  );
}
