import { Router } from "express";
import { getAppSettings } from "./appSetting.controller";
import { requireAdminAuth } from "../../middlewares/authMiddleware";
import validateRequest from "../../middlewares/validateRequest";
import { GetAppSettingsRequestSchema } from "../../requests/admin/appSetting.request";
import { logRoute } from "../../decorators/logRoute";
import { createAppSettingHandler } from "./appSetting.controller";
import { CreateAppSettingRequestSchema } from "../../requests/admin/appSetting.request";
import {
  UpdateAppSettingParamSchema,
  UpdateAppSettingRequestSchema,
} from "../../requests/admin/appSetting.request";
import { updateAppSettingHandler } from "./appSetting.controller";
import { DeleteAppSettingParamSchema } from "../../requests/admin/appSetting.request";
import { deleteAppSettingHandler } from "./appSetting.controller";



const router = Router();

router.get(
  "/admin/app-settings",
  logRoute("ADMIN_APP_SETTINGS"),
  requireAdminAuth,
  validateRequest({ query: GetAppSettingsRequestSchema }),
  getAppSettings
);
router.post(
  "/admin/app-settings",
  logRoute("APP_SETTING_CREATE"),
  requireAdminAuth,
  validateRequest({ body: CreateAppSettingRequestSchema }),
  createAppSettingHandler
);
router.post(
  "/admin/app-settings/:id/update",
  logRoute("APP_SETTING_UPDATE"),
  requireAdminAuth,
  validateRequest({
    params: UpdateAppSettingParamSchema,
    body: UpdateAppSettingRequestSchema,
  }),
  updateAppSettingHandler
);
router.delete(
  "/admin/app-settings/:id",
  logRoute("APP_SETTING_DELETE"),
  requireAdminAuth,
  validateRequest({ params: DeleteAppSettingParamSchema }),
  deleteAppSettingHandler
);

export default router;
