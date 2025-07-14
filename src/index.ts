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

async function bootstrap() {
  try {
    const server = await startServer();

    const shutdown = () => {
      logger.info("🛑 Shutting down server");
      server.close(() => {
        logger.info("✅ Server closed");
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

    process.on("unhandledRejection", (reason) => {
      logger.error("Unhandled Rejection:", reason);
    });
    process.on("uncaughtException", (err) => {
      logger.error("Uncaught Exception:", err);
    });
  } catch (err) {
    logger.error("Fatal error on startup:", err);
    process.exit(1);
  }
}

bootstrap();
