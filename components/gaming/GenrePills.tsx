"use client";

export function GenrePills({
  genres,
  active,
  onChange,
}: {
  genres: { genre: string; count: number }[];
  active: string;
  onChange: (genre: string) => void;
}) {
  return (
    <div className="mb-4 flex flex-wrap gap-1.5">
      <button
        onClick={() => onChange("all")}
        className={`rounded-full border px-3 py-1 font-mono text-[0.65rem] transition-colors ${
          active === "all"
            ? "border-violet bg-violet/15 text-violet2"
            : "border-border text-text-muted hover:border-border2"
        }`}
      >
        All Genres
      </button>
      {genres.map((g) => (
        <button
          key={g.genre}
          onClick={() => onChange(g.genre)}
          className={`rounded-full border px-3 py-1 font-mono text-[0.65rem] transition-colors ${
            active === g.genre
              ? "border-violet bg-violet/15 text-violet2"
              : "border-border text-text-muted hover:border-border2"
          }`}
        >
          {g.genre} <span className="text-text-dim">{g.count}</span>
        </button>
      ))}
    </div>
  );
}
