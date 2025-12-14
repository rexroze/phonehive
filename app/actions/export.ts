"use server";

import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

export async function exportInventory(userId: string) {
  const phones = await prisma.phone.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
  });

  const data = phones.map((phone) => ({
    Name: phone.name,
    Storage: phone.storage || "",
    Variant: phone.variant || "",
    Condition: phone.condition,
    "Bought Price": phone.boughtPrice,
    "Selling Price": phone.sellingPrice,
    Status: phone.status,
    "Date Bought": phone.dateBought.toLocaleDateString(),
    "Date Sold": phone.dateSold?.toLocaleDateString() || "",
    Profit: phone.profit || 0,
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Inventory");

  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  return buffer;
}

export async function exportExpenses(userId: string) {
  const expenses = await prisma.expense.findMany({
    where: { ownerId: userId },
    orderBy: { date: "desc" },
  });

  const data = expenses.map((expense) => ({
    Title: expense.title,
    Amount: expense.amount,
    Category: expense.category,
    Date: expense.date.toLocaleDateString(),
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Expenses");

  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  return buffer;
}

export async function exportSales(userId: string) {
  const phones = await prisma.phone.findMany({
    where: { ownerId: userId, status: "SOLD" },
    orderBy: { dateSold: "desc" },
  });

  const data = phones.map((phone) => ({
    Name: phone.name,
    Storage: phone.storage || "",
    Variant: phone.variant || "",
    Condition: phone.condition,
    "Bought Price": phone.boughtPrice,
    "Selling Price": phone.sellingPrice,
    "Date Bought": phone.dateBought.toLocaleDateString(),
    "Date Sold": phone.dateSold?.toLocaleDateString() || "",
    Profit: phone.profit || 0,
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sales");

  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  return buffer;
}

