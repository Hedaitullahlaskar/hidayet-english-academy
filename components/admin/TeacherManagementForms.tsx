"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { promoteUserToTeacher, addTeacherNote } from "@/lib/admin/repository";

export function PromoteTeacherForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "error" | "done">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.includes("@")) return setError("Enter a valid email address.");

    setStatus("saving");
    const result = await promoteUserToTeacher(email.trim());
    if (!result.success) {
      setStatus("error");
      setError(result.error ?? "Something went wrong.");
      return;
    }
    setStatus("done");
    setEmail("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-navy-100 bg-white p-6 shadow-card dark:border-navy-700 dark:bg-navy-800">
      <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Promote by Email</label>
      <p className="mb-3 text-xs text-navy-500 dark:text-navy-400">
        The person must already have a registered student account — this promotes an existing account to teacher, it doesn't create a new one.
      </p>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="teacher@example.com"
          className="flex-1 rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
        />
        <Button type="submit" disabled={status === "saving"}>
          {status === "saving" ? "…" : "Promote"}
        </Button>
      </div>
      {error && <p role="alert" className="mt-3 text-sm font-medium text-error">{error}</p>}
      {status === "done" && <p className="mt-3 text-sm font-medium text-success-text dark:text-success">Promoted to teacher.</p>}
    </form>
  );
}

export function AddTeacherNoteForm({ teacherId }: { teacherId: string }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (note.trim().length < 2) return;
    setStatus("saving");
    const result = await addTeacherNote(teacherId, note.trim());
    if (result.success) {
      setNote("");
      setStatus("done");
      router.refresh();
    } else {
      setStatus("idle");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="e.g. Salary reviewed — increase approved from March"
        className="flex-1 rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
      />
      <Button type="submit" size="sm" disabled={status === "saving"}>Add Note</Button>
    </form>
  );
}
