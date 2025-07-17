import * as Sentry from "@sentry/node";
import { isProduction } from "@/config/env";
import { logger } from "@/utils/logger";

export const initSentry = () => {
  if (!isProduction) return;
  Sentry.init({
    dsn: process.env.SENTRY_DSN || "",
    tracesSampleRate: 1.0,
  });
};

export const captureError = (error: any, context?: string) => {
  logger.error(`[ERROR] ${context}:`, error);
  Sentry.captureException(error);
};