"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { requestAccountDeletion } from "@/lib/account/repository";

export function DeleteAccountPanel({ hasPendingRequest }: { hasPendingRequest: boolean }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [reason, setReason] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done">(hasPendingRequest ? "done" : "idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (confirmText !== "DELETE") return;
    setStatus("submitting");
    const result = await requestAccountDeletion(reason.trim());
    if (result.success) {
      setStatus("done");
      router.refresh();
    } else {
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-lg border border-error/30 bg-error/5 p-5">
        <Badge tone="outline">Deletion Requested</Badge>
        <p className="mt-2 text-sm text-navy-700 dark:text-navy-200">
          Your account is scheduled for deletion. An admin reviews every request before it&apos;s processed — this isn&apos;t
          instant, and you can contact support if you change your mind before it&apos;s completed.
        </p>
      </div>
    );
  }

  if (!confirming) {
    return (
      <div>
        <p className="text-sm text-navy-600 dark:text-navy-300">
          Deleting your account removes your login and personal data. This can&apos;t be undone once processed.
        </p>
        <button onClick={() => setConfirming(true)} className="mt-3 text-sm font-semibold text-error underline">
          Request Account Deletion
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-error/30 bg-error/5 p-5">
      <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Why are you leaving? (optional)</label>
      <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={2} className="w-full rounded-lg border border-navy-200 bg-white px-4 py-2.5 text-sm text-navy-900 outline-none focus:border-error dark:border-navy-600 dark:bg-navy-900 dark:text-white" />
      <label className="mb-1.5 mt-4 block text-sm font-semibold text-navy-800 dark:text-navy-100">
        Type <strong>DELETE</strong> to confirm
      </label>
      <input type="text" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} className="w-full rounded-lg border border-navy-200 bg-white px-4 py-2.5 text-sm text-navy-900 outline-none focus:border-error dark:border-navy-600 dark:bg-navy-900 dark:text-white" />
      <div className="mt-4 flex gap-2">
        <Button type="submit" variant="secondary" size="sm" disabled={confirmText !== "DELETE" || status === "submitting"} className="!bg-error hover:!bg-error/90">
          {status === "submitting" ? "Submitting…" : "Confirm Deletion Request"}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => setConfirming(false)}>Cancel</Button>
      </div>
    </form>
  );
}
