import { handlers } from "@/lib/auth";
import type { NextRequest } from "next/server";

// NextAuth v5 catch-all route handler
// This handles ALL auth routes including /api/auth/signin/google, /api/auth/callback/google, etc.
const { GET: authGET, POST: authPOST } = handlers;

export async function GET(req: NextRequest) {
  return authGET(req);
}

export async function POST(req: NextRequest) {
  return authPOST(req);
}
