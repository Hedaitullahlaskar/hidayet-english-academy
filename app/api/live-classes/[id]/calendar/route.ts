import { NextResponse } from "next/server";
import { getLiveClassById } from "@/lib/dashboard/repository";
import { generateIcsFile } from "@/lib/liveclass/ics";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// Defense in depth, same as the other /api routes: the `live_classes` RLS
// policy already restricts the underlying query to enrolled students and
// staff, but a route handler shouldn't rely on RLS being the only check.
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const liveClass = await getLiveClassById(params.id);
  if (!liveClass) return NextResponse.json({ error: "Class not found" }, { status: 404 });

  const ics = generateIcsFile({
    uid: liveClass.id,
    title: liveClass.title,
    description: `Join at: ${liveClass.meeting_url ?? "Link to be confirmed"}`,
    startTimeIso: liveClass.scheduled_at,
    durationMinutes: liveClass.duration_minutes,
    location: liveClass.meeting_url ?? "Online",
  });

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${liveClass.title.replace(/[^a-z0-9]/gi, "-")}.ics"`,
    },
  });
}
