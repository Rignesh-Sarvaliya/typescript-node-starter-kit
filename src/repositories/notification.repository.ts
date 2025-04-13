import { PrismaClient } from "@prisma/client";
import { NotificationEntity } from "../domain/entities/notification.entity";

const prisma = new PrismaClient();

export const findUserNotifications = async (userId: number): Promise<NotificationEntity[]> => {
  const notifications = await prisma.notification.findMany({
    where: { user_id: userId },
    orderBy: { created_at: "desc" },
  });

  return notifications.map(
    (n) =>
      new NotificationEntity(n.id, n.user_id, n.title, n.message, n.read, n.created_at)
  );
};

export const updateUserNotificationStatus = async (
  userId: number,
  read: boolean
): Promise<number> => {
  const result = await prisma.notification.updateMany({
    where: { user_id: userId },
    data: { read },
  });

  return result.count;
};

export const deleteAllNotificationsForUser = async (userId: number): Promise<number> => {
  const result = await prisma.notification.deleteMany({
    where: { user_id: userId },
  });

  return result.count;
};
