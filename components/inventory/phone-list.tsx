"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Phone } from "@prisma/client";
import { MarkSoldDialog } from "./mark-sold-dialog";

export function PhoneList({ phones }: { phones: Phone[] }) {

  if (phones.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No phones found. Add your first phone!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {phones.map((phone) => (
        <Card key={phone.id}>
          <CardHeader>
            <div className="relative h-48 w-full overflow-hidden rounded-lg bg-muted">
              {phone.images.length > 0 ? (
                <Image
                  src={phone.images[0]}
                  alt={phone.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  No image
                </div>
              )}
            </div>
            <CardTitle className="mt-4">{phone.name}</CardTitle>
            <CardDescription>
              {phone.storage && `${phone.storage} • `}
              {phone.variant && `${phone.variant} • `}
              {phone.condition}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Bought</span>
                <span className="font-medium">₱{phone.boughtPrice.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Selling</span>
                <span className="font-medium">₱{phone.sellingPrice.toLocaleString()}</span>
              </div>
              {phone.profit && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Profit</span>
                  <span className="font-medium text-green-600">
                    ₱{phone.profit.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="pt-2">
                <Badge variant={phone.status === "SOLD" ? "default" : "secondary"}>
                  {phone.status}
                </Badge>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Link href={`/inventory/${phone.id}`} className="flex-1">
                <Button variant="outline" className="w-full">
                  View
                </Button>
              </Link>
              {phone.status === "IN_STOCK" && (
                <MarkSoldDialog
                  phone={phone}
                  trigger={
                    <Button variant="default" className="flex-1">
                      Mark Sold
                    </Button>
                  }
                />
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

