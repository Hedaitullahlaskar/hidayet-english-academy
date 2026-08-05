"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { createCoupon, toggleCoupon, updateRefundStatus } from "@/lib/admin/repository";

export function CreateCouponForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(10);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (code.trim().length < 3) return setError("Enter a coupon code.");
    setStatus("saving");
    const result = await createCoupon({ code: code.trim().toUpperCase(), discount_percent: discount });
    if (!result.success) {
      setStatus("error");
      setError(result.error ?? "Something went wrong.");
      return;
    }
    setCode("");
    setStatus("idle");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
      <div>
        <label className="mb-1 block text-xs font-semibold text-navy-700 dark:text-navy-200">Code</label>
        <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="WELCOME20" className="rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-navy-700 dark:text-navy-200">Discount %</label>
        <input type="number" min={1} max={100} value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="w-24 rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white" />
      </div>
      <Button type="submit" size="sm" disabled={status === "saving"}>Create Coupon</Button>
      {error && <p role="alert" className="w-full text-xs font-medium text-error">{error}</p>}
    </form>
  );
}

export function CouponList({ coupons }: { coupons: { id: string; code: string; discount_percent: number; active: boolean; used_count: number }[] }) {
  const [activeMap, setActiveMap] = useState(Object.fromEntries(coupons.map((c) => [c.id, c.active])));
  async function toggle(id: string) {
    const next = !activeMap[id];
    const result = await toggleCoupon(id, next);
    if (result.success) setActiveMap((p) => ({ ...p, [id]: next }));
  }
  return (
    <div className="mt-4 space-y-2">
      {coupons.map((c) => (
        <div key={c.id} className="flex items-center justify-between rounded-lg border border-navy-100 bg-white p-3 text-sm shadow-card dark:border-navy-700 dark:bg-navy-800">
          <span className="font-mono font-semibold text-navy-900 dark:text-white">{c.code}</span>
          <span className="text-navy-600 dark:text-navy-300">{c.discount_percent}% off · used {c.used_count}x</span>
          <div className="flex items-center gap-2">
            <Badge tone={activeMap[c.id] ? "success" : "outline"}>{activeMap[c.id] ? "Active" : "Off"}</Badge>
            <button onClick={() => toggle(c.id)} className="text-xs font-semibold text-gold-800 underline dark:text-gold-400">Toggle</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function RefundRequestList({ refunds }: { refunds: { id: string; amount: number | null; currency: string; reason: string | null; status: string; profiles: { full_name: string } | null }[] }) {
  const [statusMap, setStatusMap] = useState(Object.fromEntries(refunds.map((r) => [r.id, r.status])));
  async function handle(id: string, decision: "approved" | "rejected") {
    const result = await updateRefundStatus(id, decision);
    if (result.success) setStatusMap((p) => ({ ...p, [id]: decision }));
  }
  return (
    <div className="space-y-3">
      {refunds.map((r) => (
        <div key={r.id} className="rounded-lg border border-navy-100 bg-white p-4 shadow-card dark:border-navy-700 dark:bg-navy-800">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-navy-900 dark:text-white">{r.profiles?.full_name ?? "Student"}</p>
              <p className="text-xs text-navy-500 dark:text-navy-400">{r.amount ? `${r.currency} ${r.amount}` : "Amount TBD"} · {r.reason ?? "No reason given"}</p>
            </div>
            <Badge tone={statusMap[r.id] === "pending" ? "gold" : statusMap[r.id] === "approved" ? "success" : "outline"}>{statusMap[r.id]}</Badge>
          </div>
          {statusMap[r.id] === "pending" && (
            <div className="mt-3 flex gap-2">
              <Button onClick={() => handle(r.id, "approved")} size="sm">Approve</Button>
              <Button onClick={() => handle(r.id, "rejected")} variant="outline" size="sm">Reject</Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
