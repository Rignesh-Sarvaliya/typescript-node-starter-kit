import { Queue } from "bullmq";
import { createClient } from "redis";

const connection = createClient({ url: process.env.REDIS_URL });

export const notificationQueue = new Queue("notification", {
  connection,
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