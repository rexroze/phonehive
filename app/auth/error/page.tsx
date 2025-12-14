"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

const errorMessages: Record<string, string> = {
  Configuration: "There's a problem with the server configuration. Please contact support.",
  AccessDenied: "You don't have permission to sign in.",
  Verification: "The verification token has expired or has already been used.",
  Default: "An error occurred during sign in. Please try again.",
  OAuthSignin: "Error occurred during Google sign in. Please try again.",
  OAuthCallback: "Error occurred during Google sign in callback. Please try again.",
  OAuthCreateAccount: "Could not create account with Google. Please try again.",
  EmailCreateAccount: "Could not create account. This email may already be in use.",
  Callback: "Error occurred during sign in. Please try again.",
  OAuthAccountNotLinked: "This email is already associated with another account. Please sign in with your original method.",
  EmailSignin: "The email could not be sent. Please check your email address.",
  CredentialsSignin: "Invalid email or password. Please check your credentials and try again.",
  SessionRequired: "Please sign in to access this page.",
};

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const errorMessage = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default;

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle className="text-2xl">Sign In Error</CardTitle>
          </div>
          <CardDescription>{errorMessage}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error === "Configuration" && (
            <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4">
              <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                Configuration Error - Common Causes:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-yellow-600 dark:text-yellow-500">
                <li>Missing or invalid AUTH_SECRET in .env file</li>
                <li>Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET</li>
                <li>Redirect URI mismatch in Google Console</li>
                <li>OAuth consent screen not configured</li>
              </ul>
              <p className="mt-3 text-xs text-yellow-600 dark:text-yellow-500">
                See <code className="rounded bg-yellow-100 px-1 py-0.5 dark:bg-yellow-900">GOOGLE_OAUTH_SETUP.md</code> for detailed setup instructions.
              </p>
            </div>
          )}
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground">
              {error && error !== "Default" && (
                <>
                  Error code: <code className="text-xs">{error}</code>
                </>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild className="flex-1">
              <Link href="/auth/signin">Try Again</Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  );
}

