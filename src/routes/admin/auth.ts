import { Router } from "express";
import { loginAdmin } from "./auth.controller";
import { AdminLoginRequestSchema } from "@/requests/admin/auth.request";
import validateRequest from "@/middlewares/validateRequest";
import { logRoute } from "@/decorators/logRoute";

const router = Router();

router.post(
  "/login",
  logRoute("ADMIN_LOGIN"),
  validateRequest({ body: AdminLoginRequestSchema }),
  loginAdmin
);

export default router;
