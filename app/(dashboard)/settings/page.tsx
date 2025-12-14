import { auth } from "@/lib/auth";
import { SettingsPanel } from "@/components/settings/settings-panel";
import { ExportPanel } from "@/components/settings/export-panel";
import { CaptionTemplatePanel } from "@/components/settings/caption-template-panel";

export default async function SettingsPage() {
  const session = await auth();
  if (!session) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>
      <SettingsPanel user={session.user} />
      <CaptionTemplatePanel />
      <ExportPanel />
    </div>
  );
}

