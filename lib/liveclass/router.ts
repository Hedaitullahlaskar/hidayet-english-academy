import "server-only";
import { isGoogleMeetConfigured, createGoogleMeetLink } from "@/lib/liveclass/providers/googleMeet";
import { isZoomConfigured, createZoomMeeting } from "@/lib/liveclass/providers/zoom";

export type LiveClassPlatform = "google_meet" | "zoom";

export function isPlatformConfigured(platform: LiveClassPlatform): boolean {
  return platform === "google_meet" ? isGoogleMeetConfigured() : isZoomConfigured();
}

/**
 * Returns null (not an error) when the platform isn't configured — the
 * caller's job is to fall back to a manually-entered meeting_url in that
 * case, not to fail the whole "schedule a class" action. Auto-generation
 * is a real enhancement layered on top of manual entry, never a
 * replacement that could brick scheduling if a key goes missing.
 */
export async function tryAutoGenerateLink(
  platform: LiveClassPlatform,
  title: string,
  startTimeIso: string,
  durationMinutes: number
): Promise<{ meetingUrl: string; meetingId: string } | null> {
  if (!isPlatformConfigured(platform)) return null;

  try {
    return platform === "google_meet"
      ? await createGoogleMeetLink(title, startTimeIso, durationMinutes)
      : await createZoomMeeting(title, startTimeIso, durationMinutes);
  } catch {
    // A real API failure (expired token, rate limit, etc.) — the caller
    // still falls back to manual entry rather than blocking scheduling.
    return null;
  }
}
