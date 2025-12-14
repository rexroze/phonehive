"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const expenseSchema = z.object({
  title: z.string().min(1),
  amount: z.number().positive(),
  category: z.string().min(1),
  date: z.date(),
});

export async function createExpense(
  userId: string,
  data: z.infer<typeof expenseSchema>
) {
  const validated = expenseSchema.parse(data);

  const expense = await prisma.expense.create({
    data: {
      ...validated,
      ownerId: userId,
    },
  });

  revalidatePath("/expenses");
  revalidatePath("/dashboard");
  return expense;
}

export async function updateExpense(
  id: string,
  userId: string,
  data: Partial<z.infer<typeof expenseSchema>>
) {
  const existing = await prisma.expense.findFirst({
    where: { id, ownerId: userId },
  });

  if (!existing) {
    throw new Error("Expense not found");
  }

  // Validate the data if provided
  const updateData: any = {};
  if (data.title !== undefined) {
    updateData.title = expenseSchema.shape.title.parse(data.title);
  }
  if (data.amount !== undefined) {
    updateData.amount = expenseSchema.shape.amount.parse(data.amount);
  }
  if (data.category !== undefined) {
    updateData.category = expenseSchema.shape.category.parse(data.category);
  }
  if (data.date !== undefined) {
    updateData.date = expenseSchema.shape.date.parse(data.date);
  }

  const expense = await prisma.expense.update({
    where: { id },
    data: updateData,
  });

  revalidatePath("/expenses");
  revalidatePath("/dashboard");
  return expense;
}

export async function deleteExpense(id: string, userId: string) {
  const existing = await prisma.expense.findFirst({
    where: { id, ownerId: userId },
  });

  if (!existing) {
    throw new Error("Expense not found");
  }

  await prisma.expense.delete({ where: { id } });
  revalidatePath("/expenses");
  revalidatePath("/dashboard");
}

export async function getExpenses(userId: string, filters?: {
  category?: string;
  dateFrom?: Date;
  dateTo?: Date;
}) {
  const where: any = { ownerId: userId };

  if (filters?.category) {
    where.category = filters.category;
  }

  if (filters?.dateFrom || filters?.dateTo) {
    where.date = {};
    if (filters.dateFrom) where.date.gte = filters.dateFrom;
    if (filters.dateTo) where.date.lte = filters.dateTo;
  }

  return prisma.expense.findMany({
    where,
    orderBy: { date: "desc" },
  });
}

