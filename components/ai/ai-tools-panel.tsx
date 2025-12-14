"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  generateCaption,
  generateTags,
  getPriceSuggestion,
  getAutoFillInfo,
} from "@/app/actions/ai";
import { getCaptionTemplate } from "@/app/actions/settings";
import { useSession } from "next-auth/react";

export function AIToolsPanel() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    model: "",
    storage: "",
    variant: "",
    condition: "",
    ram: "",
  });
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [priceSuggestion, setPriceSuggestion] = useState<any>(null);
  const [autoFill, setAutoFill] = useState<any>(null);
  const [marketplaceMin, setMarketplaceMin] = useState("");
  const [marketplaceMax, setMarketplaceMax] = useState("");
  const [captionTemplate, setCaptionTemplate] = useState("");

  async function handleGenerateCaption() {
    if (!formData.model || !formData.condition) {
      alert("Please fill in model and condition");
      return;
    }
    if (!session?.user?.id) return;
    setLoading(true);
    try {
      // Use template from UI input, or fallback to saved template from settings
      let templateToUse = captionTemplate;
      if (!templateToUse) {
        try {
          templateToUse = await getCaptionTemplate(session.user.id);
        } catch (e) {
          // If no saved template, use undefined
          templateToUse = "";
        }
      }
      
      const result = await generateCaption(
        session.user.id,
        formData.model,
        formData.condition,
        formData.storage,
        formData.variant,
        formData.ram,
        templateToUse || undefined
      );
      setCaption(result);
    } catch (error: any) {
      alert(error.message || "Failed to generate caption. Please check your GEMINI_API_KEY in .env file.");
      console.error("Caption generation error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateTags() {
    if (!formData.model) {
      alert("Please fill in model");
      return;
    }
    if (!session?.user?.id) return;
    setLoading(true);
    try {
      const result = await generateTags(
        session.user.id,
        formData.model,
        formData.storage,
        formData.variant
      );
      setTags(result);
    } catch (error: any) {
      alert(error.message || "Failed to generate tags. Please check your GEMINI_API_KEY in .env file.");
      console.error("Tags generation error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleGetPriceSuggestion() {
    if (!formData.model || !formData.storage || !formData.condition) {
      alert("Please fill in model, storage, and condition");
      return;
    }
    if (!session?.user?.id) return;
    setLoading(true);
    try {
      const result = await getPriceSuggestion(
        session.user.id,
        formData.model,
        formData.storage,
        formData.condition,
        marketplaceMin ? parseFloat(marketplaceMin) : undefined,
        marketplaceMax ? parseFloat(marketplaceMax) : undefined
      );
      setPriceSuggestion(result);
    } catch (error: any) {
      alert(error.message || "Failed to get price suggestion. Please check your GEMINI_API_KEY in .env file.");
      console.error("Price suggestion error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAutoFill() {
    if (!formData.model) {
      alert("Please enter a phone model");
      return;
    }
    if (!session?.user?.id) return;
    setLoading(true);
    try {
      const result = await getAutoFillInfo(session.user.id, formData.model);
      setAutoFill(result);
      setFormData({
        ...formData,
        storage: result.storageOptions[0] || "",
        variant: result.colorVariants[0] || "",
        condition: result.conditionSuggestions?.[0] || formData.condition,
      });
      // Set marketplace range if available
      if (result.typicalPriceRange) {
        setMarketplaceMin(result.typicalPriceRange.min.toString());
        setMarketplaceMax(result.typicalPriceRange.max.toString());
      }
    } catch (error: any) {
      alert(error.message || "Failed to auto-fill. Please check your GEMINI_API_KEY in .env file.");
      console.error("Auto-fill error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Tabs defaultValue="caption" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="caption">Caption</TabsTrigger>
        <TabsTrigger value="tags">Tags</TabsTrigger>
        <TabsTrigger value="price">Price</TabsTrigger>
        <TabsTrigger value="autofill">Auto-fill</TabsTrigger>
      </TabsList>

      <TabsContent value="caption">
        <Card>
          <CardHeader>
            <CardTitle>AI Caption Generator</CardTitle>
            <CardDescription>
              Generate Facebook Marketplace optimized captions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Phone Model *</Label>
                <Input
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="e.g., iPhone 13 Pro Max"
                />
              </div>
              <div className="space-y-2">
                <Label>Condition *</Label>
                <Input
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  placeholder="e.g., Mint, Good, Green lines"
                />
              </div>
              <div className="space-y-2">
                <Label>Storage</Label>
                <Input
                  value={formData.storage}
                  onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                  placeholder="e.g., 128GB"
                />
              </div>
              <div className="space-y-2">
                <Label>RAM</Label>
                <Input
                  value={formData.ram}
                  onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
                  placeholder="e.g., 8GB, 12GB"
                />
              </div>
              <div className="space-y-2">
                <Label>Variant/Color</Label>
                <Input
                  value={formData.variant}
                  onChange={(e) => setFormData({ ...formData, variant: e.target.value })}
                  placeholder="e.g., Blue"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Template (Optional)</Label>
              <Textarea
                value={captionTemplate}
                onChange={(e) => setCaptionTemplate(e.target.value)}
                placeholder="Leave empty to use your saved template from Settings, or enter a custom template for this caption. Use {model}, {condition}, {storage}, {ram}, {variant} as placeholders."
                className="min-h-[100px] text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Optional: Enter a template to guide the caption style. Leave empty to use default or your saved template.
              </p>
            </div>
            <Button onClick={handleGenerateCaption} disabled={loading}>
              {loading ? "Generating..." : "Generate Caption"}
            </Button>
            {caption && (
              <div className="space-y-2">
                <Label>Generated Caption</Label>
                <Textarea value={caption} readOnly className="min-h-[200px]" />
                <Button
                  variant="outline"
                  onClick={() => navigator.clipboard.writeText(caption)}
                >
                  Copy
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="tags">
        <Card>
          <CardHeader>
            <CardTitle>AI Search Tags Generator</CardTitle>
            <CardDescription>Generate search keywords for marketplace listings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Phone Model *</Label>
                <Input
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="e.g., Samsung S22 Ultra"
                />
              </div>
              <div className="space-y-2">
                <Label>Storage</Label>
                <Input
                  value={formData.storage}
                  onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                  placeholder="e.g., 256GB"
                />
              </div>
              <div className="space-y-2">
                <Label>Variant/Color</Label>
                <Input
                  value={formData.variant}
                  onChange={(e) => setFormData({ ...formData, variant: e.target.value })}
                  placeholder="e.g., Black"
                />
              </div>
            </div>
            <Button onClick={handleGenerateTags} disabled={loading}>
              {loading ? "Generating..." : "Generate Search Tags"}
            </Button>
            {tags.length > 0 && (
              <div className="space-y-2">
                <Label>Generated Search Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, idx) => (
                    <span key={idx} className="rounded bg-primary/10 px-2 py-1 text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="space-y-2">
                  <Textarea
                    value={tags.join(", ")}
                    readOnly
                    className="min-h-[60px]"
                  />
                  <Button
                    variant="outline"
                    onClick={() => navigator.clipboard.writeText(tags.join(", "))}
                  >
                    Copy as Comma-Separated
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="price">
        <Card>
          <CardHeader>
            <CardTitle>AI Price Suggestion</CardTitle>
            <CardDescription>Get AI-powered price recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Phone Model *</Label>
                <Input
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="e.g., iPhone 13 Pro Max"
                />
              </div>
              <div className="space-y-2">
                <Label>Storage *</Label>
                <Input
                  value={formData.storage}
                  onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                  placeholder="e.g., 128GB"
                />
              </div>
              <div className="space-y-2">
                <Label>Condition *</Label>
                <Input
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  placeholder="e.g., Mint"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Marketplace Min Price (₱) - Optional</Label>
                <Input
                  type="number"
                  value={marketplaceMin}
                  onChange={(e) => setMarketplaceMin(e.target.value)}
                  placeholder="e.g., 20000"
                />
                <p className="text-xs text-muted-foreground">
                  Minimum price you see on marketplace for similar phones
                </p>
              </div>
              <div className="space-y-2">
                <Label>Marketplace Max Price (₱) - Optional</Label>
                <Input
                  type="number"
                  value={marketplaceMax}
                  onChange={(e) => setMarketplaceMax(e.target.value)}
                  placeholder="e.g., 35000"
                />
                <p className="text-xs text-muted-foreground">
                  Maximum price you see on marketplace for similar phones
                </p>
              </div>
            </div>
            <Button onClick={handleGetPriceSuggestion} disabled={loading}>
              {loading ? "Getting suggestions..." : "Get Price Suggestions"}
            </Button>
            {priceSuggestion && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Suggested</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">₱{priceSuggestion.suggested.toLocaleString()}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Rush Price</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">₱{priceSuggestion.rush.toLocaleString()}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Safe Price</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">₱{priceSuggestion.safe.toLocaleString()}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">High Price</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">₱{priceSuggestion.high.toLocaleString()}</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="autofill">
        <Card>
          <CardHeader>
            <CardTitle>AI Auto-fill</CardTitle>
            <CardDescription>Auto-fill phone information based on model</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Phone Model *</Label>
              <Input
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="e.g., Galaxy S21+"
              />
            </div>
            <Button onClick={handleAutoFill} disabled={loading}>
              {loading ? "Auto-filling..." : "Auto-fill"}
            </Button>
            {autoFill && (
              <div className="space-y-4">
                <div>
                  <Label>Storage Options</Label>
                  <div className="flex flex-wrap gap-2">
                    {autoFill.storageOptions?.map((opt: string, idx: number) => (
                      <span key={idx} className="rounded bg-primary/10 px-2 py-1 text-sm">
                        {opt}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Color Variants</Label>
                  <div className="flex flex-wrap gap-2">
                    {autoFill.colorVariants?.map((variant: string, idx: number) => (
                      <span key={idx} className="rounded bg-primary/10 px-2 py-1 text-sm">
                        {variant}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Common Issues</Label>
                  <div className="flex flex-wrap gap-2">
                    {autoFill.commonIssues?.map((issue: string, idx: number) => (
                      <span key={idx} className="rounded bg-primary/10 px-2 py-1 text-sm">
                        {issue}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Condition Suggestions</Label>
                  <div className="flex flex-wrap gap-2">
                    {autoFill.conditionSuggestions?.map((condition: string, idx: number) => (
                      <span key={idx} className="rounded bg-primary/10 px-2 py-1 text-sm">
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Typical Price Range (Marketplace)</Label>
                  <p className="text-lg font-semibold">
                    ₱{autoFill.typicalPriceRange?.min.toLocaleString()} - ₱
                    {autoFill.typicalPriceRange?.max.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    This range has been auto-filled in the Price Suggestion tab
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

