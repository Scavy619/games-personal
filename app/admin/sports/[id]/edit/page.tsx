import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { SportsForm } from "@/components/admin/SportsForm";

export default async function EditSportsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const log = await prisma.sportsLog.findUnique({ where: { id } });
  if (!log) notFound();

  return (
    <div>
      <h1 className="mb-4 font-display text-2xl font-bold text-white">Edit {log.team}</h1>
      <SportsForm log={log} />
    </div>
  );
}
