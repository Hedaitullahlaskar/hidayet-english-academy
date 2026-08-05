import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/auth/rateLimit";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { identifier, action } = body as { identifier?: string; action?: string };

  if (!identifier || (action !== "otp_request" && action !== "password_reset_request")) {
    return NextResponse.json({ allowed: false, error: "Invalid request" }, { status: 400 });
  }

  const result = await checkRateLimit(identifier, action);
  return NextResponse.json(result);
}
