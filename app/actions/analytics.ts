"use server";

import { prisma } from "@/lib/prisma";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

export async function getDashboardStats(userId: string) {
  const now = new Date();
  const sixMonthsAgo = subMonths(now, 6);

  // Get all phones
  const phones = await prisma.phone.findMany({
    where: { ownerId: userId },
  });

  // Get all expenses
  const expenses = await prisma.expense.findMany({
    where: { ownerId: userId },
  });

  // Calculate totals
  const totalInventoryValue = phones
    .filter((p) => p.status === "IN_STOCK")
    .reduce((sum, p) => sum + p.sellingPrice, 0);

  const totalRevenue = phones
    .filter((p) => p.status === "SOLD" && p.profit)
    .reduce((sum, p) => sum + (p.sellingPrice || 0), 0);

  const totalProfit = phones
    .filter((p) => p.status === "SOLD" && p.profit)
    .reduce((sum, p) => sum + (p.profit || 0), 0);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalProfit - totalExpenses;

  const activeInventoryCount = phones.filter(
    (p) => p.status === "IN_STOCK"
  ).length;

  // Monthly data for charts
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const monthStart = startOfMonth(subMonths(now, i));
    const monthEnd = endOfMonth(subMonths(now, i));

    const monthPhones = phones.filter((p) => {
      if (!p.dateSold) return false;
      const soldDate = new Date(p.dateSold);
      return soldDate >= monthStart && soldDate <= monthEnd;
    });

    const monthExpenses = expenses.filter((e) => {
      const expenseDate = new Date(e.date);
      return expenseDate >= monthStart && expenseDate <= monthEnd;
    });

    monthlyData.push({
      month: monthStart.toLocaleDateString("en-US", { month: "short" }),
      revenue: monthPhones.reduce((sum, p) => sum + (p.sellingPrice || 0), 0),
      profit: monthPhones.reduce((sum, p) => sum + (p.profit || 0), 0),
      itemsSold: monthPhones.length,
      expenses: monthExpenses.reduce((sum, e) => sum + e.amount, 0),
    });
  }

  return {
    totalInventoryValue,
    totalRevenue,
    totalProfit,
    totalExpenses,
    netProfit,
    activeInventoryCount,
    monthlyData,
  };
}

