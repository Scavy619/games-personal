"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/games", label: "Games" },
  { href: "/admin/movies", label: "Movies" },
  { href: "/admin/journal", label: "Journal" },
  { href: "/admin/sports", label: "Sports" },
  { href: "/admin/profile", label: "Profile" },
  { href: "/admin/messages", label: "Messages" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex w-52 shrink-0 flex-col border-r border-border bg-surface p-4">
      <div className="mb-6 font-display text-lg font-bold gradient-text">SCAVY ADMIN</div>
      <nav className="flex flex-1 flex-col gap-1">
        {LINKS.map((link) => {
          const active = link.href === "/admin" ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-r8 px-3 py-2 text-sm transition-colors ${
                active ? "bg-violet/15 text-violet2" : "text-text-muted hover:text-text"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={logout}
        className="rounded-r8 border border-border px-3 py-2 text-left text-xs text-text-muted transition-colors hover:border-red hover:text-red"
      >
        Log out
      </button>
      <Link
        href="/"
        className="mt-2 rounded-r8 px-3 py-2 text-xs text-text-dim transition-colors hover:text-text"
      >
        ← Back to site
      </Link>
    </aside>
  );
}
