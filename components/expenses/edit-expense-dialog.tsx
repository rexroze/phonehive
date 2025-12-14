"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateExpense } from "@/app/actions/expenses";
import { useRouter } from "next/navigation";
import { Expense } from "@prisma/client";
import { Pencil } from "lucide-react";

export function EditExpenseDialog({
  expense,
  userId,
  open,
  onOpenChange,
}: {
  expense: Expense;
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: expense.title,
    amount: expense.amount.toString(),
    category: expense.category,
    date: new Date(expense.date).toISOString().split("T")[0],
  });

  // Update form data when expense changes
  useEffect(() => {
    setFormData({
      title: expense.title,
      amount: expense.amount.toString(),
      category: expense.category,
      date: new Date(expense.date).toISOString().split("T")[0],
    });
    setError("");
  }, [expense, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Validate all fields
    if (!formData.title.trim()) {
      setError("Please enter a title");
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError("Please enter a valid amount greater than 0");
      return;
    }

    if (!formData.category) {
      setError("Please select a category");
      return;
    }

    if (!formData.date) {
      setError("Please select a date");
      return;
    }

    setLoading(true);
    try {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Invalid amount");
      }

      await updateExpense(expense.id, userId, {
        title: formData.title.trim(),
        amount: amount,
        category: formData.category,
        date: new Date(formData.date),
      });

      setError("");
      onOpenChange(false);
      router.refresh();
    } catch (error: any) {
      console.error("Error updating expense:", error);
      setError(error.message || "Failed to update expense. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-h-[calc(100vh-2rem)] !w-[calc(100vw-1rem)] sm:!w-auto overflow-hidden flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle>Edit Expense</DialogTitle>
          <DialogDescription>Update expense details</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1 min-h-0">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title *</Label>
            <Input
              id="edit-title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Screen repair"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-amount">Amount (₱) *</Label>
            <Input
              id="edit-amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-category">Category *</Label>
            <Select
              value={formData.category || undefined}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
              required
            >
              <SelectTrigger className="w-full" id="edit-category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="z-[100]">
                <SelectItem value="repair">Repair</SelectItem>
                <SelectItem value="parts">Parts</SelectItem>
                <SelectItem value="accessory">Accessory</SelectItem>
                <SelectItem value="shipping">Shipping</SelectItem>
                <SelectItem value="packaging">Packaging</SelectItem>
                <SelectItem value="tools">Tools</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="misc">Miscellaneous</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-date">Date *</Label>
            <Input
              id="edit-date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          {error && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Updating..." : "Update Expense"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

