import { NextResponse } from "next/server";
import { signOut } from "@/lib/auth";

export async function POST() {
  await signOut({ redirectTo: "/auth/signin" });
  return NextResponse.json({ success: true });
}

