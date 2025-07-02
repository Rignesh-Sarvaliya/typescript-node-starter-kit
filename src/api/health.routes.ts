import { Router } from "express";
import healthRoutes from "../routes/health";

const router = Router();
router.use("/", healthRoutes);

export default router;
