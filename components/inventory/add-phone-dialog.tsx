"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createPhone } from "@/app/actions/phones";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UploadButton } from "@/lib/uploadthing";
import { Plus } from "lucide-react";

export function AddPhoneDialog() {
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    storage: "",
    variant: "",
    condition: "",
    description: "",
    boughtPrice: "",
    sellingPrice: "",
    dateBought: new Date().toISOString().split("T")[0],
    images: [] as string[],
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session?.user?.id) return;

    setLoading(true);
    try {
      await createPhone(session.user.id, {
        name: formData.name,
        storage: formData.storage || undefined,
        variant: formData.variant || undefined,
        condition: formData.condition,
        description: formData.description || undefined,
        boughtPrice: parseFloat(formData.boughtPrice),
        sellingPrice: parseFloat(formData.sellingPrice),
        dateBought: new Date(formData.dateBought),
        images: formData.images,
      });
      setOpen(false);
      setFormData({
        name: "",
        storage: "",
        variant: "",
        condition: "",
        description: "",
        boughtPrice: "",
        sellingPrice: "",
        dateBought: new Date().toISOString().split("T")[0],
        images: [],
      });
      router.refresh();
    } catch (error: any) {
      alert(error.message || "Failed to create phone");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Phone
        </Button>
      </DialogTrigger>
      <DialogContent className="!max-h-[calc(100vh-2rem)] !w-[calc(100vw-1rem)] sm:!w-auto overflow-hidden flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle>Add New Phone</DialogTitle>
          <DialogDescription>Add a phone to your inventory</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pr-1 overflow-y-auto flex-1 min-h-0">
          <div className="space-y-2">
            <Label htmlFor="name">Phone Model *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., iPhone 13 Pro Max"
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="storage">Storage</Label>
              <Input
                id="storage"
                value={formData.storage}
                onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                placeholder="e.g., 128GB"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="variant">Color/Variant</Label>
              <Input
                id="variant"
                value={formData.variant}
                onChange={(e) => setFormData({ ...formData, variant: e.target.value })}
                placeholder="e.g., Blue"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="condition">Condition *</Label>
            <Input
              id="condition"
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              placeholder="e.g., Mint, Good, Green lines"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Additional details..."
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="boughtPrice">Bought Price (₱) *</Label>
              <Input
                id="boughtPrice"
                type="number"
                step="0.01"
                value={formData.boughtPrice}
                onChange={(e) => setFormData({ ...formData, boughtPrice: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sellingPrice">Selling Price (₱) *</Label>
              <Input
                id="sellingPrice"
                type="number"
                step="0.01"
                value={formData.sellingPrice}
                onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateBought">Date Bought *</Label>
            <Input
              id="dateBought"
              type="date"
              value={formData.dateBought}
              onChange={(e) => setFormData({ ...formData, dateBought: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Images</Label>
            <div className="rounded-lg border border-dashed p-4 bg-muted/50">
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  console.log("Upload complete:", res);
                  if (res && res.length > 0) {
                    const newUrls = res.map((r) => r.url);
                    console.log("New image URLs:", newUrls);
                    setFormData((prev) => ({
                      ...prev,
                      images: [...prev.images, ...newUrls],
                    }));
                  }
                }}
                onUploadError={(error) => {
                  console.error("Upload error:", error);
                  alert(`Upload failed: ${error.message}`);
                }}
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Click to upload images (max 10, 4MB each)
              </p>
            </div>
            {formData.images.length > 0 && (
              <div className="mt-2 space-y-2">
                <p className="text-sm text-muted-foreground">
                  {formData.images.length} image(s) uploaded
                </p>
                <div className="flex flex-wrap gap-2">
                  {formData.images.map((url, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={url}
                        alt={`Upload ${idx + 1}`}
                        className="h-20 w-20 rounded object-cover border"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            images: formData.images.filter((_, i) => i !== idx),
                          });
                        }}
                        className="absolute -top-2 -right-2 rounded-full bg-red-500 text-white p-1 opacity-70 group-hover:opacity-100 active:opacity-100 transition-opacity"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Adding..." : "Add Phone"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

