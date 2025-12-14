"use server";

import {
  generateAICaption,
  generateAITags,
  suggestPrice,
  autoFillPhoneInfo,
} from "@/lib/gemini";
import { prisma } from "@/lib/prisma";
import { getCaptionTemplate } from "./settings";

async function checkAIAccess(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  
  if (!user || (user.role !== "PREMIUM" && user.role !== "ADMIN")) {
    throw new Error("AI Tools are only available for Premium and Admin users.");
  }
}

export async function generateCaption(
  userId: string,
  model: string,
  condition: string,
  storage?: string,
  variant?: string,
  ram?: string,
  template?: string
) {
  await checkAIAccess(userId);
  
  // Use provided template, or fallback to saved template from settings
  let templateToUse = template;
  if (!templateToUse) {
    const savedTemplate = await getCaptionTemplate(userId);
    templateToUse = savedTemplate || undefined;
  }
  return generateAICaption(model, condition, storage, variant, ram, templateToUse);
}

export async function generateTags(
  userId: string,
  model: string,
  storage?: string,
  variant?: string
) {
  await checkAIAccess(userId);
  return generateAITags(model, storage, variant);
}

export async function getPriceSuggestion(
  userId: string,
  model: string,
  storage: string,
  condition: string,
  marketplaceMin?: number,
  marketplaceMax?: number
) {
  await checkAIAccess(userId);
  
  // Get past sales for context
  const pastSales = await prisma.phone.findMany({
    where: {
      ownerId: userId,
      status: "SOLD",
      name: { contains: model, mode: "insensitive" },
    },
    select: {
      sellingPrice: true,
      condition: true,
    },
    take: 10,
  });

  const marketplaceRange = 
    marketplaceMin && marketplaceMax
      ? { min: marketplaceMin, max: marketplaceMax }
      : undefined;

  return suggestPrice(model, storage, condition, pastSales, marketplaceRange);
}

export async function getAutoFillInfo(userId: string, model: string) {
  await checkAIAccess(userId);
  return autoFillPhoneInfo(model);
}

