import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { exportInventory, exportExpenses, exportSales } from "@/app/actions/export";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { type } = await params;
  
  if (typeof type !== "string") {
    return NextResponse.json({ error: "Invalid export type" }, { status: 400 });
  }

  try {
    let buffer: Buffer;
    switch (type) {
      case "inventory":
        buffer = await exportInventory(session.user.id);
        break;
      case "expenses":
        buffer = await exportExpenses(session.user.id);
        break;
      case "sales":
        buffer = await exportSales(session.user.id);
        break;
      default:
        return NextResponse.json({ error: "Invalid export type" }, { status: 400 });
    }

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${type}.xlsx"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Export failed" },
      { status: 500 }
    );
  }
}

