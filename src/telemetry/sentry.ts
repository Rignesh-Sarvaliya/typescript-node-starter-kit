import * as Sentry from "@sentry/node";

export const initSentry = () => {
  if (process.env.NODE_ENV !== "production") return;
  Sentry.init({
    dsn: process.env.SENTRY_DSN || "",
    tracesSampleRate: 1.0,
  });
};

export const captureError = (error: any, context?: string) => {
  console.error(`[ERROR] ${context}:`, error);
  Sentry.captureException(error);
};