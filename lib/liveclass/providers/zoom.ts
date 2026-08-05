import "server-only";

/**
 * Zoom's Server-to-Server OAuth app type — Zoom's current recommended
 * approach for server automation with no per-user consent flow. Same
 * plain-fetch pattern as the Google Meet provider, for consistency.
 */

export function isZoomConfigured(): boolean {
  return Boolean(process.env.ZOOM_ACCOUNT_ID && process.env.ZOOM_CLIENT_ID && process.env.ZOOM_CLIENT_SECRET);
}

async function getAccessToken(): Promise<string> {
  const credentials = Buffer.from(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`).toString("base64");

  const res = await fetch(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`,
    {
      method: "POST",
      headers: { Authorization: `Basic ${credentials}` },
    }
  );

  if (!res.ok) throw new Error(`Zoom OAuth token request failed: ${res.status}`);
  const data = await res.json();
  return data.access_token;
}

export async function createZoomMeeting(
  title: string,
  startTimeIso: string,
  durationMinutes: number
): Promise<{ meetingUrl: string; meetingId: string }> {
  const accessToken = await getAccessToken();

  const res = await fetch("https://api.zoom.us/v2/users/me/meetings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      topic: title,
      type: 2, // scheduled meeting
      start_time: startTimeIso,
      duration: durationMinutes,
      settings: {
        join_before_host: false,
        waiting_room: true,
        approval_type: 2, // no registration required
      },
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Zoom API error: ${res.status} ${errorBody}`);
  }

  const meeting = await res.json();
  return { meetingUrl: meeting.join_url, meetingId: String(meeting.id) };
}
