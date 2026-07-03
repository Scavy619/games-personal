"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Game } from "@/lib/generated/prisma/client";
import { AdminDataTable, type AdminColumn } from "@/components/admin/AdminDataTable";

export default function AdminGamesPage() {
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    fetch("/api/games")
      .then((r) => r.json())
      .then((data) => setGames(data.games ?? []))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleDelete(game: Game) {
    if (!confirm(`Delete "${game.name}"?`)) return;
    await fetch(`/api/games/${game.id}`, { method: "DELETE" });
    load();
  }

  const columns: AdminColumn<Game>[] = [
    { key: "name", label: "Title" },
    { key: "platform", label: "Platform" },
    { key: "genre", label: "Genre" },
    { key: "metacritic", label: "Metacritic", render: (g) => g.metacritic?.toString() ?? "–" },
    { key: "year", label: "Year", render: (g) => g.year?.toString() ?? "–" },
    { key: "source", label: "Source" },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-white">Games</h1>
        <Link
          href="/admin/games/new"
          className="rounded-r8 bg-gradient-to-br from-violet to-indigo-600 px-4 py-2 text-sm font-semibold text-white"
        >
          + Add Game
        </Link>
      </div>
      {loading ? (
        <div className="font-mono text-sm text-text-muted">Loading...</div>
      ) : (
        <AdminDataTable
          columns={columns}
          data={games}
          searchKeys={["name", "genre", "dev"]}
          onEdit={(g) => router.push(`/admin/games/${g.id}/edit`)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
