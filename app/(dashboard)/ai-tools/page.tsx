import { auth } from "@/lib/auth";
import { AIToolsPanel } from "@/components/ai/ai-tools-panel";

export default async function AIToolsPage() {
  const session = await auth();
  if (!session) return null;

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

