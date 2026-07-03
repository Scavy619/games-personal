"use client";

import { useMemo, useState } from "react";

export interface AdminColumn<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

export function AdminDataTable<T extends { id: string }>({
  columns,
  data,
  onEdit,
  onDelete,
  searchKeys,
}: {
  columns: AdminColumn<T>[];
  data: T[];
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
  searchKeys?: (keyof T)[];
}) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim() || !searchKeys?.length) return data;
    const q = search.trim().toLowerCase();
    return data.filter((row) =>
      searchKeys.some((key) => String(row[key] ?? "").toLowerCase().includes(q)),
    );
  }, [data, search, searchKeys]);

  return (
    <div>
      {searchKeys && (
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="mb-3 w-full max-w-xs rounded-r8 border border-border bg-surface2 px-3 py-2 text-sm text-text outline-none focus:border-violet"
        />
      )}
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse text-sm">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="whitespace-nowrap border-b border-border bg-surface px-3 py-2 text-left font-mono text-[0.58rem] uppercase tracking-wider text-text-dim"
                >
                  {col.label}
                </th>
              ))}
              <th className="border-b border-border bg-surface px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id} className="border-b border-border/60 hover:bg-violet/5">
                {columns.map((col) => (
                  <td key={col.key} className="whitespace-nowrap px-3 py-2 text-text">
                    {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? "—")}
                  </td>
                ))}
                <td className="whitespace-nowrap px-3 py-2 text-right">
                  <button
                    onClick={() => onEdit(row)}
                    className="mr-2 text-xs text-cyan2 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(row)}
                    className="text-xs text-red hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-10 text-center font-mono text-sm text-text-muted">
            {"// No records"}
          </div>
        )}
      </div>
    </div>
  );
}
