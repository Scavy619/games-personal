"use client";

import { useState } from "react";
import { SportsLog } from "@/components/entertainment/SportsLog";
import { MoviesLog } from "@/components/entertainment/MoviesLog";

export function EntertainmentTab() {
  const [sub, setSub] = useState<"sports" | "movies">("movies");

  return (
    <section>
      <div className="mb-6">
        <div className="font-mono text-[0.6rem] uppercase tracking-[4px] text-cyan">
          Entertainment
        </div>
        <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
          Sports &amp; <span className="gradient-text">Movies</span>
        </h2>
      </div>

      <div className="mb-5 flex gap-1 border-b border-border">
        <button
          onClick={() => setSub("sports")}
          className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
            sub === "sports" ? "border-violet text-violet2" : "border-transparent text-text-muted"
          }`}
        >
          ⚽ Sports
        </button>
        <button
          onClick={() => setSub("movies")}
          className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
            sub === "movies" ? "border-violet text-violet2" : "border-transparent text-text-muted"
          }`}
        >
          🎬 Movies &amp; Shows
        </button>
      </div>

      {sub === "sports" ? <SportsLog /> : <MoviesLog />}
    </section>
  );
}
