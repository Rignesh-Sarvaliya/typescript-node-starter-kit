import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "@/config/swagger.config";

const router = Router();

router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default router;
