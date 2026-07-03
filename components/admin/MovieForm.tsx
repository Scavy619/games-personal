"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Movie } from "@/lib/generated/prisma/client";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { ExtraFieldsEditor } from "@/components/admin/ExtraFieldsEditor";
import { EnrichSearchBox } from "@/components/admin/EnrichSearchBox";

type MovieFormValues = {
  title: string;
  genre: string;
  rating: string;
  status: string;
  watchedDate: string;
  review: string;
  posterUrl: string;
  tmdbRating: string;
  releaseYear: string;
  overview: string;
};

function toFormValues(movie?: Movie | null): MovieFormValues {
  return {
    title: movie?.title ?? "",
    genre: movie?.genre ?? "",
    rating: movie?.rating?.toString() ?? "",
    status: movie?.status ?? "watched",
    watchedDate: movie?.watchedDate ? new Date(movie.watchedDate).toISOString().slice(0, 10) : "",
    review: movie?.review ?? "",
    posterUrl: movie?.posterUrl ?? "",
    tmdbRating: movie?.tmdbRating?.toString() ?? "",
    releaseYear: movie?.releaseYear?.toString() ?? "",
    overview: movie?.overview ?? "",
  };
}

export function MovieForm({ movie }: { movie?: Movie | null }) {
  const router = useRouter();
  const [values, setValues] = useState<MovieFormValues>(toFormValues(movie));
  const [extra, setExtra] = useState<Record<string, string>>(
    (movie?.extra as Record<string, string>) ?? {},
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof MovieFormValues>(key: K, val: string) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...values,
      rating: values.rating ? Number(values.rating) : null,
      tmdbRating: values.tmdbRating ? Number(values.tmdbRating) : null,
      releaseYear: values.releaseYear ? Number(values.releaseYear) : null,
      watchedDate: values.watchedDate || null,
      genre: values.genre || null,
      review: values.review || null,
      posterUrl: values.posterUrl || null,
      overview: values.overview || null,
      extra,
    };

    const res = await fetch(movie ? `/api/movies/${movie.id}` : "/api/movies", {
      method: movie ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (res.ok) {
      router.push("/admin/movies");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Failed to save movie");
    }
  }

  function applyEnrichment(fields: Record<string, unknown>) {
    setValues((v) => ({
      ...v,
      title: v.title || (fields.title as string) || v.title,
      genre: (fields.genre as string) ?? v.genre,
      releaseYear: fields.releaseYear != null ? String(fields.releaseYear) : v.releaseYear,
      tmdbRating: fields.tmdbRating != null ? String(fields.tmdbRating) : v.tmdbRating,
      overview: (fields.overview as string) ?? v.overview,
      posterUrl: (fields.posterUrl as string) ?? v.posterUrl,
    }));
  }

  const inputClass =
    "w-full rounded-r8 border border-border bg-surface2 px-3 py-2 text-sm text-text outline-none focus:border-violet";
  const labelClass = "mb-1 block font-mono text-[0.6rem] uppercase tracking-wider text-text-dim";

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-5">
      {!movie && (
        <div className="card p-4">
          <EnrichSearchBox kind="movie" onApply={applyEnrichment} />
        </div>
      )}

      <div className="card grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass}>Title *</label>
          <input
            required
            value={values.title}
            onChange={(e) => set("title", e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Genre</label>
          <input
            value={values.genre}
            onChange={(e) => set("genre", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Release Year</label>
          <input
            value={values.releaseYear}
            onChange={(e) => set("releaseYear", e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Your Rating (1-10)</label>
          <input
            value={values.rating}
            onChange={(e) => set("rating", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>TMDb Rating</label>
          <input
            value={values.tmdbRating}
            onChange={(e) => set("tmdbRating", e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Status</label>
          <select
            value={values.status}
            onChange={(e) => set("status", e.target.value)}
            className={inputClass}
          >
            <option value="watched">Watched</option>
            <option value="watching">Watching</option>
            <option value="wishlist">Wishlist</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Watched Date</label>
          <input
            type="date"
            value={values.watchedDate}
            onChange={(e) => set("watchedDate", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Overview</label>
          <textarea
            rows={3}
            value={values.overview}
            onChange={(e) => set("overview", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Your Review</label>
          <textarea
            rows={4}
            value={values.review}
            onChange={(e) => set("review", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="card p-4">
        <ImageUploadField
          label="Poster"
          value={values.posterUrl}
          onChange={(url) => set("posterUrl", url)}
          kind="covers"
        />
      </div>

      <div className="card p-4">
        <ExtraFieldsEditor value={extra} onChange={setExtra} />
      </div>

      {error && <div className="text-sm text-red">{error}</div>}

      <button
        type="submit"
        disabled={saving}
        className="rounded-r8 bg-gradient-to-br from-violet to-indigo-600 px-6 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {saving ? "Saving..." : movie ? "Save Changes" : "Add Movie"}
      </button>
    </form>
  );
}
