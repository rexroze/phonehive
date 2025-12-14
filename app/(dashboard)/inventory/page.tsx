import { auth } from "@/lib/auth";
import { getPhones } from "@/app/actions/phones";
import { PhoneList } from "@/components/inventory/phone-list";
import { AddPhoneDialog } from "@/components/inventory/add-phone-dialog";
import { InventoryFilters } from "@/components/inventory/inventory-filters";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth();
  if (!session?.user?.id) return null;

  // Await searchParams (Next.js 15+)
  const params = await searchParams;

  const filters = {
    status: typeof params.status === "string" && params.status !== "all" ? params.status : undefined,
    search: typeof params.search === "string" ? params.search : undefined,
    condition: typeof params.condition === "string" && params.condition !== "all" ? params.condition : undefined,
    dateFrom: params.dateFrom ? new Date(params.dateFrom as string) : undefined,
    dateTo: params.dateTo ? new Date(params.dateTo as string) : undefined,
  };

  const phones = await getPhones(session.user.id, filters);
  
  // Get user role and phone count for free users
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  
  let phoneCount = 0;
  let showLimit = false;
  if (user?.role === "FREE") {
    phoneCount = await prisma.phone.count({
      where: { ownerId: session.user.id, status: "IN_STOCK" },
    });
    showLimit = true;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Inventory</h1>
          <p className="text-muted-foreground">Manage your phone inventory</p>
          {showLimit && (
            <div className="mt-2">
              <Badge variant={phoneCount >= 30 ? "destructive" : "secondary"}>
                {phoneCount} / 30 phones in stock
              </Badge>
            </div>
          )}
        </div>
        <AddPhoneDialog />
      </div>

      <InventoryFilters />

      <PhoneList phones={phones} />
    </div>
  );
}

