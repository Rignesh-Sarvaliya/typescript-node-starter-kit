import { Router } from "express";
import { getAppVariablesHandler } from "./appVariable.controller";
import { requireAdminAuth } from "@/middlewares/authMiddleware";
import { logRoute } from "@/decorators/logRoute";
import { CreateAppVariableSchema } from "@/requests/admin/appVariable.request";
import { createAppVariableHandler } from "./appVariable.controller";
import validateRequest from "@/middlewares/validateRequest";
import {
  UpdateAppVariableParamSchema,
  UpdateAppVariableBodySchema,
} from "@/requests/admin/appVariable.request";
import { updateAppVariableHandler } from "./appVariable.controller";

const router = Router();

router.get(
  "/app-variables",
  logRoute("ADMIN_APP_VARIABLES"),
  requireAdminAuth,
  getAppVariablesHandler
);
router.post(
  "/app-variables/store",
  logRoute("APP_VARIABLE_CREATE"),
  requireAdminAuth,
  validateRequest({ body: CreateAppVariableSchema }),
  createAppVariableHandler
);
router.post(
  "/app-variables/:id/update",
  logRoute("APP_VARIABLE_UPDATE"),
  requireAdminAuth,
  validateRequest({
    params: UpdateAppVariableParamSchema,
    body: UpdateAppVariableBodySchema,
  }),
  updateAppVariableHandler
);

export default router;
