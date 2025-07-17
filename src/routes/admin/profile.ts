import { Router } from "express";
import { getAdminProfile } from "@/routes/admin/profile.controller";
import { requireAdminAuth } from "@/middlewares/authMiddleware";
import { logRoute } from "@/decorators/logRoute";

const router = Router();

router.get("/me", logRoute("ADMIN_ME"), requireAdminAuth, getAdminProfile);

export default router;
