import "dotenv/config";
import "./types/express";
import "./config/env";
import { initSentry } from "./telemetry/sentry";
import { startServer } from "./server";
import { logger } from "./utils/logger";
import "./events/listeners/otpListener";

// Optional telemetry
// env.ts loads environment variables on import, nothing else to init
initSentry();

// Start express app
startServer().catch((err) => {
  logger.error("Fatal error on startup:", err);
  process.exit(1);
});
