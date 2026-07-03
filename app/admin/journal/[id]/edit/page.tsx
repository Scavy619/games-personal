import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { JournalForm } from "@/components/admin/JournalForm";

export default async function EditJournalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = await prisma.journalEntry.findUnique({ where: { id } });
  if (!entry) notFound();

  return (
    <div>
      <h1 className="mb-4 font-display text-2xl font-bold text-white">Edit {entry.title}</h1>
      <JournalForm entry={entry} />
    </div>
  );
}
