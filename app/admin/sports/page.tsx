"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SportsLog } from "@/lib/generated/prisma/client";
import { AdminDataTable, type AdminColumn } from "@/components/admin/AdminDataTable";

export default function AdminSportsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<SportsLog[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    fetch("/api/sports")
      .then((r) => r.json())
      .then((data) => setLogs(data.logs ?? []))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleDelete(log: SportsLog) {
    if (!confirm(`Delete "${log.team}"?`)) return;
    await fetch(`/api/sports/${log.id}`, { method: "DELETE" });
    load();
  }

  const columns: AdminColumn<SportsLog>[] = [
    { key: "team", label: "Team / Title" },
    { key: "event", label: "Event", render: (l) => l.event ?? "–" },
    { key: "score", label: "Score", render: (l) => l.score ?? "–" },
    { key: "date", label: "Date", render: (l) => new Date(l.date).toLocaleDateString() },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-white">Sports Logs</h1>
        <Link
          href="/admin/sports/new"
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
          data={logs}
          searchKeys={["team", "event"]}
          onEdit={(l) => router.push(`/admin/sports/${l.id}/edit`)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
