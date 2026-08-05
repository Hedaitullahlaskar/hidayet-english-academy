/**
 * Formats a UTC timestamp into a specific IANA timezone — built on
 * Intl.DateTimeFormat (native to JS, no library needed). This is what
 * makes "timezone support for international students" real rather than
 * a `profiles.timezone` column nobody actually reads: every live-class
 * time display should call this with the viewer's own timezone, not rely
 * on the browser's local timezone via a bare `toLocaleString()`.
 */
export function formatInTimezone(isoString: string, timezone: string, options?: Intl.DateTimeFormatOptions): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: timezone,
      ...options,
    }).format(new Date(isoString));
  } catch {
    // An invalid/unrecognized timezone string shouldn't crash the page —
    // fall back to a UTC-labeled render so the time is still honest,
    // just not localized.
    return `${new Date(isoString).toUTCString()} (UTC)`;
  }
}

export function getTimezoneAbbreviation(timezone: string): string {
  try {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: timezone, timeZoneName: "short" }).formatToParts(new Date());
    return parts.find((p) => p.type === "timeZoneName")?.value ?? timezone;
  } catch {
    return timezone;
  }
}

export const COMMON_TIMEZONES = [
  { value: "Asia/Kolkata", label: "India (IST)" },
  { value: "Asia/Dhaka", label: "Bangladesh (BST)" },
  { value: "Asia/Dubai", label: "Gulf (GST)" },
  { value: "Europe/London", label: "UK (GMT/BST)" },
  { value: "America/New_York", label: "US Eastern" },
  { value: "America/Los_Angeles", label: "US Pacific" },
  { value: "Australia/Sydney", label: "Australia Eastern" },
];
