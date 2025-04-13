import { Router } from "express";
import { changePassword } from "./password.controller";
import { requireUserAuth } from "../../middlewares/authMiddleware";
import validateRequest from "../../middlewares/validateRequest";
import { ChangePasswordRequestSchema } from "../../requests/user/password.request";
import { logRoute } from "../../decorators/logRoute";

const router = Router();

router.post(
  "/user/change/password",
  logRoute("CHANGE_PASSWORD"),
  requireUserAuth,
  validateRequest({ body: ChangePasswordRequestSchema }),
  changePassword
);

export default router;
