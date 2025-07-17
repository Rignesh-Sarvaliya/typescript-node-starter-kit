import { Router } from "express";
import initRoutes from "@/routes/user/init";
import authRoutes from "@/routes/user/auth";
import profileRoutes from "@/routes/user/profile";
import passwordRoutes from "@/routes/user/password";
import sessionRoutes from "@/routes/user/session";
import notificationRoutes from "@/routes/user/notification";

const router = Router();

router.use("/", initRoutes);
router.use("/", authRoutes);
router.use("/", profileRoutes);
router.use("/", passwordRoutes);
router.use("/", sessionRoutes);
router.use("/", notificationRoutes);

export default router;
