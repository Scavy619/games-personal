"use client";

import { useEffect, useState } from "react";
import type { SportsLog as SportsLogType } from "@/lib/generated/prisma/client";

export function SportsLog() {
  const [logs, setLogs] = useState<SportsLogType[]>([]);

  useEffect(() => {
    fetch("/api/sports").then((r) => r.json()).then((d) => setLogs(d.logs ?? []));
  }, []);

  if (logs.length === 0) {
    return (
      <div className="py-16 text-center font-mono text-sm text-text-muted">
        {"// No sports entries yet"}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {logs.map((log) => (
        <div key={log.id} className="card overflow-hidden">
          <div className="bg-gradient-to-br from-blue/20 to-violet/20 p-4">
            <div className="font-display text-lg font-bold text-white">{log.team}</div>
            {log.event && <div className="font-mono text-xs text-text-muted">{log.event}</div>}
          </div>
          <div className="p-4">
            {log.score && (
              <div className="font-mono text-sm font-bold text-green">🏆 {log.score}</div>
            )}
            <div className="mt-1 font-mono text-xs text-text-dim">
              📅 {new Date(log.date).toLocaleDateString()}
            </div>
            {log.notes && <p className="mt-2 text-xs text-text-muted">{log.notes}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
