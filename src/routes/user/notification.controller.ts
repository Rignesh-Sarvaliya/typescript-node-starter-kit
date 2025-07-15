import { Request, Response, NextFunction } from "express";
import { findUserNotifications } from "../../repositories/notification.repository";
import { formatNotificationList } from "../../resources/user/notification.resource";
import { captureError } from "../../telemetry/sentry";
import { NotificationStatusParamSchema } from "../../requests/user/notification.request";
import { updateUserNotificationStatus } from "../../repositories/notification.repository";
import { logNotificationStatusChange } from "../../jobs/notification.jobs";
import { deleteAllNotificationsForUser } from "../../repositories/notification.repository";
import { logNotificationClear } from "../../jobs/notification.jobs";
import { Messages } from "../../constants/messages";
import { success, error } from "../../utils/responseWrapper";

export const getNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const notifications = await findUserNotifications(userId);
    return res.json(success("Notifications fetched", formatNotificationList(notifications)));
  } catch (err) {
    captureError(err, "getNotifications");
    return next(err);
  }
};

export const changeNotificationStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status } = NotificationStatusParamSchema.parse(req.params);
    const userId = req.user!.id;

    const updatedCount = await updateUserNotificationStatus(
      userId,
      status === "read"
    );
    logNotificationStatusChange(userId, status, updatedCount);

    return res.json(success(`Marked ${updatedCount} as ${status}`));
  } catch (err) {
    captureError(err, "changeNotificationStatus");
    return next(err);
  }
};

export const clearAllNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;

    const deletedCount = await deleteAllNotificationsForUser(userId);

    logNotificationClear(userId, deletedCount);

    return res.json(
      success(Messages.clearNotifications, { deleted: deletedCount })
    );
  } catch (err) {
    captureError(err, "clearAllNotifications");
    return next(err);
  }
};
