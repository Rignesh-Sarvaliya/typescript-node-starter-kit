import { appEmitter, APP_EVENTS } from "../emitters/appEmitter";
import { sendMail } from "../../utils/sendMail";
import { userWelcomeEmail } from "../../templates/mail/userWelcomeEmail";
import { emailQueue } from "../../jobs/queues/email.queue";

appEmitter.on(APP_EVENTS.USER_REGISTERED, (payload) => {
  console.log("📩 New user registered:", payload.email);
  // Optionally send welcome email or track analytics
});


appEmitter.on(APP_EVENTS.USER_REGISTERED, async ({ email, otp }) => {
  await sendMail({
    to: email,
    subject: "Your Smartinbox OTP",
    html: `<p>Your OTP is: <b>${otp}</b></p>`,
  });
});


appEmitter.on(APP_EVENTS.USER_REGISTERED, async ({ name, email, otp }) => {
  const { subject, html } = userWelcomeEmail(name, otp);

  // await sendMail({ to: email, subject, html });
  await emailQueue.add(
    "sendWelcomeEmail",
    { email, name, otp },
    {
      attempts: 3, // retry max 3 times on failure
      backoff: {
        type: "exponential", // exponential delay
        delay: 1000, // 1 second → 2s → 4s
      },
      delay: 5000, // initial delay before first execution (optional)
    }
  );

});
