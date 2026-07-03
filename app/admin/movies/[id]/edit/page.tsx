import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { MovieForm } from "@/components/admin/MovieForm";

export default async function EditMoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movie = await prisma.movie.findUnique({ where: { id } });
  if (!movie) notFound();

  return (
    <div>
      <h1 className="mb-4 font-display text-2xl font-bold text-white">Edit {movie.title}</h1>
      <MovieForm movie={movie} />
    </div>
  );
}
