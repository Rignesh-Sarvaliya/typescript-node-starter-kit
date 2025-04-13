import { Queue } from "bullmq";
import { createClient } from "redis";

const connection = createClient({ url: process.env.REDIS_URL });

export const emailQueue = new Queue("email", {
  connection,
});
