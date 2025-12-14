"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Expense } from "@prisma/client";
import { deleteExpense } from "@/app/actions/expenses";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { EditExpenseDialog } from "./edit-expense-dialog";

export function ExpenseList({ expenses, userId }: { expenses: Expense[]; userId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this expense?")) return;
    setLoading(id);
    try {
      await deleteExpense(id, userId);
      router.refresh();
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert("Failed to delete expense. Please try again.");
    } finally {
      setLoading(null);
    }
  }

  if (expenses.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No expenses yet. Add your first expense!</p>
        </CardContent>
      </Card>
    );
  }

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{expense.category}</Badge>
                  </TableCell>
                  <TableCell>₱{expense.amount.toLocaleString()}</TableCell>
                  <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingExpense(expense)}
                        disabled={loading === expense.id}
                        title="Edit expense"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(expense.id)}
                        disabled={loading === expense.id}
                        title="Delete expense"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Total Expenses</span>
            <span className="text-2xl font-bold">₱{total.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>
      {editingExpense && (
        <EditExpenseDialog
          expense={editingExpense}
          userId={userId}
          open={!!editingExpense}
          onOpenChange={(open) => !open && setEditingExpense(null)}
        />
      )}
    </div>
  );
}

