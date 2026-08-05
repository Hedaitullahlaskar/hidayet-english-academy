"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

const exportable = ["profiles", "enrollments", "admin_courses", "certificates", "coupons"];

export function DataExportPanel() {
  const [downloading, setDownloading] = useState<string | null>(null);

  async function handleExport(table: string) {
    setDownloading(table);
    try {
      const res = await fetch(`/api/admin/export?table=${table}`);
      const json = await res.json();
      const blob = new Blob([JSON.stringify(json.data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${table}-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(null);
    }
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {exportable.map((table) => (
        <div key={table} className="flex items-center justify-between rounded-lg border border-navy-100 bg-white p-4 shadow-card dark:border-navy-700 dark:bg-navy-800">
          <span className="font-mono text-sm text-navy-800 dark:text-navy-100">{table}</span>
          <Button onClick={() => handleExport(table)} size="sm" variant="outline" disabled={downloading === table}>
            {downloading === table ? "Exporting…" : "Export JSON"}
          </Button>
        </div>
      ))}
    </div>
  );
}
