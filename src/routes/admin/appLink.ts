import { Router } from "express";
import { getAppLinksHandler } from "./appLink.controller";
import { requireAdminAuth } from "../../middlewares/authMiddleware";
import { logRoute } from "../../decorators/logRoute";
import {
  UpdateAppLinkBodySchema,
  UpdateAppLinkParamSchema,
} from "../../requests/admin/appLink.request";
import { updateAppLinkHandler } from "./appLink.controller";
import { validateRequest } from "../../middlewares/validateRequest";



const router = Router();

router.get(
  "/admin/app-links",
  logRoute("ADMIN_APP_LINKS"),
  requireAdminAuth,
  getAppLinksHandler
);
router.post(
  "/admin/app-links/:id/update",
  logRoute("APP_LINK_UPDATE"),
  requireAdminAuth,
  validateRequest({
    params: UpdateAppLinkParamSchema,
    body: UpdateAppLinkBodySchema,
  }),
  updateAppLinkHandler
);

export default router;
