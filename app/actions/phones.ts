"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const phoneSchema = z.object({
  name: z.string().min(1),
  storage: z.string().optional(),
  variant: z.string().optional(),
  condition: z.string().min(1),
  description: z.string().optional(),
  boughtPrice: z.number().positive(),
  sellingPrice: z.number().positive(),
  dateBought: z.date(),
  images: z.array(z.string()),
});

export async function createPhone(
  userId: string,
  data: z.infer<typeof phoneSchema>
) {
  const validated = phoneSchema.parse(data);

  // Check free tier limit
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.role === "FREE") {
    const phoneCount = await prisma.phone.count({
      where: { ownerId: userId, status: "IN_STOCK" },
    });
    if (phoneCount >= 30) {
      throw new Error("Free tier limit: Maximum 30 phones in stock");
    }
  }

  const phone = await prisma.phone.create({
    data: {
      ...validated,
      ownerId: userId,
    },
  });

  revalidatePath("/inventory");
  return phone;
}

export async function updatePhone(
  id: string,
  userId: string,
  data: Partial<z.infer<typeof phoneSchema>>
) {
  // Verify ownership
  const existing = await prisma.phone.findFirst({
    where: { id, ownerId: userId },
  });

  if (!existing) {
    throw new Error("Phone not found");
  }

  // If phone is sold and selling price is being updated, recalculate profit
  const updateData: any = { ...data };
  if (existing.status === "SOLD" && data.sellingPrice !== undefined) {
    updateData.profit = data.sellingPrice - existing.boughtPrice;
  }

  const phone = await prisma.phone.update({
    where: { id },
    data: updateData,
  });

  revalidatePath("/inventory");
  revalidatePath(`/inventory/${id}`);
  revalidatePath("/dashboard");
  return phone;
}

export async function deletePhone(id: string, userId: string) {
  const existing = await prisma.phone.findFirst({
    where: { id, ownerId: userId },
  });

  if (!existing) {
    throw new Error("Phone not found");
  }

  await prisma.phone.delete({ where: { id } });
  revalidatePath("/inventory");
}

export async function markPhoneSold(
  id: string,
  userId: string,
  options?: {
    actualSoldPrice?: number;
    dateSold?: Date;
  }
) {
  const phone = await prisma.phone.findFirst({
    where: { id, ownerId: userId },
  });

  if (!phone) {
    throw new Error("Phone not found");
  }

  // Use actual sold price if provided, otherwise use the listed selling price
  const soldPrice = options?.actualSoldPrice ?? phone.sellingPrice;
  const profit = soldPrice - phone.boughtPrice;

  const updated = await prisma.phone.update({
    where: { id },
    data: {
      status: "SOLD",
      dateSold: options?.dateSold ?? new Date(),
      profit,
      // Update selling price to actual sold price if different
      ...(options?.actualSoldPrice && options.actualSoldPrice !== phone.sellingPrice
        ? { sellingPrice: options.actualSoldPrice }
        : {}),
    },
  });

  revalidatePath("/inventory");
  revalidatePath("/dashboard");
  return updated;
}

export async function getPhones(userId: string, filters?: {
  status?: string;
  search?: string;
  condition?: string;
  dateFrom?: Date;
  dateTo?: Date;
}) {
  const where: any = { ownerId: userId };

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.search) {
    where.name = { contains: filters.search, mode: "insensitive" };
  }

  if (filters?.condition) {
    where.condition = filters.condition;
  }

  if (filters?.dateFrom || filters?.dateTo) {
    where.dateBought = {};
    if (filters.dateFrom) where.dateBought.gte = filters.dateFrom;
    if (filters.dateTo) where.dateBought.lte = filters.dateTo;
  }

  return prisma.phone.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
}

export async function getPhone(id: string, userId: string) {
  return prisma.phone.findFirst({
    where: { id, ownerId: userId },
  });
}

