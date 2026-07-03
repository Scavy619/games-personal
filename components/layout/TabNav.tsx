"use client";

export type TabKey = "personal" | "gaming" | "journal" | "entertainment" | "contact";

const TABS: { key: TabKey; label: string }[] = [
  { key: "personal", label: "👤 Personal" },
  { key: "gaming", label: "🎮 Gaming" },
  { key: "journal", label: "📚 Journal" },
  { key: "entertainment", label: "🎬 Sports & Movies" },
  { key: "contact", label: "💬 Contact" },
];

export function TabNav({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}) {
  return (
    <nav className="sticky top-0 z-40 flex items-center overflow-x-auto border-b border-border bg-bg/90 backdrop-blur-sm">
      <span className="mr-2 whitespace-nowrap border-r border-border py-3.5 pr-4 font-display text-lg font-bold gradient-text">
        SCAVY B2
      </span>
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`relative whitespace-nowrap px-3.5 py-4 text-[0.78rem] font-medium transition-colors ${
            active === tab.key ? "text-violet2" : "text-text-muted hover:text-text"
          }`}
        >
          {tab.label}
          {active === tab.key && (
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-violet to-cyan" />
          )}
        </button>
      ))}
    </nav>
  );
}
