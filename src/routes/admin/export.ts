import { Router } from "express";
import { exportUsersHandler } from "./export.controller";
import { requireAdminAuth } from "../../middlewares/authMiddleware";
import { ExportUserParamSchema } from "../../requests/admin/export.request";
import validateRequest from "../../middlewares/validateRequest";
import { logRoute } from "../../decorators/logRoute";

const router = Router();

router.get(
  "/admin/export/users/:type",
  logRoute("ADMIN_EXPORT_USERS"),
  requireAdminAuth,
  validateRequest({ params: ExportUserParamSchema }),
  exportUsersHandler
);

export default router;
