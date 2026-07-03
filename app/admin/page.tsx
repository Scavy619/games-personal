import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdminDashboard() {
  const [games, movies, journal, sports, unreadMessages] = await Promise.all([
    prisma.game.count(),
    prisma.movie.count(),
    prisma.journalEntry.count(),
    prisma.sportsLog.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
  ]);

  const cards = [
    { label: "Games", count: games, href: "/admin/games" },
    { label: "Movies", count: movies, href: "/admin/movies" },
    { label: "Journal Entries", count: journal, href: "/admin/journal" },
    { label: "Sports Logs", count: sports, href: "/admin/sports" },
    { label: "Unread Messages", count: unreadMessages, href: "/admin/messages" },
  ];

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-white">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="card card-hover p-4">
            <div className="font-mono text-3xl font-bold text-white">{c.count}</div>
            <div className="mt-1 text-xs text-text-muted">{c.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
