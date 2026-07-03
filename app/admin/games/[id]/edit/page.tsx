import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { GameForm } from "@/components/admin/GameForm";

export default async function EditGamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const game = await prisma.game.findUnique({ where: { id } });
  if (!game) notFound();

  return (
    <div>
      <h1 className="mb-4 font-display text-2xl font-bold text-white">Edit {game.name}</h1>
      <GameForm game={game} />
    </div>
  );
}
