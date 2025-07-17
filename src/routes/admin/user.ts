import { Router } from "express";
import { getAllUsersHandler } from "./user.controller";
import { requireAdminAuth } from "@/middlewares/authMiddleware";
import { logRoute } from "@/decorators/logRoute";
import {
  UpdateUserParamSchema,
  UpdateUserBodySchema,
} from "@/requests/admin/user.request";
import { updateUserHandler } from "./user.controller";
import validateRequest from "@/middlewares/validateRequest";
import { ToggleUserParamSchema } from "@/requests/admin/user.request";
import { toggleUserStatusHandler } from "./user.controller";
import { DeleteUserParamSchema } from "@/requests/admin/user.request";
import { deleteUserHandler } from "./user.controller";

const router = Router();

router.get(
  "/users",
  logRoute("ADMIN_USER_LIST"),
  requireAdminAuth,
  getAllUsersHandler
);
router.post(
  "/users/:id/update",
  logRoute("ADMIN_USER_UPDATE"),
  requireAdminAuth,
  validateRequest({
    params: UpdateUserParamSchema,
    body: UpdateUserBodySchema,
  }),
  updateUserHandler
);
router.get(
  "/users/:id/toggle",
  logRoute("ADMIN_USER_TOGGLE"),
  requireAdminAuth,
  validateRequest({ params: ToggleUserParamSchema }),
  toggleUserStatusHandler
);

router.get(
  "/users/:id/delete",
  logRoute("ADMIN_USER_DELETE"),
  requireAdminAuth,
  validateRequest({ params: DeleteUserParamSchema }),
  deleteUserHandler
);

export default router;
