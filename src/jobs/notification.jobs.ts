import { logger } from "../utils/logger";

export const logNotificationStatusChange = (
  userId: number,
  status: "read" | "unread",
  count: number
) => {
  logger.info(`[NOTIFICATION] User ${userId} marked ${count} as ${status}`);
};

export const logNotificationClear = (userId: number, count: number) => {
  logger.info(`[NOTIFICATION] Cleared ${count} notifications for user ${userId}`);
};
