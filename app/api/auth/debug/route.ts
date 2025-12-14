import { NextResponse } from "next/server";

export async function GET() {
  // Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  const config = {
    hasAuthSecret: !!process.env.AUTH_SECRET,
    authSecretLength: process.env.AUTH_SECRET?.length || 0,
    hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
    hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    googleClientIdPreview: process.env.GOOGLE_CLIENT_ID
      ? `${process.env.GOOGLE_CLIENT_ID.substring(0, 20)}...`
      : "Not set",
    authUrl: process.env.AUTH_URL || "Not set",
    nodeEnv: process.env.NODE_ENV,
  };

  return NextResponse.json(config, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}



