import { Request, Response, NextFunction } from "express";
import { findUserNotifications } from "../../repositories/notification.repository";
import { formatNotificationList } from "../../resources/user/notification.resource";
import { asyncHandler } from "../../utils/asyncHandler";
import { NotificationStatusParamSchema } from "../../requests/user/notification.request";
import { updateUserNotificationStatus } from "../../repositories/notification.repository";
import { logNotificationStatusChange } from "../../jobs/notification.jobs";
import { deleteAllNotificationsForUser } from "../../repositories/notification.repository";
import { logNotificationClear } from "../../jobs/notification.jobs";
import { Messages } from "../../constants/messages";
import { success, error } from "../../utils/responseWrapper";

export const getNotifications = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const notifications = await findUserNotifications(userId);
    return res.json(success("Notifications fetched", formatNotificationList(notifications)));
  }
);

export const changeNotificationStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { status } = NotificationStatusParamSchema.parse(req.params);
    const userId = req.user!.id;

    const updatedCount = await updateUserNotificationStatus(
      userId,
      status === "read"
    );
    logNotificationStatusChange(userId, status, updatedCount);

    return res.json(success(`Marked ${updatedCount} as ${status}`));
  }
);

export const clearAllNotifications = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;

    const deletedCount = await deleteAllNotificationsForUser(userId);

    logNotificationClear(userId, deletedCount);

    return res.json(
      success(Messages.clearNotifications, { deleted: deletedCount })
    );
  }
);
