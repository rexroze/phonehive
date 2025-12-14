"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState, useCallback } from "react";
import { getUnreadCount, getNotifications } from "@/app/actions/notifications";
import { useSession } from "next-auth/react";
import Link from "next/link";

export function NotificationBell() {
  const { data: session, status } = useSession();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const loadNotifications = useCallback(async () => {
    try {
      if (!session?.user?.id) return;
      const count = await getUnreadCount(session.user.id);
      const notifs = await getNotifications(session.user.id);
      setUnreadCount(count);
      setNotifications(notifs.slice(0, 5));
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (mounted && status === "authenticated" && session?.user?.id) {
      loadNotifications();
    }
  }, [mounted, status, session?.user?.id, loadNotifications]);

  if (!mounted || status === "loading" || !session) {
    return (
      <Button variant="ghost" size="icon" className="relative" disabled>
        <Bell className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-2">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            <Link href="/notifications" className="text-xs text-primary">
              View all
            </Link>
          </div>
          {notifications.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No notifications
            </p>
          ) : (
            <div className="space-y-2">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`rounded-lg border p-2 text-sm ${
                    !notif.read ? "bg-accent" : ""
                  }`}
                >
                  <p>{notif.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

