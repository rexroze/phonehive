"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { markPhoneSold } from "@/app/actions/phones";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Phone } from "@prisma/client";

interface MarkSoldDialogProps {
  phone: Phone;
  trigger?: React.ReactNode;
}

export function MarkSoldDialog({ phone, trigger }: MarkSoldDialogProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actualSoldPrice, setActualSoldPrice] = useState(
    phone.sellingPrice.toString()
  );
  const [dateSold, setDateSold] = useState(
    new Date().toISOString().split("T")[0]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session?.user?.id) return;

    setLoading(true);
    try {
      await markPhoneSold(phone.id, session.user.id, {
        actualSoldPrice: parseFloat(actualSoldPrice),
        dateSold: new Date(dateSold),
      });
      setOpen(false);
      router.refresh();
    } catch (error: any) {
      alert(error.message || "Failed to mark phone as sold");
    } finally {
      setLoading(false);
    }
  }

  const priceDifference = parseFloat(actualSoldPrice) - phone.sellingPrice;
  const discount = priceDifference < 0 ? Math.abs(priceDifference) : 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button>Mark Sold</Button>
        </DialogTrigger>
      )}
      <DialogContent className="!w-[calc(100vw-1rem)] sm:!w-auto">
        <DialogHeader>
          <DialogTitle>Mark Phone as Sold</DialogTitle>
          <DialogDescription>
            Enter the actual sold price and date. This may differ from your
            listed price if you gave a discount.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="listedPrice">Listed Selling Price</Label>
            <Input
              id="listedPrice"
              type="number"
              value={phone.sellingPrice}
              disabled
              className="bg-muted"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="actualSoldPrice">Actual Sold Price (₱) *</Label>
            <Input
              id="actualSoldPrice"
              type="number"
              step="0.01"
              value={actualSoldPrice}
              onChange={(e) => setActualSoldPrice(e.target.value)}
              placeholder="Enter actual sold price"
              required
            />
            {discount > 0 && (
              <p className="text-sm text-orange-600">
                Discount given: ₱{discount.toLocaleString()}
              </p>
            )}
            {priceDifference > 0 && (
              <p className="text-sm text-green-600">
                Sold above listed price: +₱{priceDifference.toLocaleString()}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateSold">Date Sold *</Label>
            <Input
              id="dateSold"
              type="date"
              value={dateSold}
              onChange={(e) => setDateSold(e.target.value)}
              required
            />
          </div>
          <div className="pt-2 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Bought Price:</span>
              <span>₱{phone.boughtPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Profit:</span>
              <span className="font-semibold text-green-600">
                ₱
                {(
                  parseFloat(actualSoldPrice || "0") - phone.boughtPrice
                ).toLocaleString()}
              </span>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Marking as Sold..." : "Mark as Sold"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}



