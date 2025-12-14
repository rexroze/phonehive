import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { subDays } from "date-fns";

export async function GET(req: Request) {
  // Verify cron secret if needed
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const thirtyDaysAgo = subDays(new Date(), 30);

    // Find phones that are in stock and bought more than 30 days ago
    const agingPhones = await prisma.phone.findMany({
      where: {
        status: "IN_STOCK",
        dateBought: {
          lte: thirtyDaysAgo,
        },
      },
      include: {
        owner: true,
      },
    });

    // Create notifications for each aging phone
    for (const phone of agingPhones) {
      // Check if notification already exists
      const existing = await prisma.notification.findFirst({
        where: {
          ownerId: phone.ownerId,
          phoneId: phone.id,
          type: "aging_item",
          read: false,
        },
      });

      if (!existing) {
        await prisma.notification.create({
          data: {
            ownerId: phone.ownerId,
            type: "aging_item",
            message: `${phone.name} has been in stock for over 30 days. Consider lowering the price.`,
            phoneId: phone.id,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      notificationsCreated: agingPhones.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Cron job failed" },
      { status: 500 }
    );
  }
}

