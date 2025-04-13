import { Router } from "express";
import { getNotifications } from "./notification.controller";
import { requireUserAuth } from "../../middlewares/authMiddleware";
import { logRoute } from "../../decorators/logRoute";
import { changeNotificationStatus } from "./notification.controller";
import { validateRequestParams } from "../../middlewares/validateRequest"; // if you support param validation
import { clearAllNotifications } from "./notification.controller";

const router = Router();

router.get("/user/notifications", logRoute("USER_NOTIFICATIONS"), requireUserAuth, getNotifications);
router.get(
  "/user/notifications/status/change/:status",
  logRoute("NOTIF_STATUS_CHANGE"),
  requireUserAuth,
  validateRequest({ params: NotificationStatusParamSchema }),
  changeNotificationStatus
);

router.get(
  "/user/notifications/clear-all",
  logRoute("NOTIF_CLEAR_ALL"),
  requireUserAuth,
  clearAllNotifications
);



export default router;
