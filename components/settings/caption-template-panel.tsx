"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getCaptionTemplate, updateCaptionTemplate } from "@/app/actions/settings";
import { useSession } from "next-auth/react";

export function CaptionTemplatePanel() {
  const { data: session } = useSession();
  const [template, setTemplate] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadTemplate() {
      if (!session?.user?.id) return;
      setLoading(true);
      try {
        const currentTemplate = await getCaptionTemplate(session.user.id);
        setTemplate(currentTemplate);
      } catch (error) {
        console.error("Failed to load template:", error);
      } finally {
        setLoading(false);
      }
    }
    loadTemplate();
  }, [session?.user?.id]);

  async function handleSave() {
    if (!session?.user?.id) return;
    setSaving(true);
    try {
      await updateCaptionTemplate(session.user.id, template);
      alert("Template saved successfully!");
    } catch (error: any) {
      alert(error.message || "Failed to save template");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Caption Template</CardTitle>
        <CardDescription>
          Set a custom template for AI caption generation. The AI will follow your style and format.
          Use placeholders like {"{model}"}, {"{condition}"}, {"{storage}"}, {"{variant}"} if needed.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Template</Label>
          <Textarea
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            placeholder="Example:&#10;&#10;{model} with {condition}&#10;&#10;{model} 5G (Year Flagship Phone)&#10;&#10;OneUI Version Ready&#10;RAM Size&#10;Storage Size&#10;Camera Specs&#10;Special Features (Samsung Dex, Dual Sim, etc.)&#10;&#10;Issue: {condition issues}&#10;&#10;Market Price(No issue): Price Range&#10;My Selling Price: Your Price&#10;price is negotiable for pickup buyers&#10;lowballers wont be entertained&#10;&#10;loc: your location&#10;can do meetups&#10;&#10;#forsale #sulit #phonesph"
            className="min-h-[200px] font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Leave empty to use default AI-generated captions. The template will guide the AI's style and structure.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving || loading}>
          {saving ? "Saving..." : "Save Template"}
        </Button>
      </CardContent>
    </Card>
  );
}

