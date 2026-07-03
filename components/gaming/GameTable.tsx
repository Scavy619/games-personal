"use client";

import { useState } from "react";
import type { Game } from "@/lib/generated/prisma/client";
import { platformLabel, scoreColor } from "@/lib/utils";

type SortKey = "name" | "platform" | "genre" | "metacritic" | "steam" | "year" | "dev";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "name", label: "Title" },
  { key: "platform", label: "Platform" },
  { key: "genre", label: "Genre" },
  { key: "metacritic", label: "Metacritic" },
  { key: "steam", label: "Steam" },
  { key: "year", label: "Year" },
  { key: "dev", label: "Developer" },
];

export function GameTable({
  games,
  onSelect,
}: {
  games: Game[];
  onSelect?: (game: Game) => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const sorted = [...games].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    let cmp: number;
    if (av == null && bv == null) cmp = 0;
    else if (av == null) cmp = 1;
    else if (bv == null) cmp = -1;
    else if (typeof av === "number" && typeof bv === "number") cmp = av - bv;
    else cmp = String(av).localeCompare(String(bv));
    return sortDir === "asc" ? cmp : -cmp;
  });

  return (
    <div className="card overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                onClick={() => toggleSort(col.key)}
                className="cursor-pointer whitespace-nowrap border-b border-border bg-surface px-3 py-2 text-left font-mono text-[0.58rem] uppercase tracking-wider text-text-dim select-none"
              >
                {col.label} {sortKey === col.key ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((g) => (
            <tr
              key={g.id}
              onClick={() => onSelect?.(g)}
              className="cursor-pointer border-b border-border/60 transition-colors hover:bg-violet/5"
            >
              <td className="whitespace-nowrap px-3 py-2 font-medium text-text">{g.name}</td>
              <td className="px-3 py-2 text-text-muted">{platformLabel(g.platform)}</td>
              <td className="px-3 py-2 text-text-muted">{g.genre}</td>
              <td
                className="px-3 py-2 font-mono font-bold"
                style={{ color: scoreColor(g.metacritic) }}
              >
                {g.metacritic ?? "–"}
              </td>
              <td className="px-3 py-2 font-mono text-text-muted">
                {g.steam ? `${g.steam}%` : "–"}
              </td>
              <td className="px-3 py-2 text-text-muted">{g.year ?? "–"}</td>
              <td className="whitespace-nowrap px-3 py-2 text-text-muted">{g.dev ?? "–"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {sorted.length === 0 && (
        <div className="py-16 text-center font-mono text-sm text-text-muted">
          {"// No games match your filters"}
        </div>
      )}
    </div>
  );
}
