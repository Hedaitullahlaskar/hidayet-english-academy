"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { markIntegrationConfigured } from "@/lib/admin/repository";

interface IntegrationRow {
  key: string;
  label: string;
  envVarHint: string;
}

export function IntegrationStatusGrid({
  integrations,
  configuredMap,
}: {
  integrations: IntegrationRow[];
  configuredMap: Record<string, boolean>;
}) {
  const [statusMap, setStatusMap] = useState(configuredMap);
  const [pending, setPending] = useState<string | null>(null);

  async function handleConfirm(key: string) {
    setPending(key);
    const result = await markIntegrationConfigured(key, true);
    if (result.success) setStatusMap((prev) => ({ ...prev, [key]: true }));
    setPending(null);
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {integrations.map((i) => (
        <div key={i.key} className="rounded-lg border border-navy-100 bg-white p-5 shadow-card dark:border-navy-700 dark:bg-navy-800">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-navy-900 dark:text-white">{i.label}</p>
            <Badge tone={statusMap[i.key] ? "success" : "outline"}>{statusMap[i.key] ? "Configured" : "Not Set Up"}</Badge>
          </div>
          <p className="mt-2 font-mono text-xs text-navy-500 dark:text-navy-400">{i.envVarHint}</p>
          <p className="mt-2 text-xs text-navy-600 dark:text-navy-300">
            Set the real value as an environment variable at deploy time — it&apos;s never entered or stored here.
          </p>
          {!statusMap[i.key] && (
            <button
              onClick={() => handleConfirm(i.key)}
              disabled={pending === i.key}
              className="mt-3 text-xs font-semibold text-gold-800 underline dark:text-gold-400"
            >
              {pending === i.key ? "…" : "Mark as configured (once the env var is set)"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
