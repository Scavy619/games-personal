"use client";

export type ViewMode = "grid" | "table" | "analytics";

const VIEWS: { key: ViewMode; icon: string; label: string }[] = [
  { key: "grid", icon: "⊞", label: "Grid" },
  { key: "table", icon: "☰", label: "Table" },
  { key: "analytics", icon: "📊", label: "Analytics" },
];

export function ViewSwitcher({
  view,
  onChange,
}: {
  view: ViewMode;
  onChange: (v: ViewMode) => void;
}) {
  return (
    <div className="flex gap-1 rounded-r8 border border-border bg-surface2 p-1">
      {VIEWS.map((v) => (
        <button
          key={v.key}
          onClick={() => onChange(v.key)}
          title={v.label}
          className={`rounded-r8 px-3 py-1.5 text-sm transition-colors ${
            view === v.key ? "bg-violet/20 text-violet2" : "text-text-muted hover:text-text"
          }`}
        >
          {v.icon}
        </button>
      ))}
    </div>
  );
}
