import { auth } from "@/lib/auth";
import { getPhone } from "@/app/actions/phones";
import { notFound } from "next/navigation";
import { PhoneDetails } from "@/components/inventory/phone-details";

export default async function PhoneDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) return notFound();

  // Await params (Next.js 15+)
  const resolvedParams = await params;

  const phone = await getPhone(resolvedParams.id, session.user.id);
  if (!phone) return notFound();

  return <PhoneDetails phone={phone} />;
}

