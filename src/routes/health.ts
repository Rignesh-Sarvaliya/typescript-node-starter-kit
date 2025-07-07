import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    message: "Server is running",
    uptime: process.uptime(),
    timestamp: Date.now(),
    version: process.env.npm_package_version,
  });
});

export default router;
