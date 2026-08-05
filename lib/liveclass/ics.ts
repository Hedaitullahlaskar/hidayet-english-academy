import "server-only";

/**
 * Generates a real, valid iCalendar (.ics) file — plain text format, no
 * library or API key needed. This is what "calendar integration" means
 * concretely here: a student clicks "Add to Calendar," gets a real .ics
 * file their phone or Google/Outlook/Apple Calendar opens directly.
 */
export function generateIcsFile(event: {
  uid: string;
  title: string;
  description: string;
  startTimeIso: string;
  durationMinutes: number;
  location: string;
}): string {
  const start = toIcsDate(event.startTimeIso);
  const end = toIcsDate(new Date(new Date(event.startTimeIso).getTime() + event.durationMinutes * 60 * 1000).toISOString());
  const now = toIcsDate(new Date().toISOString());

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Hidayet English Academy//Live Classes//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.uid}@hidayetenglishacademy.com`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `DESCRIPTION:${escapeIcsText(event.description)}`,
    `LOCATION:${escapeIcsText(event.location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function toIcsDate(isoString: string): string {
  return new Date(isoString).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function escapeIcsText(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");
}
