"use client";

const PLATFORMS = [
  { key: "all", label: "All" },
  { key: "pc", label: "🖥 PC" },
  { key: "ps5", label: "🟣 PS5" },
  { key: "ps4", label: "🔵 PS4" },
];

export function GameFilters({
  search,
  onSearchChange,
  platform,
  onPlatformChange,
  count,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  platform: string;
  onPlatformChange: (v: string) => void;
  count: number;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <div className="relative min-w-[200px] max-w-[340px] flex-1">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
          🔍
        </span>
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search title, genre, developer..."
          className="w-full rounded-r8 border border-border bg-surface2 py-2 pl-9 pr-3 text-sm text-text outline-none transition-colors focus:border-violet"
        />
      </div>
      <div className="flex gap-1 rounded-r8 border border-border bg-surface2 p-1">
        {PLATFORMS.map((p) => (
          <button
            key={p.key}
            onClick={() => onPlatformChange(p.key)}
            className={`rounded-r8 px-3 py-1.5 text-xs font-medium transition-colors ${
              platform === p.key
                ? "bg-violet/20 text-violet2"
                : "text-text-muted hover:text-text"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <span className="font-mono text-xs text-text-muted">{count} games</span>
    </div>
  );
}
