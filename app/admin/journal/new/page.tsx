import { JournalForm } from "@/components/admin/JournalForm";

export default function NewJournalPage() {
  return (
    <div>
      <h1 className="mb-4 font-display text-2xl font-bold text-white">Add Journal Entry</h1>
      <JournalForm />
    </div>
  );
}
