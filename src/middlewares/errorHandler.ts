import { Request, Response, NextFunction } from "express";
import { error } from "../utils/responseWrapper";
import { captureError } from "../telemetry/sentry"; // already used in your controllers

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("🔥 Unhandled Error:", err);

  // Send to Sentry or monitoring
  captureError(err, req.originalUrl);
  const status = err.statusCode || err.status || 500;

  if (status === 401) {
    return res.unauthorized(err.message || "Unauthorized");
  }

  if (status >= 500) {
    return res.fail("Internal server error. Please try again later.");
  }

  return res.status(status).json(error(err.message));
};
