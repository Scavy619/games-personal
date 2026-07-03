"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Game } from "@/lib/generated/prisma/client";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { ExtraFieldsEditor } from "@/components/admin/ExtraFieldsEditor";
import { EnrichSearchBox } from "@/components/admin/EnrichSearchBox";

type GameFormValues = {
  name: string;
  platform: string;
  genre: string;
  launcher: string;
  synopsis: string;
  metacritic: string;
  steam: string;
  steamLabel: string;
  year: string;
  dev: string;
  pub: string;
  esrb: string;
  coverUrl: string;
  wallpaperUrl: string;
  metacriticUrl: string;
  steamUrl: string;
  youtubeUrl: string;
  hltbUrl: string;
  opencriticUrl: string;
};

function toFormValues(game?: Game | null): GameFormValues {
  return {
    name: game?.name ?? "",
    platform: game?.platform ?? "pc",
    genre: game?.genre ?? "",
    launcher: game?.launcher ?? "Steam",
    synopsis: game?.synopsis ?? "",
    metacritic: game?.metacritic?.toString() ?? "",
    steam: game?.steam?.toString() ?? "",
    steamLabel: game?.steamLabel ?? "",
    year: game?.year?.toString() ?? "",
    dev: game?.dev ?? "",
    pub: game?.pub ?? "",
    esrb: game?.esrb ?? "",
    coverUrl: game?.coverUrl ?? "",
    wallpaperUrl: game?.wallpaperUrl ?? "",
    metacriticUrl: game?.metacriticUrl ?? "",
    steamUrl: game?.steamUrl ?? "",
    youtubeUrl: game?.youtubeUrl ?? "",
    hltbUrl: game?.hltbUrl ?? "",
    opencriticUrl: game?.opencriticUrl ?? "",
  };
}

export function GameForm({ game }: { game?: Game | null }) {
  const router = useRouter();
  const [values, setValues] = useState<GameFormValues>(toFormValues(game));
  const [extra, setExtra] = useState<Record<string, string>>(
    (game?.extra as Record<string, string>) ?? {},
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof GameFormValues>(key: K, val: string) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...values,
      metacritic: values.metacritic ? Number(values.metacritic) : null,
      steam: values.steam ? Number(values.steam) : null,
      year: values.year ? Number(values.year) : null,
      steamLabel: values.steamLabel || null,
      dev: values.dev || null,
      pub: values.pub || null,
      esrb: values.esrb || null,
      coverUrl: values.coverUrl || null,
      wallpaperUrl: values.wallpaperUrl || null,
      metacriticUrl: values.metacriticUrl || null,
      steamUrl: values.steamUrl || null,
      youtubeUrl: values.youtubeUrl || null,
      hltbUrl: values.hltbUrl || null,
      opencriticUrl: values.opencriticUrl || null,
      extra,
    };

    const res = await fetch(game ? `/api/games/${game.id}` : "/api/games", {
      method: game ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (res.ok) {
      router.push("/admin/games");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Failed to save game");
    }
  }

  function applyEnrichment(fields: Record<string, unknown>) {
    setValues((v) => ({
      ...v,
      genre: (fields.genre as string) ?? v.genre,
      metacritic: fields.metacritic != null ? String(fields.metacritic) : v.metacritic,
      year: fields.year != null ? String(fields.year) : v.year,
      dev: (fields.dev as string) ?? v.dev,
      pub: (fields.pub as string) ?? v.pub,
      esrb: (fields.esrb as string) ?? v.esrb,
      coverUrl: (fields.coverUrl as string) ?? v.coverUrl,
      name: v.name || (fields.name as string) || v.name,
    }));
  }

  const inputClass =
    "w-full rounded-r8 border border-border bg-surface2 px-3 py-2 text-sm text-text outline-none focus:border-violet";
  const labelClass = "mb-1 block font-mono text-[0.6rem] uppercase tracking-wider text-text-dim";

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-5">
      {!game && (
        <div className="card p-4">
          <EnrichSearchBox kind="game" onApply={applyEnrichment} />
        </div>
      )}

      <div className="card grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass}>Title *</label>
          <input
            required
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Platform *</label>
          <select
            value={values.platform}
            onChange={(e) => set("platform", e.target.value)}
            className={inputClass}
          >
            <option value="pc">PC</option>
            <option value="ps5">PS5</option>
            <option value="ps4">PS4</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Genre *</label>
          <input
            required
            value={values.genre}
            onChange={(e) => set("genre", e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Launcher *</label>
          <input
            required
            value={values.launcher}
            onChange={(e) => set("launcher", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Year</label>
          <input
            value={values.year}
            onChange={(e) => set("year", e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Metacritic</label>
          <input
            value={values.metacritic}
            onChange={(e) => set("metacritic", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Steam %</label>
          <input
            value={values.steam}
            onChange={(e) => set("steam", e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Steam Label</label>
          <input
            value={values.steamLabel}
            onChange={(e) => set("steamLabel", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>ESRB</label>
          <input
            value={values.esrb}
            onChange={(e) => set("esrb", e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Developer</label>
          <input
            value={values.dev}
            onChange={(e) => set("dev", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Publisher</label>
          <input
            value={values.pub}
            onChange={(e) => set("pub", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Synopsis *</label>
          <textarea
            required
            rows={4}
            value={values.synopsis}
            onChange={(e) => set("synopsis", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="card p-4">
        <div className="mb-3 font-mono text-[0.6rem] uppercase tracking-wider text-text-dim">
          Artwork
        </div>
        <div className="flex gap-4">
          <ImageUploadField
            label="Cover"
            value={values.coverUrl}
            onChange={(url) => set("coverUrl", url)}
            kind="covers"
          />
          <ImageUploadField
            label="Wallpaper"
            value={values.wallpaperUrl}
            onChange={(url) => set("wallpaperUrl", url)}
            kind="covers"
          />
        </div>
      </div>

      <div className="card grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
        <div className="sm:col-span-2 font-mono text-[0.6rem] uppercase tracking-wider text-text-dim">
          External Links
        </div>
        {(
          [
            ["metacriticUrl", "Metacritic URL"],
            ["steamUrl", "Steam URL"],
            ["youtubeUrl", "YouTube Review URL"],
            ["hltbUrl", "HowLongToBeat URL"],
            ["opencriticUrl", "OpenCritic URL"],
          ] as const
        ).map(([key, label]) => (
          <div key={key}>
            <label className={labelClass}>{label}</label>
            <input
              value={values[key]}
              onChange={(e) => set(key, e.target.value)}
              className={inputClass}
            />
          </div>
        ))}
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
        {saving ? "Saving..." : game ? "Save Changes" : "Add Game"}
      </button>
    </form>
  );
}
