import { auth } from "@/lib/auth";
import { getNotifications, markAllNotificationsRead } from "@/app/actions/notifications";
import { NotificationList } from "@/components/notifications/notification-list";
import { Button } from "@/components/ui/button";

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const notifications = await getNotifications(session.user.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">View your alerts and updates</p>
        </div>
        <form action={markAllNotificationsRead.bind(null, session.user.id)}>
          <Button type="submit" variant="outline">
            Mark All Read
          </Button>
        </form>
      </div>
      <NotificationList notifications={notifications} />
    </div>
  );
}

