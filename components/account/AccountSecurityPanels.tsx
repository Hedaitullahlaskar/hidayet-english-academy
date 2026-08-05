"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { revokeSession } from "@/lib/account/repository";

interface LoginRecord {
  id: string;
  method: string;
  user_agent: string | null;
  created_at: string;
}

export function LoginHistoryList({ history }: { history: LoginRecord[] }) {
  const methodLabels: Record<string, string> = {
    password: "Password",
    otp_email: "Email OTP",
    otp_phone: "Mobile OTP",
    google: "Google",
  };

  return (
    <div className="space-y-2">
      {history.map((h) => (
        <div key={h.id} className="flex items-center justify-between rounded-lg border border-navy-100 bg-white p-3 text-sm shadow-card dark:border-navy-700 dark:bg-navy-800">
          <div>
            <Badge tone="outline">{methodLabels[h.method] ?? h.method}</Badge>
            <p className="mt-1 text-xs text-navy-500 dark:text-navy-400">{h.user_agent ?? "Unknown device"}</p>
          </div>
          <span className="text-xs text-navy-500 dark:text-navy-400">{new Date(h.created_at).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

interface SessionRecord {
  id: string;
  device_label: string | null;
  user_agent: string | null;
  last_active_at: string;
}

export function DeviceSessionList({ sessions }: { sessions: SessionRecord[] }) {
  const [revoked, setRevoked] = useState<Set<string>>(new Set());

  async function handleRevoke(id: string) {
    const result = await revokeSession(id);
    if (result.success) setRevoked((prev) => new Set(prev).add(id));
  }

  const visible = sessions.filter((s) => !revoked.has(s.id));

  return (
    <div className="space-y-2">
      {visible.map((s) => (
        <div key={s.id} className="flex items-center justify-between rounded-lg border border-navy-100 bg-white p-3 text-sm shadow-card dark:border-navy-700 dark:bg-navy-800">
          <div>
            <p className="font-semibold text-navy-800 dark:text-navy-100">{s.device_label ?? "Unknown device"}</p>
            <p className="text-xs text-navy-500 dark:text-navy-400">Active {new Date(s.last_active_at).toLocaleString()}</p>
          </div>
          <button onClick={() => handleRevoke(s.id)} className="text-xs font-semibold text-error underline">
            Sign Out This Device
          </button>
        </div>
      ))}
    </div>
  );
}
