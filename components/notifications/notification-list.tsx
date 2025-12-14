"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Notification } from "@prisma/client";
import { markNotificationRead } from "@/app/actions/notifications";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export function NotificationList({
  notifications,
}: {
  notifications: (Notification & { phone: any })[];
}) {
  const router = useRouter();
  const { data: session } = useSession();

  async function handleMarkRead(id: string) {
    if (!session?.user?.id) return;
    try {
      await markNotificationRead(id, session.user.id);
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  }

  if (notifications.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No notifications</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {notifications.map((notif) => (
        <Card
          key={notif.id}
          className={!notif.read ? "border-primary" : ""}
          onClick={() => handleMarkRead(notif.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-medium">{notif.message}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(notif.createdAt).toLocaleString()}
                </p>
                {notif.phone && (
                  <Link
                    href={`/inventory/${notif.phoneId}`}
                    className="text-sm text-primary hover:underline"
                  >
                    View phone →
                  </Link>
                )}
              </div>
              {!notif.read && (
                <Badge variant="default" className="ml-2">
                  New
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

