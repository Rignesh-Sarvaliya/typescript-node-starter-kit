import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const updateUserNotificationStatus = async (
  userId: number,
  read: boolean
) => {
  const result = await prisma.notification.updateMany({
    where: { user_id: userId },
    data: { read },
  });
  return result.count;
};

export const deleteAllNotificationsForUser = async (userId: number) => {
  const result = await prisma.notification.deleteMany({
    where: { user_id: userId },
  });
  return result.count;
};
