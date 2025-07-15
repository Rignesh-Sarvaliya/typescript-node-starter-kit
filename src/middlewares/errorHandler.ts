import { Request, Response, NextFunction } from "express";
import { error } from "../utils/responseWrapper";
import { captureError } from "../telemetry/sentry"; // already used in your controllers
import { logger } from "../utils/logger";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error("🔥 Unhandled Error:", err);

  // Send to Sentry or monitoring
  captureError(err, req.originalUrl);

  const message = err.stack
    ? err.stack.split("\n").slice(0, 5).join("\n")
    : err.message;

  return res.status(500).json(error(message));
};
