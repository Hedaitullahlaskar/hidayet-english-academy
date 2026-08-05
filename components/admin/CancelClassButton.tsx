"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cancelLiveClass } from "@/lib/admin/repository";

export function CancelClassButton({ liveClassId }: { liveClassId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleCancel() {
    setBusy(true);
    const result = await cancelLiveClass(liveClassId);
    setBusy(false);
    if (result.success) router.refresh();
  }

  if (!confirming) {
    return (
      <button onClick={() => setConfirming(true)} className="text-xs font-semibold text-error underline">
        Cancel Class
      </button>
    );
  }

  return (
    <span className="flex items-center gap-2 text-xs">
      <span className="text-navy-600 dark:text-navy-300">Cancel this class?</span>
      <button onClick={handleCancel} disabled={busy} className="font-semibold text-error underline disabled:opacity-50">
        {busy ? "…" : "Yes"}
      </button>
      <button onClick={() => setConfirming(false)} className="font-semibold text-navy-500 underline dark:text-navy-400">
        No
      </button>
    </span>
  );
}
