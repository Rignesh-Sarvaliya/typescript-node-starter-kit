import { Worker } from "bullmq";
import { createClient } from "redis";
import { sendMail } from "../../utils/sendMail";
import { userWelcomeEmail } from "../../templates/mail/userWelcomeEmail";
import { isProduction } from "../../config/env";
import { logger } from "../../utils/logger";

let connection: any = null;
let emailWorker: any = null;

if (isProduction) {
  try {
    connection = createClient({ url: process.env.REDIS_URL });
    emailWorker = new Worker(
      "email",
      async (job) => {
        if (job.name === "sendWelcomeEmail") {
          const { email, name, otp } = job.data;
          const { subject, html } = userWelcomeEmail(name, otp);

          await sendMail({ to: email, subject, html });
        }
      },
      { connection }
    );

    emailWorker.on("completed", (job) => {
      logger.info(`✅ Job ${job.id} completed`);
    });

    emailWorker.on("failed", (job, err) => {
      logger.error(`❌ Job ${job?.id} failed:`, err.message);
    });
  } catch (error) {
    logger.warn("⚠️ Redis not available for email worker");
  }
} else {
  logger.info("ℹ️ Email worker disabled in development mode");
}

export { emailWorker };
