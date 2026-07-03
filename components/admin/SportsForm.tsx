"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SportsLog } from "@/lib/generated/prisma/client";
import { ExtraFieldsEditor } from "@/components/admin/ExtraFieldsEditor";

type SportsFormValues = {
  team: string;
  event: string;
  score: string;
  notes: string;
  date: string;
};

function toFormValues(log?: SportsLog | null): SportsFormValues {
  return {
    team: log?.team ?? "",
    event: log?.event ?? "",
    score: log?.score ?? "",
    notes: log?.notes ?? "",
    date: log?.date ? new Date(log.date).toISOString().slice(0, 10) : "",
  };
}

export function SportsForm({ log }: { log?: SportsLog | null }) {
  const router = useRouter();
  const [values, setValues] = useState<SportsFormValues>(toFormValues(log));
  const [extra, setExtra] = useState<Record<string, string>>(
    (log?.extra as Record<string, string>) ?? {},
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof SportsFormValues>(key: K, val: string) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...values,
      event: values.event || null,
      score: values.score || null,
      notes: values.notes || null,
      extra,
    };

    const res = await fetch(log ? `/api/sports/${log.id}` : "/api/sports", {
      method: log ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (res.ok) {
      router.push("/admin/sports");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Failed to save entry");
    }
  }

  const inputClass =
    "w-full rounded-r8 border border-border bg-surface2 px-3 py-2 text-sm text-text outline-none focus:border-violet";
  const labelClass = "mb-1 block font-mono text-[0.6rem] uppercase tracking-wider text-text-dim";

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <div className="card grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Team / Title *</label>
          <input
            required
            value={values.team}
            onChange={(e) => set("team", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Date *</label>
          <input
            required
            type="date"
            value={values.date}
            onChange={(e) => set("date", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Event / Category</label>
          <input
            value={values.event}
            onChange={(e) => set("event", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Score / Result</label>
          <input
            value={values.score}
            onChange={(e) => set("score", e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Notes</label>
          <textarea
            rows={3}
            value={values.notes}
            onChange={(e) => set("notes", e.target.value)}
            className={inputClass}
          />
        </div>
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
        {saving ? "Saving..." : log ? "Save Changes" : "Add Entry"}
      </button>
    </form>
  );
}
