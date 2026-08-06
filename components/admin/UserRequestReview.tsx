"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { reviewTeacherApplication } from "@/lib/admin/repository";

interface Application {
  id: string;
  applicant_id: string;
  bio: string | null;
  subjects: string | null;
  status: string;
  profiles: { full_name: string; email: string } | null;
}

export function TeacherApplicationReview({ applications }: { applications: Application[] }) {
  const [statusMap, setStatusMap] = useState(Object.fromEntries(applications.map((a) => [a.id, a.status])));

  async function handle(app: Application, decision: "approved" | "rejected") {
    const result = await reviewTeacherApplication(app.id, app.applicant_id, decision);
    if (result.success) setStatusMap((prev) => ({ ...prev, [app.id]: decision }));
  }

  return (
    <div className="space-y-4">
      {applications.map((app) => (
        <div key={app.id} className="rounded-lg border border-navy-100 bg-white p-5 shadow-card dark:border-navy-700 dark:bg-navy-800">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-navy-900 dark:text-white">{app.profiles?.full_name ?? "Applicant"}</p>
              <p className="text-xs text-navy-500 dark:text-navy-400">{app.profiles?.email} · {app.subjects || "No subjects listed"}</p>
            </div>
            <Badge tone={statusMap[app.id] === "pending" ? "gold" : statusMap[app.id] === "approved" ? "success" : "outline"}>
              {statusMap[app.id]}
            </Badge>
          </div>
          {app.bio && <p className="mt-2 text-sm text-navy-600 dark:text-navy-300">{app.bio}</p>}
          {statusMap[app.id] === "pending" && (
            <div className="mt-3 flex gap-2">
              <Button onClick={() => handle(app, "approved")} size="sm">Approve — Grant Teacher Access</Button>
              <Button onClick={() => handle(app, "rejected")} variant="outline" size="sm">Reject</Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

interface DeletionRequest {
  id: string;
  user_id: string;
  reason: string | null;
  profiles: { full_name: string } | null;
}

export function DeletionRequestReview({ requests }: { requests: DeletionRequest[] }) {
  const [processed, setProcessed] = useState<Set<string>>(new Set());
  const [pending, setPending] = useState<string | null>(null);

  async function handleProcess(req: DeletionRequest) {
    setPending(req.id);
    const res = await fetch("/api/admin/delete-user", {
      method: "POST",
      body: JSON.stringify({ requestId: req.id, targetUserId: req.user_id }),
    });
    if (res.ok) setProcessed((prev) => new Set(prev).add(req.id));
    setPending(null);
  }

  const visible = requests.filter((r) => !processed.has(r.id));

  return (
    <div className="space-y-3">
      {visible.map((r) => (
        <div key={r.id} className="rounded-lg border border-error/30 bg-error/5 p-4">
          <p className="font-semibold text-navy-900 dark:text-white">{r.profiles?.full_name ?? "User"}</p>
          {r.reason && <p className="mt-1 text-sm text-navy-600 dark:text-navy-300">&quot;{r.reason}&quot;</p>}
          <button
            onClick={() => handleProcess(r)}
            disabled={pending === r.id}
            className="mt-3 text-sm font-semibold text-error underline disabled:opacity-50"
          >
            {pending === r.id ? "Processing…" : "Confirm & Permanently Delete Account"}
          </button>
        </div>
      ))}
    </div>
  );
}
