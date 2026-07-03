"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { JournalEntry } from "@/lib/generated/prisma/client";
import { ExtraFieldsEditor } from "@/components/admin/ExtraFieldsEditor";

type JournalFormValues = {
  section: string;
  title: string;
  body: string;
  issue: string;
  status: string;
  rating: string;
  isPrivate: boolean;
};

function toFormValues(entry?: JournalEntry | null): JournalFormValues {
  return {
    section: entry?.section ?? "journal",
    title: entry?.title ?? "",
    body: entry?.body ?? "",
    issue: entry?.issue ?? "",
    status: entry?.status ?? "",
    rating: entry?.rating?.toString() ?? "",
    isPrivate: entry?.isPrivate ?? false,
  };
}

export function JournalForm({ entry }: { entry?: JournalEntry | null }) {
  const router = useRouter();
  const [values, setValues] = useState<JournalFormValues>(toFormValues(entry));
  const [extra, setExtra] = useState<Record<string, string>>(
    (entry?.extra as Record<string, string>) ?? {},
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof JournalFormValues>(key: K, val: JournalFormValues[K]) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...values,
      issue: values.issue || null,
      status: values.status || null,
      rating: values.rating ? Number(values.rating) : null,
      extra,
    };

    const res = await fetch(entry ? `/api/journal/${entry.id}` : "/api/journal", {
      method: entry ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (res.ok) {
      router.push("/admin/journal");
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
          <label className={labelClass}>Section *</label>
          <select
            value={values.section}
            onChange={(e) => set("section", e.target.value)}
            className={inputClass}
          >
            <option value="comics">Comics</option>
            <option value="writing">Writing</option>
            <option value="journal">Journal (private)</option>
          </select>
        </div>
        <div className="flex items-end gap-2">
          <label className="flex items-center gap-2 text-sm text-text">
            <input
              type="checkbox"
              checked={values.isPrivate}
              onChange={(e) => set("isPrivate", e.target.checked)}
            />
            Private (hidden from public site)
          </label>
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Title *</label>
          <input
            required
            value={values.title}
            onChange={(e) => set("title", e.target.value)}
            className={inputClass}
          />
        </div>

        {values.section === "comics" && (
          <>
            <div>
              <label className={labelClass}>Issue / Year / Publisher</label>
              <input
                value={values.issue}
                onChange={(e) => set("issue", e.target.value)}
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
                <option value="">—</option>
                <option value="Reading">Reading</option>
                <option value="Complete">Complete</option>
                <option value="Wishlist">Wishlist</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Rating (1-10)</label>
              <input
                value={values.rating}
                onChange={(e) => set("rating", e.target.value)}
                className={inputClass}
              />
            </div>
          </>
        )}

        <div className="sm:col-span-2">
          <label className={labelClass}>Body *</label>
          <textarea
            required
            rows={6}
            value={values.body}
            onChange={(e) => set("body", e.target.value)}
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
        {saving ? "Saving..." : entry ? "Save Changes" : "Add Entry"}
      </button>
    </form>
  );
}
