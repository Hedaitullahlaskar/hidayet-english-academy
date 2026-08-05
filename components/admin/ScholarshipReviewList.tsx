"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { updateScholarshipStatus } from "@/lib/admin/repository";

interface Application {
  id: string;
  applicant_name: string;
  course_interest: string | null;
  reason: string | null;
  status: string;
}

export function ScholarshipReviewList({ applications }: { applications: Application[] }) {
  const [statusMap, setStatusMap] = useState(Object.fromEntries(applications.map((a) => [a.id, a.status])));

  async function handle(id: string, decision: "approved" | "rejected") {
    const result = await updateScholarshipStatus(id, decision);
    if (result.success) setStatusMap((p) => ({ ...p, [id]: decision }));
  }

  return (
    <div className="space-y-4">
      {applications.map((a) => (
        <div key={a.id} className="rounded-lg border border-navy-100 bg-white p-5 shadow-card dark:border-navy-700 dark:bg-navy-800">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-navy-900 dark:text-white">{a.applicant_name}</p>
              <p className="text-xs text-navy-500 dark:text-navy-400">{a.course_interest ?? "No course specified"}</p>
            </div>
            <Badge tone={statusMap[a.id] === "pending" ? "gold" : statusMap[a.id] === "approved" ? "success" : "outline"}>
              {statusMap[a.id]}
            </Badge>
          </div>
          {a.reason && <p className="mt-2 text-sm text-navy-600 dark:text-navy-300">{a.reason}</p>}
          {statusMap[a.id] === "pending" && (
            <div className="mt-3 flex gap-2">
              <Button onClick={() => handle(a.id, "approved")} size="sm">Approve</Button>
              <Button onClick={() => handle(a.id, "rejected")} variant="outline" size="sm">Reject</Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
