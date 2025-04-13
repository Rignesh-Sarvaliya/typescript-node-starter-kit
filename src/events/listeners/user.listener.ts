import { appEmitter, APP_EVENTS } from "../emitters/appEmitter";
import { sendMail } from "../../utils/sendMail";
import { userWelcomeEmail } from "../../templates/mail/userWelcomeEmail";

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

  await sendMail({ to: email, subject, html });
});
