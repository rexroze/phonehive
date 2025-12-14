"use client";

import { Phone } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { deletePhone } from "@/app/actions/phones";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { EditPhoneDialog } from "./edit-phone-dialog";
import { MarkSoldDialog } from "./mark-sold-dialog";

export function PhoneDetails({ phone }: { phone: Phone }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);


  async function handleDelete() {
    if (!session?.user?.id) return;
    if (!confirm("Are you sure you want to delete this phone?")) return;
    setLoading(true);
    try {
      await deletePhone(phone.id, session.user.id);
      router.push("/inventory");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{phone.name}</h1>
          <p className="text-muted-foreground">
            {phone.storage && `${phone.storage} • `}
            {phone.variant && `${phone.variant} • `}
            {phone.condition}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/inventory">
            <Button variant="outline">Back</Button>
          </Link>
          {phone.status === "IN_STOCK" && (
            <>
              <EditPhoneDialog phone={phone} />
              <MarkSoldDialog phone={phone} />
            </>
          )}
          {phone.status === "SOLD" && <EditPhoneDialog phone={phone} />}
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent>
            {phone.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {phone.images.map((url, idx) => (
                  <div key={idx} className="relative h-48 w-full">
                    <Image
                      src={url}
                      alt={`${phone.name} ${idx + 1}`}
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No images</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={phone.status === "SOLD" ? "default" : "secondary"}>
                {phone.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bought Price</p>
              <p className="text-lg font-semibold">₱{phone.boughtPrice.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Selling Price</p>
              <p className="text-lg font-semibold">₱{phone.sellingPrice.toLocaleString()}</p>
            </div>
            {phone.profit && (
              <div>
                <p className="text-sm text-muted-foreground">Profit</p>
                <p className="text-lg font-semibold text-green-600">
                  ₱{phone.profit.toLocaleString()}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Date Bought</p>
              <p>{new Date(phone.dateBought).toLocaleDateString()}</p>
            </div>
            {phone.dateSold && (
              <div>
                <p className="text-sm text-muted-foreground">Date Sold</p>
                <p>{new Date(phone.dateSold).toLocaleDateString()}</p>
              </div>
            )}
            {phone.description && (
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p>{phone.description}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

