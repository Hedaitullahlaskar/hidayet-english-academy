import "server-only";

/**
 * A Google Meet link is a side effect of creating a Google Calendar event
 * with conferenceData.createRequest set — there's no separate "Meet API."
 * Implemented as two plain fetch() calls (OAuth token refresh, then
 * Calendar API insert) rather than pulling in the full `googleapis` SDK,
 * which is a genuinely large dependency for what's really two REST calls.
 */

export function isGoogleMeetConfigured(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN);
}

async function getAccessToken(): Promise<string> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN!,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) throw new Error(`Google OAuth token refresh failed: ${res.status}`);
  const data = await res.json();
  return data.access_token;
}

export async function createGoogleMeetLink(
  title: string,
  startTimeIso: string,
  durationMinutes: number
): Promise<{ meetingUrl: string; meetingId: string }> {
  const accessToken = await getAccessToken();
  const endTime = new Date(new Date(startTimeIso).getTime() + durationMinutes * 60 * 1000).toISOString();

  const res = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        summary: title,
        start: { dateTime: startTimeIso },
        end: { dateTime: endTime },
        conferenceData: {
          createRequest: {
            requestId: `hea-${Date.now()}`,
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
      }),
    }
  );

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Google Calendar API error: ${res.status} ${errorBody}`);
  }

  const event = await res.json();
  const meetingUrl = event.conferenceData?.entryPoints?.find((e: { entryPointType: string }) => e.entryPointType === "video")?.uri;

  if (!meetingUrl) throw new Error("Google Calendar didn't return a Meet link.");

  return { meetingUrl, meetingId: event.id };
}
