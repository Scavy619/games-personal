"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Movie } from "@/lib/generated/prisma/client";
import { AdminDataTable, type AdminColumn } from "@/components/admin/AdminDataTable";

export default function AdminMoviesPage() {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    fetch("/api/movies")
      .then((r) => r.json())
      .then((data) => setMovies(data.movies ?? []))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleDelete(movie: Movie) {
    if (!confirm(`Delete "${movie.title}"?`)) return;
    await fetch(`/api/movies/${movie.id}`, { method: "DELETE" });
    load();
  }

  const columns: AdminColumn<Movie>[] = [
    { key: "title", label: "Title" },
    { key: "genre", label: "Genre", render: (m) => m.genre ?? "–" },
    { key: "status", label: "Status" },
    { key: "rating", label: "Rating", render: (m) => m.rating?.toString() ?? "–" },
    { key: "releaseYear", label: "Year", render: (m) => m.releaseYear?.toString() ?? "–" },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-white">Movies</h1>
        <Link
          href="/admin/movies/new"
          className="rounded-r8 bg-gradient-to-br from-violet to-indigo-600 px-4 py-2 text-sm font-semibold text-white"
        >
          + Add Movie
        </Link>
      </div>
      {loading ? (
        <div className="font-mono text-sm text-text-muted">Loading...</div>
      ) : (
        <AdminDataTable
          columns={columns}
          data={movies}
          searchKeys={["title", "genre"]}
          onEdit={(m) => router.push(`/admin/movies/${m.id}/edit`)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
