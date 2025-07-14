import * as Sentry from "@sentry/node";
import { isProduction } from "../config/env";

export const initSentry = () => {
  if (!isProduction) return;
  Sentry.init({
    dsn: process.env.SENTRY_DSN || "",
    tracesSampleRate: 1.0,
  });
};

export const captureError = (error: any, context?: string) => {
  console.error(`[ERROR] ${context}:`, error);
  Sentry.captureException(error);
};