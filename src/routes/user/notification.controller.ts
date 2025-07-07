import { Request, Response } from "express";
import { findUserNotifications } from "../../repositories/notification.repository";
import { formatNotificationList } from "../../resources/user/notification.resource";
import { captureError } from "../../telemetry/sentry";
import { NotificationStatusParamSchema } from "../../requests/user/notification.request";
import { updateUserNotificationStatus } from "../../repositories/notification.repository";
import { logNotificationStatusChange } from "../../jobs/notification.jobs";
import { deleteAllNotificationsForUser } from "../../repositories/notification.repository";
import { logNotificationClear } from "../../jobs/notification.jobs";
import { Messages } from "../../constants/messages";

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const notifications = await findUserNotifications(userId);
    return res.json({ notifications: formatNotificationList(notifications) });
  } catch (error) {
    captureError(error, "getNotifications");
    return res.status(500).json({ message: "Failed to load notifications" });
  }
};

export const changeNotificationStatus = async (req: Request, res: Response) => {
  try {
    const { status } = NotificationStatusParamSchema.parse(req.params);
    const userId = req.user!.id;

    const updatedCount = await updateUserNotificationStatus(
      userId,
      status === "read"
    );
    logNotificationStatusChange(userId, status, updatedCount);

    return res.json({ message: `Marked ${updatedCount} as ${status}` });
  } catch (error) {
    captureError(error, "changeNotificationStatus");
    return res
      .status(500)
      .json({ message: "Failed to update notification status" });
  }
};

export const clearAllNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const deletedCount = await deleteAllNotificationsForUser(userId);

    logNotificationClear(userId, deletedCount);

    return res.json({
      message: Messages.clearNotifications,
      deleted: deletedCount,
    });
  } catch (error) {
    captureError(error, "clearAllNotifications");
    return res.status(500).json({ message: "Failed to clear notifications" });
  }
};
