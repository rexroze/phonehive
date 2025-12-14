"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCaptionTemplate(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { captionTemplate: true },
  });
  return user?.captionTemplate || "";
}

export async function updateCaptionTemplate(userId: string, template: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { captionTemplate: template },
  });
  revalidatePath("/settings");
  revalidatePath("/ai-tools");
}



