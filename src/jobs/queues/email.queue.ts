import { Queue } from "bullmq";
import { isProduction } from "@/config/env";
import { logger } from "@/utils/logger";

class MockQueue {
  async add() {
    logger.warn(
      "ℹ️ Email queue is disabled in development. Job not queued."
    );
  }
}

export const emailQueue =
  isProduction
    ? new Queue("email", {
        connection: {
          host: process.env.REDIS_HOST || "localhost",
          port: Number(process.env.REDIS_PORT) || 6379,
          password: process.env.REDIS_PASSWORD || undefined,
        },
      })
    : (new MockQueue() as any);
