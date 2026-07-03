import { MovieForm } from "@/components/admin/MovieForm";

export default function NewMoviePage() {
  return (
    <div>
      <h1 className="mb-4 font-display text-2xl font-bold text-white">Add Movie</h1>
      <MovieForm />
    </div>
  );
}
