"use client";

import { useEffect, useState } from "react";
import type { SocialLink } from "@/lib/generated/prisma/client";

export function SocialLinks() {
  const [links, setLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    fetch("/api/social-links").then((r) => r.json()).then((d) => setLinks(d.links ?? []));
  }, []);

  if (links.length === 0) return null;

  return (
    <div className="card p-5">
      <h3 className="mb-3 font-display text-lg font-bold text-white">Find Me Elsewhere</h3>
      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-r8 border border-border2 bg-surface2 px-3 py-1.5 text-xs text-cyan2 transition-colors hover:border-cyan"
          >
            {link.platform} ↗
          </a>
        ))}
      </div>
    </div>
  );
}
