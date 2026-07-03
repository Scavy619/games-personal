"use client";

import { useEffect, useState } from "react";
import type { JournalEntry } from "@/lib/generated/prisma/client";

function Section({ title, emoji, entries }: { title: string; emoji: string; entries: JournalEntry[] }) {
  return (
    <div className="card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-white">
          {emoji} {title}
        </h3>
        <span className="font-mono text-xs text-text-dim">{entries.length}</span>
      </div>
      <div className="max-h-[420px] space-y-3 overflow-y-auto">
        {entries.length === 0 && (
          <div className="font-mono text-xs text-text-dim">{"// nothing here yet"}</div>
        )}
        {entries.map((e) => (
          <div key={e.id} className="border-b border-border/60 pb-3 last:border-none">
            <div className="font-mono text-[0.55rem] text-text-dim">
              {new Date(e.createdAt).toLocaleDateString()}
              {e.status && <span> · {e.status}</span>}
              {e.rating && <span> · {e.rating}/10</span>}
            </div>
            <div className="font-display text-sm font-bold text-text">{e.title}</div>
            {e.issue && <div className="text-xs text-text-dim">{e.issue}</div>}
            <p className="mt-1 text-sm text-text-muted">{e.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function JournalTab() {
  const [comics, setComics] = useState<JournalEntry[]>([]);
  const [writing, setWriting] = useState<JournalEntry[]>([]);

  useEffect(() => {
    fetch("/api/journal?section=comics")
      .then((r) => r.json())
      .then((d) => setComics(d.entries ?? []));
    fetch("/api/journal?section=writing")
      .then((r) => r.json())
      .then((d) => setWriting(d.entries ?? []));
  }, []);

  return (
    <section>
      <div className="mb-6">
        <div className="font-mono text-[0.6rem] uppercase tracking-[4px] text-cyan">Journal</div>
        <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
          Comics &amp; <span className="gradient-text">Journal</span>
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Section title="Comics I've Read" emoji="📚" entries={comics} />
        <Section title="Writing & Opinions" emoji="✍️" entries={writing} />
      </div>
    </section>
  );
}
