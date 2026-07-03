"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { JournalEntry } from "@/lib/generated/prisma/client";
import { AdminDataTable, type AdminColumn } from "@/components/admin/AdminDataTable";

export default function AdminJournalPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    fetch("/api/journal")
      .then((r) => r.json())
      .then((data) => setEntries(data.entries ?? []))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleDelete(entry: JournalEntry) {
    if (!confirm(`Delete "${entry.title}"?`)) return;
    await fetch(`/api/journal/${entry.id}`, { method: "DELETE" });
    load();
  }

  const columns: AdminColumn<JournalEntry>[] = [
    { key: "section", label: "Section" },
    { key: "title", label: "Title" },
    { key: "status", label: "Status", render: (e) => e.status ?? "–" },
    { key: "isPrivate", label: "Private", render: (e) => (e.isPrivate ? "Yes" : "No") },
    {
      key: "createdAt",
      label: "Created",
      render: (e) => new Date(e.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-white">Journal</h1>
        <Link
          href="/admin/journal/new"
          className="rounded-r8 bg-gradient-to-br from-violet to-indigo-600 px-4 py-2 text-sm font-semibold text-white"
        >
          + Add Entry
        </Link>
      </div>
      {loading ? (
        <div className="font-mono text-sm text-text-muted">Loading...</div>
      ) : (
        <AdminDataTable
          columns={columns}
          data={entries}
          searchKeys={["title", "section"]}
          onEdit={(e) => router.push(`/admin/journal/${e.id}/edit`)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
