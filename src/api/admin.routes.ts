import { Router } from "express";
import authRoutes from "../routes/admin/auth";
import profileRoutes from "../routes/admin/profile";
import appSettingRoutes from "../routes/admin/appSetting";
import appLinkRoutes from "../routes/admin/appLink";
import appVariableRoutes from "../routes/admin/appVariable";
import userRoutes from "../routes/admin/user";
import exportRoutes from "../routes/admin/export";

const router = Router();

router.use("/auth", authRoutes);
router.use("/", profileRoutes);
router.use("/", appSettingRoutes);
router.use("/", appLinkRoutes);
router.use("/", appVariableRoutes);
router.use("/user", userRoutes);
router.use("/user", exportRoutes);



export default router;
