import { Worker } from "bullmq";
import { createClient } from "redis";

const connection = createClient({ url: process.env.REDIS_URL });

export const notificationWorker = new Worker(
  "notification",
  async (job) => {
    if (job.name === "pushInApp") {
      const { userId, title, body } = job.data;
      console.log(`📲 Send notification to user#${userId}: ${title} - ${body}`);
      // TODO: call Notification.create() or Firebase push
    }
  },
  { connection }
);

notificationWorker.on("completed", (job) => {
  console.log(`✅ Notification job ${job.id} sent`);
});

notificationWorker.on("failed", (job, err) => {
  console.error(`❌ Notification job ${job?.id} failed:`, err.message);
});
