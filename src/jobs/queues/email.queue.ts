import { Queue } from "bullmq";

class MockQueue {
  async add() {
    console.warn(
      "ℹ️ Email queue is disabled in development. Job not queued."
    );
  }
}

export const emailQueue =
  process.env.NODE_ENV === "production"
    ? new Queue("email", {
        connection: {
          host: process.env.REDIS_HOST || "localhost",
          port: Number(process.env.REDIS_PORT) || 6379,
          password: process.env.REDIS_PASSWORD || undefined,
        },
      })
    : (new MockQueue() as any);
