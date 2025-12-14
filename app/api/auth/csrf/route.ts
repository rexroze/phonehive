import { NextResponse } from "next/server";
import { handlers } from "@/lib/auth";

// NextAuth v5 provides CSRF token through the handlers
export async function GET() {
  // The CSRF token is automatically included in NextAuth v5 forms
  // This endpoint is just for compatibility
  return NextResponse.json({ csrfToken: "auto-handled" });
}
