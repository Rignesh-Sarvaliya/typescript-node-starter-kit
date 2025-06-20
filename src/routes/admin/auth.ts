import { Router } from "express";
import { adminLogin } from "./auth.controller";
import { AdminLoginRequestSchema } from "../../requests/admin/auth.request";
import validateRequest from "../../middlewares/validateRequest";
import { logRoute } from "../../decorators/logRoute";

const router = Router();

router.post(
  "/admin/login",
  logRoute("ADMIN_LOGIN"),
  validateRequest({ body: AdminLoginRequestSchema }),
  adminLogin
);

export default router;
