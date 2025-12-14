"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
    include: { phone: true },
  });
}

export async function markNotificationRead(id: string, userId: string) {
  const notification = await prisma.notification.findFirst({
    where: { id, ownerId: userId },
  });

  if (!notification) {
    throw new Error("Notification not found");
  }

  await prisma.notification.update({
    where: { id },
    data: { read: true },
  });

  revalidatePath("/notifications");
}

export async function markAllNotificationsRead(userId: string) {
  await prisma.notification.updateMany({
    where: { ownerId: userId, read: false },
    data: { read: true },
  });

  revalidatePath("/notifications");
}

export async function getUnreadCount(userId: string) {
  return prisma.notification.count({
    where: { ownerId: userId, read: false },
  });
}

