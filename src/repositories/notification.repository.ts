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
