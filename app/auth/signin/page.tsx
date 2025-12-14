"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    // Check for registration success message
    if (searchParams.get("registered") === "true") {
      setError("");
      // Show success message (you can add a success state if needed)
    }
    
    // Check for error from OAuth
    const errorParam = searchParams.get("error");
    if (errorParam) {
      const errorMessages: Record<string, string> = {
        Configuration: "Server configuration error. Please contact support.",
        AccessDenied: "Access denied.",
        Verification: "Verification failed.",
        EmailCreateAccount: "Could not create account.",
        Callback: "Sign in failed. Please try again.",
        EmailSignin: "Email sign in failed.",
        CredentialsSignin: "Invalid email or password.",
        SessionRequired: "Please sign in to continue.",
      };
      setError(errorMessages[errorParam] || "An error occurred. Please try again.");
    }
  }, [searchParams]);

  useEffect(() => {
    // Fetch CSRF token from NextAuth
    fetch("/api/auth/csrf")
      .then((res) => res.json())
      .then((data) => {
        if (data.csrfToken) {
          setCsrfToken(data.csrfToken);
        }
      })
      .catch(() => {
        // CSRF token will be handled automatically by NextAuth v5
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const response = await fetch("/api/auth/signin", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        const data = await response.json().catch(() => ({}));
        // Clean error message - remove URLs and technical details
        let errorMsg = data.error || "Invalid email or password";
        if (errorMsg.includes("http") || errorMsg.includes("://") || errorMsg.includes("errors.authjs.dev")) {
          errorMsg = "Invalid email or password. Please check your credentials and try again.";
        }
        setError(errorMsg);
      }
    } catch (err: any) {
      let errorMsg = "Something went wrong. Please try again.";
      if (err.message && !err.message.includes("http") && !err.message.includes("://")) {
        errorMsg = err.message;
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>Welcome back to PhoneHive</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <SignInForm />
    </Suspense>
  );
}

