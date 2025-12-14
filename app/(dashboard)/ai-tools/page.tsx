import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AIToolsPanel } from "@/components/ai/ai-tools-panel";

export default async function AIToolsPage() {
  const session = await auth();
  if (!session) {
    redirect("/auth/signin");
  }

  // Check if user has access to AI tools (PREMIUM or ADMIN)
  const userRole = (session.user as any)?.role;
  if (userRole !== "PREMIUM" && userRole !== "ADMIN") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">AI Tools</h1>
          <p className="text-muted-foreground">
            Generate captions, tags, and price suggestions using AI
          </p>
        </div>
        <div className="rounded-lg border bg-card p-8 text-center">
          <h2 className="text-2xl font-semibold mb-2">Premium Feature</h2>
          <p className="text-muted-foreground mb-4">
            AI Tools are only available for Premium and Admin users.
          </p>
          <p className="text-sm text-muted-foreground">
            Please upgrade to Premium to access AI-powered features.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Tools</h1>
        <p className="text-muted-foreground">
          Generate captions, tags, and price suggestions using AI
        </p>
      </div>
      <AIToolsPanel />
    </div>
  );
}

