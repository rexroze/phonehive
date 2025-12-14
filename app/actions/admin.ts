"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAllUsers(adminUserId: string) {
  // Verify admin access
  const admin = await prisma.user.findUnique({
    where: { id: adminUserId },
    select: { role: true },
  });

  if (!admin || admin.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          phones: true,
          expenses: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return users;
}

export async function updateUserRole(
  adminUserId: string,
  targetUserId: string,
  newRole: "FREE" | "PREMIUM" | "ADMIN"
) {
  // Verify admin access
  const admin = await prisma.user.findUnique({
    where: { id: adminUserId },
    select: { role: true },
  });

  if (!admin || admin.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }

  // Prevent changing own role (safety measure)
  if (adminUserId === targetUserId) {
    throw new Error("Cannot change your own role");
  }

  await prisma.user.update({
    where: { id: targetUserId },
    data: { role: newRole },
  });

  revalidatePath("/admin");
}

