import { auth } from "@/lib/auth";
import { getPhone } from "@/app/actions/phones";
import { notFound } from "next/navigation";
import { PhoneDetails } from "@/components/inventory/phone-details";

export default async function PhoneDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const session = await auth();
  if (!session?.user?.id) return notFound();

  // Handle params as Promise (Next.js 15) or object (Next.js 14)
  const resolvedParams = params instanceof Promise ? await params : params;

  const phone = await getPhone(resolvedParams.id, session.user.id);
  if (!phone) return notFound();

  return <PhoneDetails phone={phone} />;
}

