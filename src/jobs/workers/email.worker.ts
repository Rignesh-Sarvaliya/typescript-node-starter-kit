import { Worker } from "bullmq";
import { createClient } from "redis";
import { sendMail } from "../../utils/sendMail";
import { userWelcomeEmail } from "../../templates/mail/userWelcomeEmail";

let connection: any = null;
let emailWorker: any = null;

if (process.env.NODE_ENV === "production") {
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
      console.log(`✅ Job ${job.id} completed`);
    });

    emailWorker.on("failed", (job, err) => {
      console.error(`❌ Job ${job?.id} failed:`, err.message);
    });
  } catch (error) {
    console.warn("⚠️ Redis not available for email worker");
  }
} else {
  console.info("ℹ️ Email worker disabled in development mode");
}

export { emailWorker };
