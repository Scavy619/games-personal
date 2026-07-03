import { readFileSync } from "node:fs";
import path from "node:path";
import { prisma } from "@/lib/db";

interface SourceGame {
  name: string;
  platform: string;
  genre: string;
  launcher: string;
  synopsis: string;
  metacritic: number | null;
  steam: number | null;
  steam_label: string | null;
  year: number | null;
  dev: string | null;
  pub: string | null;
  esrb: string | null;
}

async function main() {
  const filePath = path.join(process.cwd(), "scripts/data/scavy_games_export.json");
  const games: SourceGame[] = JSON.parse(readFileSync(filePath, "utf-8"));

  let created = 0;
  let skipped = 0;

  for (const g of games) {
    const result = await prisma.game.upsert({
      where: { name: g.name },
      update: {},
      create: {
        name: g.name,
        platform: g.platform,
        genre: g.genre,
        launcher: g.launcher,
        synopsis: g.synopsis,
        metacritic: g.metacritic ?? null,
        steam: g.steam ?? null,
        steamLabel: g.steam_label ?? null,
        year: g.year ?? null,
        dev: g.dev ?? null,
        pub: g.pub ?? null,
        esrb: g.esrb ? g.esrb : null,
        source: "import",
      },
    });
    // upsert doesn't tell us if it created or updated, so check via createdAt === updatedAt
    if (result.createdAt.getTime() === result.updatedAt.getTime()) {
      created++;
    } else {
      skipped++;
    }
  }

  console.log(`Import complete: { created: ${created}, skipped: ${skipped}, total: ${games.length} }`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
