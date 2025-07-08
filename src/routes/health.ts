import { Router } from "express";
import { success } from "../utils/responseWrapper";

const router = Router();

router.get("/", (req, res) => {
  res
    .status(200)
    .json(
      success("Server is running", {
        uptime: process.uptime(),
        timestamp: Date.now(),
        version: process.env.npm_package_version,
      })
    );
});

export default router;
