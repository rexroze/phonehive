import { NextRequest, NextResponse } from "next/server";
import { signIn } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      // Map NextAuth errors to user-friendly messages
      let errorMessage = "Invalid email or password";
      if (result.error === "CredentialsSignin") {
        errorMessage = "Invalid email or password. Please check your credentials and try again.";
      } else if (result.error.includes("http")) {
        errorMessage = "Sign in failed. Please try again.";
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Sign in error:", error);
    // Clean up error message - remove URLs and technical details
    let errorMessage = "Sign in failed. Please try again.";
    if (error.message && !error.message.includes("http") && !error.message.includes("://")) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

