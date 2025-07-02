import { Queue } from "bullmq";

export const notificationQueue = new Queue("notification", {
  connection: {
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
  },
});

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
