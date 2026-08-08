/**
 * Every Media Manager function in media-repository.ts is a server action,
 * callable directly with arbitrary arguments by anyone with a valid staff
 * session, not just through MediaManager.tsx's own UI (which only ever
 * passes back a path it already got from listMedia/listTrash — a UI-level
 * guarantee, not a server-side one). `..` segments can't actually escape
 * the site-content bucket the way filesystem traversal would — every call
 * is pinned to one bucket — but rejecting them anyway is a real, free
 * hardening step, not just theater. A plain module (not "use server",
 * which only allows async exports) so this stays directly testable.
 */
export function isSafePath(path: string): boolean {
  return !path.startsWith("/") && !path.split("/").includes("..");
}
