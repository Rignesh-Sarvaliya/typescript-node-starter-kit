import { NotificationEntity } from "@/domain/entities/notification.entity";

export const formatNotification = (n: NotificationEntity) => ({
  id: n.id,
  title: n.title,
  message: n.message,
  read: n.read,
  created_at: n.created_at,
});

export const formatNotificationList = (list: NotificationEntity[]) =>
  list.map(formatNotification);
