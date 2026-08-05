import type { Metadata } from "next";
import { AIAssistantView } from "@/components/ai/AIAssistantView";

// This page needs interactive client-side state (mode switching, live
// chat), which meant the whole file was "use client" — and Next.js
// silently ignores a `metadata` export from any Client Component, so the
// noindex directive below was never actually applied. Splitting the
// interactive logic into its own component and keeping this file a plain
// Server Component is what makes metadata actually take effect.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function AIAssistantPage() {
  return <AIAssistantView />;
}
