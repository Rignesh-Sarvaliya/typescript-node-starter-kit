import { Router } from "express";
import { getProfile } from "@/routes/user/profile.controller";
import { requireUserAuth } from "@/middlewares/authMiddleware";
import { logRoute } from "@/decorators/logRoute";
import validateRequest from "@/middlewares/validateRequest";
import { UpdateProfileRequestSchema } from "@/resources/user/profile.request";
import { updateProfile } from "@/routes/user/profile.controller";

const router = Router();

router.get("/me", logRoute("USER_ME"), requireUserAuth, getProfile);
router.post(
  "/update",
  logRoute("USER_UPDATE"),
  requireUserAuth,
  validateRequest({ body: UpdateProfileRequestSchema }),
  updateProfile
);

export default router;
