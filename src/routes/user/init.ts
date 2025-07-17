import { Router } from "express";
import { initApp } from "./init.controller";
import validateRequest from "@/middlewares/validateRequest";
import { InitAppRequestSchema } from "@/requests/user/init.request";

const router = Router();

router.get(
  "/init/:app_version/:app_type",
  validateRequest({ params: InitAppRequestSchema }),
  initApp
);

export default router;
