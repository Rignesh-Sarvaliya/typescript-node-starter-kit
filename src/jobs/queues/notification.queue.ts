import { Queue } from "bullmq";
import { isProduction } from "../../config/env";
import { logger } from "../../utils/logger";

class MockQueue {
  async add() {
    logger.warn(
      "ℹ️ Notification queue is disabled in development. Job not queued."
    );
  }
}

export const notificationQueue =
  isProduction
    ? new Queue("notification", {
        connection: {
          host: process.env.REDIS_HOST || "localhost",
          port: Number(process.env.REDIS_PORT) || 6379,
          password: process.env.REDIS_PASSWORD || undefined,
        },
      })
    : (new MockQueue() as any);

// import { notificationQueue } from "../../jobs/queues/notification.queue";

// await notificationQueue.add(
//   "pushInApp",
//   {
//     userId: 101,
//     title: "Welcome!",
//     body: "Thanks for joining Smartinbox 🎉",
//   },
//   {
//     delay: 3000,
//     attempts: 2,
//   }
// );
