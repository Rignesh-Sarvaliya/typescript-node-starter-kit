import { Router } from "express";
import { success } from "../utils/responseWrapper";
import { StatusCode } from "../constants/statusCodes";

const router = Router();

router.get("/", (req, res) => {
  res
    .status(StatusCode.OK)
    .json(
      success("Server is running", {
        uptime: process.uptime(),
        timestamp: Date.now(),
        version: process.env.npm_package_version,
      })
    );
});

export default router;
