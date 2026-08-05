import type { Metadata } from "next";
import { NotificationBroadcastView } from "@/components/admin/NotificationBroadcastView";

// Same fix as the AI Assistant page: this needed client-side form state,
// which meant Next.js was silently ignoring the noindex metadata below.
// Splitting the interactive logic out is what makes it actually apply.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function AdminNotificationsPage() {
  return <NotificationBroadcastView />;
}
